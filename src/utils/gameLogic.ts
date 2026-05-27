/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GridCell, LevelConfig, Tile, Letter, SpecialEffect } from '../types';

// Helper to generate a unique random string for keys
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// Generate random letter from allowed list
export function getRandomLetter(allowed: Letter[]): Letter {
  const index = Math.floor(Math.random() * allowed.length);
  return allowed[index];
}

// Check if cell is in bounds and is playable
export function isValidCell(row: number, col: number, layout: number[][]): boolean {
  const R = layout.length;
  const C = layout[0]?.length || 0;
  return row >= 0 && row < R && col >= 0 && col < C && layout[row][col] !== 0;
}

// Create the initial board based on level design
export function createInitialBoard(level: LevelConfig): GridCell[][] {
  const layout = level.layout;
  const R = layout.length;
  const C = layout[0].length;
  const board: GridCell[][] = Array(R).fill(null).map(() => Array(C).fill(null));

  for (let r = 0; r < R; r++) {
    for (let c = 0; c < C; c++) {
      if (layout[r][c] === 0) {
        board[r][c] = null;
        continue;
      }

      // Find letter that doesn't create immediate Match-3
      let letter = getRandomLetter(level.allowedLetters);
      let attempts = 0;
      
      while (attempts < 50) {
        const leftMatch = c >= 2 && 
                         board[r][c - 1] && board[r][c - 2] &&
                         board[r][c - 1]!.letter === letter && 
                         board[r][c - 2]!.letter === letter;
        
        const topMatch = r >= 2 && 
                        board[r - 1][c] && board[r - 2][c] &&
                        board[r - 1][c]!.letter === letter && 
                        board[r - 2][c]!.letter === letter;

        if (!leftMatch && !topMatch) {
          break;
        }
        letter = getRandomLetter(level.allowedLetters);
        attempts++;
      }

      // Check for locked state (Ice obstacle)
      const isLocked = layout[r][c] === 2;

      // Random starting special effects (HYPER_EXPLODER, ROW_BLASTER, COL_BLASTER)
      let special: SpecialEffect = 'NONE';
      if (!isLocked && Math.random() < level.initialSpecialProbability * 0.60) {
        const rand = Math.random();
        if (rand < 0.12) {
          special = 'HYPER_EXPLODER';
        } else if (rand < 0.60) {
          special = 'ROW_BLASTER';
        } else {
          special = 'COL_BLASTER';
        }
      }

      board[r][c] = {
        id: generateId(),
        row: r,
        col: c,
        letter,
        special,
        isLocked,
        isNew: true
      };
    }
  }

  // Ensure board has at least one valid move, otherwise shuffle
  let activeBoard = board;
  let shuffleAttempts = 0;
  while (!checkPotentialMoves(activeBoard, layout) && shuffleAttempts < 10) {
    activeBoard = shuffleEntireBoardOnlyRandom(activeBoard, level);
    shuffleAttempts++;
  }

  return activeBoard;
}

// Helper to check if swapping (r1, c1) and (r2, c2) creates a match.
export function checkMatchAfterSwap(
  board: GridCell[][],
  r1: number,
  c1: number,
  r2: number,
  c2: number,
  layout: number[][]
): boolean {
  const R = board.length;
  const C = board[0].length;

  // Clone current board structure
  const tempBoard: GridCell[][] = board.map(row => 
    row.map(cell => cell ? { ...cell } : null)
  );

  const t1 = tempBoard[r1][c1];
  const t2 = tempBoard[r2][c2];

  if (!t1 || !t2 || t1.isLocked || t2.isLocked) return false;

  // Swap coordinates
  tempBoard[r1][c1] = { ...t2, row: r1, col: c1 };
  tempBoard[r2][c2] = { ...t1, row: r2, col: c2 };

  // If BOTH have a special effect, it is a magnificent combo swap!
  if (t1.special !== 'NONE' && t2.special !== 'NONE') {
    return true;
  }

  // Check if either of the swapped cells results in any Match-3
  return hasAnyMatch(tempBoard, layout);
}

