<template>
  <div
    class="game"
    ref="game"
    @touchmove.prevent
  >
    <div
      class="bg-wrapper"
      :class="[background, {disappear: toggleBg}]"
    ></div>
    <div
      v-for="(pumpkin, index) in pumpkins"
      :key="index"
      v-if="pumpkin.status"
      class="round"
      :class="[pumpkin.category.en]"
      :style="{
        transform: 'translate(' + pumpkin.left + 'px,' + pumpkin.top + 'px)' + 'rotate(' + pumpkin.rotate + 'deg)'
      }"
      @click="gainPumpkin(pumpkin, index)"
    >
      <span :style="{opacity: pumpkin.show ? 1 : 0}"></span>
    </div>
    <div class="tips-btn" v-if="isFirst && !status">
      <img src="../assets/img/game/tips-btn.png" alt="tips-btn">
    </div>
    <div
      class="oops"
      :style="{
        transform: 'translate(' + oops.left + 'px,' + oops.top + 'px)'
      }"
    >
      <img src="../assets/img/game/oops.png" alt="oops">
    </div>
    <!-- <div class="countdown">倒计时：{{countdown}}</div> -->
  </div>
</template>

<script>
/**
 * @param {number} level 设置游戏难度 => 0, 1, 2, 3 需先设置游戏难度
 * @param {[number]} lists 南瓜重量分布规则 => [50, 10, 20, 2]
 * @param {@} updateWeight 自定义事件 => 实现反馈获得的南瓜重量
 * @param {@} gameOver 自定义事件 => endStatus 0-正常结束   1-碰到女巫 2-碰到幽灵 3-碰到蝙蝠
 */
