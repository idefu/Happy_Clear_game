/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Trophy, RefreshCcw, ArrowRight, Home, Flame, Star, AlertCircle, Sparkles } from 'lucide-react';
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
  // Bonus points calculation: 200 pts for every leftover move
  const movesBonus = isWon ? movesRemaining * 200 : 0;
  const grandTotal = score + movesBonus;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-8 backdrop-blur-md" id="win-lose-modal-overlay">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative w-full max-w-md overflow-hidden rounded-3xl border bg-slate-905 border-slate-800 text-slate-100 p-6 md:p-8 text-center shadow-3xl"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)'
        }}
        id="result-panel"
      >
        {/* Absolute design accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {isWon ? (
          /* WINNING FLOW */
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="relative">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2.5 }}
                  className="flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shadow-lg shadow-indigo-500/10"
                >
                  <Trophy className="h-10 w-10 text-yellow-500" />
                </motion.div>
                <div className="absolute -top-1 -right-1 bg-amber-500 h-6 w-6 rounded-full flex items-center justify-center shadow animate-bounce">
                  <Sparkles className="h-3 w-3 text-slate-950" />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <h2 className="text-3xl font-black tracking-tight text-white bg-gradient-to-r from-yellow-300 via-amber-200 to-indigo-300 bg-clip-text text-transparent">
                恭喜通关！
              </h2>
              <p className="text-xs font-semibold text-indigo-300 font-sans tracking-wide">
                Successfully Shattered LV.{level.id}: {level.chineseName}
              </p>
            </div>

            {/* Score and Bonus display */}
            <div className="rounded-2xl bg-indigo-950/40 p-5 border border-indigo-500/15 space-y-3.5">
              <div className="flex justify-between items-center text-xs text-slate-400 font-medium">
                <span>消除基础分</span>
                <span className="font-mono text-white text-sm font-bold">{score.toLocaleString()}</span>
              </div>

              {movesRemaining > 0 && (
                <div className="flex justify-between items-center text-xs text-slate-400 font-medium pb-2.5 border-b border-indigo-505/20">
                  <span className="text-cyan-400 flex items-center gap-1">
                    剩余步数奖励 ({movesRemaining} 步)
                  </span>
                  <span className="font-mono text-cyan-300 text-sm font-bold">+{movesBonus.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between items-baseline pt-1">
                <span className="text-sm font-bold text-slate-200">最终总成绩</span>
                <span className="font-mono text-xl font-black text-yellow-400">{grandTotal.toLocaleString()}</span>
              </div>

              {isNewHighScore && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/15 text-[10px] font-bold text-yellow-300 border border-yellow-500/30 animate-pulse mt-1">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  <span>创纪录！历史新高分</span>
                </div>
              )}
            </div>

            {/* Win Actions */}
            <div className="flex flex-col gap-2.5 pt-2">
              {onNextLevel ? (
                <button
                  onClick={onNextLevel}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 py-3 text-sm font-bold text-white transition-all shadow-lg hover:shadow-indigo-500/20 shadow-indigo-950/50 cursor-pointer"
                  id="result-next-level-btn"
                >
                  <span>开启下一关卡</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <div className="text-xs text-indigo-300 font-semibold italic bg-indigo-500/5 py-2.5 rounded-xl border border-indigo-500/10">
                  ⚡ 恭喜！您已经通关了目前编排的所有字母迷藏！
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={onRetry}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 py-2.5 text-xs font-semibold text-slate-300 transition-all border border-slate-700 cursor-pointer"
                  id="result-replay-win-btn"
                >
                  <RefreshCcw className="h-3.5 w-3.5" />
                  <span>重玩本关</span>
                </button>
                <button
                  onClick={onChooseLevel}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 py-2.5 text-xs font-semibold text-slate-300 transition-all border border-slate-700 cursor-pointer"
                  id="result-to-menu-win-btn"
                >
                  <Home className="h-3.5 w-3.5" />
                  <span>返回大厅</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* LOSING FLOW */
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-lg">
                <AlertCircle className="h-10 w-10 text-rose-500 animate-bounce" />
              </div>
            </div>

            <div className="space-y-1">
              <h2 className="text-3xl font-black tracking-tight text-white bg-gradient-to-r from-rose-400 via-rose-300 to-amber-200 bg-clip-text text-transparent">
                步数用尽啦
            </h2>
              <p className="text-xs font-semibold text-rose-300 font-sans tracking-wide">
                Moves Limit Reached on LV.{level.id}
              </p>
            </div>

            <p className="text-xs text-slate-300 max-w-xs mx-auto">
              分数距离通关条件仅相差 <strong className="text-rose-400 font-bold font-mono text-sm">{(level.scoreGoal - score).toLocaleString()}</strong> 分！或者指定的碎冰/消除任务尚未结案。别灰心，再来一次！
            </p>

            <div className="rounded-2xl bg-slate-950/40 p-4 border border-slate-800 space-y-2 text-xs text-slate-400">
              <div className="flex justify-between items-center">
                <span>本轮得分:</span>
                <span className="font-mono text-white font-bold">{score.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>目标通关积分:</span>
                <span className="font-mono text-indigo-400 font-bold">{level.scoreGoal.toLocaleString()}</span>
              </div>
            </div>

            {/* Lose Actions */}
            <div className="flex flex-col gap-2.5 pt-2">
              <button
                onClick={onRetry}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-600 hover:bg-rose-500 py-3 text-sm font-bold text-white transition-all shadow-lg hover:shadow-rose-500/10 shadow-indigo-950/50 cursor-pointer"
                id="result-retry-lose-btn"
              >
                <RefreshCcw className="h-4 w-4" />
                <span>重新挑战本关</span>
              </button>

              <button
                onClick={onChooseLevel}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 py-2.5 text-xs font-semibold text-slate-300 transition-all border border-slate-700 cursor-pointer"
                id="result-to-menu-lose-btn"
              >
                <Home className="h-3.5 w-3.5" />
                <span>返回关卡大厅</span>
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
