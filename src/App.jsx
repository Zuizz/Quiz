import React, { useState, useEffect } from "react";
import { HostView } from "./views/HostView";
import { StudentView } from "./views/StudentView";
import { subscribeToGameState, subscribeToPlayers } from "./realtimeSync";
import { calculateGameTimeline } from "./gameLogic";

export default function App() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("moonquiz_theme");
      if (saved) return saved;
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "light";
  });

  const [gameState, setGameState] = useState({ status: "idle", startAt: null });
  const [players, setPlayers] = useState({});
  const [now, setNow] = useState(Date.now());

  // Check URL query param for host secret
  const hostSecretEnv = import.meta.env.VITE_HOST_SECRET || "umpire2026";
  const urlParams = new URLSearchParams(window.location.search);
  const hostParam = urlParams.get("host");
  const isHost = Boolean(hostParam && hostParam === hostSecretEnv);

  // Sync theme to <html> tag
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("moonquiz_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // High-frequency clock tick (100ms) to ensure smooth timer bars and exact derivation from startAt
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Firebase Realtime Subscriptions (subscribes only once)
  useEffect(() => {
    const unsubState = subscribeToGameState((state) => {
      setGameState(state);
    });

    const unsubPlayers = subscribeToPlayers((allPlayers) => {
      setPlayers(allPlayers);
    });

    return () => {
      if (unsubState) unsubState();
      if (unsubPlayers) unsubPlayers();
    };
  }, []);

  // Calculate timeline from single shared startAt
  const timeline = calculateGameTimeline(
    gameState.status === "running" ? gameState.startAt : null,
    undefined,
    now
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 font-sans transition-colors duration-200">
      {isHost ? (
        <HostView
          gameState={gameState}
          timeline={timeline}
          players={players}
        />
      ) : (
        <StudentView
          gameState={gameState}
          timeline={timeline}
          players={players}
          theme={theme}
          toggleTheme={toggleTheme}
        />
      )}
    </div>
  );
}
