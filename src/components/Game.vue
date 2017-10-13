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
    ></div>
    <div class="countdown">倒计时：{{countdown}}</div>
  </div>
</template>

<script>
import { getRandom } from '@/util'
import { config, troublemaker } from '@/game/config_dom.js'
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
      gapTime: 800,
      gapT: 800,
      pumpkins: [],
      produceTroubleTimes: troublemaker(),
      tatal: 0
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
    }
  },
  mounted () {
    let wrapper = this.$refs.game
    this.width = wrapper.offsetWidth
    this.height = wrapper.offsetHeight
    this.produceTroubleTime = this.produceTroubleTimes.shift()
    this.start()
  },
  methods: {
    start () {
      this.status = true
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
        this.gapT -= 20
        if (this.gapT <= 0) {
          let dropNum = getRandom(1, 4)
          this.tatal += dropNum
          // console.log('this.tatal', this.tatal)
          let newPumpkins = []
          for (let i = 0; i < dropNum; i++) {
            newPumpkins = [...newPumpkins, {
              type: config.pumpkin,
              left: getRandom(0, (this.width - 100)),
              top: getRandom(-100, -50),
              speed: getRandom(config.speed - 1 + config.difficulty, config.speed + config.difficulty)
            }]
          }
          this.pumpkins.push(...newPumpkins)
          this.gapT = this.gapTime
        }
        // 倒计时1分钟
        this.duration -= 20
        if (this.duration < 0) {
          // this.start()
          this.status = false
          clearInterval(this.timer)
        }
      }, 20)
    },
    game () {
      this.pumpkins.forEach((d, index) => {
        if (d.type === config.pumpkin) {
          d.top += d.speed
          if (d.top > (this.height - config.bottom)) {
            this.pumpkins.splice(index, 1)
          }
        } else if (d.type === config.troublemaker) {
          console.log('=====...')
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
      if (p.type === config.pumpkin) {
        this.status && this.pumpkins.splice(index, 1)
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
  z-index: 1;
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
</style>
