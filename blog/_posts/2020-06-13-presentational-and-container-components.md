---
title: 外观组件和容器组件（译文）
date: 2020-06-13
tags: 
  - JavaScript
  - Reactjs
  - Component
author: Swedish li
location: Toykyo
toc: true
---

原文：[Presentational and Container Components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)<br>

在开发一个 React 应用的时候，有一个简单的模式我发现它很有用。如果你已经在做[关于 React](https://reactjs.org/blog/2015/03/19/building-the-facebook-news-feed-with-relay.html)的开发有一段时间，你可能已经发现了它。[这篇文章](https://medium.com/@learnreact/container-components-c0e67432e005)很好的解释了它，但是我想补充一点。

<!-- more -->

> 更新于 2019 年： 我在很久之前写下了这篇文章,并且在此之后我的观点发生了演变。事实上，现在我不再建议你像这篇文章描述的一样进行组件拆分。如果这样的代码在你的代码库中已经很常见，不用担心，这个模式仍然很有用。但是我看到了很多在没有必要使用它的地方被教条主义狂热者强制使用。我觉得它很有用的原因是因为它可以帮助我将组件中的复杂的包含很多状态的逻辑和组件的其它部分分离。Hooks 可以让我在不做任何拆分就可以做到这些。这些文字因为历史的原因将完整保留，但是不要过于刻板的对待它。



如果将组件分这成两种类型，你会发现你的组件易于重用并且容易理解。我称它们为`容器（Container）组件`和`外观（Presentational）组件`，我也听到过其它类似的称呼，如`Fat`和`Skinny`，`Smart`和`Dumb`，`Stateful`和`Pure`,`Screens`和`Components`等。它们可能不完全相同，但是核心思想是一致的。

我的`外观（Presentational）`组件

- 关注组件的外观
- 内部可以包含容器组件或外观组件，并且通常包含一些属于自己的一些 DOM 结构和样式。
- 通常允许使用`this.props.children`去定义组件的包含元素
- 与应用的其它部分没有任何的依赖关系，例如 Flux 中的行为和存储。
- 不会去指定如何加载或修改应用内的数据
- 通过属性（Props）来接收上层组件传递过来的数据和回调函数
- 很少拥有它们自己的状态（当存在状态时，也仅是 UI 相关的状态）。
- 通常使用函数组件来实现它，除非这个组件需要状态，生命周期钩子，或者需要做一些性能上的优化
- 示例： Page, Sidebar, Story, UserInfo,List

我的`容器（Container）`组件

- 关注组件如何工作
- 可能会在内部同时包含容器组件和外观组件，但是通常不拥有它们自己的 DOM 结构，除了一些用作包裹容器的 div,并且从不拥有它们自己的样式。
- 为外观组件或其它容器组件提供数据和行为。
- 调用 Flux 中的行为，并将这些调用以回调函数的形式提供给外观容器。
- 通常是拥有状态的，因为它们倾向于充当一个数据源。
- 这些组件通常不需要手工维护，而是通过使用`高阶组件（HOC）`来生成这些组件。例如：React Redux 中的 connect(), Delay 中的 createContainer(), Flux Utils 中的 Container.create()。
- 示例：UserPage, FollowersSidebar, StoryContainer, FollowedUserList。

我把它们放在不同的文件夹中，以便更好的区分它们。

## 这种方法带来的优势

- 更好的关注点分离。使用这种方式开发的组件可以让你更好的理解你的应用和应用的外观。
- 更好的代码复用。你可以在相同的外观组件使用完全不同的状态源，并生成独立的容器组件。这样可以更好的利用这些组件。
- 外观组件从本质上来说是你的应用的“调色板”。你可以将它们放到一个单独的页面上，让设计师在不碰触任何逻辑代码的情况下去调整所有变化。你也可以在这个页面上作快照回归测试。
- 会强迫你抽取出“布局组件”，例如 Sidebar， Page, ContextMenu 等，并使用 this.props.children 避免在很多容器组件中复制相同的文档标记和布局。

记住，组件不一定必须要生成 Dom。他仅仅需要在 UI 关注点之间提供组合的边界。

要利用这一点。

## 该什么时候采用容器组件？

我建议你在刚开始构建你的应用的时候只使用外观组件。最终你会意识到你传递了过多的属性到中间组件里。当你意识到一些组件根本没有使用它所接收到的属性，仅仅是将这些属性向下传递，并且在这些子层级的组件需要更多数据的时候你必须对这些中间组件的数据进行重新连接。这是一个引入容器组件的好的时机。这个方式可以让你将数据和行为直接通过属性关联到叶子组件上，同时不会给组件树上无关的中间组件增加负担。

这是一个持续不断的重构过程，所以不要一开始就尝试使用它。当你尝试了这个模式之后，你将会培养出一种判断什么时候该抽象出容器组件的直觉。我在[Egghead 上的免费课程](https://egghead.io/courses/getting-started-with-redux)也会给你提供一些帮助！

## 其它的分类

你要理解外观组件和容器组件之间的区别不是技术上的问题，而是它们使用目的上的区别，这一点很重要。

为了作对比，下面列出了一些相关的（不是相同的）技术上的区别：

- **有状态和无状态** 一些组件会使用 React 中的 setState()方法，另一些不使用这个方法。当然容器组件倾向于有状态，外观组件倾向于没有状态，这并不是一个强制的规则。容器组件可以是有状态的，容器组件也可以是无状态的。

- **类和函数** 从 React 的 0.14 版本开始，组件既可以用类来声明也可以用函数来声明。函数式组件定义起来更简单，但是它缺少了一些现在只可以在类组件中使用的特性。其中的一些限制可能在未来消失，但是它们存在于现在。因为函数式组件更易于理解，所以我建议你优先使用它，除非你想要使用状态，生命周期钩子或性能优化这些现在只能在类组件中使用的特性。

- **纯净和不纯净** 如果一个组件可以保证在给定相同的属性和状态的情况下可以返回相同的结果，人们称这样的组件为纯净的组件。纯净的组件既可以用类来定义也可以用函数来定义，并且既可以是有状态的也可以是没有状态的。纯净的组件的另一个重要方面是它们不依赖对属性和状态的深度修改，所以它们的渲染性能可以在 shouldComponentUpdate() 生命周期通过一个浅比较进行性能优化。现在只有在类组件中可以定义 shouldComponentUpdate() ,但所这在将来会有所改变。

无论是外观组件还是容器组件都可以落在这其中的任何一个分类中。以我的经验，外观组件倾向于无状态的纯净函数，同时容器组件倾向于有状态纯净的类。但这并不是一个规则而是一个观察。并且我已经看到过完全相反的例子，这些例子在特定的情况下很有意义。

不要教条的对外观组件和容器组件进行划分。有些时候这并不重要或者很难在这两者之间画一条线。如果你不能确定一个组件应该是外观还是容器，可能是决定这个还为时过早。不要担心！

## 例子

[Michael Chan](https://twitter.com/chantastic)创建的这个[gist](https://gist.github.com/chantastic/fc9e3853464dffdb1e3c)很好的解释了它

## 进一步了解

- [Getting Started with Redux](https://egghead.io/courses/getting-started-with-redux)
- [Mixins are Dead, Long Live Composition](https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750)
- [Container Components](https://medium.com/@learnreact/container-components-c0e67432e005)
- [Atomic Web Design](https://bradfrost.com/blog/post/atomic-web-design/)
- [Building the Facebook News Feed with Relay](https://reactjs.org/blog/2015/03/19/building-the-facebook-news-feed-with-relay.html)

## 脚注

> - 在这篇文章的一个早期版本我称呼它们为 “smart” 和 “dumb” 组件,但这对于外观组件来说过于苛刻，更重要的是这不能很好的表明创建这两种组件的意图的差异。我更喜欢新的术语，希望你也能喜欢。

> > \*\* 在这篇文章的一个早期版本中我声称外观组件中只能包含其它外观组件。我不再认为是这样。组件是外观组件还是容器组件都是其实现的细节决定。你应该可以用一个容器组件替换一个外观组件而不修改任何地方的调用。因此，无论是外观组件还是容器组件都可以很好的包含其它外观组件或容器组件。