import { motion } from 'framer-motion';
import type { GameState } from '../types';

interface GameUIProps {
  gameState: GameState;
  onStart: () => void;
  onRestart: () => void;
}

export const GameUI: React.FC<GameUIProps> = ({ gameState, onStart, onRestart }) => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top bar - Score and Stats */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start">
        {/* Left side - Score */}
        <div className="space-y-2">
          <motion.div
            className="text-5xl font-bold text-neon-blue neon-text-blue"
            key={gameState.score}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.2 }}
          >
            {gameState.score.toLocaleString()}
          </motion.div>
          <div className="text-sm text-gray-400">SCORE</div>
        </div>

        {/* Right side - Stats */}
        <div className="space-y-4 text-right">
          <div>
            <div className="text-2xl font-bold text-neon-purple neon-text-purple">
              {gameState.highScore.toLocaleString()}
            </div>
            <div className="text-xs text-gray-400">HIGH SCORE</div>
          </div>
          <div>
            <motion.div
              className="text-3xl font-bold text-neon-pink neon-text-pink"
              key={gameState.combo}
              animate={{
                scale: gameState.combo > 0 ? [1, 1.3, 1] : 1,
              }}
              transition={{ duration: 0.2 }}
            >
              {gameState.combo}x
            </motion.div>
            <div className="text-xs text-gray-400">COMBO</div>
          </div>
        </div>
      </div>

      {/* Start/Restart button */}
      {!gameState.isPlaying && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="text-center space-y-8">
            <motion.h1
              className="text-6xl font-bold text-neon-blue neon-text-blue mb-8"
              animate={{
                textShadow: [
                  '0 0 5px #00f0ff, 0 0 10px #00f0ff, 0 0 20px #00f0ff',
                  '0 0 10px #00f0ff, 0 0 20px #00f0ff, 0 0 40px #00f0ff',
                  '0 0 5px #00f0ff, 0 0 10px #00f0ff, 0 0 20px #00f0ff',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              RHYTHM TAPPER
            </motion.h1>

            {gameState.score > 0 && (
              <motion.div
                className="space-y-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                <div className="text-2xl text-gray-400">Final Score</div>
                <div className="text-5xl font-bold text-neon-pink neon-text-pink">
                  {gameState.score.toLocaleString()}
                </div>
              </motion.div>
            )}

            <motion.button
              onClick={gameState.score > 0 ? onRestart : onStart}
              className="px-12 py-4 bg-transparent border-2 border-neon-purple text-neon-purple neon-text-purple font-bold text-xl rounded-lg shadow-neon-purple hover:bg-neon-purple hover:text-black transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {gameState.score > 0 ? 'PLAY AGAIN' : 'START GAME'}
            </motion.button>

            <div className="text-sm text-gray-500 space-y-1">
              <div>Use WASD or Arrow Keys to hit notes</div>
              <div className="flex items-center justify-center gap-4 mt-4">
                <span className="text-neon-blue neon-text-blue">↑ W</span>
                <span className="text-neon-pink neon-text-pink">→ D</span>
                <span className="text-neon-purple neon-text-purple">↓ S</span>
                <span className="text-neon-green neon-text-green">← A</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Combo milestone celebrations */}
      {gameState.isPlaying && gameState.combo > 0 && gameState.combo % 50 === 0 && (
        <motion.div
          key={`combo-${gameState.combo}`}
          className="absolute left-1/2 top-1/4 -translate-x-1/2 pointer-events-none"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 0] }}
          transition={{ duration: 1 }}
        >
          <div className="text-6xl font-bold text-neon-green neon-text-green">
            {gameState.combo} COMBO!
          </div>
        </motion.div>
      )}
    </div>
  );
};
