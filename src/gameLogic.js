import { QUESTIONS } from "./questions.js";

export const GET_READY_DURATION = 4000;      // 4s match intro
export const BOWLING_DURATION = 3500;        // 3.5s bowler runs in & bowls before question appears
export const QUESTION_DURATION = 30000;      // 30s question faced while ball is frozen in mid-pitch
export const REVEAL_DURATION = 5000;         // 5s reveal: batter hits SIX/FOUR or WICKET
export const CYCLE_DURATION = BOWLING_DURATION + QUESTION_DURATION + REVEAL_DURATION; // 38.5s per question cycle
export const SIX_CUTOFF_MS = 20000;          // 20s cutoff for a SIX vs FOUR
export const MAX_WICKETS = 3;

/**
 * Calculates game timeline given a startAt timestamp.
 * 
 * Phases per ball:
 * 1. 'bowling': 3.5s animation of bowler running in and releasing ball down the pitch
 * 2. 'question': 30s question active, ball frozen right in mid-pitch striking zone
 * 3. 'reveal': 5s reveal playing SIX, FOUR, or WICKET batter animation + scorecard
 */
export function calculateGameTimeline(startAt, totalQuestions = QUESTIONS.length, now = Date.now()) {
  if (!startAt) {
    return {
      phase: "idle",
      questionIndex: -1,
      timeRemaining: 0,
      questionElapsed: 0,
      isLastQuestion: false,
    };
  }

  const elapsed = now - startAt;

  if (elapsed < 0) {
    return {
      phase: "idle",
      questionIndex: -1,
      timeRemaining: Math.abs(elapsed),
      questionElapsed: 0,
      isLastQuestion: false,
    };
  }

  // 1. Initial Match Get Ready (0 to 4s)
  if (elapsed < GET_READY_DURATION) {
    return {
      phase: "get_ready",
      questionIndex: 0,
      timeRemaining: Math.max(0, GET_READY_DURATION - elapsed),
      questionElapsed: 0,
      isLastQuestion: false,
    };
  }

  // 2. Question Cycles
  const gameTime = elapsed - GET_READY_DURATION;
  const questionIndex = Math.floor(gameTime / CYCLE_DURATION);

  if (questionIndex >= totalQuestions) {
    return {
      phase: "finished",
      questionIndex: totalQuestions - 1,
      timeRemaining: 0,
      questionElapsed: 0,
      isLastQuestion: true,
    };
  }

  const cycleElapsed = gameTime % CYCLE_DURATION;
  const isLast = questionIndex === totalQuestions - 1;

  // Sub-phase A: Bowler delivery run-up (0 -> 3.5s)
  if (cycleElapsed < BOWLING_DURATION) {
    return {
      phase: "bowling",
      questionIndex,
      timeRemaining: Math.max(0, BOWLING_DURATION - cycleElapsed),
      questionElapsed: 0,
      isLastQuestion: isLast,
    };
  } 
  // Sub-phase B: Question Active with Ball Frozen in Mid-pitch (3.5s -> 33.5s)
  else if (cycleElapsed < BOWLING_DURATION + QUESTION_DURATION) {
    const qElapsed = cycleElapsed - BOWLING_DURATION;
    return {
      phase: "question",
      questionIndex,
      timeRemaining: Math.max(0, QUESTION_DURATION - qElapsed),
      questionElapsed: qElapsed,
      isLastQuestion: isLast,
    };
  } 
  // Sub-phase C: Reveal with SIX / FOUR / WICKET shot animation (33.5s -> 38.5s)
  else {
    const revealElapsed = cycleElapsed - (BOWLING_DURATION + QUESTION_DURATION);
    return {
      phase: "reveal",
      questionIndex,
      timeRemaining: Math.max(0, REVEAL_DURATION - revealElapsed),
      questionElapsed: QUESTION_DURATION,
      isLastQuestion: isLast,
    };
  }
}

/**
 * Calculates score delta and wicket for an answer attempt.
 */
export function evaluateAnswer(selectedAnswer, correctAnswer, elapsedMsWhenAnswered) {
  if (!selectedAnswer || selectedAnswer !== correctAnswer) {
    return { runs: 0, wicketLost: true, outcome: "WICKET" };
  }

  if (elapsedMsWhenAnswered !== null && elapsedMsWhenAnswered <= SIX_CUTOFF_MS) {
    return { runs: 6, wicketLost: false, outcome: "SIX" };
  } else {
    return { runs: 4, wicketLost: false, outcome: "FOUR" };
  }
}

/**
 * Sorts players cricket-style: highest runs first, then fewer wickets lost.
 */
export function sortLeaderboard(players) {
  const list = Array.isArray(players) ? players : Object.values(players || {});
  return list
    .filter((p) => p && p.name)
    .sort((a, b) => {
      const scoreA = Number(a.score) || 0;
      const scoreB = Number(b.score) || 0;
      if (scoreB !== scoreA) {
        return scoreB - scoreA;
      }
      const wA = Number(a.wickets) || 0;
      const wB = Number(b.wickets) || 0;
      return wA - wB;
    });
}
