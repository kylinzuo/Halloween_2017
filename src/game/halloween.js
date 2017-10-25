/**
 * 万圣节活动收获南瓜游戏
 */
import { ImagePreloader } from './utils'
let bgImgurl0 = require('../assets/img/game/halloween-bg1.png')
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
  // 加载图片
  this.imgsLists = [{
    name: 'halloween-bg1',
    url: bgImgurl0
  }]
  this.preloaderImages = new ImagePreloader(this.imgsLists, this.imagesLoaded)
}

Halloween.prototype.imagesLoaded = function (images, imagesDict, loadedNum) {
  console.log(images, imagesDict, loadedNum)
}

Halloween.prototype.init = function () {

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
