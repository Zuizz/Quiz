import React from "react";

/**
 * CricketPitchAnimation
 * 
 * Visually renders a 22-yard cricket pitch with:
 * - Green turf grass with mowing stripes
 * - Dirt pitch strip with bowling crease & popping crease
 * - Bowler bowling the delivery
 * - Ball traveling down the pitch with spin & dust trail
 * - Ball pausing right in front of the batter as the question is faced!
 * - When an answer is revealed: animated shot into the stands (SIX), along the ground (FOUR), or stumps rattled (WICKET).
 */
export function CricketPitchAnimation({ phase, timeRemaining, outcome = null }) {
  const isQuestionPhase = phase === "question";
  const isGetReady = phase === "get_ready";
  const isReveal = phase === "reveal";

  return (
    <div className="w-full max-w-md mx-auto my-2 rounded-2xl overflow-hidden shadow-2xl border-2 border-emerald-600/40 bg-gradient-to-b from-emerald-800 via-emerald-700 to-emerald-900 relative p-3 select-none">
      {/* Stadium grass stripes pattern */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[repeating-linear-gradient(90deg,transparent,transparent_20px,rgba(255,255,255,0.08)_20px,rgba(255,255,255,0.08)_40px)]" />

      {/* The 22-yard turf pitch */}
      <div className="relative mx-auto w-3/4 sm:w-2/3 h-28 bg-gradient-to-b from-[#c2a679] via-[#d7ba88] to-[#bfa06d] rounded-lg border-x-4 border-amber-900/30 shadow-inner flex flex-col justify-between p-2 overflow-hidden">
        
        {/* Bowler End (Top Crease) */}
        <div className="w-full flex items-center justify-between border-b-2 border-white/80 pb-0.5 relative">
          {/* Bowling crease marks */}
          <div className="w-2 h-0.5 bg-white/90" />
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-950/70">
              Bowler's End
            </span>
            <span className="text-base animate-pulse">🏃‍♂️💨</span>
          </div>
          <div className="w-2 h-0.5 bg-white/90" />
        </div>

        {/* Pitch center markings & ball action area */}
        <div className="relative flex-1 w-full flex items-center justify-center">
          {/* Pitch center worn-turf patch */}
          <div className="w-16 h-8 bg-amber-800/10 rounded-full blur-[1px]" />

          {/* THE CRICKET BALL ANIMATION */}
          {isGetReady && (
            <div className="flex flex-col items-center animate-bounce">
              <span className="text-xs font-black text-amber-950 uppercase tracking-widest bg-amber-200/80 px-2 py-0.5 rounded-full">
                Bowler Running In...
              </span>
            </div>
          )}

          {isQuestionPhase && (
            <div className="absolute inset-x-0 top-0 bottom-0 flex flex-col items-center justify-between pointer-events-none">
              {/* Ball trajectory delivery animation (travels and freezes at crease) */}
              <div className="w-full h-full relative">
                <div className="absolute left-1/2 -translate-x-1/2 animate-ball-delivery flex flex-col items-center">
                  {/* Seam / Spin shadow */}
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-red-600 via-rose-600 to-red-900 border-2 border-white shadow-lg flex items-center justify-center text-xs text-white/90 font-mono shadow-red-900/60 animate-spin">
                    🏏
                  </div>
                  {/* Dust puff under ball */}
                  <span className="text-[9px] font-bold text-amber-950/80 tracking-tighter uppercase mt-0.5 bg-white/40 px-1 rounded">
                    BALL IN PLAY!
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Reveal Outcome Animation */}
          {isReveal && (
            <div className="absolute inset-0 flex items-center justify-center animate-pop">
              {outcome === "SIX" && (
                <div className="text-center">
                  <div className="text-3xl animate-bounce">🚀💥</div>
                  <span className="text-xs font-black text-emerald-900 bg-emerald-300 px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                    Over The Ropes! 6 Runs!
                  </span>
                </div>
              )}
              {outcome === "FOUR" && (
                <div className="text-center">
                  <div className="text-3xl animate-pulse">⚡🏏</div>
                  <span className="text-xs font-black text-amber-950 bg-amber-300 px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                    Races To Boundary! 4 Runs!
                  </span>
                </div>
              )}
              {outcome === "WICKET" && (
                <div className="text-center">
                  <div className="text-3xl animate-shake">🪵💥🔴</div>
                  <span className="text-xs font-black text-white bg-red-600 px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                    Stumps Shattered! Wicket!
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Striker Batter End (Bottom Crease) */}
        <div className="w-full flex items-center justify-between border-t-2 border-white/90 pt-0.5 relative">
          <div className="w-2 h-0.5 bg-white/90" />
          <div className="flex items-center gap-1.5">
            <span className="text-base">🏏</span>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-950">
              Popping Crease (You on Strike)
            </span>
            <div className="flex gap-0.5">
              <div className="w-1 h-3 bg-amber-400 rounded-sm" />
              <div className="w-1 h-3 bg-amber-400 rounded-sm" />
              <div className="w-1 h-3 bg-amber-400 rounded-sm" />
            </div>
          </div>
          <div className="w-2 h-0.5 bg-white/90" />
        </div>
      </div>

      {/* Field status banner */}
      <div className="mt-1.5 flex items-center justify-between text-[11px] font-bold text-emerald-200 uppercase tracking-wider px-1">
        <span>🏟️ Pitch: Hard & Fast</span>
        <span>
          {isQuestionPhase ? "🔴 Delivery Paused — Choose Your Shot!" : isGetReady ? "🏃 Bowler at top of mark" : "📊 Result Signalled"}
        </span>
      </div>
    </div>
  );
}
