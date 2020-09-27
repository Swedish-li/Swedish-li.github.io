---
title: 'Javascript 中多变的 this'
date: 2020-9-27
tags:
  - JavaScript
location: Toykyo
---

在 Javascript 中 **this** 的指向会根据代码的执行环境动态的改变，**this** 的这种行为让函数的使用更加灵活，但对于初学者来说也容易产生迷惑。

<!-- more -->

## `this` 的指向

在很多情况下 **this** 的指向取决于当前执行函数所在的对象。

### 全局环境

在全局环境下 **this** 指向[全局对象][1]

```javascript
this === window // true
```

### 函数作用域

函数作用域中的 **this** 指向取决运行期函数的调用方式和模式

#### 直接调用函数（非严格模式）

**this** 指向全局对象

```javascript
// 立即执行函数（iife）
;(function() {
  this === window
})()

// 全局函数
function hello() {
  this === window // true
}
hello()

// 嵌套函数
var obj = {
  func: function() {
    function hi() {
      this === window // true
    }
    hi()
  }
}
obj.func()
```

#### 直接调用函数（严格模式）

**this** 指向 `undefined`

```javascript
// 立即执行函数（iife）
;(function() {
  typeof this === 'undefined' // true
})()

// 全局函数
function hello() {
  typeof this === 'undefined' // true
}
hello()

// 嵌套函数
var obj = {
  func: function() {
    function hi() {
      typeof this === 'undefined' // true
    }
    hi()
  }
}
obj.func()
```

#### 使用 `new` 调用函数

**this** 指向用函数作为构造函数生成的新实例

```javascript
function Cat() {
  this instanceof Cat // true
}
new Cat()
```

#### 作为对象的方法调用函数

**this** 指向这个对象

```javascript
var obj = {
  hello: function() {
    this === obj // true
  }
}

obj.hello()
```

## 避免 **this** 指向的变化

由于 **this** 的指向变化有时候会造成一些意想不到的错误，有时我们需要避免这种变化。

### 使用函数的 `call` 或 `apply` 方法来指定函数运行期的 **this**

```javascript
function Func() {
  var self = this
  this.func = function() {
    console.log(this === self)
  }
}

var func1 = self.func

func1.apply(self) // true
func1.call(self) // true
```

### 使用函数 `bind` 方法来绑定运行期的 **this**

```javascript
function Cat() {
  var self = this
  function func() {
    console.log(this === self)
  }
  this.func = func.bind(self)
}

var func1 = new Cat().func
func1() // true
```

## 相关链接

[全局对象(MDN)][1]
[Function.prototype.bind()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind)

[1]: https://developer.mozilla.org/en-US/docs/Glossary/Global_object
