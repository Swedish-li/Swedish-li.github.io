<template>
  <div class="container">
    <canvas id="c"></canvas>
    <div class="avatar">
      <img src="avatar.png" alt="リトルウィッチアカデミア" />
    </div>
    <div class="hello">
      Welcome to <a href="/blog/"><strong>Swedish-li's Blog</strong></a>
    </div>
  </div>
</template>

<style lang="stylus" scoped>
.container
  width 100%
  height 500px;
  display flex
  justify-content center
  align-items center
  flex-flow column
  color white
  .hello {
    font-size 30px
    padding 1rem
  }
  .avatar
    width 16rem
  .avatar>img
    border-radius 50%
    width 100%
</style>

<script>

console.log("home-----------------")

export default {
  data() {
    return {}
  },
  mounted() {
  
  },
  methods: {}
}
</script>
