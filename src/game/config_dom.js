import { getRandom } from '@/util'
// 元素类型字典
export const typeDict = {
  pumpkin0g: {
    type: 'pumpkin',
    en: 'pumpkin0g',
    cn: '0g南瓜',
    weight: 0
  },
  pumpkin1g: {
    type: 'pumpkin',
    en: 'pumpkin1g',
    cn: '1g南瓜',
    weight: 1
  },
  pumpkin3g: {
    type: 'pumpkin',
    en: 'pumpkin3g',
    cn: '3g南瓜',
    weight: 3
  },
  pumpkin5g: {
    type: 'pumpkin',
    en: 'pumpkin5g',
    cn: '5g南瓜',
    weight: 5
  },
  pumpkin10g: {
    type: 'pumpkin',
    en: 'pumpkin10g',
    cn: '10g南瓜',
    weight: 10
  },
  witch: {
    type: 'troublemaker',
    en: 'witch',
    cn: '女巫'
  },
  bat: {
    type: 'troublemaker',
    en: 'bat',
    cn: '蝙蝠'
  },
  ghost: {
    type: 'troublemaker',
    en: 'ghost',
    cn: '幽灵'
  }
}
export const config = {
  speed: 5,
  difficulty: 0,
  duration: 60000,
  gapTime: 800,
  pumpkin: 'pumpkin',
  pumpkins: [typeDict['pumpkin0g'], typeDict['pumpkin1g'], typeDict['pumpkin3g'], typeDict['pumpkin5g'], typeDict['pumpkin10g']],
  troublemaker: 'troublemaker',
  troublemakers: [typeDict['witch'], typeDict['bat'], typeDict['ghost']],
  top: 0, // 100
  bottom: 150,
  progressBarL: 200
}
// 产生捣蛋鬼时间与数量
export function troublemaker (difficulty) {
  let diff = difficulty || config.difficulty
  const interval = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60]
  let intervals = []
  interval.reduce((prev, next) => {
    intervals = [...intervals, {
      time: getRandom(prev, next) * 1000,
      num: 3 + diff
    }]
    return next
  })
  return intervals
}

/**
 * 南瓜重量分布规则
 * 0 => 1g
 * 1 => 3g
 * 2 => 5g
 * 3 => 10g
 */
export const weightRules = [
  [50, 10, 20, 2],
  [55, 15, 12, 4],
  [60, 10, 18, 2],
  [70, 10, 14, 3],
  [60, 15, 17, 1],
  [70, 20, 10, 2],
  [75, 15, 10, 3],
  [60, 10, 12, 5],
  [50, 15, 1, 10],
  [55, 20, 17, 0],
  [40, 20, 16, 2],
  [100, 10, 10, 2],
  [90, 10, 6, 5],
  [75, 15, 6, 5],
  [85, 15, 6, 4],
  [74, 12, 10, 4],
  [85, 20, 5, 3],
  [65, 20, 5, 3],
  [65, 30, 7, 1],
  [50, 15, 15, 3]
]