// Quick check if there's any horizontal or vertical 3-in-a-row match
export function hasAnyMatch(board: GridCell[][], layout: number[][]): boolean {
  const R = board.length;
  const C = board[0].length;

  // Check horizontal
  for (let r = 0; r < R; r++) {
    for (let c = 0; c < C - 2; c++) {
      if (layout[r][c] !== 0 && layout[r][c+1] !== 0 && layout[r][c+2] !== 0) {
        const b0 = board[r][c];
        const b1 = board[r][c+1];
        const b2 = board[r][c+2];
        if (b0 && b1 && b2 && b0.letter === b1.letter && b1.letter === b2.letter) {
          return true;
        }
      }
    }
  }

  // Check vertical
  for (let r = 0; r < R - 2; r++) {
    for (let c = 0; c < C; c++) {
      if (layout[r][c] !== 0 && layout[r+1][c] !== 0 && layout[r+2][c] !== 0) {
        const b0 = board[r][c];
        const b1 = board[r+1][c];
        const b2 = board[r+2][c];
        if (b0 && b1 && b2 && b0.letter === b1.letter && b1.letter === b2.letter) {
          return true;
        }
      }
    }
  }

  return false;
}

// Scans entire grid to find if there are ANY potential valid match-3 swaps.
export function checkPotentialMoves(board: GridCell[][], layout: number[][]): boolean {
  const R = board.length;
  const C = board[0].length;

  for (let r = 0; r < R; r++) {
    for (let c = 0; c < C; c++) {
      const tile = board[r][c];
      if (!tile || tile.isLocked) continue;

      // Try swapping right
      if (c + 1 < C && board[r][c + 1] && !board[r][c + 1]!.isLocked) {
        if (checkMatchAfterSwap(board, r, c, r, c + 1, layout)) {
          return true;
        }
      }

      // Try swapping down
      if (r + 1 < R && board[r + 1][c] && !board[r + 1][c]!.isLocked) {
        if (checkMatchAfterSwap(board, r, c, r + 1, c, layout)) {
          return true;
        }
      }
    }
  }
  return false;
}

// Scans and returns all possible swaps that lead to matches.
export function findPotentialMoves(board: GridCell[][], layout: number[][]): { r1: number; c1: number; r2: number; c2: number }[] {
  const R = board.length;
  const C = board[0].length;
  const moves: { r1: number; c1: number; r2: number; c2: number }[] = [];

  for (let r = 0; r < R; r++) {
    for (let c = 0; c < C; c++) {
      const tile = board[r][c];
      if (!tile || tile.isLocked) continue;

      // Try swapping right
      if (c + 1 < C && board[r][c + 1] && !board[r][c + 1]!.isLocked) {
        if (checkMatchAfterSwap(board, r, c, r, c + 1, layout)) {
          moves.push({ r1: r, c1: c, r2: r, c2: c + 1 });
        }
      }

      // Try swapping down
      if (r + 1 < R && board[r + 1][c] && !board[r + 1][c]!.isLocked) {
        if (checkMatchAfterSwap(board, r, c, r + 1, c, layout)) {
          moves.push({ r1: r, c1: c, r2: r + 1, c2: c });
        }
      }
    }
  }
  return moves;
}

