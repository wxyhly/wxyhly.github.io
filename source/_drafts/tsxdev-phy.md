---
title: 码Tesserxel（三）：建模与物理引擎
tags:
  - 四维
  - 图形学
  - Javascript
  - Tesserxel
  - Webgpu
categories: Tesserxel系列
index_img: /img/tsxdev001.png
---

这次我们来做一个带物理引擎的保龄球游戏。我们将学习使用自定义发球控制器。
## 物理引擎简介
Tesserxel的物理引擎是独立于渲染引擎的，它不属于`four`模块，而是一个单独的模块`physics`。因此我们的保龄球游戏需要建立两个场景，一个是物理逻辑场景，另一个是渲染的模型场景。玩家控制逻辑场景，我们需要在每一帧去完成物理解算并将逻辑场景与渲染场景同步。我们先演示一下一个简单的地面上放置方块的场景练手：
```javascript
// 引入物理引擎模块的简写
const PHY = tesserxel.physics;
// 初始化物理引擎
const engine = new PHY.Engine();
// 初始化物理世界
const world = new PHY.World();
// 创建一个刚体对象
let cube_logic = new PHY.Rigid({
    // Tesseractoid 是超长方体的意思，这里设置为边长为1的超立方体
    geometry: new PHY.rigid.Tesseractoid(1),
    // 材质的两个参数分别为摩擦系数与弹性系数
    material: new PHY.Material(0.5, 0.5),
    // 质量设为1kg
    mass: 1, 
});
// 把立方体加入物理世界
world.add(cube_logic);
// 创建渲染app
const canvas = document.querySelector("canvas");
const app = await FOUR.App.create({canvas});
// 稍等我们再来渲染这个立方体
app.run(()=>{
    // 由于还没写渲染逻辑，我们先在控制台看下它的位置坐标
    console.log(cube_logic.position);
    // 物理引擎每帧更新world 1/60s个时间步长
    engine.update(world, 1/60);
});
```
运行代码我们可发现这个立方体的y坐标在递减，说明它在往下掉，这是`world`中默认开启的重力在起作用。

### 渲染场景同步

下面我们加入渲染逻辑。首先创建立方体，配置材质灯光，然后在`app.run`的回调函数中多加一句代码，将两边物体的Obj4属性内容拷贝同步即可。
```javascript
// 加入超立方体
let cube_mesh = new FOUR.Mesh(
    new FOUR.TesseractGeometry(), new FOUR.LambertMaterial([1, 1, 0])
);
app.scene.add(cube_mesh);
cube_mesh.alwaysUpdateCoord = true;
// 加入光照
app.scene.add(new FOUR.DirectionalLight(
    [0.9, 0.8, 0.8], 
    new tesserxel.math.Vec4(-1, 1, 1, 1).norms() 
));
app.scene.add(new FOUR.AmbientLight(0.3));
// 把相机放远些以看到正方体
app.camera.position.w = 10.0;
app.run(()=>{
    engine.update(world, 1/60);
    // 同步物理逻辑物体与渲染网格物体
    cube_mesh.copyObj4(cube_logic);
    // Obj4包括位置与旋转，如果只想同步位置则可写：(不推荐)
    // cube_mesh.position.copy(cube_logic.position);
});
```
这次我们能够看到一个黄颜色的超立方体往下掉了。下面我们来修改代码添加地面，让立方体能掉在地上。由于地面是静止的，所以把质量设为0，且不需要写相关的动态更新的逻辑。
```javascript
// 加入能渲染的立方体地面
let floor_mesh = new FOUR.Mesh(
    // 这里lambert材质的颜色给了第四个alpha值，它用于控制在体素渲染中的透明度
    // 我们把地面透明度调低，以便观察立方体
    new FOUR.CubeGeometry(10), new FOUR.LambertMaterial([1, 1, 1, 0.2])
);
// 我们让立方体往下掉一些再触地，因此地面设在y=-4的地方
floor_mesh.position.y = -4;
app.scene.add(floor_mesh);
// 加入物理上的无限大地面，Plane后面的参数为地面的法线
// 这里传入预定义的常量Vec4.y，也可以手动写new Vec4(0,1,0,0)
// 第二个参数-4是平面离原点的距离，背离法向为负
world.add(new PHY.Rigid({
    geometry: new PHY.rigid.Plane(tesserxel.math.Vec4.y,-4),
    material:new PHY.Material(0.5, 0.5), mass: 0
}));
```
如果你觉得太单调了，我们可以给立方体添加初始速度/角速度，或通过`randset`（生成随机方向的单位向量或2-向量）设置随机的初始速度/角速度朝向，注意这些设置都是在物理场景中进行而不是渲染场景中：
```javascript
// 设置随机方向的速度，大小为2
cube_logic.velocity.randset().mulfs(2);
// 设置随机方向的角速度，大小为5
cube_logic.angularVelocity.randset().mulfs(5);
// 设置随机朝向
cube_logic.rotation.randset();
```
注意其实四维物体的朝向`rotation`并不是向量，而是由两个四元数组成的旋量`Rotor`，具体技术细节见[《四维计算机图形学：旋转篇》](/archives/so4/)。

