/**
 * 万圣节活动收获南瓜游戏
 */
import {
  ImagePreloader,
  getRandom,
  weightRules,
  config,
  troublemaker,
  rotateDeg,
  captureTouch,
  typeDict
} from './utils'
let imagesLists = [{
  name: 'halloween-bg1',
  url: require('../assets/img/game/halloween-bg1.jpg')
}, {
  name: 'halloween-bg2',
  url: require('../assets/img/game/halloween-bg2.jpg')
}, {
  name: 'pumpkin0g',
  url: require('../assets/img/game/pumpkin0g.png')
}, {
  name: 'pumpkin1g',
  url: require('../assets/img/game/pumpkin1g.png')
}, {
  name: 'pumpkin3g',
  url: require('../assets/img/game/pumpkin3g.png')
}, {
  name: 'pumpkin5g',
  url: require('../assets/img/game/pumpkin5g.png')
}, {
  name: 'pumpkin10g',
  url: require('../assets/img/game/pumpkin10g.png')
}, {
  name: 'weight0g',
  url: require('../assets/img/game/weight0g.png')
}, {
  name: 'weight1g',
  url: require('../assets/img/game/weight1g.png')
}, {
  name: 'weight3g',
  url: require('../assets/img/game/weight3g.png')
}, {
  name: 'weight5g',
  url: require('../assets/img/game/weight5g.png')
}, {
  name: 'weight10g',
  url: require('../assets/img/game/weight10g.png')
}, {
  name: 'witch_tl',
  url: require('../assets/img/game/witch_tl.png')
}, {
  name: 'witch_tr',
  url: require('../assets/img/game/witch_tr.png')
}, {
  name: 'bat',
  url: require('../assets/img/game/bat.png')
}, {
  name: 'ghost_tl',
  url: require('../assets/img/game/ghost_tl.png')
}, {
  name: 'ghost_tr',
  url: require('../assets/img/game/ghost_tr.png')
}, {
  name: 'ghostl_tl',
  url: require('../assets/img/game/ghostl_tl.png')
}, {
  name: 'ghostl_tr',
  url: require('../assets/img/game/ghostl_tr.png')
}, {
  name: 'oops',
  url: require('../assets/img/game/oops.png')
}]

export default function Halloween (El, callback) {
  // 获取画布上下文
  this.ctx = El.getContext('2d')
  this.callback = callback
  // 屏幕的设备像素比
  const devicePixelRatio = window.devicePixelRatio || 1
  // 浏览器在渲染canvas之前存储画布信息的像素比
  const backingStoreRatio = this.ctx.webkitBackingStorePixelRatio ||
  this.ctx.mozBackingStorePixelRatio ||
  this.ctx.msBackingStorePixelRatio ||
  this.ctx.oBackingStorePixelRatio ||
  this.ctx.backingStorePixelRatio || 1
  const ratio = devicePixelRatio / backingStoreRatio
  // 设置画布尺寸
  this.size = setCanvasSize(El, ratio)
  this.ctx.scale(ratio, ratio)
  this.firstBg = -1
  // 检测浏览器是否支持canvas
  if (!this.ctx) {
    alert('浏览器版本太低！')
    return null
  }
  // 添加触摸事件
  captureTouch(El, this.gainPumpkin.bind(this))
  // todo => 测试初始化程序
  this.init()
}

Halloween.prototype.init = function (lists, level) {
  /**
   * 初始化数据
   */
  this.firstBg++
  this.inited = true
  this.status = false
  this.weight = 0
  this.counts = [0, 0, 0, 0, 0]
  this.oops = {
    left: -10000,
    top: -10000
  }
  this.endStatus = 0
  this.duration = config.duration
  let ruleList = lists instanceof Array && lists.length <= 4 ? [...lists] : weightRules[getRandom(0, weightRules.length - 1)]
  this.level = level >= 0 && level <= 3 ? level : getRandom(0, 3)
  // console.log('ruleList', ruleList, this.level)
  this.weightGroups = initWeight(ruleList, this.level)
  let firstGroup = this.weightGroups.splice(0, 1)[0]
  this.pumpkins = this.addNewPumpkins(firstGroup, config.speed[this.level], true)
  // this.pumpkins = this.addNewPumpkins([0], config.speed[this.level], true)
  this.scores = []
  this.bgImage = this.firstBg < 2 ? 'halloween-bg1' : config.backgrounds[getRandom(0, 1)]
  clearInterval(this.timer)
  /**
   * 批量加载需要加载的图片
   */
  this.preloaderImages = new ImagePreloader(imagesLists, imagesLoaded)
  let _this = this
  function imagesLoaded (images, imagesDict, loadedNum) {
    // console.log('%c 图片加载完成', 'color:red', imagesDict)
    _this.imagesDict = imagesDict
    _this.render()
    // todo => 测试启动程序
    _this.gameStart()
  }
}

