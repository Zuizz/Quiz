import React from "react";

/**
 * HumanCricketPitch
 * 
 * Features:
 * 1. Perspective cricket ground with realistic grass, turf wicket strip, creases, and human fielders.
 * 2. Human bowler running up from far crease and releasing the ball during the "bowling" phase.
 * 3. Ball speeds down the pitch, bounces, and freezes EXACTLY in mid-pitch when the question appears!
 * 4. Human batter with bat, helmet, and pads standing ready by the wooden stumps.
 * 5. When the 30-second timer runs out (reveal phase):
 *    - SIX: Batter connects with a lofted cover drive, ball rockets high into the stadium!
 *    - FOUR: Batter smashes a cracking boundary, ball speeds past mid-off!
 *    - WICKET: Delivery knocks the stumps down, bails fly off with red wicket flash!
 */
export function HumanCricketPitch({ phase, timeRemaining, outcome = null }) {
  const isBowling = phase === "bowling";
  const isQuestion = phase === "question";
  const isReveal = phase === "reveal";

  return (
    <div className="relative w-full h-[300px] sm:h-[350px] overflow-hidden rounded-3xl shadow-2xl border-4 border-[#356317] bg-[#538a25] select-none flex flex-col justify-end">
      
      {/* 1. Outfield Horizon & Human Fielders in the distance */}
      <div className="absolute top-0 inset-x-0 h-16 bg-[#477a1e] flex items-center justify-between px-6 border-b border-[#3b6818]">
        {/* Human Deep Fielder Left */}
        <div className="flex flex-col items-center">
          <svg width="22" height="30" viewBox="0 0 24 32">
            <circle cx="12" cy="7" r="4" fill="#fbcfe8" />
            <circle cx="12" cy="6" r="4.5" fill="#1e3a8a" /> {/* Blue cap */}
            <path d="M7 12 L17 12 L15 22 L9 22 Z" fill="#2563eb" /> {/* Jersey */}
            <line x1="9" y1="22" x2="8" y2="30" stroke="#f1f5f9" strokeWidth="2.5" />
            <line x1="15" y1="22" x2="16" y2="30" stroke="#f1f5f9" strokeWidth="2.5" />
          </svg>
          <span className="text-[8px] font-bold text-white/80 uppercase">Deep Point</span>
        </div>

        {/* Boundary Rope Marker */}
        <div className="flex items-center gap-1.5 opacity-80">
          <div className="h-1 w-12 bg-white rounded-full" />
          <span className="text-[10px] font-black text-amber-300">🏏 STADIUM</span>
          <div className="h-1 w-12 bg-white rounded-full" />
        </div>

        {/* Human Deep Fielder Right */}
        <div className="flex flex-col items-center">
          <svg width="22" height="30" viewBox="0 0 24 32">
            <circle cx="12" cy="7" r="4" fill="#fbcfe8" />
            <circle cx="12" cy="6" r="4.5" fill="#1e3a8a" />
            <path d="M7 12 L17 12 L15 22 L9 22 Z" fill="#2563eb" />
            <line x1="9" y1="22" x2="8" y2="30" stroke="#f1f5f9" strokeWidth="2.5" />
            <line x1="15" y1="22" x2="16" y2="30" stroke="#f1f5f9" strokeWidth="2.5" />
          </svg>
          <span className="text-[8px] font-bold text-white/80 uppercase">Mid Wicket</span>
        </div>
      </div>

      {/* 2. 22-Yard Turf Pitch (Perspective Trapezoid) */}
      <div 
        className="relative mx-auto h-[245px] sm:h-[290px] w-full max-w-md flex flex-col justify-between"
        style={{
          clipPath: "polygon(32% 0%, 68% 0%, 94% 100%, 6% 100%)",
          background: "linear-gradient(180deg, #cbb08b 0%, #d8be98 45%, #bda072 100%)",
        }}
      >
        {/* Bowler crease line */}
        <div className="w-full pt-3 px-8">
          <div className="w-full h-1 bg-white/70" />
        </div>

        {/* Mid-pitch bounce zone marker */}
        <div className="mx-auto w-24 h-6 bg-amber-900/10 rounded-full blur-[1px]" />

        {/* Batter popping crease line */}
        <div className="w-full pb-6 px-4">
          <div className="w-full h-1.5 bg-white/90" />
        </div>
      </div>

      {/* 3. Bowler End: Human Fast Bowler & Non-striker */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 flex items-end gap-3 z-10 pointer-events-none">
        {/* Non-striker human batter */}
        <div className="scale-75 -translate-y-1 opacity-90">
          <svg width="28" height="42" viewBox="0 0 30 45">
            <circle cx="15" cy="8" r="5" fill="#ffd1a4" />
            <circle cx="15" cy="7" r="5.5" fill="#047857" /> {/* Green helmet */}
            <path d="M9 14 L21 14 L19 28 L11 28 Z" fill="#059669" />
            <rect x="10" y="28" width="4" height="14" fill="#ffffff" /> {/* Pads */}
            <rect x="16" y="28" width="4" height="14" fill="#ffffff" />
            <rect x="22" y="16" width="3" height="18" fill="#e2e8f0" transform="rotate(15 22 16)" /> {/* Bat */}
          </svg>
        </div>

        {/* Bowler Wickets */}
        <div className="flex items-end gap-0.5 pb-0.5 scale-75">
          <div className="w-1 h-5 bg-[#6d461f]" />
          <div className="w-1 h-5 bg-[#6d461f]" />
          <div className="w-1 h-5 bg-[#6d461f]" />
        </div>

        {/* Human Fast Bowler running up */}
        <div className="flex flex-col items-center">
          <div className={`transition-transform duration-300 ${isBowling ? "animate-bounce" : ""}`}>
            <svg width="34" height="48" viewBox="0 0 36 50">
              <circle cx="18" cy="9" r="5" fill="#fbcfe8" />
              <path d="M12 7 Q18 2 24 7" stroke="#1f2937" strokeWidth="3" fill="#1f2937" /> {/* Hair */}
              {/* Bowling jersey */}
              <path d="M11 15 L25 15 L22 30 L14 30 Z" fill="#dc2626" />
              {/* White trousers */}
              <line x1="14" y1="30" x2="11" y2="45" stroke="#f8fafc" strokeWidth="3.5" strokeLinecap="round" />
              <line x1="22" y1="30" x2="25" y2="45" stroke="#f8fafc" strokeWidth="3.5" strokeLinecap="round" />
              {/* Raised arm bowling the ball */}
              <path 
                d={isBowling ? "M23 16 L31 6 L33 4" : "M23 16 L28 10"} 
                stroke="#fbcfe8" 
                strokeWidth="3" 
                strokeLinecap="round" 
              />
            </svg>
          </div>
        </div>
      </div>

      {/* 4. Foreground Wickets (Wood Stumps & Bails) */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center">
        {/* Bails */}
        <div className={`flex gap-1 -mb-1 ${isReveal && outcome === "WICKET" ? "animate-shake opacity-0" : ""}`}>
          <div className="w-5 h-1.5 bg-[#835628] rounded-sm shadow-sm" />
          <div className="w-5 h-1.5 bg-[#835628] rounded-sm shadow-sm" />
        </div>
        {/* 3 Stumps */}
        <div className={`flex items-end gap-2 ${isReveal && outcome === "WICKET" ? "animate-shake text-red-500 scale-105" : ""}`}>
          <div className="w-2.5 h-15 bg-[#6d461f] border border-[#452b11] rounded-t-sm shadow-md" />
          <div className="w-2.5 h-15 bg-[#6d461f] border border-[#452b11] rounded-t-sm shadow-md" />
          <div className="w-2.5 h-15 bg-[#784e24] border border-[#452b11] rounded-t-sm shadow-md" />
        </div>
      </div>

      {/* 5. Foreground Human Batter (Real Player with Helmet, Gloves & Bat) */}
      <div className="absolute bottom-12 left-[15%] sm:left-[22%] z-25 pointer-events-none">
        <div className={`relative transition-transform duration-300 ${isReveal && (outcome === "SIX" || outcome === "FOUR") ? "translate-x-1 -translate-y-2 scale-105" : ""}`}>
          <svg width="125" height="145" viewBox="0 0 120 140">
            {/* White/Blue Cricket Helmet with Grill */}
            <ellipse cx="64" cy="40" rx="16" ry="15" fill="#1e40af" />
            <path d="M52 44 L76 44 L74 52 L54 52 Z" fill="#0f172a" opacity="0.8" /> {/* Visor grill */}
            <circle cx="64" cy="46" r="8" fill="#fed7aa" /> {/* Face skin */}
            <circle cx="67" cy="45" r="2" fill="#0f172a" /> {/* Focused eye */}

            {/* Batter White Jersey */}
            <path d="M50 56 L78 56 L74 88 L54 88 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
            {/* Team Collar */}
            <path d="M58 56 L64 64 L70 56" fill="#1e40af" />

            {/* Cricket Batting Pads (White protective leg guards) */}
            <rect x="52" y="88" width="10" height="42" rx="4" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="52" y1="102" x2="62" y2="102" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="52" y1="116" x2="62" y2="116" stroke="#94a3b8" strokeWidth="1.5" />

            <rect x="66" y="88" width="10" height="42" rx="4" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="66" y1="102" x2="76" y2="102" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="66" y1="116" x2="76" y2="116" stroke="#94a3b8" strokeWidth="1.5" />

            {/* Cricket Bat & Batting Gloves */}
            <g className={isReveal && (outcome === "SIX" || outcome === "FOUR") ? "animate-pulse origin-bottom-right" : ""}>
              {/* Willow Cricket Bat */}
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
              {/* Bat handle rubber grip */}
              <line x1="45" y1="70" x2="55" y2="76" stroke="#ffffff" strokeWidth="3.5" />
              {/* Batting Gloves */}
              <circle cx="48" cy="72" r="5" fill="#f8fafc" stroke="#1e40af" strokeWidth="1.5" />
            </g>
          </svg>
        </div>
      </div>

      {/* 6. CRICKET BALL ANIMATION */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        
        {/* Phase A: Bowler bowling the delivery (3.5s) */}
        {isBowling && (
          <div className="absolute left-1/2 -translate-x-1/2 animate-human-bowling">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-red-500 via-rose-600 to-red-800 border-2 border-white shadow-lg animate-spin flex items-center justify-center">
              <div className="w-full h-0.5 bg-white/80 rotate-45" />
            </div>
          </div>
        )}

        {/* Phase B: Ball FROZEN in MID-PITCH as question appears (30s) */}
        {isQuestion && (
          <div className="absolute left-1/2 -translate-x-1/2 top-[50%] z-40 animate-pulse-glow flex flex-col items-center">
            {/* Red leather seam ball paused in mid-air */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-500 via-rose-600 to-red-900 border-2 border-white shadow-2xl shadow-red-950 flex items-center justify-center animate-spin">
              <div className="w-full h-1 bg-white/90 rotate-45" />
            </div>
            {/* Shadow on the pitch right beneath the paused ball */}
            <div className="w-10 h-2 bg-black/40 rounded-full blur-[2px] mt-1" />
            <span className="text-[9px] font-black tracking-widest uppercase bg-amber-400 text-amber-950 px-2 py-0.5 rounded-full mt-1 border border-white shadow">
              PAUSED IN MID-PITCH
            </span>
          </div>
        )}

        {/* Phase C: Over Outcome Shot Animation (5s reveal) */}
        {isReveal && (
          <div className="absolute inset-0 flex items-center justify-center">
            {outcome === "SIX" && (
              <div className="absolute animate-ball-six flex flex-col items-center">
                <div className="text-4xl animate-bounce">🏏💥🚀</div>
                <div className="w-10 h-10 rounded-full bg-red-600 border-2 border-white shadow-2xl flex items-center justify-center text-white text-xs font-black">
                  6
                </div>
              </div>
            )}
            {outcome === "FOUR" && (
              <div className="absolute animate-ball-four flex flex-col items-center">
                <div className="text-3xl animate-pulse">⚡🏏💨</div>
                <div className="w-8 h-8 rounded-full bg-amber-500 border-2 border-white shadow-xl flex items-center justify-center text-white text-xs font-black">
                  4
                </div>
              </div>
            )}
            {outcome === "WICKET" && (
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-shake flex flex-col items-center">
                <div className="text-4xl animate-bounce">🔴🪵💥</div>
                <span className="bg-red-600 text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-widest shadow-xl">
                  OUT! BOWLED!
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 7. Live Action Banner */}
      <div className="absolute top-2 left-2 z-40 bg-black/50 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/20 text-white text-[11px] font-black tracking-wider uppercase flex items-center gap-2">
        <span className={`w-2.5 h-2.5 rounded-full ${isBowling ? "bg-amber-400 animate-ping" : isQuestion ? "bg-red-500 animate-pulse" : "bg-emerald-400"}`} />
        <span>
          {isBowling
            ? "🏃 Bowler Delivery Coming In..."
            : isQuestion
            ? "⏸️ Ball Frozen In Mid-Pitch — Select Shot!"
            : outcome
            ? `⚡ ${outcome}!`
            : "📊 Over Break"}
        </span>
      </div>
    </div>
  );
}
