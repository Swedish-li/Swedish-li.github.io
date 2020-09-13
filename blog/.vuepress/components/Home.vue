<template>
 <div class="container">
   <div class="avatar">
     <img src="avatar.png" alt="リトルウィッチアカデミア">
   </div>
   <div class="hello">Welcome to <strong>Swedish-li's Blog</strong></div>
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
  .hello {
    font-size 30px
    padding 1rem
  }
  .avatar>img
    border-radius 50%
    width 100%



</style>

<script>


export default {
  data() {
    return {
      
    }
  },
  methods: {
  
  }
}
</script>
