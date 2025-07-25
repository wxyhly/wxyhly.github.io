---
title: 四维世界（三）：道路轨道设计
tags:
  - 四维
  - 奇特想象
categories: 四维世界系列
date: 2019-01-10 16:00:00
excerpt: 上篇文章介绍了四维世界中各式各样的车，它们都能随便在三维地面上行驶、转向。既然四维空间不用修红绿灯和立交桥了，是否意味着四维人的出行太方便了呢？是的，但四维交通还有一些小问题。我们知道三维空间中有双向行驶的道路，中间用隔离带或黄线隔开，大家都遵循靠右走；到了四维世界的双向道路，三维路面上的隔离带必须是二维的才能把道路分开，中间画一根线不再起作用了……
index_img: /img/rail401.png
---
上篇文章介绍了四维世界中各式各样的车，它们都能随便在三维地面上行驶、转向。既然四维空间不用修红绿灯和立交桥了，是否意味着四维人的出行太方便了呢？是的，但四维交通还有一些小问题。我们知道三维空间中有双向行驶的道路，中间用隔离带或黄线隔开，大家都遵循靠右走；到了四维世界的双向道路，三维路面上的隔离带必须是二维的才能把道路分开，中间画一根线不再起作用了。最简单的双向道路恐怕就是下面这样了：
![](/img/rail401.png)<!--more-->
我们看到，它就像一根血管一样，里面的汽车可以像细胞一样自由地歪着斜着移动，只要车头指向前就行。至于路的截面要不要修成圆的这确实是个问题，因为就算车是近似的超长方体，车的自由自转也导致正方形的角的利用率并不高。当然我们可以让车的自转对齐道路的截面，但我们将会看到这是很麻烦且不自然的。由于这些方向的任意性，遵循靠右走的原则也没有意义了，四维人必须在公路上处处标明行车方向以免导致驶入道路的车逆行。
至于多车道，这完全就是一个分配截面的二维问题，下面给出了一些可能的多车道模式：（蓝色代表行车方向垂直纸面向里，红色代表向外）![](/img/rail402.png)
既然车可以自转，那我们最好还是把车道截面修成接近圆。二维圆的最密堆积等价于六边形的蜂巢形，这样空间利用率最高，但我想不出最中间的车道该划给谁走，实在不行干脆做成绿化带吧。注意左下方的三角形车道本质上与蜂巢形车道相同，正中间的区域还是能再塞下一个车道。

