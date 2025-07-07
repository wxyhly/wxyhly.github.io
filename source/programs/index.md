---
title: Programs - JS小程序
date: 2019-03-30 20:30:29
---
## [四维化学（Chem4D）](https://wxyhly.github.io/Chem4D/)
一个假想的四维化学常见物质结构式查看器，并支持与Tesserxel示例库交互生成4D分子模型。四维元素设定详见[《四维世界（十一）：元素周期表》](/archives/elem4d/)。
- [元素周期表纯享版链接](https://wxyhly.github.io/Chem4D/periodic/)
<img src="/img/chemie006.jpg" style="max-width:500px;width:100%" alt="Tesserxel示例库中的四维分子">

## [Deductrium（推理元素）](https://wxyhly.github.io/deductrium/)
一个在浏览器中用Typescript实现的数学形式系统与双曲空间结合的游戏。目前包含命题逻辑、一阶逻辑、皮亚诺公理、ZFC集合论与一些序数和类型论的内容。点击这里查看：（非必须，游戏内有引导） 1. [游戏介绍](https://github.com/wxyhly/deductrium/blob/main/readme.md)； 2. [集合论简介](/archives/1stlogic/)； 3. [类型论简介](/archives/hottese/)。

如果觉得游戏太难，我还提供了一个Deductrium创造模式，链接请在博文中自行寻找。创造模式中，可直接解锁所有的公理系统，并提供了很多现成的定理，然而该模式下无法体验双曲空间以及序数系统等游戏内容。
这里再给一个生存模式游戏进度存档：可直接跳到开启类型论的地方：复制下面的进度码。

<textarea id="progress-hott" style="width:100%" disabled>.203U,6m1U,`]"2`,U:tl,2=,rt(.a]r"g],0",{)[32e`2{3}af,8,,1`]0.`U161.7["`1L5,`l0U-[m-7,)0[,,U-[2c8ljm-b"5`]4=,a[9,.`2..4"e`#j],0(,,,:`i`i9a,1"09.yo0,3(`p,rU[d73]}l.g`.-"j198]e.]c",)""p"-0fo[[U.o1ph=2#,</textarea>
<script>
    const textarea = document.getElementById("progress-hott");
    textarea.onclick = window.onload = function() {
        textarea.select(); // 全选内容
    };
</script>

## [OrdMap（序数地图）](https://wxyhly.github.io/ordmap/)
[[源码](https://github.com/wxyhly/ordmap)]
序数是比所有自然数都大但小于绝对无穷的东西，概念详细解释参见[《大数数学简介》](/archives/ggg-ord/)。序数地图中序数最大到EBO，支持BOCF/MOCF与Veblen表示。
![起点附近的序数地图](/img/ord006.png)
手机端拖拽屏幕空白部分平移地图，点击加减号缩放。按住加减号不放往右边滑动可加速缩放；电脑端鼠标按住拖拽平移地图，滚轮缩放，按键盘T/G可调节缩放速率，按W/S键可调节迭代绘制深度。

## [Tesserxel](https://wxyhly.github.io/tesserxel/examples/#)
[[源码](https://github.com/wxyhly/tesserxel)]
全新的基于WebGPU的关于四维世界的引擎：代数、建模、渲染、物理……[这里是系列文章介绍](/categories/Tesserxel系列/)，以后将出详细游玩教程与开发教程。
## [4D Viewer](/4dViewer/) 
[[源码](https://github.com/wxyhly/4dViewer)]

四维引擎Tesserxel的前身，是一个使用立体视野来显示四维空间的js库（类似Three.js），目标是尽让我们可能体会到四维人的三维视觉。附带一些Demo，比如超立方体、正多胞体、关卡游戏等等。

[使用教程点这里](/archives/eye3d/)

### 4D 刚体物理引擎
4D Viewer中的简单的4D刚体物理引擎，有一些交互式的场景，如锁链、齿轮、汽车、积木、陀螺等。现已移植进新版四维引擎Tesserxel。

[详情与教程点这里](/archives/newton4/)

### [Minecraft4D](/4dViewer/minecraft4d/) 
- 基于四维光线跟踪的Minecraft游戏，超立方体方块表面采用3D贴图
- 基于种子的随机无限地图，所有景观与结构都是四维的，不同生物群系和村庄等着你来探索！
- 支持Minecraft中类似的命令系统，包括传送、快速填充选区（类似于MC的worldedit插件）等
- 支持世界与局部结构的保存

[游戏教程点这里](/archives/mc4tutorial/)


## [电脑钢琴](/Eop/) 
[[源码](https://github.com/wxyhly/Eop)]
![编辑钢琴“两只老虎”截图](img/eopplt002.png)
一个定制化的键盘钢琴小程序，我根据自己的习惯进行了改良，有各种变调、移调的方式，所以没有键位设置选项，适合即兴。可以导入导出MIDI文件，编辑音符,支持多音轨和少数MIDI控制器(7、64)，有对齐网格量化、力度调节、速度录制等功能。此外除了钢琴还可选其他几个音色。

[点这里查看详情](/archives/Eop-Analogue/)

## 博文中的JS小程序集合
- [[原文](/archives/eye2d/)] [体验二维人看三维场景](/three/3dviewer42der.html)
- [[原文](/archives/orbit4d/)] [计算四维星球上的太阳高度角](/three/4dOrbit.html)
- [[原文](/archives/projearth/)] 墨卡托投影
    + [地球不同方向上的墨卡托投影](/three/shaderEarth.html)
    + [正多面体的墨卡托投影](/three/ployhedralEarth.html)
- [[原文](/archives/escher1/)] [双曲镶嵌模型](/three/HyperbolicSpace.html)
- [[原文](/archives/josleys4ds/)] [维度数学漫步预告片中的格子空间](/three/LatticeViewer.html)
- [[原文](/archives/fibration4ds/)] Hopf纤维丛
    + [三个正交的Hopf纤维丛](/three/Hopf%20fibre1.html)
    + [Hopf纤维丛的一部分](/three/Hopf%20fibre2.html)
    + [Hopf纤维丛的正交投影](/three/Hopf%20fibre3.html)
    + [Hopf纤维丛的正交投影](/three/Hopf%20fibre4.html)


## 其他WebGL小Demo集合
- [四维星球Hopf坐标地图经纬线](/three/mercator.html)

