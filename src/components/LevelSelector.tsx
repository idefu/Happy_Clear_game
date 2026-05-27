/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Play, Lock, Volume2, VolumeX, Grid, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { LevelConfig } from '../types';
import startPic from '../../pic/start.png';

interface LevelSelectorProps {
  levels: LevelConfig[];
  onSelectLevel: (levelId: number) => void;
  highScores: { [key: number]: number };
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export default function LevelSelector({
  levels,
  onSelectLevel,
  highScores,
  soundEnabled,
  onToggleSound
}: LevelSelectorProps) {
  // Hide the level grid by default, clicking '关卡选择' shows it
  const [showGrid, setShowGrid] = useState(false);

  // Find the highest unlocked stage to play immediately
  const highestUnlockedId = React.useMemo(() => {
    let highest = 1;
    for (const lvl of levels) {
      const isFirst = lvl.id === 1;
      const prevLevelCompleted = highScores[lvl.id - 1] !== undefined && highScores[lvl.id - 1] > 0;
      if (isFirst || prevLevelCompleted) {
        highest = lvl.id;
      }
    }
    return highest;
  }, [levels, highScores]);

  // Helper code to map score to star count (1 to 3 stars)
  const getLevelStarsCount = React.useCallback((level: LevelConfig) => {
    const score = highScores[level.id] || 0;
    if (score <= 0) return 0;
    if (score >= level.scoreGoal) return 3;
    if (score >= level.scoreGoal * 0.7) return 2;
    return 1;
  }, [highScores]);

  // Total stars across the board
  const totalStarsEarned = React.useMemo(() => {
    return levels.reduce((acc, lvl) => acc + getLevelStarsCount(lvl), 0);
  }, [levels, getLevelStarsCount]);

  const maxStarsPossible = levels.length * 3;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.02
      }
    }
  };

  const item = {
    hidden: { scale: 0.85, opacity: 0 },
    show: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 200, damping: 15 } }
  };

  // IF GRID IS HIDDEN, SCREEN ONLY SHOWS MAIN THEMED COVER (LOBBY VIEW)
  if (!showGrid) {
    return (
      <div className="w-full max-w-2xl mx-auto py-2 px-2 flex justify-center items-center" id="lobby-view-wrapper">
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-amber-900/60 shadow-2xl bg-slate-950 flex flex-col justify-end items-center px-4 py-8 sm:py-12 md:py-16 text-center min-h-[460px] sm:min-h-[520px] md:min-h-[580px] transition-all">
          
          {/* Background image covering responsively */}
          <img 
            src={startPic} 
            alt="Start Screen Cover" 
            className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none brightness-[0.80] contrast-[1.05]"
            referrerPolicy="no-referrer"
          />

          {/* Vignette styling overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/55 pointer-events-none" />

          {/* Floated top-right audio mute button */}
          <div className="absolute top-3 right-3 z-30">
            <button
              onClick={onToggleSound}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950/80 border border-slate-700/60 text-slate-300 hover:text-white transition-all cursor-pointer active:scale-90 shadow-md backdrop-blur-md"
              id="lobby-sound-btn"
            >
              {soundEnabled ? (
                <Volume2 className="h-4.5 w-4.5 text-emerald-400" />
              ) : (
                <VolumeX className="h-4.5 w-4.5 text-slate-500" />
              )}
            </button>
          </div>

          {/* Visual Header content */}
          <div className="relative z-25 w-full flex flex-col items-center max-w-sm space-y-6">
            <div className="space-y-1.5 px-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-wider text-rose-50 drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)] font-sans">
                快乐消消乐
              </h1>
              <p className="text-emerald-450 font-mono text-[10px] sm:text-xs font-black tracking-widest uppercase drop-shadow-[0_2px_5px_rgba(0,0,0,0.9)]">
                ★ HAPPY ELIMINATION ADVENTURE ★
              </p>
            </div>

            {/* Middle decorative emblem */}
            <div className="h-20 sm:h-28 w-20 sm:w-28 bg-white/5 border border-white/10 rounded-full flex items-center justify-center shadow-lg relative glow-effect animate-bounce duration-3000">
              <div className="absolute inset-2 rounded-full border border-dashed border-amber-500/45" />
              <span className="text-3xl sm:text-4xl">🐱</span>
            </div>

            {/* Lower Stack Action Buttons */}
            <div className="w-full space-y-3 px-4">
              <button
                onClick={() => onSelectLevel(highestUnlockedId)}
                className="w-full py-3 sm:py-4 bg-gradient-to-b from-amber-505 via-amber-600 to-amber-700 hover:from-amber-450 hover:to-amber-650 text-white rounded-xl font-extrabold text-base transition-transform active:scale-95 shadow-[0_5px_15px_rgba(217,119,6,0.5)] border-2 border-amber-400/40 cursor-pointer flex items-center justify-center gap-2"
                id="lobby-primary-play-btn"
              >
                <Play className="h-5 w-5 fill-current text-white animate-pulse" />
                <span>开始对局</span>
              </button>

              <button
                onClick={() => setShowGrid(true)}
                className="w-full py-3 bg-gradient-to-b from-slate-900 to-slate-950 text-slate-100 hover:text-white rounded-xl font-bold text-sm transition-transform active:scale-95 shadow-md border border-amber-900/35 cursor-pointer flex items-center justify-center gap-1.5 bg-slate-950/70 backdrop-blur-sm"
                id="lobby-custom-stages-btn"
              >
                <Grid className="h-4 w-4 text-amber-500" />
                <span>关卡选择</span>
              </button>
            </div>

            {/* Bottom mini footnote */}
            <span className="text-[10px] font-mono text-amber-500/80 drop-shadow font-bold bg-amber-955/30 px-2.5 py-0.5 rounded-full select-none">
              当前可直接挑战第 {highestUnlockedId} 关
            </span>
          </div>

        </div>
      </div>
    );
  }

  // IF GRID IS UNHIDDEN, SHOW THE STAGE MAP
  return (
    <div className="w-full max-w-2xl mx-auto py-4 px-3 flex flex-col space-y-4" id="level-selector-screen">
      
      {/* Dynamic top bar with general stats and return controls */}
      <div className="flex items-center justify-between px-1" id="lobby-grid-header">
        <button
          onClick={() => setShowGrid(false)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/80 border border-amber-900 hover:bg-amber-900 text-xs text-amber-100 font-bold transition-all cursor-pointer select-none active:scale-95 shadow-md"
          id="back-to-lobby-btn"
        >
          <ArrowLeft className="h-3.5 w-3.5 text-amber-300" />
          <span>返回大厅</span>
        </button>

        {/* Compact Sound Toggle control directly in header */}
        <button
          onClick={onToggleSound}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-950/80 border border-amber-900 hover:bg-amber-900 text-amber-200 cursor-pointer active:scale-95 shadow-md"
          id="sound-toggle-btn"
        >
          {soundEnabled ? (
            <Volume2 className="h-4 w-4 text-emerald-400" />
          ) : (
            <VolumeX className="h-4 w-4 text-amber-500" />
          )}
        </button>
      </div>

      {/* THE CARDBOARD MAP MAIN PANEL */}
      <div className="relative w-full rounded-3xl border-4 border-amber-950 bg-gradient-to-br from-[#dfa977] via-[#ca905a] to-[#b77b47] p-5 md:p-8 shadow-2xl overflow-hidden min-h-[500px] flex flex-col justify-between" id="cardboard-panel-container">
        
        {/* Packing tape in the dead center running top to bottom */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-14 sm:w-16 bg-white/20 border-l border-r border-[#ffffff1c] backdrop-blur-[0.5px] pointer-events-none z-0" />

        {/* Top-Right Big Playful Star Progress Count (e.g. 33/75 ⭐️) */}
        <div className="relative z-10 flex justify-end mb-4 pr-1">
          <div className="flex items-center gap-1 bg-amber-950/30 px-3 py-1 rounded-full border border-amber-900/35 backdrop-blur-sm select-none">
            <span className="font-sans font-black text-xl text-amber-950 tracking-tight drop-shadow-[0_1px_1px_rgba(255,255,255,0.45)]">
              {totalStarsEarned}/{maxStarsPossible}
            </span>
            <span className="text-xl text-yellow-400 drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.5)] animate-bounce duration-4000">
              ⭐
            </span>
          </div>
        </div>

        {/* The 5-Column Level Grid Layout */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative z-10 grid grid-cols-5 gap-y-6 gap-x-2.5 sm:gap-x-4 md:gap-x-5 flex-1 content-start py-2"
        >
          {levels.map((level, idx) => {
            const isFirst = level.id === 1;
            const prevLevelCompleted = highScores[level.id - 1] !== undefined && highScores[level.id - 1] > 0;
            const isUnlocked = isFirst || prevLevelCompleted;
            const starsWon = getLevelStarsCount(level);
            const hasScore = highScores[level.id] > 0;

            // Generate alternative playful tilts for cartoon tiles
            const tiltedClass = idx % 3 === 0 
              ? 'rotate-3' 
              : idx % 3 === 1 
                ? '-rotate-3' 
                : 'rotate-1';

            return (
              <motion.div
                key={level.id}
                variants={item}
                whileHover={isUnlocked ? { scale: 1.06, rotate: 0 } : {}}
                whileTap={isUnlocked ? { scale: 0.94 } : {}}
                onClick={() => {
                  if (isUnlocked) {
                    onSelectLevel(level.id);
                  }
                }}
                className={`relative aspect-square rounded-2xl transition-all select-none cursor-pointer ${tiltedClass} ${
                  isUnlocked
                    ? 'bg-gradient-to-b from-[#569bef] via-[#488fe6] to-[#367cd3] border-2 border-white text-white shadow-[0_5px_0_#1b4070] active:translate-y-1 active:shadow-none'
                    : 'bg-[#cfa579] border border-[#a67446] text-amber-950 shadow-[0_5px_0_#7d522b] cursor-not-allowed opacity-[0.93]'
                }`}
                id={`level-card-${level.id}`}
              >
                
                {/* Tile content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-1">
                  {isUnlocked ? (
                    <>
                      {/* Playful thick number lettering */}
                      <span className="font-sans font-extrabold text-2xl sm:text-3xl text-white tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                        {level.id}
                      </span>
                    </>
                  ) : (
                    <div className="flex h-7 w-7 rounded-full bg-amber-900/10 items-center justify-center border border-amber-900/15">
                      <Lock className="h-3.5 w-3.5 text-amber-950/70" />
                    </div>
                  )}
                </div>

                {/* Overlap Bottom 3 Performance Stars */}
                {isUnlocked && (
                  <div className="absolute -bottom-2.5 left-0 right-0 flex gap-0.5 justify-center z-20">
                    {[1, 2, 3].map((starIndex) => {
                      const isFilled = starsWon >= starIndex;
                      return (
                        <span 
                          key={starIndex} 
                          className={`text-xs select-none filter drop-shadow-[0_1px_1.5px_rgba(0,0,0,0.8)] ${
                            isFilled 
                              ? 'text-yellow-400 fill-current' 
                              : hasScore 
                                ? 'text-amber-800' // Partially bronze dark star
                                : 'text-amber-900/60' // Empty locked star
                          }`}
                        >
                          ★
                        </span>
                      );
                    })}
                  </div>
                )}

              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom row: Big red circular back arrow button */}
        <div className="relative z-10 flex justify-between items-end mt-10 pr-1">
          <button
            onClick={() => setShowGrid(false)}
            className="w-13 h-13 rounded-full bg-gradient-to-t from-red-700 via-rose-500 to-rose-450 border-3 border-amber-950 hover:brightness-105 active:scale-90 transition-transform shadow-[0_4px_10px_rgba(0,0,0,0.45)] flex items-center justify-center text-white cursor-pointer select-none"
            title="返回大厅"
            id="lobby-exit-circle-btn"
          >
            <ArrowLeft className="h-5 w-5 stroke-[3]" />
          </button>

          <span className="text-[10px] sm:text-[11px] font-sans font-bold text-amber-950/70 select-none">
            - 通关新挑战解锁下一关 -
          </span>
        </div>

      </div>

    </div>
  );
}
