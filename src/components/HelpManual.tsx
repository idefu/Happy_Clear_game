/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HelpCircle, X, Sparkles, MoveRight, HelpCircleIcon, Zap, Dice5 } from 'lucide-react';
import { motion } from 'motion/react';

interface HelpManualProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HelpManual({ isOpen, onClose }: HelpManualProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        id="help-modal"
        className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 p-5 bg-gradient-to-r from-indigo-900/40 to-violet-900/40">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-400" />
            <h2 className="text-xl font-bold font-sans tracking-tight">快乐消消乐游戏指南 (Rules)</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            id="close-help-btn"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[70vh] overflow-y-auto p-6 space-y-6">
          {/* Section 1: Core Goal */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-indigo-300 uppercase tracking-wider font-mono">基本玩法 / How to Play</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              滑动互换相邻的两个图片。如果互换后可以在水平或垂直方向连接 <strong>3个或以上相同</strong> 的图片（1-6.png），该组合就会消除并产生积分！
            </p>
            <p className="text-xs text-amber-300/90 leading-relaxed bg-amber-500/10 border border-amber-500/20 rounded-lg p-2.5">
              ⚠️ 提示：如果两个相邻的带有<strong>特技</strong>的图片互换，可直接激发各自独有的爆炸威力，大幅增加过关分数！
            </p>
          </div>

          {/* Section 2: Special Items */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-indigo-300 uppercase tracking-wider font-mono">连锁特技与特殊爆炸元素 / Special Items</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              匹配特定数量或达成连击将获赠强大的带有独特特效的毁灭级元素：
            </p>

            <div className="grid gap-3.5">
              {/* Row blaster */}
              <div className="flex items-start gap-3 rounded-xl bg-slate-800/60 p-3 border border-slate-700/50">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pink-500/10 text-pink-400 border border-pink-500/30 font-mono font-black animate-pulse text-sm">
                  ↔ 激光
                </div>
                <div>
                  <h4 className="text-sm font-bold text-pink-300">行向等离子激光炮</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    当被消除时，释放横向贯穿射线<strong>横扫并毁灭该整行所有元素</strong>。通过<strong>单次连接 4 个横向相同图片</strong>产生。
                  </p>
                </div>
              </div>

              {/* Col blaster */}
              <div className="flex items-start gap-3 rounded-xl bg-slate-800/60 p-3 border border-slate-700/50">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono font-black animate-pulse text-sm">
                  ↕ 激光
                </div>
                <div>
                  <h4 className="text-sm font-bold text-cyan-300">列向垂直等离子炮</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    当被消除时，释放纵向贯穿射线<strong>横扫并毁灭该整列所有元素</strong>。通过<strong>单次连接 4 个纵向相同图片</strong>产生。
                  </p>
                </div>
              </div>

              {/* Hyper bomb */}
              <div className="flex items-start gap-3 rounded-xl bg-slate-800/60 p-3 border border-slate-700/50">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 font-serif font-black animate-pulse text-xs">
                  ☢ 核爆
                </div>
                <div>
                  <h4 className="text-sm font-bold text-yellow-300">0.png 全场共振核爆瓶</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    自带核爆，<strong>任何普通图片（1-6.png）与 0.png 互换位置，场上所有同类图片都会跟着瞬间爆裂消除</strong>！可以通过<strong>连接 5 个相同图案</strong>获得，也会极少数自然生成。
                  </p>
                </div>
              </div>

              {/* Bomb */}
              <div className="flex items-start gap-3 rounded-xl bg-slate-800/60 p-3 border border-slate-700/50">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-red-400 border border-red-500/30 text-xs font-black">
                  💣 炸弹
                </div>
                <div>
                  <h4 className="text-sm font-bold text-red-300">爆炸重装炸弹 (Bomb)</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    消除该炸弹时，会直接<strong>席卷炸开其周围 3x3 方圆（最多8个格子）的所有图片</strong>！可以在同一消除波中<strong>同时触发横、竖激光炮产生</strong>。
                  </p>
                </div>
              </div>

              {/* Ice Locks */}
              <div className="flex items-start gap-3 rounded-xl bg-slate-800/60 p-3 border border-slate-700/50">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/30 text-lg">
                  ❄️
                </div>
                <div>
                  <h4 className="text-sm font-bold text-blue-300">极地冻结冰层 (Ice Obstacles)</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    冰层下的图片无法拖动。在它们旁边引起任意消除，或利用任何冲击波爆破，都可以彻底击碎冻冰！
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: deadlocks */}
          <div className="space-y-2 rounded-xl bg-indigo-950/40 p-3.5 border border-indigo-500/20 text-xs text-slate-300">
            <span className="font-bold text-indigo-200">🔄 智能洗牌机制 (Shuffle protection)：</span>
            当整个棋盘不包含任何可以完成消除的潜在有效排列时，魔幻粒子将静默完成重新洗牌，确保游戏畅快连击不卡死。
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-slate-800 bg-slate-950/50 p-4">
          <button
            onClick={onClose}
            className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-500 hover:shadow-lg transition-all"
            id="close-help-confirm-btn"
          >
            我明白，开始消消乐！
          </button>
        </div>
      </motion.div>
    </div>
  );
}
