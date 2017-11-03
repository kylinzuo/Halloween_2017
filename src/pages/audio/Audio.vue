<template>
  <div class="audio">
    <div class="audio-head">{{msg}}</div>
    <Lang ref="audio"></Lang>
    <div class="btns">
      <button @click="play()">play</button>
      <button @click="pause()">pause</button>
    </div>
  </div>
</template>

<script>
import Lang from '@/components/lang'
export default {
  name: 'demo',
  data () {
    return {
      msg: '音频测试组件'
    }
  },
  components: {
    Lang
  },
  methods: {
    play () {
      this.$refs.audio.play()
    },
    pause () {
      this.$refs.audio.pause()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  .audio-head {
    text-align: center;
    margin: 0 0 20px 0;
  }
  .btns {
    margin-top: 50px;
    text-align: center;
    button {
      background: #909090;
      border: none;
      border-radius: 5px;
      color: #fff;
      font-size: 16px;
      margin: 0 20px;
      padding: 10px;
    }
  }
</style>
