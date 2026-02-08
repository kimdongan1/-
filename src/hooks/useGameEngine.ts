import { useState, useEffect, useRef, useCallback } from 'react';
import type { Note, GameState, Direction, JudgmentType, JudgmentWindow } from '../types';

const DIRECTIONS: Direction[] = ['top', 'right', 'bottom', 'left'];
const BPM = 120;
const BEAT_INTERVAL = (60 / BPM) * 1000; // ms per beat
const NOTE_TRAVEL_TIME = 2000; // ms for note to reach center
const SPAWN_INTERVAL = BEAT_INTERVAL / 2; // Spawn note every half beat

const JUDGMENT_WINDOWS: JudgmentWindow = {
  perfect: 50, // ±50ms
  great: 100,  // ±100ms
  good: 150,   // ±150ms
};

const JUDGMENT_SCORES = {
  perfect: 300,
  great: 200,
  good: 100,
  miss: 0,
};

export const useGameEngine = () => {
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    score: 0,
    combo: 0,
    highScore: parseInt(localStorage.getItem('highScore') || '0'),
    notes: [],
    judgments: [],
  });

  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastSpawnTimeRef = useRef<number>(0);
  const lastUpdateTimeRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  const spawnNote = useCallback(() => {
    const direction = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
    const note: Note = {
      id: `${Date.now()}-${Math.random()}`,
      direction,
      spawnTime: Date.now(),
      progress: 0,
      hit: false,
    };

    setGameState((prev) => ({
      ...prev,
      notes: [...prev.notes, note],
    }));
  }, []);

  const calculateJudgment = (timingError: number): JudgmentType => {
    const absError = Math.abs(timingError);
    if (absError <= JUDGMENT_WINDOWS.perfect) return 'perfect';
    if (absError <= JUDGMENT_WINDOWS.great) return 'great';
    if (absError <= JUDGMENT_WINDOWS.good) return 'good';
    return 'miss';
  };

  const hitNote = useCallback((direction: Direction) => {
    setGameState((prev) => {
      const currentTime = Date.now();

      // Find notes in the target direction that are near the center
      const notesInDirection = prev.notes.filter(
        (note) => note.direction === direction && !note.hit && note.progress >= 0.7
      );

      if (notesInDirection.length === 0) return prev;

      // Get the closest note to the center (highest progress)
      const targetNote = notesInDirection.reduce((closest, note) =>
        note.progress > closest.progress ? note : closest
      );

      // Calculate timing error
      const idealHitTime = targetNote.spawnTime + NOTE_TRAVEL_TIME;
      const timingError = currentTime - idealHitTime;
      const judgment = calculateJudgment(timingError);

      // Update note with judgment
      const updatedNotes = prev.notes.map((note) =>
        note.id === targetNote.id
          ? { ...note, hit: true, judgment }
          : note
      );

      // Calculate score and combo
      const isSuccess = judgment !== 'miss';
      const newCombo = isSuccess ? prev.combo + 1 : 0;
      const comboMultiplier = Math.floor(newCombo / 10) * 0.1 + 1;
      const baseScore = JUDGMENT_SCORES[judgment];
      const scoreGain = Math.floor(baseScore * comboMultiplier);

      const newScore = prev.score + scoreGain;
      const newHighScore = Math.max(prev.highScore, newScore);

      // Save high score to localStorage
      if (newHighScore > prev.highScore) {
        localStorage.setItem('highScore', newHighScore.toString());
      }

      return {
        ...prev,
        notes: updatedNotes,
        score: newScore,
        combo: newCombo,
        highScore: newHighScore,
        judgments: [
          ...prev.judgments.slice(-10),
          { type: judgment, timestamp: currentTime },
        ],
      };
    });
  }, []);

  const updateNotes = useCallback((currentTime: number) => {
    setGameState((prev) => {
      const updatedNotes = prev.notes
        .map((note) => {
          const elapsed = currentTime - note.spawnTime;
          const progress = Math.min(elapsed / NOTE_TRAVEL_TIME, 1);
          return { ...note, progress };
        })
        .filter((note) => {
          // Remove notes that are hit or passed the center with miss
          if (note.hit) {
            return currentTime - note.spawnTime < NOTE_TRAVEL_TIME + 200;
          }
          if (note.progress >= 1 && !note.hit) {
            // Auto-miss
            return false;
          }
          return true;
        });

      // Check for auto-miss notes
      const autoMissNotes = prev.notes.filter(
        (note) => !note.hit && note.progress >= 1
      );

      let newCombo = prev.combo;
      let newJudgments = prev.judgments;

      if (autoMissNotes.length > 0) {
        newCombo = 0;
        newJudgments = [
          ...prev.judgments.slice(-10),
          ...autoMissNotes.map(() => ({
            type: 'miss' as JudgmentType,
            timestamp: currentTime,
          })),
        ];
      }

      return {
        ...prev,
        notes: updatedNotes,
        combo: newCombo,
        judgments: newJudgments,
      };
    });
  }, []);

  const gameLoop = useCallback((currentTime: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = currentTime;
      lastSpawnTimeRef.current = currentTime;
      lastUpdateTimeRef.current = currentTime;
    }

    // Spawn notes at regular intervals
    if (currentTime - lastSpawnTimeRef.current >= SPAWN_INTERVAL) {
      spawnNote();
      lastSpawnTimeRef.current = currentTime;
    }

    // Update notes
    if (currentTime - lastUpdateTimeRef.current >= 16) {
      // ~60fps
      updateNotes(currentTime);
      lastUpdateTimeRef.current = currentTime;
    }

    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [spawnNote, updateNotes]);

  useEffect(() => {
    if (gameState.isPlaying) {
      startTimeRef.current = 0;
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameState.isPlaying, gameLoop]);

  const startGame = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      isPlaying: true,
      score: 0,
      combo: 0,
      notes: [],
      judgments: [],
    }));
  }, []);

  const stopGame = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      isPlaying: false,
      notes: [],
    }));
  }, []);

  return {
    gameState,
    hitNote,
    startGame,
    stopGame,
  };
};
