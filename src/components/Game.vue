<template>
  <div class="game" ref="game">
    <div
      v-for="(pumpkin, index) in pumpkins"
      :key="index"
      class="round"
      :class="[imgDict[pumpkin.type]]"
      :style="{
        left: pumpkin.left + 'px',
        top: pumpkin.top + 'px'
      }"
      @click="gainPumpkin(pumpkin, index)"
    >
      {{pumpkin.weight ? '+' + pumpkin.weight : ''}}
    </div>
    <div class="start-btn" @click="gameStart()">开始</div>
    <div class="countdown">倒计时：{{countdown}}</div>
    <div class="progress-bar-wrapper">
      <div
        class="progress-bar"
        :style="{
          width: progressBarL
        }"
      ></div>
    </div>
  </div>
</template>

<script>
import { getRandom } from '@/util'
import { config, troublemaker, weightRules } from '@/game/config_dom.js'
export default {
  name: 'game',
  data () {
    return {
      imgDict: {
        pumpkin: 'pumpkin',
        troublemaker: 'troublemaker'
      },
      width: 0,
      height: 0,
      timer: null,
      status: false,
      duration: config.duration,
      gapT: config.gapTime,
      pumpkins: [],
      produceTroubleTimes: [],
      produceTroubleTime: 0,
      tatal: 0,
      weight: 0
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
    // this.start()
  },
  methods: {
    gameStart () {
      this.start()
    },
    start () {
      // 初始化游戏状态
      this.status = true
      this.duration = config.duration
      this.weight = 0
      this.pumpkins = []
      this.produceTroubleTimes = troublemaker()
      console.log(this.produceTroubleTimes)
      this.produceTroubleTime = this.produceTroubleTimes.shift()
      // 最大掉落南瓜次数
      let maxVal = Math.floor((config.duration / 1000 - 1) / (config.gapTime / 1000))
      clearInterval(this.timer)
      let intervaTime = 20 // 4 * config.speed
      // 初始化南瓜重量
      const rules = [1, 3, 5, 10]
      let pumpkinNum = weightRules[getRandom(0, (weightRules.length - 1))]
      let pumpkinWeights = []
      pumpkinNum.forEach((d, i) => {
        if (d > 0) {
          for (let j = 0; j < d; j++) {
            pumpkinWeights = [...pumpkinWeights, rules[i]]
          }
        }
      })
      pumpkinWeights.sort(_ => {
        return 0.5 - Math.random()
      })
      console.log('pumpkinNum', pumpkinNum)
      console.log('pumpkinWeights', pumpkinWeights)
      this.timer = setInterval(() => {
        // 是否添加捣蛋鬼
        if (config.duration - this.duration === this.produceTroubleTime.time) {
          let newTrobles = []
          for (let i = 0; i < this.produceTroubleTime.num; i++) {
            newTrobles = [...newTrobles, {
              type: config.troublemaker,
              left: this.width + getRandom(0, 200),
              top: getRandom(config.top, this.height - config.bottom),
              speed: getRandom(config.speed - 3 + config.difficulty, config.speed - 2 + config.difficulty),
              direction: getRandom(0, 1) === 0 ? 'up' : 'down'
            }]
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
          let loc = 0
          let dropNum = 0
          if (maxVal < pumpkinWeights.length) {
            loc = 2
            dropNum = getRandom(0, 2)
          } else {
            loc = 1
            dropNum = getRandom(0, 3)
          }
          --maxVal
          let newPumpkinWeight = pumpkinWeights.splice(0, loc)
          for (var i = 0; i < dropNum; i++) {
            newPumpkinWeight.push(0)
          }
          this.tatal += dropNum
          // console.log('this.tatal', this.tatal)
          let newPumpkins = []
          for (let i = 0; i < newPumpkinWeight.length; i++) {
            newPumpkins = [...newPumpkins, {
              type: config.pumpkin,
              left: getRandom(0, (this.width - 100)),
              top: getRandom(-100, -50),
              speed: getRandom(config.speed - 1 + config.difficulty, config.speed + config.difficulty),
              weight: newPumpkinWeight[i]
            }]
          }
          this.pumpkins.push(...newPumpkins)
          this.gapT = config.gapTime
        }
        // 倒计时1分钟
        this.duration -= intervaTime
        if (this.duration < 0) {
          // this.start()
          console.log('%c 最后剩余的南瓜重量', 'color: red', pumpkinWeights)
          this.status = false
          clearInterval(this.timer)
        }
      }, intervaTime)
    },
    game () {
      this.pumpkins.forEach((d, index) => {
        if (d.type === config.pumpkin) {
          d.top += d.speed
          if (d.top > (this.height - config.bottom)) {
            this.pumpkins.splice(index, 1)
          }
        } else if (d.type === config.troublemaker) {
          d.left -= d.speed
          let top = d.top + (d.direction === 'up' ? -getRandom(0, 2) : getRandom(0, 2))
          d.top = top < config.top
            ? config.top
            : top > this.height - config.bottom
              ? this.height - config.bottom
              : top
          if (d.left < -50) {
            this.pumpkins.splice(index, 1)
          }
        }
      })
    },
    gainPumpkin (p, index) {
      console.log(p, index)
      if (p.type === config.pumpkin && this.status) {
        this.weight += p.weight
        this.pumpkins.splice(index, 1)
      } else {
        this.status = false
        clearInterval(this.timer)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.game {
  position: relative;
  background-image: url(../assets/bg.jpeg);
  background-size: cover;
  background-repeat: no-repeat;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
}
/* todo 测试按钮 */
.start-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 80px;
  height: 20px;
  line-height: 20px;
  background: #fff;
  color: #000;
  font-size: 14px;
  text-align: center;
  border-radius: 10px;
}
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
.round {
  position: absolute;
  width: 50px;
  height: 50px;
  background-image: url(../assets/pumpkin1.png);
  background-size: cover;
  background-repeat: no-repeat;
  border-radius: 50%;
  color: #00f;
  font-size: 20px;
  font-weight: 600;
  text-align: center;
  line-height: 50px;
}
.pumpkin {
  background-image: url(../assets/pumpkin1.png);
  z-index: 10;
}
.troublemaker {
  background-color: rgba(255, 255, 255, 0.5);
  background-image: url(../assets/witch_left.png);
  width: 75px;
  height: 75px;
  z-index: 20;
}
.progress-bar-wrapper {
  position: absolute;
  bottom: 50px;
  left: 10%;
  width: 80%;
  height: 5px;
  background: #fff;
}
.progress-bar {
  background: orange;
  height: 100%;
}
</style>
