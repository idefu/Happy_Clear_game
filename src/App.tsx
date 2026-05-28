/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { LEVELS } from './data/levels';
import { GameState, GridCell, LevelConfig, Letter, SpecialEffect } from './types';
import { createInitialBoard, scanMatches, processMatchesAndGenerateSpecials, triggerExplosions, applyGravityAndSpawn, checkPotentialMoves, shuffleEntireBoard } from './utils/gameLogic';
import ScoreBoard from './components/ScoreBoard';
import GameBoard from './components/GameBoard';
import LevelSelector from './components/LevelSelector';
import WinLoseModal from './components/WinLoseModal';
import { sound } from './utils/sound';
import { Volume2, VolumeX, Sparkles, RefreshCcw, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default function App() {
  // Navigation states
  const [activeLevel, setActiveLevel] = useState<LevelConfig | null>(null);
  const currentLevelRef = useRef<LevelConfig | null>(null);
  currentLevelRef.current = activeLevel;

  // Sound settings
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Persistence local highscores
  const [highScores, setHighScores] = useState<{ [key: number]: number }>(() => {
    try {
      const saved = localStorage.getItem('alphabet_match_highscores');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Game board live metrics state
  const [board, setBoard] = useState<GridCell[][]>([]);
  const [score, setScore] = useState(0);
  const [movesRemaining, setMovesRemaining] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [isLost, setIsLost] = useState(false);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Stored details of elements eliminated in the latest cascade to trigger canvas sparkles
  const [deletedPoints, setDeletedPoints] = useState<{ r: number; c: number; actionTriggered: SpecialEffect; letter: Letter }[]>([]);

  // Track objectives progress
  const [goalsProgress, setGoalsProgress] = useState<{
    iceCleared: number;
    totalEliminations: number;
    maxComboAchieved: number;
    letterClearedCount: { [key in Letter]?: number };
  }>({
    iceCleared: 0,
    totalEliminations: 0,
    maxComboAchieved: 0,
    letterClearedCount: {}
  });

  // Display reshuffling alert banner
  const [showShuffleToast, setShowShuffleToast] = useState(false);

  // Ice block click highlight tracker
  const [isIceHighlighted, setIsIceHighlighted] = useState(false);
  const iceHighlightTimeoutRef = useRef<any>(null);

  const handleIceClicked = () => {
    if (iceHighlightTimeoutRef.current) {
      clearTimeout(iceHighlightTimeoutRef.current);
    }
    sound.playSwap(); // Play confirmation sonar chime
    setIsIceHighlighted(true);
    iceHighlightTimeoutRef.current = setTimeout(() => {
      setIsIceHighlighted(false);
    }, 2200);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (iceHighlightTimeoutRef.current) {
        clearTimeout(iceHighlightTimeoutRef.current);
      }
    };
  }, []);

  // Sync Audio Setting
  useEffect(() => {
    sound.toggleSound(soundEnabled);
  }, [soundEnabled]);

  // High score writer helper
  const updateHighScore = (levelId: number, finalScoreVal: number) => {
    setHighScores(prev => {
      const existing = prev[levelId] || 0;
      if (finalScoreVal > existing) {
        const nextScores = { ...prev, [levelId]: finalScoreVal };
        try {
          localStorage.setItem('alphabet_match_highscores', JSON.stringify(nextScores));
        } catch (e) {
          console.error(e);
        }
        setIsNewHighScore(true);
        return nextScores;
      }
      setIsNewHighScore(false);
      return prev;
    });
  };

  // Launch a selected level and configure starting layout
  const handleSelectLevel = (levelId: number) => {
    const targetLvl = LEVELS.find(l => l.id === levelId) || LEVELS[0];
    setActiveLevel(targetLvl);

    // Initial board setup
    const startingBoard = createInitialBoard(targetLvl);
    setBoard(startingBoard);
    
    // Set game stats
    setScore(0);
    setMovesRemaining(targetLvl.movesLimit);
    setIsWon(false);
    setIsLost(false);
    setIsAnimating(false);
    setIsNewHighScore(false);
    setDeletedPoints([]);

    setGoalsProgress({
      iceCleared: 0,
      totalEliminations: 0,
      maxComboAchieved: 0,
      letterClearedCount: {}
    });
  };

  // Reset current levels
  const handleResetLevel = () => {
    if (activeLevel) {
      handleSelectLevel(activeLevel.id);
    }
  };

  // Switch back to level select hallway
  const handleBackToMenu = () => {
    setActiveLevel(null);
  };

  // Evaluate if specified special goals met
  const checkIsGoalsCompleted = (
    currentScore: number,
    iceCountCleared: number,
    totalEliminationsCleared: number,
    maxComboAchieved: number,
    letterClearsMap: { [key in Letter]?: number }
  ): boolean => {
    if (!activeLevel) return false;

    // 1. Core Points Requirement
    if (currentScore < activeLevel.scoreGoal) return false;

    // 2. Extra Speciel conditions Checks (Ice broken, custom letters matched)
    if (activeLevel.specialGoals) {
      const goals = activeLevel.specialGoals;

      if (goals.iceCount !== undefined) {
        if (iceCountCleared < goals.iceCount) return false;
      }

      if (goals.totalEliminations !== undefined) {
        if (totalEliminationsCleared < goals.totalEliminations) return false;
      }

      if (goals.maxCombo !== undefined) {
        if (maxComboAchieved < goals.maxCombo) return false;
      }

      if (goals.letter) {
        for (const letKey in goals.letter) {
          const lTyped = letKey as Letter;
          const target = goals.letter[lTyped] || 0;
          const current = letterClearsMap[lTyped] || 0;
          if (current < target) return false;
        }
      }
    }

    return true;
  };

  // Deadlock autoshuffle handler
  const handleAutoReshuffle = async (currentBoard: GridCell[][]) => {
    if (!activeLevel) return;
    const initialLevelId = activeLevel.id;
    setIsAnimating(true);
    setShowShuffleToast(true);
    sound.playShuffle();
    
    await sleep(1500); // Allow player to read instructions banner
    if (!currentLevelRef.current || currentLevelRef.current.id !== initialLevelId) return;

    if (activeLevel) {
      const shuffled = shuffleEntireBoard(currentBoard, activeLevel);
      setBoard(shuffled);
    }
    
    setShowShuffleToast(false);
    setIsAnimating(false);
  };

  // Evaluating post-cascade state for victory/defeat
  const evaluateEndGameStatus = (
    movesLeft: number,
    finalScore: number,
    iceCountCleared: number,
    totalEliminationsCleared: number,
    maxComboAchieved: number,
    letterClearsMap: { [key in Letter]?: number },
    currentBoard: GridCell[][]
  ) => {
    if (!activeLevel) return;

    const gameCompleted = checkIsGoalsCompleted(finalScore, iceCountCleared, totalEliminationsCleared, maxComboAchieved, letterClearsMap);

    if (gameCompleted) {
      sound.playLevelWin();
      setIsWon(true);
      setIsAnimating(false);

      // Score bonus calculations
      const leftOverMovesBonus = movesLeft * 200;
      updateHighScore(activeLevel.id, finalScore + leftOverMovesBonus);
      return;
    }

    // Out of moves - Game over
    if (movesLeft <= 0) {
      sound.playLevelLose();
      setIsLost(true);
      setIsAnimating(false);
      return;
    }

    // Moves left is OK, check if grid has deadlocks
    if (!checkPotentialMoves(currentBoard, activeLevel.layout)) {
      handleAutoReshuffle(currentBoard);
    } else {
      setIsAnimating(false);
    }
  };

  // ASYMMETRIC CASCADING SOLVER LOOP
  const handleSwapAction = async (r1: number, c1: number, r2: number, c2: number) => {
    if (isAnimating || !activeLevel) return;
    const initialLevelId = activeLevel.id;
    setIsAnimating(true);

    // 1. Temporarily swap two nodes inside local copy
    let workingBoard = board.map(row => row.map(cell => cell ? { ...cell } : null));
    const t1 = workingBoard[r1][c1]!;
    const t2 = workingBoard[r2][c2]!;

    // Reapply coordinates
    workingBoard[r1][c1] = { ...t2, row: r1, col: c1 };
    workingBoard[r2][c2] = { ...t1, row: r2, col: c2 };
    setBoard(workingBoard);
    sound.playSwap();

    await sleep(250); // visual transit
    if (!currentLevelRef.current || currentLevelRef.current.id !== initialLevelId) return;

    // 2. Scan standard Match 3 line connections
    const matchGroups = scanMatches(workingBoard, activeLevel.layout);

    const isHyperExploderSwap = (t1.special === 'HYPER_EXPLODER' || t2.special === 'HYPER_EXPLODER');
    const isDualSpecialSwap = (t1.special !== 'NONE' && t2.special !== 'NONE');

    if (matchGroups.length === 0 && !isDualSpecialSwap && !isHyperExploderSwap) {
      // Swapping is invalid! Restore coordinates
      workingBoard = workingBoard.map(row => row.map(cell => cell ? { ...cell } : null));
      const rt1 = workingBoard[r1][c1]!;
      const rt2 = workingBoard[r2][c2]!;
      workingBoard[r1][c1] = { ...rt2, row: r1, col: c1 };
      workingBoard[r2][c2] = { ...rt1, row: r2, col: c2 };
      setBoard(workingBoard);
      sound.playBounce();
      
      await sleep(250);
      if (!currentLevelRef.current || currentLevelRef.current.id !== initialLevelId) return;
      setIsAnimating(false);
      return;
    }

    // Valid move! Standard loop solves cascades
    let comboCount = 0;
    let currentScore = score;
    let localIceCleared = goalsProgress.iceCleared;
    let localTotalEliminations = goalsProgress.totalEliminations;
    let localMaxComboAchieved = goalsProgress.maxComboAchieved;
    const localLettersClearedMap = { ...goalsProgress.letterClearedCount };

    // Set which cell is the primary upgraded receiver cell (from user initial swipe path)
    let swapCoordsToUpgrade: { r1: number; c1: number; r2: number; c2: number } | null = { r1, c1, r2, c2 };

    let dualSpecialActive = isDualSpecialSwap;
    let isHyperSweepActive = isHyperExploderSwap;
    let hyperSweepLetter: Letter | 'ANY' | null = null;
    let hyperExploderCoords: {r: number, c: number}[] = [];

    if (isHyperSweepActive) {
      if (t1.special === 'HYPER_EXPLODER' && t2.special === 'HYPER_EXPLODER') {
        hyperSweepLetter = 'ANY';
      } else {
        hyperSweepLetter = t1.special === 'HYPER_EXPLODER' ? t2.letter : t1.letter;
      }
      if (t1.special === 'HYPER_EXPLODER') hyperExploderCoords.push({ r: r2, c: c2 });
      if (t2.special === 'HYPER_EXPLODER') hyperExploderCoords.push({ r: r1, c: c1 });
    }

    while (matchGroups.length > 0 || dualSpecialActive || isHyperSweepActive || checkHasAnyActiveMatches(workingBoard)) {
      // Recalculating active matches
      const activeMatches = (matchGroups.length > 0 || isHyperSweepActive) ? matchGroups : scanMatches(workingBoard, activeLevel.layout);

      // a. Mark upgrades (Match 4 generates blasters, match 5 generates HyperExploder)
      const { 
        newBoard: boardWithUpgrades, 
        eliminatedCoords, 
        blastersCreatedCount, 
        hyperExplodersCreatedCount 
      } = processMatchesAndGenerateSpecials(workingBoard, activeMatches, swapCoordsToUpgrade);

      // Swapped upgrades are only placed on the first wave!
      swapCoordsToUpgrade = null;

      // Track max combo achieved in this turn
      const currentComboLevel = comboCount + 1;
      if (currentComboLevel > localMaxComboAchieved) {
        localMaxComboAchieved = currentComboLevel;
      }

      // Collect initial explosion triggers, overriding with the two swapped special tiles if dual combo
      let initialExplodeCoords = [...eliminatedCoords];
      if (dualSpecialActive) {
        if (!initialExplodeCoords.some(c => c.r === r1 && c.c === c1)) {
          initialExplodeCoords.push({ r: r1, c: c1 });
        }
        if (!initialExplodeCoords.some(c => c.r === r2 && c.c === c2)) {
          initialExplodeCoords.push({ r: r2, c: c2 });
        }
        dualSpecialActive = false; // reset flag
      }

      // Hyper Exploder color swap sweep:
      if (isHyperSweepActive) {
        // Find all tiles matching the swapped letter
        for (let r = 0; r < workingBoard.length; r++) {
          for (let c = 0; c < workingBoard[r].length; c++) {
            const cell = workingBoard[r][c];
            if (cell) {
              if (hyperSweepLetter === 'ANY' || cell.letter === hyperSweepLetter) {
                if (!initialExplodeCoords.some(coord => coord.r === r && coord.c === c)) {
                  initialExplodeCoords.push({ r, c });
                }
              }
            }
          }
        }
        // Also ensure the hyper exploder cells themselves are added
        hyperExploderCoords.forEach(ec => {
          if (!initialExplodeCoords.some(coord => coord.r === ec.r && coord.c === ec.c)) {
            initialExplodeCoords.push({ r: ec.r, c: ec.c });
          }
        });
        isHyperSweepActive = false; // trigger only once!
      }

      // b. Resolve chain explosions (Row / Col Blasters and Color-bombs recursion!)
      const { finalEliminated, iceBrokenCount } = triggerExplosions(boardWithUpgrades, initialExplodeCoords, activeLevel.layout);

      // Rule 5: If both row blaster and col blaster are triggered in this wave, award a BOMB
      const hadRowBlasterTriggered = finalEliminated.some(pe => pe.actionTriggered === 'ROW_BLASTER');
      const hadColBlasterTriggered = finalEliminated.some(pe => pe.actionTriggered === 'COL_BLASTER');
      const shouldAwardBomb = hadRowBlasterTriggered && hadColBlasterTriggered;

      localIceCleared += iceBrokenCount;
      if (iceBrokenCount > 0) {
        sound.playIceShatter();
      }

      // Check audio cues and update letters statistics
      localTotalEliminations += finalEliminated.length;
      finalEliminated.forEach(pe => {
        localLettersClearedMap[pe.letter] = (localLettersClearedMap[pe.letter] || 0) + 1;
        
        if (pe.actionTriggered === 'ROW_BLASTER' || pe.actionTriggered === 'COL_BLASTER') {
          sound.playLaserBlast();
        } else if (pe.actionTriggered === 'HYPER_EXPLODER' || pe.actionTriggered === 'BOMB') {
          sound.playHyperExplode();
        }
      });

      // points tracking calculations
      let wavePointsGain = 0;
      finalEliminated.forEach(pe => {
        let val = 100 * (1 + comboCount * 0.4); // cascade multiplier incentive
        if (pe.actionTriggered === 'ROW_BLASTER' || pe.actionTriggered === 'COL_BLASTER') {
          val += 50;
        } else if (pe.actionTriggered === 'HYPER_EXPLODER') {
          val += 150;
        } else if (pe.actionTriggered === 'BOMB') {
          val += 120;
        }
        wavePointsGain += val;
      });

      wavePointsGain += iceBrokenCount * 250;
      const wavePointsGainInteger = Math.floor(wavePointsGain);
      currentScore += wavePointsGainInteger;

      // Track points and trigger shrinking animations in DOM
      const transitionTagBoard = boardWithUpgrades.map(row => row.map(cell => cell ? { ...cell } : null));
      const deletionWaveArr: typeof deletedPoints = [];

      finalEliminated.forEach(pe => {
        const cell = transitionTagBoard[pe.r][pe.c];
        if (cell) {
          cell.isEliminating = true;
        }
        deletionWaveArr.push({ r: pe.r, c: pe.c, actionTriggered: pe.actionTriggered, letter: pe.letter });
      });

      setBoard(transitionTagBoard);
      setDeletedPoints(deletionWaveArr);
      sound.playMatch(comboCount);

      setScore(currentScore);
      setGoalsProgress({
        iceCleared: localIceCleared,
        totalEliminations: localTotalEliminations,
        maxComboAchieved: localMaxComboAchieved,
        letterClearedCount: localLettersClearedMap
      });

      await sleep(250); // wait for tiles shrink fadeout
      if (!currentLevelRef.current || currentLevelRef.current.id !== initialLevelId) return;

      // c. Squeeze list and run Gravity Fall calculations
      const boardWithEmptyNulls = transitionTagBoard.map(row =>
         row.map(cell => (cell && cell.isEliminating ? null : cell))
      );

      const { newBoard: boardWithGravitySlide, spawnedCount } = applyGravityAndSpawn(boardWithEmptyNulls, activeLevel);
      let localGravityBoard = boardWithGravitySlide;

      // If bomb awarded, apply BOMB effect to one of the newly spawned tiles
      if (shouldAwardBomb) {
        let upgraded = false;
        // First try: newly spawned standard tile
        for (let r = 0; r < localGravityBoard.length; r++) {
          for (let c = 0; c < localGravityBoard[r].length; c++) {
            const cell = localGravityBoard[r][c];
            if (cell && cell.isNew && cell.special === 'NONE') {
              cell.special = 'BOMB';
              upgraded = true;
              break;
            }
          }
          if (upgraded) break;
        }
        // Second try: any unlocked standard tile
        if (!upgraded) {
          for (let r = 0; r < localGravityBoard.length; r++) {
            for (let c = 0; c < localGravityBoard[r].length; c++) {
              const cell = localGravityBoard[r][c];
              if (cell && !cell.isLocked && cell.special === 'NONE') {
                cell.special = 'BOMB';
                upgraded = true;
                break;
              }
            }
            if (upgraded) break;
          }
        }
      }

      workingBoard = localGravityBoard;
      setBoard(localGravityBoard);
      setDeletedPoints([]); // release canvas vectors

      await sleep(350); // wait for tiles fall anim drop
      if (!currentLevelRef.current || currentLevelRef.current.id !== initialLevelId) return;

      // d. Scan if fall triggered side cascading matches on next iteration
      matchGroups.length = 0; // Clear original array
      const cascadeMatchesFound = scanMatches(workingBoard, activeLevel.layout);
      if (cascadeMatchesFound.length === 0) {
        break;
      }
      comboCount++;
    }

    // Cascades fully completed! Deduct player move limit
    setMovesRemaining(prev => {
      const remaining = prev - 1;
      
      // Delay status evaluation to let latest visuals finish
      setTimeout(() => {
        evaluateEndGameStatus(remaining, currentScore, localIceCleared, localTotalEliminations, localMaxComboAchieved, localLettersClearedMap, workingBoard);
      }, 80);

      return remaining;
    });
  };

  const checkHasAnyActiveMatches = (b: GridCell[][]): boolean => {
    if (!activeLevel) return false;
    const matches = scanMatches(b, activeLevel.layout);
    return matches.length > 0;
  };

  // Switch to next unlockable level mapping
  const handleOpenNextLevel = () => {
    if (activeLevel) {
      const nextId = activeLevel.id + 1;
      const hasNext = LEVELS.find(l => l.id === nextId);
      if (hasNext) {
        handleSelectLevel(nextId);
      } else {
        setActiveLevel(null);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative antialiased bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Absolute background visual ambient details */}
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-indigo-950/20 via-slate-900/0 to-slate-950/0 pointer-events-none" />

      {/* Main Container screen elements */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-2 sm:px-4 py-3 flex flex-col justify-start">
        <AnimatePresence mode="wait">
          {!activeLevel ? (
            /* SELECTOR INTERFACES */
            <motion.div
              key="selector"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="w-full flex-1 flex flex-col justify-center"
            >
              <LevelSelector
                levels={LEVELS}
                onSelectLevel={handleSelectLevel}
                highScores={highScores}
                soundEnabled={soundEnabled}
                onToggleSound={() => setSoundEnabled(!soundEnabled)}
              />
            </motion.div>
          ) : (
            /* ACTIVE MATCH 3 GAME BOARD SCREEN */
            <motion.div
              key="gameplay"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="w-full max-w-5xl mx-auto flex-1 flex flex-col justify-start py-0.5"
            >
              {/* Score HUD statistics panel wrapping GameBoard as children */}
              <ScoreBoard
                level={activeLevel}
                score={score}
                movesRemaining={movesRemaining}
                goalsProgress={goalsProgress}
                isIceHighlighted={isIceHighlighted}
                soundEnabled={soundEnabled}
                onToggleSound={() => setSoundEnabled(!soundEnabled)}
                onResetLevel={handleResetLevel}
                onBackToMenu={handleBackToMenu}
                onIceGoalClick={handleIceClicked}
              >
                {/* Grid cell board */}
                <GameBoard
                  board={board}
                  level={activeLevel}
                  isAnimating={isAnimating}
                  onSwap={handleSwapAction}
                  deletedPoints={deletedPoints}
                  soundEnabled={soundEnabled}
                  onIceClicked={handleIceClicked}
                  isIceHighlightActive={isIceHighlighted}
                />
              </ScoreBoard>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Deadlock Reshuffle Alert toast notifications banner */}
      <AnimatePresence>
        {showShuffleToast && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-cyan-600 to-indigo-600 text-white font-sans text-xs px-5 py-3 rounded-full flex items-center gap-2 shadow-2xl border border-cyan-400/30 font-extrabold"
            id="deadlock-toast-alert"
          >
            <RefreshCcw className="h-4 w-4 animate-spin" />
            <span>🔄 棋盘死局已触发！正在施法魔法重排字母...</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals & Dialog overlays */}

      <AnimatePresence>
        {(isWon || isLost) && activeLevel && (
          <WinLoseModal
            isWon={isWon}
            score={score}
            movesRemaining={movesRemaining}
            level={activeLevel}
            isNewHighScore={isNewHighScore}
            onRetry={handleResetLevel}
            onNextLevel={LEVELS.find(l => l.id === activeLevel.id + 1) ? handleOpenNextLevel : undefined}
            onChooseLevel={handleBackToMenu}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
