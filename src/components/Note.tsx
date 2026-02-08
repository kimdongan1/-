import { motion } from 'framer-motion';
import type { Note as NoteType, Direction } from '../types';

interface NoteProps {
  note: NoteType;
}

const DIRECTION_COLORS = {
  top: 'bg-neon-blue shadow-neon-blue',
  right: 'bg-neon-pink shadow-neon-pink',
  bottom: 'bg-neon-purple shadow-neon-purple',
  left: 'bg-neon-green shadow-neon-green',
};

const getPosition = (direction: Direction, progress: number) => {
  const centerX = 50;
  const centerY = 50;
  const distance = (1 - progress) * 45; // Start from 45% away from center

  switch (direction) {
    case 'top':
      return { x: centerX, y: centerY - distance };
    case 'right':
      return { x: centerX + distance, y: centerY };
    case 'bottom':
      return { x: centerX, y: centerY + distance };
    case 'left':
      return { x: centerX - distance, y: centerY };
  }
};

export const Note: React.FC<NoteProps> = ({ note }) => {
  const position = getPosition(note.direction, note.progress);
  const size = 12 + (note.progress * 8); // Grow as it approaches center

  if (note.hit && note.judgment) {
    return null; // Don't render hit notes
  }

  return (
    <motion.div
      className={`absolute rounded-full ${DIRECTION_COLORS[note.direction]}`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        width: `${size}px`,
        height: `${size}px`,
        transform: 'translate(-50%, -50%)',
      }}
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.1 }}
    />
  );
};