Halloween.prototype.gameStart = function () {
  if (!this.inited) return
  this.inited = false
  clearInterval(this.timer)
  this.status = true
  let timeStamp = (new Date()).getTime()
  let intervalTime = 20
  let speed = config.speed[this.level]
  let gapTime = config.gapTime[this.level]
  // console.log('speed', speed, gapTime)
  this.gapT = gapTime
  this.produceTroubleTimes = troublemaker(this.level)
  this.produceTroubleTime = this.produceTroubleTimes.shift()
  // 更新数据
  this.update = function () {
    let index = this.pumpkins.length
    while (index > 0 && index--) {
      let curPumpkin = this.pumpkins[index]
      if (curPumpkin.status && curPumpkin.category.type === config.pumpkin) {
        curPumpkin.top += curPumpkin.speed
        if (curPumpkin.top > (this.size.height - config.bottom)) {
          curPumpkin.status = false
        }
      } else if (curPumpkin.status && curPumpkin.category.type === config.troublemaker) {
        curPumpkin.left += curPumpkin.speed
        let top = curPumpkin.top + (curPumpkin.direction === 'up' ? -curPumpkin.speedV : curPumpkin.speedV)
        if (top < config.top) {
          curPumpkin.direction = 'down'
        } else if (top > (this.size.height - config.bottom)) {
          curPumpkin.direction = 'up'
        }
        curPumpkin.rotate = rotateDeg(curPumpkin)
        curPumpkin.top = top
        if ((curPumpkin.category.direction === 'left' && curPumpkin.left < -100) || (curPumpkin.category.direction === 'right' && curPumpkin.left > this.size.width)) {
          curPumpkin.status = false
        }
      }
    }
    // 更新分数透明度
    let scores = this.scores
    for (let i = 0; i < scores.length; i++) {
      let score = scores[i]
      if (score.category.opacity > 0) {
        score.category.opacity -= 0.04
      } else {
        score.category.opacity = 0
      }
    }
  }
  this.timer = setInterval(_ => {
    this.duration -= intervalTime
    this.gapT -= intervalTime
    // 是否添加捣蛋鬼
    let condition = (config.duration - this.duration) === this.produceTroubleTime.time
    if (condition) {
      let newTrobles = []
      for (let i = 0; i < this.produceTroubleTime.num; i++) {
        let category = {...config.troublemakers[getRandom(0, 7)]}
        // 捣蛋元素x轴位置
        let leftLoc = [getRandom(-200, -75), (this.size.width + getRandom(0, 200))]
        let left = leftLoc[['right', 'left'].indexOf(category.direction)]
        let speed = [-1, 1][['left', 'right'].indexOf(category.direction)] * getRandom(1, 3)
        let direction = getRandom(0, 1) === 0 ? 'up' : 'down'
        let troble = {
          status: true,
          category: category,
          left: left,
          top: getRandom(config.top, this.size.height - config.bottom),
          rotate: 0,
          speed: speed,
          speedV: getRandom(1, 2),
          direction: direction
        }
        troble.rotate = rotateDeg(troble)
        newTrobles = [...newTrobles, troble]
      }
      this.pumpkins.push(...newTrobles)
      if (this.produceTroubleTimes.length > 0) {
        this.produceTroubleTime = this.produceTroubleTimes.shift()
      }
    }
    // 添加南瓜
    if (this.gapT <= 0 && this.duration > 1000) {
      let newGroup = this.weightGroups.length > 0
        ? this.weightGroups.splice(0, 1)[0]
        : []
      // console.log('newGroup', newGroup)
      let dropNum = getRandom(0, 4 - newGroup.length)
      for (var i = 0; i < dropNum; i++) {
        newGroup.push(0)
      }
      let newPumpkins = this.addNewPumpkins(newGroup, speed)
      // this.pumpkins.push(...newPumpkins)
      this.pumpkins.splice(0, 0, ...newPumpkins)
      this.gapT = gapTime
    }
    this.update()
    let gameTime = (new Date()).getTime() - timeStamp
    if (this.duration <= 0 || gameTime > config.duration) {
      this.status = false
      this.endStatus = 0
      this.gameOver()
      clearInterval(this.timer)
    }
  }, intervalTime)
  // 渲染图形
  this.render()
}

