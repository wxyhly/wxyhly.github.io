---
title: 玩Tesserxel（三）：火车、飞行模拟器教程
tags:
  - Tesserxel
  - Webgpu
  - 模拟
  - 四维
categories: Tesserxel系列
date: 2023-12-08 15:51:11
index_img: /img/tsxfsm027.jpg
excerpt: 这篇文章将介绍Tesserxel中的四维一维轨道火车（传统铁路+火车）、二维轨道火车（也叫汽火/火汽车）、无人机与四维客机四个示例场景的操控玩耍教程。之前几期介绍的场景都是静止的，我们只是主动操作摄像机换着四维角度以及三维角度观察场景本身或三维照片。这篇文章侧重于怎样驾驶操纵这些四维的交通工具，特别是如何操纵四维客机起降。
---
![Tesserxel中的四维飞机与四维火车](/img/tsxfsm027.jpg)

这篇文章将介绍[Tesserxel](/archives/tesserxel-hello/)中的四维[一维轨道火车](/tesserxel/examples/#rails::rail1d)（传统铁路+火车）、[二维轨道火车](/tesserxel/examples/#rails::rail2d)（也叫汽火/火汽车）、[无人机](/tesserxel/examples/#drone)与[四维客机](/tesserxel/examples/#aircraft)四个示例场景的操控玩耍教程。之前几期介绍的场景都是静止的，我们只是主动操作摄像机换着四维角度以及三维角度观察场景本身或三维照片。这篇文章侧重于怎样驾驶操纵这些四维的交通工具，特别是如何操纵四维客机起降。这几个场景对应的交通工具的设计细节与运行原理已经在之前文章中均有一些介绍，感兴趣的话可以看看：
- 一维轨道火车与二维轨道火车：[《四维世界（三）：道路轨道设计》](/archives/rail4d/)
- 四维无人机与四维客机：[《四维世界（九）：飞行器设计》](/archives/aircraft4d/)

提示：如果在玩耍过程中觉得左边的示例场景侧栏很碍事可以点击顶部的隐藏侧栏，再设置浏览器进入全屏模式来获得最佳体验。
<!--more-->

## 一维轨道火车场景
![一维轨道火车场景（初始机位，按Alt键旋转了观察三维体素的视角）](/img/tsxfsm004.jpg)
点击侧栏的[四维场景->一维轨道火车](/tesserxel/examples/#rails::rail1d)。场景加载后我们看到的是一段四维铁路，上面停着一列有着三个平板车厢的火车。提示：如果你不会看裸眼3D，可以按Alt+Z或在设置中关闭，免得左右两个视图对你造成困扰。摄像机初始位置位于车底与铁路地面之间，我们可以按住Alt键用鼠标左键拖动（记得按Alt+R复位哦）看到，视野中是一个有着四根轨道铁路，它由轨道和枕木构成。按T/G键可以控制火车前进后退。一维火车的控制方式比较单调，只能前进/后退，火车走到尽头会被弹回来。看右上角的水平截面，它截到火车的轮子，之前说过这个视图丢掉了重力方向，可以看到三维地面的“全貌”，建议可以按下图顺序点击右边的齿轮按钮选择更大的截面视图（也可按Alt+2）或单独放大水平截面视图（也可按Alt+6）,以便更好观察。![截面选择](/img/tsxfsm003.png)按空格或Shift键上下调整高度将让水平截面视图截到不同的东西，视野中的物体将会不断变化。下面展示了截到轨道或车厢的场景，这根[上篇玩Tesserxel系列文章中讲四维城市高速场景的例子](/archives/tesserxel-scene/#buildings)很像，需要注意必须要平视前方，如果不小心碰到了滚轮需要重新按上篇文章中的方式调整相机俯仰角。
![像过山车一样的四维铁路轨道（水平截面）](/img/tsxfsm003.jpg?size=400x  )
![截到轮子的水平截面](/img/tsxfsm002.png?size=400x)

通过鼠标（或键盘的Q/E/A/D）移动相机到轨道外面望向火车可以发现，这是火车有着三节车厢，其中每一节有前后两个转向架，每个转向架都像标准四维汽车那样拥有8个轮子，所以这列火车一共有48个轮子。铁路和轮子的具体设计方案请看[《四维世界（三）：道路轨道设计》](/archives/rail4d/)。
![可以看到有着三节车厢的火车](/img/tsxfsm005.jpg)

## 二维轨道火车场景

下面再来看看二维轨道火车场景。点击侧栏的[四维场景->二维轨道火车](/tesserxel/examples/#rails::rail2d)。二维轨道火车是一种介于三维世界汽车与火车之前的神奇东西，这个东西的介绍见[这篇旧文](/archives/rail4d/#planar-rail)。打开二维轨道场乍一看与一维轨道火车没什么不同，但当我们按住Alt键鼠标拖动三维体素照片旋转（记得按Alt+R复位哦）就能发现，这个二维铁路几乎就是三维的正常铁路朝一个方向柱化升维得到的，因此是两根平行的面状轨道。![二维轨道火车场景（初始机位，按Alt键旋转了观察三维体素的视角）](/img/tsxfsm007.jpg)这种轨道上跑的“汽火车”不仅能像一维火车可以通过键盘T/G控制前进后退，还能通过键盘R/Y控制前轮转向。当火车开动后你会发现，该场景的相机虽然可以自由移动，但会默认跟随汽火车。可以按键盘B键在跟随与不跟随之间切换。目前相机跟随模式下有个不能改变相机的俯仰角的bug，若想望天或俯视地面请先按B键关闭自动跟随模式。当火车静止时分别按键盘R/Y可以在水平截面视图中看到前轮在转向，注意这个转向只有一个自由度，而不是像四维汽车那样有三个自由度（别忘了四维汽车有自转）。注意**如果火车撞向护栏了将会弹出窗口提示火车脱轨了，要想继续玩耍必须重新刷新加载页面**。具体怎样会出轨请看后面对车道的描述。
![二维轨道火车方向盘控制的四个前轮（水平截面视图）](/img/tsxfsm005.png)
在说如何控制汽火车往前走之前，我想先说说之前的文章没涉及到的火汽车具体车轮转向系统的细节。当我开始做这个二维轨道火汽车模拟场景时才注意到它不能像汽车那样只是前轮转向，后轮固定。由于火汽车的后轮在铁轨上，可能会像下图那样发生空间弯曲，因此它还需要一个只有一个自由度的转向架。这个转向架只能沿红色箭头转动。同理前轮也需要转向架，但它的轮子可以在转向架上像汽车前轮那样用方向盘控制沿绿色方向的摆动。可以说这东西同时拥有三维世界里的汽车与火车的转向系统，它们各分管一个方向上的运动。![二维轨道火车方向盘与转向架各负责的方向](/img/tsxfsm004.png)
若汽火车处于加载场景后的默认位置，现在按T键前进可以完全不用打方向顺着铁轨慢慢往左转弯，这个转弯对应上图中的转向架红色方向。等左弯转过后，会来到侧前侧后方向的弯道，这个弯道就要像控制汽车方向盘那样操纵汽火车过弯。如果此时还不用R/Y控制方向，汽火车将冲出弯道撞向护栏而出轨。需要提醒的是，从水平截面视图上看到的上下两块带子其实并不是截到的轨道，而是路边的防止车出轨的护栏，我们可以从垂直的正截面或侧截面视图中看这个到护栏，比如下图中的右下角的截面。
![二维轨道的防出轨护栏](/img/tsxfsm006.jpg)

由于二维轨道可以像汽车那样控制方向，所以这个铁轨上面其实还像汽车那样是刷了车道线的。可以按空格键升高相机，再滚动鼠标滚轮俯视铁轨（若不能改变相机的俯仰角请按B键关闭相机跟随），比如下图能够清晰看到铁轨被黄线划分成了5个车道。从下图右上角的水平截面还能够看到这铁路两端的护栏跟三维世界铁路尽头的挡板其实是非常像的。
![二维轨道的俯视图，能看到车道划分](/img/tsxfsm008.jpg)

## 四维无人机
点击侧栏的[物理世界->无人机](/tesserxel/examples/#drone)，场景加载后无人机处于静止状态，且当前处于**控制无人机模式**。下面我们来看看四维无人机操控的教程。

### 无人机的起飞
现在我们可以按几下空格键，无人机螺旋桨将会旋转起来并起飞。如果一直按住空格键不放，无人机将飞出相机视野外，我们可以快速短暂按空格键来尝试控制飞机悬停在视野中。可以着重关注一下图中标出的高度参数，它指示了飞机的相对与地面的高度。
<img alt="无人机起飞，关键参数与设置用红框框出" src="/img/tsxfsm001.jpg" style="width:100%;max-width:400px">下面说说自动模式与手动模式的切换：按键盘T切换到自动模式后，空格键让飞机上升，Shift键让飞机下降，什么键都不按飞机则会自动调节螺旋桨的转速实现缓慢悬停，由于自动控制系统的瑕疵，悬停稳定过程有点慢且会有些漂移。可以搭配切换空格键与Shift键让飞机最终悬停在一个合适的高度。

### 切换视角观察无人机
按B键可以切换键盘控制的是无人机还是相机。切换到相机模式后，按空格键/shift键就会变成相机的升降移动，而不再会对无人机有控制权；切换到无人机模式后，所有键盘操作都针对无人机，无法控制相机移动，由于不涉及鼠标控制无人机的操作，鼠标拖动还是能够让相机转向。相机默认是不跟随无人机运动的。要想切换到跟随无人机的相机机位，按数字键1、2、3即可。注意按Alt键加数字键是切换渲染体素照片的各截面视图配置等模式，而不再是机位选择。当选择了这些跟随无人机的机位后，相机与无人机绑定在了一起，因此无法直接继续控制相机，所以系统会默认切换到控制无人机模式。

### 手动模式平飞练习
飞机起飞后我们肯定希望能控制飞机水平飞行。无人机平飞在手动模式与自动模式下的体验差别是挺大的。为了搞清飞行控制原理，我们首先来试试手动模式。按1键切换至跟随飞机视角，按住空格键不放，直到飞机上升到大于200米的高度，注意可以观察垂直速度分量来判断飞机的上升速度。可以先飞高一点，为待会可能会出现“险情”把高度留够，免得一下子飞机就砸地上了。轻轻按一下键盘D，你将发现飞机开始向右倾斜（体现在左下角截面的地平线向左倾斜），当倾斜有一定夹角后（最好别大于30度），再按下相反方向的键盘A，把倾斜角度的增大趋势给刹住，注意做这些操作时要记得时刻按几下空格保持高度以防坠毁地面。当倾角稳定后，按住空格键给飞机动力，此时倾斜的飞机将产生向右的加速度分量，从而开始加速向右平飞。要想让飞机减速则需要按a键调整飞机左倾，然后再减速，速度快减到0时还必须调整飞机回到水平姿态，否则飞机就会从向右减速运动变成向左加速运动了。控制飞机前后运动使用W/S键，操作方式与左右运动相同，同理还有通过Q/E控制的侧前/侧后方向的运动。

我在调试中发现了一个模拟中的<ruby>特性<rt>bug</rt></ruby>，那就是按住空格键的同时用W/A/S/D/Q/E这些键调整飞机倾角控制平飞的键，比起不按空格时调整倾角来得快。这样相当于有了**粗调**与**微调**的功能。当要微调飞机角度时，建议按住空格键调整，反之当飞机倾斜速度太大需要及时纠偏时则推荐别按空格/Shift直接用W/A/S/D/Q/E控制倾角。<img alt="按1切换至机载相机升空后，按键盘A/D控制飞机左右倾斜" src="/img/tsxfsm002.jpg" style="width:100%;max-width:400px">

除了平动，还有三维地面中不涉及重力的转动的控制，比起平动的操作要简单得多：直接用I/J/K/L/U/O控制转向，不会有飞机翻车的风险。如果飞机已经失控不断翻滚，按T马上进入自动模式还是有很大概率能够改出拯救飞机的。

### 自动模式平飞练习

自动模式下飞机永远不会翻滚得底朝天，平移也会更加易于控制。按键都是一样的，大家就自己慢慢体验吧。最后想说的是，如果要让飞机熄火停转，无论在地面还是在空中都必须切换回手动模式，因为自动模式下，飞机一直持续通过算法控制螺旋桨旋转来接近目标速度，就算待在地面上了桨叶也一样转个不停。

### 无人机螺旋桨的旋转方向辨别

下面通过该场景看一下无人机螺旋桨的构造与旋转的方向辨别。虽然前面的内容不要求读者看过[《四维世界（九）：飞行器设计》](/archives/aircraft4d/)，但本节内容是需要无人机设计中的内容做基础，如果不感兴趣阅读可以跳过该节。
首先我们按大键盘数字2切换到无人机上的一个机位，该机位的水平截面恰好能截到所有的螺旋桨的桨叶，可以很方便地看到这些桨叶的旋转方向。由于水平截面不包含重力方向，所以无法从中看出桨叶片的倾斜方向，也无法判断目前的旋转方向到底会让叶片受到上升还是下降的力。我们需要在其它视图中去寻找。

如果开启了裸眼3D显示，按Alt+Z关掉它，因为左右眼的视差稍后会有点干扰。先让飞机停在地面，切换到手动控制模式，按1或2将相机对齐飞机，然后按B切换回控制相机模式，如果要观察左端的螺旋桨，则需要按A键慢慢左平移相机，将要观察的螺旋桨移动到画面中央，此时右下角的截面将出现一个完整的三维桨叶形状，此时按B切换到控制无人机模式，轻按一下空格，就能看到这个桨叶完整的旋转了，并且能从倾斜方向看出它的旋转方向确实能受到升力。同理侧前侧后方的螺旋桨也可由类似该方法看到，只不过要用Q/E将它移动到画面中央，且完整的螺旋桨将出现在左下角的截面中。（提示：可以按快捷键Alt+C开启十子准星以便定位画面中央）<img alt="从截面观察柱化后的螺旋桨的底胞" src="/img/tsxfsm010.jpg" style="width:100%;max-width:400px">怎样看到前后的螺旋桨的旋转方向呢？很遗憾所有截面都无法找到能够完美展示它的方向，是不是就没办法了呢？其实我们可以直接在3D体素视图中看到前面螺旋桨在竖直方向上的倾斜方向。前螺旋桨是里相机最近的，在控制相机模式下按W键前进，可以看到画面中有个水平面上的螺旋桨变得越来越大，前螺旋桨就是它了。这里建议直接按Alt+3关掉所有截面显示，按Alt加鼠标左键拖着看就行啦（会裸眼3D建议这里开启看哦，快捷键是Alt+Z）。至于后面的螺旋桨遮挡实在太严重了，要想看它的旋转方向，只能绕到后面去看了。其实前后/左右/侧前后的螺旋桨都是对称的，你也可以调整相机正对着左右螺旋桨，这样就可以用看左右桨的方式来看前后螺旋桨了。调好相机位置后按B键切换到控制无人机模式，在手动模式下此时快速按一下空格键，可以看到前螺旋桨的旋转方向确实也是产生的升力。
<img alt="从三维体素视图看前螺旋桨" src="/img/tsxfsm011.jpg" style="width:100%;max-width:400px">

## 四维飞机
下面我们来看本文压轴的四维客机飞行模拟器。点击侧栏的[物理世界->客机](/tesserxel/examples/#aircraft)。记得小学的时候玩Google地球，惊喜地发现软件里面就自带了一个飞行模拟器，虽然现在看起来有些简陋，但在当时却是百玩不腻。
我们都知道，四维地面是三维的，在四维道路上开车跟在三维空中开飞机的自由度是一样的，但四维飞机却能够在此基础上再加一个高度方向，玩四维的飞行模拟器会有什么体验呢？可惜现在市面上我没找到任何四维飞行模拟器，就只有自己动手使用Tesserxel中的物理引擎手撮一个模拟器了。
![Google地球自带的飞行模拟器](/img/tsxfsm012.jpg)
### 四维飞机构造
打开物理世界下的客机场景，场景加载后就能看到一架停在跑到上的客机。默认模式是控制相机模式，我们可以先绕着飞机转几圈，观察一下它的构造。如果你对飞机模型的构造不感兴趣，只想体验操控飞机，那么请按大键盘数字键1直接登机并自动进入控制飞机模式，具体操作请看下一小节。
![鼠标拖动控制相机稍微侧一点角度就可以从右上角截面看到截到了飞机上的呈120度分度的三个东西](/img/tsxfsm013.jpg)
由于四维飞机模型部件很多，过于复杂，我们先从截面上来认识各具体部件，然后再尝试在体素视图中辨认它们。首先我们先复习一下在三维地面上游走的操作：将注意力放到右上角的水平截面当中来，你可以根据个人喜好选择大截面模式(Alt+2)或单独显示水平截面的模式(Alt+7)。按鼠标左键拖动可以改变在三维地面上的朝向，按W/S前进后退，A/D左右移动，按Q/E上下移动。注意这里是三维地面视图中看起来的“上下”，其实水平截面丢掉了真正的上下重力方向，Q/E方向对应的移动其实是侧前后方向(ana/kata)。真正的重力方向上的移动使用的是空格键与Shift键。调整到不同的高度，水平截面将会截到不同的东西，比如我们可以看到飞机上的窗户的分布，三个成120度对称分布的机翼，从截面截到机翼的位置可以看出机翼末端是微微上扬的，我们还能看到尾翼的水平安定面和垂直安定面，以及最底部的飞机起落架轮子。至于这些东西为什么要这样构造不是本文的内容，具体设计原理请参考[《四维世界（九）：飞行器设计》](/archives/aircraft4d/)。

![上下移动相机，水平截面扫过飞机的截面变化](/img/tsxfsm001.gif)
可能有的读者不太适应看没有重力方向的水平截面，但垂直截面很多时候因为截不到飞机的重要结构而显得有些诡异：比如由于机翼、起落架的轮子都是120度分布，按1键对齐飞机后，再按B键夺回相机控制权就能看到左下角截面中的飞机所有东西都只有一半。为了看到隐藏的其它部件，可以按Z/X键让相机自转以旋转截面。
![正截面视图中的四维飞机并不是“缺胳膊少腿”](/img/tsxfsm014.jpg)
看到飞机全貌的方法是俯视它。我们按空格键升空，再使用鼠标滚轮或K键俯看地面，适当调整角度后，就能看到机翼与尾翼都是120度的飞机了。不要忘了体素视图是3D的，可以不时按Alt键拖动它转转以便了解三维画面中的结构，最后记得再按Alt+R复原以免搞混方向。
![俯视四维飞机](/img/tsxfsm015.jpg)

### 飞机跑道相关知识
你或许注意到了上一张俯视四维飞机的图里侧后面有一些整齐的白色方点。这些其实是三维地面跑道上刷的白线。继续解释四维跑道前，按照惯例先熟悉一下我们三维世界跑道。这是我在网上找的一张图：
<img alt="三维机场跑道上的标志线" src="/img/tsxfsm021.jpg" style="width:100%;max-width:400px">飞机跑道尽头像斑马线一样的东西其实是给要降落的飞机估计跑道宽度用的，然后往前除了跑道定位正中央的白色虚线外，还有一些白杠标志，这些都是用来提示飞行员测算着陆点位置的，而最佳的着陆点就是那两个大白块所对应的位置。我把这些东西升维到了四维，中线的白色虚线变成了十字准星放样虚线，十字准星比起简单的三维线条来说占三维视野的体素要多些，也更容易被截面截到方便我们观察。

![四维跑道中央的十字中线](/img/tsxfsm016.jpg)
用于降落的定位线则变成了一个圈，像靶心图案一样方便四维飞行员对准。这里四维机场跑道的截面是方形的，主要是因为建模简单，但我认为或许做成圆形更好，或许还能够做成对应飞机机翼的三角形来进一步降低修建跑道的占地面积。![四维跑道上的靶状降落定位标志](/img/tsxfsm017.jpg)


### 四维飞机的起飞
按大键盘1键切换到飞机上的相机视角，跟无人机类似，系统将自动切换到**控制飞机模式**。如果想重新切回控制相机，请按B键。现在按方向键上键打开油门（增加引擎功率），飞机将开始慢慢滑行。W/S键控制飞机的升降舵，等飞机速度示数超过70后连续轻按几下S键拉起飞机就成功完成起飞动作了。飞机起飞后需要按W/S键让飞机俯仰角保持在一定范围内，建议15度左右，不要让俯仰角超过30度。如果飞机速度不够强行拉起飞机，要么升力不够没有任何反应，要么会导致飞机机头抬升但机尾触地并与地面摩擦弹跳，按理说设计良好的飞机应该不会发生这种情况，但以我的能力确实调试不动了，只要规范操作起飞不出问题就可以了。
![起飞时要注意的关键参数（黄框标出）](/img/tsxfsm018.jpg)


### 降落练习入门级
其实飞行模拟器没有写判定飞机是否降落在跑道内，如果你不想练习降落其实也可以完全不管跑道，随便找地方怎么飞怎么降都行，但想要在跑道上完成降落还是需要一些练习的。如果起飞的过程很顺利，没有发生触地弹跳等状况，那么飞机默认是对准了前方远处的另一根跑道的，我们将练习在那里降落，如果飞起来后发现飞机有歪斜可以刷新页面重来，这很可能是起飞拉得太早或过猛导致的，或者直接参考下一节降落练习初级来调整飞机姿态。由于方向已经对准，下面的所有操作仅控制飞机的俯仰角，水平速度与垂直速度。跑道的边缘已经在体素视图中用红框框出，因此不必在截面中观察跑道。
![相机拉大后能够清楚看到前方的跑道](/img/tsxfsm019.jpg)
当跑道比较远时，可以按大键盘的9/0键让相机变焦拉近/拉远从而清楚看见远方的跑道，注意放大了记得调回来，否则待会不方便着陆时的观察。可参考下图黄框中的相机视场参数，正常值为90左右。
按住Alt键鼠标拖动体素，可以发现正对着的跑到形状是一个四棱台，看完后记得及时按Alt+R复原体素的视角以方便着陆时的观察。
![所有跑道都是长方体，在透视投影下变成四棱台](/img/tsxfsm020.jpg)

下面说具体降落流程。由于降落跑道其实距起飞的跑道非常近，所以建议飞机爬升高度到80左右后就要调整飞机俯仰角保持平飞了，飞行过程中高度不要超过150。当发现跑道如下图那样变得很长时说明飞得太高了，需要开始降低高度且马上要做降落准备。
![现在飞机飞行高度太高，需要马上开始下降高度准备降落](/img/tsxfsm022.jpg)
准备降落时还应该按方向键下箭头，将油门调至0.5左右，不要满油飞行以免速度太快错过降落，也不能提前收油，否则飞机速度不够将导致无法提供升力而坠落，水平速度建议至少保持在60以上，否则就有失速坠机风险。对好跑道后准备着陆前按键盘F可以打开襟翼（关闭则是Shift+F），它有助于飞机减速并提供升力，按K启用起落架的刹车系统。等飞机到了跑道前则可以完全关掉油门。当飞机触地后，如果角度过大，飞机会被弹起，此时可以视情况按W压低飞机。如果弹起太高，则需要重新调整飞机俯仰角，不能盲目压低使得着陆角度过大使得飞机下次着陆再次弹起。如果飞机着陆后滑行时有偏离跑道的趋势，可以通过短按J/L调整各轮子的刹车比例实现飞机左右偏转，使用U/O实现飞机侧前后偏转。建议在左下角截面视图观察飞机的左右偏离情况，在右下角截面视图观察飞机的侧前后偏离情况。

下面总结一下所有控制飞机模式下的快捷键分布：红色为直接按键功能，蓝色为需按住Alt键的视图控制功能，绿色为需按住Shift键的功能。
![控制飞机模式下的快捷键分布](/img/tsxfsm006.png)
这就是飞机降落的全流程了。估计刚上手很容易出现飞机飞过或着陆角度过猛，着陆速度过快冲出跑道，或过慢提前坠落的情况，多刷新几遍浏览器稍加练习几次，这个入门级难度的跑道其实是很好驾驭的，毕竟我们这里只需控制上下前后方向的飞机状态，还没有过多地同时涉及四个维度方向。
### 降落练习初级
玩降落练习入门级的跑道时你应该就会发现，它的左前方不远处还有一条有点斜的另一根跑道。我们这次就要尝试将飞机降落在这根跑道上。与入门级不同的是，这次我们必须要手动控制飞机在左右方向上对准跑道，才能降落。与后面的中级难度相比，这个跑道仅在左右方向上歪斜，并不需要我们同时去大幅度对侧前后方向，可能仅需要微调。
![入门级跑道（图中0）；左边的初级跑道（图中1）](/img/tsxfsm023.jpg)
下面来说操作步骤。首先正常起飞，待飞机平稳后按大键盘数字9键放大找到我们要着陆的跑道。按A/D键调整飞机的方向舵，飞机开始慢慢转向。其实这跟玩三维飞机模拟是差不多的，快要对齐时记得将飞机姿态回正，如果飞机左右横滚有倾斜，可以按住C不放，直到飞机的自动控制系统将调整飞机姿态至水平再松开，当跑道形状从一般的梯形变成等腰梯形时且正对十字准星就说明对正跑道了，之后的降落过程就跟上一节入门级的一样了，只是很可能飞机的方向与跑道方向有较大偏差，必须合理利用J/L/U/O控制各轮刹车比例来防止滑出跑道。
下面再给些提示：
1. 跑道外侧的红框只是方便我们在堆叠体素中看清跑道用的，且红框的长度比实际跑道长度要长一点，灰色的路面才是跑道，请注意不要过早降落到跑道外面或冲出跑道；
2. 要降落的目标跑道看起来还是钝角梯形时先不着急转向，因为这说明飞机当前位置离跑道轴线所在直线的距离还比较远。建议等变成直角了再转弯，差不多转完后就能变成等腰梯形了。<img alt="目标跑道看起来还是钝角梯形时先不着急转向" src="/img/tsxfsm024.jpg" style="width:100%;max-width:350px">
### 降落练习中级
![最远的跑道的位置（图中2）](/img/tsxfsm023.jpg)
最后我们来挑战一个很有难度的降落跑道，它也是这个场景中距起飞跑道最远的。这个跑道在左右方向上和侧前侧后方向上都是斜着的，理论上说，你只要学会了在这个跑道上降落，你就有能力驾驶着四维飞机去到任何地方的机场降落了。首先正常起飞，按数字9/0找到要降落的跑道。跟上个跑道一样先不要着急转弯，这个跑道距离更远，飞一会等看到跑道梯形的钝角慢慢变直了再转弯。
快速对齐左右方向让跑道边框看起来变成等腰梯形后，我们按住Alt键往左拖动体素视图，从体素原右侧方向观察，可以发现侧前后方向完全没有对准。使用Q/E像调节左右方向那样不断调节到侧前后方向看也变成等腰梯形后，按Alt+R键回到左右视图，如果左右方向又出现了偏差则要继续调整。也可以按Alt键拖动鼠标俯看体素视图，这样就可以同时看到左右与侧前侧后方向上的偏差，而此时的飞机跑道边线更像是太空中悬浮着的一个长条区域，飞机则需像太空船那样对接进去，这些视角可以按照个人习惯交替着切换，边观察边调整，确认各方向对好后接近跑道就可以降落了。
![俯看体素视图，可直接在左右和侧前后同时对点](/img/tsxfsm025.jpg)
操作原理是讲完了，但实际上手起来难度还是相当大的，我目前驾驶飞机在这个跑道上降落的成功率还不到一半。。下面给一些建议:
1. 整个对跑道的过程中，只需要看体素视图，截面视图几乎帮不上什么忙，因为除非跑道恰好经过体素的某些中间切片，或已经完全居中对齐，否则根本没机会出现在截面视图中。
2. 不要一味专心地去对跑道，要时刻注意飞行的高度速度和俯仰角，我经常出现好不容易对好跑道，才发现飞机速度已经掉到了30甚至更低，结果直接失速坠落了。
3. 如果连续转弯，会导致飞机的左右（标注的X）侧前后（标注的Y）横滚角过大，不要忘了按住C来及时纠正飞机姿态，特别是降落时要尽量保持飞机水平。
4. 如果不小心飞过了跑道，建议直接刷新重来吧，我写的这个飞行模拟器的转弯不是很灵活，转弯半径超大，掉头回来往往更难找到跑道降落，当然你想挑战也不是不可以。
5. 起飞后初期转弯时不建议频繁拖动体素视图，建议先对好一个方向后再对好另一个，而后期则不要一味地在某个方向对得过度精准，必须两边兼顾，特别是快要降落的时候，毕竟只要是落在跑到上，降落后滑行时还有继续调整的空间。

最后我想说，虽然操作这个四维客机是有点难，但对于四维人来说却不是那么恐怖，原因有两点。第一点是，这是我一个完全没有飞行器设计经验的人手撮的这个飞行模拟器，各物理模型参数都不是很合理，操作本来确实有些笨重。我在不断试飞中慢慢调整参数改了一周多时间才让飞机变成现在这样子只能算能开的程度。举个例子：机体在物理引擎中是个刚体模型，为了仿真起落架触地的弹力，轮子是靠硬弹簧模型栓在机体刚体上的，升空后机体通过弹簧吊着轮子飞行。若轮子的位置不合适就会让飞机的重心靠前或靠后，导致机头下沉或上扬，此外还有操纵面的气动中心位置以及各部件各方向的升力阻力等等一大堆要调节的参数，所以不是我不想改好，而是确实力不从心了。
说四维飞机实际不难的第二点则是四维人的眼睛本来看到的就是体素画面，他们对跑道根本不需要像我们用鼠标拖来拖去这么折腾，所以跟三维飞机一样，四维飞机在大多数时候还是很安全很平稳的受人青睐的远程交通工具，当然四维战斗机和特技飞行员也确实是值得敬佩的高难度职业。<a name="nanto"></a>

## 上篇文章思考题答案

上篇文章[《四维世界（九）：飞行器设计》](/archives/aircraft4d/)中展示了四维飞机的俯视图与正视图，但最后却没有画出四视图中的另外两个侧视图，这里将揭晓答案。<img alt="四维客机四视图，为方便辨认，将尾翼水平安定面标绿、垂直安定面标红" src="/img/tsxfsm026.jpg" style="width:100%;max-width:600px">
可以看到侧视图的样子看起来是最像三维飞机的，但是还是有些区别，我列举一些最明显的地方：一是尾翼结构和数量不同，二是有个视图两边的机翼长短都不一样（它们长度刚好差一半，想想为什么），三是发动机那里是实心的，因为发动机口是朝前开的，从侧面当然看不进去。

最后再放一个线框动画版的，可以看出四视图的三视图在对应方向上是一样的：
<img alt="四维客机四视图旋转动画，线框显示" src="/img/tsxfsm002.gif" style="width:100%;max-width:500px">
