<template>
  <div class="demo">
    <Game ref='game' :lists="lists" @gameOver="gameOver"></Game>
  </div>
</template>

<script>
import Game from '@/components/Game'
export default {
  name: 'demo',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      lists: [55, 15, 12, 4]
    }
  },
  mounted () {
    // this.$refs.game.gameStart()
  },
  components: {
    Game
  },
  methods: {
    gameOver (data) {
      console.log('游戏结束', data)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.demo {
  width: 100%;
  height: 100%;
}
</style>
