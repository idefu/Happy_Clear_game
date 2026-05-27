/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowLeft, RotateCcw, HelpCircle, Trophy, Sparkles, Footprints, Sparkle } from 'lucide-react';
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
  onOpenHelp: () => void;
  onResetLevel: () => void;
  onBackToMenu: () => void;
  onIceGoalClick?: () => void;
}

export default function ScoreBoard({
  level,
  score,
  movesRemaining,
  goalsProgress,
  isIceHighlighted,
  onOpenHelp,
  onResetLevel,
  onBackToMenu,
  onIceGoalClick
}: ScoreBoardProps) {
  // Calculate percentage of target score
  const scorePercent = Math.min(100, Math.floor((score / level.scoreGoal) * 100));

  // Count total original ice lock tiles by looking at layout
  const totalOriginalIce = level.layout.flat().filter(cell => cell === 2).length;

  return (
    <div className="w-full text-slate-100 space-y-3.5" id="score-board-wrapper">
      {/* Top row: Title, Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToMenu}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800/80 border border-slate-700/60 hover:bg-slate-700 hover:text-white transition-all text-slate-300 shadow-md"
            title="返回关卡选择"
            id="back-to-menu-btn"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-indigo-600 px-2 py-0.5 text-xs font-black font-mono">
                LV.{level.id}
              </span>
              <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-indigo-200 to-indigo-300 bg-clip-text text-transparent">
                {level.chineseName}
              </h1>
            </div>
            <p className="text-xs text-slate-400 font-medium font-sans">
              {level.name}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={onOpenHelp}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 transition-all text-slate-300 shadow-sm"
            id="btn-trigger-help"
          >
            <HelpCircle className="h-4 w-4 text-indigo-400" />
            <span>玩法玩法</span>
          </button>
          <button
            onClick={onResetLevel}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 transition-all text-slate-300 shadow-sm"
            id="btn-trigger-reset"
          >
            <RotateCcw className="h-4 w-4 text-emerald-400" />
            <span>重置关卡</span>
          </button>
        </div>
      </div>

      {/* Main Stats Panel */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Score & Goal Tracker */}
        <div className="md:col-span-4 rounded-2xl bg-slate-900/90 border border-slate-800 p-4 flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
              <Trophy className="h-3.5 w-3.5 text-yellow-500" /> 累计积分 (Target Progress)
            </span>
            <span className="font-mono text-xs font-black text-indigo-300">
              {score}/{level.scoreGoal}
            </span>
          </div>
          
          <div className="text-3xl font-black font-mono text-white tracking-tight py-1">
            {score.toLocaleString()}
          </div>

          <div className="mt-2.5">
            <div className="flex justify-between text-[11px] text-slate-400 font-mono mb-1">
              <span>关卡目标: {level.scoreGoal} 积分</span>
              <span>{scorePercent}%</span>
            </div>
            <div className="h-2.5 w-full bg-slate-850 rounded-full overflow-hidden border border-slate-800 p-[1px]">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-300 ease-out shadow-[0_0_8px_rgba(99,102,241,0.5)]"
                style={{ width: `${scorePercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Moves Left */}
        <div className="md:col-span-3 rounded-2xl bg-slate-900/90 border border-slate-800 p-4 flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 bg-pink-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
              <Footprints className="h-4 w-4 text-pink-400" /> 剩余步数 (Moves Left)
            </span>
          </div>

          <div className="py-1 flex items-baseline gap-1.5">
            <span className={`text-4xl font-extrabold font-mono tracking-tight leading-none ${
              movesRemaining <= 5 ? 'text-rose-500 animate-pulse font-black' : 'text-pink-400'
            }`}>
              {movesRemaining}
            </span>
            <span className="text-xs text-slate-400 font-semibold font-sans">步</span>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center gap-1 font-sans">
            {movesRemaining <= 5 ? (
              <span className="text-rose-400 font-bold">⚠️ 步数告急！请专注于匹配最大消除</span>
            ) : (
              <span>合理规划每一步以达成爆破</span>
            )}
          </div>
        </div>

        {/* Level Specific Goals */}
        <div className="md:col-span-5 rounded-2xl bg-slate-900/90 border border-slate-800 p-4 flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center justify-between mb-2 pb-1 border-b border-slate-800">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" /> 通关特别条件 (Special Goals)
            </span>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded-md font-sans">
              未完成此目标仍算未连通
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs py-1">
            {/* Ice goal */}
            {level.specialGoals?.iceCount !== undefined && (
              <button 
                onClick={onIceGoalClick}
                type="button"
                title="点击在棋盘中闪烁定位尚未碎冰的位置！(Click to highlight remaining ice)"
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl transition-all duration-300 w-full text-left group/ice cursor-pointer select-none hover:scale-[1.03] active:scale-95 ${
                  isIceHighlighted
                    ? 'bg-cyan-950/90 border-cyan-400 ring-2 ring-cyan-400 ring-offset-1 ring-offset-slate-950 shadow-[0_0_25px_rgba(34,211,238,0.9)] scale-110 z-10 animate-pulse'
                    : 'bg-slate-850/60 border-blue-500/10 hover:bg-cyan-500/20 hover:border-cyan-400/50'
                } border`}
              >
                <span className={`text-slate-300 flex flex-col font-semibold transition-colors duration-200 group-hover/ice:text-cyan-200 text-left ${isIceHighlighted ? 'text-cyan-200' : ''}`}>
                  <span className="flex items-center gap-1">❄️ 碎冰层:</span>
                  <span className="text-[9px] text-slate-400 group-hover/ice:text-cyan-300/80 font-normal mt-0.5 leading-none font-sans select-none">点击定位未破冰</span>
                </span>
                <span className={`font-mono font-bold px-1.5 py-1 rounded transition-all duration-300 group-hover/ice:scale-105 ${isIceHighlighted ? 'text-slate-950 bg-cyan-300 shadow-md font-extrabold scale-110' : 'text-cyan-300 bg-blue-500/10'}`}>
                  {Math.min(level.specialGoals.iceCount, goalsProgress.iceCleared)}/{level.specialGoals.iceCount}
                </span>
              </button>
            )}

            {/* Total Eliminations goal */}
            {level.specialGoals?.totalEliminations !== undefined && (
              <div className="flex items-center justify-between bg-slate-850/60 px-2.5 py-1.5 rounded-xl border border-yellow-500/10 hover:bg-slate-800 transition-all">
                <span className="text-slate-300 flex items-center gap-1">💥 累计消除 (Clear):</span>
                <span className="font-mono font-bold text-yellow-300 bg-yellow-500/10 px-1.5 py-0.5 rounded">
                  {Math.min(level.specialGoals.totalEliminations, goalsProgress.totalEliminations)}/{level.specialGoals.totalEliminations}
                </span>
              </div>
            )}

            {/* Max Combo achieved goal */}
            {level.specialGoals?.maxCombo !== undefined && (
              <div className="flex items-center justify-between bg-slate-850/60 px-2.5 py-1.5 rounded-xl border border-pink-500/10 hover:bg-slate-800 transition-all">
                <span className="text-slate-300 flex items-center gap-1">⚡️ 最高连消 (Combo):</span>
                <span className="font-mono font-bold text-pink-300 bg-pink-500/10 px-1.5 py-0.5 rounded">
                  {goalsProgress.maxComboAchieved}/{level.specialGoals.maxCombo}
                </span>
              </div>
            )}

            {/* General designated letters count goal */}
            {level.specialGoals?.letter && Object.keys(level.specialGoals.letter).map((letKey) => {
              const letterTyped = letKey as Letter;
              const targetCount = level.specialGoals?.letter?.[letterTyped] || 0;
              const currentCleans = goalsProgress.letterClearedCount[letterTyped] || 0;
              const isCellDone = currentCleans >= targetCount;

              return (
                <div
                  key={letKey}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl border transition-all ${
                    isCellDone
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                      : 'bg-slate-850/60 border-indigo-500/10 text-slate-350'
                  }`}
                >
                  <span className="flex items-center gap-1.5 font-medium font-sans">
                    <img 
                      src={imageMap[letterTyped] || pic1} 
                      className="h-5.5 w-5.5 object-contain inline-block drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
                      alt={letterTyped}
                      referrerPolicy="no-referrer"
                    />
                    <span>匹配数:</span>
                  </span>
                  <span className="font-mono font-bold">
                    {currentCleans}/{targetCount}
                  </span>
                </div>
              );
            })}

            {/* Default condition if no special goals, like clear warm grid score */}
            {!level.specialGoals && (
              <div className="col-span-2 flex items-center gap-2 bg-indigo-950/10 w-full rounded-xl text-slate-400 italic text-[11px] p-2 border border-slate-805">
                <Sparkle className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                实现目标积分即可通关，非常基础的教学指引。
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
