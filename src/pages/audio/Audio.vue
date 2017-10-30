<template>
  <div class="audio">
    <div class="audio-head">{{msg}}</div>
  </div>
</template>

<script>
export default {
  name: 'demo',
  data () {
    return {
      msg: '音频测试组件'
    }
  },
  methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  .audio-head {
    text-align: center;
    margin: 0 0 20px 0;
  }
</style>