Halloween.prototype.render = function () {
  // 渲染图形
  this.ctx.clearRect(0, 0, this.size.width, this.size.height)
  this.ctx.drawImage(this.imagesDict[this.bgImage], 0, 0, this.size.width, this.size.height)
  let pumpkins = this.pumpkins
  for (let i = 0; i < pumpkins.length; i++) {
    let pumpkin = pumpkins[i]
    if (!pumpkin.status) continue
    this.ctx.save()
    this.ctx.translate(pumpkin.left + pumpkin.category.dw / 2, pumpkin.top + pumpkin.category.dh / 2)
    this.ctx.rotate((Math.PI * 2 / 360) * pumpkin.rotate)
    this.ctx.drawImage(this.imagesDict[pumpkin.category.en], pumpkin.category.sx, pumpkin.category.sy, pumpkin.category.sw, pumpkin.category.sh, -pumpkin.category.dw / 2, -pumpkin.category.dh / 2, pumpkin.category.dw, pumpkin.category.dh)
    this.ctx.restore()
  }
  let scores = this.scores
  for (let n = 0; n < scores.length; n++) {
    let score = scores[n]
    if (score.category.opacity > 0) {
      this.ctx.save()
      this.ctx.globalAlpha = score.category.opacity
      this.ctx.drawImage(this.imagesDict[score.category.en], score.category.sx, score.category.sy, score.category.sw, score.category.sh, score.left, score.top, score.category.dw, score.category.dh)
      this.ctx.restore()
    }
  }
  // 是否显示碰到捣蛋鬼提示
  if (!this.status && this.oops.left !== 10000) {
    this.ctx.drawImage(this.imagesDict['oops'], 0, 0, 188, 100, this.oops.left, this.oops.top, 150, 80)
  }
  if (this.status) {
    window.requestAnimationFrame(this.render.bind(this))
  }
}

// 添加新南瓜到队列中
Halloween.prototype.addNewPumpkins = function (newPumpkinWeight, speed, isFirst) {
  let newPumpkins = []
  for (let i = 0; i < newPumpkinWeight.length; i++) {
    let weight = newPumpkinWeight[i]
    newPumpkins = [...newPumpkins, {
      status: true,
      category: {...config.pumpkins[[0, 1, 3, 5, 10].indexOf(weight)]},
      left: !isFirst ? getRandom(0, (this.size.width - 70)) : getRandom(50, (this.size.width - 70)),
      top: !isFirst ? getRandom(config.top - 100, config.top - 50) : getRandom(config.top + 100, config.top + 150),
      rotate: getRandom(-45, 45),
      speed: getRandom(speed - 1, speed),
      weight: weight
    }]
  }
  return newPumpkins
}

// 处理触摸事件
Halloween.prototype.gainPumpkin = function (touch) {
  if (!this.status) return
  let x = touch.x
  let y = touch.y
  let pumpkins = this.pumpkins
  for (let i = pumpkins.length - 1; i >= 0; i--) {
    let target = pumpkins[i]
    let condition = x > target.left &&
      x < target.left + target.category.dw &&
      y > target.top &&
      y < target.top + target.category.dh
    if (condition) {
      if (target.category.type === config.pumpkin) {
        this.weight += target.weight
        target.category = {...typeDict[target.category.score]}
        // 新获得的重量上传
        this.callback && this.callback({
          type: 'updateWeight',
          payload: target.weight
        })
        // 添加用户点击统计数据
        this.counts[[0, 1, 3, 5, 10].indexOf(target.weight)] += 1
        this.scores = pumpkins.splice(i, 1)
        // console.log('scores', this.scores)
      } else {
        this.status = false
        clearInterval(this.timer)
        this.oops = {
          left: target.left - 25,
          top: target.top - 15
        }
        // 点击到了捣蛋鬼，游戏结束将结果反馈回父组件 p.category.cn
        this.endStatus = ['', '女巫', '幽灵', '蝙蝠'].indexOf(target.category.cn)
        this.gameOver()
        this.pumpkins = this.pumpkins.filter(d => {
          return d.category.type !== config.pumpkin
        })
      }
      break
    }
  }
}

