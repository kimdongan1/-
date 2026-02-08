import { useEffect, useRef, useState } from 'react';

export const useAudioAnalyzer = (isPlaying: boolean) => {
  const [bassIntensity, setBassIntensity] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (isPlaying && !audioContextRef.current) {
      // Initialize Web Audio API
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContext();
      analyzerRef.current = audioContextRef.current.createAnalyser();
      analyzerRef.current.fftSize = 256;

      // Create a simple oscillator for background beat
      oscillatorRef.current = audioContextRef.current.createOscillator();
      gainNodeRef.current = audioContextRef.current.createGain();

      oscillatorRef.current.type = 'sine';
      oscillatorRef.current.frequency.value = 80; // Bass frequency
      gainNodeRef.current.gain.value = 0.1;

      oscillatorRef.current.connect(gainNodeRef.current);
      gainNodeRef.current.connect(analyzerRef.current);
      analyzerRef.current.connect(audioContextRef.current.destination);

      oscillatorRef.current.start();
    }

    if (isPlaying && analyzerRef.current) {
      const bufferLength = analyzerRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const analyze = () => {
        if (!analyzerRef.current) return;

        analyzerRef.current.getByteFrequencyData(dataArray);

        // Get bass frequencies (first 10% of spectrum)
        const bassEnd = Math.floor(bufferLength * 0.1);
        let sum = 0;
        for (let i = 0; i < bassEnd; i++) {
          sum += dataArray[i];
        }
        const avgBass = sum / bassEnd / 255; // Normalize to 0-1

        setBassIntensity(avgBass);
        animationFrameRef.current = requestAnimationFrame(analyze);
      };

      analyze();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying]);

  const cleanup = () => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current.disconnect();
    }
    if (gainNodeRef.current) {
      gainNodeRef.current.disconnect();
    }
    if (analyzerRef.current) {
      analyzerRef.current.disconnect();
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    audioContextRef.current = null;
    analyzerRef.current = null;
    oscillatorRef.current = null;
    gainNodeRef.current = null;
  };

  const playHitSound = (judgment: string) => {
    if (!audioContextRef.current) return;

    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();

    const frequencies: { [key: string]: number } = {
      perfect: 880,
      great: 660,
      good: 440,
      miss: 220,
    };

    oscillator.frequency.value = frequencies[judgment] || 440;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContextRef.current.currentTime + 0.1
    );

    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);

    oscillator.start();
    oscillator.stop(audioContextRef.current.currentTime + 0.1);
  };

  return { bassIntensity, playHitSound, cleanup };
};
