/**
 * 万圣节活动收获南瓜游戏
 */
import {
  ImagePreloader,
  getRandom,
  weightRules,
  config,
  troublemaker,
  rotateDeg
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
}]
console.log(config)
export default function Halloween (El, config) {
  console.log('开始生成实例')
  // 获取画布上下文
  this.ctx = El.getContext('2d')
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
  console.log('%c size', 'color: red', this.size)
  this.ctx.scale(ratio, ratio)
  // 检测浏览器是否支持canvas
  if (!this.ctx) {
    alert('浏览器版本太低！')
    return null
  }
  this.init()
}

Halloween.prototype.init = function () {
  /**
   * 初始化数据
   */
  this.duration = config.duration
  let ruleList = weightRules[getRandom(0, weightRules.length - 1)]
  this.level = getRandom(0, 3)
  console.log('ruleList', ruleList)
  this.weightGroups = initWeight(ruleList, this.level)
  let firstGroup = this.weightGroups.splice(0, 1)[0]
  this.pumpkins = this.addNewPumpkins(firstGroup, config.speed[this.level], true)
  // this.pumpkins = this.addNewPumpkins([0], config.speed[this.level], true)
  console.log('firstGroup', firstGroup, this.pumpkins)
  /**
   * 批量加载需要加载的图片
   */
  this.preloaderImages = new ImagePreloader(imagesLists, imagesLoaded)
  let _this = this
  function imagesLoaded (images, imagesDict, loadedNum) {
    console.log('%c 图片加载完成', 'color:red', imagesDict)
    _this.imagesDict = imagesDict
    _this.render()
    // todo => 测试启动程序
    _this.gameStart()
  }
}

Halloween.prototype.gameStart = function () {
  clearInterval(this.timer)
  this.status = true
  let timeStamp = (new Date()).getTime()
  let intervalTime = 20
  let speed = config.speed[this.level]
  let gapTime = config.gapTime[this.level]
  console.log('speed', speed, gapTime)
  this.gapT = gapTime
  this.produceTroubleTimes = troublemaker(this.level)
  this.produceTroubleTime = this.produceTroubleTimes.shift()
  console.log('======>>>>', this.produceTroubleTimes, this.produceTroubleTime)
  // 更新数据
  this.update = function () {
    let index = this.pumpkins.length
    while (index > 0 && index--) {
      let curPumpkin = this.pumpkins[index]
      if (curPumpkin.status && curPumpkin.category.type === config.pumpkin) {
        curPumpkin.top += curPumpkin.speed
        if (curPumpkin.top > (this.height - config.bottom)) {
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
      this.pumpkins.push(...newPumpkins)
      this.gapT = gapTime
    }
    this.update()
    let gameTime = (new Date()).getTime() - timeStamp
    if (this.duration <= 0 || gameTime > config.duration) {
      this.status = false
      clearInterval(this.timer)
    }
  }, intervalTime)
  // 渲染图形
  this.render()
}

Halloween.prototype.render = function () {
  // 渲染图形
  this.ctx.clearRect(0, 0, this.size.width, this.size.height)
  this.ctx.drawImage(this.imagesDict['halloween-bg1'], 0, 0, this.size.width, this.size.height)
  let pumpkins = this.pumpkins
  for (let i = 0; i < pumpkins.length; i++) {
    let pumpkin = pumpkins[i]
    this.ctx.drawImage(this.imagesDict[pumpkin.category.en], pumpkin.category.sx, pumpkin.category.sy, pumpkin.category.sw, pumpkin.category.sh, pumpkin.left, pumpkin.top, pumpkin.category.dw, pumpkin.category.dh)
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
      left: !isFirst ? getRandom(0, (this.size.width - 50)) : getRandom(50, (this.size.width - 50)),
      top: !isFirst ? getRandom(config.top - 100, config.top - 50) : getRandom(config.top + 100, config.top + 150),
      rotate: getRandom(-45, 45),
      speed: getRandom(speed - 1, speed),
      weight: weight
    }]
  }
  return newPumpkins
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
