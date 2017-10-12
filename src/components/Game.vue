<template>
  <div class="game" ref="game">
    <div
      v-for="(pumpkin, index) in pumpkins"
      :key="index"
      class="round"
      :style="{
        left: pumpkin.left + 'px',
        top: pumpkin.top + 'px'
      }"
      @click="gainPumpkin(pumpkin, index)"
    ></div>
  </div>
</template>

<script>
import { getRandom } from '@/util'
export default {
  name: 'game',
  data () {
    return {
      msg: 'Welcome to game demo',
      width: 0,
      height: 0,
      timer: null,
      duration: 60000,
      gapTime: 800,
      gapT: 800,
      pumpkins: [
        {
          left: 30,
          top: -50
        }
      ]
    }
  },
  mounted () {
    let wrapper = this.$refs.game
    this.width = wrapper.offsetWidth
    this.height = wrapper.offsetHeight
    console.log(this.width - 100)
    this.start()
  },
  methods: {
    start () {
      this.timer = setTimeout(() => {
        this.game()
        this.duration -= 20
        if (this.duration > 0) {
          this.start()
        }
        this.gapT -= 20
        if (this.gapT <= 0) {
          this.pumpkins.push({
            left: getRandom(0, (this.width - 100)),
            top: -50
          })
          this.gapT = this.gapTime
        }
      }, 20)
    },
    game () {
      this.pumpkins.forEach((d, index) => {
        d.top += 5
        if (d.top > this.height) {
          this.pumpkins.splice(index, 1)
        }
      })
    },
    gainPumpkin (p, index) {
      console.log(p, index)
      this.pumpkins.splice(index, 1)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.game {
  position: relative;
  background-color: #ddd;
  width: 100%;
  height: 100%;
}
.round {
  position: absolute;
  width: 50px;
  height: 50px;
  background-color: green;
  border-radius: 50%;
}
</style>
