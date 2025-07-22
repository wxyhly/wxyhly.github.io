---
title: Minecraft4D 教程
tags:
  - 四维
  - Minecraft
  - 4dViewer
date: 2020-03-14 11:23:05
excerpt: Minecraft4D是一个真正的四维空间中的（超立方体）方块沙盒游戏。（如果把时间也算上，就是五维时空！）现在游戏只支持创造模式下的单人游戏。Minecraft4D采用Javascript与Webgl编写，所以只需点开下面的链接就可以玩了。（最好用Google Chrome浏览器，不保证其他浏览器的兼容性，需要使用电脑键盘操作）
index_img: /img/minecraft02.jpg
---

（这篇文章只是一个教程，所以没放进四维世界系列）
Minecraft4D是一个真正的四维空间中的（超立方体）方块沙盒游戏。（如果把时间也算上，就是五维时空！）现在游戏只支持创造模式下的单人游戏。Minecraft4D采用Javascript与Webgl编写，所以只需点开下面的链接就可以玩了。（最好用Google Chrome浏览器，不保证其他浏览器的兼容性，需要使用电脑键盘操作）
### [Minecraft4D](/4dViewer/minecraft4d/) 

进入后等待贴图与地形都加载好后就可以看到视野了。你会发现画面分成了几乎一样的左右两个，它们是左右眼的成像用来产生**双眼立体视觉**，我不会做VR，所以就只有要求你要会做对对眼（斗鸡眼）来看到立体视野画面。如果做不到的话就只有通过按方向键旋转视野以得到立体感了。[这篇文章](/archives/eye3d/)里有详细介绍怎么看这种三维的画面。角落处三个小视图分别是立体视野的截面，单独抽出来以便我们清楚观察。
<!--more-->

<a href="javascript:void(0)" target="_self" onclick="$('#3dview').toggle()">问：什么是双眼立体视觉？怎样观看？(点击展开/收起)</a>

<span id="3dview" style="display:none">人的两只眼睛位置略有不同，视觉差通过大脑运算可以得到物体离我们的远近来产生立体感。如果不会做斗鸡眼那么请拿出你的手指放在屏幕中央，用你的目光死盯住指尖，然后你的手逐渐像你眼睛方向上靠拢。这个过程中左右视线一定要保持水平，用你的余光看会发现后面屏幕上的内容开始错位并有点模糊，当屏幕上两幅画面刚好重叠时你会惊奇地发现这副重叠的画面浮起来了！这个浮起来的位置大概和你现在指尖的位置相同。这时你就可以看到立体图像了。</span>

四维人可以直接看到实心的三维图像，所以这里将实心立方体视野做成透明的以观察内部。如果你还是不太清楚，请参看下列系列文章：
- [四维世界（四）：二维生物视觉](/archives/eye2d/)
- [四维世界（五）：体验四维人的视觉与方向感](/archives/eye3d/)

## 方向操作

下面我们来学习一下四维空间中的方向。下图标出了各个方向的名称，你可以试着按方向键`W` `S` `A` `D` `Q` `E`来做移动，注意前后方并没在图上标出，前后方垂直于3D视野，无法画出。可能你会对在侧前侧后方向上移动感到很不习惯，因为我们三维的大脑还没建立起直觉上处理第四个维度的能力，一会儿就习惯了。
![注意前后方向垂直于3D视野立方体无法标出](/img/minecraft01.jpg)

由于透明的立方体视野颜色重叠非常多，有时难以看清，故如下图所示抽出一些截面来上色：
（$x$轴:左右方向；$y$轴:上下方向；$z$轴:侧前侧后方向；$w$轴:前后方向；）
![](/img/eye3d005.jpg)
截面上的立体视觉提供$w$轴远近方向（垂直与之前的3D视野）作为体验四维生物立体视觉的折中方法。
点击画面后鼠标会被隐藏，此时移动鼠标视图将会旋转；按`Esc`键取消隐藏，这跟原版Minecraft是类似的。鼠标的左右移动对应的是玩家的头的左右旋转；注意与原版Minecraft不同的是，鼠标上下移动对应头的侧前侧后旋转，所以无论怎样移动鼠标玩家都永远是平视前方的。如果要抬头/低头，请滚动鼠标滚轮或按键盘`I` `K`键。
## 世界操作
世界有两种类型：正常与超平坦。默认世界类型为正常模式。每次进入页面都将随机分配一个世界种子。要想加载指定种子的世界请在页面网址后加上  ?种子号 的方式进入页面。注意种子号必须为正整数。可以使用/seed命令查看当前世界的种子。
页面网址后加  `?flat`  将进入超平坦模式。此模式下不会生成任何额外的结构。
下面给出一些种子的链接：
- 超平坦<a href="/4dViewer/minecraft4d/?flat" target="minecraft4d_flat">?flat</a>
- x=-510 z=-230 w=-440处有金字塔 石滩 河流 村庄（请自行tp过去）<a href="/4dViewer/minecraft4d/?873556" target="minecraft4d_873556">?873556</a>
- x=34 z=72 w=64处：河边的村庄（请自行tp过去）<a href="/4dViewer/minecraft4d/?962259" target="minecraft4d_962259">?962259</a>
- x=160 z=-61 w=284处：村庄中的天文台（请自行tp过去）<a href="/4dViewer/minecraft4d/?661280" target="minecraft4d_661280">?661280</a>

