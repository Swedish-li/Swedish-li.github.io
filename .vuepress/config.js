module.exports = {
  title: "Swedish-li's blog",
  description: "just My Blog",
  plugins: ["@vuepress/blog"],
  head: [["link", { rel: "icon", href: "/favicon.ico" }]],
  markdown: {
    lineNumbers: true,
  },
  themeConfig: {
    logo: '/avatar.png',
  }
};
