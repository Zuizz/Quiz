import React from "react";

export function Stumps({ wickets = 0, maxWickets = 3, size = "md" }) {
  const isLarge = size === "lg";
  const stumpHeight = isLarge ? "h-10 w-2.5" : "h-6 w-1.5";
  const stumpGap = isLarge ? "gap-2" : "gap-1.5";

  // wickets: number of wickets lost (0, 1, 2, 3)
  return (
    <div className="flex flex-col items-center">
      {/* Bails representation */}
      <div className="flex items-center gap-1 mb-0.5">
        <div className={`h-1 w-6 rounded-sm ${wickets >= 1 ? "bg-red-500 animate-pulse" : "bg-amber-400"}`} />
        <div className={`h-1 w-6 rounded-sm ${wickets >= 2 ? "bg-red-500 animate-pulse" : "bg-amber-400"}`} />
      </div>
      {/* 3 Stumps */}
      <div className={`flex items-end ${stumpGap}`}>
        {[0, 1, 2].map((idx) => {
          const isFallen = idx < wickets;
          return (
            <div
              key={idx}
              className={`transition-all duration-500 rounded-t-sm ${stumpHeight} ${
                isFallen
                  ? "bg-red-500 scale-90 opacity-75 shadow-sm shadow-red-500"
                  : "bg-amber-400 shadow-sm shadow-amber-300"
              }`}
              title={isFallen ? "Wicket Lost!" : "Wicket Standing"}
            />
          );
        })}
      </div>
      <span className="text-[10px] tracking-wider uppercase font-semibold text-gray-500 dark:text-gray-400 mt-1">
        {wickets >= maxWickets ? "ALL OUT" : `${maxWickets - wickets} Wickets Left`}
      </span>
    </div>
  );
}

