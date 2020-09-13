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
  plugins: [
    [
      '@vuepress/google-analytics',
      {
        ga: 'UA-175472777-1' // UA-00000000-0
      }
    ]
  ],
  themeConfig: {
    logo: '/avatar.png',
    sidebar: 'auto',
    author: 'Swedish li',
    toc: true,
    dateFormat: 'YYYY年MM月DD日',
    directories: [
      {
        id: 'post',
        dirname: '_posts',
        path: '/blog/'
      }
    ],
    frontmatters: [
      {
        id: 'tag',
        keys: ['tags'],
        path: '/tag/'
      }
    ],
    nav: [
      {
        text: '博客',
        link: '/blog/'
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
