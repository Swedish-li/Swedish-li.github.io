---
title: '用五个实例来讲解 CSS 变量（译文）'
date: 2020-09-28
tags:
  - css
location: Toykyo
---

原文：[CSS Variables explained with 5 examples](https://codeburst.io/css-variables-explained-with-5-examples-84adaffaa5bd)<br>

这篇文章的目的是像你展示原生的 css 变量是如何工作的，以及它如何让你的开发工作更加轻松。当你的 web 应用变得庞大同时，css 也在变得庞大，在很多地方产生冗余的代码，变得杂乱。在一个良好的上下文环境下使用 **CSS 变量**,可以让你拥有一个更加容易修改既存的 CSS 属性的机制。

<!-- more -->

在 "纯净的" CSS 中使用变量之前，我们需要使用预处理器来支持它。但是这需要我们在使用 CSS 之前进行编译工作，因此（有些时候）这为我们的工作添加了一层复杂度。

## 如何定义和使用 CSS 变量（也被称作自定义属性）

让我们从一些你已经很熟悉的东西开始：在 JavaScript 中使用变量。

为了定义一个简单的变量你需要写出下面类似的代码：

```javascript
let myColor = 'green'
```

在你声明一个 CSS 变量时你需要在变量名前加上两个破折号。

```css
body {
  --english-green-color: #1b4d3e;
}
```

当我们需要使用 CSS 变量值的时候，我们可以使用 `var(...)` 函数。

```css
.my-green-component {
  background-color: var(--english-green-color);
}
```

将你的 **CSS 变量** 声明在 `:root` 伪类中是一个管理它们的一个最简单方法。事实上 CSS 变量遵守其它任何 CSS 定义的规则，将它们放在 `:root` 下可以确保所有的 CSS 选择器都可以访问这些变量。

```css
:root {
  --english-green-color: #1b4d3e;
}
```

## 浏览器对 CSS 变量的支持

浏览器对 CSS 变量的支持一点也不差。如果你取查看 [ Can I Use CSS Variables](https://caniuse.com/css-variables),无论在移动端还是桌面端，主流的浏览器都对 CSS 变量提供了开箱即用的支持。

你可以小心的为一些还在使用 IE 的用户提供一个备用方案。

## 让我们来构建一些实例！

现在，让我们看看如何咋实践中使用 CSS 变量。

### 示例 1 — 管理颜色

目前为止，在你的设计中使用 CSS 变量来定义颜色是 CSS 变量的最佳应用之一。我们可以把设计中颜色放到这些变量中，这样我们就不需要重复的拷贝和粘贴它们。如果有人让我们更新一个特定绿色阴影或者把所有红颜色的按钮改成蓝色，我们只需要改变 CSS 变量的值就可以了。你不需要搜索和替换所有已经存在的颜色。

<iframe width="100%" height="300" src="//jsfiddle.net/Swedish_li/L029f6mt/embedded/css,result,html/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

### 示例 2 — 去除重复代码

通常，你需要构建一些不同组件的变体。相同的基础样式，只有恨少的不同。让我们用一些拥有不同颜色的按钮的案例来演示。

典型的解决方案是创建一个基础的类（class），例如 `.btn`, 然后在添加变体的类。

```css
.btn {
  border: 2px solid black;
  // more props here
}
.btn:hover {
  background: black;
  // more props here
}
.btn.red {
  border-color: red;
}
.btn.red:hover {
  background: red;
}
```

然后像下面这样使用它们：

```css
<button class="btn">Hello</button>
<button class="btn red">Hello</button>
```

然而这会带来一些重复的代码。在变体类 `.red` 我们必须同时设定边框颜色和背景颜色。

CSS 变量可以轻松的解决这个问题。

```css
.btn {
  border: 2px solid var(--color, black);
}
.btn:hover {
  background: var(--color, black);
}
.btn.red {
  --color: red;
}
```

<iframe width="100%" height="300" src="//jsfiddle.net/Swedish_li/pzxbj1vf/embedded/css,result,html/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

### 示例 3 — 让一些属性更容易阅读

CSS 变量非常适合为一些复杂的属性创建快捷的使用方式，这样我们就不需要取记住它们。

在 CSS 属性中拥有多个参数的 CSS 规则是很好的例子，例如 `box-shadow`, `tansform`, `font` 等。

我们可以把这些属性的值放到变量中，这样我们就可以用更容易阅读的格式来使用它。

<iframe width="100%" height="300" src="//jsfiddle.net/Swedish_li/g53cmL8q/embedded/css,result,html/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

### 示例 4 — 变量的层叠

标注的层叠规则同样可以应用于 CSS 变量。

因此，如果自定义属性被多次定义，底层的定义的 CSS 将覆盖上层的定义。

下面的示例展示了如何简单的根据用户的操作动态的改变属性，同时保证代码的清晰和简洁。

<iframe width="100%" height="300" src="//jsfiddle.net/Swedish_li/g13bL5dm/embedded/css,result,html/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

### 示例 5 — 使用 CSS 变量来切换主题

CSS 的一个很棒的特性是它可以对环境的变化产生响应。当你更新它们时，任何拥有这个 CSS 变量的属性都会同时获得到这个变量的更新。所以我们只需要几行的 JavaScript 和一些巧妙的 CSS 变量的使用我们就可以创造一个主题系统。

<iframe width="100%" height="300" src="//jsfiddle.net/Swedish_li/ghn73xaL/embedded/css,result,js,html/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

## 关于 CSS 变量的额外提示

就像 CSS 中的几乎所有属性一样，变量时相当直接和易于使用的。下面有一些提示没有被这些示例包含，但是在特定的情景下仍然很有用:

1. 注意大小写，CSS 变量时大小写敏感的。

```css
:root {
  --color: blue;
  --COLOR: red;
}
/*--color and --COLOR are two different variables*/
```

2. 当你使用 `var()` 函数时你可以传入第二个参数。在没有发现自定义属性的时候这个值将被使用

```css
width: var(--custom-width, 33%);
```

3. 你可以直接在 HTML 中使用 CSS 变量

```html
<!--HTML-->
<html style="--size: 600px">
  body { max-width: var(--size) }
</html>
```

4. 你可以在一个 CSS 变量中包含其它 CSS 变量:

```css
:root {
  --base-red-color: #f00;
  --background-gradient: linear-gradient(to top, var(--base-red-color), #222);
}
```

5. 可以使用媒体查询来创建变量。下面的例子根据屏幕的大小来改变变量 `--padding` 的值。

```css
:root {
  --padding: 15px;
}

@media screen and (min-width: 750px) {
  --padding: 30px;
}
```

6. 不要害怕在 `calc()` 函数中使用 CSS 变量

```css
--text-input-width: 5000px;
max-width: calc(var(--text-input-width) / 2);
```

CSS 变量不是银弹。它没有办法解决你在 CSS 领域的所有问题。不管怎样，你都可以快速的看到它让你的代码更容易阅读和维护。

同时，它也让我们贯穿一个很大文档的修改变得更加容易。只要将所有的常量定义在一个单独的文件里，当你只想修改变量的时候，你就不需要跨过数千行的代码取寻找它。

所以，你还在等什么？快去尝试它吧，记得向我分享你的想法！
