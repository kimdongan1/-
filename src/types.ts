export type Direction = 'top' | 'right' | 'bottom' | 'left';

export type JudgmentType = 'perfect' | 'great' | 'good' | 'miss';

export interface Note {
  id: string;
  direction: Direction;
  spawnTime: number;
  progress: number;
  hit: boolean;
  judgment?: JudgmentType;
}

export interface GameState {
  isPlaying: boolean;
  score: number;
  combo: number;
  highScore: number;
  notes: Note[];
  judgments: Array<{ type: JudgmentType; timestamp: number }>;
}

export interface JudgmentWindow {
  perfect: number;
  great: number;
  good: number;
}
