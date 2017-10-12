/**
 * 万圣节活动收获南瓜游戏
 */

export default function Halloween (El, config) {
  console.log('开始绘制图形')
  // 设置画布尺寸
  console.log('El', El)
  let size = setCanvasSize(El)
  console.log('%c size', 'color: red', size)
  // 获取画布上下文
  let ctx = El.getContext('2d')
  console.log(ctx)
  // 检测浏览器是否支持canvas
  if (!ctx) {
    alert('浏览器版本太低！')
    return null
  }
  let offset = 0
  // 绘制图形
  function draw () {
    ctx.clearRect(0, 0, size.width, size.height)
    ctx.setLineDash([4, 2])
    ctx.lineDashOffset = -offset
    ctx.strokeRect(10, 10, 100, 100)
  }

  function march () {
    offset++
    if (offset > 16) {
      offset = 0
    }
    draw()
    setTimeout(march, 20)
  }
  march()
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
