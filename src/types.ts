/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Letter = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H';

export type SpecialEffect = 'NONE' | 'HYPER_EXPLODER' | 'ROW_BLASTER' | 'COL_BLASTER' | 'BOMB';

export interface Tile {
  id: string;
  row: number;
  col: number;
  letter: Letter;
  special: SpecialEffect;
  isLocked?: boolean; // Ice/Stone obstacle block - can be matched over or cleared if adjacent match happens
  iceLevel?: number; // 0: none, 1: single lock, 2: double lock (requires 2 clears to break)
  isVined?: boolean; // Vine: cannot be moved, clears when matched
  isStone?: boolean; // Stone: question mark, cannot be swapped, reveals when adjacent matching occurs
  isEliminating?: boolean; // Trigger shrink animation
  isNew?: boolean; // Trigger fall-in animation
}

export type GridCell = Tile | null; // null means empty space or blocked coordinate (out of bounds for irregular grids)

export interface PortalPair {
  r1: number;
  c1: number;
  r2: number;
  c2: number;
}

export interface LevelConfig {
  id: number;
  name: string;
  chineseName: string;
  description: string;
  chineseDescription: string;
  layout: number[][]; // 0: out of bounds, 1: standard empty, 2: standard with pre-locked ice blocker, 3: double ice layer, 4: vined, 5: stone block
  scoreGoal: number;
  movesLimit: number;
  allowedLetters: Letter[];
  initialSpecialProbability: number; // probability of a tile spawning with random effect (e.g. 0.08)
  theme?: 'river' | 'grassland' | 'sky' | 'starry'; // Game board dynamic themes
  portals?: PortalPair[]; // Portal teleport pairs
  specialGoals?: {
    letter?: { [key in Letter]?: number };
    iceCount?: number;
    totalEliminations?: number;
    maxCombo?: number;
    vinedCount?: number;
    stoneCount?: number;
  };
}

export interface GameState {
  currentLevelIndex: number;
  score: number;
  movesRemaining: number;
  board: GridCell[][];
  isPlaying: boolean;
  isWon: boolean;
  isLost: boolean;
  comboCount: number;
  clearedMainTargetScore: boolean;
  goalsProgress: {
    iceCleared: number;
    totalEliminations: number;
    maxComboAchieved: number;
    letterClearedCount: { [key in Letter]?: number };
    vinedCleared: number;
    stoneCleared: number;
  };
}

export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  character?: string;
  size: number;
  alpha: number;
  decay: number;
}