// Squeeze board: keeping non-empty, non-locked tiles and shuffle only their letters and specials
export function shuffleEntireBoard(board: GridCell[][], level: LevelConfig): GridCell[][] {
  const layout = level.layout;
  let activeBoard = board.map(row => row.map(cell => cell ? { ...cell } : null));
  let attempts = 0;

  while (attempts < 15) {
    // Gather all flexible tiles
    const movableTiles: { letter: Letter; special: SpecialEffect }[] = [];
    for (let r = 0; r < activeBoard.length; r++) {
      for (let c = 0; c < activeBoard[r].length; c++) {
        const cell = activeBoard[r][c];
        if (cell && !cell.isLocked) {
          movableTiles.push({ letter: cell.letter, special: cell.special });
        }
      }
    }

    // Shuffle flexible items
    for (let i = movableTiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = movableTiles[i];
      movableTiles[i] = movableTiles[j];
      movableTiles[j] = temp;
    }

    // Reassert back
    let listIdx = 0;
    for (let r = 0; r < activeBoard.length; r++) {
      for (let c = 0; c < activeBoard[r].length; c++) {
        const cell = activeBoard[r][c];
        if (cell && !cell.isLocked) {
          cell.letter = movableTiles[listIdx].letter;
          cell.special = movableTiles[listIdx].special;
          listIdx++;
        }
      }
    }

    // Check if this shuffle avoids direct matches but permits potential moves
    const matchFree = !hasAnyMatch(activeBoard, layout);
    const hasMove = checkPotentialMoves(activeBoard, layout);
    if (matchFree && hasMove) {
      break;
    }
    attempts++;
  }

  return activeBoard;
}

// Fallback shuffle: generates fresh letters on unfrozen slots
function shuffleEntireBoardOnlyRandom(board: GridCell[][], level: LevelConfig): GridCell[][] {
  const layout = level.layout;
  return board.map((row, r) => 
    row.map((cell, c) => {
      if (!cell) return null;
      if (cell.isLocked) return cell;
      return {
        ...cell,
        letter: getRandomLetter(level.allowedLetters),
        isNew: true
      };
    })
  );
}

// Interfaces representing direct MATCH list
interface MatchGroup {
  coords: { r: number; c: number }[];
  letter: Letter;
  type: 'HORIZ' | 'VERT';
}

// Identify 3s, 4s, and 5s in horizontal/vertical clusters
export function scanMatches(board: GridCell[][], layout: number[][]): MatchGroup[] {
  const R = board.length;
  const C = board[0].length;
  const matchGroups: MatchGroup[] = [];

  // 1. Horizontal matches scan
  for (let r = 0; r < R; r++) {
    let c = 0;
    while (c < C) {
      const tile = board[r][c];
      if (!tile || layout[r][c] === 0) {
        c++;
        continue;
      }

      const matchCoords = [{ r, c }];
      let nextCol = c + 1;
      while (nextCol < C && layout[r][nextCol] !== 0) {
        const nextTile = board[r][nextCol];
        if (nextTile && nextTile.letter === tile.letter) {
          matchCoords.push({ r, c: nextCol });
          nextCol++;
        } else {
          break;
        }
      }

      if (matchCoords.length >= 3) {
        matchGroups.push({
          coords: matchCoords,
          letter: tile.letter,
          type: 'HORIZ'
        });
        c = nextCol; // skip scans
      } else {
        c++;
      }
    }
  }

  // 2. Vertical matches scan
  for (let c = 0; c < C; c++) {
    let r = 0;
    while (r < R) {
      const tile = board[r][c];
      if (!tile || layout[r][c] === 0) {
        r++;
        continue;
      }

      const matchCoords = [{ r, c }];
      let nextRow = r + 1;
      while (nextRow < R && layout[nextRow][c] !== 0) {
        const nextTile = board[nextRow][c];
        if (nextTile && nextTile.letter === tile.letter) {
          matchCoords.push({ r: nextRow, c });
          nextRow++;
        } else {
          break;
        }
      }

      if (matchCoords.length >= 3) {
        matchGroups.push({
          coords: matchCoords,
          letter: tile.letter,
          type: 'VERT'
        });
        r = nextRow;
      } else {
        r++;
      }
    }
  }

  return matchGroups;
}

