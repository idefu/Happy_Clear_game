/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { GridCell, Tile, Letter, SpecialEffect, LevelConfig, Particle } from '../types';
import { ShieldAlert, Zap, Compass, Star } from 'lucide-react';
import sound from '../utils/sound';
import { findPotentialMoves, isPortalCell } from '../utils/gameLogic';

import pic0 from '../../pic/0.png';
import pic1 from '../../pic/1.png';
import pic2 from '../../pic/2.png';
import pic3 from '../../pic/3.png';
import pic4 from '../../pic/4.png';
import pic5 from '../../pic/5.png';
import pic6 from '../../pic/6.png';

const portalStylesMap = [
  {
    bg: 'bg-purple-950/40 border-purple-500/60 shadow-[0_0_12px_rgba(168,85,247,0.4)]',
    pulse: 'bg-purple-500/5 border-purple-400/45',
  },
  {
    bg: 'bg-teal-950/40 border-teal-500/60 shadow-[0_0_12px_rgba(20,184,166,0.4)]',
    pulse: 'bg-teal-500/5 border-teal-400/45',
  },
  {
    bg: 'bg-pink-950/40 border-pink-500/60 shadow-[0_0_12px_rgba(244,63,94,0.4)]',
    pulse: 'bg-pink-500/5 border-pink-400/45',
  },
  {
    bg: 'bg-amber-950/40 border-amber-500/60 shadow-[0_0_12px_rgba(245,158,11,0.4)]',
    pulse: 'bg-amber-500/5 border-amber-400/45',
  }
];

interface GameBoardProps {
  board: GridCell[][];
  level: LevelConfig;
  isAnimating: boolean;
  onSwap: (r1: number, c1: number, r2: number, c2: number) => void;
  deletedPoints: { r: number; c: number; actionTriggered: SpecialEffect; letter: Letter }[];
  soundEnabled: boolean;
  onIceClicked?: () => void;
  isIceHighlightActive: boolean;
}

const letterColors: { [key in Letter]: string } = {
  'A': '#10b981', // emerald
  'B': '#3b82f6', // blue
  'C': '#ec4899', // pink
  'D': '#eab308', // yellow
  'E': '#06b6d4', // cyan
  'F': '#8b5cf6', // purple
  'G': '#f97316', // orange
  'H': '#f43f5e'  // rose
};

const imageMap: { [key in Letter]: string } = {
  'A': pic1,
  'B': pic2,
  'C': pic3,
  'D': pic4,
  'E': pic5,
  'F': pic6,
  'G': pic1,
  'H': pic2
};

