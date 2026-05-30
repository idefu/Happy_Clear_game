/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { LEVELS } from './data/levels';
import { GameState, GridCell, LevelConfig, Letter, SpecialEffect } from './types';
import { createInitialBoard, scanMatches, processMatchesAndGenerateSpecials, triggerExplosions, applyGravityAndSpawn, checkPotentialMoves, shuffleEntireBoard, isPortalCell } from './utils/gameLogic';
import ScoreBoard from './components/ScoreBoard';
import GameBoard from './components/GameBoard';
import LevelSelector from './components/LevelSelector';
import WinLoseModal from './components/WinLoseModal';
import { sound } from './utils/sound';
import { Volume2, VolumeX, Sparkles, RefreshCcw, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from './utils/i18n';

// Import assets directly for high-performance preloading
import pic0 from '../pic/0.png';
import pic1 from '../pic/1.png';
import pic2 from '../pic/2.png';
import pic3 from '../pic/3.png';
import pic4 from '../pic/4.png';
import pic5 from '../pic/5.png';
import pic6 from '../pic/6.png';
import startPic from '../pic/start.jpg';
import alipayPic from '../pay/alipay.jpg';
import wechatPic from '../pay/wechat.png';
import flagUsa from '../country/usa.png';
import flagChina from '../country/china.png';
import flagGermany from '../country/germany.png';
import flagJapan from '../country/japan_.png';
import flagIndia from '../country/India.png';
import flagFrance from '../country/france.png';
import flagKorea from '../country/korea.png';
import flagSpain from '../country/Spain.png';
import flagBrazil from '../country/brazil.png';
import flagVietnam from '../country/vietnam.png';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default function App() {
  const { t } = useTranslation();
  // Navigation states
  const [activeLevel, setActiveLevel] = useState<LevelConfig | null>(null);
  const currentLevelRef = useRef<LevelConfig | null>(null);
  currentLevelRef.current = activeLevel;
  const gameRunIdRef = useRef<number>(0);
  const bonusPhaseStartedRef = useRef<boolean>(false);

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
  const [playerCreatedSpecials, setPlayerCreatedSpecials] = useState<number>(0);
  
  // Stored details of elements eliminated in the latest cascade to trigger canvas sparkles
  const [deletedPoints, setDeletedPoints] = useState<{ r: number; c: number; actionTriggered: SpecialEffect; letter: Letter }[]>([]);

  // Track objectives progress
  const [goalsProgress, setGoalsProgress] = useState<{
    iceCleared: number;
    totalEliminations: number;
    maxComboAchieved: number;
    letterClearedCount: { [key in Letter]?: number };
    vinedCleared: number;
    stoneCleared: number;
  }>({
    iceCleared: 0,
    totalEliminations: 0,
    maxComboAchieved: 0,
    letterClearedCount: {},
    vinedCleared: 0,
    stoneCleared: 0
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

  // Vine block click highlight tracker
  const [isVinedHighlighted, setIsVinedHighlighted] = useState(false);
  const vinedHighlightTimeoutRef = useRef<any>(null);

  const handleVinedClicked = () => {
    if (vinedHighlightTimeoutRef.current) {
      clearTimeout(vinedHighlightTimeoutRef.current);
    }
    sound.playSwap(); // Play confirmation sonar chime
    setIsVinedHighlighted(true);
    vinedHighlightTimeoutRef.current = setTimeout(() => {
      setIsVinedHighlighted(false);
    }, 2200);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (iceHighlightTimeoutRef.current) {
        clearTimeout(iceHighlightTimeoutRef.current);
      }
      if (vinedHighlightTimeoutRef.current) {
        clearTimeout(vinedHighlightTimeoutRef.current);
      }
    };
  }, []);

  // Prepreload all images, icons, and flags to ensure 0ms rendering latency and absolutely no flickering
  useEffect(() => {
    const assets = [
      pic0, pic1, pic2, pic3, pic4, pic5, pic6,
      startPic, alipayPic, wechatPic,
      flagUsa, flagChina, flagGermany, flagJapan, flagIndia,
      flagFrance, flagKorea, flagSpain, flagBrazil, flagVietnam
    ];
    // Warm-up browser cache
    assets.forEach(src => {
      const img = new Image();
      img.src = src;
    });
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
    gameRunIdRef.current += 1;
    bonusPhaseStartedRef.current = false;
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
    setPlayerCreatedSpecials(0);

    setGoalsProgress({
      iceCleared: 0,
      totalEliminations: 0,
      maxComboAchieved: 0,
      letterClearedCount: {},
      vinedCleared: 0,
      stoneCleared: 0
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
    letterClearsMap: { [key in Letter]?: number },
    vinedCountCleared: number,
    stoneCountCleared: number
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

      if (goals.vinedCount !== undefined) {
        if (vinedCountCleared < goals.vinedCount) return false;
      }

      if (goals.stoneCount !== undefined) {
        if (stoneCountCleared < goals.stoneCount) return false;
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
    const currentRunId = gameRunIdRef.current;
    setIsAnimating(true);
    setShowShuffleToast(true);
    sound.playShuffle();
    
    await sleep(1500); // Allow player to read instructions banner
    if (gameRunIdRef.current !== currentRunId) return;
    if (!currentLevelRef.current || currentLevelRef.current.id !== initialLevelId) return;

    if (activeLevel) {
      const shuffled = shuffleEntireBoard(currentBoard, activeLevel);
      setBoard(shuffled);
    }
    
    setShowShuffleToast(false);
    setIsAnimating(false);
  };

  // Evaluating post-cascade state for victory/defeat
  const evaluateEndGameStatus = async (
    movesLeft: number,
    finalScore: number,
    iceCountCleared: number,
    totalEliminationsCleared: number,
    maxComboAchieved: number,
    letterClearsMap: { [key in Letter]?: number },
    currentBoard: GridCell[][],
    vinedCountCleared: number = goalsProgress.vinedCleared,
    stoneCountCleared: number = goalsProgress.stoneCleared,
    currentRunId?: number
  ) => {
    if (!activeLevel) return;
    if (currentRunId !== undefined && gameRunIdRef.current !== currentRunId) return;

    const gameCompleted = checkIsGoalsCompleted(
      finalScore,
      iceCountCleared,
      totalEliminationsCleared,
      maxComboAchieved,
      letterClearsMap,
      vinedCountCleared,
      stoneCountCleared
    );

    if (gameCompleted) {
      if (bonusPhaseStartedRef.current) return;
      bonusPhaseStartedRef.current = true;

      if (movesLeft > 0) {
        // Trigger sugar-rush bonus round for unused moves!
        runBonusPhase(
          movesLeft,
          currentBoard,
          finalScore,
          iceCountCleared,
          totalEliminationsCleared,
          maxComboAchieved,
          letterClearsMap,
          vinedCountCleared,
          stoneCountCleared,
          currentRunId
        );
      } else {
        setIsAnimating(true);
        await sleep(1000); // 1s visual settle delay
        if (currentRunId !== undefined && gameRunIdRef.current !== currentRunId) return;
        if (!currentLevelRef.current || currentLevelRef.current.id !== activeLevel.id) return;
        sound.playLevelWin();
        setIsWon(true);
        setIsAnimating(false);
        updateHighScore(activeLevel.id, finalScore);
      }
      return;
    }

    // Out of moves - Game over
    if (movesLeft <= 0) {
      setIsAnimating(true);
      await sleep(1000); // 1s visual settle delay
      if (currentRunId !== undefined && gameRunIdRef.current !== currentRunId) return;
      if (!currentLevelRef.current || currentLevelRef.current.id !== activeLevel.id) return;
      sound.playLevelLose();
      setIsLost(true);
      setIsAnimating(false);
      return;
    }

    // Moves left is OK, check if grid has deadlocks
    if (!checkPotentialMoves(currentBoard, activeLevel.layout, activeLevel.portals)) {
      handleAutoReshuffle(currentBoard);
    } else {
      setIsAnimating(false);
    }
  };

  // SUGAR RUSH PROGRESSIVE BONUS PHASE
  const runBonusPhase = async (
    movesLeft: number,
    currentBoard: GridCell[][],
    finalScore: number,
    iceCountCleared: number,
    totalEliminationsCleared: number,
    maxComboAchieved: number,
    letterClearsMap: { [key in Letter]?: number },
    vinedCountCleared: number,
    stoneCountCleared: number,
    currentRunId?: number
  ) => {
    if (!activeLevel) return;
    setIsAnimating(true);
    let tempMoves = movesLeft;
    let workingBoard = currentBoard.map(row => row.map(cell => cell ? { ...cell } : null));
    let currentScoreVal = finalScore;
    let localIceCleared = iceCountCleared;
    let localTotalEliminations = totalEliminationsCleared;
    let localMaxComboAchieved = maxComboAchieved;
    const localLettersClearedMap = { ...letterClearsMap };
    let localVinedCleared = vinedCountCleared;
    let localStoneCleared = stoneCountCleared;
    const levelId = activeLevel.id;

    // Step A: Mark all remaining moves as random items on the board sequentially
    const validPositions: { r: number; c: number }[] = [];
    for (let r = 0; r < workingBoard.length; r++) {
      for (let c = 0; c < workingBoard[r].length; c++) {
        const cell = workingBoard[r][c];
        if (cell && !cell.isLocked && !cell.isVined && !cell.isStone && cell.special === 'NONE') {
          validPositions.push({ r, c });
        }
      }
    }

    let placedCount = 0;
    while (tempMoves > 0 && validPositions.length > 0) {
      // Select a random coordinates slot
      const randIdx = Math.floor(Math.random() * validPositions.length);
      const { r, c } = validPositions.splice(randIdx, 1)[0];

      // Assign a random special effect
      const specials: SpecialEffect[] = ['ROW_BLASTER', 'COL_BLASTER', 'BOMB', 'HYPER_EXPLODER'];
      const chosenSpecial = specials[Math.floor(Math.random() * specials.length)];

      workingBoard[r][c]!.special = chosenSpecial;
      workingBoard[r][c]!.isNew = true; // highlight drop spark
      placedCount++;
      tempMoves--;

      // Update remaining moves and render board with new special
      setBoard(workingBoard.map(row => row.map(cell => cell ? { ...cell } : null)));
      setMovesRemaining(tempMoves);
      sound.playSwap(); // Play popup glide sound per piece converted

      await sleep(150); // Snappy sequential delay
      if (!currentLevelRef.current || currentLevelRef.current.id !== levelId) return;
      if (currentRunId !== undefined && gameRunIdRef.current !== currentRunId) return;
    }

    if (placedCount > 0) {
      await sleep(650); // Pause briefly (650ms) to let player admire all the new special blocks before detonating
      if (!currentLevelRef.current || currentLevelRef.current.id !== levelId) return;
      if (currentRunId !== undefined && gameRunIdRef.current !== currentRunId) return;
    }

    // Step B: Detonate all generated special elements simultaneously, then resolve any triggered cascades
    let continuesDetonating = true;
    while (continuesDetonating) {
      if (currentRunId !== undefined && gameRunIdRef.current !== currentRunId) return;
      // Find specials currently present on the board
      const specialsOnBoard: { r: number; c: number }[] = [];
      for (let r = 0; r < workingBoard.length; r++) {
        for (let c = 0; c < workingBoard[r].length; c++) {
          const cell = workingBoard[r][c];
          if (cell && cell.special !== 'NONE') {
            specialsOnBoard.push({ r, c });
          }
        }
      }

      if (specialsOnBoard.length === 0) {
        continuesDetonating = false;
        break;
      }

      // Detonate them in multiple cascading waves
      let comboCount = 0;
      let isFirstExplosion = true;

      while (isFirstExplosion || checkHasAnyActiveMatches(workingBoard)) {
        if (currentRunId !== undefined && gameRunIdRef.current !== currentRunId) return;
        const matchesInBonus = isFirstExplosion ? [] : scanMatches(workingBoard, activeLevel.layout);
        isFirstExplosion = false;

        // Process matches and specials
        const { 
          newBoard: boardWithUpgrades, 
          eliminatedCoords,
          blastersCreatedCount,
          hyperExplodersCreatedCount,
          bombsCreatedCount
        } = processMatchesAndGenerateSpecials(workingBoard, matchesInBonus, null);

        let initialExplodeCoords = [...eliminatedCoords];
        if (comboCount === 0) {
          // Detonate ALL the initial specials on the board at once!
          initialExplodeCoords.push(...specialsOnBoard);
        }

        const { finalEliminated, iceBrokenCount, vinedClearedCount, stoneClearedCount, iceDamaged } = triggerExplosions(boardWithUpgrades, initialExplodeCoords, activeLevel.layout);

        localIceCleared += iceBrokenCount;
        localVinedCleared += vinedClearedCount;
        localStoneCleared += stoneClearedCount;
        if (iceBrokenCount > 0 || iceDamaged) {
          sound.playIceShatter();
        }

        localTotalEliminations += finalEliminated.length;
        let triggeredLaser = false;
        let triggeredExplode = false;

        finalEliminated.forEach(pe => {
          localLettersClearedMap[pe.letter] = (localLettersClearedMap[pe.letter] || 0) + 1;
          
          if (pe.actionTriggered === 'ROW_BLASTER' || pe.actionTriggered === 'COL_BLASTER') {
            triggeredLaser = true;
          } else if (pe.actionTriggered === 'HYPER_EXPLODER' || pe.actionTriggered === 'BOMB') {
            triggeredExplode = true;
          }
        });

        if (triggeredLaser) {
          sound.playLaserBlast();
        }
        if (triggeredExplode) {
          sound.playHyperExplode();
        }

        // Cumulative bonus scoring increments
        let waveBonusPoints = 0;
        finalEliminated.forEach(pe => {
          let val = 120 * (1 + comboCount * 0.4);
          if (pe.actionTriggered === 'ROW_BLASTER' || pe.actionTriggered === 'COL_BLASTER') {
            val += 50;
          } else if (pe.actionTriggered === 'HYPER_EXPLODER') {
            val += 150;
          } else if (pe.actionTriggered === 'BOMB') {
            val += 120;
          }
          waveBonusPoints += val;
        });

        waveBonusPoints += iceBrokenCount * 250;
        currentScoreVal += Math.floor(waveBonusPoints);

        const transitionTagBoard = boardWithUpgrades.map(row => row.map(cell => cell ? { ...cell } : null));
        const deletionWaveArr: typeof deletedPoints = [];

        finalEliminated.forEach(pe => {
          const cell = transitionTagBoard[pe.r][pe.c];
          if (cell) cell.isEliminating = true;
          deletionWaveArr.push({ r: pe.r, c: pe.c, actionTriggered: pe.actionTriggered, letter: pe.letter });
        });

        setBoard(transitionTagBoard);
        setDeletedPoints(deletionWaveArr);
        sound.playMatch(comboCount);
        setScore(currentScoreVal);

        setGoalsProgress({
          iceCleared: localIceCleared,
          totalEliminations: localTotalEliminations,
          maxComboAchieved: Math.max(localMaxComboAchieved, comboCount + 1),
          letterClearedCount: localLettersClearedMap,
          vinedCleared: localVinedCleared,
          stoneCleared: localStoneCleared
        });

        await sleep(250); // visual shrinkage delay
        if (!currentLevelRef.current || currentLevelRef.current.id !== levelId) return;
        if (currentRunId !== undefined && gameRunIdRef.current !== currentRunId) return;

        const boardWithEmptyNulls = transitionTagBoard.map(row =>
          row.map(cell => (cell && cell.isEliminating ? null : cell))
        );

        const { newBoard: boardWithGravitySlide } = applyGravityAndSpawn(boardWithEmptyNulls, activeLevel, true);
        workingBoard = boardWithGravitySlide;
        setBoard(boardWithGravitySlide);
        setDeletedPoints([]);

        await sleep(350); // visual drop/fall layout delay
        if (!currentLevelRef.current || currentLevelRef.current.id !== levelId) return;
        if (currentRunId !== undefined && gameRunIdRef.current !== currentRunId) return;

        comboCount++;
      }
    }

    // Done detonating, let the final state settle beautifully for 1.2s before displaying the win panel
    await sleep(1200);
    if (!currentLevelRef.current || currentLevelRef.current.id !== levelId) return;
    if (currentRunId !== undefined && gameRunIdRef.current !== currentRunId) return;

    sound.playLevelWin();
    setIsWon(true);
    setIsAnimating(false);
    updateHighScore(levelId, currentScoreVal);
  };

  // ASYMMETRIC CASCADING SOLVER LOOP
  const handleSwapAction = async (r1: number, c1: number, r2: number, c2: number) => {
    if (isAnimating || !activeLevel) return;
    const initialLevelId = activeLevel.id;
    const initialRunId = gameRunIdRef.current;
    setIsAnimating(true);

    const activeLevelPortals = activeLevel.portals;
    const isP1 = isPortalCell(r1, c1, activeLevelPortals);
    const isP2 = isPortalCell(r2, c2, activeLevelPortals);

    // 1. Temporarily swap two nodes inside local copy
    let workingBoard = board.map(row => row.map(cell => cell ? { ...cell } : null));
    let t1 = workingBoard[r1][c1];
    let t2 = workingBoard[r2][c2];

    if (isP1 || isP2) {
      if (isP1 && isP2) {
        sound.playBounce();
        setIsAnimating(false);
        return;
      }

      const p_portal_r = isP1 ? r1 : r2;
      const p_portal_c = isP1 ? c1 : c2;
      const r1_orig = isP1 ? r2 : r1;
      const c1_orig = isP1 ? c2 : c1;

      const originTile = workingBoard[r1_orig][c1_orig];
      if (!originTile || originTile.isLocked || originTile.isVined || originTile.isStone || originTile.special === 'HYPER_EXPLODER') {
        sound.playBounce();
        setIsAnimating(false);
        return;
      }

      // Find partner portal coordinate
      const pair = activeLevelPortals?.find(p => (p.r1 === p_portal_r && p.c1 === p_portal_c) || (p.r2 === p_portal_r && p.c2 === p_portal_c));
      if (!pair) {
        sound.playBounce();
        setIsAnimating(false);
        return;
      }

      const rt = (p_portal_r === pair.r1 && p_portal_c === pair.c1) ? pair.r2 : pair.r1;
      const ct = (p_portal_r === pair.r1 && p_portal_c === pair.c1) ? pair.c2 : pair.c1;

      const targetTile = workingBoard[rt][ct];

      // Teleport: origin tile goes to partner portal cells
      workingBoard[rt][ct] = { ...originTile, row: rt, col: ct, isNew: true };
      workingBoard[r1_orig][c1_orig] = targetTile ? { ...targetTile, row: r1_orig, col: c1_orig } : null;
      workingBoard[p_portal_r][p_portal_c] = null; // Portal frame cell remains null

      // Keep t1 & t2 variables aligned for subsequent calculations
      t1 = originTile;
      t2 = targetTile;

      sound.playLaserBlast(); // Teleport sound
    } else {
      // Normal swap
      if (!t1 || !t2) {
        sound.playBounce();
        setIsAnimating(false);
        return;
      }
      workingBoard[r1][c1] = { ...t2, row: r1, col: c1 };
      workingBoard[r2][c2] = { ...t1, row: r2, col: c2 };
    }

    setBoard(workingBoard);
    sound.playSwap();

    await sleep(250); // visual transit
    if (!currentLevelRef.current || currentLevelRef.current.id !== initialLevelId) return;
    if (gameRunIdRef.current !== initialRunId) return;

    // 2. Scan standard Match 3 line connections
    const matchGroups = scanMatches(workingBoard, activeLevel.layout);

    const isHyperExploderSwap = (t1 && t1.special === 'HYPER_EXPLODER') || (t2 && t2.special === 'HYPER_EXPLODER');
    const isDualSpecialSwap = (t1 && t1.special !== 'NONE') && (t2 && t2.special !== 'NONE');

    if (matchGroups.length === 0 && !isDualSpecialSwap && !isHyperExploderSwap) {
      // Swapping is invalid! Restore coordinates
      workingBoard = workingBoard.map(row => row.map(cell => cell ? { ...cell } : null));
      
      if (isP1 || isP2) {
        const p_portal_r = isP1 ? r1 : r2;
        const p_portal_c = isP1 ? c1 : c2;
        const r1_orig = isP1 ? r2 : r1;
        const c1_orig = isP1 ? c2 : c1;
        const pair = activeLevelPortals?.find(p => (p.r1 === p_portal_r && p.c1 === p_portal_c) || (p.r2 === p_portal_r && p.c2 === p_portal_c));
        if (pair) {
          const rt = (p_portal_r === pair.r1 && p_portal_c === pair.c1) ? pair.r2 : pair.r1;
          const ct = (p_portal_r === pair.r1 && p_portal_c === pair.c1) ? pair.c2 : pair.c1;
          
          let originalTile = workingBoard[rt][ct];
          let originalTargetTile = workingBoard[r1_orig][c1_orig];
          
          workingBoard[r1_orig][c1_orig] = originalTile ? { ...originalTile, row: r1_orig, col: c1_orig } : null;
          workingBoard[rt][ct] = originalTargetTile ? { ...originalTargetTile, row: rt, col: ct } : null;
          workingBoard[p_portal_r][p_portal_c] = null;
        }
      } else {
        const rt1 = workingBoard[r1][c1]!;
        const rt2 = workingBoard[r2][c2]!;
        workingBoard[r1][c1] = { ...rt2, row: r1, col: c1 };
        workingBoard[r2][c2] = { ...rt1, row: r2, col: c2 };
      }

      setBoard(workingBoard);
      sound.playBounce();
      
      await sleep(250);
      if (!currentLevelRef.current || currentLevelRef.current.id !== initialLevelId) return;
      if (gameRunIdRef.current !== initialRunId) return;
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
    let localVinedCleared = goalsProgress.vinedCleared;
    let localStoneCleared = goalsProgress.stoneCleared;

    // Set which cell is the primary upgraded receiver cell (from user initial swipe path)
    let swapCoordsToUpgrade: { r1: number; c1: number; r2: number; c2: number } | null = { r1, c1, r2, c2 };

    let dualSpecialActive = isDualSpecialSwap;
    let isHyperSweepActive = isHyperExploderSwap;
    let hyperSweepLetter: Letter | 'ANY' | null = null;
    let hyperExploderCoords: {r: number, c: number}[] = [];

    if (isHyperSweepActive) {
      if (t1 && t2 && t1.special === 'HYPER_EXPLODER' && t2.special === 'HYPER_EXPLODER') {
        hyperSweepLetter = 'ANY';
      } else {
        hyperSweepLetter = (t1 && t1.special === 'HYPER_EXPLODER') ? (t2 ? t2.letter : 'A') : (t1 ? t1.letter : 'A');
      }
      if (t1 && t1.special === 'HYPER_EXPLODER') hyperExploderCoords.push({ r: r2, c: c2 });
      if (t2 && t2.special === 'HYPER_EXPLODER') hyperExploderCoords.push({ r: r1, c: c1 });
    }

    while (matchGroups.length > 0 || dualSpecialActive || isHyperSweepActive || checkHasAnyActiveMatches(workingBoard)) {
      // Recalculating active matches
      const activeMatches = (matchGroups.length > 0 || isHyperSweepActive) ? matchGroups : scanMatches(workingBoard, activeLevel.layout);

      // a. Mark upgrades (Match 4 generates blasters, match 5 generates HyperExploder)
      const { 
        newBoard: boardWithUpgrades, 
        eliminatedCoords, 
        blastersCreatedCount, 
        hyperExplodersCreatedCount,
        bombsCreatedCount
      } = processMatchesAndGenerateSpecials(workingBoard, activeMatches, swapCoordsToUpgrade);

      // Only count specials created on wave 0 (the player's direct match swap trigger)
      if (comboCount === 0) {
        const manualSpecialsCreated = blastersCreatedCount + hyperExplodersCreatedCount + bombsCreatedCount;
        if (manualSpecialsCreated > 0) {
          setPlayerCreatedSpecials(prev => prev + manualSpecialsCreated);
        }
      }

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
      const { finalEliminated, iceBrokenCount, vinedClearedCount, stoneClearedCount, iceDamaged } = triggerExplosions(boardWithUpgrades, initialExplodeCoords, activeLevel.layout);

      // Rule 5: If both row blaster and col blaster are triggered in this wave, award a BOMB
      const hadRowBlasterTriggered = finalEliminated.some(pe => pe.actionTriggered === 'ROW_BLASTER');
      const hadColBlasterTriggered = finalEliminated.some(pe => pe.actionTriggered === 'COL_BLASTER');
      const shouldAwardBomb = hadRowBlasterTriggered && hadColBlasterTriggered;

      localIceCleared += iceBrokenCount;
      localVinedCleared += vinedClearedCount;
      localStoneCleared += stoneClearedCount;
      if (iceBrokenCount > 0 || iceDamaged) {
        sound.playIceShatter();
      }

      // Check audio cues and update letters statistics
      localTotalEliminations += finalEliminated.length;
      let triggeredLaser = false;
      let triggeredExplode = false;

      finalEliminated.forEach(pe => {
        localLettersClearedMap[pe.letter] = (localLettersClearedMap[pe.letter] || 0) + 1;
        
        if (pe.actionTriggered === 'ROW_BLASTER' || pe.actionTriggered === 'COL_BLASTER') {
          triggeredLaser = true;
        } else if (pe.actionTriggered === 'HYPER_EXPLODER' || pe.actionTriggered === 'BOMB') {
          triggeredExplode = true;
        }
      });

      if (triggeredLaser) {
        sound.playLaserBlast();
      }
      if (triggeredExplode) {
        sound.playHyperExplode();
      }

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
        letterClearedCount: localLettersClearedMap,
        vinedCleared: localVinedCleared,
        stoneCleared: localStoneCleared
      });

      await sleep(250); // wait for tiles shrink fadeout
      if (!currentLevelRef.current || currentLevelRef.current.id !== initialLevelId) return;
      if (gameRunIdRef.current !== initialRunId) return;

      // c. Squeeze list and run Gravity Fall calculations
      const boardWithEmptyNulls = transitionTagBoard.map(row =>
         row.map(cell => (cell && cell.isEliminating ? null : cell))
      );

      const { newBoard: boardWithGravitySlide, spawnedCount } = applyGravityAndSpawn(boardWithEmptyNulls, activeLevel, false, playerCreatedSpecials);
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
      if (gameRunIdRef.current !== initialRunId) return;

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
        evaluateEndGameStatus(
          remaining, 
          currentScore, 
          localIceCleared, 
          localTotalEliminations, 
          localMaxComboAchieved, 
          localLettersClearedMap, 
          workingBoard,
          localVinedCleared,
          localStoneCleared,
          initialRunId
        );
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

  // Dynamic Background solver matching Rivers, Grasslands, Skies, and Starry Skies
  const getDynamicBackgroundClasses = () => {
    if (!activeLevel) {
      return "bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950";
    }
    switch (activeLevel.theme) {
      case 'river':
        return "bg-gradient-to-b from-slate-950 via-cyan-950/40 to-slate-950";
      case 'grassland':
        return "bg-gradient-to-b from-slate-950 via-emerald-950/30 to-slate-950";
      case 'sky':
        return "bg-gradient-to-b from-slate-950 via-sky-950/30 to-slate-950";
      case 'starry':
        return "bg-gradient-to-b from-slate-950 via-purple-950/45 to-slate-950";
      default:
        return "bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950";
    }
  };

  return (
    <div className={`min-h-screen text-slate-100 flex flex-col font-sans relative antialiased transition-all duration-1000 ${getDynamicBackgroundClasses()} selection:bg-indigo-500/30 selection:text-indigo-200`}>
      
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
                isVinedHighlighted={isVinedHighlighted}
                soundEnabled={soundEnabled}
                onToggleSound={() => setSoundEnabled(!soundEnabled)}
                onResetLevel={handleResetLevel}
                onBackToMenu={handleBackToMenu}
                onIceGoalClick={handleIceClicked}
                onVinedGoalClick={handleVinedClicked}
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
                  isVinedHighlightActive={isVinedHighlighted}
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
            <span>{t('deadlockToast')}</span>
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
