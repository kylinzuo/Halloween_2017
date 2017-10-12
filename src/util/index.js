// 随机产生一个基于(min, max)之间的数字
export function getRandom (min, max) {
  var r = Math.random() * (max - min)
  var re = Math.round(r + min)
  re = Math.max(Math.min(re, max), min)
  return re
}
