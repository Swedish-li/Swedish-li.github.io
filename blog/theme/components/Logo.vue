<template>
  <img
    v-if="$site.themeConfig.logo"
    class="logo"
    :src="$withBase($site.themeConfig.logo)"
    :alt="$siteTitle"
  />
</template>

<style lang="stylus" scoped>
.logo {
  height: $headerHeight - 2rem;
  min-width: $headerHeight - 2rem;
  margin-right: 0.8rem;
  vertical-align: top;
}
</style>