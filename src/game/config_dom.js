import { getRandom } from '@/util'
export const config = {
  speed: 5,
  difficulty: 0,
  duration: 60000,
  gapTime: 800,
  pumpkin: 'pumpkin',
  troublemaker: 'troublemaker',
  top: 100,
  bottom: 150,
  progressBarL: 200
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
  [65, 20, 5, 3],
  [65, 30, 7, 1],
  [50, 15, 15, 3]
]
