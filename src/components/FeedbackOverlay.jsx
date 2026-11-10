import React, { useEffect } from "react";
import confetti from "canvas-confetti";

export function FeedbackOverlay({ outcome }) {
  useEffect(() => {
    if (outcome === "SIX") {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
        colors: ["#10b981", "#fbbf24", "#3b82f6"]
      });
    } else if (outcome === "FOUR") {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#f59e0b", "#fbbf24", "#10b981"]
      });
    }
  }, [outcome]);

  if (!outcome) return null;

  const isSix = outcome === "SIX";
  const isFour = outcome === "FOUR";
  const isWicket = outcome === "WICKET";

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in px-4">
      <div
        className={`w-full max-w-sm p-6 sm:p-8 rounded-3xl shadow-2xl text-center border-4 transform transition-all ${
          isSix
            ? "bg-gradient-to-br from-emerald-500 via-green-600 to-teal-700 border-white text-white animate-pop shadow-emerald-500/50"
            : isFour
            ? "bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 border-white text-white animate-pop shadow-amber-500/50"
            : "bg-gradient-to-br from-red-600 via-rose-700 to-red-800 border-white text-white animate-shake shadow-red-500/50"
        }`}
      >
        <div className="text-6xl sm:text-7xl mb-2 filter drop-shadow">
          {isSix ? "🏏💥" : isFour ? "🏏💨" : "☝️🔴"}
        </div>
        <h1 className="text-5xl sm:text-6xl font-black tracking-widest drop-shadow-lg">
          {outcome}!
        </h1>
        <p className="text-lg sm:text-xl font-bold mt-2 uppercase tracking-wide opacity-95">
          {isSix
            ? "Massive Hit! +6 Runs"
            : isFour
            ? "Boundary Shot! +4 Runs"
            : "BOWLED HIM! Wicket Lost"}
        </p>
      </div>
    </div>
  );
}
