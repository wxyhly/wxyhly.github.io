---
title: 四维世界（八）：四维星球导航
tags:
  - 四维
  - 物理
  - 数学
categories: 四维世界系列
date: 2023-01-09 07:56:09
index_img: /img/compass4d08.jpg
excerpt: 之前提到过如何利用四维星球的地磁场进行导航，但没有具体分析怎样设计并使用指南针。本文将介绍如何在四维星球上系统使用指南针进行导航。我们将讨论指南针的设计、磁化方式、地磁场分布以及指南针失灵的情况。最后也会谈到使用流体涡漩及星空的其它导航方式。
---


<span class="likecode">// 提示：本文涉及到基于Hopf极坐标的四维星球方向定位，请先阅读[四维世界（一）：行星的昼夜季节](/archives/orbit4d/)这篇文章了解四维星球上最基本的方向术语。</span>

之前在《[四维世界（七）：电磁学](/archives/electm4d/)》中提到过如何利用四维星球的地磁场进行导航，但没有具体分析怎样设计并使用指南针。这篇文章将补充这些内容，给出一份通过磁场、地转偏向力与星空的探险家在四维星球上的正确方向辨别指南。
![一种半平行半垂直方向同时磁化的三维导航罗盘（东西南北阴阳字母分别为EW SN GM）](/img/compass4d08.jpg?size=400x)<!--more-->

### 如何设计指南针
导航其实对现代四维人应该早就不是问题。他们按理说早就该掌握制造陀螺仪的技术，这种基于角动量守恒原理而保持朝向不变的器件不会在因没有南北极之分的等角双旋转星球上就失灵，陀螺仪经过类比甚至可以用在任意高维宇宙中的星球上。但制造这种精密仪器并不是一个原始文明一上来就做得到的，因此我们还是来看看利用磁铁与地磁场如何造出指南针来。为了设计出一个正常工作的指南针，至少要考虑这些问题：
1. 确定指南针的机械结构，应该按什么方向磁化、安装，怎样固定在三维的表盘中;
2. 由于指南针的旋转被表盘限制在平行地面的三维子空间内，所以要搞清外磁场哪些分量对指南针的偏转有贡献;
3. 地磁场在星球上各处的方向是怎样的;
4. 哪些情况指南针会失灵

首先要确定指针与表盘的机械结构。由于指针要指向三维地面上的任意位置，这种对称性要求表盘应该是一种“球盘”，即很薄的球柱状，上面应该还有一层透明壳把表针封住。表盘上的指针如何固定呢？跟三维世界的一样，我们可以将磁针中间留个球形洞，穿在表盘中间的一维轴上。用一些工艺降低转轴摩擦后，这个指南针可以近似于能在三维空间中做有完全自由的转动。
![四维指南针的俯视图与侧视图](/img/compass4d01.jpg)

### 指南针的磁化方式
接下来我们要磁化磁针，这样它才能在地磁场中受力偏转。由于在四维空间，传统磁极的概念必须被抛弃，因此，我们只能说环形电流的漩涡指向，而不能继续延续“南北极”，“磁力线”等熟悉的概念。在三维空间中，这两种表示磁场的方法是相互垂直的，具体方向可通过右手定则决定，比如下图分别是通电长直导线与环形电流线圈的磁场分布。
![通电长直导线（左）与环形电流线圈（右）的磁场分布](/img/compass4d01.svg)
我们看到，电流元在周围的磁场漩涡方向就像电荷在流体里运动带动周围流体产生的涡漩的方向一样，环形电流的磁场漩涡内部与环形电流方向相同，外部则相反。三维空间中的指南针时如何工作的呢？地球内部的地磁场分布其实很复杂，一般采用位于地心的理想化磁偶极子（即尺寸很小的环形电流）模型来代替（下图中红色圈），而指南针的环形电流漩涡方向为垂直于针的方向，指针在外磁场作用下受到力矩偏转，最终会转到平衡位置——指针与磁感线方向一致的位置，或者说，环形电流与磁场漩涡一致的方向。当磁针在平衡位置指向南北时，电流漩涡方向平行于赤道平面，即东西方向与与竖直方向张成的平面。注意在南北极点的磁感线垂直与地面，磁场漩涡完全平行与地面，此时指南针失灵（没有水平表盘限制它将指向上下方向）。<a name="earth_mag_distribution"></a>
![地球赤道附近的地磁场漩涡与指南针环形电流匹配](/img/compass4d03.svg)
（题外话：注意图中标注的N/S是与地理南北极相反的地磁南北极。为什么会相反呢？我们把磁铁上指向北方（地理）的磁极定义为北极，然而同性相斥异性相吸，对于地球这个大磁铁来说，能够吸引北极的磁极就应该是南极（地磁）。）

