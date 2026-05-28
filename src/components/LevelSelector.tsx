/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Play, Lock, Volume2, VolumeX, Grid, ArrowLeft, Star, Award, Sparkles, Smile, Trophy } from 'lucide-react';
import { motion } from 'motion/react';
import { LevelConfig } from '../types';
import startPic from '../../pic/start.jpg';
import alipayPic from '../../pay/alipay.jpg';
import wechatPic from '../../pay/wechat.png';
import { useTranslation } from '../utils/i18n';

import flagUsa from '../../country/usa.png';
import flagChina from '../../country/china.png';
import flagGermany from '../../country/germany.png';
import flagJapan from '../../country/japan_.png';
import flagIndia from '../../country/India.png';
import flagFrance from '../../country/france.png';
import flagKorea from '../../country/korea.png';
import flagSpain from '../../country/Spain.png';
import flagBrazil from '../../country/brazil.png';
import flagVietnam from '../../country/vietnam.png';

const FLAG_ORDER = [
  // First row
  { code: 'en' as const, flagImg: flagUsa, name: 'English', country: 'USA' },
  { code: 'zh' as const, flagImg: flagChina, name: '简体中文', country: '中国' },
  { code: 'de' as const, flagImg: flagGermany, name: 'Deutsch', country: 'Deutschland' },
  { code: 'ja' as const, flagImg: flagJapan, name: '日本語', country: '日本' },
  { code: 'hi' as const, flagImg: flagIndia, name: 'हिन्दी', country: 'India' },
  // Second row
  { code: 'fr' as const, flagImg: flagFrance, name: 'Français', country: 'France' },
  { code: 'ko' as const, flagImg: flagKorea, name: '한국어', country: 'Korea' },
  { code: 'es' as const, flagImg: flagSpain, name: 'Español', country: 'Spain' },
  { code: 'pt' as const, flagImg: flagBrazil, name: 'Português', country: 'Brazil' },
  { code: 'vi' as const, flagImg: flagVietnam, name: 'Tiếng Việt', country: 'Vietnam' },
];

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
  const { t, language, setLanguage } = useTranslation();
  // Hide the level grid by default, clicking '关卡选择' shows it
  const [showGrid, setShowGrid] = useState(false);
  const [sponsorType, setSponsorType] = useState<'alipay' | 'wechat' | null>(null);

  // Find the highest unlocked stage to play immediately
  const highestUnlockedId = React.useMemo(() => {
    const totalLevels = Array.isArray(levels) ? levels.length : 0;
    if (totalLevels === 0) return 1;

    let highest = 1;
    for (const lvl of levels) {
      const isFirst = lvl.id === 1;
      const prevLevelCompleted = highScores[lvl.id - 1] !== undefined && highScores[lvl.id - 1] > 0;
      if (isFirst || prevLevelCompleted) {
        highest = lvl.id;
      }
    }
    return Math.min(highest, totalLevels);
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
        staggerChildren: 0.04
      }
    }
  };

  const item = {
    hidden: { scale: 0.7, opacity: 0, y: 15 },
    show: { scale: 1, opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 14 } }
  };

  // IF GRID IS HIDDEN, SCREEN ONLY SHOWS MAIN THEMED COVER (LOBBY VIEW)
  if (!showGrid) {
    return (
      <div className="w-full max-w-xl mx-auto py-3 px-2 flex justify-center items-center" id="lobby-view-wrapper">
        <div className="relative w-full rounded-3xl overflow-hidden border-4 border-pink-400 shadow-[0_12px_40px_rgba(244,114,182,0.3)] bg-gradient-to-b from-purple-900 to-indigo-950 flex flex-col justify-end items-center px-4 py-8 sm:py-12 md:py-14 text-center min-h-[500px] sm:min-h-[550px] md:min-h-[600px] transition-all">
          
          {/* Background image covering responsively */}
          <img 
            src={startPic} 
            alt="Start Screen Cover" 
            className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none brightness-[0.70] contrast-[1.10]"
            referrerPolicy="no-referrer"
          />

          {/* Vignette styling overlay with cute pinkish/violet tint */}
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-955 via-indigo-950/40 to-pink-500/20 pointer-events-none" />

          {/* Floating magical bubbles/stars effect overlays */}
          <div className="absolute top-24 left-10 w-8 h-8 rounded-full bg-pink-400/20 blur-sm animate-pulse" />
          <div className="absolute top-48 right-12 w-12 h-12 rounded-full bg-cyan-400/15 blur-sm animate-bounce duration-5000" />
          <div className="absolute bottom-36 left-16 w-10 h-10 rounded-full bg-yellow-300/10 blur-sm animate-bounce duration-4000" />

          {/* Floated top-left language flag selection panel in 2 rows of 5 */}
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-30 flex flex-col gap-1 sm:gap-2 bg-black/60 backdrop-blur-md p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl border border-white/25 shadow-xl" id="lobby-lang-selector">
            <div className="grid grid-cols-5 gap-1 sm:gap-2">
              {FLAG_ORDER.map((lang) => {
                const isActive = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`flex items-center justify-center p-0.5 sm:p-1 rounded-md sm:rounded-lg transition-transform active:scale-90 cursor-pointer select-none ${
                      isActive 
                        ? 'bg-pink-500 border border-white shadow-md scale-110' 
                        : 'hover:bg-white/20'
                    }`}
                    title={`${lang.name} - ${lang.country}`}
                  >
                    <img
                      src={lang.flagImg}
                      alt={lang.country}
                      className="w-5.5 h-4 sm:w-8 sm:h-5.5 object-cover rounded-sm shadow-sm"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Floated top-right audio mute button with cute color */}
          <div className="absolute top-4 right-4 z-30">
            <button
              onClick={onToggleSound}
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-pink-500 border-2 border-white text-white hover:bg-pink-400 transition-all cursor-pointer active:scale-90 shadow-lg"
              id="lobby-sound-btn"
            >
              {soundEnabled ? (
                <Volume2 className="h-5 w-5 text-yellow-350 animate-bounce" style={{ animationDuration: '3s' }} />
              ) : (
                <VolumeX className="h-5 w-5 text-pink-200" />
              )}
            </button>
          </div>

          {/* Mascot speech bubble */}
          <div className="relative z-20 mb-3 max-w-xs animate-bounce" style={{ animationDuration: '4s' }}>
            <div className="bg-white text-slate-800 text-xs font-black px-4 py-2 rounded-2xl shadow-xl border-2 border-pink-400 relative flex items-center gap-1.5">
              <Smile className="h-4 w-4 text-pink-500 animate-spin" style={{ animationDuration: '8s' }} />
              <span>{t('mascotBubble')}</span>
              <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-0 h-0 border-x-[8px] border-x-transparent border-t-[10px] border-t-white" />
              <div className="absolute bottom-[-13px] left-1/2 -translate-x-1/2 w-0 h-0 border-x-[8px] border-x-transparent border-t-[10px] border-t-pink-400 -z-10" />
            </div>
          </div>

          {/* Visual Header content */}
          <div className="relative z-25 w-full flex flex-col items-center max-w-sm space-y-5">
            <div className="space-y-2 px-2">
              <h1 className="flex justify-center items-center gap-0.5 text-4xl sm:text-5xl md:text-6xl font-sans font-black tracking-tighter select-none py-2 filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]">
                {Array.from(t('title')).map((char, index) => {
                  const colors = [
                    "from-yellow-350 via-amber-400 to-orange-500", 
                    "from-rose-400 via-pink-500 to-pink-600",      
                    "from-cyan-300 via-sky-400 to-blue-500",       
                    "from-lime-300 via-green-400 to-emerald-500",  
                    "from-fuchsia-400 via-purple-500 to-violet-600"
                  ];
                  const colIdx = index % colors.length;
                  return (
                    <motion.span
                      key={index}
                      initial={{ y: 0 }}
                      animate={{ y: [0, -14, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.2,
                        delay: index * 0.12,
                        ease: "easeInOut"
                      }}
                      className="relative inline-block px-0.5 select-none"
                    >
                      {/* Bubbly white cartoon border outline simulation */}
                      <span className="absolute inset-x-0 top-[3px] text-zinc-950 font-black text-center filter blur-[0.5px] select-none text-shadow-cute text-shadow-outline">
                        {char}
                      </span>
                      {/* Neon Colorful Body */}
                      <span className={`relative bg-gradient-to-b ${colors[colIdx]} bg-clip-text text-transparent font-black block drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]`}>
                        {char}
                      </span>
                    </motion.span>
                  );
                })}
              </h1>
              <div className="flex items-center justify-center gap-1 bg-pink-500/20 border border-pink-400/30 rounded-full px-3.5 py-1 backdrop-blur-sm shadow-md">
                <Sparkles className="h-3.5 w-3.5 text-yellow-355 animate-spin" />
                <p className="text-pink-300 font-sans text-[11px] sm:text-xs font-black tracking-widest uppercase">
                  ★ HAPPY ELIMINATION ★
                </p>
                <Sparkles className="h-3.5 w-3.5 text-yellow-355 animate-pulse" />
              </div>
            </div>

            {/* Middle decorative mascot frame */}
            <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-gradient-to-br from-pink-400 via-purple-500 to-cyan-400 p-1 shadow-xl relative animate-bounce duration-3000">
              <div className="absolute inset-0.5 rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-1.5 rounded-full border-2 border-dashed border-pink-400/50 animate-spin" style={{ animationDuration: '15s' }} />
                <span className="text-3xl sm:text-4xl select-none filter drop-shadow-md">🐱</span>
              </div>
              <div className="absolute -top-1 -right-1 bg-yellow-400 text-[10px] text-slate-900 font-extrabold px-1.5 py-0.5 rounded-full shadow-md border border-white">
                NEW!
              </div>
            </div>

            {/* Lower Stack Action Buttons */}
            <div className="w-full space-y-3.5 px-4 pt-1 flex flex-col items-center">
              <button
                onClick={() => setShowGrid(true)}
                className="w-44 py-2.5 bg-gradient-to-b from-yellow-300 via-yellow-400 to-orange-500 hover:from-yellow-200 hover:to-orange-400 text-slate-900 rounded-2xl font-black text-sm transition-all active:scale-95 shadow-[0_4px_0_#c2410c] hover:shadow-[0_4px_0_#9a3412] border-2 border-yellow-200 cursor-pointer flex items-center justify-center gap-1.5 transform"
                id="lobby-primary-play-btn"
              >
                <Play className="h-4 w-4 fill-current text-slate-900 animate-pulse" />
                <span className="tracking-wide">{t('playBtn')}</span>
              </button>

              {/* Sponsor Buttons */}
              <div className="grid grid-cols-2 gap-2.5 pt-0.5 w-[220px] mx-auto">
                <button
                  onClick={() => setSponsorType('alipay')}
                  className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gradient-to-b from-blue-400 to-indigo-600 hover:from-blue-300 hover:to-indigo-550 text-white font-black text-sm transition-all active:scale-95 shadow-[0_3px_0_#1d4ed8] border-2 border-blue-200 cursor-pointer"
                  id="lobby-sponsor-alipay"
                >
                  <span>❤️ Alipay ❤️</span>
                </button>
                <button
                  onClick={() => setSponsorType('wechat')}
                  className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gradient-to-b from-emerald-400 to-emerald-600 hover:from-emerald-300 hover:to-emerald-555 text-white font-black text-sm transition-all active:scale-95 shadow-[0_3px_0_#047857] border-2 border-emerald-200 cursor-pointer"
                  id="lobby-sponsor-wechat"
                >
                  <span>☕ Wepay ☕</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Sponsorship QR Code Modal overlay */}
        {sponsorType && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-fade-in"
            onClick={() => setSponsorType(null)}
          >
            <div 
              className="w-full max-w-xs bg-slate-900 border-4 border-pink-400 rounded-3xl p-6 text-center shadow-2xl space-y-4 relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
              id="lobby-sponsor-modal"
            >
              {/* Top decorative gradient line */}
              <div className={`absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r ${sponsorType === 'alipay' ? 'from-blue-400 to-indigo-500' : 'from-emerald-400 to-teal-500'}`} />

              <div className="space-y-1">
                <h3 className="text-lg font-black text-white flex items-center justify-center gap-1.5">
                  <span>{sponsorType === 'alipay' ? `❤️ Alipay ❤️ ${t('sponsorTitle')}` : `☕ Wepay ☕ ${t('sponsorTitle')}`}</span>
                </h3>
                <p className="text-slate-300 text-xs font-semibold leading-relaxed">
                  {t('sponsorSub')}
                </p>
              </div>

              {/* QR Code Container */}
              <div className="mx-auto rounded-2xl bg-white p-3.5 aspect-square max-w-[200px] flex items-center justify-center shadow-inner border-2 border-slate-700/50">
                <img 
                  src={sponsorType === 'alipay' ? alipayPic : wechatPic} 
                  className="w-full h-full object-contain"
                  alt={`${sponsorType === 'alipay' ? 'Alipay' : 'wepay'}赞助二维码`}
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Footer tips */}
              <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-850 text-xs text-slate-300 leading-normal">
                {t('scanTip')}
              </div>

              {/* Close Button */}
              <button
                onClick={() => setSponsorType(null)}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold text-xs transition-colors cursor-pointer"
              >
                {t('closeBtn')}
              </button>
            </div>
          </div>
        )}

      </div>
    );
  }

  // IF GRID IS UNHIDDEN, SHOW THE STAGE MAP
  return (
    <div className="w-full max-w-xl mx-auto py-3 px-2 flex flex-col space-y-4" id="level-selector-screen">
      
      {/* Dynamic top bar with general stats and return controls */}
      <div className="flex items-center justify-between px-1" id="lobby-grid-header">
        <button
          onClick={() => setShowGrid(false)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 border-2 border-white hover:brightness-105 text-xs text-white font-black transition-all cursor-pointer select-none active:scale-95 shadow-md"
          id="back-to-lobby-btn"
        >
          <ArrowLeft className="h-3.5 w-3.5 stroke-[2.5]" />
          <span>{t('backToLobby')}</span>
        </button>

        {/* Compact Sound Toggle control directly in header */}
        <button
          onClick={onToggleSound}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 border-2 border-pink-400/45 hover:border-pink-400 text-pink-300 cursor-pointer active:scale-95 shadow-md"
          id="sound-toggle-btn"
        >
          {soundEnabled ? (
            <Volume2 className="h-4.5 w-4.5 text-pink-405 animate-pulse" />
          ) : (
            <VolumeX className="h-4.5 w-4.5 text-slate-600" />
          )}
        </button>
      </div>

      {/* THE CARDBOARD MAP MAIN PANEL REDESIGNED WITH CUTE BUBBLE SKIES */}
      <div className="relative w-full rounded-[40px] border-4 border-pink-300 bg-gradient-to-b from-[#e0e5ff] via-[#fce7f3] to-[#ffe4e6] p-5 md:p-7 shadow-2xl overflow-hidden min-h-[480px] flex flex-col justify-between" id="cardboard-panel-container">
        
        {/* Soft flowing clouds decor */}
        <div className="absolute top-10 left-[-40px] w-48 h-12 bg-white/60 blur-md rounded-full pointer-events-none" />
        <div className="absolute bottom-20 right-[-30px] w-36 h-10 bg-white/50 blur-md rounded-full pointer-events-none" />

        {/* Top-Right Big Playful Star Progress Count (e.g. 33/75 ⭐️) */}
        <div className="relative z-10 flex justify-between items-center mb-4 px-1">
          <div className="flex items-center gap-1 bg-white/75 border-2 border-pink-400 shadow-md px-3.5 py-1 rounded-2xl select-none">
            <Trophy className="h-4 w-4 text-amber-500 animate-bounce" />
            <span className="font-sans font-black text-xs text-slate-700">{t('cumulativeStars')}</span>
          </div>

          <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-100 to-amber-100 border-2 border-yellow-400 px-3.5 py-1 rounded-2xl shadow-md select-none">
            <span className="font-sans font-black text-sm text-yellow-700 tracking-tight">
              {totalStarsEarned}/{maxStarsPossible}
            </span>
            <span className="text-sm text-yellow-500 drop-shadow animate-bounce duration-4000">
              ⭐
            </span>
          </div>
        </div>

        {/* The 5-Column Level Grid Layout with colorful bouncy cards */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative z-10 grid grid-cols-5 gap-y-5 gap-x-2 md:gap-y-6 md:gap-x-3.5 flex-1 content-start py-2"
        >
          {levels.map((level, idx) => {
            const isFirst = level.id === 1;
            const prevLevelCompleted = highScores[level.id - 1] !== undefined && highScores[level.id - 1] > 0;
            const isUnlocked = isFirst || prevLevelCompleted;
            const starsWon = getLevelStarsCount(level);
            const hasScore = highScores[level.id] > 0;

            // Candy color gradients cycle
            const candyGradients = [
              "from-pink-450 to-rose-500 shadow-[0_5px_0_#be123c] border-pink-300",          // Pink
              "from-cyan-400 to-blue-500 shadow-[0_5px_0_#1d4ed8] border-cyan-300",          // Blue
              "from-yellow-400 to-amber-500 shadow-[0_5px_0_#b45309] border-yellow-250",      // Yellow/Orange
              "from-emerald-400 to-teal-500 shadow-[0_5px_0_#047857] border-emerald-300",    // Mint
              "from-purple-400 to-fuchsia-500 shadow-[0_5px_0_#7e22ce] border-purple-300"    // Grape
            ];
            const activeCandy = candyGradients[idx % 5];

            // Cute cartoon tile rotations
            const tilts = ['rotate-3', '-rotate-3', 'rotate-2', '-rotate-2', 'rotate-1'];
            const tiltedClass = tilts[idx % tilts.length];

            return (
              <motion.div
                key={level.id}
                variants={item}
                whileHover={isUnlocked ? { scale: 1.1, rotate: 0 } : {}}
                whileTap={isUnlocked ? { scale: 0.94 } : {}}
                onClick={() => {
                  if (isUnlocked) {
                    onSelectLevel(level.id);
                  }
                }}
                className={`relative aspect-square rounded-2xl transition-all select-none cursor-pointer ${tiltedClass} ${
                  isUnlocked
                    ? `bg-gradient-to-b ${activeCandy} border-2 text-white active:translate-y-1 active:shadow-none`
                    : 'bg-slate-350/80 border-2 border-slate-400/50 text-slate-500 shadow-[0_5px_0_#64748b] cursor-not-allowed opacity-[0.80]'
                }`}
                id={`level-card-${level.id}`}
              >
                
                {/* Glossy top reflection for candy look */}
                {isUnlocked && (
                  <div className="absolute top-0.5 inset-x-0.5 h-1/2 rounded-t-2xl bg-gradient-to-b from-white/35 to-white/0 pointer-events-none" />
                )}

                {/* Tile content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-1">
                  {isUnlocked ? (
                    <>
                      {/* Playful thick number lettering */}
                      <span className="font-sans font-black text-2xl sm:text-3xl text-white tracking-widest text-shadow-deep">
                        {level.id}
                      </span>
                    </>
                  ) : (
                    <div className="flex h-7 w-7 rounded-full bg-slate-400/20 items-center justify-center">
                      <Lock className="h-3.5 w-3.5 text-slate-500" />
                    </div>
                  )}
                </div>

                {/* Overlap Bottom 3 Rating Stars */}
                {isUnlocked && (
                  <div className="absolute -bottom-2 px-1 left-0 right-0 flex gap-0.5 justify-center z-20">
                    {[1, 2, 3].map((starIndex) => {
                      const isFilled = starsWon >= starIndex;
                      return (
                        <span 
                          key={starIndex} 
                          className={`text-[11px] select-none filter drop-shadow-[0_1px_1.5px_rgba(0,0,0,0.6)] ${
                            isFilled 
                              ? 'text-yellow-350 fill-current' 
                              : hasScore 
                                ? 'text-slate-200' 
                                : 'text-slate-100/30'
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

        {/* Bottom row back controls */}
        <div className="relative z-10 flex justify-between items-end mt-12 pr-1">
          <button
            onClick={() => setShowGrid(false)}
            className="w-12 h-12 rounded-full bg-gradient-to-b from-pink-400 to-rose-600 border-3 border-white hover:brightness-105 active:scale-90 transition-transform shadow-[0_5px_15px_rgba(244,114,182,0.4)] flex items-center justify-center text-white cursor-pointer select-none"
            title={t('backToLobby')}
            id="lobby-exit-circle-btn"
          >
            <ArrowLeft className="h-5 w-5 stroke-[3]" />
          </button>

          <span className="text-[11px] font-sans font-black text-slate-500 bg-white/70 px-3.5 py-1.5 rounded-2xl shadow-sm select-none border border-slate-200">
            {t('autoUnlockTip')}
          </span>
        </div>

      </div>

    </div>
  );
}

