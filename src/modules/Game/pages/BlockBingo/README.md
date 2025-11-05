# BlockBingo Game - Component Structure

This folder contains the BlockBingo game implementation with a clean, modular architecture.

## Folder Structure

```
BlockBingo/
├── components/          # Reusable UI components
│   ├── GameStats.tsx    # Displays game statistics (attempts, scores)
│   ├── GameColumn.tsx   # Individual column with scrolling tiles
│   ├── GameGrid.tsx     # 3x5 grid container for columns
│   ├── GameControls.tsx # Sidebar with game controls and settings
│   ├── HelpModal.tsx    # Help & Rules modal dialog
│   └── index.ts         # Component exports
├── constants/           # Constant values
│   └── balls.ts         # Sports balls data and game state types
├── hooks/               # Custom React hooks
│   └── useGameLogic.ts  # Main game logic and state management
├── views/               # Main view component
│   └── index.tsx        # BlockBingoView - main component
└── index.tsx            # Public export
```

## Component Overview

### 1. **GameStats** (`components/GameStats.tsx`)
Displays three animated stat cards:
- Attempts Left (purple)
- Total Score (cyan)
- Last Score (green)

**Props:**
- `attemptsLeft: number` - Remaining game attempts
- `totalScore: number` - Accumulated score
- `lastScore: number` - Points from last round

---

### 2. **GameColumn** (`components/GameColumn.tsx`)
Renders a single column with scrolling or fixed tiles.

**Props:**
- `colIndex: number` - Column index (0-2)
- `isPaused: boolean` - Whether column is stopped
- `scrollPos: number` - Current scroll position (%)
- `sequence: number[]` - Random tile sequence for this column
- `grid: number[][]` - Final grid state (5x3)
- `matchingTiles: Set<string>` - Matching tile positions
- `gameState: GameState` - Current game state
- `onColumnClick: (colIndex: number) => void` - Click handler

**Features:**
- Continuous scrolling animation
- Random tile sequences per column
- Visual indicators for scoring area
- Highlight matching tiles with animations
- Shows 5 rows (center 3 are scoring area)

---

### 3. **GameGrid** (`components/GameGrid.tsx`)
Container for all three columns.

**Props:**
- `columnPaused: boolean[]` - Pause state for each column
- `scrollPositions: number[]` - Scroll positions for each column
- `columnTileSequences: number[][]` - Tile sequences for each column
- `grid: number[][]` - Final grid state
- `matchingTiles: Set<string>` - Matching tile positions
- `gameState: GameState` - Current game state
- `onColumnClick: (colIndex: number) => void` - Click handler

**Layout:**
- Fixed 500px height
- 3 columns with gaps
- Displays instruction text during play

---

### 4. **GameControls** (`components/GameControls.tsx`)
Sidebar with game controls and settings.

**Props:**
- `gameState: GameState` - Current game state
- `network: string` - Selected network
- `currency: string` - Selected currency
- `depositAmount: string` - Bet amount
- `user: User | null` - User data
- `totalScore: number` - Total score
- Multiple callback handlers for user actions

**States:**
- **Idle**: Network/currency selection, balance display, deposit input, start button
- **Playing**: (empty - controls hidden during play)
- **Finished**: Score display, reward calculation, play again button
- **Help Button**: Always visible

---

### 5. **HelpModal** (`components/HelpModal.tsx`)
Modal dialog showing game rules and instructions.

**Props:**
- `isOpen: boolean` - Modal visibility
- `onClose: () => void` - Close handler

**Content:**
- How to Play (9 steps)
- Scoring Rules (point values)
- Reward Formula
- Animated entrance/exit

---

### 6. **useGameLogic** (`hooks/useGameLogic.ts`)
Custom hook managing all game logic and state.

**Parameters:**
- `user: User | null` - Current user
- `network: string` - Selected network
- `currency: string` - Selected currency
- `depositAmount: string` - Bet amount

**Returns:**
- Game state variables
- Action handlers
- Helper functions

**Key Functions:**
- `generateRandomTileSequence()` - Creates random tile order
- `initializeColumnSequences()` - Sets up all columns
- `handleColumnClick()` - Stops column and captures tiles
- `calculateScore()` - Calculates points from matches
- `handleRoundComplete()` - Processes round results
- `handleStartGame()` - Validates and starts game
- `handleRestart()` - Resets game
- `calculateReward()` - Computes final reward (5 decimals)

---

## Game Rules

### Grid Layout
- **Total Grid**: 3 columns × 5 rows (500px height)
- **Scoring Area**: Center 3x3 (rows 1-3)
- **Display Only**: Top and bottom rows (dimmed)

### Scoring System
- **2 Consecutive Horizontal**: +20 points
- **3 Diagonal Match**: +50 points
- **3 Horizontal Match** (Full Row): +300 points

### Reward Calculation
```
Reward = (Total Score × Deposit Amount) / 250
```
Result formatted to 5 decimal places.

---

## Usage Example

```tsx
import { BlockBingoView } from './modules/Game/pages/BlockBingo';

function App() {
  return <BlockBingoView />;
}
```

---

## Key Features

1. **Modular Architecture**: Each component has a single responsibility
2. **Reusable Components**: Can be used independently
3. **Type Safety**: Full TypeScript support
4. **Clean Separation**: Logic (hooks) separated from UI (components)
5. **Performance**: Memoized callbacks, optimized animations
6. **Responsive**: Adapts to different screen sizes
7. **Accessible**: Proper ARIA labels and keyboard support

---

## Customization

### Adding New Ball Types
Edit `constants/balls.ts` and add to `SPORTS_BALLS` array.

### Changing Scoring Rules
Modify `calculateScore()` function in `hooks/useGameLogic.ts`.

### Adjusting Grid Size
Update grid dimensions in `GameGrid.tsx` and scoring logic in `useGameLogic.ts`.

### Styling Changes
Each component uses Tailwind classes - modify className props for styling.

---

## Dependencies

- `react` - UI framework
- `framer-motion` - Animations
- `react-icons` - Icons
- Custom components: `Select`, `Toast`
- Context: `useAuthContext`

