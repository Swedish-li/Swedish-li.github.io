<template>
  <div>
    <div class="article" v-for="page in files">
      <a v-bind:href="page.path">{{page.title}}</a>
      <div class="keywords">
        <span class="keyword" v-for="key in page.frontmatter.tags">{{key}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    files() {
      return this.$site.pages
        .filter(p => { 
          return p.path.indexOf('/pages/') >= 0;
        }).sort((p1,p2) => {
          const date1 = new Date(p1.frontmatter.date);
          const date2 = new Date(p2.frontmatter.date);
          return date1 > date2 ? -1 : 1;
        });
    }
  }
}
</script>

<style scoped>
  .article {
    margin-bottom: 20px;
    border-left: solid 5px #26c92e;
    padding: 20px;
  }
  .keywords {
    margin-top: 10px;
  }
  .keyword {
    padding: 5px;
    border-radius: 7px;
    font-size: small;
    background: #3e5caf;
    margin-right: 5px;
    color: white;
    font-weight: 500;
  }
</style>