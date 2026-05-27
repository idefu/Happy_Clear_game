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
  isEliminating?: boolean; // Trigger shrink animation
  isNew?: boolean; // Trigger fall-in animation
}

export type GridCell = Tile | null; // null means empty space or blocked coordinate (out of bounds for irregular grids)

export interface LevelConfig {
  id: number;
  name: string;
  chineseName: string;
  description: string;
  chineseDescription: string;
  layout: number[][]; // 0: out of bounds, 1: standard empty, 2: standard with pre-locked ice blocker
  scoreGoal: number;
  movesLimit: number;
  allowedLetters: Letter[];
  initialSpecialProbability: number; // probability of a tile spawning with random effect (e.g. 0.08)
  specialGoals?: {
    letter?: { [key in Letter]?: number };
    iceCount?: number;
    totalEliminations?: number;
    maxCombo?: number;
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
