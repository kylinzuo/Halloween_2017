<template>
  <div
    class="game"
    ref="game"
    :class="[background]"
    @touchmove.prevent
  >
    <div
      v-for="(pumpkin, index) in pumpkins"
      :key="index"
      v-if="pumpkin.status"
      class="round"
      :class="[pumpkin.category.en]"
      :style="{
        left: pumpkin.left + 'px',
        top: pumpkin.top + 'px',
        transform: 'rotate(' + pumpkin.rotate + 'deg)'
      }"
      @click="gainPumpkin(pumpkin, index)"
    >
      <span :style="{opacity: pumpkin.show ? 1 : 0}"></span>
    </div>
    <div class="countdown">倒计时：{{countdown}}</div>
    <div class="progress-bar-wrapper">
      获得南瓜重量：{{weight}}g
    </div>
    <div class='test-btns'>
      <button v-for="(btn, index) in btns" @click="start(index)">{{btn}}</button>
    </div>
  </div>
</template>

<script>
/**
 * @param {[number]} lists 南瓜重量分布规则 => [50, 10, 20, 2]
 * @param {@} updateWeight 自定义事件 => 实现反馈获得的南瓜重量
 * @param {@} gameOver 自定义事件 => 游戏结束后反馈结果
 */
import { getRandom } from '@/util'
import { config, troublemaker, weightRules } from '@/game/config_dom.js'
export default {
  name: 'game',
  props: {
    lists: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      btns: ['速度1', '速度2', '速度3', '速度4'],
      background: config.backgrounds[0],
      isFirst: true,
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
      endStatus: {} // status 0-游戏时间到，正常结束   1-碰到捣蛋元素提前结束
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
    // 初始界面需要有两个南瓜
    this.pumpkinWeights = this.initWeight()
    this.pumpkins = this.addNewPumpkins(this.pumpkinWeights.splice(0, getRandom(2, 3)), 4, true)
    console.log('config', config)
  },
  methods: {
    start (level) {
      this.gameStart(level)
    },
    gameOver () {
      this.duration = 0
      this.$emit('gameOver', {
        weight: this.weight,
        counts: [...this.counts],
        endStatus: {...this.endStatus}
      })
      // 切换背景
      // let bgIndex = getRandom(0, 1)
      // this.background = config.backgrounds[bgIndex]
    },
    /**
     * 启动游戏
     * @param {level} value 游戏难度 0-简单 1-中等 2-困难 3-最难 默认中等难度
     */
    gameStart (level) {
      let difficulty = level !== undefined ? level : config.difficulty
      let speed = config.speed[difficulty]
      let gapTime = config.gapTime[difficulty]
      console.log('====', speed, gapTime)
      // 初始化游戏状态
      this.status = true
      this.duration = config.duration
      this.gapT = gapTime
      this.weight = 0
      this.counts = [0, 0, 0, 0, 0]
      this.endStatus = {}
      this.pumpkins = this.isFirst ? this.pumpkins : []
      this.produceTroubleTimes = troublemaker(difficulty - 1)
      this.produceTroubleTime = this.produceTroubleTimes.shift()
      // 最大掉落南瓜次数
      let maxVal = Math.floor((config.duration / 1000 - 2) / (gapTime / 1000))
      clearInterval(this.timer)
      let intervaTime = 20
      // 初始化南瓜重量
      let pumpkinWeights = this.isFirst ? [...this.pumpkinWeights] : this.initWeight()
      this.isFirst = false
      this.timer = setInterval(() => {
        // 是否添加捣蛋鬼
        if (config.duration - this.duration === this.produceTroubleTime.time) {
          let newTrobles = []
          for (let i = 0; i < this.produceTroubleTime.num; i++) {
            let category = {...config.troublemakers[getRandom(0, 7)]}
            console.log('category', category)
            // 捣蛋元素x轴位置
            let leftLoc = [getRandom(-200, -75), (this.width + getRandom(0, 200))]
            let left = leftLoc[['right', 'left'].indexOf(category.direction)]
            let speed = [-1, 1][['left', 'right'].indexOf(category.direction)] * getRandom(1, 3)
            let direction = getRandom(0, 1) === 0 ? 'up' : 'down'
            let rotate = category.en === 'bat'
              ? category.direction === 'left'
                ? direction === 'up'
                  ? 135
                  : 45
                : direction === 'up'
                  ? -135
                  : -45
              : 0
            console.log('left', left, speed)
            newTrobles = [...newTrobles, {
              status: true,
              category: category,
              left: left,
              top: getRandom(config.top, this.height - config.bottom),
              rotate: rotate,
              speed: speed,
              direction: direction
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
          if (maxVal < Math.ceil(pumpkinWeights.length / 2)) {
            loc = 3
            dropNum = getRandom(0, 1)
          } else if (maxVal < pumpkinWeights.length) {
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
          let newPumpkins = this.addNewPumpkins(newPumpkinWeight, speed)
          this.pumpkins.push(...newPumpkins)
          this.gapT = gapTime
        }
        // 倒计时1分钟
        this.duration -= intervaTime
        if (this.duration < 0) {
          // this.start()
          console.log('%c 最后剩余的南瓜重量', 'color: red', pumpkinWeights)
          this.status = false
          clearInterval(this.timer)
          // 游戏结束将结果反馈回父组件
          this.endStatus = {
            status: 0
          }
          this.gameOver()
        }
      }, intervaTime)
    },
    initWeight () {
      const rules = [1, 3, 5, 10]
      let pumpkinNum = this.lists.length <= 4 ? this.lists : weightRules[getRandom(0, (weightRules.length - 1))]
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
      return pumpkinWeights
    },
    addNewPumpkins (newPumpkinWeight, speed, isFirst) {
      let newPumpkins = []
      for (let i = 0; i < newPumpkinWeight.length; i++) {
        let weight = newPumpkinWeight[i]
        newPumpkins = [...newPumpkins, {
          status: true,
          category: {...config.pumpkins[[0, 1, 3, 5, 10].indexOf(weight)]},
          left: !isFirst ? getRandom(0, (this.width - 50)) : getRandom(50, (this.width - 50)),
          top: !isFirst ? getRandom(config.top - 100, config.top - 50) : getRandom(config.top + 150, config.top + 200),
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
        if (this.pumpkins[index].category.type === config.pumpkin) {
          this.pumpkins[index].top += this.pumpkins[index].speed
          if (this.pumpkins[index].top > (this.height - config.bottom)) {
            this.pumpkins[index].status = false
          }
        } else if (this.pumpkins[index].category.type === config.troublemaker) {
          this.pumpkins[index].left += this.pumpkins[index].speed
          let top = this.pumpkins[index].top + (this.pumpkins[index].direction === 'up' ? -getRandom(0, 2) : getRandom(0, 2))
          if (top < config.top) {
            this.pumpkins[index].direction = 'down'
          } else if (top > (this.height - config.bottom)) {
            this.pumpkins[index].direction = 'up'
          }
          this.pumpkins[index].top = top
          if ((this.pumpkins[index].category.direction === 'left' && this.pumpkins[index].left < -50) || (this.pumpkins[index].category.direction === 'right' && this.pumpkins[index].left > this.width)) {
            this.pumpkins[index].status = false
          }
        }
      }
    },
    gainPumpkin (p, index) {
      console.log(p, index)
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
        // 点击到了捣蛋鬼，游戏结束将结果反馈回父组件
        this.endStatus = {
          status: 1,
          type: p.category.cn
        }
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
  background-size: cover;
  background-repeat: no-repeat;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
}
.halloween-bg1 {
  background-image: url(../assets/halloween-bg1.png);
}
.halloween-bg2 {
  background-image: url(../assets/halloween-bg2.png);
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
.round {
  position: absolute;
  width: 65px;
  height: 65px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  border-radius: 50%;
  z-index: 10;
  span {
    pointer-events: none;
    display: block;
    width: inherit;
    height: inherit;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }
}
.pumpkin0g {
  background-image: url(../assets/pumpkin0g.png);
}
.pumpkin1g {
  background-image: url(../assets/pumpkin1g.png);
}
.pumpkin3g {
  background-image: url(../assets/pumpkin3g.png);
}
.pumpkin5g {
  background-image: url(../assets/pumpkin5g.png);
}
.pumpkin10g {
  background-size: contain;
  background-image: url(../assets/pumpkin10g.png);
  width: 100px;
}
.pumpkin0g-score {
  span {
    background-image: url(../assets/weight0g.png);
  }
}
.pumpkin1g-score {
  span {
    background-image: url(../assets/weight1g.png);
  }
}
.pumpkin3g-score {
  span {
    background-image: url(../assets/weight3g.png);
  }
}
.pumpkin5g-score {
  span {
    background-image: url(../assets/weight5g.png);
  }
}
.pumpkin10g-score {
  span {
    background-image: url(../assets/weight10g.png);
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
  background-image: url(../assets/witch_tl.png);
}
.witch_tr {
  .troublemaker;
  background-size: 90%;
  background-image: url(../assets/witch_tr.png);
}
.bat {
  .troublemaker;
  background-image: url(../assets/bat.png);
  height: 50px;
}
.ghost_tl {
  .troublemaker;
  background-image: url(../assets/ghost_tl.png);
  width: 65px;
  height: 65px;
}
.ghost_tr {
  .troublemaker;
  background-image: url(../assets/ghost_tr.png);
  width: 65px;
  height: 65px;
}
.ghostl_tl {
  .troublemaker;
  background-image: url(../assets/ghostl_tl.png);
  width: 45px;
  height: 45px;
}
.ghostl_tr {
  .troublemaker;
  background-image: url(../assets/ghostl_tr.png);
  width: 45px;
  height: 45px;
}
.progress-bar-wrapper {
  position: absolute;
  bottom: 50px;
  left: 10%;
  width: 80%;
  color: #fff;
}
// todo => 测试
.test-btns {
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  height: 30px;
  button {
    border: none;
    border-radius: 10px;
    background: #fff;
    color: #000;
    line-height: 30px;
    margin: 0 20px;
  }
}
</style>
