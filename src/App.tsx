import { useEffect } from 'react';
import { GameCanvas } from './components/GameCanvas';
import { GameUI } from './components/GameUI';
import { useGameEngine } from './hooks/useGameEngine';
import { useAudioAnalyzer } from './hooks/useAudioAnalyzer';

function App() {
  const { gameState, hitNote, startGame, stopGame } = useGameEngine();
  const { bassIntensity, playHitSound, cleanup } = useAudioAnalyzer(gameState.isPlaying);

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  useEffect(() => {
    // Play sound for latest judgment
    if (gameState.judgments.length > 0) {
      const latestJudgment = gameState.judgments[gameState.judgments.length - 1];
      playHitSound(latestJudgment.type);
    }
  }, [gameState.judgments.length, playHitSound, gameState.judgments]);

  return (
    <div className="w-screen h-screen bg-black overflow-hidden">
      <GameCanvas
        gameState={gameState}
        bassIntensity={bassIntensity}
        onHitNote={hitNote}
      />
      <GameUI
        gameState={gameState}
        onStart={startGame}
        onRestart={stopGame}
      />
    </div>
  );
}

export default App;
