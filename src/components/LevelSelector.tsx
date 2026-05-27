/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Play, Sparkles, Trophy, Flame, HelpCircle, Layers, IceCream, Star, Footprints } from 'lucide-react';
import { motion } from 'motion/react';
import { LevelConfig } from '../types';

interface LevelSelectorProps {
  levels: LevelConfig[];
  onSelectLevel: (levelId: number) => void;
  onOpenHelp: () => void;
  highScores: { [key: number]: number };
}

export default function LevelSelector({
  levels,
  onSelectLevel,
  onOpenHelp,
  highScores
}: LevelSelectorProps) {
  // Stagger animation container
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-6 px-4 space-y-8" id="level-selector-screen">
      
      {/* Hero Welcome Unit */}
      <div className="text-center space-y-4 pb-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-300 border border-indigo-500/20 shadow-md"
        >
          <Sparkles className="h-4 w-4 text-indigo-400" />
          <span>全新高帧高能炫彩快乐消除游戏</span>
        </motion.div>

        <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none bg-gradient-to-r from-indigo-200 via-indigo-100 to-indigo-300 bg-clip-text text-transparent py-1">
          快乐消消乐
        </h1>
        <p className="max-w-xl mx-auto text-sm text-slate-300 font-sans font-normal">
          拖动相同图片，连击3个或以上以消除。巧用全场共振核爆与行列等离子爆破，粉碎霜层，解锁不同不规则形状的迷宫！
        </p>

        <div className="flex justify-center gap-3 pt-2">
          <button
            onClick={onOpenHelp}
            className="flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700/90 text-slate-200 border border-slate-700 px-5 py-2 text-xs font-semibold hover:shadow-lg transition-all"
            id="levels-btn-help"
          >
            <HelpCircle className="h-4 w-4 text-indigo-400" />
            <span>游戏指南 & 爆破公式</span>
          </button>
        </div>
      </div>

      {/* Levels list grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-slate-200 flex items-center gap-2 font-sans tracking-tight">
            <Layers className="h-5 w-5 text-indigo-400" />
            <span>选择关卡 (Shatter the Levels)</span>
          </h2>
          <span className="text-xs text-slate-400 font-medium">共 6 种不规则玩法模式</span>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {levels.map((level) => {
            const levelHighScore = highScores[level.id] || 0;
            const hasIce = level.layout.flat().includes(2);
            const hasSpecialGoals = !!level.specialGoals;

            return (
              <motion.div
                key={level.id}
                variants={item}
                whileHover={{ y: -4, transition: { duration: 0.15 } }}
                className="relative flex flex-col justify-between overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 p-5 transition-all shadow-xl hover:shadow-indigo-950/20 group"
                id={`level-card-${level.id}`}
              >
                {/* Background glow overlay */}
                <div className="absolute top-0 right-0 -mr-4 -mt-4 p-12 bg-indigo-600/5 rounded-full blur-2xl group-hover:bg-indigo-600/10 transition-all pointer-events-none" />

                <div className="space-y-3.5">
                  {/* Card head */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      STAGE 0{level.id}
                    </span>
                    
                    {levelHighScore > 0 && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 font-mono">
                        <Trophy className="h-3 w-3" /> HS: {levelHighScore}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <div>
                    <h3 className="text-lg font-black font-sans leading-tight text-white group-hover:text-indigo-200 transition-colors">
                      {level.chineseName}
                    </h3>
                    <p className="text-xs font-semibold text-slate-400 italic mt-0.5">
                      {level.name}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-300 leading-relaxed font-sans font-normal h-12 overflow-hidden">
                    {level.chineseDescription}
                  </p>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {hasIce && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-cyan-300 bg-cyan-950/40 border border-cyan-500/20 px-2 py-0.5 rounded-full">
                        <IceCream className="h-2.5 w-2.5 shrink-0 text-cyan-400" />
                        霜层封锁
                      </span>
                    )}
                    {level.specialGoals?.letter && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-300 bg-amber-950/40 border border-amber-500/20 px-2 py-0.5 rounded-full">
                        <Star className="h-2.5 w-2.5 shrink-0 text-amber-400" />
                        指定收集
                      </span>
                    )}
                    {level.specialGoals?.totalEliminations && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-yellow-300 bg-yellow-950/40 border border-yellow-500/20 px-2 py-0.5 rounded-full">
                        <Flame className="h-2.5 w-2.5 shrink-0 text-yellow-400" />
                        大量消除
                      </span>
                    )}
                    {level.specialGoals?.maxCombo && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-pink-300 bg-pink-950/40 border border-pink-500/20 px-2 py-0.5 rounded-full">
                        <Sparkles className="h-2.5 w-2.5 shrink-0 text-pink-400" />
                        高阶连消
                      </span>
                    )}
                    {!hasSpecialGoals && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-300 bg-indigo-950/40 border border-indigo-500/20 px-2 py-0.5 rounded-full">
                        <Play className="h-2.5 w-2.5 shrink-0 text-indigo-400 animate-pulse" />
                        积分挑战关
                      </span>
                    )}
                  </div>

                  {/* Limits and Points */}
                  <div className="grid grid-cols-2 gap-2 border-t border-slate-800/80 pt-3 text-[11px] font-mono text-slate-400">
                    <div className="flex items-center gap-1 bg-slate-950/30 py-1 px-1.5 rounded-lg">
                      <Trophy className="h-3.5 w-3.5 text-yellow-500 shrink-0" />
                      <span>目标: {level.scoreGoal} 分</span>
                    </div>
                    <div className="flex items-center gap-1 bg-slate-950/30 py-1 px-1.5 rounded-lg">
                      <Footprints className="h-3.5 w-3.5 text-pink-500 shrink-0" />
                      <span>限: {level.movesLimit} 步内</span>
                    </div>
                  </div>
                </div>

                {/* Launch Button */}
                <button
                  onClick={() => onSelectLevel(level.id)}
                  className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl bg-indigo-600 group-hover:bg-indigo-500 py-2.5 text-xs font-bold text-white transition-all shadow-md group-hover:shadow-indigo-500/10 cursor-pointer"
                  id={`play-stage-btn-${level.id}`}
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>冲击此关</span>
                </button>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Decorative Tips */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 font-sans text-xs text-slate-400 text-center">
        💡 <strong>消消乐高手密令：</strong> 单次连消 4 个相同字母会转化为行裂/列裂激光弹；连消 5 个更可产生霓虹全场核爆。消除冰缝旁的字母才能解除锁定！
      </div>
    </div>
  );
}
