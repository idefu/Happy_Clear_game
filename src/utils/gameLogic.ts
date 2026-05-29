/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GridCell, LevelConfig, Tile, Letter, SpecialEffect, PortalPair } from '../types';

export function isPortalCell(r: number, c: number, portals?: PortalPair[]): boolean {
  if (!portals) return false;
  return portals.some(p => (p.r1 === r && p.c1 === c) || (p.r2 === r && p.c2 === c));
}

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
      if (layout[r][c] === 0 || isPortalCell(r, c, level.portals)) {
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

      // Check for locked states and layout obstacles
      const isLocked = layout[r][c] === 2 || layout[r][c] === 3;
      const iceLevel = layout[r][c] === 3 ? 2 : (layout[r][c] === 2 ? 1 : 0);
      const isVined = layout[r][c] === 4;
      const isStone = layout[r][c] === 5;

      // Random starting special effects (HYPER_EXPLODER, ROW_BLASTER, COL_BLASTER)
      let special: SpecialEffect = 'NONE';
      if (!isLocked && !isVined && !isStone && Math.random() < level.initialSpecialProbability * 0.60) {
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
        iceLevel,
        isVined,
        isStone,
        isNew: true
      };
    }
  }

  // Ensure board has at least one valid move, otherwise shuffle
  let activeBoard = board;
  let shuffleAttempts = 0;
  while (!checkPotentialMoves(activeBoard, layout, level.portals) && shuffleAttempts < 10) {
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
  layout: number[][],
  portals?: PortalPair[]
): boolean {
  const R = board.length;
  const C = board[0].length;

  const isP1 = isPortalCell(r1, c1, portals);
  const isP2 = isPortalCell(r2, c2, portals);

  if (isP1 && isP2) return false;

  // Clone current board structure
  const tempBoard: GridCell[][] = board.map(row => 
    row.map(cell => cell ? { ...cell } : null)
  );

  if (isP1 || isP2) {
    // One is a portal swap!
    const p_portal_r = isP1 ? r1 : r2;
    const p_portal_c = isP1 ? c1 : c2;
    const r1_orig = isP1 ? r2 : r1;
    const c1_orig = isP1 ? c2 : c1;

    const t1 = tempBoard[r1_orig][c1_orig];
    if (!t1 || t1.isLocked || t1.isVined || t1.isStone) return false;

    // Find partner portal coordinate
    const pair = portals?.find(p => (p.r1 === p_portal_r && p.c1 === p_portal_c) || (p.r2 === p_portal_r && p.c2 === p_portal_c));
    if (!pair) return false;

    const rt = (p_portal_r === pair.r1 && p_portal_c === pair.c1) ? pair.r2 : pair.r1;
    const ct = (p_portal_r === pair.r1 && p_portal_c === pair.c1) ? pair.c2 : pair.c1;

    // Apply teleport swap within tempBoard
    tempBoard[rt][ct] = { ...t1, row: rt, col: ct };
    tempBoard[r1_orig][c1_orig] = null;
    tempBoard[p_portal_r][p_portal_c] = null;

    // Check if the teleport target (rt, ct) forms a match!
    const matches = scanMatches(tempBoard, layout);
    return matches.some(g => g.coords.some(coord => coord.r === rt && coord.c === ct));
  }

  // Normal Swap
  const t1 = tempBoard[r1][c1];
  const t2 = tempBoard[r2][c2];

  if (!t1 || !t2 || t1.isLocked || t2.isLocked || t1.isVined || t2.isVined || t1.isStone || t2.isStone) return false;

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
        if (b0 && b1 && b2 && !b0.isStone && !b1.isStone && !b2.isStone && b0.letter === b1.letter && b1.letter === b2.letter) {
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
        if (b0 && b1 && b2 && !b0.isStone && !b1.isStone && !b2.isStone && b0.letter === b1.letter && b1.letter === b2.letter) {
          return true;
        }
      }
    }
  }

  return false;
}