// 游戏结束结算
Halloween.prototype.gameOver = function () {
  this.duration = 0
  // 反馈数据
  let res = {
    weight: this.weight,
    counts: this.counts,
    endStatus: this.endStatus
  }
  this.callback && this.callback({
    type: 'gameOver',
    payload: {...res}
  })
}

// 设置画布尺寸
function setCanvasSize (domEl, ratio) {
  let parentNode = domEl.parentNode
  let w = parentNode.clientWidth
  let h = parentNode.clientHeight
  let props = [{
    prop: 'width',
    val: w
  }, {
    prop: 'height',
    val: h
  }]
  props.forEach(d => {
    domEl[d.prop] = d.val * ratio
    domEl.style[d.prop] = d.val + 'px'
  })
  return {
    width: w,
    height: h
  }
}

// 初始化南瓜重量
function initWeight (ruleList, level) {
  let initWeightArr = []
  let dropTimes = config.dropTimes[level]
  for (let i = 0; i < dropTimes; i++) {
    initWeightArr = [...initWeightArr, []]
  }
  const rules = [1, 3, 5, 10]
  let tempArr = []
  for (let n = ruleList.length - 1; n >= 0; n--) {
    if (n >= 2 && ruleList[n] !== 0) {
      let gap = Math.ceil(dropTimes / ruleList[n])
      let randomGap = getRandom(0, gap)
      let num = ruleList[n]
      for (let i = randomGap; num > 0; i += gap) {
        num--
        if (i < initWeightArr.length) {
          if (initWeightArr[i].length > 0 && i < (dropTimes - 1)) {
            initWeightArr[i + 1].push(rules[n])
          } else {
            initWeightArr[i].push(rules[n])
          }
        } else {
          let randomI = getRandom(0, (initWeightArr.length - 1))
          let offset = randomI > initWeightArr.length / 2 ? -1 : 1
          for (let m = 0; m < 100; m++) {
            if (initWeightArr[randomI].length > 0) {
              randomI += offset
              continue
            } else {
              initWeightArr[randomI].push(rules[n])
              break
            }
          }
        }
      }
    } else {
      tempArr = [ruleList[n], ...tempArr]
    }
  }
  let pumpkinWeights = []
  tempArr.forEach((d, i) => {
    if (d > 0) {
      for (let j = 0; j < d; j++) {
        pumpkinWeights = [...pumpkinWeights, rules[i]]
      }
    }
  })
  pumpkinWeights.sort(_ => {
    return 0.5 - Math.random()
  })
  let tempCount = 0
  for (let i = 0; i < Math.ceil(pumpkinWeights.length / initWeightArr.length); i++) {
    if (tempCount < pumpkinWeights.length) {
      for (let j = 0; j < initWeightArr.length && tempCount < pumpkinWeights.length; j++) {
        if (i === 0 && initWeightArr[j].length === 0) {
          initWeightArr[j].push(pumpkinWeights[tempCount])
        } else if (i === 1 && initWeightArr[j].length <= 1) {
          initWeightArr[j].push(pumpkinWeights[tempCount])
        } else if (i === 2) {
          initWeightArr[j].push(pumpkinWeights[tempCount])
        } else {
          continue
        }
        tempCount++
      }
    } else {
      break
    }
  }
  // let aa = 0
  // initWeightArr.forEach(d => {
  //   d.forEach(b => {
  //     aa += b
  //   })
  // })
  // console.log('%c 总重量为：', 'color:red', aa)
  // console.log('initWeightArr', initWeightArr)
  return initWeightArr
}
