<template>
  <div class="home">
    <canvas ref="game"></canvas>
    <div class="btns">
      <button class="init" @click="init()">初始化</button>
      <button class="start" @click="start()">开始</button>
    </div>
  </div>
</template>

<script>
import Halloween from '@/game/halloween'
export default {
  name: 'home',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      game: null
    }
  },
  mounted () {
    let canvas = this.$refs.game
    this.game = new Halloween(canvas)
  },
  methods: {
    init () {
      this.game.init()
    },
    start () {
      this.game.gameStart()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less' scoped>
.home {
  background: #ddd;
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  z-index: 1;
}
.btns {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 40px;
  z-index: 2;
  button {
    background: #fff;
    border: none;
    border-radius: 5px;
    color: #000;
    font-size: 16px;
    margin: 0 20px;
    padding: 0 10px;
  }
}
</style>
