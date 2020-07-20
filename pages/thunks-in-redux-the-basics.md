---
title: "Redux 中 Thunks 的基础（译文）"
date: 2020-7-6
tags:
  - Redux
  - Thunks
  - Javascript
author: Swedish li
location: Toykyo
---

<h1 class="title">{{ $page.title }}</h1>

原文： [Thunks in Redux: The Basics](https://medium.com/fullstack-academy/thunks-in-redux-the-basics-85e538a3fe60)

这篇文章是作为一篇面向 React 和 Redux 初学者的简介文章，目的是为了阐明什么是 `thunks` 和使用它们的动机。

Redux 是由 Dan Abramov 创建的。它是一个 `状态容器`，它的创建受到了 Flux 中的单向数据流和 Elm 的函数式架构的启发。它提供了一种可预测的方式去管理状态，这得益于数据的不可变性，对业务逻辑的约束，作为唯一的真实数据源，并且只有少量的 API.

Redux 组件之间的同步数据流和纯净的数据流有着良好明确的定义，并且职责简单。`行为创建者创建行为对象 -> 行为对象被发送到数据存储中心 -> 数据存储中心执行 Reducers -> reducers 生成新的状态 -> 状态的更新被通知到监听者`。

不管怎样，Redux 都不是一个应用框架，也没有指定该如何处理副作用。对于这些，开发者可以通过 middleware 来使用他们喜欢的策略。

> 我可能会让行为创建函数返回一个函数。如果是一个函数（行为），它将会被传入 `dispatch` 和 程序的状态信息（State） -- Dan Abramov 在 Redux 的第一个问题（issue #1）中的回应。

Redux-Thunk 可以说是一个这样的，非常基础的 middleware. 当然也是第一个被很多人学习，在被单独拆分为一个单独的包之前是被  Dan Abramov 做为 Redux 的一部分而开发的。这个初始的实现小到可以在这里直接的引用它。

```javascript

export default function thunkMilldleware({ dispatch, getState }) {
  return next => action => 
    typeof action === 'function' ?
      action(dispatch, getState) :
      next(action);
}

```

直到现在，Redux-Thunk 的源码也仅仅增加到[总共14行](https://github.com/reduxjs/redux-thunk/blob/master/src/index.js)。尽管这明显很简单，不管怎样，thunks 仍然偶尔会让我们产生迷惑。如果你发现这很让你迷糊，不要害怕，我们将从回答一个更常见的问题来开始...

## 什么是 Thunks ?

对于 `Thunk` 的精确定义，在不同的上下文语境下有所不同。但一般的，thunks 被认为是一种被用来进行延迟执行的函数式编程技术。与立即执行一些工作不同，你创建一个函数体或者不被立即执行的表达式（被称作 `thunk`）,可以让我们在将来的某一个时间点来选择性执行它。对比下面的例子：

```javascript
// 立即执行版本 Eager version
function yell (text) {
  console.log(text + '!');
} 

yell('bonjour'); // bonjour!

//  Lazy (or "thunked") version 非立即执行
function thunkYell (text) {
  return function thunk () {
    console.log(text + '!');
  }
}

const thunk = thunkYell('bonjour');


// wait for it 等待执行

thunk(); // 'bonjour!'

```

命名函数标注出 `thunk` 函数，但是箭头函数可以让这变得更加清晰。注意看一个 `thunk` 如何在执行之前要求一次额外的执行的（这个 thunk 函数是从 thunkYell(...)中返回的）:

```javascript
const yell       = text =>       console.log(text + '!')
const thunkYell  = text => () => console.log(text + '!')
//                          \_________________________/
//                                      |
//                                  the thunk
```

这里有一个包含副作用的潜在的工作（输出日志），但是 thunks 也可以包含一些执行很慢的运算，甚至不会结束的工作。在任何的情况下，都是在后来由其它的代码来决定是否要真的执行这个 thunk :

```javascript
const generateReport = thunk => 
  FEELING_LAZY
    ? `Sorry, the bean counters are asleep.`
    : `You have ${thunk()} beans in your account`

// imagine `counterAllTheBeans` is a slow function:
const report = generateReport(counterAllTheBeans)
```

## 相关的： 惰性的

惰性的语言会自动把函数型参数作为 thunks 来处理，这可以允许 “无限的” 按需执行队列和巧妙的编译器优化。`惰性` 是一个有力的技术，在 javascript 中它可以通过很多方式和语言特性来实现，包括 `getters`, `proxies`,和 `generators`。例如，在 Chalk 库里面使用了 `getter`惰性的构建了一个无限的属性链：
`chalk.dim.red.underline.bgBlue` 等。在数学方面，有一个 著名的`thunked` 版本 `Y combinator`,被称作 `Z combinator`,它可以在立即执行(Eager)的语言里运行，例如 Javascript。

惰性处理是一个很大的话题，值得一谈。我们在这里不去探讨 thunks 和 惰性处理的通用的一面，在剩下的文章里我们会将关注点放在 Redux-Thunk 上。

## React 和 Redux 中的 Thunks

在 React 或 Redux 中，thunk 可以让我们避免在 行为（actions），行为创造者（action creator），组件中去直接产生包含副作用的操作。取而代之的是将任何的不纯净的操作包裹在一个 thunk 中。这些 thunk 将在晚些时候在 Middleware 中被执行以触发这些副作用。通过传递我们含有副作用的代码到 Redux 循环（在Middleware这个层级）这一个点执行，我们应用的剩余部分将保持相对的纯净。纯净的函数和组件是易于理解，测试，维护，扩展和重用的。


## 基本原理和动机

Redux 中 `store.dispatch` 的执行需要传入一个`行为（action, 这个对象要包含一个 type 属性）` :

```javascript
const LOGIN = 'LOGIN';
store.dispatch({ type: LOGIN, user: {name: 'Lady GaGa'} });
```

因为在多个地方手动输入行为对象是一个潜在的代码错误（你可能会不小心将 users 写成 user），我们更倾向于使用“行为创建者”函数来生成正确格式的行为对象。

```javascript
// in an action creator module
const login = user => ({ type: LOGIN, user});

// in some component
store.dispatch(login({name: 'Lady GaGa' })) // still dispatch an action object
```

## 问题

无论如何，如果我们必须要执行一些异步的操作，例如使用 axios 库执行一个 AJAX 请求，一个简单行为创造者将不再够用。

```javascript
const asyncLogin = () => 
  axios.get('/api/auth/me')
    .then(res => res.data)
    .then(user => {
      // 要如何在这里使用user对象？
    })

    // somewhere in component:
    store.dispatch(asyncLogin()) // 不要这样; `asyncLogin()` 是一个 promise ，不是一个行为对象
```

问题在于 `asyncLogin` 不在返回一个行为对象。为什么会这样？负载对象（用户对象）还不能使用。Redux （特指 dispatch）不知道如何去处理 promise 对象 - 至少，不能靠它自己来处理。

## 第一个想法： 直接调用异步操作

我们可以自己在一个异步的回调中调用 store.dispatch:

```javascript
// in an action creator module:
import store from '../store'

const simpleLogin = user => ({ type: LOGIN, user })

const ayncLogin = () => 
  axios.get('/api/auth/me')
    .then(res => res.data)
    .then(user => {
      store.dispatch(simpleLogin(user))
    })

// 在组件中的某个地方
asyncLogin()
```

看上去这样并没有什么问题。无论如何，它显示出了几个缺点。

## 缺点A： 不一致的 API

在我们的组件中我们有时候会调用 `store.dispatch(syncActionCreator())`，有时候会调用 `doSomeAsyncThing()`。

- 在后边的例子中，由于我们没有显式的向 store 中传递数据，因此我们不能立刻知道定位到 Redux 中的行为，这让我们的应用中的数据流变的不透明。

- 如果我们在后来将一个同步的行为函数改为异步的，或者异步的改为同步的，我们该如何做？我们必须在每个使用它的组件中跟踪和修改这个函数被调用的地方。这是多么不好的方法！

我们想要的方式是即使在执行异步行为的时候依然可以使用 store.dispatch(actionCreator())

## 缺点B：不纯净的

asyncLogin 函数式不纯净的；它包含了一个副作用（网络调用）。当然我们最终必须要产生这个调用，我们将会在后边看到一个解决方案。但是我们把副作用集成在呢组件中，这使得组件难于修改和理解。比如在单元测试中，我们必须要拦截和修改 axios,否则组件将会产生真正的网络调用。

## 缺点C：紧耦合

在 asyncLogin 函数和指定的 store 产生了紧耦合。这使得它不可重用；如果我们想要将行为创造者在多个 Redux store 之间使用，例如在服务端渲染中使用，我们该怎么做？或者根本没有真实的 store，比如在测试中使用的 mock,该如何处理？

## 更好的方案：Thunks (最初的尝试)

有了 thunks, 我们可以返回一个函数来替代立即执行这个网络调用以便可以在需要时候执行这个调用。

```javascript
// in an action creator module
import store from '../store'

const simpleLogin = user => ({ type: LOGIN, user })

const thunkedLogin = () => 
  () => 
    axios.get('/api/auth/me')
      .then(res => res.data)
      .then(user => {
        store.dispatch(simpleLogin(user))
      })

// 在组件中的某个地方
store.dispatch(thunkedLogin()) // 将 thunk 传递到 store 中

// thunk 本身（`() => axios.get...`）还尚未被执行 
```

我们回到了单一 API 的模式，并且我们的行为创造函数 thunkedLogin 是纯净的，或者说至少 `更加纯净一些`：当它被执行后，将返回一个函数，不会立即产生副作用。

“但是，等一下”，细心的读者可能会注意到。“行为创建者返回了一个在后来获取到 dipatch 的函数，我了解的 Redux 不是只会认识行为对象吗？这个地方也仍然保持着紧耦合”。

对的，如果我们仅仅做出这些改变，thunk 将会被传递到 Redux 的 reducers 里面去，不会产生任何作用。Thunks 并不是魔术，只有它是不够的。想要真正的执行 thunk 我们需要一些额外的代码。这里引出我们的下一个工具：无论何时当一个值被传入 Redux store 的时候，它将先会经过 Middleware。

## Redux-Thunk Middleware

当 redux-middleware 一旦被安装之后，本质上意味着下面的操作：

```javascript
actionOrThunk => 
  typeof actionOrThunk === 'function'
    ? actionOrThunk(dispatch, getState)
    : passAlong(actionOrThunk);
```

- 如果是普通的行为对象被传递进来，redux-thunk 只是简单的将它传递下去（例如，传递到 reducer）, 就像 redux-thunk 不存在一样。

- 如果是一个函数（例如 thunk）被传递进来，redux-thunk 将会执行这个函数，并且将 dispatch 和 getState 作为参数传递进去。它将不会把 thunk 传递到 reducer 中。

这正是我们我说需要的！现在我们的行为创造者可以返回对象或者函数。在前一种情况下，所有的工作都会正常执行。在后面的情况，函数将被拦截并且执行。

当我们的示例 thunk 在 middleware 中被执行之后，它将会产生一个异步的效果。当这个异步处理结束之后，在回调函数或处理器函数中可以向 store 传递普通的行为对象。因此，thunks 让我暂时 `逃脱` 了正常的 Redux 循环，并且通过异步的处理函数最终重新进入了这个循环。

[![Redux data flow](/1_QERgzuzphdQz4e0fNs1CFQ.gif)](http://slides.com/jenyaterpil/redux-from-twitter-hype-to-production)

## 依赖注入

我们已经看到 Redux 中的 thunk 帮我们统一了 API,并使我们的行为创建函数保持纯净。不管怎样，我们的示例仍然绑定了一个特定的 store。redux-thunk 中间件为我们解决这个问题提供了一个方法： 依赖注入(Dependency injection)。DI 是一种让我降低代码之间耦合性的技术；用被提供的依赖（容易修改的）来代替代码内的声明式的获取依赖（紧耦合）。这种角色的反转是一个更加通用的的概念 [`控制反转`](https://docs.microsoft.com/en-us/previous-versions/msp-n-p/ff921087(v=pandp.10)?redirectedfrom=MSDN) 的一个实例。

Thunks 函数通常不接受参数，他们是潜在的运算，已经准备好了再没有额外的输入的情况下进行执行。不管怎样，redux-thunk 违反了这条规则，在实际执行的时候 thunk 的时候传入了两个参数：dispatch 和 getState。因此我们定义 thunked 行为创造者的标准模式将不需要一个范围的 store。

```javascript
// in an action creator module
const simpleLogin = user => ({ type: LOGIN, user })

// 看这里现在不需要导入 store

const thunkLogin = () =>     // 行为创建者，当被执行的时候
  dispatch =>                // 返回的 thunk ,当执行的时候，传入一个 dispatch
    axios.get('/api/get/me') // 执行真实的请求
      .then( res => res.data)
      .then( user => {
        dispatch(simpleLogin(user))
      })

// 组件中的某个地方
store.dispatch(thunkLogin())

// thunk 本身 (`dispatch => axios.get…`) 还没有被执行.
// 当它到达中间件（middleware）的时候, `redux-thunk` 将会拦截并执行它,
// 同事间 store 的 `dispatch` 传递给它。
```

这是如何运行的？这个新的 dispatch 从哪里来？

简单的回答就是 redux-thunk 中间件已经访问到了 store，因此可以在执行 thunk 的时候将 store 的 dispatch 和 getState 作为参数传递给它。中间件本身负责注入这些依赖到 thunk 中。行为创造者模块不需要手动的获取 store,因此行为创造者可以在多个store中使用，并且可以使用一个模拟的 dipatch。

`getState`

我们没有演示如何在 thunk 中使用 `getState`, 因为它容易被滥用。在大多数的 redux 应用中，让 reducers 去负责去使用先前的状态来决定新的状态比较合适（而不是在行为里）。当然也有一些情况下在 thunk 中读取状态是可以得到合适的解释的，不管怎样，要意识到这是一个备选的参数。Dan Abramov 发表了在行为创造函数中使用 state 的看法：

[Accessing Redux state in an action creator?](https://stackoverflow.com/questions/35667249/accessing-redux-state-in-an-action-creator/35674575#35674575)

> The few use cases where I think it’s acceptable is for checking cached data before you make a request, or for checking whether you are authenticated (in other words, doing a conditional dispatch) — Dan Abramov

`withExtraArgument`

"等一下，还有更多！"，Redux-thunk 不仅可以注入 dispatch 和 getState, 它也可以注入一些你的一些自定义依赖，使用 `withExtraArgument`. 如果你想注入 axios，让它在测试中更容易被模拟，我们可以像下面这样做。

```javascript
// in store instantiation module:
import axios from 'axios'

const store = createStore(
  reducer,
  applyMiddleware(thunk.withExtraArgument(axios))
)

// in action creator module:
const thunkedLogin = () =>
  (dispatch, getState, axios) => // thunk 现在可以接受 `axios` 的注入.
    axios.get('/api/auth/me')
    .then(res => res.data)
    .then(user => {
      dispatch(simpleLogin(user))
    })
```

在某个时间，可能会有人想知道在哪里可以不使用依赖注入。不允许使用代码引入依赖吗？是否有更好的方法？ DI 和 IoC 是有用的，但[可能不够理想](https://medium.com/javascript-scene/mocking-is-a-code-smell-944a70c90a6a)。同样，应该注意这个选项，但要考虑你的应用是否真的需要这些。

## 为什么要使用 Thunk 中间件，而不是 promise 中间件？

Promise 是异步值的组合表示，现在已经得到浏览器的原生支持，并在Javascript中得到了广泛的应用。redux-promise 和 redux-promise-middleware 这两个包可以让你传递 promise 或者让行为对象包含 promise,它们都拥有不错的能力，并且可以让你在 Redux 中更轻松的做异步的处理。但是它们都没有解决不纯净的这个问题。Promise 是即时执行的；它所代表的异步操作是已经被初始化过的操作（[任务（Task）](https://folktale.origamitower.com/api/v2.0.0/en/folktale.concurrency.task.html)更像一个惰性的 Promise - 用户的代码在执行 run 方法之前不会真正被执行,这与Promise相反）。

## 幼稚的Promis使用

在 Redux 使用 Promise 的初步尝试可能会像下面这样：

```javascript
// in an action creator module:
import store from '../store'

const simpleLogin = user => ({ type: LOGIN, user })

const promiseLogin = () =>  // 创建 行为（action）…
  axios.get('/api/auth/me') // …返回一个 promise.
  .then(res => res.data)
  .then(user => {
    store.dispatch(simpleLogin(user))
  })

// 组件中的某个地方:
store.dispatch(promiseLogin()) // 不, 这样仍然不好
```

仔细观察；这样做本质上和我们直接调用异步处理的想法一样。`promiseLogin` 最终在成功的处理函数中分发一个 action 。我们也会将这个初始化过的 promise 分发到 store 中，但是一个潜在的 middleware 该如何处理这些 promise？我们希望有一个假想的 `redux-promise-naive` middleware 可以在 promise 传递到 reducer 之前抛弃掉它。这是可行的，但是忽略了一些问题：

- 同样，异步代码的即时调用会让我们的组件和 action 创建函数变得不纯净，也更加难以测试。

- 我们的 `promiseLogin` 方法仍然与一个指定的 store 耦合了在一起，这降低了代码的重用性。

- 区分 promise 对象和 action 对象可能会比较困难。

>P/A+ promises have a painstaking [[promiseResolutionProcedure]] for duck-typing promises safely. The foolproof way to deal with this uncertainty is to coerce values using Promise.resolve, but doing so for every Redux action is a bit heavy-handed.

## 更聪明的 promise 用法

真正的 redux-promise 和 redux-promise-middleware 库的处理方式要比我们的假想 redux-promise-naive 的处理方式更聪明。它们允许发起 promise 或者在 action 的负载中包含 promise , 当 promise 处理完成后，middleware 会发起一个普通的 action。例如:

```javascript
// 使用 redux-promise-middleware
const promiseLogin = () => ({
  type : 'LOGIN',
  payload: {
    promise: axios.get('/api/auth/me').then(res => res.data)
  } 
})

// 组件中的某个地方
store.dipatch(promiseLogin())
```

在这里，redux-promise-middleware 将会检测到在发起的 action 里显式声明的 payload.promise，防止这个 action 传递到 reducer 中，并且会自动发出另外的 'LOGIN_PENDING' action 作为替代。然后它将等待这个 promise 完成，在这个时候它会 发出 'LOGIN_FULLFILLED' 或者 'LOGIN_REJECTED' action, 并且用这个承诺的值或错误的原因来代替之前的 promise 负载。我们可以不需要任何额外的操作就可以获得一些组合的操作，可以给我们开发一些 UI 特性提供支持，例如加载等待提示，错误信息通知。

这个 middleware 也提供了一种优化：promiseLogin 不在需要依赖一个特定的 store，而是由 middleware 来关注将最终的数据发送到它自己所在的 store 中。

遗憾的是，redux-promise-middleware 仍然没有包含对副作用的处理；promiseLogin 让网络调用立即执行，这可以说是以 promise 为基础的 middleware 的阿喀琉斯之槌，同时我们的组件回到了非纯净的状态，这使我们在测试，其它的上下文环境下重用组件的时候必须要额外的钩子函数或者修改。

## Thunked Promises

事实证明，没有什么可以阻碍我们在使用 redux-promise-middleware 的同时使用 redux-thunk。通过延迟 promise 的创建，我们既可以得到惰性执行的 thunks,也可以得到 redux-promise-middleware 自动发起的 action：

```javascript
const thunkedPromiseLogin = () =>     //  替代返回d的 action
  dispatch =>                         // 返回一个thunk, 可以延迟执行
    dispatch({                        // 发出一个 action
      type : 'LOGIN',
      payload: {
        promise : axios.get('/api/auth/me').then(res => res.data)
      }
    })

// 组件中的某处
store.dispatch(thunkedPromiseLogin())
```

在这里，thunk 的简洁的核心理念，已经被必须要讨论的复杂度所掩盖。我们真的需要为了处理 Redux 中的副作用而添加两个 middleware 库和记住一些特定的代码模式吗？我们将在稍后去验证一些其它的可选方案。在此之前，关于 promise 和 thunks 还有最后一点值得我们注意。

## 在 thunks 中返回 promise

当我们使用 redux-thunk 的时候，如果我们发出一个返回 promise 的 thunk ，dispatch 方法将返回给我们相同的 promise：

```javascript
const thunkedLogin = () =>
  dispatch =>
    axios.get('/api/auth/me')
    .then(res => res.data)
    .then(user => {
      dispatch(simpleLogin(user))
    })

// 组件中的某处
store.dispatch(thunkedLogin())
.then(() => console.log('async from component A fulfilled'))
```
同样，这种模式很容易被滥用。通常，我们试图让 React 的组件尽可能的保持纯净；在其中添加回异步的处理函数感觉是一种倒退。它也再一次让我们的 API 变得不一致。

However, there are a number of times and places where using a returned promise from a dispatch call can be nice. CassioZen presents a few in his ReactCasts #10: Redux Thunk Tricks video.

不管怎样，有很多不错的时间和地方可以让我们去执行 dispatch 方法调用返回的 promise, CassioZen 在他的 [`ReactCasts #10: Redux Thunk Tricks`](https://www.youtube.com/watch?v=xihoZZU0gao)视频中展示了一些。


<iframe width="560" height="315" src="https://www.youtube.com/embed/xihoZZU0gao" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Thunks 的备选方案
<br>

<iframe id="twitter-widget-0" scrolling="no" frameborder="0" allowtransparency="true" allowfullscreen="true" class="" style="position: static; visibility: visible; width: 550px; height: 702px; display: block; flex-grow: 1;" title="Twitter Tweet" src="https://platform.twitter.com/embed/index.html?dnt=false&amp;embedId=twitter-widget-0&amp;frame=false&amp;hideCard=false&amp;hideThread=false&amp;id=845818794673090561&amp;lang=en&amp;origin=https%3A%2F%2Fcdn.embedly.com%2Fwidgets%2Fmedia.html%3Ftype%3Dtext%252Fhtml%26key%3Da19fcc184b9711e1b4764040d3dc5c07%26schema%3Dtwitter%26url%3Dhttps%253A%2F%2Ftwitter.com%2Fdan_abramov%2Fstatus%2F845818794673090561%26image%3Dhttps%253A%2F%2Fi.embed.ly%2F1%2Fimage%253Furl%253Dhttps%25253A%25252F%25252Fpbs.twimg.com%25252Fprofile_images%25252F906557353549598720%25252FoapgW_Fp_400x400.jpg%2526key%253Da19fcc184b9711e1b4764040d3dc5c07&amp;theme=light&amp;widgetsVersion=9066bb2%3A1593540614199&amp;width=550px" data-tweet-id="845818794673090561"></iframe>


Thunks 显然已经造成了很多令人头疼的问题。

既然如此，thunk 是否是我们在 Redux 的应用中管理异步处理和副作用的唯一正确的方式呢？显然不是。我们已经提到了以 promise 为基础的 middleware 。thunk 至少有一个 promise 所没有的优势，但下面的包在某些情况下可能更加便利。

- [Redux-Promise](https://github.com/redux-utilities/redux-promise)
- [Redux-Promise-Middleware](https://github.com/pburtchaell/redux-promise-middleware)
- (2017–11–02 追加: [Redux-Pack](https://github.com/lelandrichardson/redux-pack) 或许也值得考虑)


同时，thunk 是其中最简单的方法。对于更加复杂的异步处理，thunk 会带来更多异步处理逻辑。更加复杂的，具有表现力的和组合的解决方案已经出现。下面列举一些已经发布的包（根据使用频度排序）；

- [Redux-Saga](https://github.com/redux-saga/redux-saga), 基于 Generator 函数
- [Redux-Observable](https://github.com/redux-observable/redux-observable), 基于 RxJS observables
- [Redux-Loop](https://github.com/redux-loop/redux-loop), 以 Elm 中的状态管理系统为蓝本

Redux-Saga 使用 Generator 函数，一个所有 Javascript 开发者都该掌握的 Javascript 原生特性。Redux-Saga 的 remainder API 是高阶的和唯一的，尽管你可以快速的掌握它，但是写出的代码可能不那么易于移植。然而，由于sagas返回所需效果的简单描述，而不是执行这些效果的函数，因此它特别适合测试。

In comparison, Redux-Observable is built on RxJS, a large library with a longer learning curve. However, RxJS is useful outside of Redux-Observable as a powerful and composable way to manage asynchronicity.

相比之下，Redux-Observable 是基于 RxJS 这个大型的，学习曲线陡峭的库构建的。但是，RxJS 在 Redux-Observable 之外也是有用的，它很强大且可以用组合的方式去管理异步处理。

Redux-Loop 不是那么的流行，但它和 Redux 本身一样受到了 Elm 的启发，有趣的的是它不关注 action 创造函数，而是关注 Reducer；这可以让状态管理逻辑保持更加集中和受约束。

使用场景和个人喜好的考虑会决定你在 sagas, observables, loops 或者其它方案中做出选择，没有一个通用的胜者。

## 总结

最终，对于只有简单异步需求的应用来说，thunk 是一个有效的解决方案。理解 thunk 对于一个 Redux 的初学者也是可行的。一旦你掌握了它们，尝试其它的备选方案也是不错的想法。


## 其他资源
[Redux-Thunk Docs](https://github.com/reduxjs/redux-thunk)
[Dan Abramov: explaining thunks](https://egghead.io/lessons/javascript-redux-dispatching-actions-asynchronously-with-thunks)
[CassioZen: ReactCasts #10: Redux Thunk Tricks](https://www.youtube.com/watch?v=xihoZZU0gao)
[Dan Abramov: why you might or might not need thunks](https://stackoverflow.com/questions/35411423/how-to-dispatch-a-redux-action-with-a-timeout/35415559#35415559)
[Dan Abramov: using state in action creators](https://stackoverflow.com/questions/35667249/accessing-redux-state-in-an-action-creator/35674575#35674575)
[Mark Erikson: Idiomatic Redux: Thoughts on Thunks, Sagas, Abstraction, and Reusability](https://blog.isquaredsoftware.com/2017/01/idiomatic-redux-thoughts-on-thunks-sagas-abstraction-and-reusability/)



