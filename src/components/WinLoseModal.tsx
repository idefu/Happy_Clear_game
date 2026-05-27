/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Trophy, RefreshCcw, ArrowRight, Home, AlertCircle, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { LevelConfig } from '../types';

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
              <h2 className="text-xl font-black text-white">通关成功</h2>
              <p className="text-[10px] font-mono text-slate-400 font-semibold uppercase tracking-wider">
                LV {level.id}
              </p>
            </div>

            {/* Score HUD breakdown */}
            <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800/80 space-y-1.5 text-xs font-mono">
              <div className="flex justify-between items-center text-slate-400">
                <span>分数</span>
                <span className="text-white font-bold">{score}</span>
              </div>

              {movesRemaining > 0 && (
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-cyan-400">奖励</span>
                  <span className="text-cyan-400 font-bold">+{movesBonus}</span>
                </div>
              )}

              <div className="flex justify-between items-center pt-1.5 border-t border-slate-800/80">
                <span className="text-slate-200">总计</span>
                <span className="text-yellow-400 font-black text-sm">{grandTotal}</span>
              </div>

              {isNewHighScore && (
                <div className="flex items-center justify-center gap-1 text-[9px] text-amber-500 font-bold uppercase tracking-wider border-t border-slate-800/80 pt-1.5">
                  <Star className="h-3 w-3 fill-current" />
                  <span>New Record</span>
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
                  <span>下一关</span>
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
                  <span>重试</span>
                </button>
                <button
                  onClick={onChooseLevel}
                  className="flex items-center justify-center gap-1 rounded-xl bg-slate-800 hover:bg-slate-755 py-2 text-[11px] font-bold text-slate-300 transition-all border border-slate-700 cursor-pointer active:scale-95"
                  id="result-to-menu-win-btn"
                >
                  <Home className="h-3 w-3" />
                  <span>大厅</span>
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
              <h2 className="text-xl font-black text-white">挑战失败</h2>
              <p className="text-[10px] font-mono text-slate-400 font-semibold uppercase tracking-wider">
                LV {level.id}
              </p>
            </div>

            <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800/80 space-y-1.5 text-xs font-mono">
              <div className="flex justify-between items-center text-slate-400">
                <span>分数</span>
                <span className="text-white font-bold">{score}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>目标</span>
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
                <span>重试</span>
              </button>

              <button
                onClick={onChooseLevel}
                className="flex w-full items-center justify-center gap-1 rounded-xl bg-slate-800 hover:bg-slate-755 py-2 text-xs font-bold text-slate-300 transition-all border border-slate-700 cursor-pointer active:scale-95"
                id="result-to-menu-lose-btn"
              >
                <Home className="h-3.5 w-3.5" />
                <span>大厅</span>
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
