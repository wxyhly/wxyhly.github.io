---
title: 玩Tesserxel（零）：全新四维引擎上线
tags:
  - javascript
  - tesserxel
  - 图形
  - 四维
categories: Tesserxel系列
date: 2022-09-08 10:43:30
index_img: /img/tsx001.jpg
excerpt: 之前的四维引擎是基于WebGL的，现在我决定尝试使用新技术WebGPU API重新实现四维渲染引擎，因为WebGPU的计算着色器可以让截面计算也放在GPU中，彻底解决性能问题，于是新项目——Tesserxel诞生了。Tesserxel取的是单词Tesseract（四维立方体的拉丁词根tessera“四”）和Pixel（像素）。
---

由于[4DViewer](https://github.com/wxyhly/4dViewer)代码混乱且计算截面在CPU端性能低下，今年7月底我决定尝试使用新技术WebGPU API重新实现四维渲染引擎，因为WebGPU的计算着色器可以让截面计算也放在GPU中，彻底解决性能问题，于是新项目——[Tesserxel](https://github.com/wxyhly/tesserxel)诞生了。Tesserxel取的是单词Tesseract（四维立方体的拉丁词根tessera“四”）和Pixel（像素）。
![Tesserxel自带的示例库截图](/img/tsx001.jpg?size=300x)

目前Tesserxel实现了以下功能： 
1. 包含四维向量、二向量、四元数表示的旋量与图形学需要的矩阵运算的数学库。
2. 基于四面体的光栅化渲染器，该渲染器仅底层封装，需用户自己创建着色器管线、GPU缓存资源等。
3. 子模块Four能够帮用户隐藏底层渲染逻辑，类似于3D渲染中的ThreeJs库那样通过声明几何体、相机、材质、灯光来快速构建渲染四维场景。
4. 四维刚体物理引擎。
5. 用户键鼠交互系统封装。

下面就让我们进入Tesserxel构建的四维世界。这里是示例场景库链接~~(注意要启用WebGPU才打得开)~~：

[https://wxyhly.github.io/tesserxel/examples/](https://wxyhly.github.io/tesserxel/examples/)

**请参考玩[Tesserxel后续系列文章中的教程](/categories/Tesserxel系列/)深入了解Tesserxel的玩法哦~**

**注意：现在电脑端直接更新至谷歌浏览器最新版（版本号113及以上）即可打开，以下内容已经过时。**

启用WebGPU方法： WebGPU是一个实验性的API，是WebGL的未来“接班人”，它的标准还处于W3C的草稿阶段，未正式发布。目前据说仅Windows下Chrome提供较好支持，而且想开启这项功能还有点麻烦，首先你需要下载Canary版本的Chrome浏览器（[谷歌官网](https://www.google.com/intl/zh-CN/chrome/canary/)，或自行找下载资源），添加--enable-unsafe-webgpu参数启动浏览器，打开chrome://flags/，将WebGPU Developer Features打开（选Enabled）就可以启用WebGPU。
![开启WebGPU的操作步骤](/img/tsx001.png)

目前的Tesserxel只是一个早期版本，后续会补充Tesserxel说明手册，继续开发更多物理解算、高级材质、离线渲染，以及基于Tesserxel引擎的4D游戏等。（但愿不鸽~）