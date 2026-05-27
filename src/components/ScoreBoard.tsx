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
      {/* 1. DESKTOP PLAY VIEWPORT FRAME (MAPPED FROM USER IMAGE) */}
      {/* ──────────────────────────────────────────────────────── */}
      <div className="hidden md:grid md:grid-cols-[150px_1fr_60px] lg:grid-cols-[165px_1fr_64px] gap-4 lg:gap-6 items-center w-full max-w-5xl mx-auto flex-1">
        
        {/* COLUMN 1: LEFT WOOD HUD HUD (Stage, Goals, Moves, Thermometer Beaker) */}
        <div className="flex flex-col items-center gap-4 py-2 self-stretch justify-between" id="wood-hud-col-left">
          
          {/* Hanging Ropes & Stage Name */}
          <div className="w-full text-center relative">
            <div className="flex justify-between w-16 mx-auto h-2.5">
              <div className="w-0.5 bg-amber-950/80 rounded" />
              <div className="w-0.5 bg-amber-950/80 rounded" />
            </div>
            <div className="bg-gradient-to-b from-amber-700 via-amber-650 to-amber-800 border-2 border-amber-900 rounded-xl px-2 py-1 shadow-md text-sm font-black text-white font-sans">
              LV {level.id}
            </div>
          </div>

          {/* Goals Tray (目标) */}
          <div className="w-full bg-gradient-to-b from-amber-805 to-amber-950 border-2 border-amber-900 rounded-2xl p-2.5 shadow-lg space-y-2 relative">
            {/* Thread connections */}
            <div className="absolute -top-3 left-6 w-0.5 h-3 bg-amber-950" />
            <div className="absolute -top-3 right-6 w-0.5 h-3 bg-amber-950" />
            
            <div className="text-[10px] font-black text-center bg-amber-950/80 text-amber-300 py-0.5 px-2 rounded-md tracking-wider">
              目标
            </div>

            <div className="flex flex-col gap-2 items-center justify-center">
              {/* Ice target */}
              {level.specialGoals?.iceCount !== undefined && (
                <div 
                  onClick={onIceGoalClick}
                  className={`flex items-center justify-between w-full p-1.5 rounded-lg border cursor-pointer select-none transition-all ${
                    isIceHighlighted 
                      ? 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]' 
                      : 'bg-slate-950/60 border-slate-800'
                  }`}
                  id="desktop-ice-goal"
                >
                  <span className="text-base">❄️</span>
                  <span className="font-mono font-black text-[11px] text-cyan-300">
                    {Math.min(level.specialGoals.iceCount, goalsProgress.iceCleared)}/{level.specialGoals.iceCount}
                  </span>
                </div>
              )}

              {/* Total clearing target */}
              {level.specialGoals?.totalEliminations !== undefined && (
                <div className="flex items-center justify-between w-full p-1.5 rounded-lg border border-slate-800 bg-slate-950/60">
                  <span className="text-base text-yellow-400">💥</span>
                  <span className="font-mono font-black text-[11px] text-yellow-400">
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
                  <div key={letKey} className="flex items-center justify-between w-full p-1.5 rounded-lg border border-slate-800 bg-slate-950/60">
                    <img 
                      src={imageMap[letterTyped] || pic1} 
                      className="h-4.5 w-4.5 object-contain"
                      alt={letterTyped}
                      referrerPolicy="no-referrer"
                    />
                    <span className="font-mono font-black text-[11px] text-indigo-300">
                      {currentCount}/{targetCount}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Moves left (步数) */}
          <div className="w-full bg-gradient-to-b from-amber-805 to-amber-950 border-2 border-amber-900 rounded-2xl p-2 shadow-lg text-center relative">
            <div className="absolute -top-3 left-6 w-0.5 h-3 bg-amber-950" />
            <div className="absolute -top-3 right-6 w-0.5 h-3 bg-amber-950" />

            <div className="text-[10px] font-black bg-amber-950/80 text-amber-300 py-0.5 px-2 rounded-md tracking-wider">
              步数
            </div>
            
            <div className="mt-2 flex justify-center">
              <div className={`relative h-15 w-15 rounded-full flex items-center justify-center border-2 shadow-inner transition-all ${
                movesRemaining <= 5 
                  ? 'bg-rose-950/60 border-rose-600 animate-pulse' 
                  : 'bg-amber-900/40 border-amber-700'
              }`}>
                <span className={`font-mono text-2xl font-black ${
                  movesRemaining <= 5 ? 'text-rose-400' : 'text-amber-400'
                }`}>
                  {movesRemaining}
                </span>
              </div>
            </div>
          </div>

          {/* Vertical Thermometer score bulb (From illustration) */}
          <div className="flex flex-col items-center w-full gap-1 mt-1">
            <div className="relative w-7 h-24 bg-slate-950/80 border-2 border-slate-700/80 rounded-full flex flex-col justify-end p-0.5 overflow-hidden shadow-inner">
              {/* Colored flowing water bar */}
              <div 
                className="bg-gradient-to-t from-cyan-600 via-cyan-400 to-emerald-400 w-full rounded-full transition-all duration-300 shadow-[0_0_12px_rgba(6,182,212,0.7)]" 
                style={{ height: `${scorePercent}%` }}
              />

              {/* Pin Stars on side of beakers */}
              <div className="absolute inset-y-0 right-[-10px] flex flex-col justify-between py-1 pointer-events-none">
                <Star className={`h-3 w-3 ${isStar3 ? 'text-yellow-400 fill-current' : 'text-slate-600'}`} style={{ transform: 'translateY(0%)' }} />
                <Star className={`h-3 w-3 ${isStar2 ? 'text-yellow-400 fill-current' : 'text-slate-600'}`} style={{ transform: 'translateY(-20%)' }} />
                <Star className={`h-3 w-3 ${isStar1 ? 'text-yellow-400 fill-current' : 'text-slate-600'}`} style={{ transform: 'translateY(-50%)' }} />
              </div>
            </div>

            {/* Glowing Flask Bulb bottom center holding actual numerical points score */}
            <div className="w-14 h-14 rounded-full bg-slate-900 border-2 border-slate-700 flex flex-col items-center justify-center shadow-lg -mt-2 z-10 select-none">
              <span className="font-mono text-white font-black text-[11px] leading-none">
                {score}
              </span>
              <span className="text-[10px] font-bold text-slate-450 tracking-wider">
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
            className="flex h-10 w-10 shrink-0 transform items-center justify-center rounded-full bg-gradient-to-b from-amber-700 to-amber-900 text-amber-100 hover:text-white border-2 border-amber-950 shadow-md transition-all hover:scale-105 active:scale-90 cursor-pointer"
            id="control-btn-home"
            title="Stage selector"
          >
            <Home className="h-4.5 w-4.5" />
          </button>

          {/* Reset level reload button */}
          <button
            onClick={onResetLevel}
            className="flex h-10 w-10 shrink-0 transform items-center justify-center rounded-full bg-gradient-to-b from-amber-700 to-amber-900 text-amber-100 hover:text-white border-2 border-amber-950 shadow-md transition-all hover:scale-105 active:scale-90 cursor-pointer"
            id="control-btn-reset"
            title="Reset stage"
          >
            <RotateCcw className="h-4.5 w-4.5 text-amber-400" />
          </button>

          {/* Volume toggle mute/unmute action button */}
          <button
            onClick={onToggleSound}
            className="flex h-10 w-10 shrink-0 transform items-center justify-center rounded-full bg-slate-900 text-slate-300 border-2 border-slate-850 shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
            id="control-btn-sound"
          >
            {soundEnabled ? (
              <Volume2 className="h-4.5 w-4.5 text-emerald-400" />
            ) : (
              <VolumeX className="h-4.5 w-4.5 text-slate-500" />
            )}
          </button>
        </div>

      </div>

      {/* ──────────────────────────────────────────────────────── */}
      {/* 2. MOBILE PLAY VIEWPORT FRAME (UNIFIED HIGH-POLISH WOOD HUD) */}
      {/* ──────────────────────────────────────────────────────── */}
      <div className="block md:hidden w-full flex-1 flex flex-col justify-between pt-1" id="mobile-play-frame-container">
        {/* Top Header Controls bar */}
        <div className="flex items-center justify-between bg-gradient-to-r from-amber-700 via-amber-650 to-amber-800 border-2 border-amber-900 rounded-xl px-2.5 py-1 shadow-md mb-2" id="mobile-top-hud">
          {/* Level Identification badge */}
          <span className="font-sans font-black text-xs text-white">
            LV {level.id}
          </span>
          
          {/* Action controllers row */}
          <div className="flex gap-1.5">
            {/* Level Selector Selector button */}
            <button
              onClick={onBackToMenu}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-950 text-amber-100 border border-slate-850 transition-all active:scale-90 cursor-pointer"
              title="Home"
            >
              <Home className="h-3.5 w-3.5" />
            </button>

            {/* Reset level reload button */}
            <button
              onClick={onResetLevel}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-950 text-amber-100 border border-slate-850 transition-all active:scale-90 cursor-pointer"
              title="Reset"
            >
              <RotateCcw className="h-3.5 w-3.5 text-amber-400" />
            </button>

            {/* Volume toggle mute/unmute action button */}
            <button
              onClick={onToggleSound}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-950 border border-slate-850 transition-all active:scale-95 cursor-pointer"
            >
              {soundEnabled ? (
                <Volume2 className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <VolumeX className="h-3.5 w-3.5 text-slate-500" />
              )}
            </button>
          </div>
        </div>

        {/* Dynamic wood deck holding identical panels to desktop style */}
        <div className="grid grid-cols-[1.3fr_1fr] gap-2 mb-2 select-none" id="mobile-wood-deck">
          {/* Goals Card (目标) */}
          <div className="bg-gradient-to-b from-amber-805 to-amber-950 border-2 border-amber-900 rounded-xl p-2 shadow-md flex flex-col justify-between">
            <div className="text-[9px] font-black text-center bg-amber-950/80 text-amber-300 py-0.5 px-1.5 rounded tracking-wider">
              目标
            </div>

            <div className="grid grid-cols-2 gap-1 mt-1.5 items-center justify-center">
              {/* Ice target */}
              {level.specialGoals?.iceCount !== undefined && (
                <div 
                  onClick={onIceGoalClick}
                  className={`flex items-center justify-between px-1.5 py-1 rounded-md border cursor-pointer select-none transition-all ${
                    isIceHighlighted 
                      ? 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]' 
                      : 'bg-slate-950/60 border-slate-850'
                  }`}
                >
                  <span className="text-xs">❄️</span>
                  <span className="font-mono font-black text-[10px] text-cyan-300">
                    {Math.min(level.specialGoals.iceCount, goalsProgress.iceCleared)}/{level.specialGoals.iceCount}
                  </span>
                </div>
              )}

              {/* Total clearing target */}
              {level.specialGoals?.totalEliminations !== undefined && (
                <div className="flex items-center justify-between px-1.5 py-1 rounded-md border border-slate-850 bg-slate-950/60">
                  <span className="text-xs text-yellow-400">💥</span>
                  <span className="font-mono font-black text-[10px] text-yellow-400">
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
                  <div key={letKey} className="flex items-center justify-between px-1.5 py-1 rounded-md border border-slate-850 bg-slate-950/60">
                    <img 
                      src={imageMap[letterTyped] || pic1} 
                      className="h-3 w-3 object-contain"
                      alt={letterTyped}
                      referrerPolicy="no-referrer"
                    />
                    <span className="font-mono font-black text-[10px] text-indigo-300">
                      {currentCount}/{targetCount}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Combined Moves & Score beaker display columns */}
          <div className="flex flex-col justify-between gap-1.5">
            {/* Moves Indicator Panel */}
            <div className="bg-gradient-to-b from-amber-805 to-amber-950 border-2 border-amber-900 rounded-xl p-1 shadow-md flex items-center justify-between px-2">
              <span className="text-[9px] font-black bg-amber-950/80 text-amber-300 py-0.5 px-1.5 rounded tracking-wide uppercase">
                步数
              </span>
              <div className={`h-7 w-7 rounded-full flex items-center justify-center border shadow-inner transition-all ${
                movesRemaining <= 5 
                  ? 'bg-rose-950/60 border-rose-650 animate-pulse' 
                  : 'bg-amber-900/45 border-amber-700'
              }`}>
                <span className={`font-mono text-xs font-black ${
                  movesRemaining <= 5 ? 'text-rose-455' : 'text-amber-450'
                }`}>
                  {movesRemaining}
                </span>
              </div>
            </div>

            {/* Score beaker progress slab */}
            <div className="flex-1 bg-slate-900/80 border border-slate-800 rounded-xl p-1.5 flex items-center justify-between px-2 shadow-inner">
              <div className="flex flex-col items-center">
                <span className="font-mono font-black text-[11px] text-white leading-none">
                  {score}
                </span>
                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                  得分
                </span>
              </div>
              
              {/* Progress and Stars deck */}
              <div className="flex-1 ml-1.5 flex flex-col justify-center gap-1.5">
                <div className="w-full h-1.5 bg-slate-950 border border-slate-850 rounded-full overflow-hidden relative">
                  <div 
                    className="bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-500 h-full rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(6,182,212,0.4)]" 
                    style={{ width: `${scorePercent}%` }}
                  />
                </div>
                {/* Horizontal ratings stars */}
                <div className="flex justify-between items-center px-0.5">
                  <Star className={`h-2.5 w-2.5 ${isStar1 ? 'text-yellow-400 fill-current' : 'text-slate-650'}`} />
                  <Star className={`h-2.5 w-2.5 ${isStar2 ? 'text-yellow-400 fill-current' : 'text-slate-650'}`} />
                  <Star className={`h-2.5 w-2.5 ${isStar3 ? 'text-yellow-400 fill-current' : 'text-slate-650'}`} />
                </div>
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
