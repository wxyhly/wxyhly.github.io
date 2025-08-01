---
title: 四维世界（九）：飞行器设计
tags:
  - 四维
  - 物理
  - 模拟
  - Tesserxel
categories: 四维世界系列
date: 2023-11-27 00:06:15
excerpt: 四维世界中的飞行器会有哪些新奇结构？本文探讨从双旋转Hopf风扇到四轴无人机再到大型客机的设计思路。通过在线无人机、客机飞行模拟器展示四维飞行器的结构与操控方式，探索座窗、机翼、安定面等在四维中的新布局与可能形态。
index_img: /img/aircraft006.png
---
![无人机设计方案迭代](/img/drone4d001.jpg)
![四维客机尾翼设计方案](/img/aircraft006.png)

四维世界中的飞行器结构会是什么样的呢？这篇文章我们将来看看一些关于从四维风扇到无人机再到大型客机的可能设计思路。
## 四维飞行器模拟器

- [四维无人机模拟器（PC Chrome浏览器打开）](/tesserxel/examples/#drone)
- [四维客机飞行模拟器（PC Chrome浏览器打开）](/tesserxel/examples/#aircraft)

<!--more-->

## 四维风扇
先来个热身话题：设计一个能正常吹风的四维风扇，按惯例我们先分析三维，来看看三维风扇的主视图和侧视图。<img style="width:100%;max-width:500px" src="/img/aircraft001.jpg" alt="三维风扇正视图（左）与侧视图（右），在侧视图中的左边着色偏白，右边则偏黑"/>
注意主视图压缩掉的维度可通过明暗颜色标记“海拔高度”的方法来展示压缩掉的维度，其目的是在给后面用这种方法标记四维风扇做热身。风扇出风的关键是叶片是倾斜的，与旋转运动方向有一个夹角，这样叶片旋转时就会把空气推走，即出风。
![四维风扇出风原理：蓝色是气流吹出方向，同时风扇会受到一个红色的反作用力](/img/aircraft001.svg)四维风扇要如何通过旋转来出风呢？上面的出风原理示意图其实还可以理解为二维世界中的一维线段状的“叶片”通过一系列复杂操作升维得到的。（经过柱化，再通过复制叶片再弯曲后将平动出风的结构变成转动出风）这启发我们最简单的四维风扇就是把三维图形柱化升维得到，这样的四维螺旋桨的扫掠区域从圆柱形变成了圆柱柱形。虽然圆柱柱本身的两条高地位是相同的，但由于四维风扇的倾斜导致没有这个对称性。一个在xy平面内旋转的风扇它到底往z方向还是w方向出风完全取决于扇叶的倾斜方式，同时叶片在这两个方向上的厚度也不一样：底胞扇叶本身可以很薄，但扇叶柱化方向的长度不宜过短，否则会降低叶片与空气接触的表体积。现在我们可以画出四维风扇的两个包含旋转平面的正投影视图：（三维物体投影是二维，四维物体投影就是三维，后面我们要画各种四维物体的各种三维视图哦）<img style="width:100%;max-width:500px" src="/img/aircraft002.jpg" alt="四维风扇出风正视图（左）与柱化方向正视图（右），每个视图压缩掉的方向使用明暗颜色来补偿区分"/>
对于四维风扇出风正视图（左）能看出这个东西是个柱体，但它投影掉了风扇的倾斜出风方向，叶片倾斜可以从从明暗颜色上看出来；对于柱化方向正视图（右），它将柱化方向投影掉了，“底胞”是一个平直的三维风扇图形，第四个压缩掉的高度是相同的，所以可以看到明暗着色一样。可能大家还会注意到一个小细节，从四维风扇出风正视图（左）中可以看出风扇叶片不是标准的柱体，貌似中间有点凹陷，这是为了让气流更好地汇聚到中间推动叶片而设计的，由于目前我还没有写出四维流体模拟，因此无法给出形状上的精确优化方案。
### 双旋转电扇？
可能你会觉得这柱化的扇叶太简单粗暴了，有没有其它更科学的电扇设计方案呢？很可惜旋转是个妥妥的二维效应，我实在是想不出做出类似球柱形状的电扇，最多把柱化的扇叶的棱角打磨成圆弧，也能做到看起来像个球柱，但它的原理还是圆柱柱那套，而且打磨后将损失掉部分高线速度区域的接触表体积，对出风是不利的。
你可能会说四维空间还有双旋转呢，能不能做成对称性更漂亮的风扇呢？如果让超球做双旋转，在它表面粘上倾斜的叶片，可想而知由于双旋转的对称性，这个东西四面八方都出风，这根本就不再是电风扇而变成真空泵了，或者反着转变成都往里灌气的增压泵。有点难以想象？它对应到三维是这种东西：<img style="width:100%;max-width:500px" src="/img/aircraft003.jpg" alt="把它夹在两块板子之间快速旋转就能变成真空泵/加压泵"/>
如果忽略掉进风通道，这个东西其实是二维的，我们甚至可以用同心圆截线动画给一维生物来描述它：想象一个以真空泵/加压泵旋转中心为圆心的圆，从半径为零慢慢增大。当半径很小时，什么都截不到，半径增加到内圈大小时，整个圆上会被内圈充满，半径更大后，内圈截不到了而是截到叶片，即在截圆周上出现许多点，并且随着截圆半径增大截点顺着圆周旋转，当截圆半径大于扇叶最远端到圆心距离时，所有东西都消失。一维生物只用理解一维圆周上发生的事，这对它们很容易：把圆周剪开展开成线段就行了。![给一维生物展示二维图形用的截圆动画](/img/aircraft006.svg)

同理四维的Hopf风扇则是截到内圈后，它将充满整个三维球面，但由于不像二维断开了就不连通，这个三维球面可以是出于节省材料或方便进出风等原因而做成镂空的。随着截超球继续变大，内圈消失截到叶片，如果叶片做成倾斜的圆柱体，则会出现很多法线顺着双旋转轨迹（即Hopf纤维）的圆片，随着半径继续增大，这些圆片在双旋转轨迹方向上前进，当截超球半径大于扇叶最远端到圆心距离时，所有东西都消失。

Hopf真空泵/加压泵这东西虽然理论上确实能用，但实用性不强。我相信四维人不会真的用这种玩意，肯定还是密闭容器加一个管子直接抽真空来得方便。如果有五维世界的话倒是可以把这种Hopf风扇柱化，并在第五维倾斜，可以得到扫略区域为以超球为底的柱体，并向高的方向出风的真正的风扇。


## 四维无人机设计

螺旋桨跟风扇的原理是一样的，根据牛顿第三定律，吹出的气流会反过来给扇叶一个推力，目前我们世界中主流的无人机都采用的是四轴飞行器的设计，靠四个螺旋桨旋转产生升力飞行。如果把四轴飞行器推广到四维，该怎样设计、控制、操纵它呢？按照惯例，我们首先看看三维世界中的四轴飞行器是怎样工作的。

### 三维四轴飞行器的工作原理

四轴飞行器就是一个十字形架子四端安了四个螺旋桨，只要合理控制转速，就能控制旋转产生的升力与重力的大小关系从而实现升降或悬停。平移则要稍微麻烦些：以向前移动为例，前桨转速降低后桨转速增大将导致原本受力平衡的飞机受到转动力矩的作用，导致机体前倾，此时所有桨叶产生的升力就有向前倾斜的分量，来推动无人机加速飞行。同理减速或向后加速移动则需调整转速让飞机后倾。也就是说我们通过控制两桨的转速差来控制转动力矩从而控制飞机倾斜姿态，再通过倾角控制飞机的平移加速度让飞机动起来。![无人机向右加速/向左减速的原理](/img/aircraft007.svg)可想而知，通过手动控制各电机转速来倾斜飞行器做平移是很难让飞机稳定飞行的，（可以在我的[四维无人机模拟器](/tesserxel/examples/#drone)中尝试不开启自动模式体验一下）一般会采用自动控制技术通过负反馈增加稳定性，且飞手不是直接操纵桨叶电机的转速，而是操纵飞机倾角甚至直接是飞机速度的目标值，由控制系统自动调节各电机出力达到预设值。无论三维还是接下来要设计的四维飞行器都需要自动控制系统，且原理大致一致，具体就不详细展开了。

再来看看水平旋转姿态控制。注意桨旋转的反作用力将导致飞行器产生相反方向的旋转（反作用力矩），因此工程师刻意设计两个桨顺时针转动，另外两个桨逆时针转动来避免让飞行器一飞起来就打转。如果就是刻意想让飞机旋转，则调整两边转速不一致即可。这个反作用转矩对所有螺旋桨飞行器都存在：比如若直升机只有顶部的“大风扇”旋转，则整个机身将受到反作用力从而也开始疯狂旋转，为了抵消旋转，工程师们给直升机设计了尾桨，施加相反的力矩来抵消旋转。

最后用维基百科上的几张来图总结一下四轴的三种运动控制原理:<div style="display: flex; flex-wrap:wrap; justify-content: center">
<div>

<img style="max-width:200px" src="/img/aircraft002.svg" alt="悬停或升降：四桨转速相等"/></div>
<div>

<img style="max-width:200px" src="/img/aircraft004.svg" alt="两侧升力差实现倾斜（用于平移）"/></div>
<div>

<img style="max-width:200px" src="/img/aircraft003.svg" alt="通过不平衡的转矩实现水平旋转"/></div>
</div>

### 四维螺旋桨
四维螺旋桨怎样布局安装到无人机上呢？首先最容易想到的就是把四轴扩展成六轴，每端安装一个桨。注意现在螺旋桨的扫掠区域是圆柱柱，它的一个高跟需要产生升力的竖直方向对齐，底面的（即俯视图下）圆柱的朝向是可以有不同选择的，比如就有下面两种比较对称的设计方案。注意不要觉得右图的无人机架子都插进桨叶里面了是不对的，这只是飞机的俯视图，跟三维无人机一样，桨的高度是大于架子的高度的，实际并没相交，桨那里其实还有连接在架子上的竖直的轴。
![初步设计的两种比较对称的桨叶排布方案](/img/aircraft004.jpg)
下面再来看姿态控制。升降与平移都跟三维非常相似，是靠六个螺旋桨产生的不同比例的升力来控制的，没什么好说的，但水平旋转却不一样了，四维水平面其实是三维的胞，水平旋转的自由度就有3个，而且它靠螺旋桨产生的力矩，还必须将所有转矩抵消才能维持飞机静止，于是我们仿照三维，把同一朝向的两个螺旋桨旋转方向设置成相反的，这样就能保持静止了。然而想让飞机平移的话，两边螺旋桨产生转速差除了使飞机倾斜外，还会让力矩不再互相抵消而让飞机旋转，也就是说如果采用上面的六轴飞行器设计方案，水平旋转跟负责平移的垂直倾斜操作耦合在一起了，没法单独控制其中一种行为。其实同一平面中只有两个螺旋桨是不可能完成所有操作的：要独立控制升降、平移与水平旋转，相当于有三个方程来求解两个未知量（两个螺旋桨的转速）很明显是无解的，即**上面两种设计方案都是无法采用的**，三维四轴飞行器的所有4个桨都是共面的，因此不存在这个问题。要能控制四维飞机的所有旋转自由度，我们就必须要增加同一旋转平面中的螺旋桨个数，而且旋转姿态控制有三个自由度，所以必须要有三组朝向的桨，比如下面这种所有桨都在一个平面内的就无法控制飞机做图示红蓝两方向箭头的旋转，故**下图也是无法采用的设计方案**。<img style="width:100%;max-width:400px" src="/img/aircraft005.jpg" alt="飞机的桨叶不能全共面：无法做图示标出方向的旋转运动"/>
### 两种四维飞行器典型设计方案

虽然三个方程告诉我们三个桨可能就满足要求，但线性方程不一定保证满秩有解，且控制解算会变得很复杂，因此还不如单纯给每个桨都装上一个方向相反的桨来抵消转矩，如果希望自转，则可以控制这对桨的转速产生微小差异来产生力矩，这样六轴上的六个桨就变成了12个桨了，其中的一种典型设计方案如下：<img style="width:100%;max-width:400px" src="/img/aircraft006.jpg" alt="典型方案一：类似同轴反转的力矩平衡无人机设计方案"/>
其实这种抵消力矩的想法早就在现实三维世界中使用了，叫做**同轴反转螺旋桨**，据[维基百科说](https://zh.wikipedia.org/wiki/%E5%90%8C%E8%BD%B4%E5%8F%8D%E8%BD%AC%E8%9E%BA%E6%97%8B%E6%A1%A8)同轴反转桨还能抵消涡流降低能量损耗反而能提升效率，但缺点是噪声较大。但需要注意这里的四维设计方案跟三维的同轴反转螺旋桨还有点区别：三维的两个桨是并排在气流运动出风的方向上的，而四维则是并排在桨柱化出的方向，也就是说四维情况下可以做到同一股气流不会被两个反转的桨同时影响。如果你还是觉得同轴反转不太好，可以考虑把四个桨在平面上排开，得到一个非常漂亮的按立方体棱心排布的12轴飞行器：<img style="width:100%;max-width:400px" src="/img/aircraft007.jpg" alt="典型方案二：均匀铺开的力矩平衡无人机设计方案"/>
这就是四维飞行器的第二种典型设计方案，该方案下每个桨叶的旋转面与连接它的轴之间均为45度夹角。如果大家能想出其它更优雅的设计方案欢迎留言哦。

四维引擎Tesserxel的样例库中有典型方案一的四轴飞行器模拟场景，[链接点这里](/tesserxel/examples/#drone)，大家可以自己先尝试看侧栏左下角的操作提示试玩，后续将推出详细玩耍教程。

## 四维客机

我们再来看看另一种结构的飞行器：固定翼飞机。平常大家唯一最有机会能够乘坐的就是这种飞机了，按惯例先给大家补充一下三维飞机的相关专业知识。首先我们看一下三维飞机的二维三视图，后面我们将类比四维飞机的三维四视图。比如下面是我网上找的波音737型号飞机的三视图。![波音737飞机三视图，来自网络侵删](/img/aircraft016.jpg)
固定翼飞机的发动机只提供向前的推力，靠机翼形状导致上下气流产生压差来得到升力。控制飞机姿态则是靠几组附着在机翼和尾翼端部的可以活动的板子（术语：操纵面）来实现的。
### 三维飞机的控制
1. 升降舵控制俯仰角(pitch)
升降舵通过铰链附着在水平方向的尾翼上，通过旋转上下控制面改变与气流的夹角来改变升力。

![动画演示来自维基百科](/img/aircraft002.gif)
2. 方向舵控制偏航角(yaw)
方向舵附着在垂直方向的尾翼上，通过左右摆动来控制方向。

![动画演示来自维基百科](/img/aircraft001.gif)
3. 副翼控制横滚角(row)
副翼附着于机翼上，它跟升降舵类似可以上下转动，两侧副翼一个向上一个向下则可以控制飞机翻滚姿态。

![动画演示来自维基百科](/img/aircraft003.gif)

为什么控制这些操纵面旋转就能如愿改变飞机姿态呢？这些板子一般厚度很薄，各个方向的空气阻力相差很大，倾斜这些板子后它们在气流中的受力会改变，使得原本受力平衡的飞机受到平动力转动力矩的作用共同调整飞机姿态。需要注意的是所有操纵面都附着在飞机上，因此这些俯仰角、偏航角、横滚角控制都是**相对于飞机自身的坐标系**，这些方向会随着飞机的旋转而旋转，而不是后面将用于描述飞机姿态的地面坐标系统。
### 四维飞机设计
本文将依次给出机体、机翼、发动机、起落架等各部分的可能设计方案，由于我的飞行动力学知识都是最近才恶补出来的，欢迎飞行动力学大佬纠正文中可能存在的错误。
#### 机体设计方案

三维飞机机身近似于圆柱，且机头采用流线型设计，最简单的升维方法就是将三维机体旋转升维得到四维机体的形状。注意三维飞机头不是旋转对称的，只是左右对称，因此我们可以以中间的竖直对称面为轴构造四维旋转体，这样构造出的四维机体近似为球柱。
<img style="width:100%;max-width:400px" src="/img/aircraft008.jpg" alt="将三维飞机的对称面作为旋转平面得到四维飞机旋转体"/>
机舱内的乘客座位和窗户该如何布置呢？由于乘客也是四维生物，首先还得从座椅的结构说起。假设四维人也是直立行走的生物，座位首先需要一个方向作为靠背，相对的另一个方向则是敞开的放腿的地方，其余侧面一圈都是扶手，这样就可以不管四维人的手长在哪有几只。最后座位设计还有个要求，那就是要面朝前方。
<img style="width:100%;max-width:500px" src="/img/aircraft001.png" alt="一种正方体四维座椅的四/六视图：灰色为扶手，黄色为靠背，橙色为坐垫；为看清内部构造，部分区域半透明绘制"/>
其实座椅的形状无关紧要，比如现实生活中有方凳、圆凳，它们都能够添加靠背升级成椅子，因此四维座椅的形状其实可以非常多样化，从立方体到圆柱再到球都不是不可能。由于方形凳子不能紧靠飞机窗户（不紧靠好像也无所谓吧），因此机舱可能更偏好圆柱形/六边形的座位排布设计方案（可能圆柱中间的空隙会给卫生清洁工作带来些麻烦）
<img style="width:100%;max-width:400px" src="/img/aircraft017.jpg" alt="四维大飞机+正方体座椅布置图，中间空出来的为通行用的过道"/><img style="width:100%;max-width:600px" src="/img/aircraft018.jpg" alt="四维小飞机+圆柱体座椅布置图，层间的空隙用于走动、放脚与放其它行李"/>
飞机窗户是一周分布的模式，前部驾驶舱为保证视野良好窗户做得比较大，整体看起来有点像太空船：<img style="width:100%;max-width:500px" src="/img/aircraft009.jpg" alt="四维飞机的窗户在机体上的分布"/>
注意“真正”的四维窗户都是三维的长方体胞而不只是二维的格子，上面所有的图都仅仅画出了把高度方向丢掉后飞机的一个剖面而已，类比到三维则是这样的图：![三维飞机的剖面图中的窗户变成了一维的线段](/img/aircraft004.png)

#### 飞机姿态术语
在继续讲姿态控制前，首先需要明确一下四维飞机姿态的术语。

1. 偏航角(yaw)：飞机的航向。由于四维地面为三维，偏航角也需要两个方向描述。三维航向一般描述为“北偏东xx度”“西偏南xxx度”，我们在[《四维世界（一）：行星的昼夜季节》](/archives/orbit4d/)已经介绍了四维人使用的Hopf经纬度系统，因此这里仅补充如何描述方向。我们可以参照球坐标的方式先描述该方向投影在经面上的方位角，再描述该方向与经面的夹角。例如下图中的飞机的偏航角为“西偏阳12度偏北39度”。为什么四维人不先确定东西南北上的方位再确定与阴阳方向的夹角呢？这是因为东西、阴阳方向是两个地位对等的纬线方向，只有南北方向才是经线方向，所以他们习惯把东西阴阳放在一起。

![展示三维地面的俯视图：黄色角12度，白色角39度，绿色角28度](/img/aircraft010.jpg?size=500x)
2. 自转角(spin)：在三维地面上除了两个自由度的朝向还有一个自由度的自转朝向。其实自转角与两个偏航角共同构成三维空间中描述物体旋转朝向的三个自由度，可以用标准的row-yaw-pitch欧拉角来表示，这里的pitch对应飞机头与经面的夹角，yaw对应经面上的方位角，而row则对应自转角。比如我们可以以飞机的一个机翼或舱门为参照物（上图选取的标绿的机翼，后面我们将详细讨论机翼构造），把它与机头和南北方向张成平面（图中红色平面）的夹角作为自转角（上图标注的绿色夹角）。注意如果飞机偏航角为正北朝向，则无法张成红色平面，自转角需要其它方法描述，这是欧拉角描述物体朝向的系统固有瑕疵“万向锁”效应造成的。
3. 俯仰角(pitch)：前三个角都是飞机在三维地面中的朝向，真正的俯仰角是飞机机头与水平地面的夹角，该角度无法在上图俯视图投影中标出。
4. 横滚角(roll)：不同于三维飞机只能左右横滚倾斜，四维飞机可以在左右、侧前后两个自由度方向上横滚倾斜。有两种方式描述横滚：一种是分别描述机体左右方向和侧前后与水平胞的倾角，另一种是先像描述方位角那样先描述在哪个方向倾斜得最厉害（类似梯度那样），然后再用一个倾斜角来描述倾斜量。

<img style="width:100%;max-width:500px" src="/img/aircraft011.jpg" alt="两种roll角描述这个方块倾斜方法：1. 使用红蓝两角描述，2. 使用黄色两角描述"/>

#### 机翼设计方案

四维机翼是最难想象的了。我们可以从三维飞机的三视图入手，去尝试画出四维飞机的四视图。
首先从俯视图入手：俯视图上没有重力方向，三维就只剩飞机前进的前后方向与垂直的侧面方向了，四维则有前进方向和相互垂直的左右/侧前后两个侧面方向。在四维空间方向辨识中我们说过，四维的侧面其实是一圈，因此在我们设计机翼的时候也是绕着飞机前进的方向做一圈。有两种方案:
1. 像处理机身那样，直接将三维飞机的俯视图绕对称轴旋转升维得到四维飞机的三视图。其实对于任何三维有对称平面的图形，都可以绕对称面旋转来升维。
2. 以正n边形顶点的分布安装n个机翼。

第一种方案最易想象，但这种绕一圈一体化的机翼很容易受到各方向不同的作用力而累积应力，且从节约材料减重来说也不好，因此实际的四维飞机一般采用第二种方案，而且跟风力发电机的叶片类似，三条机翼其实就已经足够提供升力且能让飞机保持平衡了，而且机翼多了会让控制系统变得复杂，因此“实际”的四维飞机大多采用三条机翼。
![两种四维机翼设计方案（俯视图）](/img/aircraft003.png)

**24年12月更新**：higherspace论坛上有人指出，第一种方案并不是一无是处：直接旋转一周的到的机翼的迎风受力面积大，翼展长度不一定做得很长也能获得同样的升力，因此也可以做到质量轻、强度大。而且相比与第二种分布安装n个机翼的方案，它的形状更加“圆润”，很可能会更大幅度抑制翼尖涡流和机尾湍流等现象，从而提高飞行器稳定性（p.s. 我们世界中飞机机翼末端翘起来的翼尖小翼就是用来抑制翼尖涡流的）。然而由于大家都不是流体力学专家，也无法进行流体仿真，很难说“真实”的四维飞机偏向采取哪个方案，没准民航客机、对机动性要求高的战斗机以及超音速飞机等不同机型会择优综合考虑选择不同的设计方案。

本文我们还是继续使用第二种方案设计。机翼的形状如何设置呢？从三维飞机的机翼出发，最直接的办法就是柱化加厚。注意这种加厚不能做太薄，否则与气流的接触体积（注意这是四维表面的三维接触哦）太小，没法提升足够的升力。但柱化的厚度是有个上限的，至少不能超出连接到机身的宽度，否则机翼的角会露出来造成很大的风阻。直接柱化是个糟糕的形状，可以改良一下让柱化厚度不再均匀：接近机身的部位窄一点使其能与机身平滑连接，往外走厚一点，增大与气流的接触表体积，再往外走再变薄，以改善应力分布。这样就得到了一个气动特性良好的不规则的四维机翼了。
![四维机翼的两个二维投影视图，另一个视图（黄色高亮部分）重合在一起画出](/img/aircraft002.png)

#### 发动机设计方案

三维飞机的发动机是挂在机翼下面的，对四维飞机来说同理。三维的飞机发动机结构其实是十分复杂的，虽然四维涡轮的整体结构还是采用三维螺涡轮升维柱化来构造，但考虑到燃烧室需要增压，发动机尾部的旋转半径和柱化半径都会收得比较小，至于内部的增压装置和动力传输系统就太复杂了，超出本文的讨论范围了。这里我们仅仅考虑发动机的安装朝向问题。对于三维飞机来说，发动机要推动飞机前进就必须面向前方安装，没有其它的选择余地，四维飞机就不同了。虽然发动机必须面向前，但它的进气口截胞是个圆柱体，圆柱的朝向是可以由我们选择的。下面画出了几种朝向的方案的几个视图。
![右边为两种发动机朝向的俯视图与前视图（均为三维视图），左边为三维视图的两个二维正投影](/img/aircraft012.jpg)
我们着重看右边的透视视图，里面展示了两种方案的俯视与前视正投影图，左边上下两格画的二维正视图是右边三维视图的两个方向的投影，即投影的投影，亦可供参考。注意俯视图压缩掉了竖直方向，前视图压缩掉了前后方向。从俯视图可以看出，所有发动机都是前后方向的柱体，因为发动机要产生向前的推力，这是气流的吸入/排出方向，注意这里把机翼透明化，能看到发动机像是嵌入在机翼里的，其实并没重叠，而是高度方向被投影掉了，发动机是挂在机翼下方的；方案1的前视图可以看到发动机是圆柱形，这个圆柱就是发动机进气的截面形状，且发动机旋转平面为左右-侧前后方向；方案2的前视图可以看到发动机进气的截面形状也是圆柱形，且发动机旋转平面在不同机翼上朝向不同，但都包含竖直方向；这几种方案之间怎样取舍呢？跟无人机一样我们也需要考虑力矩平衡。方案2是最容易实现力矩平衡的，其转动方向在下图中标出。而方案1只要三个发动机转速一样就没法通过安排旋转方向来抵消力矩，故不采用方案1而采用方案2。<img style="width:100%;max-width:500px" src="/img/aircraft013.jpg" alt="方案2中的发动机旋转方向，可以使得总角动量为0"/>

#### 起落架设计方案
三维世界的飞机起落架设计方案有很多种，我们这里只分析类比一般客机那样的一个前轮加每个机翼一个轮子的配置，这个配置类似于之前讲四维交通工具中提到的四轮车，它具有稳定四面体结构不会倾倒。<img style="width:100%;max-width:500px" src="/img/aircraft014.jpg" alt="三维的波音737客机起落架分布：与三轮车的结构相同（图片来自网络侵删）"/>
观察发现，三维大飞机的每个轮子其实是一组轮子，它可以起到稳定和分摊受力的作用，同理我们可以把四维飞机的一个轮子换成等边三角形排列的三个一组的轮子，共12个轮子。<img style="width:100%;max-width:500px" src="/img/aircraft015.jpg" alt="起落架在四维飞机俯视图与前视图中的位置（右边为两个三维视图，左边为三维视图的二维正投影）"/>
轮子的形状可以近似为圆柱柱、双圆柱甚至球环，只要它的旋转平面为竖直方向与前进方向即可滚动。注意上图只画出了俯视图与前视图，因此这两个视图都不能正对着轮子圆形的那面，都只是从不同侧面方向看过去，投影为一根根柱子。

最后再来看看飞机滑行时如何通过控制轮子来转弯。如果前轮有转向系统的话直接像三轮车前轮那样转弯就可以了，如果没有转向系统还可以通过后轮不平衡刹车的方式来实现转弯：想往哪个机翼的方向转弯就只需要对哪个轮子单独刹车就可以了。但如果我们想往任意方向转弯，就必须要有不止一个轮子刹车，而是控制各轮胎刹车的比例，通过向量合成的方法得到最终想要的转弯方向，这里就不再展开介绍了。
#### 尾翼设计
三维飞机的尾翼分水平安定面与垂直安定面两部分。水平安定面其实跟飞机的机翼类似，只是比较小，且水平安定面尾端连接有升降舵，它可以与机翼一起调节飞机的俯仰角并保持平衡。垂直安定面则装有方向舵，并且能起到稳定飞机偏航的作用。<div style="display: flex; flex-wrap:wrap; justify-content: center"><div>
![水平安定面上的升降舵，动画演示来自维基百科](/img/aircraft002.gif)</div><div>
![垂直安定面上的方向舵，动画演示来自维基百科](/img/aircraft001.gif)</div></div>

四维飞机的尾翼也可以分为水平安定面（胞）和垂直安定面（胞）。水平安定面装有升降舵，且跟机翼类似也可做成按120度分布的三片，分布的角度有两个选择：一是跟机翼对齐，二是跟机翼相差60度角错开（见下图），我并不清楚这两种方案的优劣（求空气动力学大佬指点），只是单纯觉得错开好看一些。垂直安定面则跟三维情况有很大不同：若模仿三维，直接在飞机顶部安装尾翼，它的形状在飞机垂直方向与前后方向有延伸，其它两个方向很薄，变成二维面而不是三维胞了，虽然可以想象要控制飞机的两个自由度的转向，只需让尾部的方向舵通过像球形人偶关节那种两自由度铰链转动即可，但它的气动表体积少得可怜，类比到三维情形可以想象一根铁丝在风洞中运动，虽然可以跟流体有一定夹角可以吹动铁丝获得推拉力，但妄图用它来调节推动整个飞机控制姿态简直是天方夜谭，因此**下图的方案是不能采纳使用**的。
![直接类比三维方案的水平安定面（绿色）与垂直安定面（红色），仅展示俯视图与前视图](/img/aircraft005.png)
垂直安定面必须要升维，最常见的升维方法就是柱化与旋转体了。由于它在飞机顶部，已经落在对称旋转面上了，无法再通过旋转获得第四维的厚度了，于是只能柱化升维。朝哪个方向柱化呢？我们必须弄清楚垂直安定面需要实现的功能才能回答这个问题。我们先看看三维情况，从前后视图（投影压缩掉前后方向）可以看出它们能抑制三个方向的旋转：偏航旋转时会扫到垂直安定面（可粗略认为只要该面向自己法线方向运动，会就受到较大阻力，从而抑制旋转，这里可能表述得很不专业，见谅。。），俯仰角变化会扫到水平安定面，横滚角变化则两个面都会扫到。
![尾翼两个安定面能够抑制的运动](/img/aircraft005.svg)
同理我们希望四维的尾翼也能抑制所有的旋转自由度。我们把四维旋转分成两部分，一部分是类似偏航与俯仰会旋转机头机尾朝向的，另一部分是类似横滚保持机头机尾不动（类似以它为轴）转动的。旋转角不大时，旋转机头机尾朝向的在后视图中看来是一种平移，分别对应两个方向的偏航与俯仰角变化; 保持机头机尾不动的转动在后视图里看起来则是绕中心做三个自由度的三维转动，分别对应两个自由度的横滚与自转角变化。
![垂直安定面的设计方案迭代（后视图简图，且标出了没被抑制的运动）](/img/aircraft019.jpg)
如上图最左边所示，水平安定面只能抑制上下移动（即俯仰角变化）和两个自由度的横滚，自转与两个自由度的偏航均无法抑制，如果垂直安定面只在一个方向柱化加长（见上图中间），则还有该方向的偏航无法抑制。我们可以像水平安定面那样也做三个方向柱化的垂直安定面（上图右边），这样就可以安定住任何旋转自由度了。注意垂直安定面不再需要像三维飞机那样位于飞机正顶部了。
<img style="width:100%;max-width:500px" src="/img/aircraft006.png" alt="四维飞机的水平安定面与垂直安定面"/>
垂直安定面还有个重要功能就是控制偏航角。由现在有三个垂直安定面，所以可以做成三个一维自由度的正常铰链，通过控制三个铰链来合成出最终想要偏航的方向。铰链具体如何工作呢？俯视图比较好观察铰链的运动，例如下图中有一个垂直安定面的方向舵发生了偏转，飞机飞行过程中将向该安定面偏转方向偏航转向：
<img style="width:100%;max-width:500px" src="/img/aircraft020.jpg" alt="垂直安定面的方向舵的可活动方向（橙色）、此时方向舵偏转方向（红色）与此时飞机的偏航方向（青色），仅画出俯视图与俯视图的一个二维正投影"/>
控制的方向舵有三个，但偏航角才两个自由度，多的自由度是不是就没用了呢？其实这个多余的自由度让我们不仅能控制偏航，还能同时独立地控制自转，比如下面的配置就不会让飞机偏航转向但会带来飞机自转，这也侧面说明了四维飞机需要且仅需要三个垂直安定面了。<img style="width:100%;max-width:500px" src="/img/aircraft021.jpg" alt="自转时方向舵的偏转"/>

## 结语
至此四维飞机的所有主体部件设计方案就介绍完毕了。我们虽然展示了四维飞机的俯视图与前视图，但却没展示过从侧面看四维飞机的视图的样子，就把这个给读者留作习题吧，答案可以在Tesserxel的四维客机场景中寻找，[链接点这里](/tesserxel/examples/#aircraft)。顺便一提，Tesserxel的四维客机场景可以操纵四维飞机滑行、起飞降落（提供了好几个不同难度对方向的跑道供你练习降落哦），跟四维无人机一样，[下一篇文章](/archives/tesserxel-flightsim/)将介绍具体的操作教程，同时也将公布四维飞机的四视图与六视图。