// Evaluate matches and special tile upgrades (e.g. creating blasters or hyper exploders)
// returns: { boardWithUpgrades, eliminatedCoordinatesSet, specialFiredCount }
export function processMatchesAndGenerateSpecials(
  board: GridCell[][],
  matchGroups: MatchGroup[],
  swappedCoords: { r1: number; c1: number; r2: number; c2: number } | null
): {
  newBoard: GridCell[][];
  eliminatedCoords: { r: number; c: number }[];
  blastersCreatedCount: number;
  hyperExplodersCreatedCount: number;
} {
  const R = board.length;
  const C = board[0].length;
  
  // Clone board
  const newBoard: GridCell[][] = board.map(row => 
    row.map(cell => cell ? { ...cell } : null)
  );

  let blastersCreatedCount = 0;
  let hyperExplodersCreatedCount = 0;
  const eliminatedCoordsMap: { [key: string]: boolean } = {};
  const eliminatedCoordsList: { r: number; c: number }[] = [];

  // We want to reward the player by generating a special item in the coordinates
  // representing what they swapped, or the center element of the match group vector.
  const createSpecialAt = (r: number, c: number, effect: SpecialEffect) => {
    const tile = newBoard[r][c];
    if (tile) {
      tile.special = effect;
      tile.isEliminating = false; // Preserve it!
      // Revoke immediate elimination since it's upgraded
      const key = `${r}_${c}`;
      delete eliminatedCoordsMap[key];
    }
  };

  // Find priority coordinates to place created special tiles (e.g., cell swapped by user)
  const isPriorityCoord = (r: number, c: number): boolean => {
    if (!swappedCoords) return false;
    return (r === swappedCoords.r1 && c === swappedCoords.c1) || 
           (r === swappedCoords.r2 && c === swappedCoords.c2);
  };

  // We loop matches to flag coordinates for deletion, and generate special tiles
  for (const group of matchGroups) {
    const isFiveMatch = group.coords.length >= 5;
    const isFourMatch = group.coords.length === 4;
    const isThreeMatch = group.coords.length === 3;

    // Identify standard coordinates to designate upgrade
    let upgradeCell = group.coords[Math.floor(group.coords.length / 2)];
    // If the user's active swapper coordinates intersect this match group, put the upgrade there!
    for (const coord of group.coords) {
      if (isPriorityCoord(coord.r, coord.c)) {
        upgradeCell = coord;
        break;
      }
    }

    // Flag all as eliminated
    for (const coord of group.coords) {
      const key = `${coord.r}_${coord.c}`;
      eliminatedCoordsMap[key] = true;
    }

    // Award specials with generous rates
    if (isFiveMatch) {
      // High combo: Create HYPER_EXPLODER (Neon rainbow block)
      createSpecialAt(upgradeCell.r, upgradeCell.c, 'HYPER_EXPLODER');
      hyperExplodersCreatedCount++;
    } else if (isFourMatch) {
      // Match 4: Create Row/Col blast depending on scan type
      const effect = group.type === 'HORIZ' ? 'ROW_BLASTER' : 'COL_BLASTER';
      createSpecialAt(upgradeCell.r, upgradeCell.c, effect);
      blastersCreatedCount++;
    }
  }

  // --- Start Custom Special Generation Logic ---
  // A. "如果出现两个平行的两列或者两行[xxx]，则自动生成一个带炸弹的图片 (BOMB)"
  // B. "如果出现至少两个垂直的[xxx], 则自动生成一个0.png (HYPER_EXPLODER)"
  
  const horizGroups = matchGroups.filter(g => g.type === 'HORIZ');
  const vertGroups = matchGroups.filter(g => g.type === 'VERT');

  const countHoriz = horizGroups.length;
  const countVert = vertGroups.length;

  const hasParallelMatch = countHoriz >= 2 || countVert >= 2;
  const hasPerpendicularMatch = countHoriz >= 1 && countVert >= 1;

  // Gather all matched coordinates so we can find clean tiles (special === 'NONE') for new specials
  const allMatchedCoords: { r: number; c: number }[] = [];
  const allCoordsMap = new Set<string>();
  for (const group of matchGroups) {
    for (const coord of group.coords) {
      const key = `${coord.r}_${coord.c}`;
      if (!allCoordsMap.has(key)) {
        allCoordsMap.add(key);
        allMatchedCoords.push(coord);
      }
    }
  }

  // Helper inside to choose best tile to place special on
  const getBestTargetCoord = (
    coords: { r: number; c: number }[],
    fallbackCoords: { r: number; c: number }[],
    excludeCoord?: { r: number; c: number } | null
  ): { r: number; c: number } | null => {
    const isExcluded = (co: { r: number; c: number }) => {
      return excludeCoord !== undefined && excludeCoord !== null && co.r === excludeCoord.r && co.c === excludeCoord.c;
    };

    // 1. Try prioritized swapper coordinate that is in the given list AND has special === 'NONE'
    if (swappedCoords) {
      for (const coord of coords) {
        if (isExcluded(coord)) continue;
        if ((coord.r === swappedCoords.r1 && coord.c === swappedCoords.c1) ||
            (coord.r === swappedCoords.r2 && coord.c === swappedCoords.c2)) {
          const tile = newBoard[coord.r][coord.c];
          if (tile && tile.special === 'NONE') {
            return coord;
          }
        }
      }
    }
    // 2. Try any coordinate in the given list that has special === 'NONE'
    for (const coord of coords) {
      if (isExcluded(coord)) continue;
      const tile = newBoard[coord.r][coord.c];
      if (tile && tile.special === 'NONE') {
        return coord;
      }
    }
    // 3. Fallback to prioritized swapper coordinate with any state
    if (swappedCoords) {
      for (const coord of coords) {
        if (isExcluded(coord)) continue;
        if ((coord.r === swappedCoords.r1 && coord.c === swappedCoords.c1) ||
            (coord.r === swappedCoords.r2 && coord.c === swappedCoords.c2)) {
          return coord;
        }
      }
    }
    // 4. Fallback to any coordinate in the given list
    for (const coord of coords) {
      if (!isExcluded(coord)) {
        return coord;
      }
    }
    // 5. Try fallbackCoords that has special === 'NONE'
    for (const coord of fallbackCoords) {
      if (isExcluded(coord)) continue;
      const tile = newBoard[coord.r][coord.c];
      if (tile && tile.special === 'NONE') {
        return coord;
      }
    }
    // 6. Hard fallback to raw fallbackCoords
    for (const coord of fallbackCoords) {
      if (!isExcluded(coord)) {
        return coord;
      }
    }
    return null;
  };

  let hyperTarget: { r: number; c: number } | null = null;
  let bombTarget: { r: number; c: number } | null = null;

  if (hasPerpendicularMatch) {
    // Determine overlapping intersection coordinates for perpendicular T/L/cross matches
    const intersectionCoords: { r: number; c: number }[] = [];
    for (const hg of horizGroups) {
      for (const hc of hg.coords) {
        for (const vg of vertGroups) {
          for (const vc of vg.coords) {
            if (hc.r === vc.r && hc.c === vc.c) {
              if (!intersectionCoords.some(co => co.r === hc.r && co.c === hc.c)) {
                intersectionCoords.push(hc);
              }
            }
          }
        }
      }
    }

    hyperTarget = getBestTargetCoord(intersectionCoords, allMatchedCoords);
    if (hyperTarget) {
      createSpecialAt(hyperTarget.r, hyperTarget.c, 'HYPER_EXPLODER');
      hyperExplodersCreatedCount++;
    }
  }

  if (hasParallelMatch) {
    let parallelCoords: { r: number; c: number }[] = [];
    if (countHoriz >= 2) {
      for (const hg of horizGroups) {
        parallelCoords.push(...hg.coords);
      }
    } else if (countVert >= 2) {
      for (const vg of vertGroups) {
        parallelCoords.push(...vg.coords);
      }
    }

    const dedupParallel: { r: number; c: number }[] = [];
    const parallelSet = new Set<string>();
    for (const co of parallelCoords) {
      if (hyperTarget && co.r === hyperTarget.r && co.c === hyperTarget.c) {
        continue;
      }
      const key = `${co.r}_${co.c}`;
      if (!parallelSet.has(key)) {
        parallelSet.add(key);
        dedupParallel.push(co);
      }
    }

    bombTarget = getBestTargetCoord(dedupParallel, allMatchedCoords, hyperTarget);
    if (bombTarget) {
      createSpecialAt(bombTarget.r, bombTarget.c, 'BOMB');
    }
  }
  // --- End Custom Special Generation Logic ---

  // Convert map to coordinate list, but make sure we skip upgraded elements
  for (const rStr in Array.from({length: R})) {
    const r = parseInt(rStr);
    for (let c = 0; c < C; c++) {
      const key = `${r}_${c}`;
      if (eliminatedCoordsMap[key]) {
        // Double check no active special upgrade preserves it
        const tile = newBoard[r][c];
        if (tile && !tile.isEliminating) {
          eliminatedCoordsList.push({ r, c });
        }
      }
    }
  }

  return {
    newBoard,
    eliminatedCoords: eliminatedCoordsList,
    blastersCreatedCount,
    hyperExplodersCreatedCount
  };
}

