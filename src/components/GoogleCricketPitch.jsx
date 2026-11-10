import React from "react";

/**
 * GoogleCricketPitch
 * 
 * Implements the iconic Google Doodle Cricket perspective:
 * - Lush lime green field with boundary markers and snail fielders in the background
 * - Perspective tan pitch running from far distance down to the foreground
 * - Bowler snail holding the red cricket ball at the far crease with wickets
 * - Cricket batter standing by the wooden stumps in the foreground holding the bat ready
 * - Animated red ball bowling down the pitch, bouncing, and freezing right in front of the batter!
 * - When answered/revealed: batter swings the bat and hits a SIX/FOUR or the bails go flying for a WICKET!
 */
export function GoogleCricketPitch({ isBowling, isFrozen, outcome = null }) {
  return (
    <div className="relative w-full h-[280px] sm:h-[340px] overflow-hidden rounded-3xl shadow-2xl border-4 border-[#5a8b29] bg-[#81b241] select-none flex flex-col justify-end">
      
      {/* 1. Outfield Horizon & Distant Snail Fielders (Google Doodle Style) */}
      <div className="absolute top-0 inset-x-0 h-16 bg-[#73a335] flex items-center justify-between px-6 border-b border-[#63902b]/60">
        {/* Snail fielder left */}
        <div className="flex items-center gap-1 opacity-90 animate-bounce">
          <div className="text-xl">🐌</div>
        </div>

        {/* Boundary rope line */}
        <div className="h-0.5 w-1/3 bg-white/70 rounded-full" />

        {/* Snail fielder right */}
        <div className="flex items-center gap-1 opacity-90 animate-bounce delay-150">
          <div className="text-xl">🐌</div>
        </div>
      </div>

      {/* 2. Perspective Cricket Pitch Strip (Trapzoid wide in front, narrow in back) */}
      <div 
        className="relative mx-auto h-[230px] sm:h-[280px] w-full max-w-md flex flex-col justify-between"
        style={{
          clipPath: "polygon(34% 0%, 66% 0%, 92% 100%, 8% 100%)",
          background: "linear-gradient(180deg, #d3b78f 0%, #d8be98 45%, #c8aa7e 100%)",
        }}
      >
        {/* Pitch crease lines (Distant bowler crease) */}
        <div className="w-full pt-3 px-8">
          <div className="w-full h-1 bg-white/70 rounded-sm" />
        </div>

        {/* Pitch crease lines (Foreground popping crease) */}
        <div className="w-full pb-6 px-4">
          <div className="w-full h-1.5 bg-white/80 rounded-sm" />
          <div className="flex justify-between px-2 pt-1">
            <div className="w-1 h-8 bg-white/80" />
            <div className="w-1 h-8 bg-white/80" />
          </div>
        </div>
      </div>

      {/* 3. Bowler End (Distant Snail Bowler + Non-Striker Cricket + Far Stumps) */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 flex items-end gap-2.5 z-10 pointer-events-none">
        {/* Non-striker cricket standing watching */}
        <div className="scale-75 -translate-y-1">
          <svg width="34" height="45" viewBox="0 0 40 50">
            {/* Cricket antennas */}
            <path d="M16 10 Q10 0 6 2 M24 10 Q30 0 34 2" stroke="#48751e" strokeWidth="2" fill="none" strokeLinecap="round" />
            {/* Head */}
            <ellipse cx="20" cy="18" rx="11" ry="9" fill="#8bc34a" />
            {/* Eyes */}
            <ellipse cx="16" cy="16" rx="4" ry="5" fill="white" />
            <circle cx="16" cy="16" r="2.5" fill="#2d4212" />
            <ellipse cx="24" cy="16" rx="4" ry="5" fill="white" />
            <circle cx="24" cy="16" r="2.5" fill="#2d4212" />
            {/* Body */}
            <path d="M15 27 L25 27 L22 42 L18 42 Z" fill="#7cb342" />
            {/* Small bat */}
            <rect x="25" y="24" width="3" height="15" rx="1.5" fill="#fff" transform="rotate(15 25 24)" />
          </svg>
        </div>

        {/* Far Wooden Stumps */}
        <div className="flex items-end gap-0.5 pb-0.5 scale-75">
          <div className="w-1 h-5 bg-[#8d6232] rounded-t-sm" />
          <div className="w-1 h-5 bg-[#8d6232] rounded-t-sm" />
          <div className="w-1 h-5 bg-[#8d6232] rounded-t-sm" />
        </div>

        {/* Bowler Snail with ball raised */}
        <div className="relative">
          <div className="flex flex-col items-center">
            {/* Snail shell & head */}
            <div className="w-9 h-7 rounded-t-full bg-[#b88554] border border-[#8a5d33] flex items-center justify-center relative">
              <div className="absolute -top-3 left-1 flex gap-2">
                <div className="w-1 h-3 bg-[#b88554] rounded-full flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full bg-black -mt-1" />
                </div>
                <div className="w-1 h-3 bg-[#b88554] rounded-full flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full bg-black -mt-1" />
                </div>
              </div>
            </div>
            {/* Raised bowling arm holding red ball */}
            <div className={`absolute -top-3 -right-2 ${isBowling ? "animate-pulse" : ""}`}>
              <div className="w-3.5 h-3.5 rounded-full bg-red-600 border border-white shadow-sm flex items-center justify-center text-[8px] text-white font-bold" />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Foreground Stumps (Rustic wooden design exactly like Google Doodle) */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center">
        {/* Bails */}
        <div className={`flex gap-1 -mb-1 ${outcome === "WICKET" ? "animate-shake opacity-0" : ""}`}>
          <div className="w-5 h-1.5 bg-[#835628] rounded-sm shadow-sm" />
          <div className="w-5 h-1.5 bg-[#835628] rounded-sm shadow-sm" />
        </div>
        {/* 3 Stumps with wooden texture */}
        <div className={`flex items-end gap-2 ${outcome === "WICKET" ? "animate-shake text-red-500" : ""}`}>
          <div className="w-2.5 h-14 bg-[#7a4e23] border border-[#543414] rounded-t-sm shadow-md" />
          <div className="w-2.5 h-14 bg-[#7a4e23] border border-[#543414] rounded-t-sm shadow-md" />
          <div className="w-2.5 h-14 bg-[#8b5928] border border-[#543414] rounded-t-sm shadow-md" />
        </div>
      </div>

      {/* 5. Foreground Cricket Batter (Big green cricket with white bat) */}
      <div className="absolute bottom-14 left-[16%] sm:left-[22%] z-25 pointer-events-none">
        <div className={`relative transition-transform duration-300 ${outcome === "SIX" || outcome === "FOUR" ? "-translate-y-2 scale-105" : ""}`}>
          <svg width="120" height="135" viewBox="0 0 120 135">
            {/* Antennas */}
            <path d="M45 42 Q20 10 5 18" stroke="#375a13" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M55 42 Q30 5 18 10" stroke="#375a13" strokeWidth="4" fill="none" strokeLinecap="round" />

            {/* Cricket Head */}
            <ellipse cx="65" cy="58" rx="28" ry="22" fill="#7cb342" />
            
            {/* Huge cute eye (Google style) */}
            <ellipse cx="56" cy="52" rx="14" ry="16" fill="white" stroke="#375a13" strokeWidth="1.5" />
            <ellipse cx="54" cy="54" rx="9" ry="10" fill="#2d4212" />
            <circle cx="51" cy="50" r="3.5" fill="white" />

            {/* Smile */}
            <path d="M68 62 Q75 68 82 62" stroke="#2d4212" strokeWidth="2.5" fill="none" strokeLinecap="round" />

            {/* Cricket Body with green stripes */}
            <path d="M52 78 L80 78 L74 112 L58 112 Z" fill="#689f38" />
            <line x1="55" y1="86" x2="77" y2="86" stroke="#497320" strokeWidth="3" />
            <line x1="56" y1="94" x2="75" y2="94" stroke="#497320" strokeWidth="3" />
            <line x1="57" y1="102" x2="74" y2="102" stroke="#497320" strokeWidth="3" />

            {/* Little legs */}
            <path d="M58 112 L54 125 L49 125" stroke="#2d4212" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M72 112 L75 125 L80 125" stroke="#2d4212" strokeWidth="3" fill="none" strokeLinecap="round" />

            {/* Bat & Arm (Swinging on shot or standing ready) */}
            <g className={outcome === "SIX" || outcome === "FOUR" ? "animate-pulse" : ""}>
              {/* White Cricket Bat */}
              <rect 
                x="5" 
                y="54" 
                width="48" 
                height="10" 
                rx="4" 
                fill="#ffffff" 
                stroke="#d1d5db" 
                strokeWidth="1.5" 
                transform="rotate(-26 5 54)" 
                className="drop-shadow-md"
              />
              {/* White batting glove / hand */}
              <circle cx="48" cy="68" r="6" fill="#ffffff" stroke="#9ca3af" strokeWidth="1" />
            </g>
          </svg>
        </div>
      </div>

      {/* 6. The Animated Red Cricket Ball (Bowls down the pitch and stays paused at batter) */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        {/* Ball delivery animation */}
        <div className={`absolute left-1/2 -translate-x-1/2 ${isFrozen ? "top-[64%] scale-125" : "animate-google-delivery"}`}>
          <div className="flex flex-col items-center">
            {/* Red leather cricket ball with white seam */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 via-rose-600 to-red-800 border-2 border-white shadow-xl shadow-red-950/70 flex items-center justify-center animate-spin">
              <div className="w-full h-0.5 bg-white/80 rotate-45" />
            </div>
            {/* Dust puff / Shadow */}
            <div className="w-8 h-2 bg-black/30 rounded-full blur-[1px] mt-0.5" />
          </div>
        </div>
      </div>

      {/* 7. Delivery Status Tag */}
      <div className="absolute top-2 left-2 z-40 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-white text-[10px] font-black tracking-wider uppercase flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
        <span>{isFrozen ? "Ball Paused — Pick Your Shot!" : "Delivery Bowling In..."}</span>
      </div>
    </div>
  );
}