// Scans entire grid to find if there are ANY potential valid match-3 swaps.
export function checkPotentialMoves(board: GridCell[][], layout: number[][], portals?: PortalPair[]): boolean {
  const R = board.length;
  const C = board[0].length;

  for (let r = 0; r < R; r++) {
    for (let c = 0; c < C; c++) {
      // Try swapping right
      if (c + 1 < C) {
        if (checkMatchAfterSwap(board, r, c, r, c + 1, layout, portals)) {
          return true;
        }
      }

      // Try swapping down
      if (r + 1 < R) {
        if (checkMatchAfterSwap(board, r, c, r + 1, c, layout, portals)) {
          return true;
        }
      }
    }
  }
  return false;
}

// Scans and returns all possible swaps that lead to matches.
export function findPotentialMoves(board: GridCell[][], layout: number[][], portals?: PortalPair[]): { r1: number; c1: number; r2: number; c2: number }[] {
  const R = board.length;
  const C = board[0].length;
  const moves: { r1: number; c1: number; r2: number; c2: number }[] = [];

  for (let r = 0; r < R; r++) {
    for (let c = 0; c < C; c++) {
      // Try swapping right
      if (c + 1 < C) {
        if (checkMatchAfterSwap(board, r, c, r, c + 1, layout, portals)) {
          moves.push({ r1: r, c1: c, r2: r, c2: c + 1 });
        }
      }

      // Try swapping down
      if (r + 1 < R) {
        if (checkMatchAfterSwap(board, r, c, r + 1, c, layout, portals)) {
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
        if (cell && !cell.isLocked && !cell.isVined && !cell.isStone) {
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
        if (cell && !cell.isLocked && !cell.isVined && !cell.isStone) {
          cell.letter = movableTiles[listIdx].letter;
          cell.special = movableTiles[listIdx].special;
          listIdx++;
        }
      }
    }

    // Check if this shuffle avoids direct matches but permits potential moves
    const matchFree = !hasAnyMatch(activeBoard, layout);
    const hasMove = checkPotentialMoves(activeBoard, layout, level.portals);
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
      if (!tile || layout[r][c] === 0 || tile.isStone) {
        c++;
        continue;
      }

      const matchCoords = [{ r, c }];
      let nextCol = c + 1;
      while (nextCol < C && layout[r][nextCol] !== 0) {
        const nextTile = board[r][nextCol];
        if (nextTile && !nextTile.isStone && nextTile.letter === tile.letter) {
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
      if (!tile || layout[r][c] === 0 || tile.isStone) {
        r++;
        continue;
      }

      const matchCoords = [{ r, c }];
      let nextRow = r + 1;
      while (nextRow < R && layout[nextRow][c] !== 0) {
        const nextTile = board[nextRow][c];
        if (nextTile && !nextTile.isStone && nextTile.letter === tile.letter) {
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
  bombsCreatedCount: number;
} {
  const R = board.length;
  const C = board[0].length;
  
  // Clone board
  const newBoard: GridCell[][] = board.map(row => 
    row.map(cell => cell ? { ...cell } : null)
  );

  let blastersCreatedCount = 0;
  let hyperExplodersCreatedCount = 0;
  let bombsCreatedCount = 0;
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
      bombsCreatedCount++;
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
    hyperExplodersCreatedCount,
    bombsCreatedCount
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
  vinedClearedCount: number;
  stoneClearedCount: number;
  iceDamaged: boolean;
} {
  const R = board.length;
  const C = board[0].length;
  
  // Flag states
  const visited = Array(R).fill(null).map(() => Array(C).fill(false));
  const queue: { r: number; c: number; trigger: SpecialEffect }[] = [];
  const finalEliminated: { r: number; c: number; actionTriggered: SpecialEffect; letter: Letter }[] = [];
  let iceBrokenCount = 0;
  let vinedClearedCount = 0;
  let stoneClearedCount = 0;
  let iceDamaged = false;

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

    let shouldEliminate = true;

    // Check if the tile itself has a vine.
    // "有藤曼的参与消除一次才会解锁藤曼，但设定上自身仍然存在并没有消失，当再次参与消除才会消除"
    if (tile.isVined) {
      tile.isVined = false;
      vinedClearedCount++;
      shouldEliminate = false; // The vine is dissolved; the tile itself survives!
    }

    // Check if the tile itself has ice.
    // "冰块设定是要参与两次消除才会消除冰块，有很多情况发现只消除一次就消失了"
    if (tile.isLocked) {
      iceDamaged = true;
      if (tile.iceLevel === 2) {
        tile.iceLevel = 1;
        shouldEliminate = false; // Double-ice cracks to single-ice; tile survives!
      } else {
        tile.isLocked = false;
        tile.iceLevel = 0;
        iceBrokenCount++;
        // Single-ice is fully shattered; tile gets eliminated (so shouldEliminate is true)!
      }
    }

    // Check if the tile itself has stone.
    if (tile.isStone) {
      tile.isStone = false;
      stoneClearedCount++;
    }

    // Check adjacent cells for frozen ice blocker layers or stone blockers or vines
    const directions = [
      [-1, 0], [1, 0], [0, -1], [0, 1]
    ];
    for (const [dr, dc] of directions) {
      const nr = current.r + dr;
      const nc = current.c + dc;
      if (nr >= 0 && nr < R && nc >= 0 && nc < C) {
        const neighbor = board[nr][nc];
        if (neighbor) {
          // A. Crack / Reveal Stone
          if (neighbor.isStone) {
            neighbor.isStone = false;
            neighbor.isNew = true; // Trigger reveal spark
            stoneClearedCount++;
          }
          // B. Shatter Ice (handles double ice layer)
          else if (neighbor.isLocked) {
            iceDamaged = true;
            if (neighbor.iceLevel === 2) {
              neighbor.iceLevel = 1;
            } else {
              neighbor.isLocked = false;
              neighbor.iceLevel = 0;
              iceBrokenCount++;
            }
          }
          // C. Dissolve neighboring vine
          else if (neighbor.isVined) {
            neighbor.isVined = false;
            vinedClearedCount++;
          }
        }
      }
    }

    if (shouldEliminate) {
      // Report this tile as cleared
      finalEliminated.push({
        r: current.r,
        c: current.c,
        actionTriggered: tile.special,
        letter: tile.letter
      });

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
    }
  }

  return {
    finalEliminated,
    iceBrokenCount,
    vinedClearedCount,
    stoneClearedCount,
    iceDamaged
  };
}

// Slide remaining blocks down, and generate falling ones from top
export function applyGravityAndSpawn(
  board: GridCell[][],
  level: LevelConfig,
  noSpecialSpawns?: boolean,
  playerCreatedSpecialsCount?: number
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
      if (layout[r][c] !== 0 && !isPortalCell(r, c, level.portals)) {
        playableRows.push(r);
        const cell = newBoard[r][c];
        if (cell) {
          // If locked, vined, or rocky, it cannot move, so keep it in place
          if (cell.isLocked || cell.isVined || cell.isStone) {
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
        if (!noSpecialSpawns && Math.random() < level.initialSpecialProbability * 0.55) {
          const rand = Math.random();
          if (rand < 0.12) special = 'HYPER_EXPLODER';
          else if (rand < 0.60) special = 'ROW_BLASTER';
          else special = 'COL_BLASTER';
        }

        // To reduce the auto-combo probability, pick a letter that doesn't immediately match with neighbors if possible
        let chosenLetter = getRandomLetter(level.allowedLetters);
        
        // Calculate dynamic influence of player-created specials on combo probability
        const specials = playerCreatedSpecialsCount || 0;
        
        // 1. Skip anti-match check entirely with a progressive probability (starts at 2+)
        let skipAntiMatch = false;
        if (specials >= 2) {
          // Progressively scaled probability starting at 2 specials:
          // 2 -> 7.5%, 3 -> 15%, 4 -> 22.5%, 5 -> 30%, 6 -> 37.5%, 7 -> 45%, etc., max 70%
          const skipThreshold = Math.min(0.70, (specials - 1) * 0.075);
          if (Math.random() < skipThreshold) {
            skipAntiMatch = true;
          }
        }

        // 2. Lucky Match Assist: Actively bias the letter to match neighboring cells (only when specials >= 4)
        // This is a subtle nudge to create beautiful chains
        if (specials >= 4) {
          // Assist rate starting at 4 specials:
          // 4 -> 5%, 5 -> 10%, 6 -> 15%, 7 -> 20%, 8 -> 25%, 9 -> 30%, 10+ -> up to 45%
          const assistThreshold = Math.min(0.45, (specials - 3) * 0.05);
          if (Math.random() < assistThreshold) {
            // Collect any valid neighbor letters
            const neighborLetters: Letter[] = [];
            const blockLeft = c >= 1 ? newBoard[r][c - 1] : null;
            const blockRight = c < C - 1 ? newBoard[r][c + 1] : null;
            const blockUp = r >= 1 ? newBoard[r - 1][c] : null;
            const blockDown = r < R - 1 ? newBoard[r + 1][c] : null;

            if (blockLeft && level.allowedLetters.includes(blockLeft.letter)) neighborLetters.push(blockLeft.letter);
            if (blockRight && level.allowedLetters.includes(blockRight.letter)) neighborLetters.push(blockRight.letter);
            if (blockUp && level.allowedLetters.includes(blockUp.letter)) neighborLetters.push(blockUp.letter);
            if (blockDown && level.allowedLetters.includes(blockDown.letter)) neighborLetters.push(blockDown.letter);

            if (neighborLetters.length > 0) {
              // Pick one of the neighbor letters to spawn! Highly likely to cascade
              chosenLetter = neighborLetters[Math.floor(Math.random() * neighborLetters.length)];
              skipAntiMatch = true; // Naturally bypass the anti-match check
            }
          }
        }

        let attempts = 0;
        // If skipAntiMatch is true, we set maxAttempts = 0, bypassing the loop completely and spawning the match-favoring block!
        const maxAttempts = skipAntiMatch ? 0 : 15;

        while (attempts < maxAttempts) {
          // Horizontal checks (using newBoard):
          const blockLeft1 = c >= 1 ? newBoard[r][c - 1] : null;
          const blockLeft2 = c >= 2 ? newBoard[r][c - 2] : null;
          const blockRight1 = c < C - 1 ? newBoard[r][c + 1] : null;
          const blockRight2 = c < C - 2 ? newBoard[r][c + 2] : null;

          const hasHorizMatchLeft = blockLeft1 && blockLeft2 && blockLeft1.letter === chosenLetter && blockLeft2.letter === chosenLetter;
          const hasHorizMatchRight = blockRight1 && blockRight2 && blockRight1.letter === chosenLetter && blockRight2.letter === chosenLetter;
          const hasHorizMatchMiddle = blockLeft1 && blockRight1 && blockLeft1.letter === chosenLetter && blockRight1.letter === chosenLetter;

          // Vertical checks:
          const blockUp1 = r >= 1 ? newBoard[r - 1][c] : null;
          const blockUp2 = r >= 2 ? newBoard[r - 2][c] : null;
          const blockDown1 = r < R - 1 ? newBoard[r + 1][c] : null;
          const blockDown2 = r < R - 2 ? newBoard[r + 2][c] : null;

          const hasVertMatchUp = blockUp1 && blockUp2 && blockUp1.letter === chosenLetter && blockUp2.letter === chosenLetter;
          const hasVertMatchDown = blockDown1 && blockDown2 && blockDown1.letter === chosenLetter && blockDown2.letter === chosenLetter;
          const hasVertMatchMiddle = blockUp1 && blockDown1 && blockUp1.letter === chosenLetter && blockDown1.letter === chosenLetter;

          if (!hasHorizMatchLeft && !hasHorizMatchRight && !hasHorizMatchMiddle &&
              !hasVertMatchUp && !hasVertMatchDown && !hasVertMatchMiddle) {
            break;
          }
          chosenLetter = getRandomLetter(level.allowedLetters);
          attempts++;
        }

        newBoard[r][c] = {
          id: generateId(),
          row: r,
          col: c,
          letter: chosenLetter,
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
