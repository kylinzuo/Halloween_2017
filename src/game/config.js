// 随机产生一个基于(min, max)之间的数字
export function getRandom (min, max) {
  var r = Math.random() * (max - min)
  var re = Math.round(r + min)
  re = Math.max(Math.min(re, max), min)
  return re
}
// 元素类型字典
export const typeDict = {
  pumpkin0g: {
    type: 'pumpkin',
    en: 'pumpkin0g',
    cn: '0g南瓜',
    score: 'pumpkin0g-score',
    weight: 0
  },
  pumpkin1g: {
    type: 'pumpkin',
    en: 'pumpkin1g',
    cn: '1g南瓜',
    score: 'pumpkin1g-score',
    weight: 1
  },
  pumpkin3g: {
    type: 'pumpkin',
    en: 'pumpkin3g',
    score: 'pumpkin3g-score',
    cn: '3g南瓜',
    weight: 3
  },
  pumpkin5g: {
    type: 'pumpkin',
    en: 'pumpkin5g',
    cn: '5g南瓜',
    score: 'pumpkin5g-score',
    weight: 5
  },
  pumpkin10g: {
    type: 'pumpkin',
    en: 'pumpkin10g',
    cn: '10g南瓜',
    score: 'pumpkin10g-score',
    weight: 10
  },
  witch_tl: {
    direction: 'left',
    type: 'troublemaker',
    en: 'witch_tl',
    cn: '女巫'
  },
  witch_tr: {
    direction: 'right',
    type: 'troublemaker',
    en: 'witch_tr',
    cn: '女巫'
  },
  bat_tl: {
    direction: 'left',
    type: 'troublemaker',
    en: 'bat',
    cn: '蝙蝠'
  },
  bat_tr: {
    direction: 'right',
    type: 'troublemaker',
    en: 'bat',
    cn: '蝙蝠'
  },
  ghost_tl: {
    direction: 'left',
    type: 'troublemaker',
    en: 'ghost_tl',
    cn: '幽灵'
  },
  ghost_tr: {
    direction: 'right',
    type: 'troublemaker',
    en: 'ghost_tr',
    cn: '幽灵'
  },
  ghostl_tl: {
    direction: 'left',
    type: 'troublemaker',
    en: 'ghostl_tl',
    cn: '幽灵'
  },
  ghostl_tr: {
    direction: 'right',
    type: 'troublemaker',
    en: 'ghostl_tr',
    cn: '幽灵'
  }
}
export const config = {
  backgrounds: ['halloween-bg1', 'halloween-bg2'],
  distance: 200,
  speed: [3, 4, 5, 6],
  difficulty: 1,
  duration: 60000,
  gapTime: [1200, 1000, 800, 600],
  pumpkin: 'pumpkin',
  pumpkins: [typeDict['pumpkin0g'], typeDict['pumpkin1g'], typeDict['pumpkin3g'], typeDict['pumpkin5g'], typeDict['pumpkin10g']],
  troublemaker: 'troublemaker',
  troublemakers: [typeDict['witch_tl'], typeDict['witch_tr'], typeDict['bat_tl'], typeDict['bat_tr'], typeDict['ghost_tl'], typeDict['ghost_tr'], typeDict['ghostl_tl'], typeDict['ghostl_tr']],
  top: 0, // 100
  bottom: 130,
  progressBarL: 200,
  dropTimes: [49, 59, 73, 98]
}
// 产生捣蛋鬼时间与数量
export function troublemaker (difficulty, gapTime) {
  let diff = difficulty || config.difficulty
  let gap = gapTime || 3
  let interval = []
  let duration = config.duration / 1000
  for (let i = 2; i <= duration; i++) {
    if ((i % gap) === 0) {
      interval = [...interval, i]
    }
  }
  let intervals = []
  interval.reduce((prev, next) => {
    intervals = [...intervals, {
      time: getRandom(prev + 1, next) * 1000,
      num: 2 + diff
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
  [65, 20, 5, 5],
  [65, 30, 7, 1],
  [50, 15, 15, 3]
]

// 计算蝙蝠旋转角度
export function rotateDeg (troble) {
  let rotate = 0
  if (troble.category.direction === 'left') {
    if (troble.category.en === 'bat') {
      rotate = troble.direction === 'up'
        ? 135
        : 45
    } else {
      rotate = troble.direction === 'up'
        ? 25
        : -10
    }
  } else {
    if (troble.category.en === 'bat') {
      rotate = troble.direction === 'up'
        ? -135
        : -45
    } else {
      rotate = troble.direction === 'up'
        ? -25
        : 10
    }
  }
  return rotate
}

// 预加载图片
export function imagePreloader (images) {
  for (let i = 0; i < images.length; i++) {
    let oImg = new Image()
    oImg.src = images[i]
  }
}