怎样磁化四维指南针呢？仿照三维，我们可以构造这样的指南针：与刚才三维空间中的分析一样，磁针会偏转到其环形电流漩涡取向与外磁场漩涡一致的方向上，（我们稍后会分析有表盘与轴限制的影响）。简单起见，假设探险家位于东西方向的赤道上（别忘了四维星球的另一边还有阴阳方向的赤道哦），这里的磁场漩涡方向与赤道平面平行，探险家感受到的地磁场漩涡为东西方向与竖直方向张成的平面，磁针的侧面自然会跟东西方向对齐。对齐后，不同于三维情形磁针一定指南，磁针在地面上垂直于东西方向的平面中可随意转动，因为它与赤道平面绝对垂直，转动并不会影响磁场的对齐，也就是说，这个指南针的侧面指向东后，指针到底指哪是无所谓的，它更像是一种“指东针”！为什么好端端类比的指南针变成指东了呢？看下图就能发现：其实地球上的指南针与指东针并没有本质区别，只是制造的时候指针的形状不一样而已，只有到了四维它们的差别才显现出来！既然如此，我们直接让环形电流与指针对齐制造指东针吧。

![在地球上指南针某种程度上等价于指东针](/img/compass4d02.svg)

有没有其它的磁化方法呢？根据对称性，东西方向与阴阳方向（即两个绝对垂直的环形电流的方向）之间的地位没什么不同，说不定我们可以造出一个“指阳针”，那样东西阴阳方向都确定了剩下与它们垂直的南北方向也就都能确定！如何制造指阳针呢？我们看到，指东针的环形电流所在的二维平面垂直于三维地面，那么自然另一种做法便是让环形电流完全位于地面内，下图将这两种磁化方式都画出来了，值得注意的是，这两种磁化的方向是绝对垂直的，因此不能在同一个3D视图中画出。（指东针为侧视图而指阳针为俯视图）
![四维探险家可能用的指东针（左）与指阳针（右），注意磁针颜色与磁极无关](/img/compass4d02.jpg)


这样设计的两款指针真的会在星球任何地方都分别指向东西与阴阳方向吗？别着急，下面先看看两种指南针在磁场中的受力以及偏转情况。指东针拥有竖直的漩涡磁场，它会在水平方向上转动去匹配地磁场的竖直分量，而不管水平分量；同样指阳针拥有平行地面的漩涡磁场，它会在水平方向上转动去匹配地磁场的水平分量，而无视竖直分量。