// Triggers active row, col, hyper blasters recursively to accumulate matches.
// This supports fantastic chain reactions!
export function triggerExplosions(
  board: GridCell[][],
  startCoords: { r: number; c: number }[],
  layout: number[][]
): {
  finalEliminated: { r: number; c: number; actionTriggered: SpecialEffect; letter: Letter }[];
  iceBrokenCount: number;
} {
  const R = board.length;
  const C = board[0].length;
  
  // Flag states
  const visited = Array(R).fill(null).map(() => Array(C).fill(false));
  const queue: { r: number; c: number; trigger: SpecialEffect }[] = [];
  const finalEliminated: { r: number; c: number; actionTriggered: SpecialEffect; letter: Letter }[] = [];
  let iceBrokenCount = 0;

  // Enqueue initial matches
  for (const coord of startCoords) {
    if (coord.r >= 0 && coord.r < R && coord.c >= 0 && coord.c < C) {
      if (!visited[coord.r][coord.c]) {
        visited[coord.r][coord.c] = true;
        const tile = board[coord.r][coord.c];
        if (tile) {
          queue.push({ r: coord.r, c: coord.c, trigger: 'NONE' });
        }
      }
    }
  }

  // Chain breaker helper: triggers line blasts if hit
  while (queue.length > 0) {
    const current = queue.shift()!;
    const tile = board[current.r][current.c];
    if (!tile) continue;

    // Report this tile as cleared
    finalEliminated.push({
      r: current.r,
      c: current.c,
      actionTriggered: tile.special,
      letter: tile.letter
    });

    // Check adjacent cells for frozen ice blocker layers
    const directions = [
      [-1, 0], [1, 0], [0, -1], [0, 1]
    ];
    for (const [dr, dc] of directions) {
      const nr = current.r + dr;
      const nc = current.c + dc;
      if (nr >= 0 && nr < R && nc >= 0 && nc < C) {
        const neighbor = board[nr][nc];
        if (neighbor && neighbor.isLocked) {
          // Break its ice!
          neighbor.isLocked = false;
          iceBrokenCount++;
        }
      }
    }

    // Now, if this tile has specials, trigger them instantly
    if (tile.special === 'ROW_BLASTER') {
      const r = current.r;
      for (let cScan = 0; cScan < C; cScan++) {
        if (layout[r][cScan] !== 0 && !visited[r][cScan]) {
          visited[r][cScan] = true;
          const target = board[r][cScan];
          if (target) {
            queue.push({ r, c: cScan, trigger: 'ROW_BLASTER' });
          }
        }
      }
    } else if (tile.special === 'COL_BLASTER') {
      const c = current.c;
      for (let rScan = 0; rScan < R; rScan++) {
        if (layout[rScan][c] !== 0 && !visited[rScan][c]) {
          visited[rScan][c] = true;
          const target = board[rScan][c];
          if (target) {
            queue.push({ r: rScan, c, trigger: 'COL_BLASTER' });
          }
        }
      }
    } else if (tile.special === 'HYPER_EXPLODER') {
      // Find all tiles on board with SAME letter matching this, and destroy them too!
      const letterToMatch = tile.letter;
      for (let rScan = 0; rScan < R; rScan++) {
        for (let cScan = 0; cScan < C; cScan++) {
          if (layout[rScan][cScan] !== 0 && !visited[rScan][cScan]) {
            const target = board[rScan][cScan];
            if (target && target.letter === letterToMatch) {
              visited[rScan][cScan] = true;
              queue.push({ r: rScan, c: cScan, trigger: 'HYPER_EXPLODER' });
            }
          }
        }
      }
    } else if (tile.special === 'BOMB') {
      // Find all adjacent cells within 8 directions (up-to-8 neighbors)
      const offsets = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1]
      ];
      for (const [dr, dc] of offsets) {
        const nr = current.r + dr;
        const nc = current.c + dc;
        if (nr >= 0 && nr < R && nc >= 0 && nc < C) {
          if (layout[nr][nc] !== 0 && !visited[nr][nc]) {
            visited[nr][nc] = true;
            const target = board[nr][nc];
            if (target) {
              queue.push({ r: nr, c: nc, trigger: 'BOMB' });
            }
          }
        }
      }
    }
    
    // Also if the matched cell is actually frozen, unfreeze it!
    if (tile.isLocked) {
      tile.isLocked = false;
      iceBrokenCount++;
    }
  }

  return {
    finalEliminated,
    iceBrokenCount
  };
}

