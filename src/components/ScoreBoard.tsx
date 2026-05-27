/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Home, RotateCcw, Volume2, VolumeX, Star } from 'lucide-react';
import { LevelConfig, Letter } from '../types';

import pic1 from '../../pic/1.png';
import pic2 from '../../pic/2.png';
import pic3 from '../../pic/3.png';
import pic4 from '../../pic/4.png';
import pic5 from '../../pic/5.png';
import pic6 from '../../pic/6.png';

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

interface ScoreBoardProps {
  level: LevelConfig;
  score: number;
  movesRemaining: number;
  goalsProgress: {
    iceCleared: number;
    totalEliminations: number;
    maxComboAchieved: number;
    letterClearedCount: { [key in Letter]?: number };
  };
  isIceHighlighted?: boolean;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onResetLevel: () => void;
  onBackToMenu: () => void;
  onIceGoalClick?: () => void;
  children?: React.ReactNode; // The GameBoard is passed as children to structure layout beautifully
}

export default function ScoreBoard({
  level,
  score,
  movesRemaining,
  goalsProgress,
  isIceHighlighted,
  soundEnabled,
  onToggleSound,
  onResetLevel,
  onBackToMenu,
  onIceGoalClick,
  children
}: ScoreBoardProps) {
  // Score percentage representing energy filling up standard
  const scorePercent = Math.min(100, Math.floor((score / level.scoreGoal) * 100));

  // Milestones for vertical scoring beaker
  const isStar1 = score >= level.scoreGoal * 0.3;
  const isStar2 = score >= level.scoreGoal * 0.6;
  const isStar3 = score >= level.scoreGoal * 1.0;

  return (
    <div className="w-full flex-1 flex flex-col justify-start select-none" id="forest-game-wrapper">
      
      {/* ──────────────────────────────────────────────────────── */}
      {/* 1. DESKTOP PLAY VIEWPORT FRAME (OPTIMIZED HIGH-POLISH HUD) */}
      {/* ──────────────────────────────────────────────────────── */}
      <div className="hidden md:grid md:grid-cols-[180px_1fr_64px] lg:grid-cols-[200px_1fr_72px] gap-4 lg:gap-6 items-center w-full max-w-5xl mx-auto flex-1">
        
        {/* COLUMN 1: LEFT WOOD HUD HUD (Stage, Goals, Moves, Thermometer Beaker) */}
        <div className="flex flex-col items-center gap-4 py-2 self-stretch justify-between" id="wood-hud-col-left">
          
          {/* Hanging Ropes & Stage Name */}
          <div className="w-full text-center relative">
            <div className="flex justify-between w-20 mx-auto h-2.5">
              <div className="w-0.5 bg-amber-950/80 rounded" />
              <div className="w-0.5 bg-amber-950/80 rounded" />
            </div>
            <div className="bg-gradient-to-b from-amber-700 via-amber-600 to-amber-800 border-2 border-amber-950 rounded-xl px-4 py-2 shadow-lg text-sm md:text-base font-black text-white tracking-widest font-sans uppercase">
              关卡 {level.id}
            </div>
          </div>

          {/* Goals Tray (目标) */}
          <div className="w-full bg-gradient-to-b from-amber-805 to-amber-950 border-2 border-amber-950 rounded-2xl p-3.5 shadow-xl space-y-2.5 relative">
            {/* Thread connections */}
            <div className="absolute -top-3 left-8 w-0.5 h-3 bg-amber-950" />
            <div className="absolute -top-3 right-8 w-0.5 h-3 bg-amber-950" />
            
            <div className="text-xs font-extrabold text-center bg-amber-950/90 text-amber-300 py-1 px-3 rounded-lg tracking-widest uppercase">
              目标
            </div>

            <div className="flex flex-col gap-2 items-center justify-center">
              {/* Ice target */}
              {level.specialGoals?.iceCount !== undefined && (
                <div 
                  onClick={onIceGoalClick}
                  className={`flex items-center justify-between w-full p-2 rounded-xl border-2 cursor-pointer select-none transition-all ${
                    isIceHighlighted 
                      ? 'bg-cyan-500/25 border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.6)]' 
                      : 'bg-slate-950/60 border-slate-800'
                  }`}
                  id="desktop-ice-goal"
                >
                  <span className="text-xl">❄️</span>
                  <span className="font-mono font-black text-sm lg:text-base text-cyan-300">
                    {Math.min(level.specialGoals.iceCount, goalsProgress.iceCleared)}/{level.specialGoals.iceCount}
                  </span>
                </div>
              )}

              {/* Total clearing target */}
              {level.specialGoals?.totalEliminations !== undefined && (
                <div className="flex items-center justify-between w-full p-2 rounded-xl border-2 border-slate-800 bg-slate-950/60">
                  <span className="text-xl">💥</span>
                  <span className="font-mono font-black text-sm lg:text-base text-yellow-400">
                    {Math.min(level.specialGoals.totalEliminations, goalsProgress.totalEliminations)}/{level.specialGoals.totalEliminations}
                  </span>
                </div>
              )}

              {/* Targets by direct animals/letters matching list */}
              {level.specialGoals?.letter && Object.keys(level.specialGoals.letter).map((letKey) => {
                const letterTyped = letKey as Letter;
                const targetCount = level.specialGoals?.letter?.[letterTyped] || 0;
                const currentCount = goalsProgress.letterClearedCount[letterTyped] || 0;
                return (
                  <div key={letKey} className="flex items-center justify-between w-full p-2 rounded-xl border-2 border-slate-800 bg-slate-950/60">
                    <img 
                      src={imageMap[letterTyped] || pic1} 
                      className="h-6 w-6 object-contain"
                      alt={letterTyped}
                      referrerPolicy="no-referrer"
                    />
                    <span className="font-mono font-black text-sm lg:text-base text-indigo-300">
                      {currentCount}/{targetCount}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Moves left (步数) */}
          <div className="w-full bg-gradient-to-b from-amber-805 to-amber-950 border-2 border-amber-950 rounded-2xl p-3 shadow-xl text-center relative">
            <div className="absolute -top-3 left-8 w-0.5 h-3 bg-amber-950" />
            <div className="absolute -top-3 right-8 w-0.5 h-3 bg-amber-950" />

            <div className="text-xs font-extrabold bg-amber-950/90 text-amber-300 py-1 px-3 rounded-lg tracking-widest uppercase">
              剩余步数
            </div>
            
            <div className="mt-2.5 flex justify-center">
              <div className={`relative h-18 w-18 rounded-full flex items-center justify-center border-2 shadow-inner transition-all ${
                movesRemaining <= 5 
                  ? 'bg-rose-950/70 border-rose-500 animate-pulse' 
                  : 'bg-amber-900/40 border-amber-700'
              }`}>
                <span className={`font-mono text-3xl font-black ${
                  movesRemaining <= 5 ? 'text-rose-400' : 'text-amber-400'
                }`}>
                  {movesRemaining}
                </span>
              </div>
            </div>
          </div>

          {/* Vertical Thermometer score bulb (From illustration) */}
          <div className="flex flex-col items-center w-full gap-1 mt-1">
            <div className="relative w-8 h-28 bg-slate-950/80 border-2 border-slate-700/80 rounded-full flex flex-col justify-end p-0.5 overflow-hidden shadow-inner">
              {/* Colored flowing water bar */}
              <div 
                className="bg-gradient-to-t from-cyan-600 via-cyan-400 to-emerald-400 w-full rounded-full transition-all duration-300 shadow-[0_0_12px_rgba(6,182,212,0.7)]" 
                style={{ height: `${scorePercent}%` }}
              />

              {/* Pin Stars on side of beakers */}
              <div className="absolute inset-y-0 right-[-11px] flex flex-col justify-between py-2 pointer-events-none">
                <Star className={`h-3.5 w-3.5 ${isStar3 ? 'text-yellow-400 fill-current' : 'text-slate-600'}`} style={{ transform: 'translateY(10%)' }} />
                <Star className={`h-3.5 w-3.5 ${isStar2 ? 'text-yellow-400 fill-current' : 'text-slate-600'}`} style={{ transform: 'translateY(-10%)' }} />
                <Star className={`h-3.5 w-3.5 ${isStar1 ? 'text-yellow-400 fill-current' : 'text-slate-600'}`} style={{ transform: 'translateY(-30%)' }} />
              </div>
            </div>

            {/* Glowing Flask Bulb bottom center holding actual numerical points score */}
            <div className="w-16 h-16 rounded-full bg-slate-900 border-2 border-slate-700 flex flex-col items-center justify-center shadow-lg -mt-2 z-10 select-none">
              <span className="font-mono text-amber-300 font-black text-sm md:text-base leading-none">
                {score}
              </span>
              <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mt-0.5">
                得分
              </span>
            </div>
          </div>

        </div>

        {/* COLUMN 2: THE MAIN GRAPHICS AREA (GameBoard) */}
        <div className="flex flex-col items-center justify-center p-1 w-full h-full max-w-[580px]">
          {children}
        </div>

        {/* COLUMN 3: RIGHT PANEL CONTROLS (Floating circular wood discs buttons) */}
        <div className="flex flex-col gap-3 py-4 items-center self-stretch justify-center shrink-0 w-12" id="wood-buttons-col-right">
          {/* Switch Stage List Selector button */}
          <button
            onClick={onBackToMenu}
            className="flex h-12 w-12 shrink-0 transform items-center justify-center rounded-full bg-gradient-to-b from-amber-700 to-amber-900 text-amber-100 hover:text-white border-2 border-amber-950 shadow-md transition-all hover:scale-105 active:scale-90 cursor-pointer"
            id="control-btn-home"
            title="Stage selector"
          >
            <Home className="h-5 w-5" />
          </button>

          {/* Reset level reload button */}
          <button
            onClick={onResetLevel}
            className="flex h-12 w-12 shrink-0 transform items-center justify-center rounded-full bg-gradient-to-b from-amber-700 to-amber-900 text-amber-100 hover:text-white border-2 border-amber-950 shadow-md transition-all hover:scale-105 active:scale-90 cursor-pointer"
            id="control-btn-reset"
            title="Reset stage"
          >
            <RotateCcw className="h-5 w-5 text-amber-400" />
          </button>

          {/* Volume toggle mute/unmute action button */}
          <button
            onClick={onToggleSound}
            className="flex h-12 w-12 shrink-0 transform items-center justify-center rounded-full bg-slate-900 text-slate-300 border-2 border-slate-800 shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
            id="control-btn-sound"
          >
            {soundEnabled ? (
              <Volume2 className="h-5 w-5 text-emerald-400" />
            ) : (
              <VolumeX className="h-5 w-5 text-slate-500" />
            )}
          </button>
        </div>

      </div>

      {/* ──────────────────────────────────────────────────────── */}
      {/* 2. MOBILE PLAY VIEWPORT FRAME (OPTIMIZED 3-COLUMN DECK) */}
      {/* ──────────────────────────────────────────────────────── */}
      <div className="block md:hidden w-full flex-1 flex flex-col justify-between pt-1" id="mobile-play-frame-container">
        {/* Top Header Controls bar */}
        <div className="flex items-center justify-between bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 border-2 border-amber-950 rounded-xl px-3 py-1.5 shadow-md mb-2" id="mobile-top-hud">
          {/* Level badge */}
          <span className="font-sans font-black text-sm text-white tracking-widest bg-amber-950/40 px-2.5 py-0.5 rounded-md">
            关卡 {level.id}
          </span>
          
          {/* Action controllers row */}
          <div className="flex gap-2">
            {/* Home Selector */}
            <button
              onClick={onBackToMenu}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-amber-100 border border-slate-800 shadow-md transition-all active:scale-90 cursor-pointer"
              title="Home"
            >
              <Home className="h-4 w-4" />
            </button>

            {/* Reset level reload button */}
            <button
              onClick={onResetLevel}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-amber-100 border border-slate-800 shadow-md transition-all active:scale-90 cursor-pointer"
              title="Reset"
            >
              <RotateCcw className="h-4 w-4 text-amber-400" />
            </button>

            {/* Volume toggle mute/unmute button */}
            <button
              onClick={onToggleSound}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 border border-slate-800 shadow-md transition-all active:scale-95 cursor-pointer"
            >
              {soundEnabled ? (
                <Volume2 className="h-4 w-4 text-emerald-400" />
              ) : (
                <VolumeX className="h-4 w-4 text-slate-500" />
              )}
            </button>
          </div>
        </div>

        {/* Dynamic mobile wood deck redesigned with 3 balanced columns for high visibility */}
        <div className="grid grid-cols-12 gap-2 mb-2 select-none" id="mobile-wood-deck">
          {/* Card 1: Goals Card (col-span-5) */}
          <div className="col-span-5 bg-gradient-to-b from-amber-805 to-amber-950 border-2 border-amber-950 rounded-xl p-2 shadow-md flex flex-col justify-between min-h-[70px]">
            <div className="text-[10px] font-black text-center bg-amber-950/80 text-amber-300 py-0.5 px-1 rounded tracking-wide uppercase">
              目标
            </div>

            <div className="flex-1 flex flex-col justify-center gap-1 mt-1.5">
              {/* Ice target */}
              {level.specialGoals?.iceCount !== undefined && (
                <div 
                  onClick={onIceGoalClick}
                  className={`flex items-center justify-between px-1.5 py-0.5 rounded-md border cursor-pointer select-none transition-all ${
                    isIceHighlighted 
                      ? 'bg-cyan-500/25 border-cyan-400' 
                      : 'bg-slate-950/50 border-slate-900'
                  }`}
                >
                  <span className="text-sm">❄️</span>
                  <span className="font-mono font-black text-xs text-cyan-300">
                    {Math.min(level.specialGoals.iceCount, goalsProgress.iceCleared)}/{level.specialGoals.iceCount}
                  </span>
                </div>
              )}

              {/* Total clearing target */}
              {level.specialGoals?.totalEliminations !== undefined && (
                <div className="flex items-center justify-between px-1.5 py-0.5 rounded-md border border-slate-900 bg-slate-950/50">
                  <span className="text-sm">💥</span>
                  <span className="font-mono font-black text-xs text-yellow-400">
                    {Math.min(level.specialGoals.totalEliminations, goalsProgress.totalEliminations)}/{level.specialGoals.totalEliminations}
                  </span>
                </div>
              )}

              {/* Direct matches targets list */}
              {level.specialGoals?.letter && Object.keys(level.specialGoals.letter).map((letKey) => {
                const letterTyped = letKey as Letter;
                const targetCount = level.specialGoals?.letter?.[letterTyped] || 0;
                const currentCount = goalsProgress.letterClearedCount[letterTyped] || 0;
                return (
                  <div key={letKey} className="flex items-center justify-between px-1.5 py-0.5 rounded-md border border-slate-900 bg-slate-950/50">
                    <img 
                      src={imageMap[letterTyped] || pic1} 
                      className="h-4 w-4 object-contain"
                      alt={letterTyped}
                      referrerPolicy="no-referrer"
                    />
                    <span className="font-mono font-black text-xs text-indigo-300">
                      {currentCount}/{targetCount}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 2: Moves Indicator Panel (col-span-3) */}
          <div className="col-span-3 bg-gradient-to-b from-amber-805 to-amber-950 border-2 border-amber-950 rounded-xl p-2 shadow-md flex flex-col items-center justify-between text-center min-h-[70px]">
            <span className="text-[10px] font-black w-full bg-amber-950/80 text-amber-300 py-0.5 px-1 rounded tracking-wide uppercase text-center block">
              步数
            </span>
            <div className="flex-1 flex items-center justify-center mt-1">
              <span className={`font-mono text-xl md:text-2xl font-black ${
                movesRemaining <= 5 ? 'text-rose-400' : 'text-amber-400'
              }`}>
                {movesRemaining}
              </span>
            </div>
          </div>

          {/* Card 3: Score Progress Slab (col-span-4) */}
          <div className="col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-2 shadow-inner flex flex-col justify-between min-h-[70px]">
            <div className="text-center">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                得分
              </span>
              <span className="font-mono font-black text-xs sm:text-sm text-amber-300 leading-none block mt-0.5">
                {score}
              </span>
            </div>
            
            {/* Progress and Stars deck */}
            <div className="flex flex-col gap-1 mt-1">
              <div className="w-full h-2 bg-slate-950 border border-slate-850 rounded-full overflow-hidden relative">
                <div 
                  className="bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-500 h-full rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(6,182,212,0.4)]" 
                  style={{ width: `${scorePercent}%` }}
                />
              </div>
              {/* Horizontal ratings stars */}
              <div className="flex justify-between items-center px-0.5">
                <Star className={`h-2.5 w-2.5 ${isStar1 ? 'text-yellow-400 fill-current' : 'text-slate-700'}`} />
                <Star className={`h-2.5 w-2.5 ${isStar2 ? 'text-yellow-400 fill-current' : 'text-slate-700'}`} />
                <Star className={`h-2.5 w-2.5 ${isStar3 ? 'text-yellow-400 fill-current' : 'text-slate-700'}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Board Placement Section - Pushed down layout container for high finger ergonomic clearance on smartphones */}
        <div className="w-full pt-6 pb-8 flex items-center justify-center mt-auto mb-4" id="mobile-gameboard-slot">
          {children}
        </div>
      </div>

    </div>
  );
}