import { getRandom, config, troublemaker, weightRules, rotateDeg } from '@/game/config_dom.js'
export default {
  name: 'game',
  props: {
    lists: {
      type: Array,
      required: true
    },
    level: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      toggleBg: false,
      background: config.backgrounds[0],
      isFirst: true,
      selfLevel: config.difficulty,
      width: 0,
      height: 0,
      timer: null,
      status: false,
      duration: config.duration,
      gapT: 0,
      pumpkins: [],
      pumpkinWeights: [],
      produceTroubleTimes: [],
      produceTroubleTime: 0,
      tatal: 0,
      weight: 0,
      counts: [0, 0, 0, 0, 0],
      endStatus: 0, // endStatus 0-正常结束   1-碰到女巫 2-碰到幽灵 3-碰到蝙蝠
      times: 0,
      oops: {
        left: -10000,
        top: -10000
      }
    }
  },
  computed: {
    countdown: function () {
      let T = Math.ceil(this.duration / 1000)
      return T >= 60
        ? '01:00'
        : T < 10
          ? '00:0' + T
          : '00:' + T
    },
    progressBarL: function () {
      let ratio = this.weight / config.progressBarL
      ratio = ratio > 1 ? 1 : ratio
      return (ratio * 100).toFixed(2) + '%'
    }
  },
  mounted () {
    let wrapper = this.$refs.game
    this.width = wrapper.offsetWidth
    this.height = wrapper.offsetHeight
    this.initGame()
  },
  watch: {
    lists: function (newVal, oldVal) {
      // console.log('南瓜重量数组发生变化！', newVal, oldVal)
      this.toggleBg = true
      setTimeout(_ => {
        // 初始化游戏
        this.initGame()
      }, 100)
      setTimeout(_ => {
        // 切换背景
        let bgIndex = getRandom(0, 1)
        this.background = config.backgrounds[bgIndex]
        this.toggleBg = false
      }, 2000)
    }
  },
  methods: {
    gameOver () {
      // console.log('%c 南瓜掉落次数', 'color: red', this.times)
      this.duration = 0
      this.$emit('gameOver', {
        weight: this.weight,
        counts: [...this.counts],
        endStatus: this.endStatus
      })
      // console.log('南瓜总个数', this.tatal)
    },
    initGame () {
      // 初始化游戏状态
      this.oops = {
        left: -10000,
        top: -10000
      }
      this.isFirst = true
      this.duration = config.duration
      this.weight = 0
      this.counts = [0, 0, 0, 0, 0]
      this.endStatus = 0
      this.selfLevel = this.level >= 0 && this.level <= 3 ? this.level : config.difficulty
      // 初始界面需要有两个南瓜
      this.pumpkinWeights = this.initWeight()
      let newPumpkins = this.pumpkinWeights.splice(0, 1)[0]
      this.pumpkins = newPumpkins.length <= 1
        ? this.addNewPumpkins([...newPumpkins, 0], 3, true)
        : this.addNewPumpkins(newPumpkins, 3, true)
    },
    /**
     * 启动游戏
     * @param {level} value 游戏难度 0-简单 1-中等 2-困难 3-最难 默认中等难度
     */
    gameStart () {
      setTimeout(_ => {
        this.start()
      }, 100)
    },
    start () {
      this.times = 0
      this.status = true
      let difficulty = this.selfLevel
      let speed = config.speed[difficulty]
      let gapTime = config.gapTime[difficulty]
      this.gapT = gapTime
      // console.log('====', speed, gapTime)
      this.produceTroubleTimes = troublemaker(difficulty)
      this.produceTroubleTime = this.produceTroubleTimes.shift()
      clearInterval(this.timer)
      let intervaTime = 20
      // 初始化南瓜重量
      let pumpkinWeights = [...this.pumpkinWeights]
      this.isFirst = false
      this.timer = setInterval(() => {
        // 是否添加捣蛋鬼
        let condition = (config.duration - this.duration) === this.produceTroubleTime.time
        if (condition) {
          let newTrobles = []
          for (let i = 0; i < this.produceTroubleTime.num; i++) {
            let category = {...config.troublemakers[getRandom(0, 7)]}
            // 捣蛋元素x轴位置
            let leftLoc = [getRandom(-200, -75), (this.width + getRandom(0, 200))]
            let left = leftLoc[['right', 'left'].indexOf(category.direction)]
            let speed = [-1, 1][['left', 'right'].indexOf(category.direction)] * getRandom(1, 3)
            let direction = getRandom(0, 1) === 0 ? 'up' : 'down'
            let troble = {
              status: true,
              category: category,
              left: left,
              top: getRandom(config.top, this.height - config.bottom),
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
        // 动画
        this.game()
        // 添加南瓜
        this.gapT -= intervaTime
        if (this.gapT <= 0 && this.duration > 1000) {
          this.times++
          let newPumpkinWeight = pumpkinWeights.length > 0
            ? pumpkinWeights.splice(0, 1)[0]
            : []
          let dropNum = getRandom(0, 4 - newPumpkinWeight.length)
          for (var i = 0; i < dropNum; i++) {
            newPumpkinWeight.push(0)
          }
          this.tatal += newPumpkinWeight.length
          // console.log('this.tatal', this.tatal)
          let newPumpkins = this.addNewPumpkins(newPumpkinWeight, speed)
          this.pumpkins.push(...newPumpkins)
          this.gapT = gapTime
        }
        // 倒计时1分钟
        this.duration -= intervaTime
        if (this.duration < 0) {
          // console.log('%c 最后剩余的南瓜重量', 'color: red', pumpkinWeights)
          this.status = false
          clearInterval(this.timer)
          // 游戏结束将结果反馈回父组件
          this.endStatus = 0
          this.gameOver()
        }
      }, intervaTime)
    },
    initWeight () {
      let initWeightArr = []
      let dropTimes = config.dropTimes[this.selfLevel]
      // console.log('dropTimes', dropTimes)
      for (let i = 0; i < dropTimes; i++) {
        initWeightArr = [...initWeightArr, []]
      }
      const rules = [1, 3, 5, 10]
      let pumpkinNum = this.lists && this.lists.length > 0 ? [...this.lists] : weightRules[getRandom(0, (weightRules.length - 1))]
      let tempArr = []
      for (let n = pumpkinNum.length - 1; n >= 0; n--) {
        // console.log('pumpkinNum[n]', pumpkinNum[n])
        if (n >= 2 && pumpkinNum[n] !== 0) {
          let gap = Math.ceil(dropTimes / pumpkinNum[n])
          let randomGap = getRandom(0, gap)
          let num = pumpkinNum[n]
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
          tempArr = [pumpkinNum[n], ...tempArr]
        }
      }
      // console.log('initWeightArr ===>>', initWeightArr, tempArr, pumpkinNum)
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
          for (let j = initWeightArr.length - 1; j >= 0 && tempCount < pumpkinWeights.length; j--) {
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
      // console.log('pumpkinNum', pumpkinNum)
      // console.log('pumpkinWeights', pumpkinWeights)
      // console.log('initWeightArr', initWeightArr)
      // let aa = 0
      // initWeightArr.forEach(d => {
      //   d.forEach(b => {
      //     aa += b
      //   })
      // })
      // console.log('%c 总重量为：', 'color:red', aa)
      return initWeightArr
    },
    addNewPumpkins (newPumpkinWeight, speed, isFirst) {
      let newPumpkins = []
      for (let i = 0; i < newPumpkinWeight.length; i++) {
        let weight = newPumpkinWeight[i]
        newPumpkins = [...newPumpkins, {
          status: true,
          category: {...config.pumpkins[[0, 1, 3, 5, 10].indexOf(weight)]},
          left: !isFirst ? getRandom(0, (this.width - 50)) : getRandom(50, (this.width - 50)),
          top: !isFirst ? getRandom(config.top - 100, config.top - 50) : getRandom(config.top + 100, config.top + 150),
          rotate: getRandom(-45, 45),
          speed: getRandom(speed - 1, speed),
          weight: weight
        }]
      }
      return newPumpkins
    },
    game () {
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
          } else if (top > (this.height - config.bottom)) {
            curPumpkin.direction = 'up'
          }
          curPumpkin.rotate = rotateDeg(curPumpkin)
          curPumpkin.top = top
          if ((curPumpkin.category.direction === 'left' && curPumpkin.left < -50) || (curPumpkin.category.direction === 'right' && curPumpkin.left > this.width)) {
            curPumpkin.status = false
          }
        }
      }
    },
    gainPumpkin (p, index) {
      // console.log(p, index)
      if (!this.status && !this.pumpkins[index].show) return
      if (p.category.type === config.pumpkin) {
        this.weight += p.weight
        this.pumpkins[index].show = true
        this.pumpkins[index].category.en = this.pumpkins[index].category.score
        setTimeout(_ => {
          this.pumpkins.splice(index, 1)
        }, 100)
        // 新获得的重量上传
        this.$emit('updateWeight', p.weight)
        // 添加用户点击统计数据
        this.counts[[0, 1, 3, 5, 10].indexOf(p.weight)] += 1
      } else {
        this.status = false
        clearInterval(this.timer)
        this.oops = {
          left: p.left - 15,
          top: p.top - 5
        }
        // 点击到了捣蛋鬼，游戏结束将结果反馈回父组件 p.category.cn
        this.endStatus = ['', '女巫', '幽灵', '蝙蝠'].indexOf(p.category.cn)
        this.gameOver()
        this.pumpkins = this.pumpkins.filter(d => {
          return d.category.type !== config.pumpkin
        })
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.game {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
}
.bg-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  background-size: cover;
  background-repeat: no-repeat;
  width: 100%;
  height: 100%;
}
.halloween-bg1 {
  animation: show 2s linear;
  background-image: url(../assets/img/game/halloween-bg1.png);
}
.halloween-bg2 {
  animation: show 2s linear;
  background-image: url(../assets/img/game/halloween-bg2.png);
}
.disappear {
  animation: hide 2s linear;
}
@keyframes hide {
  from {opacity: 1;}
  to {opacity: 0.3;}
}
@keyframes show {
  from {opacity: 0.3;}
  to {opacity: 1;}
}
.round {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 65px;
  height: 65px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  border-radius: 50%;
  z-index: 10;
  -webkit-transform: translateZ(0);
  -moz-transform: translateZ(0);
  -ms-transform: translateZ(0);
  -o-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-backface-visibility:hidden;
  -webkit-perspective:1000;
  span {
    pointer-events: none;
    display: block;
    width: 80px;
    height: inherit;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }
}
.pumpkin0g {
  background-image: url(../assets/img/game/pumpkin0g.png);
}
.pumpkin1g {
  background-image: url(../assets/img/game/pumpkin1g.png);
}
.pumpkin3g {
  background-image: url(../assets/img/game/pumpkin3g.png);
}
.pumpkin5g {
  background-image: url(../assets/img/game/pumpkin5g.png);
}
.pumpkin10g {
  background-size: contain;
  background-image: url(../assets/img/game/pumpkin10g.png);
  width: 100px;
}
.pumpkin0g-score {
  z-index: 25;
  span {
    background-image: url(../assets/img/game/weight0g.png);
  }
}
.pumpkin1g-score {
  z-index: 25;
  span {
    background-image: url(../assets/img/game/weight1g.png);
  }
}
.pumpkin3g-score {
  z-index: 25;
  span {
    background-image: url(../assets/img/game/weight3g.png);
  }
}
.pumpkin5g-score {
  z-index: 25;
  span {
    background-image: url(../assets/img/game/weight5g.png);
  }
}
.pumpkin10g-score {
  z-index: 25;
  span {
    background-image: url(../assets/img/game/weight10g.png);
  }
}
.troublemaker() {
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 80px;
  height: 80px;
  z-index: 20;
}
.witch_tl {
  .troublemaker;
  background-size: 90%;
  background-image: url(../assets/img/game/witch_tl.png);
}
.witch_tr {
  .troublemaker;
  background-size: 90%;
  background-image: url(../assets/img/game/witch_tr.png);
}
.bat {
  .troublemaker;
  background-image: url(../assets/img/game/bat.png);
  height: 50px;
}
.ghost_tl {
  .troublemaker;
  background-size: 90%;
  background-image: url(../assets/img/game/ghost_tl.png);
  width: 65px;
  height: 65px;
}
.ghost_tr {
  .troublemaker;
  background-size: 90%;
  background-image: url(../assets/img/game/ghost_tr.png);
  width: 65px;
  height: 65px;
}
.ghostl_tl {
  .troublemaker;
  background-image: url(../assets/img/game/ghostl_tl.png);
  width: 45px;
  height: 45px;
}
.ghostl_tr {
  .troublemaker;
  background-image: url(../assets/img/game/ghostl_tr.png);
  width: 45px;
  height: 45px;
}
.tips-btn {
  position: absolute;
  top: 290px;
  left: 135px;
  pointer-events: none;
  img {
    width: 118px;
  }
}
.oops {
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 30;
  img {
    width: 130px;
    height: auto;
  }
}
/* todo 测试按钮 */
.countdown {
  position: absolute;
  top: 50px;
  left: 50%;
  width: 200px;
  margin-left: -100px;
  background: #fff;
  color: #000;
  font-size: 20px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  z-index: 2;
}
</style>
