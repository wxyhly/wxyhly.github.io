---
title: 大数数学简介
tags:
  - 大数数学
  - Javascript
  - 数学
  - 游戏
date: 2024-08-25 23:49:15
index_img: /img/ord008.png
excerpt: 大数数学研究如何描述尽可能大的数字。序数是介于有限的自然数与绝对无穷大之间的东西，是自然数的扩展。很久前我就听说过序数，但我总觉得这些超越无穷的东西很虚，当时也没兴趣深入了解它，去年 CFY 突然对“大数数学”与“序数”产生兴趣，还安利了个“序数增量”游戏 Ordinal Markup 给我，后来我才发现这个东西比想象中更有意思。
---
![快增长层级函数可以通过不断套娃把序数转换为超级大的大数](/img/ord008.png?size=300x)

去年[CFY](https://hadroncfy.com/)突然对“大数数学”与“序数”产生兴趣，还安利了个“序数增量”游戏[Ordinal Markup](https://patcailmemer.github.io/Ordinal-Markup/)给我，然后我就不幸成功入坑了。![极限序数$\omega^\omega$之前的所有序数](/img/ord001.png)<!--more-->

很久前我就听说过序数，但我总觉得这些超越无穷的东西很虚，当时也没兴趣深入了解它，后来我才发现这个东西比想象中更有意思。

注：由于网络上有很多大数数学教程，这篇文章只起个抛砖引玉的作用，不会详细解释具体细节。

## 大数数学是什么
“大数数学”研究如何描述尽可能大的数字。如果你觉得这很简单那就太天真了，这群人研究的大数大得远超你的任何想象：这些数的位数的位数后面的零都多得在即使把整个宇宙都塞满的本子上都写不完，其实甚至它位数的位数的位数...的位数的位数要想小到我们通常能接触到的数字，把前半句中那个省略号展开写出来整个宇宙的纸张都还是写不下！这些数字虽然巨大但都是有限的，在这场比谁描述的数字大的游戏中，绝对无穷是禁止参赛的。

系统描述这些数字一般采用迭代法，比如第一级运算**加法**其实是第零级运算**后继**（后继就是往后数一个数，相当于加一）的迭代，第二级运算**乘法**是第一级运算**加法**的迭代、第三级运算**幂**又是**乘法**的迭代……可以统一记作：$a\uparrow^n b$表示a与b之间进行第$n$级运算。不要以为就到此为止了，我们还可以继续套娃：设函数$f(n)=3\uparrow^n 3$，不断嵌套64层运算级数，得到一个大的离谱的怪物$f(f(f(f...f(f(3))...)))$，叫做[葛立恒数](https://zhuanlan.zhihu.com/p/20057020)，它来自一个数学问题答案的上界值，然而到这里才是大数数学的入门。其他有意思的大数还有Tree(3)、燃烧数、Loader数、忙碌海狸（Busy beaver）等，[这篇文章都有介绍](https://daily.zhihu.com/story/9217392)。

如果想继续了解大数数学，可以参考[文后给的链接](#reference)。
## 序数登场
下面来说说大数数学的主角——序数。序数是介于有限的自然数与绝对无穷大之间的东西，是自然数的扩展。序数并不是什么民科概念，它是在公认的数学基础公理体系--ZFC集合论中严格定义出来的。在集合论中每个自然数都是一个集合，它恰好由比它小的所有数字组成，而零则是空集：
$$0=\left\\{\right\\}=\phi$$$$1=\left\\{0\right\\}$$$$2=\left\\{0,1\right\\}$$$$3=\left\\{0,1,2\right\\}$$$$...$$观察不难发现$x+1=x\cup\left\\{x\right\\}$，比如$5=\left\\{0,1,2,3,4\right\\}$，$6=5\cup\left\\{5\right\\}=\left\\{0,1,2,3,4,5\right\\}$
全体自然数的集合$\left\\{0,1,2,3,....\right\\}$当然不再是自然数，但如果强行也把它当成一个数处理，我们就能够超越无穷，继续往上数数，这就是“序数”。记$\omega=\left\\{0,1,2,3,....\right\\}$则$$\omega+1=\omega\cup\left\\{\omega\right\\}$$这样下来就有$$\omega+2$$$$\omega+3$$$$...$$而包含上述所有序数的数就叫$\omega+\omega$，也记作$\omega2$。这样不断扩展会到$\omega3$、$\omega4$、直到极限$\omega^2$，然后继续到$\omega^2+1$、$\omega^2+\omega$、$\omega^2 2$、$\omega^3$等等。我们看到一个序数要么是后继序数：由一个序数加一得到，要么是极限序数：由囊括前面无数个序数得到。虽然有极限序数这个东西，但跟自然数一样，永远不存在最大的序数：只需对这个序数加一就是了。

<div style="background-color:var(--color-EEF)">

选读：这样一直罗列下去可以到$\omega^\omega$、$\omega^{\omega^\omega}$或许你会认为再后面就是$\omega\uparrow^4 \omega$、$\omega\uparrow^\omega \omega$、$\omega\uparrow^{\omega\uparrow^\omega \omega} \omega$等等，但由于涉及无穷，序数之间的很多运算法则与自然数不同，比如加法、乘法不再有交换律（$2\omega$表示$\omega$个2相加，极限还是$\omega$；两个$\omega$相加才能得到更大的$\omega 2$）没法推广到乘方之后的第四级运算了，后面只能不断引入指数塔迭代的许多不动点、不动点的不动点的不动点……来继续进行，详情见后面链接序数教程中的veblen $\varphi$ 函数。</div>

序数有什么用呢？利用它们可以描述一些增长率大得惊人的函数进而表示一些大数，即各种快慢的“增长层级函数”，详见后面的链接。序数也是衡量大数函数增长率的一把标尺。可以说要**掌握大数数学，序数是最基础最重要的工具**了。比如那个“葛立恒数”，用快增长层级（FGH）函数表示仅为$f_{\omega+1}(64)$，这么大的数字对应的序数为何才这么小？简单来说，这些迭代函数的套娃次数可以用一些方法与序数对应。比如加法是由后继不断迭代（即一次“套娃”）来的，因此它增长率对应的序数为1，乘法则为2，第n级运算则为n。但如果函数的自变量是运算级数n本身，如$f(n)=3\uparrow^n 3$，它的增长率自然大于之前所有自然数套娃次数的函数增长速度，此时大于一切自然数的序数$\omega$便来救场了。当我们构造葛立恒数时，我们又对这个运算级数n进行了一次套娃，因此对应序数$\omega+1$，可想而知，继续不断套娃可以得到更大的后继序数，然后如果再把套娃次数作为函数自变量则得到极限序数，然后就又可以继续没完没了套娃下去，大数函数增长率跟序数一样永远没有尽头……准确对这些增长率的定义与分析可见[这篇文章](https://zhuanlan.zhihu.com/p/655052497?utm_id=0)。

本文开头的那张“封面图”就是展示的快增长序列函数是如何套娃的：<img style="max-width:300px" src="/img/ord008.png" alt="快增长层级函数可以通过不断套娃把序数转换为超级大的大数"/>

个人认为，正是因为序数可以作为衡量大数函数增长率的标尺，序数这一抽象的数学概念才拥有了实际“接地气”的用途，而不仅仅是集合论中定义出来的超越无穷的无用玩物。大数数学本身又有什么用呢？除了大家能想到的数学家搞研究当消遣外我还打听到了这样的故事：
> 我大一和高中学了很多数理逻辑和集合论，一直以为这是科幻里最难写的、最用不怎么到的数学，结果这也能用上，没想到竟然还很火，因为那些人论战，喜欢比战斗力大小，比大小怎么比... 比到最后只能上序数论、基数论……

不得不说大数数学的这个用途真让人意想不到。<a name="reference"></a>

## 大数理论相关资料汇总
如果想继续深入了解大序数，可以参考下面的链接：
### 科普类
- [Matrix67大佬博文](http://www.matrix67.com/blog/archives/3857)中详细介绍了超级幂等运算，并提到$100\uparrow^{100} 100$已经随随便便远远.......远远大于宇宙中粒子随意排列组合出的数量了。
- [大数维基百科上的大数列表](https://googology.fandom.com/zh/wiki/%E5%A4%A7%E6%95%B8%E5%88%97%E8%A1%A8)
- [b站的从1到无穷大之间的大数列举视频](https://www.bilibili.com/video/BV13G411X7xm/)（全长9小时54分钟）
- Codeparade（就是游戏4D高尔夫的作者！）的[“找到最大的数字”视频](https://www.youtube.com/watch?v=Mzgw6zMtipQ)
<!-- - [知乎专栏《大数的世界》](https://www.zhihu.com/column/c_1561069709323083776)通过生动的故事将大数、大序数、大基数等概念形象化。 （算了，该专栏其实没啥特别值得推荐的东西）-->
- 仿[《GEB》](https://book.douban.com/subject/1291204/)的乌龟与阿基里斯的对话写的关于介绍序数的小故事（可惜我最先看的中文版找不到了，[原文是法语](http://www.madore.org/~david/misc/VIRUS/ordinals/ordinals.html)）
### 教程类
- [曹知秋的《大数理论》（动态更新中）](https://github.com/ZhiqiuCao/Googology) ：迄今为止关于大数最全面系统的大数数学中文讲义，没有之一。（前面github链接打不开的话这里还有个[网盘链接（240807版）](https://pan.baidu.com/link/zhihu/79h1zTuNhYi0VFh1gDM0l2k2NxUE5WNQUPlE==)）
- [知乎上core.exe的序数教程](https://www.zhihu.com/people/core-exe/)，很详细，从第n级运算、快速增长层级讲到序数、Veblen函数、OCF、反射等概念。
- [知乎上Suzuka梅天狸的序数教程](https://www.zhihu.com/people/zhou-zheng-60-81/)，讲了Prss、BMS、反射、稳定、Y-序列等概念。
### 工具类
- [Naruyoko的大数相关计算工具](https://naruyoko.github.io/googology/)：包括BMS与0-Y序列的转换器、各种Y序列的山脉图、基本列在线计算器等等，他还实现了很多我完全没听说的大数记号的在线计算。
- [序数浏览器](https://rgetar.github.io/)，强烈推荐，可以任意展开极限序数的基本列，还可以选择你喜欢的序数表示方式。

![序数浏览器展开序数的基本列](/img/ord002.png)
![序数浏览器设置将所有东西都用“0”、“[c]”（相当于$\Omega$）、“+”与BOCF$\psi$函数表示](/img/ord003.png)
- 我自己写的[序数地图](/ordmap/)，类似序数浏览器，但用的是一种更形象的方法来展现序数：直接像在线地图那样缩放就能找到所有序数（目前最大序数可到EBO，支持BOCF/MOCF与Veblen表示，后续可能计划支持递归不可达序数I等），不用去点任何什么展开按钮。

![起点附近的序数地图](/img/ord006.png)
操作提示: 
1.手机端拖拽屏幕空白部分平移地图，点击加减号缩放。按住加减号不放往右边滑动可加速缩放。
2.电脑端鼠标按住拖拽平移地图，滚轮缩放，按键盘T/G可调节缩放速率，按W/S键可调节迭代绘制深度。
![序数地图中的序元Veblen函数与BOCF函数](/img/ord005.png)
## 非递归序数
序数是一个开了挂般的存在。如果你认为只要不断取后继与取极限就能得到所有序数，你就错了。非递归序数定义为不能通过小于它本身次数的套娃得到的数，这样我们无法自下而上构造出非递归序数。在序数坍缩函数中会遇到非递归序数$\Omega$，用它可以生成更小的递归序数，这很类似通过快增长层级函数与无限的序数生成有限大数。下图展示了大数、递归序数、非递归序数三个层次的关系：![大数、递归序数、非递归序数三个层次的关系](/img/ord002.svg)你可能会疑惑非递归序数是否仅仅是产生递归序数的工具而无实际意义，然而事实上确实存在一些增长速率大于了一切递归函数的函数，其对应的序数就是非递归的。假设有一台理论上拥有无限大内存、整数计算不会溢出的计算机，定义函数f(n)的值为“用n个字符写成的某语言程序能在该计算机上输出的最大数字”，该函数的增长率就非常恐怖，是非递归的，这个函数也是不可计算函数的最著名的一个例子。[曹知秋的《大数理论》](https://github.com/ZhiqiuCao/Googology)最大输出程序一节中给出了javascript语言对应的最大输出函数的部分值，并附有解析。然而由于人类和计算机都完成不了超越递归的任务，这些非递归函数不可能有算法实现，于是我们通常的堆大数、大序数都仅限于递归序数，在这种意义下非递归序数确实只是个生产递归序数的工具。
### 基数与序数
要指出的是，还有一个概念叫**基数**（Cardinal），跟**序数**（Ordinal）很像，都描述的是超越无穷的东西，但它们的差距很大。基数没有任何层次结构，它单纯通过集合间能否建立起双射来衡量无穷集合内元素的多少。序数与基数可以当时转换：忽略掉序数的序结构单纯看集合的个数就能把序数变成基数，而给一个基数，我们认为元素个数等于该基数的最小的序数就是该基数转换得到的序数。前面介绍的那些序数虽然非常大，哪怕到了BHO、EBO甚至上Y-序列，得到的序数仍然都是可数的，也就是跟自然数一样多，它们的基数都是一样大的，记作$\aleph_0$。（注：非递归序数也可能可数，但不可数则一定不是递归序数了）有了$\aleph_0$，下一个比它大的基数就是$\aleph_1$、$\aleph_2$……$\aleph_\omega$……，由于基数也能当成序数，所以自然也有$\aleph_\omega=\aleph_{\aleph_0}$，那么接着就有$\aleph_{\aleph_{\aleph_{...}} }$……。著名的连续统假设就是在说，不存在介于实数的个数（$2^{\aleph_0}$）与自然数的个数（$\aleph_0$）之间的基数，即假设$\aleph_1 = 2^{\aleph_0}$。连续统假设独立于ZFC集合论，即你可以选择认为它是正确或错误的，分别建立出的理论都不会包含矛盾。

在玩了很久序数游戏，有看了很多这些集合论的东西后，我突然想知道序数理论的基础--ZFC集合论到底是什么呢？顺便说一句，后期构造大序数的方法反射序数、稳定序数等概念等是要在集合论里定义的。除了堆各种大序数，我们还可以继续堆大基数。为了了解这些东西就必须要入数理逻辑和形式系统这个坑，我们将在下一篇文章来填这个坑。

## 序数学习顺序建议

1. 首先从序数的加法、乘法、指数运算开始，理解$\varepsilon_0$，
2. 理解不动点迭代模式，理解$\varepsilon_1$、$\varepsilon_\omega$、$\varepsilon_{\varepsilon_{\varepsilon_{...}}}$、二元至多元veblen函数。
3. 开始学习序数坍缩函数OCF（注意有MOCF与BOCF两种不同的版本，初学选一种即可），理解递归序数BHO。
4. 学习包含第二个非递归序数$\Omega_2$的OCF、直至$\Omega_{\Omega_{\Omega_{...}}}$，理解递归序数EBO。
5. 学习I/M/K/反射序数，学习稳定序数，Y-序列等等。

由于我现在就还在学习反射序数的阶段，无能为力再给出后续的序数学习规划，请参考上面知乎大佬们的文章。那么多纷繁的序数记号实在让人抓狂，我个人建议至少知道并理解序数坍缩函数（OCF）这个东西，毕竟是那个序数游戏里都会出现这个东西。有好几个半天我都在纸上堆OCF序数……如果你还嫌OCF太简单，堆出来的序数不够大，那就去挑战反射序数、稳定序数、Y序列这些东西吧。这里顺便提下Y序列（[0-Y序列序数地图链接](/ordmap/?0Y)），它是一个强大得离谱的序数记号家族，有0-Y、1-Y、$\omega$-Y序列等不同版本，前面从veblen、ocf、反射、稳定记号一路不断加强得到越来越大的序数，其增长率在Y序列家族面前（哪怕在增长速度最温和的0-Y面前）直接被秒得连渣都不剩，恐怖至极。。。
![序数地图尝试绘制0-Y序列](/img/ord007.png)

p.s. 本来[CFY](https://hadroncfy.com/)写了一些介绍序数的文章草稿，并计划做一个“序数实验室”，我想着要不在上面放个链接给他占个坑，但他设想的序数实验室要实现veblen, ocf, 反射，稳定，Y-序列这些几乎所有主流的表示方法，感觉挺困难的，不知最后会不会烂尾。。

### Ordinal Markup与增量游戏

最后说说Ordinal Markup这个游戏。游戏一开始就是点击一次按钮让序数加一，后面买连点器等各种升级，序数越跑越快，还要完成很多指定的挑战获得成就等等，具体就不剧透了。游戏非常耗费时间，游戏后期有时候需要策略加长时间挂机才能到下一关，目前我跟CFY都卡在了奇点函数这个层级，都拿到了60个成就后就几个月都没进展了。（好像我最早是23年10月开始玩的）
![游戏Ordinal Markup，上图中的序数已超过BHO](/img/ord004.png)
如果嫌游戏太难，可以玩更简单的游戏版本[ Ordinal Markup FSE(Factor Shift Edition)](https://patcailmemer.github.io/om-fse-minus/)，这个版本几天之内就能通关，如果你对增量游戏感兴趣，还可以尝试：
1. 该作者的另一个游戏[Time Layers](https://patcailmemer.github.io/Time-Layers/)，我玩到星系那里就卡住了；
2. 最初给作者灵感的[Derivative Clicker](https://gzgreg.github.io/DerivativeClicker/)。
3. 画面比较精致的做饼干的游戏[Cookie Clicker](https://orteil.dashnet.org/cookieclicker/)。（我是在《大数理论》中看到的推荐，但其实跟大数无关，纯消遣的增量游戏）

好了，关于序数/大数理论就介绍到这里了，下一篇文章我们将看看大数数学乃至数学的根基：形式系统与ZFC集合论。