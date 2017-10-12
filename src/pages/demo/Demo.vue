<template>
  <div class="demo">
    <Game></Game>
  </div>
</template>

<script>
import Game from '@/components/Game'
export default {
  name: 'demo',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  mounted () {
    //
  },
  components: {
    Game
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
