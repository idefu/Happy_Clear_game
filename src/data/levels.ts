/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LevelConfig } from '../types';

export const LEVELS: LevelConfig[] = [
  // ==========================================
  // TUTORIAL / EASY INTRO LEVELS (1-5) - Theme: river
  // ==========================================
  {
    id: 1,
    name: "Happy Beginnings",
    chineseName: "快乐初体验",
    description: "Welcome! Swap adjacent letters to match 3 of the same letters in a line. Simple and sweet!",
    chineseDescription: "新手热身关卡。通过左右、上下翻转滑动交换相邻字母，拼出3个或3个以上连击。简单而有趣！",
    layout: [
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1]
    ],
    scoreGoal: 1200,
    movesLimit: 15,
    allowedLetters: ['A', 'B', 'C', 'D'],
    initialSpecialProbability: 0.15,
    theme: 'river',
    specialGoals: {
      totalEliminations: 25,
      letter: { A: 8, B: 8 }
    }
  },
  {
    id: 2,
    name: "Frosty Streams",
    chineseName: "冰霜溪流",
    description: "Ice barriers block the lower board. Match letters adjacent or on frozen cells to shatter the ice!",
    chineseDescription: "寒霜开始覆盖底部的格位。在冰霜格子旁边进行消除，即可消除可爱的冰层！",
    layout: [
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 2, 2, 2, 1],
      [1, 2, 2, 2, 1]
    ],
    scoreGoal: 2000,
    movesLimit: 16,
    allowedLetters: ['A', 'B', 'C', 'D'],
    initialSpecialProbability: 0.16,
    theme: 'river',
    specialGoals: {
      iceCount: 6
    }
  },
  {
    id: 3,
    name: "Vined Rapids",
    chineseName: "藤蔓湍急",
    description: "Ivy vines trap some tiles! Vines prevent them from swapping, but you can match with them to dissolve the vines!",
    chineseDescription: "神秘藤蔓缠绕住了中央。这些字母无法滑动，但您可以直接参与对齐匹配来松绑！",
    layout: [
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 4, 1, 4, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1]
    ],
    scoreGoal: 2400,
    movesLimit: 16,
    allowedLetters: ['A', 'B', 'C', 'D'],
    initialSpecialProbability: 0.16,
    theme: 'river',
    specialGoals: {
      vinedCount: 2
    }
  },
  {
    id: 4,
    name: "Twin Gates",
    chineseName: "双子传送门",
    description: "Weird spatial portals have appeared! Swapping portals teleports letters seamlessly. Trigger a combo!",
    chineseDescription: "空间传送门悄悄浮现！处于底部的字母会从顶部落下，借此触发奇妙的多重连击吧！",
    layout: [
      [1, 1, 0, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 0, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 0, 1, 1]
    ],
    scoreGoal: 2800,
    movesLimit: 15,
    allowedLetters: ['A', 'B', 'C', 'D'],
    initialSpecialProbability: 0.18,
    theme: 'river',
    portals: [
      { r1: 1, c1: 0, r2: 3, c2: 4 }
    ],
    specialGoals: {
      maxCombo: 2
    }
  },
  {
    id: 5,
    name: "Secret Crags",
    chineseName: "玄石峭壁",
    description: "Durable stone blocks hide unknown letters beneath! Eliminate adjacent standard items to crack and reveal them.",
    chineseDescription: "远古坚石挡住了角落！在玄石周围进行匹配消除，即可凿碎玄石，重新解封地块！",
    layout: [
      [5, 1, 1, 1, 5],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [5, 1, 1, 1, 5]
    ],
    scoreGoal: 3200,
    movesLimit: 15,
    allowedLetters: ['A', 'B', 'C', 'D'],
    initialSpecialProbability: 0.18,
    theme: 'river',
    specialGoals: {
      stoneCount: 4
    }
  },

  // ==========================================
  // MID-STAGES (6-13) - Theme: grassland / sky
  // ==========================================
  {
    id: 6,
    name: "Hourglass Channels",
    chineseName: "流动沙漏",
    description: "Narrow hourglass columns. Synthesize laser blasters vertically to clear blocks in style!",
    chineseDescription: "中间收窄的经典沙漏布局。在狭小的一格沙漏洞口中制造纵向激光，可以让连锁爆炸流畅穿透！",
    layout: [
      [1, 1, 1, 1, 1],
      [1, 1, 0, 1, 1],
      [0, 1, 1, 1, 0],
      [0, 1, 1, 1, 0],
      [1, 1, 0, 1, 1],
      [1, 1, 1, 1, 1]
    ],
    scoreGoal: 4500,
    movesLimit: 16,
    allowedLetters: ['A', 'B', 'C', 'D'],
    initialSpecialProbability: 0.20,
    theme: 'river',
    specialGoals: {
      totalEliminations: 55,
      maxCombo: 2
    }
  },
  {
    id: 7,
    name: "Frozen Meadow",
    chineseName: "草野坚冰",
    description: "Double Ice layers present! These thick slabs require two matches - on or adjacent - to fully clear.",
    chineseDescription: "高难度的【双层冰块】全新登场！它们散发着深色寒芒，需要进行两次消除才能完全融化！",
    layout: [
      [1, 1, 1, 1, 1],
      [1, 3, 3, 3, 1],
      [1, 3, 1, 3, 1],
      [1, 3, 3, 3, 1],
      [1, 1, 1, 1, 1]
    ],
    scoreGoal: 5000,
    movesLimit: 18,
    allowedLetters: ['A', 'B', 'C', 'D', 'E'],
    initialSpecialProbability: 0.20,
    theme: 'grassland',
    specialGoals: {
      iceCount: 8,
      totalEliminations: 65
    }
  },
  {
    id: 8,
    name: "Bento Joy",
    chineseName: "缤纷野餐",
    description: "A mixed tactical setup containing vines, stones and single frozen blocks. Stay alert!",
    chineseDescription: "草地上丰盛的野餐盘，布满了落单的藤蔓、神秘的玄石和晶亮坚冰。需要精心观察每一步！",
    layout: [
      [4, 1, 1, 1, 1],
      [1, 5, 2, 5, 1],
      [1, 2, 1, 2, 1],
      [1, 5, 2, 5, 1],
      [1, 1, 1, 1, 4],
      [1, 1, 1, 1, 1]
    ],
    scoreGoal: 6000,
    movesLimit: 18,
    allowedLetters: ['A', 'B', 'C', 'D', 'E'],
    initialSpecialProbability: 0.22,
    theme: 'grassland',
    specialGoals: {
      iceCount: 4,
      vinedCount: 2,
      stoneCount: 4
    }
  },
  {
    id: 9,
    name: "Crossroads Forest",
    chineseName: "林中十字路",
    description: "Symmetrical cross shape restricting options. Break the corner stones for space!",
    chineseDescription: "神圣的林地十字街头。边缘有零星玄石护路。优先轰开玄石可以为您争取到最开阔的连锁战地！",
    layout: [
      [0, 1, 1, 1, 1, 0],
      [1, 5, 1, 1, 5, 1],
      [1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1],
      [1, 5, 1, 1, 5, 1],
      [0, 1, 1, 1, 1, 0]
    ],
    scoreGoal: 7500,
    movesLimit: 18,
    allowedLetters: ['A', 'B', 'C', 'D', 'E'],
    initialSpecialProbability: 0.20,
    theme: 'grassland',
    specialGoals: {
      stoneCount: 4,
      totalEliminations: 60
    }
  },
  {
    id: 10,
    name: "Ivy Spiral",
    chineseName: "藤叶迷宫",
    description: "Vines spiral down, limiting vertical falls. Match adjacent to break their clutches!",
    chineseDescription: "缠绕的常春藤在林中织成了一道螺旋。被困在其中的棋子动弹不得，巧用同色匹配解封它们！",
    layout: [
      [1, 1, 1, 1, 1, 1],
      [1, 4, 4, 4, 4, 1],
      [1, 1, 1, 1, 1, 1],
      [1, 1, 4, 4, 1, 1],
      [1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1]
    ],
    scoreGoal: 8200,
    movesLimit: 19,
    allowedLetters: ['A', 'B', 'C', 'D', 'E'],
    initialSpecialProbability: 0.22,
    theme: 'grassland',
    specialGoals: {
      vinedCount: 6,
      totalEliminations: 70
    }
  },
  {
    id: 11,
    name: "Portal Garden",
    chineseName: "幽谷传送站",
    description: "Two distinct sets of spatial loops connected with gravity triggers. Watch where cells drop!",
    chineseDescription: "林间空地上架设起两对超速传送环。棋子横跨半个棋盘进行大跳跃，触发一连串酣畅淋漓的消解！",
    layout: [
      [1, 1, 1, 1, 1, 1],
      [1, 3, 1, 1, 3, 1],
      [1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1],
      [1, 3, 1, 1, 3, 1],
      [1, 1, 1, 1, 1, 1]
    ],
    scoreGoal: 10000,
    movesLimit: 20,
    allowedLetters: ['A', 'B', 'C', 'D', 'E'],
    initialSpecialProbability: 0.24,
    theme: 'grassland',
    portals: [
      { r1: 1, c1: 0, r2: 4, c2: 5 },
      { r1: 1, c1: 5, r2: 4, c2: 0 }
    ],
    specialGoals: {
      iceCount: 4,
      maxCombo: 3,
      totalEliminations: 75
    }
  },
  {
    id: 12,
    name: "Fortress Ruins",
    chineseName: "古迹碎石",
    description: "A large formation of stones blocks the central ring. Explode items near them to clear the path.",
    chineseDescription: "破落的森林废墟中堆砌着大片未解的玄石堆！在周围大显身手消除它，露出底下的宝藏！",
    layout: [
      [1, 1, 1, 1, 1, 1],
      [1, 5, 5, 5, 5, 1],
      [1, 5, 1, 1, 5, 1],
      [1, 5, 1, 1, 5, 1],
      [1, 5, 5, 5, 5, 1],
      [1, 1, 1, 1, 1, 1]
    ],
    scoreGoal: 11500,
    movesLimit: 18,
    allowedLetters: ['A', 'B', 'C', 'D', 'E'],
    initialSpecialProbability: 0.22,
    theme: 'grassland',
    specialGoals: {
      stoneCount: 12
    }
  },
  {
    id: 13,
    name: "Meadow Bridges",
    chineseName: "青草双桥",
    description: "Double narrow vertical bridge columns. Create sideways blasters to reach out of isolated spaces!",
    chineseDescription: "翠色原野上的双子天桥。狭窄的两列竖桥与主盆地孤立开来，用横向等离子激光穿透它！",
    layout: [
      [1, 1, 0, 0, 1, 1],
      [1, 1, 0, 0, 1, 1],
      [1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1],
      [1, 2, 2, 2, 2, 1],
      [1, 1, 1, 1, 1, 1]
    ],
    scoreGoal: 13000,
    movesLimit: 20,
    allowedLetters: ['A', 'B', 'C', 'D', 'E', 'F'],
    initialSpecialProbability: 0.22,
    theme: 'grassland',
    specialGoals: {
      iceCount: 4,
      totalEliminations: 80
    }
  },

  // ==========================================
  // SKY WORLD LEVELS (14-19) - Theme: sky
  // ==========================================
  {
    id: 14,
    name: "Cumulus Castle",
    chineseName: "积云冰堡",
    description: "A circular layout wrapped in double ice columns floating high in the sky.",
    chineseDescription: "外围布满厚重的双层冰层，只有制造超大规模炸弹才能彻底炸穿！",
    layout: [
      [3, 3, 3, 3, 3, 3],
      [3, 1, 1, 1, 1, 3],
      [3, 1, 1, 1, 1, 3],
      [3, 1, 1, 1, 1, 3],
      [3, 1, 1, 1, 1, 3],
      [3, 3, 3, 3, 3, 3]
    ],
    scoreGoal: 15000,
    movesLimit: 20,
    allowedLetters: ['A', 'B', 'C', 'D', 'E', 'F'],
    initialSpecialProbability: 0.24,
    theme: 'sky',
    specialGoals: {
      iceCount: 20
    }
  },
  {
    id: 15,
    name: "Sky Diamonds",
    chineseName: "天空之钻",
    description: "Elegant diamond shaped level board. Blocked corners increase difficulty. Focus on building blasters!",
    chineseDescription: "悬浮在无垠高空的菱形巨钻。被削去四个死角的设计让掉落更加湍急，试着合出多个特殊爆发吧！",
    layout: [
      [0, 0, 1, 1, 0, 0],
      [0, 1, 1, 1, 1, 0],
      [1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1],
      [0, 1, 1, 1, 1, 0],
      [0, 0, 1, 1, 0, 0]
    ],
    scoreGoal: 17500,
    movesLimit: 17,
    allowedLetters: ['A', 'B', 'C', 'D', 'E'],
    initialSpecialProbability: 0.25,
    theme: 'sky',
    specialGoals: {
      totalEliminations: 90
    }
  },
  {
    id: 16,
    name: "Windy Slopes",
    chineseName: "风口藤林",
    description: "Top rows are clear, but the bottom rows are blocked by dense ivy vines. Untangle the mess!",
    chineseDescription: "大风口的密林一角。狂风刮落的棋子在底部被层层藤蔓纠缠。自上而下发动轰炸洗刷它们！",
    layout: [
      [1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1],
      [4, 4, 1, 1, 4, 4],
      [1, 4, 4, 4, 4, 1],
      [4, 1, 4, 4, 1, 4]
    ],
    scoreGoal: 19000,
    movesLimit: 19,
    allowedLetters: ['A', 'B', 'C', 'D', 'E'],
    initialSpecialProbability: 0.26,
    theme: 'sky',
    specialGoals: {
      vinedCount: 12
    }
  },
  {
    id: 17,
    name: "Mist Portal Loop",
    chineseName: "迷雾星门",
    description: "Portals interconnect across opposite columns! Swapping launches automatic long cascades.",
    chineseDescription: "高空云雾缭绕中的量子对称传送圈！棋子可以跨越异次元，从左至右瞬移传送！",
    layout: [
      [1, 1, 1, 1, 1, 1],
      [1, 2, 1, 1, 2, 1],
      [1, 0, 1, 1, 0, 1],
      [1, 0, 1, 1, 0, 1],
      [1, 2, 1, 1, 2, 1],
      [1, 1, 1, 1, 1, 1]
    ],
    scoreGoal: 18000,
    movesLimit: 20,
    allowedLetters: ['A', 'B', 'C', 'D', 'E', 'F'],
    initialSpecialProbability: 0.26,
    theme: 'sky',
    portals: [
      { r1: 1, c1: 1, r2: 4, c2: 4 },
      { r1: 1, c1: 4, r2: 4, c2: 1 }
    ],
    specialGoals: {
      totalEliminations: 100
    }
  },
  {
    id: 18,
    name: "Ancient Stone Ring",
    chineseName: "云端环石",
    description: "Mysterious standing stones shield the center board. Demolish them to release high gravity falling cascades!",
    chineseDescription: "云海中遗落的凯尔特环状玄石柱！用周围的三消逐个粉碎它们以开启惊人掉落！",
    layout: [
      [1, 1, 1, 1, 1, 1],
      [1, 1, 5, 5, 1, 1],
      [1, 5, 1, 1, 5, 1],
      [1, 5, 1, 1, 5, 1],
      [1, 1, 5, 5, 1, 1],
      [1, 1, 1, 1, 1, 1]
    ],
    scoreGoal: 23000,
    movesLimit: 18,
    allowedLetters: ['A', 'B', 'C', 'D', 'E'],
    initialSpecialProbability: 0.25,
    theme: 'sky',
    specialGoals: {
      stoneCount: 8
    }
  },
  {
    id: 19,
    name: "Nimbus Storm",
    chineseName: "云霓雷暴",
    description: "High probability of special items, but dual layers of double ice protect the scoring zone.",
    chineseDescription: "虽然拥有极高的升级特效触发几率，但也需要融化两层厚如重铠的双重寒冰！",
    layout: [
      [1, 1, 1, 1, 1, 1],
      [1, 3, 3, 3, 3, 1],
      [1, 3, 1, 1, 3, 1],
      [1, 3, 1, 1, 3, 1],
      [1, 3, 3, 3, 3, 1],
      [1, 1, 1, 1, 1, 1]
    ],
    scoreGoal: 26000,
    movesLimit: 19,
    allowedLetters: ['A', 'B', 'C', 'D', 'E', 'F'],
    initialSpecialProbability: 0.28,
    theme: 'sky',
    specialGoals: {
      iceCount: 12
    }
  },

  // ==========================================
  // STARRY END-STAGES (20-25) - Theme: starry
  // ==========================================
  {
    id: 20,
    name: "Stellar Constellation",
    chineseName: "绚丽星座",
    description: "A wide 7x6 map. Free of major blocks but with isolated corners. Perfect for cascading explosions!",
    chineseDescription: "边缘点缀着微冰阻挡。最适合施展高超的级连技巧，引爆大片星座光芒！",
    layout: [
      [0, 1, 1, 1, 1, 0],
      [1, 1, 2, 2, 1, 1],
      [1, 2, 1, 1, 2, 1],
      [1, 2, 1, 1, 2, 1],
      [1, 1, 2, 2, 1, 1],
      [0, 1, 1, 1, 1, 0],
      [1, 1, 1, 1, 1, 1]
    ],
    scoreGoal: 30000,
    movesLimit: 21,
    allowedLetters: ['A', 'B', 'C', 'D', 'E', 'F'],
    initialSpecialProbability: 0.25,
    theme: 'starry',
    specialGoals: {
      iceCount: 8
    }
  },
  {
    id: 21,
    name: "Nebula Vault",
    chineseName: "星云宝库",
    description: "Symmetrical double-ice columns shield high values. Generate BOMB items to wipe them out!",
    chineseDescription: "对称【双层坚冰柱】守在星云两端！用消除合成的超级炸弹可以一次震碎整片寒冰！",
    layout: [
      [1, 1, 1, 1, 1, 1],
      [1, 3, 3, 3, 3, 1],
      [1, 1, 1, 1, 1, 1],
      [1, 1, 3, 3, 1, 1],
      [1, 1, 1, 1, 1, 1],
      [1, 3, 3, 3, 3, 1],
      [1, 1, 1, 1, 1, 1]
    ],
    scoreGoal: 35000,
    movesLimit: 21,
    allowedLetters: ['A', 'B', 'C', 'D', 'E'],
    initialSpecialProbability: 0.25,
    theme: 'starry',
    specialGoals: {
      iceCount: 10
    }
  },
  {
    id: 22,
    name: "Comet Trails",
    chineseName: "彗星扫尾",
    description: "Vines and stone traps border laser portals. Swap colors through portals to trigger endless stars cascade!",
    chineseDescription: "四角散落着藤蔓和怪石保护传送阵口。跨越星门交换以激落漫天爆爽彗尾光点！",
    layout: [
      [4, 1, 1, 1, 1, 4],
      [1, 5, 1, 1, 5, 1],
      [1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1],
      [1, 5, 1, 1, 5, 1],
      [4, 1, 1, 1, 1, 4],
      [1, 1, 1, 1, 1, 1]
    ],
    scoreGoal: 38000,
    movesLimit: 20,
    allowedLetters: ['A', 'B', 'C', 'D', 'E', 'F'],
    initialSpecialProbability: 0.28,
    theme: 'starry',
    portals: [
      { r1: 1, c1: 0, r2: 5, c2: 5 }
    ],
    specialGoals: {
      vinedCount: 3,
      stoneCount: 4
    }
  },
  {
    id: 23,
    name: "Cosmic Lattice",
    chineseName: "星际晶格",
    description: "Irregular diagonal splits blocking standard drops. Master portals to fill the gaps cleanly!",
    chineseDescription: "星盘斜裂构成的格子空洞严重阻碍了掉落。借由内置传送门把空缺巧妙挪移填满！",
    layout: [
      [1, 1, 0, 0, 1, 1],
      [1, 1, 1, 1, 1, 1],
      [1, 2, 0, 0, 2, 1],
      [1, 1, 1, 1, 1, 1],
      [1, 2, 0, 0, 2, 1],
      [1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1]
    ],
    scoreGoal: 12000,
    movesLimit: 19,
    allowedLetters: ['A', 'B', 'C', 'D', 'E'],
    initialSpecialProbability: 0.26,
    theme: 'starry',
    portals: [
      { r1: 1, c1: 1, r2: 5, c2: 4 },
      { r1: 1, c1: 4, r2: 5, c2: 1 }
    ],
    specialGoals: {
      iceCount: 4,
      maxCombo: 3
    }
  },
  {
    id: 24,
    name: "Galactic Shield",
    chineseName: "银河之盾",
    description: "A defensive fortress made of stones and deep heavy ice. Clear the center to unlock cascading power!",
    chineseDescription: "外侧布满神秘怪石和坚冰，只有爆破核心才能突破防御！",
    layout: [
      [5, 5, 2, 2, 5, 5],
      [5, 1, 1, 1, 1, 5],
      [2, 1, 1, 1, 1, 2],
      [2, 1, 1, 1, 1, 2],
      [2, 1, 1, 1, 1, 2],
      [5, 1, 1, 1, 1, 5],
      [5, 5, 2, 2, 5, 5]
    ],
    scoreGoal: 48000,
    movesLimit: 22,
    allowedLetters: ['A', 'B', 'C', 'D', 'E', 'F'],
    initialSpecialProbability: 0.28,
    theme: 'starry',
    specialGoals: {
      iceCount: 10,
      stoneCount: 8
    }
  },
  {
    id: 25,
    name: "Supernova Chalice",
    chineseName: "圣杯终章",
    description: "The ultimate 7x7 custom array containing double-ice, ivy vines, portals and stones! Unleash magic combos to claim 3 stars!",
    chineseDescription: "最终圣杯对决！冰裂、藤蔓、怪石、空间星门极致编排，在超大棋盘激发出终极满屏大消除吧！",
    layout: [
      [1, 1, 1, 1, 1, 1],
      [1, 4, 3, 3, 4, 1],
      [1, 3, 1, 1, 3, 1],
      [1, 1, 5, 5, 1, 1],
      [1, 3, 1, 1, 3, 1],
      [1, 4, 3, 3, 4, 1],
      [1, 1, 1, 1, 1, 1]
    ],
    scoreGoal: 60000,
    movesLimit: 24,
    allowedLetters: ['A', 'B', 'C', 'D', 'E', 'F'],
    initialSpecialProbability: 0.32,
    theme: 'starry',
    portals: [
      { r1: 0, c1: 0, r2: 6, c2: 5 },
      { r1: 0, c1: 5, r2: 6, c2: 0 }
    ],
    specialGoals: {
      iceCount: 8,
      totalEliminations: 100,
      maxCombo: 4
    }
  }
];
