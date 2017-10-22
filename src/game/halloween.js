/**
 * 万圣节活动收获南瓜游戏
 */
let bgImgurl0 = require('../assets/img/game/halloween-bg1.png')
export default function Halloween (El, config) {
  console.log('开始绘制图形')
  // 设置画布尺寸
  let size = setCanvasSize(El)
  console.log('%c size', 'color: red', size)
  // 获取画布上下文
  let ctx = El.getContext('2d')
  // 检测浏览器是否支持canvas
  if (!ctx) {
    alert('浏览器版本太低！')
    return null
  }
  // 加载图片
  let bgImg1 = new Image()
  bgImg1.src = bgImgurl0
  // 绘制图形
  function draw () {
    ctx.clearRect(0, 0, size.width, size.height)
    ctx.drawImage(bgImg1, 0, 0, size.width, size.height)
  }

  // 更新数据
  function animation () {
    draw()
    window.requestAnimationFrame(animation)
  }

  bgImg1.onload = function () {
    animation()
  }
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
