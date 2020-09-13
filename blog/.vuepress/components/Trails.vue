<template>
  <canvas ref="cRef"></canvas>
</template>

<style lang="stylus" scoped>
canvas {
  display: block;
  height: 100%;
  left: 0;
  margin: 0;
  padding: 0;
  position: absolute;
  top: 0;
  width: 100%
  background: #000;
  z-index -100

}
</style>

<script>
import OrbTrails from './trails'

export default {
  mounted() {
    try {
      new OrbTrails(this.$refs.cRef).init()
    } catch (error) {
      console.error(error)
    }
  }
}
</script>