虽然匹配理论很形象，“事实”是否如此呢？读者若不关心请[跳至下一小节](#skip)。之前在介绍四维电磁学时通过计算模拟分析过四维磁偶极子在外磁场中偏转各平衡位置的稳定性，发现只有磁偶极子朝向与外磁场漩涡一致才是稳定平衡位置，因此漩涡匹配理论是靠谱的，然而当时没有考虑表盘对垂直转动的限制，因此还需要将磁场正交分解来进行受力分析：四维空间中力矩是一个2-向量，如$e_{xy}$表示一个单位大小的力矩，其旋转方向是从x轴正方向旋转到y轴正方向。我们将任何一个2-向量在直角坐标系下分解可以得到$e_{xy},e_{xz},e_{xw},e_{yz},e_{yw},e_{zw}$6个分量。设w轴为竖直方向，则含w方向的$e_{xw},e_{yw},e_{zw}$这些力矩会让磁针上下偏转，但由于中轴的固定作用导致磁针无法转动；剩下的三个方向$e_{xy},e_{xz},e_{yz}$都落在三维的地面空间内，正好是指南针自由转动的自由度。接下来看产生力矩的磁场。由于表盘限制，并不是所有磁场分量都对能引起磁针偏转的力矩有贡献。这里我们要对两种磁化方向的指南针分开讨论。[这里分析过](/archives/electm4d/#d4)磁偶极子在磁场中受到的力矩的计算方法，它是一种介于内积与外积之间的叉乘运算。
1. “指东针”：磁针永远限制在水平方向，环形电流漩涡方向一定在地面某方向与竖直方向张成的平面内，即磁针磁矩取向也只能是$e_{xw},e_{yw},e_{zw}$的组合，根据叉乘运算规则，它们跟水平方向的磁场分量$e_{xy},e_{xz},e_{yz}$做叉积后得到的非零分量一定含有字母w，即都是那种被中轴限制了的上下转动，所以只有垂直于地面的磁场漩涡分量能让这种指南针偏转。
2. “指阳针”：磁化方向绝对垂直，刚好与上面相反。磁针环形电流磁偶极矩取向只能是$e_{xy},e_{xz},e_{yz}$的组合，它们跟$e_{xw},e_{yw},e_{zw}$方向的磁场做叉积后得到的都是那种被中轴限制了的上下转动，因此对于这种指南针只用关心磁场在水平地面上的分量。 


### 地磁场的分布规律
<a name="skip"></a>现在我们搞定了指南针的磁化方向与在外磁场中如何偏转，那外磁场（即地磁场）的方向该是怎样的呢？本文忽略磁极与自转的地理极的误差，假定地理南北极与地磁南北极重合，故下文中的南北极不区分地理与地磁。从刚才[地球的磁场分布](#earth_mag_distribution)中可发现，磁场在球面上平行地面的分量分布规律都是赤道强两极弱，垂直地面的分量则赤道弱两极强。注意漩涡与通常的磁场方向（即磁力线）是垂直的，如果描述漩涡，水平竖直的变化规律就会刚好对调：**磁场漩涡在球面上垂直地面的分量分布规律都是赤道强两极弱，平行地面的分量则赤道弱两极强**。类比到四维，如果磁偶极子电流的方向还是东西方向，则从东西方向赤道出发往南北赤道高纬度走，垂直地面的分量逐渐减弱至零，平行地面的分量则相反，从零逐渐增强；如果磁偶极子电流的方向是阴阳方向，则整个规律相反：从东西方向赤道出发往南北赤道高纬度走，垂直地面的分量从零逐渐增强，平行地面的分量则逐渐减弱至零。下面用一个表格来总结一下：

|场源方向|分量|东西赤道|中纬度|阴阳赤道|
|:---:|:---:|:----:|:----:|:----:|
|**东西**|**垂直**|最强|渐弱|零|
|**东西**|**水平**|零|渐强|最强|
|**阴阳**|**垂直**|零|渐强|最强|
|**阴阳**|**水平**|最强|渐弱|零|

假设这个星球内部只存在东西方向的环形电流，我们来看看这两个指南针在星球上各纬度分别如何指向。首先我们的探险家从南极——东西赤道上出发，前往北极——阴阳赤道。在东西赤道上指东针感受到竖直方向与东西向张成的漩涡从而偏转指向东方，此时指阳针不受任何水平力矩，处于失灵状态，这其实跟地球上在南北极点处指南针失灵一样。在东西赤道的附近，阴阳方向是越来越小的圈（下图黄色，类比北极点附近的纬线圈），这里指阳针失灵也就很正常了。
![东西赤道附近的方向（俯视图）：赤道（粗红线）、东西（红）、阴阳（黄）、南北（蓝）](/img/compass4d04.jpg)

探险家沿任意垂直于东西赤道的方向出发往北走（赤道已是最南端），来到中纬度地区。这里地磁场是倾斜的，同时具有水平与竖直分量，此时的指东针与指阳针都能好好工作，探险家通过它们能够完全确定自己的方位朝向。最后他来到了北极——阴阳赤道。这里指东针失灵，指阳针正常工作。
![阴阳赤道附近的方向（俯视图）：赤道（粗黄线）、东西（红）、阴阳（黄）、南北（蓝）](/img/compass4d05.jpg)
只要不是刚好在赤道上，东西方向、阴阳方向与南北方向一定垂直，这启发我们可以直接把两种指南针互相焊死一起转动，或干脆做成一个同时有两种磁化方向的球形罗盘，直接在上面把东西南北阴阳六个方向都标出来！注意本来两个磁针如果指向一致，则它们的磁化方向绝对垂直，然而现在它们夹90度角，因此罗盘拥有的两个磁场其实是半平行半垂直的，因此叠加后罗盘的磁矩并不是是一种复合的磁场，而是与水平面有45度夹角的简单漩涡磁场——我们可以通过法线来更好理解这个叠加。（注：四维空间中只有两共三维空间（半平行）的2-向量漩涡才能标出法线相加得到新的有单一方向的简单漩涡，非半平行的2-向量叠加后为复合2-向量漩涡——这些2-向量无论叠加几次均可最多用两个绝对垂直漩涡的叠加来表示）
![指东针与指阳针相互垂直时磁场的叠加，注意两个视图中垂直三维纸面向外的方向标为圆点，向内标为叉](/img/compass4d06.jpg)
至此，我们将两个指南针合二为一，类比出来的指南针非常完美！除了在南北极赤道，探险家拿一个三维的罗盘就可以精确对齐东西南北阴阳！
### 四维星球地磁场与指南针仿真模拟

我做了个交互式的四维星球场景，你可以动态观察这颗星球上的太阳运行规律，同时用指南针进行导航：
- [点击这里运行](/tesserxel/examples/#navigation)
- 如果打不开请参考[这里的教程](/archives/tesserxel-hello/)。

![23年4月16日更新：Tesserxel引擎示例库中的四维星球场景，下方为太阳高度角变化曲线](/img/tsx002.jpg?size=500x)

该星球只有短日赤道方向上有环形电流地磁场。根据[《四维世界（一）：行星的昼夜季节》](/archives/orbit4d/)，在两个赤道上只会分别感受到长日与短日时间变化，而中间纬度地区则为两种周期的叠加，因此我们一是可以通过太阳高度曲线判断是否来到了极地，二是可以根据指南针的指向判断。如果你对所有概念与操作都清楚，你会发现这两个判据在模拟中是一致的，指南针确实能够按我们的预想完全正确工作！

### 四维星球特色：复合地磁场

然而，还是那句老话，世界上没有那么完美的事物。我们可以猜想，四维星球中央的磁偶极子可能或多或少都有一点复合磁矩——即环形电流不仅只在东西赤道方向，其绝对垂直的阴阳赤道方向也有较弱的环形电流。我们的指东针、指阳针或这种复合的对偶罗盘在复合的地磁场下能否按预期工作呢？提前剧透一下：很遗憾不能。
简单（非复合）的地磁偶极子可以算是直接从三维类比过来的，然而如果磁场是复合的，这里磁针的平衡位置可就没那么直观了，但我们可以把复合场分解成两个绝对垂直的简单磁场的叠加，磁针受到的力也可以分解为在这两个磁场中分别受到的力。

我们的探险家又来到了另一个四维星球，它的地磁偶极子阴阳方向的环形电流是东西方向的三分之一。探险家现在站在南极赤道上，东西方向环形电流在这里只产生垂直地面的磁场，阴阳方向的环形电流只产生平行于地面的磁场，因此他手里的指东针与指阳针能够同时工作！之前在简单磁场下会失灵的指阳针现在将指向哪呢？答案是它居然也会指向东西方向！其实这也好理解：不难看出无论地磁环形电流是什么方向，按指东针磁化方式做的磁针都会倾向于指向环形电流的方向，而按指阳针磁化方式做的磁针则指向垂直于环形电流且垂直于南北的方向。不同于东西方向，阴阳方向的“指东针”此刻变成“指阳针”，“指阳针”却变成“指东针”，因此它们都指东！我们总结出一张表，把所有地方所有情况下的受力情况列出来：

|磁针类型|地磁方向|东西赤道|中纬度|阴阳赤道|
|:---:|:---:|:----:|:----:|:----:|
|**指东**|**东西**|最强|渐弱|失灵|
|**指东**|**阴阳**|失灵|渐强|最强|
|**指阳**|**东西**|失灵|渐强|最强|
|**指阳**|**阴阳**|最强|渐弱|失灵|

其实不分析任何具体偏转方向通过对称性就能得出结论——磁场沿垂直于赤道的方向都是完全对称的，除了指东，你根本不可能期望任何感应地磁的仪器分辨出其它方向，因为就像在地球的南极点上一样，任何方向都是北方，极点处东西方向已失去了意义。

接着探险家往北走，随着北上，他手里的两个指针从最开始都指向东西方向，到后来角度慢慢分开变大，继续北上角度又都慢慢变小，当他来到北极的阴阳赤道时，两只指针已经完全重合，都指向阴阳方向了。看到复合磁场星球下指南针导航的复杂性了吧！为什么会这样呢？对于复合场，每一种指针会在两种作用力的叠加下指向到一个新的平衡位置，这个位置往往与两个磁场都不重合，是两边博弈平衡的结果。这种遵从平行四边形的矢量合成对保持角度并不友好，用计算机计算可知道，除了它们还是会垂直于南北方向，这两种指针的夹角并不垂直，且它们与东西阴阳方向均有夹角，且角度会随维度变化而连续变化，这就非常麻烦了：想象四维探险家要在不同纬度下重新校准指南针，而且他还得懂得计算这些偏差角或事先算好查表！
<img src="/img/compass4d03.png" style="width:100%;max-width:400px" alt="横坐标：纬度；纵坐标：两指针夹角（绿）、指东针相对东方的方位角（橙）、指阳针相对东方的方位角（蓝）">
同时看两个指南针太麻烦了。如果我们还是像单旋转星球的指南针那样，把两种磁化方向都做到一个球形罗盘上，合理控制水平竖直两种磁化强度的比例，说不准就能能给探险家指向正确的方位。计算表明，小心控制磁化强度的比例确实能够修正偏差，让球形罗盘重新对齐东西阴阳方向，然而不同纬度下控制磁化强度的比例是需要变化的，因此你或许要去买一些“当地罗盘”，它们只能在同纬度区域的附近用。探险家如果要环游世界，他需要的通用指南针还得是两个指针，首先与两指针垂直的方向是南北方，且根据右手定则能确定哪个是南哪个是北。要知道东西阴阳的方向会麻烦些：首先读出两指针的夹角，通过查表得到自己的纬度，这一步还有个难点——从刚才的曲线可知，一般来说一个夹角会对应两个纬度，这时还要探险家自己判断高低纬度，这在曲线极值附近判断既困难，对纬度的确定误差又大；最后再通过纬度查表确定修正自己的指南偏差。可以想象“当地罗盘”使用方便，适合在一块小区域内探险的非专业人士；通用指南针要看两个指针，还要查表校正，上手门槛高，但却是资深探险家的不二之选。如果四维星球文明的科技进步了的话，不排除通过机械/电子装置，自动根据两磁针的夹角调整罗盘的磁化比例，这样就可以有傻瓜式的通用罗盘了（前提是要解决确定纬度的困难）。（既然科技发达了，为什么不直接用陀螺仪、卫星定位导航？）

如果阴阳方向环形电流相比于东西方向非常小，那么可以预测的是集成了指东针与指阳针罗盘应该能够勉强工作。下图是地磁偶极子阴阳方向的环形电流是东西方向的百分之一的磁针夹角变化曲线：
<img src="/img/compass4d04.png" style="width:100%;max-width:400px" alt="横坐标：纬度；纵坐标：两指针夹角（绿）、指东针相对东方的方位角（橙）、指阳针相对东方的方位角（蓝）">
下面我们再看一种极端的情况：自对偶磁偶极子——一种类似于等角双旋转的东西、阴阳环形电流强度相同的偶极子。跟等角双旋转一样，这种偶极子高度对称，它还可以有很多分解环形电流的方式（参考[《四维空间（七）：N维的向量》中的正交分解](/archives/bivector4ds/#orth)）：你可以把任何一个地方当作南极，过此地顺着Hopf纤维丛的方向就是赤道，垂直于它的就是北极。这样的星球上两种磁针都会指向Hopf纤维的方向，如果电流流动与星球自传相同，则星球做等角双旋转，且磁针指向该点星球的运动方向。也就是说其实等角双旋转星球上的磁针也没有完全失灵！它还保留了一个方向给探险家做方位提示！如果星球的两个环形电流非场接近，但还差一点（99%），这样东西南北阴阳都还有意义，指南针的夹角曲线随纬度变化就是这样的：
<img src="/img/compass4d02.png" style="width:100%;max-width:400px" alt="横坐标：纬度；纵坐标：两指针夹角（绿）、指东针相对东方的方位角（橙）、指阳针相对东方的方位角（蓝）">

### 自对偶与反自对偶磁偶极子

大家或许会注意，为什么要说指南针、指东针、指阳针，不说指北针、指西针、<ruby>指阴<rt>~~(只因)~~</rt></ruby>针呢？它们反正就是指针的两段，大多数时候是无所谓的，然而当我们把指东针与指阳针焊在一起演变成复合磁场的罗盘时，方向就是有所谓的了，特别是在地磁场也是复合的时候。下面看一个极端点的例子：一个四维星球的地磁场是自对偶磁偶极子，这时星球上任意一点的磁场都一样，都能被当做“南北极”，由南北极的完全对称性，这个星球上每点的磁场水平分量等于竖直分量，指东针与指阳针刚好一个感应水平分量，一个感应竖直分量，因此它们所受的力也一样，探险家在这样的星球上用哪种类型的指南针都一样，这也从另一个角度解释了等角双旋转星球上两个指针会重合。我们甚至可以把两个指南针完全重合没有夹角地绑在一起使用，（不像之前设计的罗盘要求垂直焊死），这样得到的指针可见跟单独的指阳针、指东针指向没区别，但它拥有两个绝对垂直的磁化方向，磁针本身也是一个类似自对偶的磁偶极子！但是如果我们在绑定指东针与指阳针的时候不小心把方向弄反了（指阳针变成了<ruby>指阴<rt>~~(只因)~~</rt></ruby>针），则新的磁针的两个分量每时每刻都受到等大反向的力矩，导致合力为零，从而失灵。这种磁针的偶极子与方向相同叠加出的磁偶极子的磁场互为镜像——你可以理解自对偶如果是自西向东加自阴向阳的环形电流，而反自对偶则是自西向东加自阳向阴的环形电流。四维静磁学中有个经典的结论：如果将自对偶磁偶极子与反自对偶磁偶极子看成两种“磁性”，则异性之间会相互吸引，但同性之间既不吸引又不排斥，它们之间完全没有相互作用力！

### 地转偏向力用于导航

有没有其它的辅助探险家们判断方向的手段呢？我们知道在地球北半球，水池下水口的漩涡是逆时针的，南半球相反，这是地球自转产生的偏转力在起作用。在四维星球上情况如何呢？它能不能帮助我们找方向呢？
为了回答这些问题，我们先来看看三维空间中旋转参考系下物体受到的惯性力，物体将受到两种类型的惯性力：第一种是离心力，第二种则是这种偏转力(也叫科里奥利力)。我们重点关注第二种力。维基百科的科里奥利力词条里面的一个gif动画很清楚地展示了这种偏转力的实质：由于不受力的物体匀速直线运动在旋转参考系下不再是直线，因此需要引入一个虚拟的惯性力来让物体偏移直线方向。
![来自维基百科词条](https://upload.wikimedia.org/wikipedia/commons/b/b6/Corioliskraftanimation.gif)
注意该力与物体运动方向垂直，因此不会改变速度大小。是不是觉得跟磁场中的洛伦兹力有点像？其实第一类惯性力像电场力，第二类惯性力像磁场力，在广义相对论中还有一种叫[重力电磁性](https://zh.wikipedia.org/wiki/%E9%87%8D%E5%8A%9B%E9%9B%BB%E7%A3%81%E6%80%A7)的线性近似。。。

回到水池的漩涡上来。跟指南针的情况类似，旋转赤道上的水流受到的科里奥利力在竖直方向，但这种偏转力十分微弱，无法与重力抗衡来产生可观测的效应，因此只有地球自转角速度在三维地面上的分量$e_{xy},e_{xz},e_{yz}$才对流体有影响。由于三维空间中的2-向量都是简单的，我们总能找到一根不参与旋转的转轴，转轴方向上的水流是不会受到偏转力的，它们会径直流进出水口，轴线周围的水则会在偏转力作用下形成像旋风一样的结构。
![水漩涡的俯视图](/img/compass4d07.jpg)
探险家通过旋风的方向运用三维地面空间中最标准的右手定则就能得到一个明确的指向。如果地磁场在各种大小方向从比例上跟自转角速度场完全一致的话，则这种水漩涡方向的“指南针”跟第二种阴阳指南针一样。然而这样就表明指阳针有的缺点它都有，包括赤道失灵、双旋转星球误差等等。注意，星球自转可以看成刚体，角速度场永远是均匀的，而地磁场是偶极子场，虽然它们水平垂直分量的变化趋势差不多，夹角偏差、失灵也会产生，但水平垂直分量的变化的方向是反的，具体偏差的计算修正方式也完全不相同。然而根据地转偏向力只能做出指阳针，根本就没机会跟不存在的指东针比较夹角大小……

最后我们看看降维到三维的地球情形我们的水漩涡指阳针会变成什么呢？地球仅在做自西向东的单旋转，由于二维球面上没有阴阳方向，水漩涡指阴阳退化成了逆时针顺时针两种点状漩涡的情形，用它仅能区分我们在北半球还是南半球。

### 星空用于导航

四维世界的先贤早就对天文学有了深入研究。虽然天空中的繁细要比地球上稀疏得多（三次方反比导致轨道不稳定惹的祸），但通过星图找方位还是有一定的参考价值。通过观察特定星星在天空中的轨迹，可以反映星球自转的情况进而推算出所在纬度。四维星球上有没有类似北极星的那种可以直接朝着它走就能到固定方位的星星呢？四维星球的主要问题是它没有自转轴，只有自转平面。如果是单旋转星球，则我们可以找到那个不自转的赤道，它那一圈上方的所有星星都相对地面不动，假设自西向东单旋转，不动的赤道为阴阳赤道，只要我们提前标注好这些星星，通过辨认一直朝某颗星走是可以直接来到阴阳赤道上给定的某个经度位置的。如果你的目的地不是极地，则不能单纯靠一颗星导航——在任何地方看到的在阴阳赤道上的所有星星的连线也一定平行于阴阳方向。其实双旋转星球下也适用：星星会沿着这条连线移动，并不会妨碍导航。东西方向同理，只要认得东西赤道上方一圈星星，找连线即可。这种方法甚至在高度对称的等角双旋转星球上也适用！只要你记得特定赤道上方的星星，星图就会打破双旋转那可怕的Hopf纤维丛对称性，让你不再迷路！看来通过星空来辨认方向是非常高效的，（还要啥指南针！）只要你能认识完两条绝对垂直的赤道正上方的一堆星星，还有，不要遇到阴天（看来指南针还是不能扔……）

研究清楚了四维星球上的导航方法，探险家编好指南针偏差校正表就准备上路去环游世界大冒险了！他一路上会见到怎样的风景呢？且听下回分解！