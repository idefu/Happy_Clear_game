/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LevelConfig } from '../types';

export const LEVELS: LevelConfig[] = [
  {
    id: 1,
    name: "A.B.C. Beginnings",
    chineseName: "快乐初体验",
    description: "Beginner level. Swap adjacent letters to match 3 of the same letters in a line. Simple and sweet!",
    chineseDescription: "新手热身关卡。通过上下左右滑动交换相邻字母，拼出3个或3个以上连击。简单而有趣！",
    layout: [
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1]
    ],
    scoreGoal: 2000,
    movesLimit: 25,
    allowedLetters: ['A', 'B', 'C', 'D', 'E'],
    initialSpecialProbability: 0.10 // 10% tiles randomly turn out with special effect on spawn to help players!
  },
  {
    id: 2,
    name: "The Grand Cross",
    chineseName: "十字圣殿",
    description: "A cross-shaped arena. Irregular corners limit matching. Watch your steps!",
    chineseDescription: "经典的十字形棋盘。四个角落被锁死阻隔，使得匹配空间受限，滑动需要更谨慎！",
    layout: [
      [0, 0, 1, 1, 1, 1, 0, 0],
      [0, 0, 1, 1, 1, 1, 0, 0],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [0, 0, 1, 1, 1, 1, 0, 0],
      [0, 0, 1, 1, 1, 1, 0, 0]
    ],
    scoreGoal: 3500,
    movesLimit: 26,
    allowedLetters: ['A', 'B', 'C', 'D', 'E', 'F'],
    initialSpecialProbability: 0.12,
    specialGoals: {
      letter: { 'A': 15, 'B': 15 } // Match specified amount of letters
    }
  },
  {
    id: 3,
    name: "Frosty Fortress",
    chineseName: "冰封禁地",
    description: "Ice barriers block the lower board. Match adjacent to shatter the ice locks!",
    chineseDescription: "冰霜封锁住了下面一两排的字母，它们无法发生位移。在它们旁边进行消除来击碎冰层吧！",
    layout: [
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 2, 2, 2, 2, 1, 1], // grid containing '2' means spawned with Locked Ice layer
      [1, 1, 2, 2, 2, 2, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1]
    ],
    scoreGoal: 5000,
    movesLimit: 24,
    allowedLetters: ['A', 'B', 'C', 'D', 'E', 'F'],
    initialSpecialProbability: 0.14,
    specialGoals: {
      iceCount: 8,
      totalEliminations: 45
    }
  },
  {
    id: 4,
    name: "Twin Pillars",
    chineseName: "双塔圣殿",
    description: "Two narrow vertical towers separated by a central gap. Gravity feeds separately!",
    chineseDescription: "两个完全孤立的立柱，中间有一道无底深渊隔开，重力落下分成两股。多依靠横向特殊道具产生跨空连击！",
    layout: [
      [1, 1, 1, 0, 0, 1, 1, 1],
      [1, 1, 1, 0, 0, 1, 1, 1],
      [1, 1, 1, 0, 0, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 0, 0, 1, 1, 1],
      [1, 1, 1, 0, 0, 1, 1, 1],
      [1, 1, 1, 0, 0, 1, 1, 1]
    ],
    scoreGoal: 7000,
    movesLimit: 28,
    allowedLetters: ['A', 'B', 'C', 'D', 'E', 'F'],
    initialSpecialProbability: 0.15,
    specialGoals: {
      totalEliminations: 55,
      maxCombo: 2
    }
  },
  {
    id: 5,
    name: "Diamond Vault",
    chineseName: "钻石宝库",
    description: "A diamond shape grid. Extreme matching restrictions. Use your special power letters wisely!",
    chineseDescription: "由核心向两侧扩散的菱形棋盘。极端限制的边缘导致匹配几率变低，需要善加利用特殊的连击奖励！",
    layout: [
      [0, 0, 0, 1, 1, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 0, 0],
      [0, 1, 1, 1, 1, 1, 1, 0],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [0, 1, 1, 1, 1, 1, 1, 0],
      [0, 0, 1, 1, 1, 1, 0, 0],
      [0, 0, 0, 1, 1, 0, 0, 0]
    ],
    scoreGoal: 9000,
    movesLimit: 25,
    allowedLetters: ['A', 'B', 'C', 'D', 'E', 'F'],
    initialSpecialProbability: 0.16,
    specialGoals: {
      totalEliminations: 65,
      maxCombo: 3
    }
  },
  {
    id: 6,
    name: "Supernova Glid",
    chineseName: "超新星核心",
    description: "Giant irregular board. Ice blocks and stones everywhere. Triggers incredible high-combo chain reactions!",
    chineseDescription: "超大不规则异型棋盘，充满冰霜封锁区域，拥有极强的双料特殊连锁判定。挑战分数极限！",
    layout: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 2, 1, 1, 2, 1, 1, 2, 1], // Ice blockers scattered
      [1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 0, 0, 1, 0, 0, 1, 1], // Gaps
      [1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 2, 1, 1, 2, 1, 1, 2, 1], // Scattered ice
      [1, 1, 1, 1, 1, 1, 1, 1, 1],
      [0, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 0]
    ],
    scoreGoal: 12000,
    movesLimit: 32,
    allowedLetters: ['A', 'B', 'C', 'D', 'E', 'F'],
    initialSpecialProbability: 0.20,
    specialGoals: {
      iceCount: 6,
      totalEliminations: 80,
      maxCombo: 3
    }
  },
  {
    id: 7,
    name: "Sparking Trails",
    chineseName: "火花轨迹",
    description: "Symmetrical icy columns frame the board. Clear the glaciers to release maximum space!",
    chineseDescription: "冰封轨道在棋盘两侧形成天然阻碍。集中火力生成特殊字母，轰碎两旁的极寒坚冰！",
    layout: [
      [2, 1, 1, 1, 1, 1, 1, 2],
      [2, 1, 1, 1, 1, 1, 1, 2],
      [2, 1, 1, 1, 1, 1, 1, 2],
      [2, 1, 1, 1, 1, 1, 1, 2],
      [2, 1, 1, 1, 1, 1, 1, 2],
      [2, 1, 1, 1, 1, 1, 1, 2],
      [2, 1, 1, 1, 1, 1, 1, 2],
      [2, 1, 1, 1, 1, 1, 1, 2]
    ],
    scoreGoal: 15000,
    movesLimit: 28,
    allowedLetters: ['A', 'B', 'C', 'D', 'E', 'F'],
    initialSpecialProbability: 0.18,
    specialGoals: {
      iceCount: 16,
      totalEliminations: 90,
      maxCombo: 3
    }
  },
  {
    id: 8,
    name: "Special Delivery",
    chineseName: "特效漫天",
    description: "Extremely high spawning rate of special tiles! Take absolute advantage of combining adjacent specials together!",
    chineseDescription: "极高概率直接生成特效字母！这关专为双重特殊字母合击而设计，来一场震撼的连环大爆炸吧！",
    layout: [
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 0, 0, 0, 0, 1, 1],
      [1, 1, 0, 0, 0, 0, 1, 1],
      [1, 1, 0, 0, 0, 0, 1, 1],
      [1, 1, 0, 0, 0, 0, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1]
    ],
    scoreGoal: 18000,
    movesLimit: 25,
    allowedLetters: ['A', 'B', 'C', 'D', 'E', 'F'],
    initialSpecialProbability: 0.25,
    specialGoals: {
      totalEliminations: 105,
      maxCombo: 3
    }
  },
  {
    id: 9,
    name: "The Butterfly",
    chineseName: "蝶翼迷踪",
    description: "Symmetrical winged chessboard. Outer edges are frozen. Break through the wings!",
    chineseDescription: "对称型蝴蝶双翼棋盘，翅膀边缘覆盖冰块。通过消除点亮并击破蝴蝶双翼层！",
    layout: [
      [1, 1, 0, 0, 0, 0, 1, 1],
      [1, 2, 1, 0, 0, 1, 2, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [0, 1, 2, 1, 1, 2, 1, 0],
      [0, 1, 2, 1, 1, 2, 1, 0],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 2, 1, 0, 0, 1, 2, 1],
      [1, 1, 0, 0, 0, 0, 1, 1]
    ],
    scoreGoal: 22000,
    movesLimit: 30,
    allowedLetters: ['A', 'B', 'C', 'D', 'E', 'F'],
    initialSpecialProbability: 0.16,
    specialGoals: {
      iceCount: 8,
      totalEliminations: 100,
      maxCombo: 3
    }
  },
  {
    id: 10,
    name: "Hourglass Crisis",
    chineseName: "时间沙漏",
    description: "Very tight center funnel limits standard falls. Create vertical blasts to force a flow!",
    chineseDescription: "沙漏形的极窄中部，极大限制了下方碎片的常规坠落。善用各种条纹爆破来疏通全场！",
    layout: [
      [1, 1, 1, 1, 1, 1, 1, 1],
      [0, 1, 1, 1, 1, 1, 1, 0],
      [0, 0, 1, 1, 1, 1, 0, 0],
      [0, 0, 0, 1, 1, 0, 0, 0],
      [0, 0, 0, 1, 1, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 0, 0],
      [0, 1, 1, 1, 1, 1, 1, 0],
      [1, 1, 1, 1, 1, 1, 1, 1]
    ],
    scoreGoal: 25000,
    movesLimit: 22,
    allowedLetters: ['A', 'B', 'C', 'D', 'E'],
    initialSpecialProbability: 0.15,
    specialGoals: {
      totalEliminations: 75,
      maxCombo: 3
    }
  },
  {
    id: 11,
    name: "Frost Ring",
    chineseName: "冰环试炼",
    description: "Full outer frozen border! Create blasts at the center to shatter ice ring.",
    chineseDescription: "外围一整圈被冰霜封锁！你需要在中央制造强大的清屏道具，里应外合击碎所有外环寒冰！",
    layout: [
      [2, 2, 2, 2, 2, 2, 2, 2],
      [2, 1, 1, 1, 1, 1, 1, 2],
      [2, 1, 0, 0, 0, 0, 1, 2],
      [2, 1, 0, 0, 0, 0, 1, 2],
      [2, 1, 0, 0, 0, 0, 1, 2],
      [2, 1, 0, 0, 0, 0, 1, 2],
      [2, 1, 1, 1, 1, 1, 1, 2],
      [2, 2, 2, 2, 2, 2, 2, 2]
    ],
    scoreGoal: 28000,
    movesLimit: 35,
    allowedLetters: ['A', 'B', 'C', 'D', 'E', 'F'],
    initialSpecialProbability: 0.18,
    specialGoals: {
      iceCount: 24,
      totalEliminations: 115,
      maxCombo: 4
    }
  },
  {
    id: 12,
    name: "Stairway to Heaven",
    chineseName: "步步高升",
    description: "Redesigned ascending diagonal stairway pattern with stable pillars! Maximizes matches without visual stalemates.",
    chineseDescription: "重新设计的不规则对角阶梯。保留了节节高的斜向梯形美感，同时拓宽了流动通路，彻底告别死局！",
    layout: [
      [0, 0, 0, 0, 0, 1, 1, 1],
      [0, 0, 0, 0, 1, 1, 1, 1],
      [0, 0, 0, 1, 1, 1, 1, 1],
      [0, 0, 1, 1, 1, 1, 1, 1],
      [0, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 2, 2, 1, 1, 1]
    ],
    scoreGoal: 12000,
    movesLimit: 25,
    allowedLetters: ['A', 'B', 'C', 'D', 'E'],
    initialSpecialProbability: 0.14,
    specialGoals: {
      letter: { 'C': 25, 'D': 25 },
      totalEliminations: 80,
      maxCombo: 3
    }
  },
  {
    id: 13,
    name: "Transient Fusion",
    chineseName: "瞬态熔聚",
    description: "Ice barriers protect a nuclear empty core. Combine starting specials to blast open the reactive chamber!",
    chineseDescription: "高能空心核能室，四周包围坚固的核阻冰墙。充分蓄力引爆中心冰墙，感受裂变能量波动的爽快感！",
    layout: [
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 2, 2, 2, 2, 1, 1],
      [1, 1, 2, 0, 0, 2, 1, 1],
      [1, 1, 2, 0, 0, 2, 1, 1],
      [1, 1, 2, 2, 2, 2, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1]
    ],
    scoreGoal: 32000,
    movesLimit: 28,
    allowedLetters: ['A', 'B', 'C', 'D', 'E', 'F'],
    initialSpecialProbability: 0.22,
    specialGoals: {
      iceCount: 12,
      totalEliminations: 95,
      maxCombo: 3
    }
  },
  {
    id: 14,
    name: "Combo Heaven",
    chineseName: "连消天堂",
    description: "Highly reactive 9x9 massive playground with only 4 letters allowed! Triggers magnificent endless cascade chain reactions!",
    chineseDescription: "超级刺激的 9x9 大型棋盘，仅仅只包含4种字母元素！让你不费吹灰之力，体验全屏无限连消的顶级爽快解压！",
    layout: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    scoreGoal: 34000,
    movesLimit: 28,
    allowedLetters: ['A', 'B', 'C', 'D'],
    initialSpecialProbability: 0.25,
    specialGoals: {
      totalEliminations: 150,
      maxCombo: 5
    }
  },
  {
    id: 15,
    name: "Ice Castle Siege",
    chineseName: "攻占寒星堡",
    description: "Top and bottom frozen ramparts defend the treasure. Break adjacent combinations to siege the fortress!",
    chineseDescription: "极昼寒星堡的顶部与底部冻结箭塔。在中央空旷区域精巧走位制造合成特效，由内而外击毁寒霜防线！",
    layout: [
      [2, 0, 2, 0, 2, 0, 2, 0],
      [2, 1, 2, 1, 2, 1, 2, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 2, 1, 2, 1, 2, 1, 2],
      [2, 2, 2, 2, 2, 2, 2, 2]
    ],
    scoreGoal: 38000,
    movesLimit: 32,
    allowedLetters: ['A', 'B', 'C', 'D', 'E'],
    initialSpecialProbability: 0.19,
    specialGoals: {
      iceCount: 12,
      totalEliminations: 110,
      maxCombo: 4
    }
  },
  {
    id: 16,
    name: "X-Reactor Cross",
    chineseName: "极耀十字爆",
    description: "A gorgeous X-shaped frozen blockade dividing the board! Shattering the diagonal shield causes massive cross-collapses!",
    chineseDescription: "宏大的X型交叉对角冰桥，将版块切割为四等分！粉碎对角线上的冰霜水晶，引发全方向的超级几何塌陷！",
    layout: [
      [2, 1, 1, 1, 1, 1, 1, 2],
      [1, 2, 1, 1, 1, 1, 2, 1],
      [1, 1, 2, 1, 1, 2, 1, 1],
      [1, 1, 1, 2, 2, 1, 1, 1],
      [1, 1, 1, 2, 2, 1, 1, 1],
      [1, 1, 2, 1, 1, 2, 1, 1],
      [1, 2, 1, 1, 1, 1, 2, 1],
      [2, 1, 1, 1, 1, 1, 1, 2]
    ],
    scoreGoal: 42000,
    movesLimit: 34,
    allowedLetters: ['A', 'B', 'C', 'D', 'E', 'F'],
    initialSpecialProbability: 0.20,
    specialGoals: {
      iceCount: 14,
      totalEliminations: 115,
      maxCombo: 4
    }
  },
  {
    id: 17,
    name: "Cosmic Channels",
    chineseName: "星海跃迁道",
    description: "Symmetrical pocket corridors linked by narrow gravity gates. Chain sideways blasters to swap matter instantly!",
    chineseDescription: "对称的多维星际口袋道，被中间两道窄门阻断。通过创造横向波动激光特效，在通道间实现炫彩高能打击！",
    layout: [
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 2, 1, 1, 1, 1, 2, 1],
      [1, 0, 1, 1, 1, 1, 0, 1],
      [1, 1, 1, 2, 2, 1, 1, 1],
      [1, 1, 1, 2, 2, 1, 1, 1],
      [1, 0, 1, 1, 1, 1, 0, 1],
      [1, 2, 1, 1, 1, 1, 2, 1],
      [1, 1, 1, 1, 1, 1, 1, 1]
    ],
    scoreGoal: 46000,
    movesLimit: 30,
    allowedLetters: ['A', 'B', 'C', 'D', 'E', 'F'],
    initialSpecialProbability: 0.24,
    specialGoals: {
      letter: { 'E': 25, 'F': 25 },
      totalEliminations: 105,
      maxCombo: 4
    }
  },
  {
    id: 18,
    name: "Gold Sieve Trident",
    chineseName: "淘冰黄金戟",
    description: "Three thin vertical channels cascade into a wide base pool. Liquid layouts deliver superb dropping cascade feelings!",
    chineseDescription: "三条狭长高空落差通道，在底部汇合并泄流。超长落差造就完美的重力崩塌感，让连击源源不断！",
    layout: [
      [1, 0, 1, 0, 1, 0, 1, 0],
      [1, 0, 1, 0, 1, 0, 1, 0],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 2, 1, 2, 1, 2, 1, 2],
      [1, 2, 2, 2, 2, 2, 2, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1]
    ],
    scoreGoal: 50000,
    movesLimit: 30,
    allowedLetters: ['A', 'B', 'C', 'D', 'E', 'F'],
    initialSpecialProbability: 0.18,
    specialGoals: {
      iceCount: 10,
      totalEliminations: 110,
      maxCombo: 4
    }
  },
  {
    id: 19,
    name: "Infinity Loop Orbit",
    chineseName: "时空无限环",
    description: "Symmetric nested infinity layout tracking infinite flow. High strategic swapping maximizes incredible specials combinations!",
    chineseDescription: "完美的无限符号流转轨道。异型环状结构使滑动重组更加考验智慧，能极其丝滑地合成高级爆破星星！",
    layout: [
      [0, 1, 1, 1, 1, 1, 1, 0],
      [1, 1, 2, 1, 1, 2, 1, 1],
      [1, 2, 0, 1, 1, 0, 2, 1],
      [1, 1, 1, 0, 0, 1, 1, 1],
      [1, 0, 0, 1, 1, 0, 0, 1],
      [1, 2, 0, 1, 1, 0, 2, 1],
      [1, 1, 2, 1, 1, 2, 1, 1],
      [0, 1, 1, 1, 1, 1, 1, 0]
    ],
    scoreGoal: 55000,
    movesLimit: 28,
    allowedLetters: ['A', 'B', 'C', 'D', 'E'],
    initialSpecialProbability: 0.22,
    specialGoals: {
      iceCount: 8,
      totalEliminations: 115,
      maxCombo: 4
    }
  },
  {
    id: 20,
    name: "Millennium Spark",
    chineseName: "终极圣殿",
    description: "The grand master level. Huge full grid with challenging goals and dual combination possibilities!",
    chineseDescription: "千回百折的终极试炼课！极大的高阶异形拼图，要求你用毕生所学特效，创造奇迹！",
    layout: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 2, 1, 2, 1, 2, 1, 2, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 2, 1, 1, 1, 1, 1, 2, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 2, 1, 1, 1, 1, 1, 2, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 2, 1, 2, 1, 2, 1, 2, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    scoreGoal: 75000,
    movesLimit: 40,
    allowedLetters: ['A', 'B', 'C', 'D', 'E', 'F'],
    initialSpecialProbability: 0.22,
    specialGoals: {
      iceCount: 12,
      totalEliminations: 140,
      maxCombo: 5
    }
  }
];
