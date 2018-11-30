---
layout: post
title: weex轮播动画深坑之旅
date: 2018-11-30
tags: weex, weex-animation
author: challenget
excerpt: 不要问我weex动画有多坑，你想多坑就多坑！😄
---

# weex轮播动画深坑之旅

![demo](https://user-images.githubusercontent.com/10148735/48933725-5486d980-ef3c-11e8-8efa-27b722f86624.gif)

`weex animation`坑到我怀疑人生，特在此记录！

起初在写这段动画的时候，都是在chrome里调试的，没啥问题，结果到了native里，FUCK！完全不一样。。。

以下所有问题均出现在native内！

## animation不支持margin

由于图片之间的间距不一样（大图左间距30，其他的间距都为20），所以动画不仅涉及图片大小变化，还涉及图片间距变化。在native上调试之后发现间距有问题，到weex文档中查阅发现animation不支持margin。。。无赖之下，只得在每张图片旁边增加一个元素，通过元素的宽度实现间距。

## android更改图片宽高不居中

ios算正常了，再看android，图片变大后没有居中。这里大小变化是通过更改图片宽高实现的，这种方式在android下变化的时候原点是`(left, top)`，而不是`(center, center)`，所以没有居中，无赖之下通过`transform: scale()`去实现大小变化。

## android `needLayout`无效

animation结束后andriod不会触发布局渲染，导致页面异常，所以在动画结束之后需要更新数据强制渲染。

## android `pageX`抖动

在`touchmove`里获取`e.changedTouches[0].pageX`，发现在android里忽大忽小，导致滑动时各种抖动，于是通过前后差距判断解决

```js
{
    touchStart(e) {
        this.prevPageX = e.changedTouches[0].pageX;
    },
    touchMove(e) {
        const pageX = e.changedTouches[0].pageX;

        if (Math.abx(pageX - this.prevPageX) > 50) {
            return;
        }
        this.prevPageX = pageX;
    }
}
```

## 偶现抖动

在滑动过程中偶现抖动，因为在滑动过程中要不断渲染，猜测是weex渲染顺序错乱导致的，最终排除不出具体原因只好注释touchMove方法，体验降级。

## 最后

> 不要问我weex动画有多坑，你想多坑就多坑！😄

这里附上最终版本[weex轮播组件](https://gist.github.com/466023746/66da49384c941672dc9eda9083761043)