现在每次刷新加载场景都能看到超立方体随机扔向地面了，在地上滚动了。完整代码可在[Tesserxel Playground](/tesserxel/playground/)上“两个示例场景”的下拉菜单中找到。

### 保龄球场景建模

下面我们就来制作保龄球的场景。首先我们来画个三维保龄球场景的草图，等会把它扩展到四维。
下面我们制作球道，按wiki上的标准尺寸长度设为20，宽度1.05，第四维的宽度也设为1.05。球的直积为。

### 最佳击球点的研究
```typescript
class ChaoticEmitter {
    ball: tesserxel.physics.Rigid;
    pinMgr: PinMgr;
    camera: tesserxel.four.Camera;
    constructor(cam: tesserxel.four.Camera, ball: tesserxel.physics.Rigid, pinMgr: PinMgr) {
        this.ball = ball;
        this.pinMgr = pinMgr;
        this.camera = cam;
    }
    runOnce() {
        // 重新设置球的位置和初速
        this.ball.velocity.set();
        this.ball.angularVelocity.set();
        this.ball.position.copy(this.camera.position);
        this.ball.rotation.set();
        this.ball.position.y -= 0.5;
        this.ball.velocity.copy(Vec4.wNeg.rotate(this.camera.rotation).mulfs(5));
        this.ball.angularVelocity.xw = 3;
    }
}
let timer = 0;
const posArr = [];
// 生成一堆坐标阵列
for (let i = -0.2; i <= 0.2; i += 0.005) {
    for (let j = -0.2; j <= 0.2; j += 0.005) {
        posArr.push(new Vec4(i, 0.7, j, 0));
    }
}
// ChaoticEmitter中我们手动创建一颗超球，我们将一直使用该球从不同位置发射轰击
const chaos = new ChaoticEmitter(app.camera, new PHY.Rigid({
    geometry: new PHY.rigid.Glome(emitter.glomeRadius),
    material: new PHY.Material(0.5, 0.1), mass: emitter.mass
}), pinMgr);
world.add(chaos.ball);
// 记录发球试验的场次序号
let idx = 0;
app.run(() => {
    timer++;
    pinMgr.update();
    // 我们每帧执行原来的物理循环30次
    for(let i=0;i<30;i++)engine.update(world, 1 / 60);
    score.update(pinMgr.count(), emitter.count());
    if ((timer % (2 * 3)) === 0) {
        // 6帧（原来的180帧）后，我们统计击球数
        console.log(
            app.camera.position.x,
            app.camera.position.z,
            pinMgr.countDetail().join(",")
        );
        // 放入一个全局变量中保存
        window["chaosData"].push([app.camera.position.x, app.camera.position.z, pinMgr.countDetail().join(",")]);
        // 更新相机位置，准备下次发球
        app.camera.position.copy(posArr[idx++]);
        // 重新摆瓶
        pinMgr.restart();
    }
    // 重新摆瓶30帧后再发球，因为怕瓶子还在晃动影响结果
    if ((timer % (2 * 3)) === 1) {
        chaos.runOnce();
    }
});
```
现在运行这个代码一帧需要好几秒了，这样我们每隔30个循环还是能看到场景的运行情况，且节约了很多渲染开销。更好的做法是将上述代码中的渲染逻辑全删掉，放到纯nodejs中跑，每次统计击球数时把结果直接写入本地文件。Tesserxel在不适用渲染相关逻辑情况下是完全支持在后端nodejs中运行的。