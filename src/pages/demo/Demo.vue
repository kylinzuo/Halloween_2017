<template>
  <div class="demo">
    <Game ref='game' :lists="lists" @updateWeight="updateWeight" @gameOver="gameOver"></Game>
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
import Game from '@/components/Game'
export default {
  name: 'demo',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      lists: weightRules[getRandom(0, weightRules.length)],
      countdown: 0,
      weight: 0,
      btns: ['速度1', '速度2', '速度3', '速度4']
    }
  },
  mounted () {
    // this.$refs.game.gameStart()
  },
  components: {
    Game
  },
  methods: {
    start (level) {
      this.weight = 0
      this.$refs.game.gameStart(level)
    },
    gameOver (data) {
      // let status = ['时间到，', '碰到女巫，', '碰到幽灵，', '碰到蝙蝠，']
      console.log('游戏结束', data)
      this.lists = weightRules[getRandom(0, weightRules.length)]
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
