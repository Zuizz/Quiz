import React, { useState } from "react";
import { Play, RotateCcw, Monitor, Users, ExternalLink, Check, AlertCircle } from "lucide-react";
import { QUESTIONS } from "../questions";
import { updateGameState, resetGame } from "../realtimeSync";
import { Leaderboard } from "../components/Leaderboard";
import { TimerBar } from "../components/TimerBar";
import { sortLeaderboard } from "../gameLogic";
import { FullScreenCricketStadium } from "../components/FullScreenCricketStadium";

export function HostView({ gameState, timeline, players }) {
  const [copied, setCopied] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const studentUrl = window.location.origin + window.location.pathname;

  const currentQ = timeline.questionIndex >= 0 ? QUESTIONS[timeline.questionIndex] : null;
  const isIdle = gameState.status === "idle";
  const isPlaying = gameState.status === "running" && timeline.phase !== "finished";
  const isFinished = gameState.status === "running" && timeline.phase === "finished";

  const handleStart = async () => {
    try {
      setIsStarting(true);
      await updateGameState({
        status: "running",
        startAt: Date.now()
      });
    } catch (err) {
      console.error("Failed to start quiz:", err);
      alert("Error starting quiz: " + err.message);
    } finally {
      setIsStarting(false);
    }
  };

  const handleReset = async () => {
    const confirmed = window.confirm("Are you sure you want to reset the match? All player scores, wickets, and question progress will be cleared back to the lobby.");
    if (!confirmed) return;

    try {
      setIsResetting(true);
      await resetGame();
    } catch (err) {
      console.error("Failed to reset match:", err);
      alert("Error resetting match: " + err.message);
    } finally {
      setIsResetting(false);
    }
  };

  const copyStudentLink = () => {
    navigator.clipboard.writeText(studentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sorted = sortLeaderboard(players);
  const manOfTheMatch = sorted.length > 0 ? sorted[0] : null;

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col p-4 md:p-8">
      {/* Top host bar */}
      <header className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-600 rounded-xl shadow-lg shadow-emerald-500/20">
            <Monitor className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              MoonQuiz <span className="text-emerald-400 font-mono text-xs px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">PROJECTOR / HOST VIEW</span>
            </h1>
            <p className="text-xs text-slate-400">Live cricket stadium broadcast sync</p>
          </div>
        </div>

        {/* Host controls */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={copyStudentLink}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <ExternalLink className="w-3.5 h-3.5" />}
            {copied ? "Copied Link!" : "Copy Student Link"}
          </button>

          {isIdle && (
            <button
              type="button"
              disabled={isStarting}
              onClick={handleStart}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/30 transition transform active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-white" />
              {isStarting ? "Starting..." : "Start Quiz"}
            </button>
          )}

          <button
            type="button"
            disabled={isResetting}
            onClick={handleReset}
            className="flex items-center gap-1.5 px-4 py-2 bg-rose-600/20 hover:bg-rose-600/30 active:scale-95 text-rose-300 border border-rose-500/40 font-semibold text-xs rounded-xl transition cursor-pointer disabled:opacity-50 shadow-sm"
            title="Reset Game to Lobby"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? "animate-spin" : ""}`} />
            {isResetting ? "Resetting..." : "Reset Match"}
          </button>
        </div>
      </header>

      {/* Main projection content */}
      <main className="flex-1 flex flex-col items-center justify-center py-6 w-full max-w-5xl mx-auto">
        {/* IDLE / WAITING ROOM */}
        {isIdle && (
          <div className="text-center space-y-6 max-w-lg mx-auto py-8">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-4xl shadow-inner">
              🏏
            </div>
            <div>
              <h2 className="text-3xl font-black text-white">Match Warming Up</h2>
              <p className="text-slate-400 text-sm mt-1">
                Tell students to open the link on their phones to join the pavilion!
              </p>
            </div>

            <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 text-left space-y-2">
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Student Join URL</span>
              <div className="flex items-center justify-between bg-slate-900 p-2.5 rounded-xl font-mono text-sm text-emerald-400 break-all select-all">
                {studentUrl}
              </div>
            </div>

            <div className="pt-2">
              <Leaderboard players={players} title="Players in Pavilion" />
            </div>
          </div>
        )}

        {/* GET READY COUNTDOWN */}
        {gameState.status === "running" && timeline.phase === "get_ready" && (
          <div className="text-center space-y-4 animate-pulse">
            <span className="text-sm uppercase tracking-widest text-emerald-400 font-bold">
              Umpires Taking The Field
            </span>
            <h2 className="text-7xl font-black text-white tracking-wide">
              GET READY!
            </h2>
            <div className="text-9xl font-black font-mono text-emerald-400">
              {Math.ceil(timeline.timeRemaining / 1000)}
            </div>
            <p className="text-slate-400 text-sm">First delivery incoming...</p>
          </div>
        )}

        {/* ACTIVE QUESTION OR REVEAL: FULL SCREEN STADIUM GAME */}
        {isPlaying && (timeline.phase === "bowling" || timeline.phase === "question" || timeline.phase === "reveal") && currentQ && (
          <div className="w-full">
            <FullScreenCricketStadium
              phase={timeline.phase}
              timeRemaining={timeline.timeRemaining}
            >
              {/* Top Stadium Info */}
              <div className="w-full flex items-center justify-between bg-black/60 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 text-white shadow-xl">
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold rounded-lg border border-emerald-500/40">
                  Ball {timeline.questionIndex + 1} of {QUESTIONS.length}
                </span>
                <span className="uppercase text-xs font-black tracking-widest text-slate-200">
                  {timeline.phase === "bowling" ? "🏃 Bowler Delivery" : timeline.phase === "reveal" ? "Over Result" : "🔴 Ball Frozen in Mid-Pitch"}
                </span>
              </div>

              {/* Bowling phase big text overlay */}
              {timeline.phase === "bowling" && (
                <div className="my-auto text-center space-y-3 p-8 bg-black/60 backdrop-blur-lg rounded-3xl border-2 border-emerald-400/50 shadow-2xl animate-pop max-w-md mx-auto">
                  <div className="text-5xl animate-bounce">🏃‍♂️💨</div>
                  <h3 className="text-3xl font-black text-white">
                    Fast Bowler Running In...
                  </h3>
                  <p className="text-slate-300 text-sm">
                    Ball will freeze in mid-pitch as the delivery arrives!
                  </p>
                </div>
              )}

              {/* In Question & Reveal Phases: Question & Options Pop Up in the Stadium Game */}
              {(timeline.phase === "question" || timeline.phase === "reveal") && (
                <div className="space-y-4 my-auto animate-fade-in w-full">
                  <TimerBar
                    timeRemaining={timeline.timeRemaining}
                    totalDuration={timeline.phase === "reveal" ? 5000 : 30000}
                    isReveal={timeline.phase === "reveal"}
                  />

                  {/* Question Card */}
                  <div className="bg-slate-900/90 backdrop-blur-md border-2 border-emerald-500/40 rounded-3xl p-6 shadow-2xl text-center">
                    <h2 className="text-xl sm:text-3xl font-extrabold text-white leading-snug">
                      {currentQ.question}
                    </h2>
                  </div>

                  {/* Options Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentQ.options.map((opt) => {
                      const isCorrect = opt.key === currentQ.correct;
                      const showAnswer = timeline.phase === "reveal";

                      let optClass = "bg-slate-900/80 backdrop-blur-md border-white/20 text-white";
                      if (showAnswer) {
                        if (isCorrect) {
                          optClass = "bg-emerald-600 border-white text-white font-black scale-102 shadow-2xl shadow-emerald-500/50";
                        } else {
                          optClass = "bg-slate-900/40 border-white/10 text-slate-400 opacity-50";
                        }
                      }

                      return (
                        <div
                          key={opt.key}
                          className={`flex items-center gap-3.5 p-4 rounded-2xl border-2 transition-all ${optClass}`}
                        >
                          <span className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center font-black text-sm">
                            {opt.key}
                          </span>
                          <span className="text-base font-semibold">{opt.text}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Reveal Phase Leaderboard */}
              {timeline.phase === "reveal" && (
                <div className="pt-2 animate-fade-in">
                  <Leaderboard players={players} title="Scorecard After Ball" />
                </div>
              )}
            </FullScreenCricketStadium>
          </div>
        )}

        {/* FINISHED / FINAL CEREMONY */}
        {isFinished && (
          <div className="text-center space-y-6 max-w-lg mx-auto py-4">
            <div className="text-6xl animate-bounce">🏆</div>
            <h2 className="text-4xl font-black text-white">MATCH COMPLETED!</h2>

            {manOfTheMatch && (
              <div className="p-6 bg-gradient-to-br from-amber-500/20 via-yellow-500/10 to-amber-600/20 rounded-3xl border-2 border-amber-400/50 shadow-2xl">
                <span className="text-xs font-black uppercase tracking-widest text-amber-300">
                  🌟 MAN OF THE MATCH 🌟
                </span>
                <h3 className="text-3xl font-black text-white mt-1">
                  {manOfTheMatch.name}
                </h3>
                <div className="text-2xl font-mono font-bold text-amber-400 mt-2">
                  {manOfTheMatch.score || 0} Runs / {manOfTheMatch.wickets || 0} Wickets
                </div>
              </div>
            )}

            <Leaderboard players={players} title="Final Match Scorecard" />
          </div>
        )}
      </main>
    </div>
  );
}
