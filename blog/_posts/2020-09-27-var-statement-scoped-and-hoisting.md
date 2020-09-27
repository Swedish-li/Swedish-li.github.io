---
title: 'var 声明语句的作用域和声明提升'
date: 2020-9-27
tags:
  - JavaScript
location: Toykyo
---

由于在 JavaScript 中使用 `var` 声明的变量不存在块级作用域，并且存在变量声明提升(hoisting)，所以在 JavaScript 中如果不谨慎的使用这些变量，可能会产生一些看上去没问题，但实际行为却很怪异的代码。

<!-- more -->

下边的代码对于不熟悉用 `var` 关键字声明变量的人来说，应该会觉得没有问题。

```javascript
for (var i = 0; i < 5; i++) {
  var j = i
  setTimeout(function() {
    console.log(j)
  }, 100)
}
```

这段代码的初始意图是延迟 100 毫秒在控制台输出 0 到 4 的 5 个数字，但实际情况确实重复的输出了 5 次 4！为什么会这样呢？熟悉 java 的人可能会觉得 j 的作用域在 for 循环的大括号之间 `console.log` 输出的每个变量应该都是不同的变量，但实际的情况并不是这样。

## 问题产生原因

产生这个现象的原因有两个：

1. 使用 `var` 声明的变量只存在函数作用域和全局作用域，不存在块级作用域。
2. 使用 `var` 声明的变量会将变量的声明提升到作用域的最顶端。

由于使用 `var` 声明的变量不存在块级作用域，在 for 循环中使用 `var` 声明的变量的实际作用域在 for 循环之外。加之 `var` 声明的变量存在变量提升(hoisting),所以在代码的实际执行过程中变量 `j` 的声明会提升到 for 循环之外的作用域的最顶端执行声明。也就是说 `j` 这个变量在运行期是一个声明在 for 循环之外的一个变量，所以在使用 `setTimeout` 延迟执行其内部匿名函数时所输出的变量 `j` 都是在这个作用域的同一个变量 `j`。因此这里控制台输出 5 个 4 是一个正常的行为。

## 解决方案

### 1. 为变量 `j` 创建函数作用域

在只能用 `var` 来声明变量的前提下我们可以将变量 `j` 的声明放到一个函数里，来为变量 `j` 创造一个块级作用域。

```javascript
function func(i) {
  var j = i
  setTimeout(function() {
    console.log(j)
  }, 100)
}

for (var i = 0; i < 5; i++) {
  func(i)
}
```

### 2. 使用 `let`, `const` 创建块级作用域

当我们可以使用更新的语言特性的时候，我们可以使用 `let` 或 `const` 来为变量 j 在 for 循环值会的大括号之内创建一个块级作用域。

```javascript
for (let i = 0; i < 5; i++) {
  const j = i
  setTimeout(function() {
    console.log(j)
  }, 100)
}
```

## 相关链接

[var statement [mdn]](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var)
[JavaScript Scope and Closures](https://css-tricks.com/javascript-scope-closures/)