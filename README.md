# 🎵 Rhythm Beat Tapper Game

A minimalist rhythm game built with React, Vite, TypeScript, and Tailwind CSS. Test your rhythm skills by tapping notes that approach from all four directions in sync with the beat!

## ✨ Features

### Core Gameplay
- **BPM-Based Note Generation**: Notes spawn at 120 BPM, creating a consistent rhythm challenge
- **Multi-Directional Notes**: Notes approach from all four directions (top, right, bottom, left)
- **Smooth Animations**: RequestAnimationFrame-based animation system for fluid 60 FPS gameplay
- **Precision Judgment System**: Four judgment levels based on timing accuracy
  - **Perfect**: ±50ms (300 points)
  - **Great**: ±100ms (200 points)
  - **Good**: ±150ms (100 points)
  - **Miss**: Outside timing window (0 points)

### Game Systems
- **Combo System**: Build combos for score multipliers (10% bonus per 10 combo)
- **Score Tracking**: Real-time score display with persistent high score via localStorage
- **Combo Milestones**: Visual celebrations at every 50 combo milestone

### Audio & Visuals
- **Web Audio API Visualizer**: Background visuals react to bass frequencies
- **Dynamic Target Scaling**: Center target pulses with audio intensity
- **Judgment Feedback**: Unique sound frequencies for each judgment type
- **Neon Aesthetic**: Cyberpunk-inspired neon glow effects with Tailwind CSS

### Controls
- **Keyboard**: WASD or Arrow Keys
  - W / ↑ - Top
  - D / → - Right
  - S / ↓ - Bottom
  - A / ← - Left
- **Mouse/Touch**: Click or tap on screen regions to hit notes

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## 🎮 How to Play

1. Click **START GAME** to begin
2. Watch as notes spawn from the edges and move toward the center
3. Press the corresponding key (WASD or Arrow keys) when notes reach the center target
4. Chain successful hits to build your combo and maximize your score
5. Try to beat your high score!

## 🏗️ Project Structure

```
src/
├── components/
│   ├── GameCanvas.tsx    # Main game rendering and input handling
│   ├── GameUI.tsx         # UI overlay (score, combo, menu)
│   └── Note.tsx           # Individual note component
├── hooks/
│   ├── useGameEngine.ts   # Core game logic and state management
│   └── useAudioAnalyzer.ts # Web Audio API integration
├── types.ts               # TypeScript type definitions
├── App.tsx                # Main application component
└── index.css              # Tailwind CSS configuration
```

## 🛠️ Technology Stack

- **React 18**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Smooth UI animations
- **Web Audio API**: Audio visualization and feedback

## 🎨 Customization

### Adjust Difficulty

Edit `src/hooks/useGameEngine.ts`:

```typescript
const BPM = 120;              // Increase for faster notes
const NOTE_TRAVEL_TIME = 2000; // Decrease for less reaction time
const SPAWN_INTERVAL = BEAT_INTERVAL / 2; // Adjust note density
```

### Change Judgment Windows

```typescript
const JUDGMENT_WINDOWS: JudgmentWindow = {
  perfect: 50,  // Tighter window = harder
  great: 100,
  good: 150,
};
```

### Modify Colors

Edit `tailwind.config.js` to customize the neon color scheme:

```javascript
colors: {
  neon: {
    blue: '#00f0ff',
    pink: '#ff00ff',
    purple: '#9d00ff',
    green: '#00ff41',
  }
}
```

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

Built with ❤️ using React, Vite, and Tailwind CSS
