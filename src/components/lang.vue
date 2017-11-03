<template>
  <div class="lang">
    <audio ref="lang" controls autoplay>
      <!-- <source src="../assets/audio/test.mp3" type="audio/mpeg"> -->
      <source src="../assets/audio/002.wav" type="audio/wav">
    </audio>
  </div>
</template>

<script>
export default {
  name: 'lang',
  data () {
    return {
      msg: '音频组件'
    }
  },
  mounted () {
    this.play()
    let _this = this
    document.addEventListener('WeixinJSBridgeReady', function () {
      alert('weixin')
      _this.play()
    })
  },
  methods: {
    play () {
      this.$refs.lang.play()
    },
    pause () {
      this.$refs.lang.pause()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  .lang {
    text-align: center;
  }
</style>
