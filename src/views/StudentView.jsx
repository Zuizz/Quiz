import React, { useState, useEffect, useRef } from "react";
import { User, ShieldAlert, Award, Lock, CheckCircle2, XCircle, LogOut } from "lucide-react";
import { QUESTIONS } from "../questions";
import { syncPlayerRecord } from "../realtimeSync";
import { Stumps } from "../components/Stumps";
import { TimerBar } from "../components/TimerBar";
import { Leaderboard } from "../components/Leaderboard";
import { FeedbackOverlay } from "../components/FeedbackOverlay";
import { evaluateAnswer, MAX_WICKETS } from "../gameLogic";
import { FullScreenCricketStadium } from "../components/FullScreenCricketStadium";

export function StudentView({ gameState, timeline, players, theme, toggleTheme }) {
  // Read or create unique playerId in localStorage
  const [playerId] = useState(() => {
    let id = localStorage.getItem("moonquiz_player_id");
    if (!id) {
      id = "p_" + Math.random().toString(36).substring(2, 9);
      localStorage.setItem("moonquiz_player_id", id);
    }
    return id;
  });

  const [nameInput, setNameInput] = useState(() => localStorage.getItem("moonquiz_player_name") || "");
  const [hasJoined, setHasJoined] = useState(() => Boolean(localStorage.getItem("moonquiz_joined") === "true"));

  // Current question data
  const currentQIndex = timeline.questionIndex;
  const currentQ = currentQIndex >= 0 ? QUESTIONS[currentQIndex] : null;

  // Track late-join starting question
  const [joinedQ, setJoinedQ] = useState(() => {
    const saved = localStorage.getItem("moonquiz_joined_q");
    return saved !== null ? parseInt(saved, 10) : 0;
  });

  // Track answers recorded in local storage
  const [playerAnswers, setPlayerAnswers] = useState(() => {
    try {
      const saved = localStorage.getItem(`moonquiz_answers_${playerId}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Active student feedback popup state
  const [feedbackOutcome, setFeedbackOutcome] = useState(null);

  // Read current player from synced players list or fallback
  const currentPlayer = players[playerId] || {
    id: playerId,
    name: nameInput,
    score: 0,
    wickets: 0,
    joinedQ: joinedQ,
    answers: playerAnswers
  };

  // AUTO-SYNC / HEALING: If student joined in localStorage but isn't present in Supabase/backend players table yet
  useEffect(() => {
    if (hasJoined && nameInput.trim() && !players[playerId]) {
      syncPlayerRecord(playerId, {
        id: playerId,
        name: nameInput.trim(),
        score: currentPlayer.score || 0,
        wickets: currentPlayer.wickets || 0,
        joinedQ: joinedQ,
        answers: playerAnswers
      });
    }
  }, [hasJoined, players, playerId, nameInput, joinedQ]);

  // RESET HANDLER: When teacher resets the game (status is 'idle' or resetAt changes), reset joinedQ to 0 and clear answers
  useEffect(() => {
    if (gameState.status === "idle" || (gameState.resetAt && gameState.resetAt > 0)) {
      setJoinedQ(0);
      setPlayerAnswers({});
      setFeedbackOutcome(null);
      evaluatedQuestionsRef.current.clear();
      localStorage.removeItem("moonquiz_joined_q");
      localStorage.removeItem(`moonquiz_answers_${playerId}`);
    }
  }, [gameState.status, gameState.resetAt, playerId]);

  const isOut = (Number(currentPlayer.wickets) || 0) >= MAX_WICKETS;
  const isEligibleForCurrentQ = currentQIndex >= joinedQ;

  // Current question answer status
  const currentAnswerRecord = playerAnswers[currentQIndex] || null;
  const hasAnsweredCurrentQ = Boolean(currentAnswerRecord);
  const selectedKey = currentAnswerRecord?.key || null;

  // Track scored questions using a ref to execute evaluation EXACTLY ONCE per question reveal
  const evaluatedQuestionsRef = useRef(new Set());

  // Leave / Change Name
  const handleLeaveOrChangeName = () => {
    localStorage.removeItem("moonquiz_joined");
    localStorage.removeItem("moonquiz_player_name");
    localStorage.removeItem(`moonquiz_answers_${playerId}`);
    localStorage.removeItem("moonquiz_joined_q");
    setHasJoined(false);
    setNameInput("");
    setPlayerAnswers({});
    setJoinedQ(0);
  };

  // Handle joining the quiz
  const handleJoin = async (e) => {
    e.preventDefault();
    if (!nameInput.trim()) return;

    const trimmedName = nameInput.trim();
    localStorage.setItem("moonquiz_player_name", trimmedName);
    localStorage.setItem("moonquiz_joined", "true");

    let eligibleQ = 0;
    if (gameState.status === "running") {
      eligibleQ = timeline.phase === "idle" || timeline.phase === "get_ready"
        ? 0
        : currentQIndex + 1;
    }
    localStorage.setItem("moonquiz_joined_q", eligibleQ.toString());
    setJoinedQ(eligibleQ);
    setHasJoined(true);

    await syncPlayerRecord(playerId, {
      id: playerId,
      name: trimmedName,
      score: 0,
      wickets: 0,
      joinedQ: eligibleQ,
      answers: {}
    });
  };

  // ONE-CHANCE LOCK: Student selects an answer
  const handleSelectOption = (key) => {
    if (hasAnsweredCurrentQ || isOut || timeline.phase !== "question" || !isEligibleForCurrentQ) {
      return;
    }

    const elapsed = timeline.questionElapsed || 0;
    const answerData = { key, elapsed };

    const updatedAnswers = {
      ...playerAnswers,
      [currentQIndex]: answerData
    };

    setPlayerAnswers(updatedAnswers);
    localStorage.setItem(`moonquiz_answers_${playerId}`, JSON.stringify(updatedAnswers));

    syncPlayerRecord(playerId, {
      answers: updatedAnswers
    });
  };

  // Evaluate answer EXACTLY ONCE during the 'reveal' phase
  useEffect(() => {
    if (timeline.phase === "reveal" && currentQ && isEligibleForCurrentQ) {
      if (!evaluatedQuestionsRef.current.has(currentQIndex)) {
        evaluatedQuestionsRef.current.add(currentQIndex);

        if (!isOut) {
          const studentAns = currentAnswerRecord?.key || null;
          const studentElapsed = currentAnswerRecord?.elapsed ?? null;

          const evalResult = evaluateAnswer(studentAns, currentQ.correct, studentElapsed);
          setFeedbackOutcome(evalResult.outcome);

          const currentRuns = Number(currentPlayer.score) || 0;
          const currentWkts = Number(currentPlayer.wickets) || 0;

          const newScore = currentRuns + evalResult.runs;
          const newWickets = currentWkts + (evalResult.wicketLost ? 1 : 0);

          syncPlayerRecord(playerId, {
            score: newScore,
            wickets: newWickets
          });
        }
      }
    } else if (timeline.phase === "question") {
      setFeedbackOutcome(null);
    }
  }, [timeline.phase, currentQIndex]);

  // 1. JOIN SCREEN
  if (!hasJoined) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-gray-900 dark:text-white flex flex-col justify-center p-4">
        <div className="w-full max-w-sm mx-auto bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-zinc-800 text-center space-y-6">
          <div className="w-16 h-16 mx-auto bg-emerald-500/10 rounded-2xl flex items-center justify-center text-3xl">
            🏏
          </div>

          <div>
            <h1 className="text-2xl font-black tracking-tight">MoonQuiz</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Enter your batter name to walk out to the crease!
            </p>
          </div>

          <form onSubmit={handleJoin} className="space-y-4">
            <div className="text-left">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-1">
                Batter Name
              </label>
              <input
                type="text"
                required
                maxLength={24}
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="e.g. Virat, Ben, Meg..."
                className="w-full px-4 py-3.5 rounded-2xl border-2 border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white font-semibold focus:outline-none focus:border-emerald-500 transition text-lg"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-lg rounded-2xl shadow-lg shadow-emerald-500/30 transition transform active:scale-98 cursor-pointer"
            >
              Take Guard & Join
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. ACTIVE STUDENT SCREEN
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-gray-900 dark:text-white flex flex-col">
      {/* Top sticky scorecard bar */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-zinc-900/95 backdrop-blur border-b border-gray-200 dark:border-zinc-800 px-4 py-2.5 shadow-sm">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center font-bold text-emerald-600 dark:text-emerald-400 text-sm">
              🏏
            </div>
            <div>
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 block leading-tight">
                {currentPlayer.name || nameInput || "Batter"}
              </span>
              <span className="text-xl font-mono font-black text-gray-900 dark:text-white leading-none">
                {currentPlayer.score || 0} Runs
              </span>
            </div>
          </div>

          <Stumps wickets={currentPlayer.wickets || 0} maxWickets={MAX_WICKETS} />

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleLeaveOrChangeName}
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-600 dark:text-gray-300 text-xs font-semibold cursor-pointer"
              title="Change Batter Name"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-600 dark:text-gray-300 text-xs font-semibold cursor-pointer"
              title="Toggle theme"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          </div>
        </div>
      </header>

      {/* Main Game Arena */}
      <main className="flex-1 flex flex-col justify-between max-w-md mx-auto w-full p-4 space-y-4">
        {/* Waiting in Pavilion */}
        {gameState.status === "idle" && (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 py-12">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-3xl animate-bounce">
              ⏳
            </div>
            <h2 className="text-2xl font-black">You are in the Pavilion</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Waiting for umpire/teacher to bowl the first ball...
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleLeaveOrChangeName}
                className="px-3 py-1.5 bg-gray-200 dark:bg-zinc-800 hover:bg-gray-300 text-xs font-bold rounded-xl text-gray-700 dark:text-gray-300 transition"
              >
                Change Name / Rejoin
              </button>
            </div>
            <Leaderboard players={players} highlightPlayerId={playerId} title="Squad List" />
          </div>
        )}

        {/* Get ready countdown */}
        {gameState.status === "running" && timeline.phase === "get_ready" && (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 py-12 animate-fade-in">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">
              Innings Starting
            </span>
            <h2 className="text-4xl font-black">Get Ready!</h2>
            <div className="text-8xl font-black font-mono text-emerald-500">
              {Math.ceil(timeline.timeRemaining / 1000)}
            </div>
          </div>
        )}

        {/* OUT state banner */}
        {isOut && (
          <div className="p-3.5 bg-red-500/10 border-2 border-red-500/40 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400 animate-shake">
            <ShieldAlert className="w-6 h-6 flex-shrink-0" />
            <div className="text-xs font-medium">
              <span className="font-bold uppercase tracking-wide block">3 Wickets Lost — You Are OUT!</span>
              You can watch the rest of the innings from the pavilion.
            </div>
          </div>
        )}

        {/* Late joiner alert (Only if joinedQ > 0 and game is actively on a prior question) */}
        {!isEligibleForCurrentQ && gameState.status === "running" && timeline.phase !== "finished" && (
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs text-amber-700 dark:text-amber-400 text-center font-medium">
            You joined late! You will take strike starting next ball (Ball {joinedQ + 1}).
          </div>
        )}

        {/* Full-Screen Cricket Stadium Match Experience */}
        {gameState.status === "running" && (timeline.phase === "bowling" || timeline.phase === "question" || timeline.phase === "reveal") && currentQ && (
          <FullScreenCricketStadium
            phase={timeline.phase}
            timeRemaining={timeline.timeRemaining}
            outcome={feedbackOutcome}
          >
            {/* Top Match Bar inside the Game Stadium */}
            <div className="w-full flex items-center justify-between bg-black/60 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/20 text-white shadow-lg">
              <div className="flex items-center gap-2">
                <span className="text-xl">🏏</span>
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-400 block leading-tight">
                    Ball {currentQIndex + 1} of {QUESTIONS.length}
                  </span>
                  <span className="text-sm font-black font-mono">
                    {currentPlayer.score || 0} Runs
                  </span>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-[11px] font-black uppercase tracking-wider">
                <span className={`w-2 h-2 rounded-full ${timeline.phase === "bowling" ? "bg-amber-400 animate-ping" : timeline.phase === "question" ? "bg-red-500 animate-pulse" : "bg-emerald-400"}`} />
                <span>
                  {timeline.phase === "bowling" ? "Bowler Delivery" : timeline.phase === "question" ? "Ball Frozen" : "Shot Result"}
                </span>
              </div>
            </div>

            {/* During Bowling Phase (3.5s): Zero text boxes, pure animation */}
            {timeline.phase === "bowling" && null}

            {/* ONLY during Question Phase (30s): The question and answer options pop up! */}
            {timeline.phase === "question" && (
              <div className="space-y-3.5 my-auto animate-fade-in">
                <TimerBar
                  timeRemaining={timeline.timeRemaining}
                  totalDuration={timeline.phase === "reveal" ? 5000 : 30000}
                  isReveal={timeline.phase === "reveal"}
                />

                {/* Question Popup Card */}
                <div className="bg-slate-900/90 backdrop-blur-md border-2 border-emerald-500/40 rounded-3xl p-4 sm:p-5 shadow-2xl text-center">
                  <h2 className="text-base sm:text-lg font-black text-white leading-snug">
                    {currentQ.question}
                  </h2>
                </div>

                {/* 4 Interactive Answer Option Targets */}
                <div className="space-y-2">
                  {currentQ.options.map((opt) => {
                    const isSelected = selectedKey === opt.key;
                    const showReveal = timeline.phase === "reveal";
                    const isCorrect = opt.key === currentQ.correct;

                    let btnStyle = "bg-slate-900/85 backdrop-blur-md border-white/20 text-white hover:border-emerald-400";
                    let badgeStyle = "bg-white/10 text-white";

                    if (showReveal) {
                      if (isCorrect) {
                        btnStyle = "bg-emerald-600 text-white border-white font-bold shadow-xl shadow-emerald-500/50 animate-pop scale-[1.02]";
                        badgeStyle = "bg-emerald-800 text-white";
                      } else if (isSelected && !isCorrect) {
                        btnStyle = "bg-rose-600 text-white border-white font-bold shadow-xl shadow-rose-500/50 animate-shake";
                        badgeStyle = "bg-rose-800 text-white";
                      } else {
                        btnStyle = "bg-slate-900/40 text-slate-400 opacity-40 border-transparent";
                      }
                    } else if (isSelected) {
                      btnStyle = "bg-emerald-500/30 text-emerald-300 border-emerald-400 font-bold shadow-lg animate-pulse-glow";
                      badgeStyle = "bg-emerald-500 text-white";
                    } else if (hasAnsweredCurrentQ) {
                      btnStyle = "bg-slate-900/40 text-slate-500 border-white/10 opacity-50";
                    }

                    const isDisabled = hasAnsweredCurrentQ || isOut || !isEligibleForCurrentQ || showReveal;

                    return (
                      <button
                        key={opt.key}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => handleSelectOption(opt.key)}
                        className={`w-full min-h-[54px] p-3.5 rounded-2xl border-2 flex items-center justify-between gap-3 text-left text-sm sm:text-base font-semibold transition-all duration-200 ${btnStyle} ${
                          isDisabled ? "cursor-not-allowed" : "cursor-pointer active:scale-98"
                        }`}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 transition-colors ${badgeStyle}`}>
                            {opt.key}
                          </span>
                          <span className="leading-snug">{opt.text}</span>
                        </div>

                        {showReveal && isCorrect && (
                          <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0 animate-pop" />
                        )}
                        {showReveal && isSelected && !isCorrect && (
                          <XCircle className="w-5 h-5 text-white flex-shrink-0 animate-shake" />
                        )}
                        {!showReveal && isSelected && (
                          <div className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                            <Lock className="w-3.5 h-3.5" />
                            <span>SHOT LOCKED</span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {hasAnsweredCurrentQ && timeline.phase === "question" && (
                  <div className="flex items-center justify-center gap-1.5 p-2 bg-emerald-500/20 backdrop-blur-md border border-emerald-400/40 rounded-xl text-xs font-bold text-emerald-300">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Shot locked! Awaiting shot execution at 30s...</span>
                  </div>
                )}
              </div>
            )}

            {/* At 30s Reveal (5s): Quiz hides so the batter shot animation & clean stadium result are fully visible! */}
            {timeline.phase === "reveal" && (
              <div className="mt-auto space-y-2 animate-fade-in w-full pb-2">
                <div className="p-3 bg-black/60 backdrop-blur-md rounded-2xl border border-white/20 text-center shadow-2xl">
                  <span className="text-xs uppercase font-black tracking-widest text-emerald-400 block">
                    Ball {currentQIndex + 1} Result
                  </span>
                  <span className="text-xl font-black text-white">
                    {feedbackOutcome === "SIX" ? "🚀 MAXIMUM! SIX RUNS!" : feedbackOutcome === "FOUR" ? "⚡ BOUNDARY! FOUR RUNS!" : "🔴 WICKET! BOWLED HIM!"}
                  </span>
                </div>
                <Leaderboard players={players} highlightPlayerId={playerId} />
              </div>
            )}
          </FullScreenCricketStadium>
        )}

        {/* Finished / Game Over */}
        {gameState.status === "running" && timeline.phase === "finished" && (
          <div className="text-center space-y-4 py-8">
            <div className="text-5xl">🏆</div>
            <h2 className="text-2xl font-black">Match Completed!</h2>
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl">
              <span className="text-xs uppercase font-bold text-gray-500 dark:text-gray-400">Your Final Score</span>
              <div className="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                {currentPlayer.score || 0} Runs / {currentPlayer.wickets || 0} Wickets
              </div>
            </div>
            <Leaderboard players={players} highlightPlayerId={playerId} title="Final Scorecard" />
          </div>
        )}
      </main>
    </div>
  );
}
