---
title: 码Tesserxel（二）：更多场景渲染设置
tags:
  - 四维
  - 图形学
  - Javascript
  - Tesserxel
  - Webgpu
categories: Tesserxel系列
index_img: /img/tsxdev102.png
excerpt: 本文继续介绍four模块，并将通过动态材质与灯光场景以及骰子控制示例，深入介绍渲染控制、旋转控制和高级材质等功能。
date: 2025-09-13 18:09:19
---

上篇文章我们初步介绍了用Tesserxel库的four模块快速构建绘制四维超立方体。这篇文章我们继续通过两个例子来更深入了解包括渲染控制、相机控制、高级材质等功能。
## 场景1
我打算在三维地面上放两个超立方体和一个超球，我们将用到`four`模块中的相机控制器、材质节点、各种类型的灯光，并通过向量运算函数为灯光添加动效。
### 建模
建模这方面没什么难度，就当是复习了。首先我们写好三维地面、超立方体和超球的几何数据：
```javascript
// 超立方体几何数据
const cubeGeometry = new FOUR.TesseractGeometry();
// 超球几何数据
const glomeGeometry = new FOUR.GlomeGeometry();
// 地面几何数据，边长为10.0的三维立方体地面
const floorGeometry = new FOUR.CubeGeometry(10.0);
```
指定Mesh时必须要同时指定材质。我们先创建一个简单的带高光的白色材质`material1`，然后通过几何数据建立Mesh，两个超立方体只是位置不同，可以共用几何数据：
```javascript
let material1 = new FOUR.PhongMaterial([1.0, 1.0, 1.0]);
let cubeMesh1 = new FOUR.Mesh(cubeGeometry, material1);
// cubeMesh1 放在偏左
cubeMesh1.position.x = -2;
cubeMesh1.position.y = 2;
let cubeMesh2 = new FOUR.Mesh(cubeGeometry, material1);
// cubeMesh2 放在偏右
cubeMesh2.position.x = 2;
cubeMesh2.position.y = 2;

let floorMesh = new FOUR.Mesh(floorGeometry, material1);
// 都是一个材质没意思。我们给超球赋予一个新的蓝色材质，并将光泽度设高些
let glomeMesh = new FOUR.Mesh(glomeGeometry, new FOUR.PhongMaterial(
    [0.2, 0.2, 1], 50
));
// 为了体现四维的空间感，我故意在y轴z轴上都跟那些超立方体都错开
glomeMesh.position.set(0,1,1,1);
```
然后我们把物体们加入场景，设置一下相机位置，就可以运行app了。
```javascript
// 加入场景中
app.scene.add(glomeMesh);
app.scene.add(cubeMesh1);
app.scene.add(cubeMesh2);
app.scene.add(floorMesh);
// 设置相机位置
app.camera.position.w = 5.0;
app.camera.position.y = 2.0;
// 让场景跑起来
app.run();
```
### 灯光

