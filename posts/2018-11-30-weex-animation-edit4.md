---
layout: post
title: weex轮播动画深坑之旅
date: 2018-11-30
tags: weex, weex-animation
author: challenget
excerpt: 不要问我weex动画有多坑，你想多坑就多坑！😄
---

![demo](https://user-images.githubusercontent.com/10148735/48933725-5486d980-ef3c-11e8-8efa-27b722f86624.gif)

`weex animation`坑到我怀疑人生，特在此记录！

起初在写这段动画的时候，都是在chrome里调试的，没啥问题，结果到了native里，FUCK！完全不一样。。。

以下所有问题均出现在native内！

## ios左右滑动时页面也会滚动

首先android没有这问题，其次weex没有`preventDefault`这种方法，后来发现ios使用`pan`事件就行了（😓）。。。

还有个小问题，android `touch`事件绑父元素上，只有父元素未被子元素覆盖的区域能滑动，子元素滑不了，所以这里绑在了子元素上。

```html
<!-- ios用pan，解决左右滑动时页面滚动问题 -->
<div class="pic-slide-box"
     v-if="isIOS"
     @panstart="touchStart"
     @panmove="touchMove"
     @panend="touchEnd">
    <template v-for="(item, index) in list">
        <image resize="cover"
               :src="item.img | thumbnail({width: 384})">

        </image>
        <!-- 用宽度代替margin，因为weex动画不支持margin -->
        <text class="img-margin">

        </text>
    </template>
</div>

<!-- 其余的用touch -->
<!-- android touch绑父元素无效 -->
<div class="pic-slide-box"
     v-else>
    <template v-for="(item, index) in list">
        <image resize="cover"
               :src="item.img | thumbnail({width: 384})"
               @touchstart="touchStart"
               @touchmove="touchMove"
               @touchend="touchEnd"
               @click="go(index)">

        </image>
        <!-- 用宽度代替margin，因为weex动画不支持margin -->
        <text class="img-margin">

        </text>
    </template>
</div>
```

## animation不支持margin

由于图片之间的间距不一样（大图左间距30，其他的间距都为20），所以动画不仅涉及图片大小变化，还涉及图片间距变化。在native上调试之后发现间距有问题，到weex文档中查阅发现animation不支持margin。。。无赖之下，只得在每张图片旁边增加一个元素，通过元素的宽度实现间距。

```html
<div class="pic-slide-box">
    <template v-for="(item, index) in list">
        <image resize="cover"
               :src="item.img | thumbnail({width: 384})">

        </image>
        <!-- 用宽度代替margin，因为weex动画不支持margin -->
        <text class="img-margin">

        </text>
    </template>
</div>
```

## android更改图片宽高不居中

ios算正常了，再看android，图片变大后没有居中。这里大小变化是通过更改图片宽高实现的，这种方式在android下变化的时候原点是`(left, top)`，而不是`(center, center)`，所以没有居中，无赖之下通过`transform: scale()`去实现大小变化。

## android `needLayout`无效

animation结束后android不会触发布局渲染，导致页面异常，所以在动画结束之后需要更新数据强制渲染。

正常来说只需要图片切换时调用weex animation执行动画就行了，但是现在我们需要保持每个图片和间距的状态数据，然后监听一次滑动涉及的多个动画都结束的时候更新数据，触发vue重新渲染。

```js
// 图片保存transform
style = {
    transform: `scale(${widthScale})`
};

// 间距保存宽度
style = {
    width: targetMargin
};
```

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

在手指滑动过程中偶现抖动，因为在滑动过程中要不断渲染，猜测是weex渲染顺序错乱导致的，最终排除不出具体原因只好注释touchMove方法，取消实时滑动动画，只在滑动结束时触发一次滑动动画。

## android `touchend`基本不触发

只见`touchstart`触发，`touchend`很少触发，这我也是很无奈，可能是绑定的元素比较特殊导致，这边可以在`touchmove`里判断，也可以改用`swipe`事件，我选择的是后者，因为`swipe`同时解决里上面一个问题。

## android `clearInterval` `clearTimeout`无效

android内定时器无法清除。。。因为要自动播放，正常来说我是`touchstart`清定时器，`touchend`开计时器。

解决方法是android内部只在初始化时开计时器，`touchend`不开。

## ios image `resize` `cover`不裁剪超出区域内容

醉了。。。

## 最后

> 不要问我weex动画有多坑，你想多坑就多坑！😄

这里附上最终版本[weex轮播组件](https://gist.github.com/466023746/66da49384c941672dc9eda9083761043)
