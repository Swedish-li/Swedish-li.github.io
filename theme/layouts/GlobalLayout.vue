<template>
  <div id="vuepress-theme-blog__global-layout">
    <Header />
    <MobileHeader
      :is-open="isMobileHeaderOpen"
      @toggle-sidebar="isMobileHeaderOpen = !isMobileHeaderOpen"
    />
    <div class="content-wrapper" @click="isMobileHeaderOpen = false">
      <DefaultGlobalLayout />
    </div>
    <Footer />
  </div>
</template>

<script>
import GlobalLayout from '@app/components/GlobalLayout.vue'
import Header from '@theme/components/Header.vue'
import MobileHeader from '@theme/components/MobileHeader.vue'
import Footer from '@theme/components/Footer.vue'

export default {
  components: {
    DefaultGlobalLayout: GlobalLayout,
    Header,
    MobileHeader,
    Footer,
  },

  data() {
    return {
      isMobileHeaderOpen: false,
    }
  },

  mounted() {
    this.$router.afterEach(() => {
      this.isMobileHeaderOpen = false
    })
  },
}
</script>

<style lang="stylus">
#vuepress-theme-blog__global-layout {
  word-wrap: break-word;
}

$wrapperPaddingTop = $headerHeight + 3rem
$stickerWidth = 16rem

.content-wrapper {
  padding: $wrapperPaddingTop 15px 80px 15px;
  min-height: calc(100vh - 80px - 60px - 160px);
  max-width: $contentWidth;
  margin: 0 16rem 0 5rem;

  @media (min-width: 1440px) {
    margin: 0 auto;
  }

  // @media (min-width : 1440px){
  //   margin-right: $stickerWidth ;
  // }

  @media (max-width: $MQMobile) {
    // margin: 0 auto;
    & {
      margin: 0 5rem 0 5rem;
      padding: 100px 15px 20px 15px;
      min-height: calc(100vh - 20px - 60px - 100px);
    }
  }
}
</style>
