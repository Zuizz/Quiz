import { supabase, isSupabaseConfigured } from "./supabase";

// Fallback in-memory / BroadcastChannel bus for testing without Supabase or single-browser testing
const broadcastChannel = typeof window !== "undefined" && "BroadcastChannel" in window 
  ? new BroadcastChannel("moonquiz_sim_bus") 
  : null;

let localSimState = {
  gameState: { status: "idle", startAt: null, resetAt: 0 },
  players: {}
};

// Load saved local test state if available
if (typeof window !== "undefined") {
  try {
    const savedGame = localStorage.getItem("moonquiz_sim_gamestate");
    if (savedGame) localSimState.gameState = JSON.parse(savedGame);
    const savedPlayers = localStorage.getItem("moonquiz_sim_players");
    if (savedPlayers) localSimState.players = JSON.parse(savedPlayers);
  } catch (e) {
    console.warn("Could not load sim state:", e);
  }
}

/**
 * Subscribes to game state. Uses Supabase Realtime postgres_changes on table game_state,
 * or BroadcastChannel/localStorage fallback for instant offline testing.
 */
export function subscribeToGameState(callback) {
  if (isSupabaseConfigured && supabase) {
    // 1. Initial fetch from game_state
    supabase
      .from("game_state")
      .select("*")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!error && data) {
          callback({
            status: data.status || "idle",
            startAt: data.start_at ? Number(data.start_at) : null,
            resetAt: data.reset_at ? Number(data.reset_at) : 0,
          });
        }
      });

    // 2. Realtime listener
    const channel = supabase
      .channel("game_state_channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "game_state" },
        (payload) => {
          const row = payload.new || {};
          callback({
            status: row.status || "idle",
            startAt: row.start_at ? Number(row.start_at) : null,
            resetAt: row.reset_at ? Number(row.reset_at) : 0,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } else {
    // Local / BroadcastChannel sync
    callback(localSimState.gameState);
    const handler = (event) => {
      if (event.data?.type === "GAME_STATE_UPDATE") {
        localSimState.gameState = event.data.payload;
        callback(event.data.payload);
      }
    };
    if (broadcastChannel) broadcastChannel.addEventListener("message", handler);
    return () => {
      if (broadcastChannel) broadcastChannel.removeEventListener("message", handler);
    };
  }
}

/**
 * Subscribes to all players. Uses Supabase Realtime postgres_changes on table players.
 */
export function subscribeToPlayers(callback) {
  if (isSupabaseConfigured && supabase) {
    // Helper to fetch and format players map
    const fetchAllPlayers = async () => {
      const { data, error } = await supabase.from("players").select("*");
      if (!error && data) {
        const playerMap = {};
        data.forEach((p) => {
          playerMap[p.id] = {
            id: p.id,
            name: p.name,
            score: p.score,
            wickets: p.wickets,
            joinedQ: p.joined_q,
            answers: p.answers || {},
          };
        });
        callback(playerMap);
      }
    };

    // 1. Initial fetch
    fetchAllPlayers();

    // 2. Realtime listener
    const channel = supabase
      .channel("players_channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "players" },
        () => {
          fetchAllPlayers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } else {
    callback(localSimState.players);
    const handler = (event) => {
      if (event.data?.type === "PLAYERS_UPDATE") {
        localSimState.players = event.data.payload;
        callback(event.data.payload);
      }
    };
    if (broadcastChannel) broadcastChannel.addEventListener("message", handler);
    return () => {
      if (broadcastChannel) broadcastChannel.removeEventListener("message", handler);
    };
  }
}

/**
 * Host updates the game state in Supabase.
 */
export async function updateGameState(newState) {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase
      .from("game_state")
      .upsert({
        id: 1,
        status: newState.status,
        start_at: newState.startAt,
        reset_at: newState.resetAt || 0,
        updated_at: new Date().toISOString(),
      });
    if (error) console.error("Error updating game_state in Supabase:", error);
  } else {
    localSimState.gameState = newState;
    localStorage.setItem("moonquiz_sim_gamestate", JSON.stringify(newState));
    if (broadcastChannel) {
      broadcastChannel.postMessage({ type: "GAME_STATE_UPDATE", payload: newState });
    }
  }
}

/**
 * Host resets the game: idle state and wipes all players in Supabase.
 */
export async function resetGame() {
  const timestamp = Date.now();
  const idleState = { status: "idle", startAt: null, resetAt: timestamp };

  if (isSupabaseConfigured && supabase) {
    try {
      // 1. Set game state back to idle
      await supabase
        .from("game_state")
        .upsert({
          id: 1,
          status: "idle",
          start_at: null,
          reset_at: timestamp,
          updated_at: new Date().toISOString(),
        });

      // 2. Clear players table
      await supabase
        .from("players")
        .delete()
        .neq("id", "___dummy___");
    } catch (err) {
      console.error("Failed to reset game in Supabase:", err);
    }
  } else {
    localSimState.gameState = idleState;
    localSimState.players = {};
    localStorage.setItem("moonquiz_sim_gamestate", JSON.stringify(idleState));
    localStorage.removeItem("moonquiz_sim_players");
    if (broadcastChannel) {
      broadcastChannel.postMessage({ type: "GAME_STATE_UPDATE", payload: idleState });
      broadcastChannel.postMessage({ type: "PLAYERS_UPDATE", payload: {} });
    }
  }
}

/**
 * Student registers or syncs their player record in Supabase.
 */
export async function syncPlayerRecord(playerId, playerData) {
  if (!playerId) return;

  if (isSupabaseConfigured && supabase) {
    try {
      const payload = {
        id: playerId,
        updated_at: new Date().toISOString(),
      };
      if (playerData.name !== undefined) payload.name = playerData.name;
      if (playerData.score !== undefined) payload.score = playerData.score;
      if (playerData.wickets !== undefined) payload.wickets = playerData.wickets;
      if (playerData.joinedQ !== undefined) payload.joined_q = playerData.joinedQ;
      if (playerData.answers !== undefined) payload.answers = playerData.answers;

      const { error } = await supabase.from("players").upsert(payload);
      if (error) console.error(`Error updating player ${playerId} in Supabase:`, error);
    } catch (err) {
      console.error(`Failed to update player ${playerId}:`, err);
    }
  } else {
    localSimState.players[playerId] = {
      ...(localSimState.players[playerId] || {}),
      ...playerData,
    };
    localStorage.setItem("moonquiz_sim_players", JSON.stringify(localSimState.players));
    if (broadcastChannel) {
      broadcastChannel.postMessage({ type: "PLAYERS_UPDATE", payload: localSimState.players });
    }
  }
}
