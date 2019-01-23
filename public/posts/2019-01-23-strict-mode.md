---
layout: post
title: vue cli(webpack4 + babel7)取消严格模式
date: 2019-01-23
tags: vue cli, webpack, babel, strict mode
author: challenget
---

babel7之前可以通过`babel-plugin-transform-remove-strict-mode`插件去除严格模式，babel7该插件无法使用。

## 背景

项目使用`vue cli`，默认`webpack4`和`babel7`，且`babel7`关闭了`es module`语法转换，即没有使用`plugin-transform-modules-commonjs`，依然出现`use strict`严格模式。

`es module`语法就是`es6`的模块语法，`import`和`export`。

## 原因

- webpack4会根据代码是否包含`es module`语法添加`use strict`严格模式
- babel针对js文件有两种类型`module`和`script`，`babel-preset-env`会根据代码内容自动添加`core-js`相应`polyfill`，添加时根据`module`或者`script`决定模块引入方式是`import`还是`require`

比如你的代码内使用了`Array.from`，那么默认情况下`babel`会在文件顶部引入`import "core-js/fn/array/from"`，`webpack`识别到了`es module`语法，然后添加了`use strict`。

## 结论

让`babel`以`script`的方式处理文件，通过配置`sourceType`为`script`解决，可以针对单个文件做处理

```
root/
|- utils
    |- lazyImg
        |- index.js
        |- .babelrc
|- .babelrc
```

```
// root/utils/lazyImg/.babelrc

{
  "sourceType": "script"
}
```
