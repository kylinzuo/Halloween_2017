/**
 * 万圣节活动收获南瓜游戏
 */
import {
  ImagePreloader,
  getRandom,
  weightRules,
  config
} from './utils'
let imagesLists = [{
  name: 'halloween-bg1',
  url: require('../assets/img/game/halloween-bg1.png')
}]
console.log(config)
export default function Halloween (El, config) {
  console.log('开始生成实例')
  // 设置画布尺寸
  this.size = setCanvasSize(El)
  console.log('%c size', 'color: red', this.size)
  // 获取画布上下文
  this.ctx = El.getContext('2d')
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
  let ruleList = weightRules[getRandom(0, weightRules.length - 1)]
  let level = getRandom(0, 3)
  console.log('ruleList', ruleList)
  this.pumpkins = initWeight(ruleList, level)
  /**
   * 批量加载需要加载的图片
   */
  this.preloaderImages = new ImagePreloader(imagesLists, imagesLoaded)
  let _this = this
  function imagesLoaded (images, imagesDict, loadedNum) {
    console.log('%c 图片加载完成', 'color:red', imagesDict)
    _this.imagesDict = imagesDict
    _this.ctx.clearRect(0, 0, _this.size.width, _this.size.height)
    _this.ctx.drawImage(_this.imagesDict['halloween-bg1'], 0, 0, _this.size.width, _this.size.height)
  }
}

Halloween.prototype.gameStart = function () {
  // 绘制图形
  function draw () {
    this.ctx.clearRect(0, 0, this.size.width, this.size.height)
    // this.ctx.drawImage(bgImg1, 0, 0, this.size.width, this.size.height)
    window.requestAnimationFrame(draw)
  }
  draw()
}

// 设置画布尺寸
function setCanvasSize (domEl) {
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
    domEl.setAttribute(d.prop, d.val)
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
  for (let i = 0; i < 3; i++) {
    if (tempCount < pumpkinWeights.length) {
      for (let j = 0; j >= 0 && tempCount < pumpkinWeights.length; j--) {
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
  let aa = 0
  initWeightArr.forEach(d => {
    d.forEach(b => {
      aa += b
    })
  })
  console.log('%c 总重量为：', 'color:red', aa)
  console.log('initWeightArr', initWeightArr)
  return initWeightArr
}
