import { QUESTIONS } from "./questions.js";

export const GET_READY_DURATION = 4000;      // 4s
export const QUESTION_DURATION = 30000;     // 30s
export const REVEAL_DURATION = 5000;        // 5s
export const CYCLE_DURATION = QUESTION_DURATION + REVEAL_DURATION; // 35s
export const SIX_CUTOFF_MS = 20000;         // 20s cutoff for a SIX vs FOUR
export const MAX_WICKETS = 3;

/**
 * Calculates game timeline given a startAt timestamp.
 * 
 * @param {number|null} startAt - Timestamp when the game was started (ms)
 * @param {number} totalQuestions - Total count of questions
 * @param {number} [now=Date.now()] - Current timestamp
 * @returns {object} status details: {
 *   phase: 'idle' | 'get_ready' | 'question' | 'reveal' | 'finished',
 *   questionIndex: number,
 *   timeRemaining: number, // ms remaining in current phase
 *   questionElapsed: number, // ms elapsed since question opened (0-30000)
 *   isLastQuestion: boolean
 * }
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

  // 1. Get ready phase (0 to 4s)
  if (elapsed < GET_READY_DURATION) {
    return {
      phase: "get_ready",
      questionIndex: 0,
      timeRemaining: Math.max(0, GET_READY_DURATION - elapsed),
      questionElapsed: 0,
      isLastQuestion: false,
    };
  }

  // 2. Questions cycle
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

  if (cycleElapsed < QUESTION_DURATION) {
    return {
      phase: "question",
      questionIndex,
      timeRemaining: Math.max(0, QUESTION_DURATION - cycleElapsed),
      questionElapsed: cycleElapsed,
      isLastQuestion: isLast,
    };
  } else {
    return {
      phase: "reveal",
      questionIndex,
      timeRemaining: Math.max(0, CYCLE_DURATION - cycleElapsed),
      questionElapsed: QUESTION_DURATION,
      isLastQuestion: isLast,
    };
  }
}

/**
 * Calculates score delta and wicket for an answer attempt.
 *
 * @param {string|null} selectedAnswer - The chosen option key (e.g. 'A') or null if no answer
 * @param {string} correctAnswer - The correct option key
 * @param {number|null} elapsedMsWhenAnswered - Milliseconds elapsed from question start when answered
 * @returns {{ runs: number, wicketLost: boolean, outcome: 'SIX' | 'FOUR' | 'WICKET' }}
 */
export function evaluateAnswer(selectedAnswer, correctAnswer, elapsedMsWhenAnswered) {
  if (!selectedAnswer || selectedAnswer !== correctAnswer) {
    return { runs: 0, wicketLost: true, outcome: "WICKET" };
  }

  // Correct answer
  if (elapsedMsWhenAnswered !== null && elapsedMsWhenAnswered <= SIX_CUTOFF_MS) {
    return { runs: 6, wicketLost: false, outcome: "SIX" };
  } else {
    return { runs: 4, wicketLost: false, outcome: "FOUR" };
  }
}

/**
 * Sorts players cricket-style: highest runs first, then fewer wickets lost.
 * 
 * @param {Array|object} players
 * @returns {Array} sorted players list with rank
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
      return wA - wB; // Fewer wickets lost is better
    });
}