export default function GameBoard({
  board,
  level,
  isAnimating,
  onSwap,
  deletedPoints,
  soundEnabled,
  onIceClicked,
  isIceHighlightActive
}: GameBoardProps) {
  const rows = board.length;
  const cols = board[0]?.length || 0;

  // Interaction states
  const [selectedCell, setSelectedCell] = useState<{ r: number; c: number } | null>(null);
  const dragStartRef = useRef<{ r: number; c: number; x: number; y: number } | null>(null);
  const [hintCells, setHintCells] = useState<{ r1: number; c1: number; r2: number; c2: number } | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  // Canvas particle state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const boardContainerRef = useRef<HTMLDivElement | null>(null);
  const particlesRef = useRef<any[]>([]);

  // Sound sync
  useEffect(() => {
    sound.toggleSound(soundEnabled);
  }, [soundEnabled]);

  const animationActiveRef = useRef(false);
  const startAnimationLoopRef = useRef<() => void>(() => {});

  // Handle particle updating in 60fps loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number | null = null;

    const resizeCanvas = () => {
      const container = boardContainerRef.current;
      if (container && canvas) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle tick updates
    const update = () => {
      const particles = particlesRef.current;
      if (particles.length === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        animationActiveRef.current = false;
        animId = null;
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        
        // gravity drag for sparkles
        if (p.type === 'sparkle') {
          p.vy += 0.12; 
        }

        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;

        // HIGH PERFORMANCE: shadowBlur is deleted because it crashes mobile GPU

        if (p.type === 'sparkle') {
          // Draw a small star
          ctx.beginPath();
          const spikes = 5;
          const outerRadius = p.size;
          const innerRadius = p.size / 2;
          let rot = (Math.PI / 2) * 3;
          let cx = p.x;
          let cy = p.y;
          let x = cx;
          let y = cy;
          let step = Math.PI / spikes;

          ctx.moveTo(cx, cy - outerRadius);
          for (let s = 0; s < spikes; s++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
          }
          ctx.lineTo(cx, cy - outerRadius);
          ctx.closePath();
          ctx.fill();
        } else if (p.type === 'ring') {
          // Draw shockwave expanding ring
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * (1 - p.alpha) * 3, 0, Math.PI * 2);
          ctx.stroke();
        } else if (p.type === 'laser') {
          // Horizontal or vertical laser lines
          ctx.strokeStyle = p.color;
          ctx.lineWidth = p.size * p.alpha;
          ctx.beginPath();
          ctx.moveTo(p.x - p.lengthX, p.y - p.lengthY);
          ctx.lineTo(p.x + p.lengthX, p.y + p.lengthY);
          ctx.stroke();
        } else {
          // Simple bubble
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      animId = requestAnimationFrame(update);
    };

    const startAnimationLoop = () => {
      if (!animationActiveRef.current) {
        animationActiveRef.current = true;
        if (animId) cancelAnimationFrame(animId);
        animId = requestAnimationFrame(update);
      }
    };

    startAnimationLoopRef.current = startAnimationLoop;

    return () => {
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  // Spawn visual sparkles in particle system on demand
  const triggerVisualParticles = (
    row: number,
    col: number,
    color: string,
    action: SpecialEffect
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Calculate tile center
    const cellWidth = canvas.width / cols;
    const cellHeight = canvas.height / rows;
    const centerX = col * cellWidth + cellWidth / 2;
    const centerY = row * cellHeight + cellHeight / 2;

    const sparkles = particlesRef.current;

    // 1. Spawns sparkle burst - reduced particle density for high refresh rate performance
    const burstCount = action === 'HYPER_EXPLODER' ? 18 : action === 'BOMB' ? 24 : 8;
    for (let i = 0; i < burstCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = action === 'BOMB' ? (1.5 + Math.random() * 4) : (1.2 + Math.random() * 3);
      
      sparkles.push({
        id: Math.random().toString(),
        type: 'sparkle',
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: action === 'HYPER_EXPLODER' ? getRandomRainbowColor() : action === 'BOMB' ? (Math.random() < 0.5 ? '#ef4444' : '#f97316') : color,
        size: action === 'BOMB' ? (3 + Math.random() * 5) : (2 + Math.random() * 4),
        alpha: 1,
        decay: action === 'BOMB' ? (0.015 + Math.random() * 0.015) : (0.02 + Math.random() * 0.02)
      });
    }

    // 2. Shockwave expanding ring (for explosions)
    if (action !== 'NONE') {
      sparkles.push({
        id: Math.random().toString(),
        type: 'ring',
        x: centerX,
        y: centerY,
        vx: 0,
        vy: 0,
        color: action === 'HYPER_EXPLODER' ? '#f59e0b' : action === 'BOMB' ? '#f97316' : color,
        size: action === 'BOMB' ? Math.max(cellWidth, cellHeight) * 1.5 : Math.max(cellWidth, cellHeight) * 0.7,
        alpha: 1,
        decay: action === 'BOMB' ? 0.04 : 0.05
      });
    }

    // 3. Spikes for row/column blasters
    if (action === 'ROW_BLASTER') {
      sparkles.push({
        id: Math.random().toString(),
        type: 'laser',
        x: centerX,
        y: centerY,
        vx: 0,
        vy: 0,
        lengthX: canvas.width,
        lengthY: 0,
        color: '#f43f5e',
        size: 10,
        alpha: 1,
        decay: 0.08
      });
    } else if (action === 'COL_BLASTER') {
      sparkles.push({
        id: Math.random().toString(),
        type: 'laser',
        x: centerX,
        y: centerY,
        vx: 0,
        vy: 0,
        lengthX: 0,
        lengthY: canvas.height,
        color: '#06b6d4',
        size: 10,
        alpha: 1,
        decay: 0.08
      });
    }

    // Dynamic start
    startAnimationLoopRef.current();
  };

  // Helper colors for hyper explosers
  const getRandomRainbowColor = () => {
    const rainbowColors = ['#f43f5e', '#ec4899', '#eab308', '#10b981', '#3b82f6', '#a855f7'];
    return rainbowColors[Math.floor(Math.random() * rainbowColors.length)];
  };

  // Listen to incoming deleted coordinates from Parent state to trigger particles immediately!
  useEffect(() => {
    if (deletedPoints.length > 0) {
      deletedPoints.forEach(pt => {
        const color = letterColors[pt.letter] || '#ffffff';
        triggerVisualParticles(pt.r, pt.c, color, pt.actionTriggered);
      });
    }
  }, [deletedPoints]);

  // Swapping core math logic
  const handleSwapTrigger = (r1: number, c1: number, r2: number, c2: number) => {
    // Check if tiles exist, are adjacent, and are NOT locked/vined/rocky
    const t1 = board[r1]?.[c1];
    const t2 = board[r2]?.[c2];

    const activeLevelPortals = level.portals;
    const isP1 = isPortalCell(r1, c1, activeLevelPortals);
    const isP2 = isPortalCell(r2, c2, activeLevelPortals);

    if (isP1 || isP2) {
      if (isP1 && isP2) {
        sound.playBounce();
        return;
      }
      
      const movingTile = isP1 ? t2 : t1;
      if (!movingTile || movingTile.isLocked || movingTile.isVined || movingTile.isStone) {
        sound.playBounce();
        return;
      }

      // Adjacency scan: row-diff and col-diff should sum to 1
      const rowDiff = Math.abs(r1 - r2);
      const colDiff = Math.abs(c1 - c2);

      if ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)) {
        onSwap(r1, c1, r2, c2);
      } else {
        sound.playBounce();
      }
      return;
    }

    if (!t1 || !t2 || t1.isLocked || t2.isLocked || t1.isVined || t2.isVined || t1.isStone || t2.isStone) {
      sound.playBounce();
      return;
    }

    // Adjacency scan: row-diff and col-diff should sum to 1
    const rowDiff = Math.abs(r1 - r2);
    const colDiff = Math.abs(c1 - c2);

    if ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)) {
      onSwap(r1, c1, r2, c2);
    } else {
      sound.playBounce();
    }
  };

  const resetActivityTimer = () => {
    if (hintCells) {
      setHintCells(null);
    }
  };

  // Inactivity countdown solver
  useEffect(() => {
    if (isAnimating) {
      setHintCells(null);
      return;
    }

    // Reset when state shifts
    lastActivityRef.current = Date.now();
    setHintCells(null);

    const timer = setInterval(() => {
      const now = Date.now();
      const idle = now - lastActivityRef.current;

      // 5 seconds of board-resting inactivity trigger
      if (idle >= 5000 && !hintCells) {
        const moves = findPotentialMoves(board, level.layout, level.portals);
        if (moves.length > 0) {
          // Select one potential move pairing
          setHintCells(moves[0]);
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [board, isAnimating, level]);

  // CELL SELECTION CLICK
  const handleCellClick = (r: number, c: number) => {
    resetActivityTimer();
    if (isAnimating) return;

    const activeLevelPortals = level.portals;
    const isClickingPortal = isPortalCell(r, c, activeLevelPortals);

    if (isClickingPortal) {
      if (selectedCell) {
        // Try swapping starting selected tile with this portal
        const rowDiff = Math.abs(selectedCell.r - r);
        const colDiff = Math.abs(selectedCell.c - c);
        if ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)) {
          handleSwapTrigger(selectedCell.r, selectedCell.c, r, c);
        } else {
          sound.playBounce();
        }
        setSelectedCell(null);
      } else {
        sound.playBounce();
      }
      return;
    }

    const clickedTile = board[r]?.[c];
    if (!clickedTile || level.layout[r][c] === 0) return;

    if (clickedTile.isLocked || clickedTile.isVined || clickedTile.isStone) {
      sound.playBounce();
      if (clickedTile.isLocked) onIceClicked?.();
      return; // Frozen, vined, or rocky cells cannot move or highlight
    }

    if (!selectedCell) {
      setSelectedCell({ r, c });
    } else {
      // If user clicked the SAME cell, unselect
      if (selectedCell.r === r && selectedCell.c === c) {
        setSelectedCell(null);
        return;
      }

      // Trigger swap calculation
      handleSwapTrigger(selectedCell.r, selectedCell.c, r, c);
      setSelectedCell(null);
    }
  };

  // DRAG / TOUCH START
  const handleDragStart = (r: number, c: number, clientX: number, clientY: number) => {
    resetActivityTimer();
    if (isAnimating) return;
    const clickedTile = board[r]?.[c];
    if (!clickedTile || level.layout[r][c] === 0) return;

    if (clickedTile.isLocked || clickedTile.isVined || clickedTile.isStone) {
      sound.playBounce();
      if (clickedTile.isLocked) onIceClicked?.();
      return; // Frozen, vined, or rocky cells cannot move
    }

    dragStartRef.current = { r, c, x: clientX, y: clientY };
    setSelectedCell({ r, c });
  };

  // DRAG / TOUCH MOVE/END EVALUATOR
  const handleDragMove = (clientX: number, clientY: number) => {
    const start = dragStartRef.current;
    if (!start) return;

    const dx = clientX - start.x;
    const dy = clientY - start.y;
    const threshold = 18; // Super response low swipe threshold in pixels for flawless feeling

    if (Math.abs(dx) > threshold || Math.abs(dy) > threshold) {
      // Find direction of drag
      let swapRow = start.r;
      let swapCol = start.c;

      if (Math.abs(dx) > Math.abs(dy)) {
        // Horizontal swap
        swapCol = dx > 0 ? start.c + 1 : start.c - 1;
      } else {
        // Vertical swap
        swapRow = dy > 0 ? start.r + 1 : start.r - 1;
      }

      // Check bounds & trigger swap
      if (swapRow >= 0 && swapRow < rows && swapCol >= 0 && swapCol < cols) {
        handleSwapTrigger(start.r, start.c, swapRow, swapCol);
      }

      // Reset
      dragStartRef.current = null;
      setSelectedCell(null);
    }
  };

  const handleDragEnd = () => {
    dragStartRef.current = null;
  };

  // Touch wrappers
  const handleTouchStart = (r: number, c: number, e: React.TouchEvent) => {
    resetActivityTimer();
    const touch = e.touches[0];
    handleDragStart(r, c, touch.clientX, touch.clientY);
  };

  // Dynamic global event tracking for friction-free drag & gesture response on desktop and mobile
  useEffect(() => {
    const container = boardContainerRef.current;
    if (!container) return;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!dragStartRef.current) return;
      resetActivityTimer();
      handleDragMove(e.clientX, e.clientY);
    };

    const handleGlobalMouseUp = () => {
      if (dragStartRef.current) {
        handleDragEnd();
      }
    };

    const handleContainerTouchMove = (e: TouchEvent) => {
      if (!dragStartRef.current) return;
      resetActivityTimer();
      
      // Stop layout page bounce scrolling while swiping tiles on touch screens
      if (e.cancelable) {
        e.preventDefault();
      }
      
      const touch = e.touches[0];
      handleDragMove(touch.clientX, touch.clientY);
    };

    const handleContainerTouchEnd = () => {
      if (dragStartRef.current) {
        handleDragEnd();
      }
    };

    window.addEventListener('mousemove', handleGlobalMouseMove, { passive: true });
    window.addEventListener('mouseup', handleGlobalMouseUp, { passive: true });

    container.addEventListener('touchmove', handleContainerTouchMove, { passive: false });
    container.addEventListener('touchend', handleContainerTouchEnd, { passive: false });
    container.addEventListener('touchcancel', handleContainerTouchEnd, { passive: false });

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);

      container.removeEventListener('touchmove', handleContainerTouchMove);
      container.removeEventListener('touchend', handleContainerTouchEnd);
      container.removeEventListener('touchcancel', handleContainerTouchEnd);
    };
  }, [board, isAnimating, level, hintCells]);

  return (
    <div className="flex flex-col items-center justify-center space-y-3.5 w-full" id="board-container-section">
      <div 
        ref={boardContainerRef}
        className="w-full relative aspect-square max-w-[min(100vw-16px,620px)] bg-slate-950/60 border-2 sm:border-4 border-slate-800 rounded-2xl p-1.5 sm:p-3 shadow-2xl grid-pattern touch-none select-none overflow-hidden"
        style={{
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.8), inset 0 1px 0 rgba(255,255,255,0.06)'
        }}
        id="match3-grid-core"
      >
        {/* Canvas overlay for particle sparkles */}
        <canvas 
          ref={canvasRef}
          className="pointer-events-none absolute inset-0 z-30 h-full w-full"
        />

        {/* Board Tiles Layout */}
        <div
          className="w-full h-full gap-1 sm:gap-1.5"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`
          }}
        >
          {board.map((rowArr, r) => 
            rowArr.map((cell, c) => {
              const isEmptyCell = level.layout[r][c] === 0;
              const isCellSelected = selectedCell && selectedCell.r === r && selectedCell.c === c;

              const isHinted = hintCells && (
                (hintCells.r1 === r && hintCells.c1 === c) || 
                (hintCells.r2 === r && hintCells.c2 === c)
              );

              const portalIndex = level.portals?.findIndex(p => (p.r1 === r && p.c1 === c) || (p.r2 === r && p.c2 === c)) ?? -1;
              const hasPortal = portalIndex !== -1;
              const portalStyle = hasPortal ? portalStylesMap[portalIndex % portalStylesMap.length] : null;

              if (isEmptyCell) {
                // Out of bounds (renders completely hollow backspace spacer)
                return (
                  <div 
                    key={`empty_${r}_${c}`} 
                    className="h-full w-full bg-transparent"
                  />
                );
              }

              // Normal Grid cell slot block background
              return (
                <div
                  key={`slot_${r}_${c}`}
                  onClick={() => handleCellClick(r, c)}
                  onMouseDown={(e) => handleDragStart(r, c, e.clientX, e.clientY)}
                  onTouchStart={(e) => handleTouchStart(r, c, e)}
                  className={`relative flex items-center justify-center h-full w-full rounded-lg transition-all cursor-pointer ${
                    isCellSelected 
                      ? 'bg-slate-800/80 ring-2 ring-indigo-400 ring-offset-2 ring-offset-slate-950 shadow-inner'
                      : isHinted
                      ? 'bg-slate-900 ring-2 sm:ring-4 ring-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.8)] border border-amber-300 z-10 animate-pulse'
                      : hasPortal
                      ? portalStyle!.bg
                      : 'bg-slate-900/40 border border-slate-800/60'
                  }`}
                  id={`board-cell-${r}-${c}`}
                >
                  {/* Space Portal Background Halo */}
                  {hasPortal && (
                    <div className={`absolute inset-0.5 rounded-lg border border-dashed animate-[spin_10s_linear_infinite] pointer-events-none z-0 ${portalStyle!.pulse}`} />
                  )}

                  {/* Glass backing design details */}
                  <span className="absolute inset-0.5 rounded-md border border-white/5 pointer-events-none" />

                  {/* Render Tile content */}
                  {cell && (
                    <motion.div
                      initial={cell.isNew ? { scale: 0, opacity: 0 } : false}
                      animate={
                        cell.isEliminating 
                          ? { scale: 0, opacity: 0, rotate: 45 } 
                          : isHinted
                          ? { scale: [1, 1.08, 1], rotate: 0 }
                          : { scale: 1, opacity: 1, rotate: 0 }
                      }
                      transition={
                        cell.isEliminating
                          ? undefined
                          : isHinted
                          ? { repeat: Infinity, duration: 1.4, ease: "easeInOut" }
                          : cell.isNew 
                          ? { type: 'spring', stiffness: 450, damping: 28 }
                          : { type: 'spring', stiffness: 500, damping: 30 }
                      }
                      className={`relative flex items-center justify-center w-full h-full aspect-square rounded-2xl shadow-lg border group cursor-grab active:cursor-grabbing select-none transition-shadow duration-150 ${
                        cell.special === 'HYPER_EXPLODER' 
                          ? 'border-amber-400/70 shadow-[0_0_12px_rgba(245,158,11,0.25)] bg-slate-900'
                          : cell.special === 'ROW_BLASTER'
                          ? 'border-pink-500/60 shadow-[0_0_8px_rgba(244,63,94,0.18)] bg-slate-900'
                          : cell.special === 'COL_BLASTER'
                          ? 'border-cyan-500/60 shadow-[0_0_8px_rgba(6,182,212,0.18)] bg-slate-900'
                          : cell.special === 'BOMB'
                          ? 'border-orange-500/70 shadow-[0_0_12px_rgba(249,115,22,0.25)] bg-slate-900 hover:scale-105'
                          : 'border-slate-800/80 bg-slate-900/90'
                      }`}
                      style={{
                        background: cell.special === 'HYPER_EXPLODER'
                          ? 'radial-gradient(circle, #1a202c 0%, #0a0f1d 100%)'
                          : `linear-gradient(135deg, ${letterColors[cell.letter]}12 0%, ${letterColors[cell.letter]}25 100%)`
                      }}
                      id={`letter-tile-${cell.id}`}
                    >
                      {/* Interactive Visual Tile Character - Image mapped or Stone Cover */}
                      {cell.isStone ? (
                        <div className="w-[85%] h-[85%] rounded-xl bg-gradient-to-br from-slate-500 via-slate-600 to-slate-700 border border-slate-400/50 shadow-inner flex items-center justify-center relative select-none z-10">
                          <span className="text-lg sm:text-xl font-black text-slate-300 filter drop-shadow animate-[pulse_2s_infinite]">🪨</span>
                        </div>
                      ) : cell.special === 'HYPER_EXPLODER' ? (
                        <img 
                          src={pic0} 
                          className="w-13/16 h-13/16 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.65)] animate-[pulse_1.5s_infinite_ease-in-out]" 
                          alt="0"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <img 
                          src={imageMap[cell.letter] || pic1} 
                          className="w-13/16 h-13/16 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] transition-transform group-hover:scale-105 duration-200" 
                          alt={cell.letter}
                          referrerPolicy="no-referrer"
                        />
                      )}

                      {/* Specialty micro badges */}
                      {cell.special === 'ROW_BLASTER' && (
                        <span className="absolute bottom-1 right-1 px-1 rounded text-[10px] bg-pink-600/95 text-white font-sans leading-none border border-pink-400/30 font-bold shadow-md select-none transform scale-90">
                          ↔
                        </span>
                      )}
                      {cell.special === 'COL_BLASTER' && (
                        <span className="absolute bottom-1 right-1 px-1 rounded text-[10px] bg-cyan-600/95 text-white font-sans leading-none border border-cyan-400/30 font-bold shadow-md select-none transform scale-90">
                          ↕
                        </span>
                      )}
                      {cell.special === 'HYPER_EXPLODER' && (
                        <span className="absolute bottom-1 right-1 px-1 rounded text-[10px] bg-amber-500 text-slate-950 font-extrabold leading-none border border-amber-300 shadow-sm select-none transform scale-90 animate-pulse">
                          ☢
                        </span>
                      )}
                      {cell.special === 'BOMB' && (
                        <span className="absolute bottom-1 right-1 px-1 rounded text-[10px] bg-red-600/95 text-white font-bold leading-none border border-red-400 shadow-md select-none transform scale-90">
                          💣
                        </span>
                      )}

                       {/* Frosted glassy Frozen lock overlay */}
                      {cell.isLocked && (
                        <div className={`absolute inset-0 rounded-xl bg-cyan-300/10 border-2 transition-all duration-300 ${
                          isIceHighlightActive
                            ? 'border-cyan-300 ring-4 ring-cyan-400 ring-offset-1 ring-offset-slate-950 bg-cyan-400/40 shadow-[0_0_25px_rgba(34,211,238,1.0),inset_0_0_12px_rgba(255,255,255,1.0)] scale-105 z-20 animate-pulse'
                            : cell.iceLevel === 2
                            ? 'border-cyan-200 border-[3px] bg-blue-500/20 shadow-[inset_0_0_12px_rgba(34,211,238,0.7)] z-10'
                            : 'border-cyan-400/40 shadow-[inset_0_0_8px_rgba(34,211,238,0.5)] z-10'
                        } overflow-hidden pointer-events-none`}>
                          {/* Frozen cracks detail on corners so it looks icy but leaves the center clear */}
                          <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-cyan-400/10 to-transparent pointer-events-none" />
                          <div className="absolute top-0 right-0 w-3.5 h-3.5 bg-cyan-200/30 rounded-bl-lg" />
                          <div className="absolute bottom-0 left-0 w-3.5 h-3.5 bg-cyan-200/30 rounded-tr-lg" />
                          
                          {/* Heavy overlay cracks or layers count indicator */}
                          {cell.iceLevel === 2 && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <span className="text-[10px] font-black text-cyan-100 font-sans tracking-widest bg-blue-600/70 px-1 py-0.5 rounded leading-none border border-cyan-300 transform scale-90">×2</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Vines / Leaves Overlay */}
                      {cell.isVined && (
                        <div className="absolute inset-0 rounded-xl bg-emerald-950/25 border-2 border-emerald-500 shadow-[inset_0_0_8px_rgba(16,185,129,0.6)] z-10 pointer-events-none">
                          <span className="absolute -top-1 -right-0.5 text-[10px] select-none">🍃</span>
                          <span className="absolute -bottom-1 -left-0.5 text-[10px] select-none">🌿</span>
                        </div>
                      )}

                      {/* Ripple Beacon for extreme visibility */}
                      {cell.isLocked && isIceHighlightActive && (
                        <div className="absolute inset-0 z-25 rounded-xl border-2 border-cyan-200 animate-ping opacity-75 scale-120 pointer-events-none" />
                      )}
                    </motion.div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
}
