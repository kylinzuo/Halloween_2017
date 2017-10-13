import { getRandom } from '@/util'
export const config = {
  speed: 5,
  difficulty: 0,
  duration: 60000,
  pumpkin: 'pumpkin',
  troublemaker: 'troublemaker',
  top: 100,
  bottom: 150
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
