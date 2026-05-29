/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Home, RotateCcw, Volume2, VolumeX, Star, HelpCircle, Sparkles, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { LevelConfig, Letter } from '../types';
import { useTranslation } from '../utils/i18n';

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
    vinedCleared: number;
    stoneCleared: number;
  };
  isIceHighlighted?: boolean;
  isVinedHighlighted?: boolean;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onResetLevel: () => void;
  onBackToMenu: () => void;
  onIceGoalClick?: () => void;
  onVinedGoalClick?: () => void;
  children?: React.ReactNode;
}

export default function ScoreBoard({
  level,
  score,
  movesRemaining,
  goalsProgress,
  isIceHighlighted,
  isVinedHighlighted,
  soundEnabled,
  onToggleSound,
  onResetLevel,
  onBackToMenu,
  onIceGoalClick,
  onVinedGoalClick,
  children
}: ScoreBoardProps) {
  const { t, language } = useTranslation();
  // Score percentage representing energy filling up standard
  const scorePercent = Math.min(100, Math.floor((score / level.scoreGoal) * 100));

  // Milestones for scoring potion bottle
  const isStar1 = score >= level.scoreGoal * 0.3;
  const isStar2 = score >= level.scoreGoal * 0.6;
  const isStar3 = score >= level.scoreGoal * 1.0;

  // Danger moves alert blinking
  const isDangerMoves = movesRemaining <= 5;

  return (
    <div className="w-full flex-1 flex flex-col justify-start select-none" id="forest-game-wrapper">
      
      {/* ──────────────────────────────────────────────────────── */}
      {/* 1. DESKTOP PLAY VIEWPORT FRAME (CUTE CANDY-LAND HUD) */}
      {/* ──────────────────────────────────────────────────────── */}
      <div className="hidden md:grid md:grid-cols-[180px_1fr_64px] lg:grid-cols-[200px_1fr_72px] gap-4 lg:gap-6 items-center w-full max-w-5xl mx-auto flex-1">
        
        {/* COLUMN 1: LEFT CANDY HUD */}
        <div className="flex flex-col items-center gap-4 py-2 self-stretch justify-between" id="wood-hud-col-left">
          
          {/* Top Stage Banner badge */}
          <div className="w-full text-center relative">
            <div className="flex justify-between w-14 mx-auto h-2">
              <div className="w-1.5 h-2.5 bg-pink-400 rounded-full" />
              <div className="w-1.5 h-2.5 bg-pink-400 rounded-full" />
            </div>
            <div className="bg-gradient-to-r from-pink-405 to-amber-400 border-2 border-white rounded-2xl px-4 py-2 shadow-md text-sm md:text-base font-black text-slate-900 tracking-wider flex items-center justify-center gap-1">
              <Sparkles className="h-4 w-4 text-white animate-spin" style={{ animationDuration: '6s' }} />
              <span>{t('levelTitle')} {level.id}</span>
            </div>
          </div>

          {/* Goals Tray with Bubblegum theme */}
          <div className="w-full bg-gradient-to-b from-indigo-900/90 to-purple-950/95 border-2 border-pink-400/40 rounded-3xl p-4 shadow-lg space-y-3 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-pink-400 via-yellow-300 to-cyan-400 opacity-70" />
            
            <div className="text-[11px] font-black text-center bg-pink-500 text-white py-1 px-3 rounded-xl tracking-widest uppercase shadow-sm">
              {t('challengeStart')}
            </div>

            <div className="flex flex-col gap-2 items-center justify-center">
              {/* Ice target */}
              {level.specialGoals?.iceCount !== undefined && (
                <motion.div 
                  whileHover={{ scale: 1.03 }}
                  onClick={onIceGoalClick}
                  className={`flex items-center justify-between w-full p-2.5 rounded-2xl border-2 cursor-pointer select-none transition-all ${
                    isIceHighlighted 
                      ? 'bg-cyan-400/20 border-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.5)]' 
                      : 'bg-slate-950/70 border-cyan-500/20 hover:border-cyan-400/50'
                  }`}
                  id="desktop-ice-goal"
                >
                  <span className="text-lg">{t('frostGlass')}</span>
                  <span className="font-sans font-black text-sm lg:text-base text-cyan-300">
                    {Math.min(level.specialGoals.iceCount, goalsProgress.iceCleared)}/{level.specialGoals.iceCount}
                  </span>
                </motion.div>
              )}

              {/* Total clearing target */}
              {level.specialGoals?.totalEliminations !== undefined && (
                <div className="flex items-center justify-between w-full p-2.5 rounded-2xl border-2 border-amber-500/20 bg-slate-950/70">
                  <span className="text-lg">{t('eliminatingGrid')}</span>
                  <span className="font-sans font-black text-sm lg:text-base text-yellow-300">
                    {Math.min(level.specialGoals.totalEliminations, goalsProgress.totalEliminations)}/{level.specialGoals.totalEliminations}
                  </span>
                </div>
              )}

              {/* Max Combo target */}
              {level.specialGoals?.maxCombo !== undefined && (
                <div className="flex items-center justify-between w-full p-2.5 rounded-2xl border-2 border-purple-500/20 bg-slate-950/70">
                  <span className="text-xs font-black text-purple-300">{t('comboCountMetric')}</span>
                  <span className={`font-sans font-black text-sm lg:text-base ${goalsProgress.maxComboAchieved >= level.specialGoals.maxCombo ? 'text-emerald-400' : 'text-amber-300'}`}>
                    {goalsProgress.maxComboAchieved}/{level.specialGoals.maxCombo}
                  </span>
                </div>
              )}

              {/* Vines target */}
              {level.specialGoals?.vinedCount !== undefined && (
                <motion.div 
                  whileHover={{ scale: 1.03 }}
                  onClick={onVinedGoalClick}
                  className={`flex items-center justify-between w-full p-2.5 rounded-2xl border-2 cursor-pointer select-none transition-all ${
                    isVinedHighlighted 
                      ? 'bg-emerald-400/20 border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.5)]' 
                      : 'bg-slate-950/70 border-emerald-500/20 hover:border-emerald-400/50'
                  }`}
                  id="desktop-vined-goal"
                >
                  <span className="text-[13px] font-black text-emerald-300">🌿 {language === 'zh' ? '解封藤蔓' : 'Vines'}</span>
                  <span className={`font-sans font-black text-sm lg:text-base ${goalsProgress.vinedCleared >= level.specialGoals.vinedCount ? 'text-emerald-400' : 'text-emerald-300'}`}>
                    {goalsProgress.vinedCleared}/{level.specialGoals.vinedCount}
                  </span>
                </motion.div>
              )}

              {/* Stones target */}
              {level.specialGoals?.stoneCount !== undefined && (
                <div className="flex items-center justify-between w-full p-2.5 rounded-2xl border-2 border-slate-500/20 bg-slate-950/70">
                  <span className="text-[13px] font-black text-slate-300">🪨 {language === 'zh' ? '粉碎击破' : 'Stones'}</span>
                  <span className={`font-sans font-black text-sm lg:text-base ${goalsProgress.stoneCleared >= level.specialGoals.stoneCount ? 'text-emerald-400' : 'text-slate-300'}`}>
                    {goalsProgress.stoneCleared}/{level.specialGoals.stoneCount}
                  </span>
                </div>
              )}

              {/* Targets by direct animals/letters matching list */}
              {level.specialGoals?.letter && Object.keys(level.specialGoals.letter).map((letKey) => {
                const letterTyped = letKey as Letter;
                const targetCount = level.specialGoals?.letter?.[letterTyped] || 0;
                const currentCount = goalsProgress.letterClearedCount[letterTyped] || 0;
                const isDone = currentCount >= targetCount;
                return (
                  <div 
                    key={letKey} 
                    className={`flex items-center justify-between w-full p-2.5 rounded-2xl border-2 bg-slate-950/70 ${isDone ? 'border-emerald-500/30' : 'border-slate-800'}`}
                  >
                    <div className="flex items-center gap-1.5">
                      <img 
                        src={imageMap[letterTyped] || pic1} 
                        className="h-6.5 w-6.5 object-contain animate-pulse"
                        alt={letterTyped}
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <span className={`font-sans font-black text-sm lg:text-base ${isDone ? 'text-emerald-400' : 'text-pink-300'}`}>
                      {currentCount}/{targetCount}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Moves Left (步数) - Sweet Bubble Round layout */}
          <div className="w-full bg-gradient-to-b from-indigo-900/90 to-purple-950/95 border-2 border-pink-400/30 rounded-3xl p-3 shadow-lg text-center relative">
            <div className="text-[11px] font-black text-center bg-pink-500 text-white py-1 px-3 rounded-xl tracking-widest uppercase mb-2">
              {t('movesPercentText')}
            </div>
            
            <div className="flex justify-center py-0.5">
              <motion.div 
                animate={isDangerMoves ? { scale: [1, 1.14, 1] } : {}}
                transition={{ repeat: Infinity, duration: 1.0 }}
                className={`relative h-18 w-18 rounded-full flex items-center justify-center border-4 shadow-inner transition-all ${
                  isDangerMoves 
                    ? 'bg-rose-955 border-rose-500 shadow-rose-900/50' 
                    : 'bg-pink-950/50 border-pink-400/40'
                }`}
              >
                {isDangerMoves && (
                  <Heart className="absolute inset-0 h-full w-full p-3 text-rose-500/20 fill-current animate-ping" />
                )}
                <span className={`font-sans text-3xl font-black ${
                  isDangerMoves ? 'text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]' : 'text-pink-300'
                }`}>
                  {movesRemaining}
                </span>
              </motion.div>
            </div>
          </div>

          {/* Vertical magical jelly flask for live score meter */}
          <div className="flex flex-col items-center w-full gap-1.5 mt-0.5">
            <div className="relative w-8.5 h-26 bg-slate-950/85 border-2 border-pink-400/30 rounded-full flex flex-col justify-end p-0.5 overflow-hidden shadow-inner">
              {/* Glossy potion water bar */}
              <div 
                className="bg-gradient-to-t from-pink-400 via-purple-400 to-cyan-400 w-full rounded-full transition-all duration-300 shadow-[0_0_12px_rgba(244,114,182,0.8)]" 
                style={{ height: `${scorePercent}%` }}
              />

              {/* Pin Stars on side of beakers */}
              <div className="absolute inset-y-0 right-[-10px] flex flex-col justify-between py-2 pointer-events-none">
                <Star className={`h-3.5 w-3.5 ${isStar3 ? 'text-yellow-400 fill-current animate-bounce' : 'text-slate-700'}`} style={{ transform: 'translateY(10%)' }} />
                <Star className={`h-3.5 w-3.5 ${isStar2 ? 'text-yellow-400 fill-current animate-pulse' : 'text-slate-700'}`} style={{ transform: 'translateY(-10%)' }} />
                <Star className={`h-3.5 w-3.5 ${isStar1 ? 'text-yellow-400 fill-current' : 'text-slate-700'}`} style={{ transform: 'translateY(-30%)' }} />
              </div>
            </div>

            {/* Glowing scoreboard base */}
            <div className="w-20 py-2.5 rounded-2xl bg-gradient-to-r from-pink-450 to-pink-550 border-2 border-white flex flex-col items-center justify-center shadow-md -mt-1.5 z-10">
              <span className="font-sans text-white font-black text-base leading-none tracking-tight">
                {score}
              </span>
              <span className="text-[10px] font-black text-pink-100 tracking-wider uppercase mt-1">
                {t('scoreLabel')}
              </span>
            </div>
          </div>

        </div>

        {/* COLUMN 2: THE MAIN GRAPHICS AREA (GameBoard) */}
        <div className="flex flex-col items-center justify-center p-1 w-full h-full max-w-[580px]">
          {children}
        </div>

        {/* COLUMN 3: RIGHT PANEL CONTROLS (Cute glossy circular buttons) */}
        <div className="flex flex-col gap-3.5 py-4 items-center self-stretch justify-center shrink-0 w-12 animate-fade-in" id="wood-buttons-col-right">
          {/* Back to main menu selector */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onBackToMenu}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-b from-purple-400 to-indigo-650 text-white border-2 border-white shadow-lg cursor-pointer"
            id="control-btn-home"
            title={t('backToLobby')}
          >
            <Home className="h-5 w-5 stroke-[2.5]" />
          </motion.button>

          {/* Reset level load button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onResetLevel}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-b from-yellow-300 to-orange-500 text-slate-900 border-2 border-white shadow-lg cursor-pointer"
            id="control-btn-reset"
            title={t('replayBtn')}
          >
            <RotateCcw className="h-5 w-5 stroke-[2.5] text-slate-900" />
          </motion.button>

          {/* Audio toggle */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onToggleSound}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-900 border-2 border-pink-400 text-pink-300 shadow-lg cursor-pointer"
            id="control-btn-sound"
          >
            {soundEnabled ? (
              <Volume2 className="h-5 w-5 text-pink-405 animate-pulse" />
            ) : (
              <VolumeX className="h-5 w-5 text-slate-500" />
            )}
          </motion.button>
        </div>

      </div>

      {/* ──────────────────────────────────────────────────────── */}
      {/* 2. MOBILE PLAY VIEWPORT FRAME (CUTE & LIVELY MOBILE DECK) */}
      {/* ──────────────────────────────────────────────────────── */}
      <div className="block md:hidden w-full flex-1 flex flex-col justify-between pt-1" id="mobile-play-frame-container">
        
        {/* Top Header Controls bar */}
        <div className="flex items-center justify-between bg-gradient-to-r from-pink-500 to-purple-650 border-2 border-white rounded-2xl px-3 py-1.5 shadow-md mb-2" id="mobile-top-hud">
          {/* Level badge */}
          <span className="font-sans font-black text-xs text-white tracking-wider bg-black/25 px-2.5 py-1 rounded-xl">
            {t('levelTitle')} {level.id}
          </span>
          
          {/* Action controllers row */}
          <div className="flex gap-2.5">
            <button
              onClick={onBackToMenu}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white border border-white/20 active:scale-90 cursor-pointer"
              title={t('backToLobby')}
            >
              <Home className="h-4 w-4" />
            </button>

            <button
              onClick={onResetLevel}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-300 text-slate-900 border border-white active:scale-90 cursor-pointer"
              title={t('replayBtn')}
            >
              <RotateCcw className="h-4 w-4 stroke-[2.5]" />
            </button>

            <button
              onClick={onToggleSound}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 border border-pink-400 active:scale-95 cursor-pointer"
            >
              {soundEnabled ? (
                <Volume2 className="h-4 w-4 text-pink-450" />
              ) : (
                <VolumeX className="h-4 w-4 text-slate-550" />
              )}
            </button>
          </div>
        </div>

        {/* Dynamic mobile cute deck with sweet cards */}
        <div className="grid grid-cols-12 gap-2 mb-2 select-none" id="mobile-wood-deck">
          {/* Card 1: Goals Card (col-span-5) */}
          <div className="col-span-5 bg-gradient-to-b from-indigo-900/90 to-purple-950/95 border-2 border-pink-400/30 rounded-2xl p-2 shadow-md flex flex-col justify-between min-h-[70px]">
            <div className="text-[10px] font-black text-center bg-pink-500 text-white py-0.5 px-2 rounded-lg tracking-wide uppercase">
              {t('challengeStart')}
            </div>

            <div className="flex-1 flex flex-col justify-center gap-1.5 mt-1.5">
              {/* Ice target */}
              {level.specialGoals?.iceCount !== undefined && (
                <div 
                  onClick={onIceGoalClick}
                  className={`flex items-center justify-between px-1.5 py-0.5 rounded-lg border-2 cursor-pointer select-none transition-all ${
                    isIceHighlighted 
                      ? 'bg-cyan-505/20 border-cyan-400 text-cyan-300' 
                      : 'bg-slate-950/65 border-white/5'
                  }`}
                >
                  <span className="text-xs">{t('frostGlass')}</span>
                  <span className="font-sans font-black text-xs text-cyan-300">
                    {Math.min(level.specialGoals.iceCount, goalsProgress.iceCleared)}/{level.specialGoals.iceCount}
                  </span>
                </div>
              )}

              {/* Total clearing target */}
              {level.specialGoals?.totalEliminations !== undefined && (
                <div className="flex items-center justify-between px-1.5 py-0.5 rounded-lg border-2 border-white/5 bg-slate-950/65">
                  <span className="text-xs">{t('eliminatingGrid')}</span>
                  <span className="font-sans font-black text-xs text-yellow-305">
                    {Math.min(level.specialGoals.totalEliminations, goalsProgress.totalEliminations)}/{level.specialGoals.totalEliminations}
                  </span>
                </div>
              )}

              {/* Max Combo target */}
              {level.specialGoals?.maxCombo !== undefined && (
                <div className="flex items-center justify-between px-1.5 py-0.5 rounded-lg border-2 border-white/5 bg-slate-950/65">
                  <span className="text-[9px] font-bold text-slate-400">{t('comboCountMetric')}</span>
                  <span className={`font-sans font-black text-xs ${goalsProgress.maxComboAchieved >= level.specialGoals.maxCombo ? 'text-emerald-400' : 'text-amber-300'}`}>
                    {goalsProgress.maxComboAchieved}/{level.specialGoals.maxCombo}
                  </span>
                </div>
              )}

              {/* Vines target */}
              {level.specialGoals?.vinedCount !== undefined && (
                <div 
                  onClick={onVinedGoalClick}
                  className={`flex items-center justify-between px-1.5 py-0.5 rounded-lg border-2 cursor-pointer select-none transition-all ${
                    isVinedHighlighted 
                      ? 'bg-emerald-505/20 border-emerald-400 text-emerald-300' 
                      : 'bg-slate-950/65 border-white/5'
                  }`}
                >
                  <span className="text-[9px] font-bold text-slate-400">🌿 {language === 'zh' ? '藤蔓' : 'Vines'}</span>
                  <span className="font-sans font-black text-xs text-emerald-400">
                    {goalsProgress.vinedCleared}/{level.specialGoals.vinedCount}
                  </span>
                </div>
              )}

              {/* Stones target */}
              {level.specialGoals?.stoneCount !== undefined && (
                <div className="flex items-center justify-between px-1.5 py-0.5 rounded-lg border-2 border-white/5 bg-slate-950/65">
                  <span className="text-[9px] font-bold text-slate-400">🪨 {language === 'zh' ? '粉碎' : 'Stones'}</span>
                  <span className="font-sans font-black text-xs text-slate-300">
                    {goalsProgress.stoneCleared}/{level.specialGoals.stoneCount}
                  </span>
                </div>
              )}

              {/* Direct matches targets list */}
              {level.specialGoals?.letter && Object.keys(level.specialGoals.letter).map((letKey) => {
                const letterTyped = letKey as Letter;
                const targetCount = level.specialGoals?.letter?.[letterTyped] || 0;
                const currentCount = goalsProgress.letterClearedCount[letterTyped] || 0;
                return (
                  <div key={letKey} className="flex items-center justify-between px-1.5 py-0.5 rounded-lg border-2 border-white/5 bg-slate-950/65">
                    <img 
                      src={imageMap[letterTyped] || pic1} 
                      className="h-4.5 w-4.5 object-contain"
                      alt={letterTyped}
                      referrerPolicy="no-referrer"
                    />
                    <span className="font-sans font-black text-xs text-indigo-305">
                      {currentCount}/{targetCount}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 2: Moves Indicator Panel (col-span-3) */}
          <div className="col-span-3 bg-gradient-to-b from-indigo-900/90 to-purple-950/95 border-2 border-pink-400/30 rounded-2xl p-2 shadow-md flex flex-col items-center justify-between text-center min-h-[70px]">
            <span className="text-[10px] font-black w-full bg-pink-500 text-white py-0.5 px-1 rounded-lg tracking-wide uppercase text-center block">
              {t('movesPercentText')}
            </span>
            <div className="flex-1 flex items-center justify-center mt-1">
              <span className={`font-sans text-xl sm:text-2xl font-black ${
                isDangerMoves ? 'text-rose-450 animate-pulse' : 'text-pink-305'
              }`}>
                {movesRemaining}
              </span>
            </div>
          </div>

          {/* Card 3: Score Progress Slab (col-span-4) */}
          <div className="col-span-4 bg-slate-900 border-2 border-pink-400/20 rounded-2xl p-2 shadow-inner flex flex-col justify-between min-h-[70px]">
            <div className="text-center">
              <span className="text-[9px] font-black text-pink-300 uppercase tracking-wider block">
                {t('scoreLabel')}
              </span>
              <span className="font-sans font-black text-xs sm:text-sm text-yellow-300 leading-none block mt-0.5">
                {score}
              </span>
            </div>
            
            {/* Progress and Stars deck */}
            <div className="flex flex-col gap-1 mt-1">
              <div className="w-full h-1.5 bg-slate-950 border border-white/10 rounded-full overflow-hidden relative">
                <div 
                  className="bg-gradient-to-r from-pink-400 via-purple-500 to-cyan-400 h-full rounded-full transition-all duration-300" 
                  style={{ width: `${scorePercent}%` }}
                />
              </div>
              <div className="flex justify-between items-center px-0.5">
                <Star className={`h-2.5 w-2.5 ${isStar1 ? 'text-yellow-405 fill-current' : 'text-slate-700'}`} />
                <Star className={`h-2.5 w-2.5 ${isStar2 ? 'text-yellow-405 fill-current animate-pulse' : 'text-slate-700'}`} />
                <Star className={`h-2.5 w-2.5 ${isStar3 ? 'text-yellow-405 fill-current animate-bounce' : 'text-slate-700'}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Board Placement Section */}
        <div className="w-full pt-6 pb-8 flex items-center justify-center mt-auto mb-4" id="mobile-gameboard-slot">
          {children}
        </div>
      </div>

    </div>
  );
}
