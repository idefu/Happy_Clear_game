/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Trophy, RefreshCcw, ArrowRight, Home, AlertCircle, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { LevelConfig } from '../types';
import alipayPic from '../../pay/alipay.jpg';
import wechatPic from '../../pay/wechat.png';
import { useTranslation } from '../utils/i18n';

interface WinLoseModalProps {
  isWon: boolean;
  score: number;
  movesRemaining: number;
  level: LevelConfig;
  isNewHighScore: boolean;
  onRetry: () => void;
  onNextLevel?: () => void;
  onChooseLevel: () => void;
}

export default function WinLoseModal({
  isWon,
  score,
  movesRemaining,
  level,
  isNewHighScore,
  onRetry,
  onNextLevel,
  onChooseLevel
}: WinLoseModalProps) {
  const { t } = useTranslation();
  const [sponsorType, setSponsorType] = useState<'alipay' | 'wechat' | null>(null);
  const movesBonus = isWon ? movesRemaining * 200 : 0;
  const grandTotal = score + movesBonus;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 px-4 backdrop-blur-sm" id="win-lose-modal-overlay">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-xs overflow-hidden rounded-2xl border bg-slate-900 border-slate-800 text-slate-100 p-5 text-center shadow-2xl space-y-4"
        id="result-panel"
      >
        {isWon ? (
          /* SUCCESS STATE */
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Trophy className="h-6 w-6" />
              </div>
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-black text-white">{t('winStateTitle')}</h2>
              <p className="text-[10px] font-mono text-slate-400 font-semibold uppercase tracking-wider">
                LV {level.id}
              </p>
            </div>

            {/* Score HUD breakdown */}
            <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800/80 space-y-1.5 text-xs font-mono">
              <div className="flex justify-between items-center text-slate-400">
                <span>{t('scoreLabel')}</span>
                <span className="text-white font-bold">{score}</span>
              </div>

              {movesRemaining > 0 && (
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-cyan-400">{t('bonusLabel')}</span>
                  <span className="text-cyan-400 font-bold">+{movesBonus}</span>
                </div>
              )}

              <div className="flex justify-between items-center pt-1.5 border-t border-slate-800/80">
                <span className="text-slate-200">{t('grandTotalLabel')}</span>
                <span className="text-yellow-400 font-black text-sm">{grandTotal}</span>
              </div>

              {isNewHighScore && (
                <div className="flex items-center justify-center gap-1 text-[9px] text-amber-500 font-bold uppercase tracking-wider border-t border-slate-800/80 pt-1.5">
                  <Star className="h-3 w-3 fill-current" />
                  <span>{t('newRecordLabel')}</span>
                </div>
              )}
            </div>

            {/* Actions panel */}
            <div className="space-y-2 pt-1 font-sans">
              {onNextLevel && (
                <button
                  onClick={onNextLevel}
                  className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 py-2.5 text-xs font-bold text-white transition-all shadow cursor-pointer active:scale-95"
                  id="result-next-level-btn"
                >
                  <span>{t('nextLevelBtn')}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={onRetry}
                  className="flex items-center justify-center gap-1 rounded-xl bg-slate-800 hover:bg-slate-755 py-2 text-[11px] font-bold text-slate-300 transition-all border border-slate-700 cursor-pointer active:scale-95"
                  id="result-replay-win-btn"
                >
                  <RefreshCcw className="h-3 w-3" />
                  <span>{t('replayBtn')}</span>
                </button>
                <button
                  onClick={onChooseLevel}
                  className="flex items-center justify-center gap-1 rounded-xl bg-slate-800 hover:bg-slate-755 py-2 text-[11px] font-bold text-slate-300 transition-all border border-slate-700 cursor-pointer active:scale-95"
                  id="result-to-menu-win-btn"
                >
                  <Home className="h-3 w-3" />
                  <span>{t('lobbyBtn')}</span>
                </button>
              </div>

              {/* Sponsor row */}
              <div className="relative py-1 flex items-center justify-center pt-2 select-none">
                <div className="absolute inset-x-4 h-px bg-slate-800" />
                <span className="relative px-2.5 bg-slate-900 text-[10px] font-black text-pink-400 tracking-wider">
                  💝 {t('sponsorTitle')}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-0.5">
                <button
                  onClick={() => setSponsorType('alipay')}
                  className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-550 text-white font-black text-sm transition-all active:scale-95 cursor-pointer border border-blue-400/20"
                  id="win-sponsor-alipay"
                >
                  <span>❤️ Alipay ❤️</span>
                </button>
                <button
                  onClick={() => setSponsorType('wechat')}
                  className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-555 text-white font-black text-sm transition-all active:scale-95 cursor-pointer border border-emerald-400/20"
                  id="win-sponsor-wechat"
                >
                  <span>☕ Wepay ☕</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* DEFEAT STATE */
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <AlertCircle className="h-6 w-6" />
              </div>
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-black text-white">{t('loseStateTitle')}</h2>
              <p className="text-[10px] font-mono text-slate-400 font-semibold uppercase tracking-wider">
                LV {level.id}
              </p>
            </div>

            <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800/80 space-y-1.5 text-xs font-mono">
              <div className="flex justify-between items-center text-slate-400">
                <span>{t('scoreLabel')}</span>
                <span className="text-white font-bold">{score}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>{t('challengeStart')}</span>
                <span className="text-indigo-400 font-bold">{level.scoreGoal}</span>
              </div>
            </div>

            {/* Actions panel */}
            <div className="space-y-2 pt-1 font-sans">
              <button
                onClick={onRetry}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 py-2.5 text-xs font-bold text-white transition-all shadow cursor-pointer active:scale-95"
                id="result-retry-lose-btn"
              >
                <RefreshCcw className="h-3.5 w-3.5" />
                <span>{t('replayBtn')}</span>
              </button>

              <button
                onClick={onChooseLevel}
                className="flex w-full items-center justify-center gap-1 rounded-xl bg-slate-800 hover:bg-slate-755 py-2 text-xs font-bold text-slate-300 transition-all border border-slate-700 cursor-pointer active:scale-95"
                id="result-to-menu-lose-btn"
              >
                <Home className="h-3.5 w-3.5" />
                <span>{t('lobbyBtn')}</span>
              </button>

              {/* Sponsor row */}
              <div className="relative py-1 flex items-center justify-center pt-2 select-none">
                <div className="absolute inset-x-4 h-px bg-slate-800" />
                <span className="relative px-2.5 bg-slate-900 text-[10px] font-black text-pink-400 tracking-wider">
                  💝 {t('sponsorTitle')}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-0.5">
                <button
                  onClick={() => setSponsorType('alipay')}
                  className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-550 text-white font-black text-sm transition-all active:scale-95 cursor-pointer border border-blue-400/20"
                  id="lose-sponsor-alipay"
                >
                  <span>❤️ Alipay ❤️</span>
                </button>
                <button
                  onClick={() => setSponsorType('wechat')}
                  className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-555 text-white font-black text-sm transition-all active:scale-95 cursor-pointer border border-emerald-400/20"
                  id="lose-sponsor-wechat"
                >
                  <span>☕ Wepay ☕</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Sponsorship QR Code Modal overlay */}
      {sponsorType && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => setSponsorType(null)}
        >
          <div 
            className="w-full max-w-xs bg-slate-900 border-4 border-pink-400 rounded-3xl p-6 text-center shadow-2xl space-y-4 relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            id="settlement-sponsor-modal"
          >
            {/* Top decorative gradient line */}
            <div className={`absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r ${sponsorType === 'alipay' ? 'from-blue-400 to-indigo-500' : 'from-emerald-400 to-teal-500'}`} />

            <div className="space-y-1">
              <h3 className="text-base font-black text-white flex items-center justify-center gap-1.5">
                <span>{sponsorType === 'alipay' ? `❤️ Alipay ❤️ ${t('sponsorTitle')}` : `☕ Wepay ☕ ${t('sponsorTitle')}`}</span>
              </h3>
              <p className="text-slate-300 text-[11px] font-semibold leading-relaxed">
                {t('winModalSponsorSub')}
              </p>
            </div>

            {/* QR Code Container */}
            <div className="mx-auto rounded-xl bg-white p-3 aspect-square max-w-[170px] flex items-center justify-center shadow-inner border border-slate-700/50">
              <img 
                src={sponsorType === 'alipay' ? alipayPic : wechatPic} 
                className="w-full h-full object-contain"
                alt={`${sponsorType === 'alipay' ? 'Alipay' : 'Wepay'}赞助二维码`}
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Footer tips */}
            <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-850 text-[10px] text-slate-300 leading-normal">
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
