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
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1]
    ],
    scoreGoal: 1000,
    movesLimit: 18,
    allowedLetters: ['A', 'B', 'C', 'D', 'E'],
    initialSpecialProbability: 0.12
  },
  {
    id: 2,
    name: "The Grand Cross",
    chineseName: "十字圣殿",
    description: "A cross-shaped arena. Irregular corners limit matching. Watch your steps!",
    chineseDescription: "经典的十字形棋盘。角落被空地阻隔，使匹配空间集中，滑动需要更富有技巧性！",
    layout: [
      [0, 1, 1, 1, 0],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [0, 1, 1, 1, 0]
    ],
    scoreGoal: 1600,
    movesLimit: 20,
    allowedLetters: ['A', 'B', 'C', 'D', 'E'],
    initialSpecialProbability: 0.14,
    specialGoals: {
      letter: { 'A': 8, 'B': 8 }
    }
  },
  {
    id: 3,
    name: "Frosty Fortress",
    chineseName: "冰封禁地",
    description: "Ice barriers block the lower board. Match adjacent to shatter the ice locks!",
    chineseDescription: "冰霜封锁住了中央的关键。在冰霜格子旁边进行消除去除坚硬碎冰吧！",
    layout: [
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 2, 2, 2, 1],
      [1, 2, 2, 2, 1],
      [1, 1, 1, 1, 1]
    ],
    scoreGoal: 2200,
    movesLimit: 20,
    allowedLetters: ['A', 'B', 'C', 'D', 'E'],
    initialSpecialProbability: 0.15,
    specialGoals: {
      iceCount: 6,
      totalEliminations: 28
    }
  },
  {
    id: 4,
    name: "Twin Pillars",
    chineseName: "双塔圣殿",
    description: "Two narrow vertical towers separated by a central gap. Gravity feeds separately!",
    chineseDescription: "两个完全孤立的立柱，中间有一道无底深渊隔开。多多利用合成激光来穿透长廊连击吧！",
    layout: [
      [1, 1, 0, 1, 1],
      [1, 1, 0, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 0, 1, 1],
      [1, 1, 0, 1, 1]
    ],
    scoreGoal: 2605,
    movesLimit: 22,
    allowedLetters: ['A', 'B', 'C', 'D', 'E'],
    initialSpecialProbability: 0.16,
    specialGoals: {
      totalEliminations: 30,
      maxCombo: 2
    }
  },
  {
    id: 5,
    name: "Diamond Vault",
    chineseName: "钻石宝库",
    description: "A diamond shape grid. Extreme matching restrictions. Use your special power letters wisely!",
    chineseDescription: "精致的菱形古塔棋盘，由于周围边缘被遮盖，极其考验滑动手感与策略选择！",
    layout: [
      [0, 1, 1, 1, 0],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [0, 1, 1, 1, 0]
    ],
    scoreGoal: 3200,
    movesLimit: 20,
    allowedLetters: ['A', 'B', 'C', 'D', 'E'],
    initialSpecialProbability: 0.18,
    specialGoals: {
      totalEliminations: 32,
      maxCombo: 2
    }
  },
  {
    id: 6,
    name: "Supernova Glid",
    chineseName: "超新星核心",
    description: "Giant irregular board. Ice blocks and stones everywhere. Triggers incredible high-combo chain reactions!",
    chineseDescription: "多裂缝不规则棋盘，布满随机散落的核能冰墙。利用强大的连消产生高空物料崩塌！",
    layout: [
      [1, 1, 1, 1, 1, 1],
      [1, 2, 1, 1, 2, 1],
      [1, 1, 1, 1, 1, 1],
      [1, 1, 0, 0, 1, 1],
      [1, 2, 1, 1, 2, 1],
      [1, 1, 1, 1, 1, 1]
    ],
    scoreGoal: 4200,
    movesLimit: 24,
    allowedLetters: ['A', 'B', 'C', 'D', 'E'],
    initialSpecialProbability: 0.20,
    specialGoals: {
      iceCount: 4,
      totalEliminations: 36,
      maxCombo: 3
    }
  },
  {
    id: 7,
    name: "Sparking Trails",
    chineseName: "火花轨迹",
    description: "Symmetrical icy columns frame the board. Clear the glaciers to release maximum space!",
    chineseDescription: "对称型冰河轨道。两个外立柱覆盖着重冰封印，想方设法轰开障碍扩大战场！",
    layout: [
      [2, 1, 1, 1, 2],
      [2, 1, 1, 1, 2],
      [2, 1, 1, 1, 2],
      [2, 1, 1, 1, 2],
      [2, 1, 1, 1, 2]
    ],
    scoreGoal: 4800,
    movesLimit: 22,
    allowedLetters: ['A', 'B', 'C', 'D', 'E'],
    initialSpecialProbability: 0.18,
    specialGoals: {
      iceCount: 10,
      totalEliminations: 40,
      maxCombo: 3
    }
  },
  {
    id: 8,
    name: "Special Delivery",
    chineseName: "特效漫天",
    description: "Extremely high spawning rate of special tiles! Take absolute advantage of combining adjacent specials together!",
    chineseDescription: "专供体验解压大连击的游乐场！中央留空，伴随着极高的高级炸弹出现机率！",
    layout: [
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 0, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1]
    ],
    scoreGoal: 6000,
    movesLimit: 20,
    allowedLetters: ['A', 'B', 'C', 'D', 'E'],
    initialSpecialProbability: 0.25,
    specialGoals: {
      totalEliminations: 45,
      maxCombo: 3
    }
  },
  {
    id: 9,
    name: "The Butterfly",
    chineseName: "蝶翼迷踪",
    description: "Symmetrical winged chessboard. Outer edges are frozen. Break through the wings!",
    chineseDescription: "精致的蝴蝶蝶翼双侧棋盘。蝴蝶的四角和中枢带有坚硬霜层，在闪烁高光中逐级瓦解它们！",
    layout: [
      [1, 1, 0, 1, 1],
      [1, 2, 1, 2, 1],
      [1, 1, 1, 1, 1],
      [0, 1, 2, 1, 0],
      [1, 1, 0, 1, 1]
    ],
    scoreGoal: 6800,
    movesLimit: 22,
    allowedLetters: ['A', 'B', 'C', 'D', 'E'],
    initialSpecialProbability: 0.18,
    specialGoals: {
      iceCount: 3,
      totalEliminations: 40,
      maxCombo: 3
    }
  },
  {
    id: 10,
    name: "Hourglass Crisis",
    chineseName: "时间沙漏",
    description: "Very tight center funnel limits standard falls. Create vertical blasts to force a flow!",
    chineseDescription: "沙漏形的极窄管道阻挡了大部分自然掉落，合成行爆破或十字黑洞能产生最棒的碎石流动！",
    layout: [
      [1, 1, 1, 1, 1],
      [0, 1, 1, 1, 0],
      [0, 1, 1, 1, 0],
      [0, 1, 1, 1, 0],
      [1, 1, 1, 1, 1]
    ],
    scoreGoal: 7200,
    movesLimit: 18,
    allowedLetters: ['A', 'B', 'C', 'D', 'E'],
    initialSpecialProbability: 0.16,
    specialGoals: {
      totalEliminations: 38,
      maxCombo: 3
    }
  },
  {
    id: 11,
    name: "Frost Ring",
    chineseName: "冰环试炼",
    description: "Full outer frozen border! Create blasts at the center to shatter ice ring.",
    chineseDescription: "外侧一整圈全部被坚韧极其厚重的冰块牢牢锁死！从棋盘核心制造炸药一举粉碎冰环阻挡！",
    layout: [
      [2, 2, 2, 2, 2],
      [2, 1, 1, 1, 2],
      [2, 1, 0, 1, 2],
      [2, 1, 1, 1, 2],
      [2, 2, 2, 2, 2]
    ],
    scoreGoal: 8000,
    movesLimit: 24,
    allowedLetters: ['A', 'B', 'C', 'D', 'E', 'F'],
    initialSpecialProbability: 0.18,
    specialGoals: {
      iceCount: 14,
      totalEliminations: 50,
      maxCombo: 3
    }
  },
  {
    id: 12,
    name: "Stairway to Heaven",
    chineseName: "步步高升",
    description: "Redesigned ascending diagonal stairway pattern with stable pillars! Maximizes matches without visual stalemates.",
    chineseDescription: "经典的斜角对角线阶梯城堡，加入了底部冰霜。收集指定的水果图案并激活大型引信！",
    layout: [
      [0, 0, 1, 1, 1],
      [0, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 2, 2, 1]
    ],
    scoreGoal: 5000,
    movesLimit: 18,
    allowedLetters: ['A', 'B', 'C', 'D', 'E'],
    initialSpecialProbability: 0.15,
    specialGoals: {
      letter: { 'C': 10, 'D': 10 },
      totalEliminations: 45,
      maxCombo: 3
    }
  },
  {
    id: 13,
    name: "Transient Fusion",
    chineseName: "瞬态熔聚",
    description: "Ice barriers protect a nuclear empty core. Combine starting specials to blast open the reactive chamber!",
    chineseDescription: "高能核能能量环。中心带有留空和核晶冰保护，利用双重重力交换产生超新星裂变！",
    layout: [
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 2, 0, 2, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1]
    ],
    scoreGoal: 9500,
    movesLimit: 20,
    allowedLetters: ['A', 'B', 'C', 'D', 'E'],
    initialSpecialProbability: 0.22,
    specialGoals: {
      iceCount: 2,
      totalEliminations: 45,
      maxCombo: 3
    }
  },
  {
    id: 14,
    name: "Combo Heaven",
    chineseName: "连消天堂",
    description: "Highly reactive massive playground with only 4 letters allowed! Triggers magnificent endless cascade chain reactions!",
    chineseDescription: "消除达人的解压乐园！5x5中等规格只包含4种基础类型图案，几乎每次交换都会触发超能连消！",
    layout: [
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1]
    ],
    scoreGoal: 10000,
    movesLimit: 20,
    allowedLetters: ['A', 'B', 'C', 'D'],
    initialSpecialProbability: 0.25,
    specialGoals: {
      totalEliminations: 60,
      maxCombo: 4
    }
  },
  {
    id: 15,
    name: "Ice Castle Siege",
    chineseName: "攻占寒星堡",
    description: "Top and bottom frozen ramparts defend the treasure. Break adjacent combinations to siege the fortress!",
    chineseDescription: "坚不可摧的碎石堡垒，带有上下交替的冰晶防线。在开阔地蓄力爆破击溃一切！",
    layout: [
      [2, 0, 2, 0, 2],
      [2, 1, 1, 1, 2],
      [1, 1, 1, 1, 1],
      [1, 2, 1, 2, 1],
      [2, 2, 2, 2, 2]
    ],
    scoreGoal: 11000,
    movesLimit: 22,
    allowedLetters: ['A', 'B', 'C', 'D', 'E', 'F'],
    initialSpecialProbability: 0.20,
    specialGoals: {
      iceCount: 6,
      totalEliminations: 50,
      maxCombo: 3
    }
  },
  {
    id: 16,
    name: "X-Reactor Cross",
    chineseName: "极耀十字爆",
    description: "A gorgeous X-shaped frozen blockade dividing the board! Shattering the diagonal shield causes massive cross-collapses!",
    chineseDescription: "庞大的X对角光环冰墙，把棋盘整体切碎为四份！粉碎冰晶以激活连通的对角落差！",
    layout: [
      [2, 1, 1, 1, 2],
      [1, 2, 1, 2, 1],
      [1, 1, 2, 1, 1],
      [1, 2, 1, 2, 1],
      [2, 1, 1, 1, 2]
    ],
    scoreGoal: 12000,
    movesLimit: 24,
    allowedLetters: ['A', 'B', 'C', 'D', 'E', 'F'],
    initialSpecialProbability: 0.20,
    specialGoals: {
      iceCount: 6,
      totalEliminations: 55,
      maxCombo: 3
    }
  },
  {
    id: 17,
    name: "Cosmic Channels",
    chineseName: "星海跃迁道",
    description: "Symmetrical pocket corridors linked by narrow gravity gates. Chain sideways blasters to swap matter instantly!",
    chineseDescription: "由两端跃迁而来的平行通道。必须充分制造横向极光爆破或者炸弹去清理死角！",
    layout: [
      [1, 1, 1, 1, 1],
      [1, 2, 1, 2, 1],
      [1, 0, 1, 0, 1],
      [1, 2, 1, 2, 1],
      [1, 1, 1, 1, 1]
    ],
    scoreGoal: 13000,
    movesLimit: 22,
    allowedLetters: ['A', 'B', 'C', 'D', 'E'],
    initialSpecialProbability: 0.24,
    specialGoals: {
      letter: { 'C': 10, 'D': 10 },
      totalEliminations: 55,
      maxCombo: 3
    }
  },
  {
    id: 18,
    name: "Gold Sieve Trident",
    chineseName: "淘冰黄金戟",
    description: "Three thin vertical channels cascade into a wide base pool. Liquid layouts deliver superb dropping cascade feelings!",
    chineseDescription: "黄金三叉戟布局。三道极深的垂直落差使碎料能产生极高能的连续重力撞击！",
    layout: [
      [1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1],
      [1, 1, 1, 1, 1],
      [1, 2, 2, 2, 1],
      [1, 1, 1, 1, 1]
    ],
    scoreGoal: 14000,
    movesLimit: 22,
    allowedLetters: ['A', 'B', 'C', 'D', 'E', 'F'],
    initialSpecialProbability: 0.18,
    specialGoals: {
      iceCount: 3,
      totalEliminations: 55,
      maxCombo: 3
    }
  },
  {
    id: 19,
    name: "Infinity Loop Orbit",
    chineseName: "时空无限环",
    description: "Symmetric nested infinity layout tracking infinite flow. High strategic swapping maximizes incredible specials combinations!",
    chineseDescription: "扭曲的莫比乌斯星轨。奇妙的多维重疊空位，考验您在复杂几何环路中的合击逻辑！",
    layout: [
      [0, 1, 1, 1, 0],
      [1, 1, 2, 1, 1],
      [1, 2, 0, 2, 1],
      [1, 1, 2, 1, 1],
      [0, 1, 1, 1, 0]
    ],
    scoreGoal: 15000,
    movesLimit: 22,
    allowedLetters: ['A', 'B', 'C', 'D', 'E', 'F'],
    initialSpecialProbability: 0.22,
    specialGoals: {
      iceCount: 4,
      totalEliminations: 55,
      maxCombo: 3
    }
  },
  {
    id: 20,
    name: "Millennium Spark",
    chineseName: "终极圣殿",
    description: "The grand master level. Huge full grid with challenging goals and dual combination possibilities!",
    chineseDescription: "千汇万状的终极盛典！中大规模的异形冰晶九重殿，尽情释放您的魔法黑洞绝技去通关吧！",
    layout: [
      [1, 1, 1, 1, 1, 1],
      [1, 2, 1, 1, 2, 1],
      [1, 1, 1, 1, 1, 1],
      [1, 1, 2, 2, 1, 1],
      [1, 2, 1, 1, 2, 1],
      [1, 1, 1, 1, 1, 1]
    ],
    scoreGoal: 20000,
    movesLimit: 26,
    allowedLetters: ['A', 'B', 'C', 'D', 'E', 'F'],
    initialSpecialProbability: 0.22,
    specialGoals: {
      iceCount: 6,
      totalEliminations: 70,
      maxCombo: 4
    }
  },
  {
    id: 21,
    name: "Gummy Bear Gardens",
    chineseName: "软糖小镇",
    description: "Fruity rows of candy blockages. Clear the icy garden to release sweet gummy specials!",
    chineseDescription: "充满甜蜜气息的水果软糖小径。打破坚硬的霜层，让可爱的水果爆破美味蔓延！",
    layout: [
      [0, 1, 1, 1, 1, 0],
      [1, 2, 1, 1, 2, 1],
      [1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1],
      [1, 2, 1, 1, 2, 1],
      [0, 1, 1, 1, 1, 0]
    ],
    scoreGoal: 22000,
    movesLimit: 25,
    allowedLetters: ['A', 'B', 'C', 'D', 'E'],
    initialSpecialProbability: 0.22,
    specialGoals: {
      iceCount: 4,
      totalEliminations: 75,
      maxCombo: 3
    }
  },
  {
    id: 22,
    name: "Choco Mountain Peak",
    chineseName: "巧克力之巅",
    description: "High altitude chocolaty fun. Double-column frostings protect the precious high-sugar matches.",
    chineseDescription: "高空大冒险！险峻的双翼冰霜夹道，需要在有限空间中寻找合成特殊棋子的绝妙时机！",
    layout: [
      [1, 2, 1, 2, 1],
      [1, 1, 1, 1, 1],
      [1, 2, 1, 2, 1],
      [1, 1, 1, 1, 1],
      [1, 2, 1, 2, 1],
      [1, 1, 1, 1, 1]
    ],
    scoreGoal: 24000,
    movesLimit: 24,
    allowedLetters: ['A', 'B', 'C', 'D', 'E', 'F'],
    initialSpecialProbability: 0.25,
    specialGoals: {
      iceCount: 6,
      totalEliminations: 80,
      letter: { 'A': 15, 'B': 15 }
    }
  },
  {
    id: 23,
    name: "Licorice Maze",
    chineseName: "甘草甜迷宫",
    description: "Winding corridors filled with slippery paths and icy traps.",
    chineseDescription: "蜿蜒的甜香迷宫。四角与圆心的坚冰极具阻碍性，唯有激发神奇连击方能突围！",
    layout: [
      [2, 1, 0, 1, 2],
      [1, 1, 1, 1, 1],
      [0, 1, 2, 1, 0],
      [1, 1, 1, 1, 1],
      [2, 1, 0, 1, 2]
    ],
    scoreGoal: 18000,
    movesLimit: 20,
    allowedLetters: ['B', 'C', 'D', 'E'],
    initialSpecialProbability: 0.2,
    specialGoals: {
      iceCount: 5,
      totalEliminations: 65,
      maxCombo: 4
    }
  },
  {
    id: 24,
    name: "Cotton Candy Clouds",
    chineseName: "棉花糖浮云",
    description: "Light fluffy challenge. Keep matching continuously to score high in the skies!",
    chineseDescription: "松软微甜的粉红浮云。大面积开放式棋盘，为您合成豪华黑洞提供得天独厚的消除舞台！",
    layout: [
      [1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1]
    ],
    scoreGoal: 30000,
    movesLimit: 28,
    allowedLetters: ['A', 'B', 'C', 'D', 'E', 'F'],
    initialSpecialProbability: 0.3,
    specialGoals: {
      totalEliminations: 95,
      maxCombo: 5
    }
  },
  {
    id: 25,
    name: "Marshmallow Bridges",
    chineseName: "棉花糖双桥",
    description: "Bridges of candies separated by water channels. Swap smartly across the divides.",
    chineseDescription: "由香甜棉花糖连接的双子桥梁，中间是甜浆溪流，考验您跨越阻隔的非凡手艺！",
    layout: [
      [1, 1, 0, 1, 1],
      [1, 2, 0, 2, 1],
      [1, 1, 0, 1, 1],
      [1, 2, 0, 2, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1]
    ],
    scoreGoal: 23000,
    movesLimit: 23,
    allowedLetters: ['A', 'C', 'D', 'E'],
    initialSpecialProbability: 0.18,
    specialGoals: {
      iceCount: 4,
      totalEliminations: 70,
      letter: { 'C': 18 }
    }
  },
  {
    id: 26,
    name: "Ice Cream Citadel",
    chineseName: "冰淇淋城堡",
    description: "An ice-locked fortress of sweetness. Melt down the core to capture the high stars.",
    chineseDescription: "坚不可摧的冰淇淋城堡！中心十字密布坚硬的冰层，您需要以包围之势粉碎所有障碍！",
    layout: [
      [1, 1, 2, 1, 1],
      [1, 1, 2, 1, 1],
      [2, 2, 2, 2, 2],
      [1, 1, 2, 1, 1],
      [1, 1, 2, 1, 1]
    ],
    scoreGoal: 25000,
    movesLimit: 22,
    allowedLetters: ['A', 'B', 'C', 'D', 'E'],
    initialSpecialProbability: 0.25,
    specialGoals: {
      iceCount: 9,
      totalEliminations: 80,
      letter: { 'D': 15, 'E': 15 }
    }
  },
  {
    id: 27,
    name: "Soda Bubble Volcano",
    chineseName: "苏打气泡火山",
    description: "Volcanic chambers storing energetic carbonated candies. High drop speeds!",
    chineseDescription: "咕嘟咕嘟冒泡的汽水火山。异形收窄的瓶口结构极易引发层层相叠的梦幻大连锁！",
    layout: [
      [0, 1, 1, 1, 0],
      [0, 1, 2, 1, 0],
      [1, 1, 2, 1, 1],
      [1, 2, 1, 2, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1]
    ],
    scoreGoal: 27000,
    movesLimit: 25,
    allowedLetters: ['A', 'B', 'C', 'D', 'E', 'F'],
    initialSpecialProbability: 0.28,
    specialGoals: {
      iceCount: 4,
      totalEliminations: 85,
      maxCombo: 4
    }
  },
  {
    id: 28,
    name: "Lollipop Carousel",
    chineseName: "棒棒糖旋转木马",
    description: "A revolving circle of icy tiles. Match on the perimeter or break the cozy core.",
    chineseDescription: "欢快转动的棒棒糖木马！周围点缀着一圈透亮的星级冰壁，伴随着悦耳音乐爆破全场吧！",
    layout: [
      [2, 1, 1, 1, 2],
      [1, 0, 1, 0, 1],
      [1, 1, 2, 1, 1],
      [1, 0, 1, 0, 1],
      [2, 1, 1, 1, 2]
    ],
    scoreGoal: 26050,
    movesLimit: 22,
    allowedLetters: ['A', 'B', 'C', 'D', 'E'],
    initialSpecialProbability: 0.2,
    specialGoals: {
      iceCount: 5,
      totalEliminations: 75,
      letter: { 'A': 20 }
    }
  },
  {
    id: 29,
    name: "Caramel Galaxy",
    chineseName: "焦糖星云",
    description: "A majestic cluster of rich coordinates resembling swirling starlight.",
    chineseDescription: "深邃繁星汇聚的焦糖旋涡。巧妙阻挡的无重力悬空孔道，在浩瀚糖流里畅快爆破！",
    layout: [
      [1, 1, 1, 1, 1, 1],
      [1, 0, 2, 2, 0, 1],
      [1, 2, 1, 1, 2, 1],
      [1, 2, 1, 1, 2, 1],
      [1, 0, 2, 2, 0, 1],
      [1, 1, 1, 1, 1, 1]
    ],
    scoreGoal: 32000,
    movesLimit: 27,
    allowedLetters: ['A', 'B', 'C', 'D', 'E', 'F'],
    initialSpecialProbability: 0.3,
    specialGoals: {
      iceCount: 8,
      totalEliminations: 100,
      maxCombo: 4
    }
  },
  {
    id: 30,
    name: "Sweetness Grand Finale",
    chineseName: "糖果圣杯终章",
    description: "The ultimate 7x7 map with supreme combination mechanics and extreme goals.",
    chineseDescription: "七彩斑斓的终极甜蜜交响乐！宏伟的7x7圣杯法阵中，冰霜满布，请释放您最顶尖的消除智慧！",
    layout: [
      [1, 1, 2, 1, 2, 1, 1],
      [1, 2, 1, 1, 1, 2, 1],
      [2, 1, 1, 2, 1, 1, 2],
      [1, 1, 2, 0, 2, 1, 1],
      [2, 1, 1, 2, 1, 1, 2],
      [1, 2, 1, 1, 1, 2, 1],
      [1, 1, 2, 1, 2, 1, 1]
    ],
    scoreGoal: 45000,
    movesLimit: 32,
    allowedLetters: ['A', 'B', 'C', 'D', 'E', 'F'],
    initialSpecialProbability: 0.33,
    specialGoals: {
      iceCount: 16,
      totalEliminations: 120,
      maxCombo: 5,
      letter: { 'A': 25, 'B': 25 }
    }
  }
];
