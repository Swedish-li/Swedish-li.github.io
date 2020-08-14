module.exports = {
  title: "Swedish-li's blog",
  description: 'just My Blog',
  theme: require.resolve('../../theme'),
  head: [['link', { rel: 'icon', href: '/favicon.ico' }]],
  markdown: {
    lineNumbers: true,
    extendMarkdown: md => {
      md.set({ breaks: true })
      md.use(require('@swedish-li/markdown-it-katex'), {
        throwOnError: true,
        errorColor: ' #cc0000'
      })
    }
  },
  themeConfig: {
    logo: '/avatar.png',
    sidebar: 'auto',
    author: 'Swedish li',
    toc: true,
    dateFormat: 'YYYY年MM月DD日',
    nav: [
      {
        text: '首页',
        link: '/'
      },
      {
        text: '标签',
        link: '/tag/'
      }
    ],
    footer: {
      contact: [
        {
          type: 'github',
          link: 'https://github.com/Swedish-li'
        }
      ],
      copyright: [
        {
          text: 'Privacy Policy',
          link: 'https://policies.google.com/privacy?hl=en-US'
        },
        {
          text: 'MIT Licensed | Copyright © 2018-present Swedish-li',
          link: ''
        }
      ]
    }
  }
}
