// 预加载图片
export function ImagePreloader (images, callback) {
   // store the call-back
  this.callback = callback
  // initialize internal state.
  this.nLoaded = 0
  this.nProcessed = 0
  this.aImages = []
  this.imagesDict = {}
  // record the number of images.
  this.nImages = images.length
  // for each image, call preload()
  for (let i = 0; i < images.length; i++) {
    this.preload(images[i])
  }
}

ImagePreloader.prototype.preload = function (image) {
  // create new Image object and add to array
  var oImage = new Image()
  this.aImages.push(oImage)
  this.imagesDict[image.name] = oImage
  // set up event handlers for the Image object
  oImage.onload = ImagePreloader.prototype.onload
  oImage.onerror = ImagePreloader.prototype.onerror
  oImage.onabort = ImagePreloader.prototype.onabort
  // assign pointer back to this.
  oImage.oImagePreloader = this
  oImage.bLoaded = false
  // assign the .src property of the Image object
  oImage.src = image.url
}

ImagePreloader.prototype.onComplete = function () {
  this.nProcessed++
  if (this.nProcessed === this.nImages) {
    this.callback(this.aImages, this.imagesDict, this.nLoaded)
  }
}

ImagePreloader.prototype.onload = function () {
  this.bLoaded = true
  this.oImagePreloader.nLoaded++
  this.oImagePreloader.onComplete()
}

ImagePreloader.prototype.onerror = function () {
  this.bError = true
  this.oImagePreloader.onComplete()
}

ImagePreloader.prototype.onabort = function () {
  this.bAbort = true
  this.oImagePreloader.onComplete()
}

// 随机产生一个基于(min, max)之间的数字
export function getRandom (min, max) {
  var r = Math.random() * (max - min)
  var re = Math.round(r + min)
  re = Math.max(Math.min(re, max), min)
  return re
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

// 元素类型字典
export const typeDict = {
  pumpkin0g: {
    type: 'pumpkin',
    en: 'pumpkin0g',
    cn: '0g南瓜',
    score: 'pumpkin0g-score',
    weight: 0,
    sx: 20,
    sy: 10,
    sw: 160,
    sh: 140,
    dw: 70,
    dh: 61
  },
  pumpkin1g: {
    type: 'pumpkin',
    en: 'pumpkin1g',
    cn: '1g南瓜',
    score: 'pumpkin1g-score',
    weight: 1,
    sx: 20,
    sy: 10,
    sw: 160,
    sh: 140,
    dw: 70,
    dh: 61
  },
  pumpkin3g: {
    type: 'pumpkin',
    en: 'pumpkin3g',
    score: 'pumpkin3g-score',
    cn: '3g南瓜',
    weight: 3,
    sx: 20,
    sy: 10,
    sw: 160,
    sh: 140,
    dw: 70,
    dh: 61
  },
  pumpkin5g: {
    type: 'pumpkin',
    en: 'pumpkin5g',
    cn: '5g南瓜',
    score: 'pumpkin5g-score',
    weight: 5,
    sx: 20,
    sy: 10,
    sw: 160,
    sh: 140,
    dw: 70,
    dh: 61
  },
  pumpkin10g: {
    type: 'pumpkin',
    en: 'pumpkin10g',
    cn: '10g南瓜',
    score: 'pumpkin10g-score',
    weight: 10,
    sx: 0,
    sy: 10,
    sw: 200,
    sh: 140,
    dw: 100,
    dh: 70
  },
  witch_tl: {
    direction: 'left',
    type: 'troublemaker',
    en: 'witch_tl',
    cn: '女巫',
    sx: 0,
    sy: 0,
    sw: 210,
    sh: 186,
    dw: 70,
    dh: 62
  },
  witch_tr: {
    direction: 'right',
    type: 'troublemaker',
    en: 'witch_tr',
    cn: '女巫',
    sx: 0,
    sy: 0,
    sw: 210,
    sh: 186,
    dw: 70,
    dh: 62
  },
  bat_tl: {
    direction: 'left',
    type: 'troublemaker',
    en: 'bat',
    cn: '蝙蝠',
    sx: 0,
    sy: 0,
    sw: 188,
    sh: 66,
    dw: 90,
    dh: 32
  },
  bat_tr: {
    direction: 'right',
    type: 'troublemaker',
    en: 'bat',
    cn: '蝙蝠',
    sx: 0,
    sy: 0,
    sw: 188,
    sh: 66,
    dw: 90,
    dh: 32
  },
  ghost_tl: {
    direction: 'left',
    type: 'troublemaker',
    en: 'ghost_tl',
    cn: '幽灵',
    sx: 0,
    sy: 0,
    sw: 128,
    sh: 108,
    dw: 70,
    dh: 59
  },
  ghost_tr: {
    direction: 'right',
    type: 'troublemaker',
    en: 'ghost_tr',
    cn: '幽灵',
    sx: 0,
    sy: 0,
    sw: 128,
    sh: 108,
    dw: 70,
    dh: 59
  },
  ghostl_tl: {
    direction: 'left',
    type: 'troublemaker',
    en: 'ghostl_tl',
    cn: '幽灵',
    sx: 0,
    sy: 0,
    sw: 84,
    sh: 88,
    dw: 50,
    dh: 52
  },
  ghostl_tr: {
    direction: 'right',
    type: 'troublemaker',
    en: 'ghostl_tr',
    cn: '幽灵',
    sx: 0,
    sy: 0,
    sw: 84,
    sh: 88,
    dw: 50,
    dh: 52
  }
}

export const config = {
  backgrounds: ['halloween-bg1', 'halloween-bg2'],
  width: 70,
  height: 61,
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
