import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Note } from './Note';
import type { GameState, Direction, JudgmentType } from '../types';

interface GameCanvasProps {
  gameState: GameState;
  bassIntensity: number;
  onHitNote: (direction: Direction) => void;
}

const DIRECTION_KEYS: { [key: string]: Direction } = {
  ArrowUp: 'top',
  w: 'top',
  W: 'top',
  ArrowRight: 'right',
  d: 'right',
  D: 'right',
  ArrowDown: 'bottom',
  s: 'bottom',
  S: 'bottom',
  ArrowLeft: 'left',
  a: 'left',
  A: 'left',
};

const JUDGMENT_COLORS: { [key in JudgmentType]: string } = {
  perfect: 'text-neon-blue neon-text-blue',
  great: 'text-neon-pink neon-text-pink',
  good: 'text-neon-purple neon-text-purple',
  miss: 'text-gray-500',
};

export const GameCanvas: React.FC<GameCanvasProps> = ({
  gameState,
  bassIntensity,
  onHitNote,
}) => {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameState.isPlaying) return;

      const direction = DIRECTION_KEYS[e.key];
      if (direction) {
        e.preventDefault();
        onHitNote(direction);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState.isPlaying, onHitNote]);

  const targetScale = 1 + bassIntensity * 0.3;
  const bgOpacity = bassIntensity * 0.2;

  const latestJudgment = gameState.judgments[gameState.judgments.length - 1];

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Bass-reactive background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20"
        animate={{ opacity: 0.3 + bgOpacity }}
        transition={{ duration: 0.1 }}
      />

      {/* Center target zone */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        animate={{ scale: targetScale }}
        transition={{ duration: 0.1 }}
      >
        <div className="relative">
          {/* Outer ring */}
          <div className="w-32 h-32 rounded-full border-4 border-neon-blue/30 shadow-neon-blue" />

          {/* Middle ring */}
          <div className="absolute inset-4 rounded-full border-4 border-neon-pink/30 shadow-neon-pink" />

          {/* Inner ring */}
          <div className="absolute inset-8 rounded-full border-4 border-neon-purple/50 shadow-neon-purple" />

          {/* Center dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-white shadow-neon-blue" />
          </div>
        </div>
      </motion.div>

      {/* Notes */}
      <AnimatePresence>
        {gameState.notes.map((note) => (
          <Note key={note.id} note={note} />
        ))}
      </AnimatePresence>

      {/* Judgment display */}
      <AnimatePresence>
        {latestJudgment && (
          <motion.div
            key={latestJudgment.timestamp}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            initial={{ scale: 0.5, opacity: 0, y: 0 }}
            animate={{ scale: 1.5, opacity: 1, y: -50 }}
            exit={{ scale: 0.5, opacity: 0, y: -100 }}
            transition={{ duration: 0.5 }}
          >
            <div
              className={`text-4xl font-bold uppercase ${
                JUDGMENT_COLORS[latestJudgment.type]
              }`}
            >
              {latestJudgment.type}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Direction indicators */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 text-neon-blue neon-text-blue text-sm">
          ↑ W
        </div>
        {/* Right */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 text-neon-pink neon-text-pink text-sm">
          → D
        </div>
        {/* Bottom */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-neon-purple neon-text-purple text-sm">
          ↓ S
        </div>
        {/* Left */}
        <div className="absolute left-8 top-1/2 -translate-y-1/2 text-neon-green neon-text-green text-sm">
          ← A
        </div>
      </div>

      {/* Click handlers for mobile/mouse */}
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-auto">
        <div className="col-start-2 row-start-1" onClick={() => onHitNote('top')} />
        <div className="col-start-3 row-start-2" onClick={() => onHitNote('right')} />
        <div className="col-start-2 row-start-3" onClick={() => onHitNote('bottom')} />
        <div className="col-start-1 row-start-2" onClick={() => onHitNote('left')} />
      </div>
    </div>
  );
};
