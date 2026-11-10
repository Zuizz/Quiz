import React from "react";
import { Trophy, Award } from "lucide-react";
import { sortLeaderboard } from "../gameLogic";

export function Leaderboard({ players = {}, limit = 10, highlightPlayerId = null, title = "Scorecard" }) {
  const sorted = sortLeaderboard(players);

  return (
    <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur rounded-2xl p-4 shadow-lg border border-emerald-500/20 w-full max-w-md mx-auto">
      <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-zinc-800 mb-3">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          <h3 className="font-bold text-gray-900 dark:text-white tracking-wide">{title}</h3>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
          {sorted.length} {sorted.length === 1 ? "player" : "players"}
        </span>
      </div>

      {sorted.length === 0 ? (
        <div className="text-center py-6 text-sm text-gray-500 dark:text-gray-400 italic">
          No players in the pavilion yet.
        </div>
      ) : (
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {sorted.slice(0, limit).map((player, index) => {
            const isMe = player.id === highlightPlayerId;
            const rank = index + 1;
            const isOut = (Number(player.wickets) || 0) >= 3;

            return (
              <div
                key={player.id || index}
                className={`flex items-center justify-between p-2.5 rounded-xl transition-all ${
                  isMe
                    ? "bg-emerald-500/15 border-2 border-emerald-500 shadow-sm"
                    : "bg-gray-50 dark:bg-zinc-800/60 border border-gray-100 dark:border-zinc-800"
                }`}
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center font-bold text-xs rounded-full bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-gray-300">
                    {rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : rank}
                  </div>
                  <div className="truncate">
                    <span className="font-semibold text-sm text-gray-900 dark:text-white block truncate">
                      {player.name} {isMe && "(You)"}
                    </span>
                    {isOut && (
                      <span className="text-[10px] font-bold uppercase text-red-500 dark:text-red-400">
                        OUT
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 font-mono font-bold text-base">
                  <span className="text-emerald-600 dark:text-emerald-400">{player.score || 0}</span>
                  <span className="text-gray-400">/</span>
                  <span className={isOut ? "text-red-500" : "text-amber-500"}>
                    {player.wickets || 0}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