如果你现在按照上面的步骤执行代码会发现画面一片黑。这是因为我们还没添加灯光。我们在`app.run`执行之前继续添加一些代码。这次我们除了加入环境光外，再添加一个聚光灯`SpotLight`：
```javascript
// 环境光
app.scene.add(new FOUR.AmbientLight(0.1));
// spotLight是聚光灯，三个参数分别是RGB颜色强度、锥角与边缘硬度
let spotLight = new FOUR.SpotLight([800, 800, 800], 40, 0.2);
app.scene.add(spotLight);
// 将光源y坐标升高
spotLight.position.y = 10;
```
我们可通过控制聚光灯的位置(position)、朝向(rotation)。默认聚光灯是朝向y轴负方向（朝下）。
### 相机控制
好了，总算能看见我们的场景了。可是目前相机角度是固定的，无法移动。下面我们来添加相机控制器，写一句话就能搞定：
```javascript
app.controllerRegistry.add(new tesserxel.util.ctrl.KeepUpController(app.camera));
```
大概解释一下：
- app.controllerRegistry里面记录了所有的控制器，包括Tesserxel默认自带的跟体素的交互控制`retinaController`。
- `KeepUpController`即保持竖直模式的控制器。具体交互方式见[《玩Tesserxel（一）：视图控制介绍》](/archives/tesserxel-intro/#ctrl)。它的构造函数需传入被控制的对象。我们要控制的是相机`app.camera`。在创建controllerRegistry时还可以在构造函数中传入一个config对象通过`preventDefault`指定是否阻止默认事件（如鼠标右键菜单、滚动页面、键盘触发浏览器默认操作等）、通过`enablePointerLock`是否开启鼠标隐藏锁定的功能。`four.App`会自动创建ControllerRegistry对象，因此我们在创建app时就传入`controllerConfig`来指定是否开启这些功能，默认均为关闭状态。
```javascript
const app = await tesserxel.four.App.create({ canvas, controllerConfig: { 
    preventDefault: true,
    enablePointerLock: true,
} });
```

控制相机移动的键位默认是按[《玩Tesserxel（一）：视图控制介绍》](/archives/tesserxel-intro/)中介绍的键位布置的。键位(使用`event.code`，详见这个[网站](https://www.toptal.com/developers/keycode))跟键盘移动速度、鼠标控制朝向的速度都是可以配置的，详情见下表。
| 配置参数          | 解释                                           | 默认值       |
|-------------------|----------------------------------------------|--------------|
| mouseSpeed        | 鼠标水平转向的速度系数                   | 0.01         |
| wheelSpeed        | 鼠标滚轮垂直转向的速度系数           | 0.0001       |
| keyMoveSpeed      | 键盘按键移动相机的速度系数                   | 0.001        |
| keyRotateSpeed    | 键盘按键旋转相机的速度系数                   | 0.001        |
| damp              | 相机运动/旋转的阻尼系数，用于平滑控制         | 0.05         |
| keyConfig.front   | 向前(w-)移动                                      | "KeyW"         |
| keyConfig.back    | 向后(w+)移动                                      | "KeyS"         |
| keyConfig.left    | 向左(x-)移动                                      | "KeyA"         |
| keyConfig.right   | 向右(x+)移动                                      | "KeyD"         |
| keyConfig.ana     | 向侧前(z-)方向移动                           | "KeyQ"         |
| keyConfig.kata    | 向侧后(z+)方向移动                          | "KeyE"         |
| keyConfig.up      | 向上(y+)移动                                      | "Space"        |
| keyConfig.down    | 向下(y-)移动                                      | "ShiftLeft"    |
| keyConfig.turnLeft| 向左转向                                      | "KeyJ"         |
| keyConfig.turnRight| 向右转向                                     | "KeyL"         |
| keyConfig.turnAna | 朝侧前(ana)转向                               | "KeyU"         |
| keyConfig.turnKata| 朝侧后(kata)转向                              | "KeyO"         |
| keyConfig.turnUp  | 向上转向                                      | "KeyI"         |
| keyConfig.turnDown| 向下转向                                      | "KeyK"         |
| keyConfig.spinCW  | 自转（从相机上方看顺时针）                                | "KeyZ"         |
| keyConfig.spinCCW | 自转（从相机上方看逆时针）                                | "KeyX"         |
| keyConfig.disable | 设置后按住此键会禁用所有相机控制                                  | "AltLeft"      |
| keyConfig.enable  | 设置后按住此键才启用相机控制（默认未设置）                    | ""      |

**这里需要注意**：`keyConfig.disable`默认设置为`"AltLeft"`，是因为按住Alt键时是操作3D体素渲染的视角，于是需要在此禁用操作4D场景的相机以免冲突。
**其次还需注意**：`KeepUpController` 为了保持相机竖直，会将相机的水平和竖直旋转分开保存。一旦它接管相机，相机的朝向与位置都会由其内部管理。除了初始化时设置有效，在之后（如帧循环中）直接修改相机朝向是无效的，因为每次循环都会被 `KeepUpController` 的更新逻辑覆盖。如果确实需要在外部修改相机朝向，**必须在设置之后调用一次 `updateObj` 来强制同步到控制器内部**。Tesserxel 没有设计成自动持续同步，原因有二：一是性能考虑，避免每帧重复转换数据；二是数值稳定性，常规的旋转表示与控制器内部的分离表示在频繁转换时，容易积累一些奇怪的误差。

另外一种常见的控制器是类似Jenn3D软件的`TrackBallController`。虽然这个场景中它会把地面旋转到任意斜着的位置，不适用，我们在第二个场景中才使用它，这里还是先讲一下用法：它有控制物体和控制相机两种模式，由其构造函数第二个参数控制。控制物体时，单纯就是对物体进行各种旋转；控制相机时除了旋转相机，还能推拉摄像机，并设置相机的旋转中心点。需要注意的是**相机的初始位置不要跟旋转中心点重合**，这会带来单位化零向量的错误，把相机的位置锁死。

```javascript
// 构造函数第二个参数是true代表控制相机模式，false则为控制物体模式
app.controllerRegistry.add(new tesserxel.util.ctrl.TrackBallController(app.camera, true));
```

| 配置参数        | 解释               |作用平面                | 默认值     |
|-----------------|-------------------|---------------|------------|
| center   | 旋转中心点坐标|/ | new Vec4() (原点)  |
| mouseButton3D   | 三维旋转操作|xz、yz | 0 (左键)   |
| mouseButtonRoll | 滚转操作|xy、zw             | 1 (中键)   |
| mouseButton4D   | 四维旋转操作 |xw、yw        | 2 (右键)   |
### 渲染控制设置
体素渲染器的大部分设置都在app.renderer.core对象中，core对象是独立于`four`模块的核心底层体素渲染器对象。比如设置体素的不透明度需要这样写：
```javascript
app.renderer.core.setDisplayConfig({ opacity: 50 });
```
但由于一般的场景都默认添加有体素渲染控制器`RetinaController`接管，因此我们只需直接调用`RetinaController`上的方法即可。刚才的不透明度建议这样写：
```javascript
app.retinaController.setOpacity(50);
```
虽然Tesserxel的示例库中很多代码都是在core对象上写的，但这里不推荐直接修改core中的渲染配置注意，因为在控制器初始化完成后将接管渲染器的属性管理权，`RetinaController`可能会在帧循环中更新参数覆盖掉这些修改。

渲染控制器的其他方法：

| 调用方式 | 解释 |
|------------------------------------|---------------------|
| toggleStereo(stereo?: boolean)     | 开关立体渲染模式（双眼视差），参数可选，省略时为切换     |
| toggleCrosshair()                  | 开关瞄准十字准星显示                        |
| setSectionEyeOffset(offset: number)| 设置截面视图的双眼间距（立体效果强度）          |
| setRetinaEyeOffset(offset: number) | 设置渲染三维体素的双眼间距   |
| setLayers(layers: number)          | 设置体素渲染层数（越多画面越精细但更耗性能）|
| setOpacity(opacity: number)        | 设置体素透明度系数（可超过1） |
| setCrosshairSize(size: number)     | 设置瞄准十字线的大小  |
| setRetinaResolution(value: number) | 设置体素渲染单层的分辨率，最好是2的幂次（越高越清晰但更耗性能） |
| setRetinaSize(size: number)        | 设置体素渲染的显示区域大小                                 |
| setRetinaFov(fov: number)          | 设置三维体素渲染的视场角（FOV）                                |
| setSize(size: GPUExtent3DStrict)   | 设置最终二维画布的分辨率                               |

背景颜色是没被控制器接管的，我们在这里设置：
```javascript
// scene上设置的四维场景的背景，即三维体素画布的背景色，可指定体素的透明度
app.scene.setBackgroundColor([0.6, 0.8, 1, 0.01]);
// renderer上设置的是二维画布的背景色，指定透明度没有实际效果
app.renderer.setBackgroundColor([0,0,0]);
```
### 控制不透明度
我们可以为体素画布的背景色指定不透明度。其实物体的所有材质的漫反射颜色都支持指定透明度，用于决定渲染体素时体素的透明度。由于GPU图像格式的限制，透明度必须介于0至1之间。如果想要突出场景中某些物体，减淡背景色，我们可压低场景其它部分的不透明度（如到0.01\~0.1），把突出物体的透明度设为1，然后通过`retinaController.setOpacity`来整体调高不透明度，以看清要突出显示的物体。`setOpacity`的参数可以视情况给到5\~100。

这里想说的是，可能我们有时希望要的是真正的四维不透明度——渲染四维半透明物体的需求。目前Tesserxel的光栅化引擎还暂时不支持该功能（因为其alpha通道已被用于混合体素切片层，而不是混合截面渲染的前后物体，已无其它通道来做这个事了），除非通过光线跟踪等方法来合成颜色。
### 材质贴图节点
目前我们的物体颜色都是单一的。如何像三维图形那样做贴图呢？三维图形表面需要2D贴图，四维图形表面则需要3D贴图。3D贴图一是制作的软件少，二是3D体素图像文件巨大，不便于网络传输。因此一般四维物体的3D贴图都使用程序化生成。在`four`模块中，我们通过类似Blender软件中的材质节点组合来控制材质贴图。比如，我们之前介绍过，`PhongMaterial`有三个参数，其中第一个参数是颜色，后两个是可选的光泽度与高光颜色。这些参数除了填入直接的数值外，都还支持传入相应类型的节点对象。我们先看个简单的例子：给地板铺上3D棋盘格贴图。首先回忆一下原来的纯色材质写法为：
```javascript
// 纯白色Phong材质，省略了后两个可选参数
let material1 = new FOUR.PhongMaterial([1.0, 1.0, 1.0]);
```
我们将白色`[1.0, 1.0, 1.0]`换成棋盘格贴图节点： 
```javascript
new FOUR.CheckerTexture(
    // 前两个参数为黑色与白色，可分配不同体素透明度
    [0, 0, 0, 0.5], [1, 1, 1, 1],
    // 这个参数控制贴图坐标
    new FOUR.UVWVec4Input,
)
```
棋盘格除了颜色两个参数外，还有个贴图坐标参数，一般有这两个选项：
- `UVWVec4Input`：使用模型自带的默认贴图坐标。我们将在后面讲建模的文章中说如何编辑贴图坐标。模块`four`中的所有内置图形都有默认的贴图坐标。默认的贴图坐标都是三维的，其w分量始终为0。保留第四个坐标是因为可能会用到程序化的4D贴图。
- `WorldCoordVec4Input`：使用场景的世界坐标作为贴图坐标，视图形具体位置，四个坐标都可能会有值。
现在场景中的地面是这样的，我们发现其默认的贴图坐标只有两个格子，太大了。也可以尝试改成世界坐标，这样得到的格子又太多太小了。如何缩放贴图呢？这里我们引入 `Vec4TransformNode`，它是个坐标变换节点，接受一个坐标输入和一个`Obj4`坐标变换对象。`Obj4`是一个抽象的坐标变换类，由位置、旋转、缩放三部分构成。其实场景中所有有`position`和`rotation`，`scale`属性的物体其实都继承于这个类。我们只是想缩放格子，不需要平移与旋转，我们可以填入`null`占位，或者是填入`new Vec4()`、`new Rotor()`作为零向量和无旋转的默认朝向：
```javascript
let floorTexture = new FOUR.CheckerTexture(
    [0, 0, 0], [1, 1, 1],
    new FOUR.Vec4TransformNode(
        // 输入默认的立方体的贴图坐标
        new FOUR.UVWVec4Input,
        // 坐标变换写法一：
        new tesserxel.math.Obj4(
            null,
            null,
            new tesserxel.math.Vec4(5, 5, 5, 5)
        )
        // 坐标变换写法二：（与上面等价）
        // new tesserxel.math.Obj4(
        //     new tesserxel.math.Vec4(),
        //     new tesserxel.math.Rotor(),
        //     new tesserxel.math.Vec4(5, 5, 5, 5)
        // )
    )
);
let floorMaterial = new FOUR.PhongMaterial(floorTexture);
```

### 变色材质
物体的材质会在第一次渲染时被编译为固定的在GPU上运行的WGSL着色器代码，对于变色材质，如果每一帧我们都重新给对象赋予新材质，每帧都编译材质代码会直接卡爆。正确的做法是引入更高级的带可向GPU写入变量的材质，比如我们给第二个超立方体单独弄个带颜色变量的材质：
```javascript
// 创建一个材质颜色变量
let uniformColor = new FOUR.ColorUniformValue();
// 材质2为有高光的绑定了刚才的颜色变量的可变颜色
let material2 = new FOUR.PhongMaterial(uniformColor);
// 把第二个超立方体的材质改一下
let cubeMesh2 = new FOUR.Mesh(cubeGeometry, material2);
// ....其它代码不变
```
我们将在后面制作动画中给`uniformColor`变量赋值。
### 场景动起来
`app.run`函数的参数可以传入一个回调函数，它将在每帧渲染时执行。我们在这里实现动画效果：
```javascript
// 生成动画的随机种子
let t = Math.random() * 12345678;
app.run(() => {
    // 给刚才material2材质中的GPU颜色变量动态赋值，实现右边的超立方体的变色效果
    // 我们通过简单的不同频率、相位三角函数实现RGB色彩的无规律波动
    uniformColor.write([
        Math.sin(t) * 0.3 + 0.7,
        Math.sin(t * 0.91) * 0.5 + 0.5,
        Math.sin(t * 1.414) * 0.5 + 0.5
    ]);
    // 下一帧时间递增
    t += 0.01;
});
```
下面我们再添加一些动态灯光。需注意我们在你好超立方体的例子中给超立方体设置了强制更新坐标以实现动画效果，对于灯光也如此。这些动画效果都是使用三角函数实现的。
```javascript
let dirLight = new FOUR.DirectionalLight([0.1, 0.0, 0.0])
app.scene.add(dirLight);
let pointLight = new FOUR.PointLight([5.4, 2.5, 1.7]);
app.scene.add(pointLight);
let pointLight2 = new FOUR.PointLight([1.4, 12.5, 5.7]);
app.scene.add(pointLight2);
let pointLight3 = new FOUR.PointLight([1.4, 1.5, 15.7]);
app.scene.add(pointLight3);
// 下面的物体都要设置动画效果
// 告诉Tesserxel要每帧更新它们的坐标
dirLight.alwaysUpdateCoord = true;
pointLight.alwaysUpdateCoord = true;
pointLight2.alwaysUpdateCoord = true;
pointLight3.alwaysUpdateCoord = true;
spotLight.alwaysUpdateCoord = true;
// 生成动画的随机种子
let t = Math.random() * 12345678;
app.run(() => {
    // 将带参数t的向量单位化后，复制给聚光灯的方向向量
    spotLight.direction.copy(
        new tesserxel.math.Vec4(
            Math.sin(t * 3), Math.cos(t * 3), Math.sin(t * 1.732), Math.cos(t * 1.732)
        ).adds(tesserxel.math.Vec4.y.mulf(6)).norms()
    );
    // 通过set函数把位置坐标设为三角函数后，再使用mulfs函数修改其值，乘上振幅系数3。
    pointLight.position.set(Math.sin(t * 3), 0.5, Math.cos(t * 3), 0).mulfs(3);
    pointLight2.position.set(0, 0.5, Math.sin(t * 3), Math.cos(t * 3)).mulfs(3);
    pointLight3.position.set(Math.cos(t * 3), 0.5, 0, Math.sin(t * 3)).mulfs(3);
    // 也可以先赋值，再通过norms函数将其修改为单位向量。
    dirLight.direction.set(
        Math.sin(t * 20), 0.2, Math.cos(t * 20) * 0.2, Math.cos(t * 20)
    ).norms();
    // ....刚才的动态颜色材质代码
});
```
这个完整的示例可以在[Tesserxel Playground](/tesserxel/playground/)示例场景中的“更多场景渲染设置 > 材质与灯光”中找到。

## 向量运算简介
场景1的动画里用了很多向量的运算函数，我将把常见的`Vec4`向量运算列出来（支持的运算远不止列出的这些，后续会给出相关文档）。下面假设`v1`、`v2`、`v3`都是`Vec4`类型的变量，`k`为`number`类型的变量。

|调用方法|解释|分类
|---|---|---|
|v1.add(v2)|得到新向量v1 + v2|新向量|
|v1.adds(v2)|v1 += v2|修改值|
|v1.addset(v2)|v1 = v2 + v3|修改值|
|v1.sub(v2)|得到新向量v1 - v2|新向量|
|v1.subs(v2)|v1 -= v2|修改值|
|v1.subset(v2)|v1 = v2 - v3|修改值|
|v1.neg()|得到新向量-v1|新向量|
|v1.negs()|修改v1的所有分量取反|修改值|
|v1.dot(v2)|v1与v2的内积，`number`类型|/|
|v1.norm()|v1向量的长度，`number`类型|/|
|v1.normSqr()|v1向量长度的平方，`number`类型|/|
|v1.norms()|修改v1，将其单位化|修改值|
|v1.mulf(k)|得到新向量v1 * k，该乘法为向量数乘|新向量|
|v1.mulfs(k)|v1 *= k，该乘法为向量数乘|修改值|
|v1.divf(k)|得到新向量v1 / k，该除法为向量数乘1/k|新向量|
|v1.divfs(k)|v1 /= k，该除法为向量数乘1/k|修改值|
|v1.clone()|生成跟v1值相同的新向量|新向量|
|v1.copy(v2)|把v1的值修改为跟v2一样|修改值|

这些函数可分为两大类，一是没有“副作用”完全生成新向量的，二是设置修改其值不创建新向量的，一般都以`s`（可理解为“assign”或“self”）或`set`结尾，区别这两者主要是为了性能考虑，比如在物理引擎中会做大量向量运算，频繁创建新对象会给内存分配和垃圾回收带来压力。**其实很多场景的性能瓶颈根本不在向量运算这里，清楚两者的区别后，在初学时随便选哪种都是可以的。**但如果每帧要对很多物体做大量的向量运算（如下篇文章将介绍的物理仿“真”模拟）就需要考虑，下面是一个求4个向量和的例子：
```javascript
const Vec4 = tesserxel.math.Vec4; // 引入简写

let v1 = new Vec4(1,2,3,4); // 这里生成了一个向量对象
let v2 = new Vec4(-1,2,-3,4); // 又生成了一个向量对象
let v3 = new Vec4(4,3,2,1); // 又生成了一个向量对象
let v4 = new Vec4(5,5,5,5); // 又生成了一个向量对象
// 方式一：（新生成了3个对象）
{
    // 每次执行add函数就多生成了一个向量对象，因此又生成了三个
    let sum1 = v1.add(v2).add(v3).add(v4);
    console.log(sum1);
}
// 方式二：（新生成了1个对象）
{
    let sum2 = v1.clone(); // 通过克隆生成了一个跟v1值一样的向量对象
    sum2.adds(v2).adds(v3).adds(v4); // 仅修改了sum2的值，未生成任何新对象
    console.log(sum2);
}
// 方式三：（新生成了1个对象）
{
    let sum3 = new Vec4(); // 生成了一个向量对象
    sum3.addset(v1,v2).adds(v3).adds(v4); // 仅修改了sum3的值，未生成任何新对象
    console.log(sum2);
}
// 方式四：（新生成了0个对象，但修改了v1的值）
{
    // 未生成任何新对象，但改变了v1的值，这在某些情况下是不可接受的
    console.log(v1.adds(v2).adds(v3).adds(v4));
}
```
下一个例子是个可通过按键指定朝向的骰子。先介绍一下关于四维物体旋转的朝向的处理方式。
## 旋量运算简介
相机控制、物体朝向等都需要我们精确描述生成旋转。Tesserxel中，四维物体的朝向`rotation`并不是矩阵，而是基于等角分解的两个四元数组成的**旋量**`Rotor`，它可以完全描述物体的旋转朝向，具体技术细节见[《四维计算机图形学：旋转篇》](/archives/so4/)。下面列举基本的用法。
旋转可以取逆，两个旋转还可以复合成新的旋转。这些对应到旋量上为：
```javascript
const Rotor = tesserxel.math.Rotor; // 引入简写
let r1 = new Rotor().randset(); // 随机生成一个旋转
let r2 = Rotor.rand(); // 也可由Rotor类的静态函数随机生成

let r3 = r1.conj(); // 旋转的逆对应旋量的共轭操作，生成新旋量
r1.conjs(); // 更改旋量r1的值，变成其逆

// r1 * r2 代表施加旋转r2后再施加r1得到的复合旋转
let r1_r2 = r1.mul(r2);
// 旋转顺序影响结果，没有交换律，因此对应的muls版本必须指定是左乘(l)还是右乘(r)
// 在r1旋转后再执行一个旋转，对应左乘
r1.mulsl(r2); // r1 = r2 * r1;
// 在r1旋转前先插入一个旋转，对应右乘
r1.mulsr(r2); // r1 = r1 * r2;

r1.copy(r2); // 类似向量，修改r1的值为r2
r1.clone(); // 类似向量，创建新对象，值为r1
```
### 旋转的作用
我们通过`Vec4`类的rotate相关方法来得到旋转作用在向量上后的新向量。
```javascript
// 设v是Vec4对象、r是Rotor对象
let v2 = v.rotate(r); // 创建新向量，其值为将向量v执行旋转r
v.rotates(r); // 直接修改v的值，进行旋转r

// 由于逆旋转在坐标变换中很常见，Tesserxel还提供了一些方便的操作
v.rotateconj(r);  // 创建新向量，其值为旋转r的逆作用于向量v
v.rotatesconj(r);  // 直接修改v的值，进行r的逆对应的旋转

// 以上两者等价于下面两者，区别在于下面的conj函数将会各多生成一次Rotor对象
v.rotate(r.conj());
v.rotates(r.conj());
```
### 旋转的描述
旋量很抽象，几乎无法通过内部储存的两个四元数直接看出这是个什么旋转。对于相机，最常见的方式是通过lookAt方法设置朝向，即指定把某个方向通过旋转对齐某个目标方向。
```javascript
// 生成一个将x正向旋转到y轴正向的旋转，两个参数必须为单位向量
let r1 = Rotor.lookAt(Vec4.x,Vec4.y);
// 一般的方向一定要记得单位化，否则结果不正确
let r2 = Rotor.lookAt(new Vec4(1,2,3,4).norms(),new Vec4(5,4,3,2).norms());

// 也可以对Obj4对象直接使用lookAt函数
app.camera.position.set(1,2,3,4);
// 看向原点。相机的前方为w轴负方向，即常量Vec4.wNeg
app.camera.lookAt(Vec4.wNeg,new Vec4());
```

在四维空间，描述一般的旋转需要平面与角度。我们引入二维的向量（叫2-向量）`Bivec`，其方向来表示旋转平面，大小表示旋转角度。它跟普通的向量非常像，下面给出一些常见操作：
```javascript
const {Vec4, Bivec, Rotor} = tesserxel.math; // 可批量引入简写
let v1 = new Vec4(1,2,3,4);
let v2 = new Vec4(-1,2,-3,4);
// 通过向量之间的wedge(楔积；外积)运算生成平面，使用norms()函数将其单位化后，乘以弧度角度(30°)
// 方向为从v1向v2方向旋转30°
let bv = v1.wedge(v2).norms().mulfs(Math.PI/6);
// 跟Vec4一样，Bivec类也定义了坐标面常量，这些常量不能被mulfs等修改值的函数修改，只能用创建新对象的无副作用的函数如mulf
// 方向为从x正方向向w正方向旋转30°
let bv2 = Bivec.xw.mulf(Math.PI/6);
// wx方向与xw方向刚好旋转方向相反
let bv3 = Bivec.wx.mulf(Math.PI/6);

// 2-向量也可以跟向量那样被Rotor对象的旋转作用：
let bv4 = bv.rotate(r); // 创建新的2-向量，其值为将2-向量bv执行旋转r
bv.rotates(r); // 直接修改bv的值，进行旋转r

// 有了2-向量，我们通过`exp`函数来最终生成旋量
let r = bv2.exp();
// 也可以通过expset不创建新的旋量对象
r.expset(bv);

// 也可以通过lookAtvb函数设置将某个向量旋转到落在指定的平面内，向量与2-向量都要是单位化的
let r1 = Rotor.lookAtvb(new Vec4(1,2,3,4).norms(),Bivec.xy);
```
## 场景2
下面我们开始正式构建四维骰子场景。虽然可以灵活运用节点组合来实现很多材质，但`four`模块中其实没有太多的内置贴图，很多时候我们需要使用`WgslTexture`通过GPU着色器语言WGSL(WebGPU Shading Language)直接编写贴图。
### WGSL贴图示例
先举一个简单的例子，生成一个有球形斑点的贴图贴在场景1的地面上。
```javascript
// 把原来的棋盘格材质替换掉
let floorTexture = new FOUR.WgslTexture(
    `fn map(uvw:vec4f)->vec4f{
        if(length(fract(uvw)-vec4(0.5,0.5,0.5,0.0))<0.4){ return vec4f(1,0,0,1);}else{return vec4f(0,0,1,0.6);}
    }`,"map",
    // 跟棋盘格一样，进行坐标缩放
    new FOUR.Vec4TransformNode(
        new FOUR.UVWVec4Input,
        new tesserxel.math.Obj4(
            null,
            null,
            new tesserxel.math.Vec4(5, 5, 5, 5)
        )
    )
)
```
WgslTexture的构造函数第一个参数为WGSL代码的字符串，第二个参数为WGSL代码的入口函数名，第三个参数为贴图坐标。下面我们来给刚才的WGSL代码标上注释说明：它定义了一个输入（贴图坐标）为`vec4f`，输出（颜色）也为`vec4f`的函数。这个函数将会在每个体素上执行（即渲染管线的fragment阶段），根据坐标逐点执行上色。如果你不理解可编程渲染管线与着色器的相关概念，请了解后再继续往下看，或这你对编写贴图不感兴趣，则可直接空降至[旋转控制小节](#customctrl)。
```wgsl
// fn 为wgsl定义函数的关键字
// vec4f相当于Tesserxel中的Vec4
// 冒号后面是形参类型，->后面是函数返回类型
fn map(uvw:vec4f)->vec4f{
    // fract函数将取向量个分量的小数部分
    // 这样我们将四维空间中的每个整数格子都映射到了同一个格子
    // 我们比较跟格子中心点的距离（只是三维贴图，第四维坐标为0）来判断是否球中
    if(distance(fract(uvw.xyz),vec3f(0.5,0.5,0.5))<0.4){
        // 在球中上红色，给最高的体素不透明度
        return vec4f(1,0,0,1);
    }else{ // 注意：WGSL语言if else 后面的单行语句都要用大括号，省略是会报错的
        // 在球外上蓝色，不透明度降低一点
        return vec4f(0,0,1,0.6);
    }
}
```
WGSL语言不复杂。可以试试这个在线的类似shadertoy的网站[WebGPU Shader Toy](https://pongasoft.github.io/webgpu-shader-toy/)，此外Tesserxel的示例库中的开发者示例中也有类似的[Shadertoy体素编辑器](/tesserxel/examples/#shadertoy::voxel)，里面有些例子可以帮助你理解WGSL的语法。

### 插曲：吐槽代码高亮与hexo主题更新
这里我说一些离题的话。可能老读者发现我的网站主题有所变动。其实是因为我在写这系列文章时，发现markdown不支持WGSL语言的语法高亮。于是我在网上搜寻如何添加高亮，但配置始终不对。正好我的Blog hexo主题框架太老了，很多东西都不兼容了，于是我一气之下将主题框架换成了[Fluid](https://github.com/fluid-dev/hexo-theme-fluid)，我又重新配置了每篇文章的封面图与文章摘要，弄了大约一周。还好Fluid的配置比原来的主题简单多了，切换到prism直接就正常显示WGSL代码了。

### 四维骰子贴图
下面我们重新开一个新场景，通过做一个四维骰子来了解一下超立方体的默认贴图坐标与如何运用WGSL代码绘制贴图。（Hint: 该骰子点位分布为[yugu233](https://space.bilibili.com/613069855)在[这个视频中](https://www.bilibili.com/video/BV1PoqYYeEtp/)提出的设计方案）超立方体有八个立方体胞表面，默认贴图坐标是这样的：每个立方体的前三个坐标取值范围都从-1到1，第四个坐标则是八个胞从0~7编号，每个胞上该坐标不变，恒为面的序号。由于GPU中的浮点数误差，不建议使用相等运算来判断面的编号，下面的代码中使用`uvw.w<0.5`判断0号面，`0.5<uvw.w<1.5`判断1号面……绘制球体的代码很直接，就是通过step函数比较前贴图三个坐标（使用`xxx.xyz`得到）构成的向量跟给定球心的距离跟半径的大小（第二个参数大于等于第一个参数时step函数值为1，否则为0），这样的到的`pattern`变量起到了判断该像素点是骰子的空白部分还是要绘制点数的球体部分。最后我们用`mix`函数根据`pattern`变量选择是上白色还是上对应的颜色。
```wgsl
const red = vec4f(1.0,0.0,0.0,1.0);
const blue = vec4f(0.0,0.0,0.8,1.0);
// 通过一个常量数组储存1-8点的不同颜色
const arr = array<vec4f,8>(red,red,blue,blue,blue,red,blue,blue);
fn main(uvw:vec4f)->vec4f{
    var pattern:f32;
    // 通过贴图坐标的w分量判断是哪个面，然后使用球的距离公式来判断是否在球点图形内
    // 如0号面为半径0.5，位于原点的球
    if(uvw.w<0.5){pattern=step(length(uvw.xyz),0.5);}
    else if(uvw.w<1.5){pattern=step(distance(uvw.xyz,vec3<f32>(0.35,0.35,0.35)),0.28)+step(distance(uvw.xyz,vec3<f32>(-0.35,0.35,-0.35)),0.28)+step(distance(uvw.xyz,vec3<f32>(0.35,-0.35,-0.35)),0.28)+step(distance(uvw.xyz,vec3<f32>(-0.35,-0.35,0.35)),0.28)+step(distance(uvw.xyz,vec3<f32>(0.35,0.35,-0.35)),0.28)+step(distance(uvw.xyz,vec3<f32>(-0.35,0.35,0.35)),0.28)+step(distance(uvw.xyz,vec3<f32>(0.35,-0.35,0.35)),0.28)+step(distance(uvw.xyz,vec3<f32>(-0.35,-0.35,-0.35)),0.28);}
    else if(uvw.w<2.5){pattern=step(distance(uvw.xyz,vec3<f32>(0.38,0.38,0.38)),0.28)+step(distance(uvw.xyz,vec3<f32>(-0.38,-0.38,-0.38)),0.28)+step(length(uvw.xyz),0.28);}
    else if(uvw.w<3.5){pattern=step(distance(uvw.xyz,vec3<f32>(0.35,0.35,0.35)),0.28)+step(distance(uvw.xyz,vec3<f32>(-0.35,0.35,-0.35)),0.28)+step(distance(uvw.xyz,vec3<f32>(-0.35,-0.35,-0.35)),0.28)+step(distance(uvw.xyz,vec3<f32>(0.35,-0.35,0.35)),0.28)+step(distance(uvw.xyz,vec3<f32>(0.46,0.0,-0.46)),0.28)+step(distance(uvw.xyz,vec3<f32>(-0.46,0.0,0.46)),0.28);}
    else if(uvw.w<4.5){pattern=step(distance(uvw.xyz,vec3<f32>(0.35,0.35,0.35)),0.28)+step(distance(uvw.xyz,vec3<f32>(-0.35,0.35,-0.35)),0.28)+step(distance(uvw.xyz,vec3<f32>(0.35,-0.35,-0.35)),0.28)+step(distance(uvw.xyz,vec3<f32>(-0.35,-0.35,0.35)),0.28)+step(length(uvw.xyz),0.28);}
    else if(uvw.w<5.5){pattern=step(distance(uvw.xyz,vec3<f32>(0.35,0.35,0.35)),0.28)+step(distance(uvw.xyz,vec3<f32>(-0.35,0.35,-0.35)),0.28)+step(distance(uvw.xyz,vec3<f32>(0.35,-0.35,-0.35)),0.28)+step(distance(uvw.xyz,vec3<f32>(-0.35,-0.35,0.35)),0.28);}
    else if(uvw.w<6.5){pattern=step(distance(uvw.xyz,vec3<f32>(0.38,0.38,0.38)),0.28)+step(distance(uvw.xyz,vec3<f32>(-0.38,0.38,-0.38)),0.28)+step(distance(uvw.xyz,vec3<f32>(-0.38,-0.38,-0.38)),0.28)+step(distance(uvw.xyz,vec3<f32>(0.38,-0.38,0.38)),0.28)+step(distance(uvw.xyz,vec3<f32>(0.46,0.0,-0.46)),0.28)+step(distance(uvw.xyz,vec3<f32>(-0.46,0.0,0.46)),0.28)+step(length(uvw.xyz),0.28);}
    else if(uvw.w<7.5){pattern=step(distance(uvw.xyz,vec3<f32>(0.35,0.35,0.35)),0.3)+step(distance(uvw.xyz,vec3<f32>(-0.35,-0.35,-0.35)),0.3);}
    // 按刚才的计算结果选择背景或球点的颜色
    return mix(vec4f(1.0,1.0,1.0,0.1),arr[u32(uvw.w+0.5)],pattern);
}
```
注：最后的return那行中，数组的索引是32位无符号整数(u32)类型，这里`u32(..)`函数强制把浮点数(f32)转成u32，转换过程是向下取整的，加上0.5是为了保证不出现数值误差。

创建骰子Geometry、Mesh和场景灯光的代码这里就不赘述了。设置好贴图后，我们可以把相机放远一点，直接把超立方体骰子放在原点，使用对象模式的TrackBallController来控制这个骰子。
```typescript
app.camera.position.w = 3;
// 我们这次不控制相机，而是控制骰子本身，第二个参数设为false，表示控制物体模式
app.controllerRegistry.add(new tesserxel.util.ctrl.TrackBallController(dice_mesh, false));
```
<a name="customctrl"></a>

### 自定义键盘控制器
下面我们自定义一个键盘控制器，结合刚才所学的旋转设置，实现通过按数字键1~8来切换四维骰子的角度，让这些点分别正对相机。
首先，所有的控制器都要实现接口`util.ctrl.IController`中的`update`函数，里面的参数是`ControllerRegistry`维护的state对象，我们可以很方便地获取当前的键盘信息：
```typescript
// 这里是typescript的代码，在js里把 implements tesserxel.util.ctrl.IController删掉即可
class DiceCtrl implements tesserxel.util.ctrl.IController {
    // 在该类中只需要知道它是Obj4对象即可，其实它是继承于Obj4的four.Mesh对象
    // js中不用指定类型，这行只用写dice; 后面同理
    dice: tesserxel.math.Obj4;
    constructor(dice: tesserxel.math.Obj4){
        this.dice = dice;
    }
    update(state) {
        if(state.isKeyHold("Digit1")){
            // （切换到点位1的代码）
        }
        if(state.isKeyHold("Digit2")){
            // （切换到点位2的代码）
        }
        // ....
    }
}
// 然后我们注册这个控制器
app.controllerRegistry.add(new DiceCtrl(dice_mesh));
```
下面我们来写具体的旋转逻辑：场景加载后可看到数字一的点位在左边，因此可知它是朝x负半轴的，骰子在原点，相机在w正半轴，因此我们直接使用lookAt函数让x负方向旋转到w正方向，即为正对相机。我们将这个rotor赋值给dice_mesh.rotation即可，其它面同理。
```typescript
update(state) {
    if(state.isKeyHold("Digit1")){
        // 点1在x负半轴，转到前方w
        this.dice.rotation.setFromLookAt(Vec4.xNeg,Vec4.w);
    }
    if(state.isKeyHold("Digit2")){
        // 点2在y正半轴，转到前方w
        this.dice.rotation.setFromLookAt(Vec4.y,Vec4.w);
    }
    // .... 其它同理
}
```
这里稍微提一下LookAt算法的细节问题：
- 骰子默认是5号点正对相机，其实对应不用做任何旋转的初始状态，即`xxx.setFromLookAt(Vec4.w,Vec4.w)`等价于`xxx.set()`；
- 4号点背对相机，执行`xxx.setFromLookAt(Vec4.wNeg,Vec4.w)`时会旋转180°，但具体绕哪个平面旋转呢？这其实是有无穷组解的，Tesserxel会任意选择一个解来执行。如果你想精确控制，请通过指定2-向量的方式来旋转，如`xxx.expset(Bivec.xw.mulf(Math.PI))`。
- lookAt函数直接一口气生成了从起点到终点的旋转，做出旋转的过渡动画需要其它方法。
- 还有就是旋转对齐的小细节：现在设置的旋转都是用从骰子的默认朝向相机方向生成的旋转写死的。如果朝向已经对齐，图形的“自转”朝向不同也会重新对齐，这并不是最小的旋转方式，如下图：

![左边的朝向按下2键也会对齐变成右边的朝向](/img/tsxdev101.png)
下面来依次解决过渡动画跟最小旋转对齐问题。

### 旋转过渡动画
现在虽然能实现点位切换，但太生硬了。下面加入旋转过渡动画。基本思路是这样的：给定一个目标Rotor的值，然后每帧让rotation通过旋转插值函数`Rotor.slerp`从现在的状态向那个目标“前进”一点点，实现平滑过渡。
为此我们引入一个内部的target变量表示目标。初始状态和动画执行完后都把它设为`null`。当键盘按下时，我们只是设置目标，在每帧都去看跟目标是否接近以执行或完成过渡动画。

```typescript
class DiceCtrl implements tesserxel.util.ctrl.IController {
    dice: tesserxel.math.Obj4;
    // 引入旋转过渡动画的目标
    target: tesserxel.math.Rotor = null;
    update(state) {
        // 每次向目标前进1/5，值越大过渡动画越短
        const dampFator = 0.2; 
        if(state.isKeyHold("Digit1")){
            // 注意target可能为null，不能直接setFromLookAt，要创建Rotor。
            this.target = Rotor.lookAt(Vec4.xNeg,Vec4.w);
        }
        // ... 省略其它按键
        if(this.target){
            // 生成从this.dice.rotation出发，到target但只旋转了1/5路程的旋转
            this.dice.rotation = Rotor.slerp(this.dice.rotation, target, dampFator);
            // distanceSqrTo函数是距离的平方，不直接用距离可减少一次开方运算
            if(this.dice.rotation.distanceSqrTo(target) < 1e-6){
                // 若距目标已很接近，则停止动画
                this.target = null;
            }
        }
    }
}
```

### 最小旋转对齐
为了实现允许自转自由度的最小旋转对齐，我们不能从骰子的默认出发生成旋转，我们要利用骰子目前的朝向信息来对齐才对。暂时先忽略旋转过渡动画，具体做法是，我们找到每个点位在当前朝向下的方向，然后跟y轴对齐：
```typescript
update(state) {
    if(state.isKeyHold("Digit1")){
        // 点1默认在x负半轴，但目前已经被骰子的rotation旋转到了currentDir的位置上
        const currentDir = Vec4.xNeg.rotate(this.dice.rotation);
        // 生成一个把currentDir转到正前方的旋转r
        const r = Rotor.lookAt(currentDir,Vec4.w);
        // 然后在骰子现有的rotation之上，再执行旋转r，得到骰子的最终朝向
        // mulsl为左乘赋值运算，即 rotation = r * rotation; 旋转复合为从右到左的顺序
        this.dice.rotation.mulsl(r);
    }
    if(state.isKeyHold("Digit2")){
        // 同理，只是修改了初始位置
        const currentDir = Vec4.y.rotate(this.dice.rotation);
        const r = Rotor.lookAt(currentDir,Vec4.w);
        this.dice.rotation.mulsl(r);
    }
    // .... 其它同理
}
```
现在再运行代码我们就可以保留自转了，但这也带来一个问题，骰子只要对应的胞垂直面向前，其它方向可以很任意。如果还是想对齐水平竖直方向，我们需要引入其它的方向，并就近对齐，这里面的逻辑稍微复杂，就不展开说了。

最小旋转对齐也可以实现过渡动画。想必能看到这里的读者应该有能力挑战一下过渡动画。具体的代码见[Tesserxel Playground](/tesserxel/playground/)示例场景中的“更多场景渲染设置 > 骰子绘制与控制”。