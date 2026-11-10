import React from "react";

export function TimerBar({ timeRemaining, totalDuration = 30000, isReveal = false }) {
  const secondsLeft = Math.ceil(timeRemaining / 1000);
  const percentage = Math.min(100, Math.max(0, (timeRemaining / totalDuration) * 100));

  // In cricket scoring:
  // First 20s = 30s down to 10s remaining (SIX zone)
  // Last 10s = 10s down to 0s remaining (FOUR zone)
  const isSixZone = !isReveal && secondsLeft > 10;
  const isUrgent = !isReveal && secondsLeft <= 5;

  let barColor = "bg-emerald-500";
  if (isReveal) {
    barColor = "bg-purple-500";
  } else if (isUrgent) {
    barColor = "bg-red-500 animate-pulse";
  } else if (!isSixZone) {
    barColor = "bg-amber-500";
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-1.5">
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider">
        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
          {isReveal ? (
            <span className="text-purple-600 dark:text-purple-400 font-bold">Over Break / Next Ball</span>
          ) : isSixZone ? (
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">⚡ SIX ZONE (+6 runs)</span>
          ) : (
            <span className="text-amber-500 font-bold">⚠️ FOUR ZONE (+4 runs)</span>
          )}
        </span>
        <span
          className={`font-mono text-xl font-black ${
            isUrgent ? "text-red-500 animate-bounce" : "text-gray-900 dark:text-white"
          }`}
        >
          {secondsLeft}s
        </span>
      </div>

      {/* Progress track */}
      <div className="w-full bg-gray-200 dark:bg-zinc-800 rounded-full h-3 overflow-hidden shadow-inner p-0.5">
        <div
          className={`h-full rounded-full transition-all duration-150 ease-linear ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