// Slide remaining blocks down, and generate falling ones from top
export function applyGravityAndSpawn(
  board: GridCell[][],
  level: LevelConfig
): {
  newBoard: GridCell[][];
  spawnedCount: number;
} {
  const layout = level.layout;
  const R = board.length;
  const C = board[0].length;

  // Clone board
  const newBoard: GridCell[][] = board.map(row => 
    row.map(cell => cell ? { ...cell } : null)
  );

  let spawnedCount = 0;

  // Process column by column
  for (let c = 0; c < C; c++) {
    // 1. Let tiles fall down inside playable tracks
    // For irregular shapes, gravity slides down through playable slots
    const playableRows: number[] = [];
    const movablePieces: Tile[] = [];

    for (let r = 0; r < R; r++) {
      if (layout[r][c] !== 0) {
        playableRows.push(r);
        const cell = newBoard[r][c];
        if (cell) {
          // If locked, it cannot move, so keep it in place
          if (cell.isLocked) {
            // Take this row OUT of movable items list
            playableRows.pop();
            continue;
          }
          movablePieces.push(cell);
        }
      }
    }

    // Now rebuild the column playable slots from bottom to top
    let pieceIdx = movablePieces.length - 1;
    for (let i = playableRows.length - 1; i >= 0; i--) {
      const r = playableRows[i];
      if (pieceIdx >= 0) {
        // Place existing piece
        const tile = movablePieces[pieceIdx];
        tile.row = r;
        tile.col = c;
        tile.isNew = false;
        newBoard[r][c] = tile;
        pieceIdx--;
      } else {
        // Generate new falling piece!
        let special: SpecialEffect = 'NONE';
        
        // Dynamic spawn specials
        if (Math.random() < level.initialSpecialProbability * 0.55) {
          const rand = Math.random();
          if (rand < 0.12) special = 'HYPER_EXPLODER';
          else if (rand < 0.60) special = 'ROW_BLASTER';
          else special = 'COL_BLASTER';
        }

        newBoard[r][c] = {
          id: generateId(),
          row: r,
          col: c,
          letter: getRandomLetter(level.allowedLetters),
          special,
          isLocked: false,
          isNew: true
        };
        spawnedCount++;
      }
    }
  }

  return {
    newBoard,
    spawnedCount
  };
}
