<template>
  <div class="home">
    <canvas ref="game"></canvas>
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
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.home {
  width: 100%;
  height: 100%;
}
</style>