当你对世界操作后若想保存存档，请按`/`键打开命令栏，输入`/save`命令保存到本地。（格式为mc4a文件）
同样，要想加载存档，首先随便进入一个世界（不用管种子与世界类型），输入`/open`命令打开本地的mc4a存档文件即可。
Minecraft4D 默认时间会流动，如果晚上天黑看不清（暂时技术上还不支持灯光照明）可以使用`/skipnight`或`/skip`加速跳过夜晚。更多命令见[命令列表](#sudo)。

## 方块操作
与原版Minecraft一样，Miencraft4D中使用鼠标右键放置、左键破坏方块、中键选择方块。但要注意的是现在位于视野中心处的十字准星处在三维的空间里，要在空间中与要选择的方块重合才能选到正确的方块。<!--[这里]有如何选取指定方块的示例。-->按`N`与`M`键可以切换手中的方块。所有的方块列表见[这里](#touhh)。由于四维比三维空间要广大得多，所以徒手修一座建筑比同样尺寸的三维建筑要用更多的方块，工程量巨大，于是Minecraft4D内置了类似原版Minecraft的Worldedit插件的功能。使用/w命令在正常模式与Worldedit选区选择模式之间切换。要使用Worldedit的功能需要先创建选区。目前只支持超长方体的选区。使用左右键分别选择两个方块，将创建以这两个方块连线为体对角线的超长方体选区。您也可以使用命令`/pos1` `/pos2`来精确指定两个对角线的坐标。命令`/sel`可以查看选区的大小信息。`/set <方块>`可以用指定方块填充选区（[方块名称列表见这里](#touhh)），更多命令详见[这里](#sudo)。

## 快捷键列表
### 与其他4DViewer程序通用设置
#### 渲染显示相关

|快捷键|命令|
|-----|-----|
|`=`   |增加3D视野层叠数|
|`-`   |减少3D视野层叠数|
|`]`   |增加3D视野像素不透明度|
|`[`   |减少3D视野像素不透明度|
|`;`   |减小截面视图尺寸|
|`'`   |增加截面视图尺寸|
|`,`   |背景变暗|
|`.`   |背景变亮|
|`9`   |减小摄像机视角(FOV)|
|`0`   |提高摄像机视角(FOV)|
|`C`   |线框模式|
|`Alt+[`   |线框模式|
|`Alt+,`   |降低画面分辨率|
|`Alt+.`   |提高画面分辨率|
|`Alt+1`   |默认画面配置|
|`Alt+2`   |3D视野优化配置（隐藏截面、增加层数降、低分辨率）|
|`Alt+3`   |截面优化配置（取消3D视野叠加、放大截面）|
|方向键   |调整3D视野显示视角|

#### 人物/相机控制

|快捷键|命令|
|-----|-----|
|`W`   |前进|
|`S`   |后退|
|`A`   |向左平移|
|`D`   |向右平移|
|`Q`   |向侧后平移|
|`E`   |向侧前平移|
|`Shift`   |下降（开启飞行模式后）|
|`空格`   |跳跃/上升|
|`I`   |抬头|
|`K`   |低头|
|`J`   |往左看|
|`L`   |往右看|
|`U`   |往侧后看|
|`O`   |往侧前看|
|`Z`   |左右-侧前侧后旋转视图|
|`X`   |左右-侧前侧后旋转视图(相反方向)|

### Minecraft4D 快捷键

|快捷键|命令|
|-----|-----|
|`M`   |切换上一个方块|
|`N`   |切换下一个方块|
|`/`   |打开命令栏|
|`P`   |暂停/继续游戏|
<a name="sudo"></a>

## 命令列表
|命令|格式|描述|
|----|----|---|
|/tp|tp &lt;x&gt; &lt;y&gt; &lt;z&gt; &lt;w&gt;|将玩家传送至指定坐标（坐标前加~代表相对玩家位置）|
|/seed|seed|显示当前世界的地图种子|
|/fly|fly|切换飞行模式|
|/speed|speed &lt;speed&gt;|设置玩家移动速度|
|/dayspeed|dayspeed &lt;speed&gt;|设置昼夜循环速度|
|/skipnight 或 /skip|skipnight \| skip|快速跳过夜晚（只能在晚上使用此命令）|
|/save|save [clipboard \| clip \| sel \| selection]|不带其余参数即保存世界至本地，带参数（如save clipboard）将保存剪贴板或当前选取中的内容为schematic4d文件|
|/open|open|打开保存的本地世界|
|/load|load [-c \| clip \| clipboard]|加载本地schematic4d文件。默认为直接以玩家当前位置加载。若不想马上加载进世界，可使用-clipboard选项加载进剪贴板中|
|/loadmacro 或 /macro|loadmacro \| \macro [prev]|加载本地的[宏命令](#macro)文件，使用macro prev 上执行次加载的宏命令|
|/regen|regen &lt;me \|all&gt;|regen me: 重新按当前种子生成玩家所在区块；regen all：按当前种子重置整个世界|
|/chunks|chunks|显示已加载区块数与已修改区块数（已修改区块将不会被卸载）|
|/wand 或 /w|wand \| w|切换至WorldEdit选区工具模式（使用左右键选取超长方体对角点建立选区）|
|/pos1|pos1 &lt;x&gt; &lt;y&gt; &lt;z&gt; &lt;w&gt;|设置第一个WorldEdit超长方体选区对角点（坐标前加~代表相对玩家位置）|
|/pos2|pos2 &lt;x&gt; &lt;y&gt; &lt;z&gt; &lt;w&gt;|设置第二个WorldEdit超长方体选区对角点（坐标前加~代表相对玩家位置）|
|/sel|sel|查看当前选区信息|
|/set|set &lt;id&gt;|将当前选区以id方块全部填充|
|/hset|hset &lt;id&gt;|将当前选区外围以id方块全部填充|
|/wall|wall &lt;id&gt;|将当前选区外围（不含地板与天花板）以id方块全部填充|
|/hwall|hwall &lt;id&gt;|将当前选区的竖直二维棱以id方块全部填充|
|/copy|copy|复制当前选区到剪贴板，类似Minecraft中的WorldEdit，您的相对位置将会被保存|
|/paste|paste|将剪贴板内容粘贴至世界，其粘贴位置取决于您所在的位置|
|/flip|flip [dir]|将当前剪贴板内容朝给定方向dir(使用方向x y z w)翻转，若不指定则为玩家面朝的方向|
|/stack|stack &lt;num&gt; [dir]|将当前选区内容向指定方向dir(例如x+ z- f(面朝) u(向上) d(向下))堆叠重复num次，若不指定则为玩家面朝的方向|
|/move|move &lt;num&gt; [dir]|将当前选区内容向指定方向dir(例如x+ z- f(面朝) u(向上) d(向下))移动num格，若不指定则为玩家面朝的方向|
|/shift|shift &lt;num&gt; [dir]|仅将当前选区（不包含内容）向指定方向dir(例如x+ z- f(面朝) u(向上) d(向下))移动num格，若不指定则为玩家面朝的方向|
|/expand|expand &lt;num&gt; [dir] 或 expand &lt;num&gt; &lt;num&gt; [dir]|将当前选区沿指定方向dir(例如x+ z- f(面朝) u(向上) d(向下))扩大num格，如果指定了两个num则同时向相反的两个方向分别扩大|
|/glome|glome &lt;id&gt; &lt;radius&gt; [&lt;x&gt; &lt;y&gt; &lt;z&gt; &lt;w&gt;]|生成一个材质为id、半径为radius的超球。如果省略坐标，则默认以玩家为球心|
|/hglome|hglome &lt;id&gt; &lt;radius&gt; [&lt;x&gt; &lt;y&gt; &lt;z&gt; &lt;w&gt;]|生成一个材质为id、半径为radius的空心超球。如果省略坐标，则默认以玩家为球心|
|/spherinder|spherinder &lt;id&gt; &lt;radius&gt; &lt;length&gt; [&lt;direction&gt; [&lt;x&gt; &lt;y&gt; &lt;z&gt; &lt;w&gt;]]|生成一个材质为id、半径为radius、高为length的球柱。direction指定高的方向。如果省略坐标，则默认以玩家为球心|
|/hspherinder|hspherinder &lt;id&gt; &lt;radius&gt; &lt;length&gt; [&lt;direction&gt; [&lt;x&gt; &lt;y&gt; &lt;z&gt; &lt;w&gt;]]|生成一个材质为id、半径为radius、高为length的空心球柱。direction指定高的方向。如果省略坐标，则默认以玩家为球心|
|/duocylinder|duocylinder &lt;id&gt; <radius1> <radius2> [&lt;direction&gt; [&lt;x&gt; &lt;y&gt; &lt;z&gt; &lt;w&gt;]]|生成一个材质为id、半径为radius1/radius2的双圆柱。direction指定任意一个圆所在的平面（如xy、yz）。如果省略方向，则默认以玩家左右-上下方向创建圆。如果省略坐标，则默认以玩家为球心|
|/tiger|tiger &lt;id&gt; <radius1> <radius2> <radius3> [&lt;direction&gt; [&lt;x&gt; &lt;y&gt; &lt;z&gt; &lt;w&gt;]]|生成一个材质为id、半径为radius1/radius2/radius3的双圆环。direction指定任意一个圆所在的平面（如xy、yz）。如果省略方向，则默认以玩家左右-上下方向创建圆。如果省略坐标，则默认以玩家为球心|
<a name="macro"></a>

## 宏

由于四维世界场景中方块数量随尺寸成四次方速率增长，所以手动放置方块建筑十分困难。一般建议通过执行WorldEdit命令来建造。为了方便起见，可以将一系列命令放在一个文件中，通过`/macro`宏指令读取文件来一次按顺序执行多条指令。宏命令下支持通过`def <常量名> 值`来定义常量以增强可读性，也可以通过`fn <代码块名>:`的方式开始定义一段代码块，用`endfn`标志定义结束。这样在需要多次执行某段代码块的地方只需要写代码块名即可，宏处理器将自动将代码块名替换展开为对应代码块内容。

宏指令中可以使用几乎所有[命令列表](#sudo)中的命令，但以下涉及到读写文件的几条命令除外： \save \open \load \macro。
例子：生成一个有26个房子的小村落。
<iframe src="https://wxyhly.github.io/4dViewer/minecraft4d/macro.txt" style="background-color: rgb(255,255,255,0.7)"></iframe><a name="touhh"></a>

运行后效果：
![](/img/minecraft02.jpg)

## 方块列表
|数字ID|中文名|英文ID|
|----|----|---|
|0| 空气|air|
|1|石头|stone|
|2|草方块|grass|
|3|泥土|dirt|
|4|橡木|oak_log|
|5|树叶|leaves|
|6|砖块|brick|
|7|沙子|sand|
|8|水|water|
|9|平滑石头|smooth_stone|
|10|双层石台阶|stone_slabs|
|11|石砖|stone_brick|
|12|木版|planks|
|13|白色混凝土|white_concrete|
|14|红色混凝土|red_concrete|
|15|黄色混凝土|yellow_concrete|
|16|绿色混凝土|green_concrete|
|17|青色混凝土|cyan_concrete|
|18|蓝色混凝土|blue_concrete|
|19|紫色混凝土|purple_concrete|
|20|灰色混凝土|gray_concrete|
|21|黑色混凝土|black_concrete|
|22|仙人掌|catcus|
|23|苦力怕头|creeper_head|
|24|末影人头|enderman_head|
|25|玩家头|steve_head|
|30|玻璃|glass|

## 景观列表
（图片待补充）
- 树林
![](/img/minecraft06.jpg)
- 沙漠
![](/img/minecraft04.jpg)
- 沙漠金字塔
- 河流
![](/img/minecraft03.jpg)
- 村庄
- 沙漠村庄
![](/img/minecraft05.jpg)
- 天文台
- 沙漠水井
- 沼泽
- 路
![](/img/minecraft07.jpg)
<!--纯几何的方法可以分别从相邻两胞心往交面的面心做垂线，三个中心构成三角形，然后分别计算三边长，用余弦定理计算二胞角。计算边长时主要利用正八面体每个面是正三角形以及正24胞体的立方体中空结构（由正八面体的正方形中空结构拼成，不涉及代数法即可证）-->
## 工作原理
下面简单介绍一下Minecraft4D 的工作原理。跟Minecraft一样，通过区块来储存世界，4D世界生成算法也跟3D大同小异。显示时直接通过光线跟踪计算与场景的交点，但只实现了基本的方块间的环境光遮蔽以及太阳阴影。比较有意思的是贴图。4D的方块需要3D贴图，所以我参考Minecraft的2D贴图文件自己手动一层一层的画了一个3D贴图，一共8层，分辨率是$8\times 8 \times 8$。贴图文件格式我还是用的正常2D的png格式，每个立方体贴图分8片画出。
![游戏中部分3D贴图](/img/minecraft08.jpg)
