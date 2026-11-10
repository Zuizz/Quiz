import React from "react";

/**
 * FullScreenCricketStadium
 * 
 * Renders an immersive, full-screen 3D perspective cricket stadium game:
 * - Stadium sky, floodlights, cheering crowd stands, and boundary ropes.
 * - Perspective 22-yard turf pitch spanning from the horizon down to the foreground.
 * - Human fast bowler running in from far distance to deliver the ball.
 * - Delivery speeds down the pitch, bounces on the turf, and freezes right in MID-PITCH!
 * - Human batter at the crease with helmet, pads, and bat standing ready.
 * - Children content (the Question Card, Timer, and Answer Options) pop up DIRECTLY
 *   inside the stadium game overlay while the ball stays frozen!
 * - When 30s timer runs out: batter swings with SIX, FOUR, or WICKET bails-flying animation!
 */
export function FullScreenCricketStadium({ phase, timeRemaining, outcome = null, children }) {
  const isBowling = phase === "bowling";
  const isQuestion = phase === "question";
  const isReveal = phase === "reveal";

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden overflow-y-auto bg-[#477a1e] flex flex-col justify-between select-none">
      
      {/* 1. SKY & FLOODLIGHTS BACKGROUND */}
      <div className="absolute top-0 inset-x-0 h-44 bg-gradient-to-b from-[#1e3a8a] via-[#1d4ed8] to-[#60a5fa] pointer-events-none z-0">
        {/* Stadium Floodlights Left & Right */}
        <div className="absolute top-2 left-4 flex gap-1 opacity-90">
          <div className="w-1.5 h-10 bg-slate-300" />
          <div className="flex flex-col gap-0.5 -mt-1">
            <div className="flex gap-0.5">
              <div className="w-2.5 h-2.5 bg-yellow-100 rounded-full shadow-[0_0_8px_#fef08a]" />
              <div className="w-2.5 h-2.5 bg-yellow-100 rounded-full shadow-[0_0_8px_#fef08a]" />
            </div>
            <div className="flex gap-0.5">
              <div className="w-2.5 h-2.5 bg-yellow-100 rounded-full shadow-[0_0_8px_#fef08a]" />
              <div className="w-2.5 h-2.5 bg-yellow-100 rounded-full shadow-[0_0_8px_#fef08a]" />
            </div>
          </div>
        </div>

        <div className="absolute top-2 right-4 flex gap-1 opacity-90">
          <div className="flex flex-col gap-0.5 -mt-1">
            <div className="flex gap-0.5">
              <div className="w-2.5 h-2.5 bg-yellow-100 rounded-full shadow-[0_0_8px_#fef08a]" />
              <div className="w-2.5 h-2.5 bg-yellow-100 rounded-full shadow-[0_0_8px_#fef08a]" />
            </div>
            <div className="flex gap-0.5">
              <div className="w-2.5 h-2.5 bg-yellow-100 rounded-full shadow-[0_0_8px_#fef08a]" />
              <div className="w-2.5 h-2.5 bg-yellow-100 rounded-full shadow-[0_0_8px_#fef08a]" />
            </div>
          </div>
          <div className="w-1.5 h-10 bg-slate-300" />
        </div>

        {/* Stadium Grandstand Crowd Texture */}
        <div className="absolute bottom-0 inset-x-0 h-14 bg-gradient-to-t from-[#1e293b] via-[#334155] to-transparent flex items-end justify-center px-4 pb-1">
          <div className="w-full text-center text-[10px] font-black uppercase tracking-widest text-slate-300 opacity-75">
            🏟️ MOONQUIZ CRICKET ARENA • SOLD OUT CROWD
          </div>
        </div>
      </div>

      {/* 2. PERSPECTIVE PITCH & PLAYING FIELD LAYER (Absolute background canvas) */}
      <div className="absolute inset-0 top-32 z-0 pointer-events-none flex flex-col justify-end overflow-hidden">
        {/* Outfield Grass with Mowing Stripes */}
        <div className="absolute inset-0 bg-[#4d8621] bg-[repeating-linear-gradient(90deg,transparent,transparent_30px,rgba(255,255,255,0.06)_30px,rgba(255,255,255,0.06)_60px)]" />

        {/* Boundary Rope */}
        <div className="absolute top-4 inset-x-8 h-1 bg-white/70 rounded-full shadow" />

        {/* Distant Human Fielders */}
        <div className="absolute top-6 left-12 flex flex-col items-center">
          <svg width="24" height="32" viewBox="0 0 24 32">
            <circle cx="12" cy="7" r="4" fill="#fbcfe8" />
            <circle cx="12" cy="6" r="4.5" fill="#1e3a8a" />
            <path d="M7 12 L17 12 L15 22 L9 22 Z" fill="#2563eb" />
            <line x1="9" y1="22" x2="8" y2="30" stroke="#f1f5f9" strokeWidth="2.5" />
            <line x1="15" y1="22" x2="16" y2="30" stroke="#f1f5f9" strokeWidth="2.5" />
          </svg>
        </div>

        <div className="absolute top-6 right-12 flex flex-col items-center">
          <svg width="24" height="32" viewBox="0 0 24 32">
            <circle cx="12" cy="7" r="4" fill="#fbcfe8" />
            <circle cx="12" cy="6" r="4.5" fill="#1e3a8a" />
            <path d="M7 12 L17 12 L15 22 L9 22 Z" fill="#2563eb" />
            <line x1="9" y1="22" x2="8" y2="30" stroke="#f1f5f9" strokeWidth="2.5" />
            <line x1="15" y1="22" x2="16" y2="30" stroke="#f1f5f9" strokeWidth="2.5" />
          </svg>
        </div>

        {/* 22-Yard Turf Pitch (Tapered 3D Trapezoid) */}
        <div 
          className="relative mx-auto h-[550px] w-full max-w-lg flex flex-col justify-between pb-8"
          style={{
            clipPath: "polygon(34% 0%, 66% 0%, 94% 100%, 6% 100%)",
            background: "linear-gradient(180deg, #c7ad87 0%, #d8be98 45%, #bca073 100%)",
          }}
        >
          {/* Far bowling crease line */}
          <div className="w-full pt-4 px-12">
            <div className="w-full h-1 bg-white/70" />
          </div>

          {/* Foreground popping crease */}
          <div className="w-full pb-10 px-6">
            <div className="w-full h-2 bg-white/90 shadow-sm" />
          </div>
        </div>

        {/* Bowler End: Human Fast Bowler & Non-striker */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 flex items-end gap-3 z-10">
          <div className="scale-75 -translate-y-1 opacity-90">
            <svg width="28" height="42" viewBox="0 0 30 45">
              <circle cx="15" cy="8" r="5" fill="#ffd1a4" />
              <circle cx="15" cy="7" r="5.5" fill="#047857" />
              <path d="M9 14 L21 14 L19 28 L11 28 Z" fill="#059669" />
              <rect x="10" y="28" width="4" height="14" fill="#ffffff" />
              <rect x="16" y="28" width="4" height="14" fill="#ffffff" />
              <rect x="22" y="16" width="3" height="18" fill="#e2e8f0" transform="rotate(15 22 16)" />
            </svg>
          </div>

          {/* Far Stumps */}
          <div className="flex items-end gap-0.5 pb-0.5 scale-75">
            <div className="w-1 h-5 bg-[#6d461f]" />
            <div className="w-1 h-5 bg-[#6d461f]" />
            <div className="w-1 h-5 bg-[#6d461f]" />
          </div>

          {/* Human Fast Bowler running in */}
          <div className={`transition-transform duration-300 ${isBowling ? "animate-bounce" : ""}`}>
            <svg width="36" height="50" viewBox="0 0 36 50">
              <circle cx="18" cy="9" r="5" fill="#fbcfe8" />
              <path d="M12 7 Q18 2 24 7" stroke="#1f2937" strokeWidth="3" fill="#1f2937" />
              <path d="M11 15 L25 15 L22 30 L14 30 Z" fill="#dc2626" />
              <line x1="14" y1="30" x2="11" y2="45" stroke="#f8fafc" strokeWidth="3.5" strokeLinecap="round" />
              <line x1="22" y1="30" x2="25" y2="45" stroke="#f8fafc" strokeWidth="3.5" strokeLinecap="round" />
              <path d={isBowling ? "M23 16 L31 6 L33 4" : "M23 16 L28 10"} stroke="#fbcfe8" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Foreground Wickets */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
          <div className={`flex gap-1 -mb-1 ${isReveal && outcome === "WICKET" ? "animate-shake opacity-0" : ""}`}>
            <div className="w-6 h-1.5 bg-[#835628] rounded-sm shadow-sm" />
            <div className="w-6 h-1.5 bg-[#835628] rounded-sm shadow-sm" />
          </div>
          <div className={`flex items-end gap-2.5 ${isReveal && outcome === "WICKET" ? "animate-shake text-red-500 scale-105" : ""}`}>
            <div className="w-3 h-16 bg-[#6d461f] border border-[#452b11] rounded-t-sm shadow-md" />
            <div className="w-3 h-16 bg-[#6d461f] border border-[#452b11] rounded-t-sm shadow-md" />
            <div className="w-3 h-16 bg-[#784e24] border border-[#452b11] rounded-t-sm shadow-md" />
          </div>
        </div>

        {/* Foreground Human Batter */}
        <div className="absolute bottom-10 left-[12%] sm:left-[22%] z-25">
          <div className={`relative transition-transform duration-300 ${isReveal && (outcome === "SIX" || outcome === "FOUR") ? "translate-x-2 -translate-y-3 scale-105" : ""}`}>
            <svg width="135" height="155" viewBox="0 0 120 140">
              <ellipse cx="64" cy="40" rx="16" ry="15" fill="#1e40af" />
              <path d="M52 44 L76 44 L74 52 L54 52 Z" fill="#0f172a" opacity="0.8" />
              <circle cx="64" cy="46" r="8" fill="#fed7aa" />
              <circle cx="67" cy="45" r="2" fill="#0f172a" />
              <path d="M50 56 L78 56 L74 88 L54 88 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
              <path d="M58 56 L64 64 L70 56" fill="#1e40af" />
              <rect x="52" y="88" width="10" height="42" rx="4" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.5" />
              <rect x="66" y="88" width="10" height="42" rx="4" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.5" />
              <g className={isReveal && (outcome === "SIX" || outcome === "FOUR") ? "animate-pulse" : ""}>
                <rect 
                  x="8" 
                  y="52" 
                  width="50" 
                  height="10" 
                  rx="3" 
                  fill="#d97706" 
                  stroke="#78350f" 
                  strokeWidth="1.5" 
                  transform={isReveal && (outcome === "SIX" || outcome === "FOUR") ? "rotate(-10 8 52)" : "rotate(-32 8 52)"} 
                  className="drop-shadow-lg"
                />
                <line x1="45" y1="70" x2="55" y2="76" stroke="#ffffff" strokeWidth="3.5" />
                <circle cx="48" cy="72" r="5" fill="#f8fafc" stroke="#1e40af" strokeWidth="1.5" />
              </g>
            </svg>
          </div>
        </div>

        {/* 3. CRICKET BALL DELIVERY & FROZEN BALL IN MID-PITCH */}
        <div className="absolute inset-0 z-30 pointer-events-none">
          {/* Bowling delivery phase (3.5s) */}
          {isBowling && (
            <div className="absolute left-1/2 -translate-x-1/2 animate-human-bowling">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-red-500 via-rose-600 to-red-800 border-2 border-white shadow-xl animate-spin flex items-center justify-center">
                <div className="w-full h-0.5 bg-white/80 rotate-45" />
              </div>
            </div>
          )}

          {/* Frozen Ball in MID-PITCH as Question Pops Up (30s) */}
          {isQuestion && (
            <div className="absolute left-1/2 -translate-x-1/2 top-[48%] z-40 animate-pulse-glow flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 via-rose-600 to-red-950 border-2 border-white shadow-2xl flex items-center justify-center animate-spin">
                <div className="w-full h-1 bg-white/90 rotate-45" />
              </div>
              <div className="w-12 h-2.5 bg-black/40 rounded-full blur-[2px] mt-1" />
              <span className="text-[10px] font-black tracking-widest uppercase bg-amber-400 text-amber-950 px-2.5 py-0.5 rounded-full mt-1 border-2 border-white shadow-lg">
                🔴 DELIVERY FROZEN IN MID-PITCH
              </span>
            </div>
          )}

          {/* Over Outcome Animation (5s reveal) */}
          {isReveal && (
            <div className="absolute inset-0 flex items-center justify-center">
              {outcome === "SIX" && (
                <div className="absolute animate-ball-six flex flex-col items-center">
                  <div className="text-5xl animate-bounce">🏏💥🚀</div>
                  <div className="w-12 h-12 rounded-full bg-red-600 border-2 border-white shadow-2xl flex items-center justify-center text-white text-sm font-black">
                    6
                  </div>
                </div>
              )}
              {outcome === "FOUR" && (
                <div className="absolute animate-ball-four flex flex-col items-center">
                  <div className="text-4xl animate-pulse">⚡🏏💨</div>
                  <div className="w-10 h-10 rounded-full bg-amber-500 border-2 border-white shadow-xl flex items-center justify-center text-white text-xs font-black">
                    4
                  </div>
                </div>
              )}
              {outcome === "WICKET" && (
                <div className="absolute bottom-16 left-1/2 -translate-x-1/2 animate-shake flex flex-col items-center">
                  <div className="text-5xl animate-bounce">🔴🪵💥</div>
                  <span className="bg-red-600 text-white font-black text-sm px-4 py-1.5 rounded-full uppercase tracking-widest shadow-2xl border-2 border-white">
                    BOWLED HIM! WICKET!
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 4. GAME OVERLAY / IN-GAME UI POPUP (Question, Options & Timer rendered directly over the match) */}
      <div className="relative z-50 w-full flex-1 flex flex-col justify-between pointer-events-auto p-4 sm:p-6 max-w-lg mx-auto">
        {children}
      </div>
    </div>
  );
}
