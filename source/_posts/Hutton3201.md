---
title: 用Hutton32玩转数字电路（一）：逻辑门
date: 2016-06-03 20:40:21
tags:
- 电路
- 自动机
- Hutton32
excerpt: 最近看到有人用Minecraft里面的红石电路制作出了计算器，还有一篇神文：《基于Minecraft实现的计算机工程》，视频在此，好像还能算浮点数、三角函数。我对红石不是太了解，那能不能用Hutton32做一个呢？经过不断尝试现在我的成果时能做出一个简单的加减法计算器和Ascii码显示阵列。
index_img: /img/hutton322.png
---

<script src="/three/Painter.js"></script>
<script src="/three/huttonjax.js"></script>
　　最近看到有人用Minecraft里面的红石电路制作出了计算器，还有一篇神文：《[基于Minecraft实现的计算机工程](http://tieba.baidu.com/p/2757006332)》，[视频在此](https://www.bilibili.com/video/BV1zs411o7q5/)，好像还能算浮点数、三角函数。我对红石不是太了解，那能不能用Hutton32做一个呢？经过不断尝试现在我的成果时能做出一个简单的加减法计算器和Ascii码显示阵列。
![加减法计算器](/img/hutton321.png) ![Ascii码显示阵](/img/hutton322.png)
## 什么是Hutton32？
<!--more-->
　　大家应该听说过生命游戏吧？这种在方格上根据相邻格子的状态不断演化的系统我们就叫细胞自动机。有一个强大的软件模拟计算包括生命游戏在内的细胞自动机超级快，它就是[Golly](http://golly.sourceforge.net/)。Hutton32也是一种细胞自动机规则(**冯诺依曼元胞自动机**的一种)，Golly里面自带有一些Demo，Hutton32的设计初衷是制造出自我复制更快的机器，模拟数字电路的自动机也有，叫wirreworld，Golly里面自带有一个NB的wirreworld的质数计算器。所以用golly玩转数字电路按理说该玩wirreworld，但wirreworld里的信号不连续，必须要处理“相位差”，像生命游戏一样不允许信号随意错位，调试很麻烦，所以我选择了Hutton32，但Hutton32与一般电路不同的是信号只能在导线中单向传输。（当然免去了二极管这种元件）
　　[点击这里](http://wenku.baidu.com/view/32b33b2ae2bd960590c67763.html)查看CFY关于冯诺依曼自动机的教程。
## 导线
我们用蓝导线里面的绿箭头作为信号载体。蓝导线里面的信号传到末端会译码：
*（Hint:点图就能能复制代码直接粘贴到Golly上运行哦）*
<canvas onload="showRLE(this,16,'x = 7, y = 25, rule = Hutton32\n6IM2$4IMIM2$2IM3IM2$I4MIM2$IM4IM2$2IMIMIM2$I2M3IM2$2I2M2IM2$IMI2MIM2$IMIMI2M2$2IMI3M2$2IM2I2M2$3I4M!')"></canvas> 翻译结果： <canvas onload="showRLE(this,16,'x = 8, y = 25, rule = Hutton32\n8I2$7IL2$7IJ2$6I2$6I.I2$6I.L2$6I.J2$6I.K2$6I.Q2$6I.S2$6I.T2$6I.R2$6I.pA!')"></canvas>
翻译结果是在末端产生新的箭头/菱形或执行退格等操作。这些操作适合Hutton32做很快的自我复制机，是Hutton32的研发初衷。

而红导线是特殊导线，里面的信号是紫箭头，红箭头中的信号传到末端，如果末端是蓝/绿箭头或棱形，蓝/绿箭头或棱形就将会消失，感觉像被“吃”掉了一样。我们只能用蓝导线里的信号通过菱形转换为红导线里信号：
<canvas onload="showRLE(this,16,'x = 10, y = 3, rule = Hutton32\n$2I3MpD2U2Q!')"></canvas>

## 菱形
菱形作用很广，可分为以下几类：
- 分叉器：要求必须一输入多输出，也兼有延迟器作用<br>
<canvas onload="showRLE(this,16,'x = 9, y = 5, rule = Hutton32\n$5.MIMI$IMIMIpB$5.MIMI!')"></canvas>
- 延迟器：一输入一输出<br>
<canvas onload="showRLE(this,16,'x = 8, y = 3, rule = Hutton32\nMIMIpBM2I2$MIMIMIMI!')"></canvas>
- 与门：要求必须多输入一输出，有输出时也有延迟作用
- 交叉器：要求必须二输入二输出，**无延迟**。<br>
<canvas onload="showRLE(this,16,'x = 7, y = 5, rule = Hutton32\n3.L$3.L$MIMpE2MI$3.L$3.L!')"></canvas>

注意下面这种情况任何信号都无法通过：


<canvas onload="showRLE(this,16,'x = 5, y = 5, rule = Hutton32\n2.J$2.J$2IpA2K$2.L$2.L!')"></canvas>

这是一种无用的状态，但如果我们改变Hutton32的规则我们能利用这种状态来制作小体积的非门！

## 信号及信号源

根据信号可以分成两类：连续信号和离散信号。其中如果要用离散信号做逻辑运算也得考虑相位差。
离散信号：<canvas onload="showRLE(this,16,'x = 16, y = 4, rule = Hutton32\n$.2IpAIM6IMIpA$.JOK!')"></canvas>
离散信号也可看做时钟信号，比如上面是以周期为7的时钟信号。（菱形作为分叉器有一代延迟）
连续信号：<canvas onload="showRLE(this,16,'x = 16, y = 4, rule = Hutton32\n$.2MpD10MpD$.N2O!')"></canvas>
它们可以相互转换：


- 离散->连续: 
可以用一个离散信号源和一个与门（一个多个输入、一个输出的菱形）把连续信号调制成离散信号。<br>
<canvas onload="showRLE(this,16,'x = 16, y = 5, rule = Hutton32\n$5MpAIM6IMI$5.J$3.LKpA$3.2IN!')"></canvas>
- 连续->离散: 
直接用菱形（一个输入、多个输出） 的分岔功能即可。<br>
<canvas onload="showRLE(this,16,'x = 16, y = 5, rule = Hutton32\n$7.M2ILMP$2IM4IpAMpAIpCP$7.M3I5M!')"></canvas>


## 逻辑门


#### 或门
或门最简单：两个信号直接汇到一起即可。
<canvas onload="showRLE(this,16,'x = 7, y = 5, rule = Hutton32\n3.P$3.P$3.L$2M5I!')"></canvas>
#### 与门
我们要利用Hutton32绿色菱形的一个与门特性：有多个输入、一个输出的菱形就是与门。
<canvas onload="showRLE(this,16,'x = 16, y = 5, rule = Hutton32\n2.P9.L$2.P9.L$2MpD2MpD3.3MpA2IpA$12.J$12.J!')"></canvas>
双/三输入与门
#### 非门
非门有点复杂。单靠蓝导线和菱形是无法实现的。非门不输入信号(0)要有输出(1)说明非门必须自带信号源。红箭头有消掉蓝箭头的功能，所以我们可以在信号来时把它变成红箭头来抑制信号源发出信号从而实现非门。但这对离散信号才管用：因为红箭头来抑制信号源发出后只有离散周期大于5的信号才能重新翻译成向前的蓝箭头把导线重新连接。所以我们可以先把连续信号转换成离散信号，通过红箭头后再转换回连续信号。
<canvas onload="showRLE(this,16,'x = 10, y = 8, rule = Hutton32\n2.2IpAIL$.IpAIpAQL$.JL.JLpAL$.JO.J3L$4IJLpAL$5.I2L$5.LpAL$5.4IpA!')"></canvas>
这个机器有点复杂，当然这种非门的延迟是很严重的。
<canvas onload="showRLE(this,16,'x = 10, y = 8, rule = Hutton32\n2.2IpAML$.MpAIpAQ$.JL.NLpAL$.JK.N3L$4MNLpAL$5.I2L$5.LpAL$5.4IpA!')"></canvas><canvas onload="showRLE(this,16,'x = 10, y = 8, rule = Hutton32\n2.2IpAIL$.IpCIpAQP$.JL.JLpAL$.JK.J3L$4IJLpAL$5.M2P$5.LpBP$5.2I2MpD!')"></canvas> (高低电平工作状态)

## 数码管
最经典的7段数码管用来显示数字，在Hutton32里面还是很好做的。其中左下角是7段译码器，由一些或门构成。
<canvas onload="showRLE(this,2,'x = 122, y = 183, rule = Hutton32\n89.IL.IL.IL.IL$58.31IpA2IpA2IpA2IpAIL$57.IJ41.L$56.IJ.L41K$55.IJ2.42IL$54.IJ.L44K$53.IJ2.46IL$52.IJ.L48K$51.IJ2.50IL$50.IJ.L52K$49.IJ2.54IL$48.IJ.L56K$45.3IJ2.58IL$44.IJ3.L60K.LK$43.IJ.IL.58I2L3KpA$42.IJ2.JL3.L56KLIL.J2K$41.IJ.ILJLIL.54I2L2KJL2.JpA$40.IJ2.JLJLJL3.L52KLILJLIL.J2K$39.IJ.ILJLJLJLIL.50I2L2KJLJLJL2.JpA$38.IJ2.JLJLJLJLJL3.L48KLILJLJLJLIL.J2K$37.IJ.ILJLJLJLJLJLIL.46I2L2KJLJLJLJLJL2.JpA$36.IJ2.JLJLJLJLJLJLJL3.L44KLILJLJLJLJLJLIL.JK$33.3IJ.ILJLJLJLJLJLJLJLIL.42IKL2KJLJLJLJLJLJLJL2.JK$33.J2IL.JLJLJLJLJLJLJLJLJL23.pA20.LILJLJLJLJLJLJLJLIL.JK$33.2JpAILJLJLJLJLJLJLJLJLJ2L43.LJLJLJLJLJLJLJLJLJL2.J$33.JIJ.LJLJLJLJLJLJLJLJLJLJ43.LJLJLJLJLJLJLJLJLJ2L.J$33.2JpA.LJLJLJLJLJLJLJLJLJLJ43.LJLJLJLJLJLJLJLJLJLJ.J$33.JIJ.LJLJLJLJLJLJLJLJLJLJ43.LJLJLJLJLJLJLJLJLJLJ.J$33.2JpA.LJLJLJLJLJLJLJLJLJLJ43.LJLJLJLJLJLJLJLJLJLJ.J$33.JIJ.LJLJLJLJLJLJLJLJLJLJpA42.LJLJLJLJLJLJLJLJLJLJ.J$33.2JpA.LJLJLJLJLJLJLJLJLJLJ43.LJLJLJLJLJLJLJLJLJLJ.J$33.J.J.LJLJLJLJLJLJLJLJLJLJpA39.pA2.LJLJLJLJLJLJLJLJLJLJ.J$33.J.J.LJLJLJLJLJLJLJLJLJLJ39.pA3.LJLJLJLJLJLJLJLJLJLJ.J$33.J.J.LJLJLJLJLJLJLJLJLJLJ38.pA4.LJLJLJLJLJLJLJLJLJLJ.J$33.J.J.LJLJLJLJLJLJLJLJLJLJ37.pA.pA3.LJLJLJLJLJLJLJLJLJLJ.J$33.J.J.LJLJLJLJLJLJLJLJLJLJ43.LJLJLJLJLJLJLJLJLJLJ.J$33.J.J.LJLJLJLJLJLJLJLJLJLJ37.pA.pA3.LJLJLJLJLJLJLJLJLJLJ.J$33.J.J.LJLJLJLJLJLJLJLJLJLJ43.LJLJLJLJLJLJLJLJLJLJ.J$33.J.J.LJLJLJLJLJLJLJLJLJLJ43.LJLJLJLJLJLJLJLJLJLJ.J$33.J.J.LJLJLJLJLJLJLJLJLJLJ43.LJLJLJLJLJLJLJLJLJLJ.J$33.J.J.LJLJLJLJLJLJLJLJLJLJ43.LJLJLJLJLJLJLJLJLJLJ.J$33.J.J.LJLJLJLJLJLJLJLJLJLJ43.LJLJLJLJLJLJLJLJLJLJ.J$33.J.J.LJLJLJLJLJLJLJLJLJLJ43.LJLJLJLJLJLJLJLJLJLJ.J$33.J.J.LJLJLJLJLJLJLJLJLJLJ43.LJLJLJLJLJLJLJLJLJLJ.J$33.J.J.LJLJLJLJLJLJLJLJLJLJ43.LJLJLJLJLJLJLJLJLJLJ.J$33.J.J.LJLJLJLJLJLJLJLJLJLJ43.LJLJLJLJLJLJLJLJLJLJ.J$33.J.J.LJLJLJLJLJLJLJLJLJLJ43.LJLJLJLJLJLJLJLJLJLJ.J$33.J.J.LJLJLJLJLJLJLJLJLJLJ43.LJLJLJLJLJLJLJLJLJLJ.J$33.J.J.LJLJLJLJLJLJLJLJLJLJ43.LJLJLJLJLJLJLJLJLJLJ.J$33.J.J.LJLJLJLJLJLJLJLJLJLJ43.LJLJLJLJLJLJLJLJLJLJ.J$33.J.J.LJLJLJLJLJLJLJLJLJLJ43.LJLJLJLJLJLJLJLJLJLJ.J$33.J.J.LJLJLJLJLJLJLJLJLJLJ43.LJLJLJLJLJLJLJLJLJLJ.J$33.J.J.LJLJLJLJLJLJLJLJLJLJ43.LJLJLJLJLJLJLJLJLJLJ.J$33.J.J.LJLJLJLJLJLJLJLJLJLJ43.LJLJLJLJLJLJLJLJLJLJ.J$33.J.J.LJLJLJLJLJLJLJLJLJLJ43.LJLJLJLJLJLJLJLJLJLJ.J$33.J.J.LJLJLJLJLJLJLJLJLJLJ43.LJLJLJLJLJLJLJLJLJLJ.J$33.J.J.LJLJLJLJLJLJLJLJLJLJ43.LJLJLJLJLJLJLJLJLJLJ.J$33.J.J.LJLJLJLJLJLJLJLJLJLJ43.LJLJLJLJLJLJLJLJLJLJ.J$33.J.J.LJLJLJLJLJLJLJLJLJLJ43.LJLJLJLJLJLJLJLJLJLJ.J$33.J.J.LJLJLJLJLJLJLJLJLJLJ43.LJLJLJLJLJLJLJLJLJLJ.J$33.J.J.LJLJLJLJLJLJLJLJLJLJ43.LJLJLJLJLJLJLJLJLJLJ.J$33.J.J.LJLJLJLJLJLJLJLJLJLJ22.pA.pA.pA16.LJLJLJLJLJLJLJLJLJLJ.J$33.J.J.LJLJLJLJLJLJLJLJLJLJ43.LJLJLJLJLJLJLJLJLJLJ.J$33.J.J.LJLJLJLJLJLJLJLJLJIJ22.pA.pA.pA16.LJLJLJLJLJLJLJLJLJLJ.J$33.J.J.LJLJLJLJLJLJLJLJLJ45.LJLJLJLJLJLJLJLJLJIJ.J$33.J.J.IJLJLJLJLJLJLJLJIJ.L43KLJLJLJLJLJLJLJLJLJ3.J$33.J.J3.LJLJLJLJLJLJLJ3.42ILJIJLJLJLJLJLJLJLJIJ3.J$33.J.J3.IJLJLJLJLJLJIJ.L44KJ2KLJLJLJLJLJLJLJ5.J$33.J.J5.LJLJLJLJLJ3.46ILJIJLJLJLJLJLJIJ5.J$33.J.J5.IJLJLJLJIJ.L48KJ2KLJLJLJLJLJ7.J$33.J.J7.LJLJLJ3.50ILJIJLJLJLJIJ7.J$33.J.J7.IJLJIJ.L52KJ2KLJLJLJ9.J$33.J.J9.LJ3.54ILJIJLJIJ9.J$33.J.J9.IJ.L56KJ2KLJ11.J$33.J.J12.58ILJIJ11.J$33.J.J10.L60KJ6K7.J$33.J.J7.IL.58I2L6KJpA7.J$33.J.J7.JL3.L56KLIL2.JpA.J2K5.J$33.J.J5.ILJLIL.54I2L2KJL3.J2KJpA5.J$33.J.J5.JLJLJL3.L52KLILJLIL2.JpA.J2K3.J$32.IJ.J3.ILJLJLJLIL.50I2L2KJLJLJL3.J2KJpA3.J$31.IJ2.J3.JLJLJLJLJL3.L48KLILJLJLJLIL2.JpA.J2K.J$28.3IJ2.IJ.ILJLJLJLJLJLIL.46I2L2KJLJLJLJLJL3.J2KJpA.J$28.J4.IJ2.JLJLJLJLJLJLJL3.L44KLILJLJLJLJLJLIL2.JpA.JK$28.J.3IJ.ILJLJLJLJLJLJLJLIL.42IKL2KJLJLJLJLJLJLJL3.JK.J$28.J.J4.JLJLJLJLJLJLJLJLJL44.LILJLJLJLJLJLJLJLIL2.J.J$28.J.J.2ILJLJLJLJLJLJLJLJLJ2L43.LJLJLJLJLJLJLJLJLJL2.J.J$28.J.J.JKLJLJLJLJLJLJLJLJLJLJ43.LJLJLJLJLJLJLJLJLJ2L.J.J$28.J.J.pAJLJLJLJLJLJLJLJLJLJLJ43.LJLJLJLJLJLJLJLJLJLJ.J.J$28.J.J.JKLJLJLJLJLJLJLJLJLJLJ43.LJLJLJLJLJLJLJLJLJLJ.J.J$28.J.J.pAJLJLJLJLJLJLJLJLJLJLJ43.LJLJLJLJLJLJLJLJLJLJ.J.J$28.J.J.JKLJLJLJLJLJLJLJLJLJLJ43.LJLJLJLJLJLJLJLJLJLJ.J.J$28.J.J.pAJLJLJLJLJLJLJLJLJLJLJ43.LJLJLJLJLJLJLJLJLJLJ.J.J$28.J.J.JKLJLJLJLJLJLJLJLJLJLJ43.LJLJLJLJLJLJLJLJLJLJ.J.J$28.J.J.pAJLJLJLJLJLJLJLJLJLJLJ43.LJLJLJLJLJLJLJLJLJLJ.J.J$28.J.J.J.LJLJLJLJLJLJLJLJLJLJ43.LJLJLJLJLJLJLJLJLJLJ.J.J$28.J.J.J.LJLJLJLJLJLJLJLJLJLJ43.LJLJLJLJLJLJLJLJLJLJ.J.J$28.J.J.J.LJLJLJLJLJLJLJLJLJLJ43.LJLJLJLJLJLJLJLJLJLJ.J.J$28.J.J.J.LJLJLJLJLJLJLJLJLJLJ43.LJLJLJLJLJLJLJLJLJLJ.J.J$28.J.J.J.LJLJLJLJLJLJLJLJLJLJ.pA41.LJLJLJLJLJLJLJLJLJLJ.J.J$28.J.J.J.LJLJLJLJLJLJLJLJLJLJ39.pA.pA.LJLJLJLJLJLJLJLJLJLJ.J.J$28.J.J.J.LJLJLJLJLJLJLJLJLJLJpA.pA37.pA2.LJLJLJLJLJLJLJLJLJLJ.J.J$28.J.J.J.LJLJLJLJLJLJLJLJLJLJ39.pA.pA.LJLJLJLJLJLJLJLJLJLJ.J.J$28.J.J.J.LJLJLJLJLJLJLJLJLJLJ43.LJLJLJLJLJLJLJLJLJLJ.J.J$28.J.J.J.LJLJLJLJLJLJLJLJLJLJ43.LJLJLJLJLJLJLJLJLJLJ.J.J$28.J.J.J.LJLJLJLJLJLJLJLJLJLJ43.LJLJLJLJLJLJLJLJLJLJ.J.J$28.J.J.J.LJLJLJLJLJLJLJLJLJLJ43.LJLJLJLJLJLJLJLJLJLJ.J.J$28.J.J.J.LJLJLJLJLJLJLJLJLJLJ43.LJLJLJLJLJLJLJLJLJLJ.J.J$28.J.J.J.LJLJLJLJLJLJLJLJLJLJ43.LJLJLJLJLJLJLJLJLJLJ.J.J$28.J.J.J.LJLJLJLJLJLJLJLJLJLJ43.LJLJLJLJLJLJLJLJLJLJ.J.J$28.J.J.J.LJLJLJLJLJLJLJLJLJLJ43.LJLJLJLJLJLJLJLJLJLJ.J.J$28.J.J.J.LJLJLJLJLJLJLJLJLJLJ43.LJLJLJLJLJLJLJLJLJLJ.J.J$28.J.J.J.LJLJLJLJLJLJLJLJLJLJ43.LJLJLJLJLJLJLJLJLJLJ.J.J$28.J.J.J.LJLJLJLJLJLJLJLJLJLJ43.LJLJLJLJLJLJLJLJLJLJ.J.J$28.J.J.J.LJLJLJLJLJLJLJLJLJLJ43.LJLJLJLJLJLJLJLJLJLJ.J.J$28.J.J.J.LJLJLJLJLJLJLJLJLJLJ43.LJLJLJLJLJLJLJLJLJLJ.J.J$28.J.J.J.LJLJLJLJLJLJLJLJLJLJ43.LJLJLJLJLJLJLJLJLJLJ.J.J$28.J.J.J.LJLJLJLJLJLJLJLJLJLJ43.LJLJLJLJLJLJLJLJLJLJ.J.J$28.J.J.J.LJLJLJLJLJLJLJLJLJLJ43.LJLJLJLJLJLJLJLJLJLJ.J.J$28.J.J.J.LJLJLJLJLJLJLJLJLJLJ43.LJLJLJLJLJLJLJLJLJLJ.J.J$28.J.J.J.LJLJLJLJLJLJLJLJLJLJ43.LJLJLJLJLJLJLJLJLJLJ.J.J$28.J.J.J.LJLJLJLJLJLJLJLJLJLJ43.LJLJLJLJLJLJLJLJLJLJ.J.J$28.J.J.J.LJLJLJLJLJLJLJLJLJLJ43.LJLJLJLJLJLJLJLJLJLJ.J.J$28.J.J.J.LJLJLJLJLJLJLJLJLJLJ43.LJLJLJLJLJLJLJLJLJLJ.J.J$28.J.J.J.LJLJLJLJLJLJLJLJLJLJ43.LJLJLJLJLJLJLJLJLJLJ.J.J$28.J.J.J.LJLJLJLJLJLJLJLJLJIJ19.pA.pA21.LJLJLJLJLJLJLJLJLJLJ.J.J$28.J.J.J.LJLJLJLJLJLJLJLJLJIL43.LJLJLJLJLJLJLJLJLJIJ.J.J$28.J.J.J.IJLJLJLJLJLJLJLJI2JL19.pA.pA21.LJLJLJLJLJLJLJLJLJ3.J.J$28.J.J.J3.LJLJLJLJLJLJLJ2IJ42IL.IJLJLJLJLJLJLJLJIJ2.IJ.J$28.J.J.J3.IJLJLJLJLJLJI2JL44K3.LJLJLJLJLJLJLJ3.IJ.IJ$28.J.J.J5.LJLJLJLJLJ2IJ46IL.IJLJLJLJLJLJIJ2.IJ.IJ.I$28.J.J.J5.IJLJLJLJI2JL48K3.LJLJLJLJLJ3.IJ.IJ.IJ$28.J.J.J7.LJLJLJ2IJ50IL.IJLJLJLJIJ2.IJ.IJ.IJ$28.J.J.J7.IJLJI2JL52K3.LJLJLJ3.IJ.IJ.IJ$28.J.J.J9.LJ2IJ54IL.IJLJIJ2.IJ.IJ.IJ$28.J.J.J9.I2JL56K3.LJ3.IJ.IJ.IJ$28.J.J.J7.4IJ58IL.IJ2.IJ.IJ.IJ$28.J.J.J6.IJ2.L60K4.IJ.IJ.IJ$28.J.J.J5.IJ3.58IL5.IJ.IJ.IJ$28.J.J.J4.IJ6.L56K4.IJ.IJ.IJ$28.J.J.J3.IJ7.54IL5.IJ.IJ.IJ$28.J.J.J2.IpAJ9.L52K4.IJ.IJ.IJ$28.J.J.J.IJ11.50IL5.IJ.IJ.IJ$28.J.J.J.pAJ13.L48K4.IJ.IJ.IJ$28.J.J.J.JK13.46IL5.IJ.IJ.IJ$28.J.J.J.pAJ15.L44K4.IJ.IJ.IJ$28.J.J.J.JK15.43IK4.IJ.IJ.IJ$28.J.J.J.pAJ62.IJ.IJ.IJ$28.J.J.J.J.62IJ.IJ.IJ$28.J.J.J.J.J62.IJ.IJ$28.J.J.J.J.J.61IJ.IJ$28.J.J.J.J.J.J61.IJ$28.J.J.J.J.J.J.60IJ$28.J.J.J.J.J.J.J$28.J.J.J.J.J.J.J$28.J.J.J.J.J.J.J$28.J.J.J.J.J.J.J$28.J.J.J.J.J.J.J$pA27IJ.J.J.J.J.J.J$J3.J2.J5.pAL.J2.J2.J2.pAL3.J.J.J.J.J.J$J3.J2.J5.JL.J2.J2.J2.JL3.J.J.J.J.J.J$pA3IpA2IpA5IpA2IpA2IpA2IpA2IpA4IJ.J.J.J.J.J$J3.J2.J2.J2.J2.J2.J2.J2.J6.J.J.J.J.J$J3.pAL.J2.J2.J2.pAL.J2.pAL.J6.J.J.J.J.J$J3.JL.J2.J2.J2.JL.J2.JL.J6.J.J.J.J.J$pA3IpA2IpA2IpA2IpA2IpA2IpA2IpA2IpA6IJ.J.J.J.J$J3.J2.J2.J2.J2.J2.J2.J2.J8.J.J.J.J$J3.pAL.pAL.J2.pAL.pAL.J2.pAL.pAL7.J.J.J.J$J3.JL.JL.J2.JL.JL.J2.JL.JL7.J.J.J.J$pA3IpA2IpA2IpA2IpA2IpA2IpA2IpA2IpA8IJ.J.J.J$J3.J2.J2.J2.J2.J2.J2.J2.J10.J.J.J$J3.J2.pAL.pAL.pAL.pAL.pAL.pAL.pAL9.J.J.J$J3.J2.JL.JL.JL.JL.JL.JL.JL9.J.J.J$pA3IpA2IpA2IpA2IpA2IpA2IpA2IpA2IpA10IJ.J.J$J.J.J2.J2.J2.J2.J2.J2.J2.J12.J.J$J.J.J2.pAL.pAL.pAL.pAL.J2.pAL.pAL11.J.J$J.J.J2.JL.JL.JL.JL.J2.JL.JL11.J.J$J.J.pA2IpA2IpA2IpA2IpA2IpA2IpA2IpA12IJ.J$J.J.J2.J2.J2.J2.J2.J2.J2.J14.J$JLpA.pAL.pAL.pAL.J2.J2.pAL.pAL.pAL13.J$JLJ.JL.JL.JL.J2.J2.JL.JL.JL13.J$pAIpAIpA2IpA2IpA2IpA2IpA2IpA2IpA2IpA14IJ$J.J.J2.J2.J2.J2.J2.J2.J2.J!')"></canvas>
左下角译码器放大版：
<canvas onload="showRLE(this,8,'x = 28, y = 25, rule = Hutton32\npA27I$J3.J2.J5.pAL.J2.J2.J2.pAL$J3.J2.J5.JL.J2.J2.J2.JL$pA3IpA2IpA5IpA2IpA2IpA2IpA2IpA2I$J3.J2.J2.J2.J2.J2.J2.J2.J$J3.pAL.J2.J2.J2.pAL.J2.pAL.J$J3.JL.J2.J2.J2.JL.J2.JL.J$pA3IpA2IpA2IpA2IpA2IpA2IpA2IpA2IpA2I$J3.J2.J2.J2.J2.J2.J2.J2.J$J3.pAL.pAL.J2.pAL.pAL.J2.pAL.pAL$J3.JL.JL.J2.JL.JL.J2.JL.JL$pA3IpA2IpA2IpA2IpA2IpA2IpA2IpA2IpA2I$J3.J2.J2.J2.J2.J2.J2.J2.J$J3.J2.pAL.pAL.pAL.pAL.pAL.pAL.pAL$J3.J2.JL.JL.JL.JL.JL.JL.JL$pA3IpA2IpA2IpA2IpA2IpA2IpA2IpA2IpA2I$J.J.J2.J2.J2.J2.J2.J2.J2.J$J.J.J2.pAL.pAL.pAL.pAL.J2.pAL.pAL$J.J.J2.JL.JL.JL.JL.J2.JL.JL$J.J.pA2IpA2IpA2IpA2IpA2IpA2IpA2IpA2I$J.J.J2.J2.J2.J2.J2.J2.J2.J$JLpA.pAL.pAL.pAL.J2.J2.pAL.pAL.pAL$JLJ.JL.JL.JL.J2.J2.JL.JL.JL$pAIpAIpA2IpA2IpA2IpA2IpA2IpA2IpA2IpA2I$J.J.J2.J2.J2.J2.J2.J2.J2.J!')"></canvas>
输入有10根线，代表0-9，输出7根线，分别点亮对应的灯管。

好了，有了这些部件下一步就是组合它们，实现加法、减法、锁存、译码等各种数字电路中的那些功能！
(未完待续)