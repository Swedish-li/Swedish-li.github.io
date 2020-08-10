---
title: "在 Vuepress 中使用 Katex"
date: 2020-8-9
tags:
  - katex
  - markdown
  - vuepress
author: Swedish li
location: Toykyo
toc: true
---

记录如何在 Vuepress 中配置 katex 的使用和 Katex 的基本使用方式

<!-- more -->

## Vuepress 中的 Katex 配置

添加 markdown-it 插件依赖

```bash
yarn add @swedish-li/markdown-it-katex
```

添加 katex 依赖

```bash
yarn add katex
```

在 config.js 中添加 [`@swedish-li/markdown-it-katex`][1] 配置

```javascript
module.exports = {
  ...
  markdown: {
    extendMarkdown: md => {
      md.set({ break: true})
      md.use(require('@swedish-li/markdown-it-katex'))
    }
  } 
  ...
}
```

在 index.styl 中导入 Katex 的样式

```css
@import '~katex/dist/katex.min.css'
```

## 在 Markdown 中使用 Latex

单行的 Latex 在两边加上 `$` 符号，多行的 Latex 需要在开头和结尾加上 `$$`

### 的单行 Latex 写法

```latex
$\sqrt{3x-1}+(1+x)^2$
```

渲染结果:

$\sqrt{3x-1}+(1+x)^2$

### 多行的 Latex 写法

```latex
$$\begin{alignedat}{5} 
P &\rarr Translate &\rarr P_T \\
V &\rarr Rotate &\rarr V_T
\end{alignedat}$$
```


渲染结果

$$\begin{alignedat}{2}
P &\rarr Translate &\rarr P_T \\
V &\rarr Rotate &\rarr V_T
\end{alignedat}$$


[1]: https://github.com/Swedish-li/markdown-it-katex