下面我们来看看路口的设计。既然不需要立交桥的原因是三维地面有足够的空间让得过，而我们三维世界立交桥的原理正是克服重力得到足够的空间让过，所以最简单的想法就是直接把我们世界的立交放到三维地面上躺着就完了。但由于不再有重力限制，左转弯的车辆可以从“桥上”直接窜到“桥下”。
![](/img/rail401.jpg)
![我把路画成透明的，以显示里面左转弯的结构](/img/rail402.jpg)
但四维世界城市里还会出现三条垂直的路直接交叉的情况，我们就没有相应的经验了，但类比之前的情况，我们还是能大概设计一种方案，虽然我认为肯定有更对称、漂亮的方案。
![](/img/rail403.jpg)
### 铁路
下面来看看铁路：铁路的方向都是卡死了的，所以比汽车简单多了。但是铁路的轨道与火车轮子的形状、道岔和车站的设计其实也很有讨论的价值。我们先来看一下三维火车轮子的构造：为了不脱轨，轮子拥有轮缘的突起构造，两根铁轨的横截面是个工字形。
首先，我们还是假设火车是超长方体形的，四维版的铁轨是怎样的呢？一种思路是：铁轨相当于道路的街沿，所以四维版的铁轨俯视图看起来应该是圆筒或方筒，像血管壁那样。但其实没这个必要。由于处在同一截面（地面上与前进方向垂直的平面）上的轮子一共有四个，我们只需要用四根铁轨来卡这四个轮子就行了。这样做不仅节省了材料，还让道岔的修建变得更简单。我上篇文章提到的block4d游戏里面的火车轨道就是以四根轨道这种方式显示的，当然你也可以修建三轨、五轨、n轨铁路，我们上篇文章中已经给出相应火车的轮子分布了。轨道的具体形状呢？我们粗略把轨道截面工字形轨道看成长方形的，因为工字形区别只是在于省材料。四维轨道截面是三维图形，我们可以先试试长方体和柱体。为什么不试球体呢？因为这个横截面有一个方向与竖直方向平行，做成柱体才靠谱，变化最多就是在柱体上挖一部分来省材料，变成一个两头粗中间细的哑铃形。
我们把火车轮分成两部分，一部分是轮缘，另一部分是放在铁轨上的部分。还是俯视图最有说服力：它能反映整个轮子的形状。我们可能先想到轮子和轮缘都是双圆柱，只不过半径不同。但双圆柱的轮缘无法与导轨紧密贴合，所以这里方圆柱可能更合适一些，同样导轨的截面形状也可以方一点，只有贴合好了导轨对轮缘的导向能力才越强，否则容易出轨。
![右上角为铁轨、车轮的四视图（Blender制作，其他三个视图是“四视图”的三视图）](/img/rail403.png)
是不是这样的设计就完美了呢？如果现在就这样运行火车，那么后果将会是灾难性的：我们忽略了一种运动——只要火车发生一点点自转就脱轨了。这个问题的解决方法是把正方形截面再改造一下，做成一个槽把轮缘包住。
![轨道横截胞与俯视图（俯视图没画轨道底座以便观察轮缘）](/img/rail404.png)
##### 2023年12月更新
Tesserxel引擎制作了铁路火车场景，[链接点这里](/tesserxel/examples/#rails::rail1d)，[教程点这里](/archives/tesserxel-flightsim/)。
### 道岔
下面说说道岔吧。可能很多人连三维世界中铁路的道岔系统都搞不太明白，它的原理很简单，正因为简单，我们才有能力把它推到四维。这是维基百科给的一个动画演示：![](https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Funzionamento_Deviatoio.gif/675px-Funzionamento_Deviatoio.gif)
道岔的核心是引导突出来的轮缘。下图我把轮缘经过的地方涂成了粉红色：
![](/img/rail405.png)
轮到我们构想四维道岔了：下面给出了铁路往轨道三、四的方向上分叉的道岔俯视图：由于轨道防自转的部分是凸出来的，做道岔时这两部分开做，因为轨道一、二只需要扳动防自转的部分，轨道三、四只需要扳动轨道主体部分。
![你能说出上下图哪个是直行状态哪个是转弯状态吗？](/img/rail404.jpg)
好了，我们终于讲完四维空间公路铁路的构造了。
然而，真的讲完了吗？
下面我要介绍一种四维世界中特殊的交通工具，它应该会受到人们的青睐，特别是我们这种想去四维空间旅游的人们。此想法来源于[这个网站](http://hi.gher.space/forum/viewforum.php?f=27)里面的讨论。<a name="planar-rail"></a>
### 火汽车/汽火车
我们知道，四维汽车的驾驶是很困难的，像开飞机一样，即使是四维世界的原住民练车也非常痛苦。所以火车轮子卡死在轨道上就可以不用操心控制方向了。但是火车交通是一维的，岔路得靠扳道，发车必须要有调度系统，所以不是你想怎么开就怎么开的。下面我们新的交通工具就要登场了，它结合了汽车和火车的优点——我不知道如何起名，暂且叫火汽车或汽火车。
火汽车是火车与汽车的结合。它行驶在二维的轨道上，而且拥有方向盘（是我们熟悉的圆盘，不是球！），可以在二维的轨道面上自由转向行驶。这对我们三维人来说是个好消息（对四维女司机也是），因为开这种车就像我们平时开三维车一样了。来看看轨道和车轮的设计：
![两个都是俯视图，只是3D视角不太一样](/img/rail405.jpg)
平面轨道限制了自转和垂直轨道的转向，让开车难度降低了很多。当然，我刚才展示的是二维平直的轨道，弯曲的轨道不仅可以像我们的公路那样左右弯曲（过这种弯要手动控制方向盘），还可以向上弯（垂直轨道方向转弯），或像拧纸带一样变成螺旋面（自转）。二维轨道也不用设计道岔了，因为人可以控制车辆的方向来选择支路。
![一条任意弯曲的二维轨道（俯视图）](/img/rail406.jpg)
**2023年12月更新**
Tesserxel引擎制作了二维铁路汽火车场景，[链接点这里](/tesserxel/examples/#rails::rail2d)，[教程点这里](/archives/tesserxel-flightsim/)。

我们之前做的一切讨论都是假设三维地面是平的，然而离开平原后道路就会有上下坡了，没有四维的眼睛就更难理解它们了，我们对交通的讨论就先到此为止吧。
