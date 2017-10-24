<template>
  <div class="demo">
    <pumpkinGame ref='game' :lists="lists" :level="level" @updateWeight="updateWeight" @gameOver="gameOver"></pumpkinGame>
    <!-- <div class="countdown">倒计时：{{countdown}}</div> -->
    <div class="progress-bar-wrapper">
      获得南瓜重量：{{weight}}g
    </div>
    <div class='test-btns'>
      <button v-for="(btn, index) in btns" @click="start(index)" :key="index">{{btn}}</button>
    </div>
  </div>
</template>

<script>
import { getRandom, weightRules } from '@/game/config_dom.js'
import pumpkinGame from '@/components/pumpkin-game'
export default {
  name: 'demo',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      lists: [...weightRules[getRandom(0, (weightRules.length - 1))]],
      countdown: 0,
      weight: 0,
      btns: ['开始'],
      level: 0
    }
  },
  components: {
    pumpkinGame
  },
  methods: {
    start (level) {
      console.log('level', level)
      // this.level = level
      this.weight = 0
      this.$refs.game.gameStart()
    },
    gameOver (data) {
      // let status = ['时间到，', '碰到女巫，', '碰到幽灵，', '碰到蝙蝠，']
      console.log('游戏结束', data)
      setTimeout(_ => {
        this.level = getRandom(1, 2)
        this.lists = [...weightRules[getRandom(0, (weightRules.length - 1))]]
      }, 5000)
      // alert(status[data.endStatus] + '游戏结束!' + '获得重量' + data.weight + 'g')
    },
    updateWeight (weight) {
      // console.log('%c 新增重量', 'color: red', weight)
      this.weight += weight
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.demo {
  position: relative;
  width: 100%;
  height: 100%;
}
.progress-bar-wrapper {
  position: absolute;
  bottom: 50px;
  left: 10%;
  width: 80%;
  color: #fff;
  z-index: 100;
}
// todo => 测试
.test-btns {
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  height: 30px;
  z-index: 100;
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
