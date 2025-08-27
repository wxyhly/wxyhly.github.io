---
title: 码Tesserxel（一）：你好，超立方体
tags:
  - 四维
  - 图形学
  - Javascript
  - Tesserxel
  - Webgpu
categories: Tesserxel系列
index_img: /img/tsxdev001.png
date: 2025-08-27 23:48:17
---


今天要开一个新的系列介绍如何使用四维图形引擎Tesserxel自己编写四维场景，针对的是有一定代码编写基础，接触过Javascript等语言，并有一定的三维计算机图形学常识的读者。Tesserxel引擎包括四维代数库、渲染引擎、物理引擎、建模处理等好几部分。其中渲染引擎有很底层的模块，也有封装层级较高的模块。我们先了解类似于THREE.js的高级库four模块，使用该模块可以用少量代码就渲染出四维体素场景。（建议读者先试着使用THREE.js接触一下三维图形编程再来挑战四维）如果读者对Tesserxel还很陌生，请移步[《玩Tesserxel》](/archives/tesserxel-hello/)系列再回来。
## 开始
### 在线网站直接体验
如果你嫌后面本地安装的方式都麻烦，可以先在[Tesserxel Playground](/tesserxel/playground/)上体验一下，里面可加载本系列所有的示例场景，tesserxel库已经自动引用好了，可以一边编辑一边预览，非常方便，且支持使用浏览器的localstorage缓存保存至本地。此外也可以在[playcode.io这个在线编辑网站](https://playcode.io/1892016)上尝试。（有更强的代码提示功能，免费登录注册后能编辑代码）![Tesserxel Playground在线编辑器截图](/img/tsxdev001.png)
### 本地安装
但如果你真的想创建一个可发布的独立的项目，则每个Tesserxel项目都需要一个包含`<canvas>`画布元素的网页。比如你可以复制下面的HTML代码来创建最简单的网页。
```html
<html>
  <body><canvas></canvas>
  <script src="script.js"></script>
  </body>
</html>
```
将上述内容保存成扩展名为`.html`的网页文件，然后在相同目录下创建一个叫`script.js`的Javascript脚本文件，我们将在这里面写所有的代码。有下面几种方法。

#### 引入打包好的单一tesserxel.js文件（新手推荐）
下载或直接在网页中引用（需写在`<script src="script.js"></script>`之前，建议下载，直接引用可能有跨域、跨协议等问题）[https://wxyhly.github.io/tesserxel/build/tesserxel.js](https://wxyhly.github.io/tesserxel/build/tesserxel.js)：
```html
<script src="https://wxyhly.github.io/tesserxel/build/tesserxel.js" type="text/javascript"></script>
```
该格式叫做UMD，即会引入一个叫tesserxel的全局变量，其各模块层级使用`.`来访问。例如四维向量类位于math模块下，需写成`tesserxel.math.Vec4`。为了方便，你可以将常用的模块或类定义为更简短的变量：
```javascript
// 默认定义一个四维向量需要这样书写：
let v1 = new tesserxel.math.Vec4(1,2,3,4);
// 引入捷径可以简化
const Vec4 = tesserxel.math.Vec4;
let v2 = new Vec4(1,2,3,4);
```
#### 通过import方法按需引入相应模块
还有一种则是使用import语句加载esm格式的tesserxel：首先将`<script>`标签改一下写法，写成`<script src="script.js" type="module"></script>`，让浏览器识别import模块，然后编辑`script.js`：
```javascript
// 将整个打包成一个叫tesserxel的全局模块
import * as tesserxel from "https://wxyhly.github.io/tesserxel/build/esm/tesserxel.js"
// 访问子模块的方法与刚才一样：
let v1 = new tesserxel.math.Vec4(1,2,3,4);


// 按需引入各子模块
import {four, math} from "https://wxyhly.github.io/tesserxel/build/esm/tesserxel.js"
// 引入的子模块可直接在全局层面访问
let v2 = new math.Vec4(1,2,3,4);
```
这种方法引入的`tesserxel.js`文件还是会去加载其它的所有模块。如果希望提高脚本加载速度，可以只引用特定的子模块的js文件，从而避免下载大量用不到的代码。但很多模块是相互依赖的，仅引入上游模块还是会自动加载下游被依赖的模块。建议引入第一级子模块（如`math`、`four`这些）即可。
```javascript
// 如果只想加载tesserxel的四维代数库，推荐这样import避免加载其它渲染库代码
import * as math from "https://wxyhly.github.io/tesserxel/build/esm/math/math.js"

// 不推荐最小层级import，因为Vec4向量类中定义了与2-向量、四元数等的运算，这些模块也可能被下载。
import { Vec4 } from "https://wxyhly.github.io/tesserxel/build/esm/math/algebra/
// 
```
#### 通过npm安装并使用Typescript（老手推荐）
可通过下面命令在你的工作目录中安装tesserxel，安装后你可以使用typescript，或用自己喜欢的打包工具重新打包代码。（推荐使用rollup打包）
```bash
npm install --save tesserxel
```
打包工具不是必选的。若不使用打包工具，网页中无法直接识别nodejs风格路径，可以在网页中使用importmap来解决。该方法也可解决前面例子中直接import的后面的网址很长的问题。
```html
<script type="importmap">
{  
  "imports": {
    // 如果要引入已安装至本地的nodejs模块，则把模块地址拿给浏览器正确解析
    "tesserxel": "./node_modules/tesserxel/build/esm/tesserxel.js",
    "tesserxel/math": "./node_modules/tesserxel/build/esm/math/math.js",
    // 不用nodejs也可以把网址缩短
    "tesserxel": "https://wxyhly.github.io/tesserxel/build/esm/tesserxel.js",
    "tesserxel/math": "https://wxyhly.github.io/tesserxel/build/esm/math/math.js"
  }
}  
</script>
```

## 最简单的场景
Tesserxel使用WebGPU API高效绘制图形，跟WebGPU一样，Tesserxel大量使用async前缀修饰的异步函数。如果你不知道什么是异步函数，可以只需记得在调用函数前加上await就能正常执行即可，最后把整个代码放在一个用async修饰的大函数中，最后来调用执行（执行最外层不加await了）。代码虽然不算短，但整体结构还是比较明了的，我就直接把解释都写到注释里了，后面再单独说说场景结构和坐标变换的相关细节。
```javascript
// 这之前你应该已经写了import tesserxel的相关语句，确保后面浏览器识别tesserxel模块

// 所有的代码都放在这个async修饰的异步大函数中
async function load() {
    // 引入Tesserxel库中的four模块
    const FOUR = tesserxel.four;
    // 获取网页中的canvas dom对象
    const canvas = document.querySelector("canvas");
    // 在该画布上创建渲染应用。这里调用异步函数等待渲染器完成资源的初始化
    const app = await FOUR.App.create({ canvas });
    // 默认的四维场景背景色为黑色(0.0, 0.0, 0.0)，这里我们改成白色
    // 第四个alpha值用于控制体素的不透明度，1.0为最不透明，该值不影响截面视图
    app.scene.setBackgroudColor({ r: 1.0, g: 1.0, b: 1.0, a: 1.0 });
    // 定义一个超立方体的几何数据
    let cubeGeometry = new FOUR.TesseractGeometry();
    // 定义超立方体的材质，这里的BasicMaterial表示是纯色材质。我们设置为纯红色
    let material = new FOUR.BasicMaterial({ r: 1.0, g: 0.0, b: 0.0, a: 1.0 });
    // 定义一个超立方体网格，使用刚才的几何数据和材质
    let mesh = new FOUR.Mesh(cubeGeometry, material);
    // 待会我们后让超立方体旋转起来，因此我们设置每次都要更新它的坐标，默认不会更新
    mesh.alwaysUpdateCoord = true;
    // 将超立方体加入场景中
    app.scene.add(mesh);
    // 默认所有对象都位于坐标原点。因此要将相机向后移动一点点以便看到位于原点的超立方体
    // 注：w轴指向相机背后(跟三维图形学中的z轴类似)
    app.camera.position.w = 3.0;
    // 默认所有体素立方体的控制操作都需要按住Alt键来激活
    //我们可以手动将键位配置为空来取消激活步骤
    app.retinaController.keyConfig.enable = "";
    // 开始执行帧循环
    app.run(()=>{
        // 每一帧我们在xw、yz两方向上各旋转0.01弧度，得到等角双旋转
        mesh.rotates(tesserxel.math.Bivec.xw.mulf(0.01).exp());
        mesh.rotates(tesserxel.math.Bivec.yz.mulf(0.01).exp());
    });
}

load(); // 最终执行
```
Four模块中的`App.create`函数已经自动将Scene、Camera、Renderer、ControlRegistry声明好了。我们也可以不使用`App.create`，自己定义所有的东西写帧循环，具体将在后面的文章中细说。

## 坐标系与Vec4类

下面介绍一下Tesserxel使用的四维坐标系：在摄像机的坐标系下，首先x、y、z坐标对应一般三维计算机图形学使用的坐标系，即y轴为上方，x为右方，z轴指向二维屏幕外。四维的图像是三维的了，因此z轴的含义就是体素立方体的向二维屏幕外面的边的方向。四维空间的w轴方向与z轴类似，也是指向平面外，但这个屏幕指的是三维的体素屏幕，换句话说，是指向四维相机的背后。

Four模块的场景中的每个对象（网格、灯光、相机等）都可以通过访问其position属性设置坐标位置。Tesserxel的坐标使用Math模块中的四维向量类(Vec4)表示。下面给出一些常见的四维向量的操作方法：
```javascript
// 将mesh的位置设置为(1,0,0,0)
mesh.position.set(1,0,0,0);
// 创建一个新的Vec4对象，旧Vec4对象的内存将被系统自动垃圾回收后释放
mesh.position = new Vec4(1,0,0,0);
// 直接改变其分量值
mesh.position.x = 1;
// 将mesh的位置设置为meshPos的值，copy方法不产生新对象。
let meshPos = new Vec4(1,0,0,0);
mesh.position.copy(meshPos);
// 上面的copy方法等价于
mesh.position.set(meshPos.x, meshPos.y, meshPos.z, meshPos.w);
```
向量之间可以进行加减法、数乘、内外积、单位化等运算。使用详情我们将放在下篇文章中介绍。
## 四维物体的朝向与旋转
这或许是最复杂的部分了。四维空间中的旋转具体技术细节[见这里](/archives/so4/)，下面只说最简单的用法。类似三维空间旋转用旋转轴加旋转角度表示，四维空间旋转用旋转平面加角度表示。2-向量（即二维版的向量）是专门表示平面的一种代数系统。

`Bivec.xw`与`Bivec.yz`表示的是Tesserxel内部预先定义好的xw、yz单位平面2-向量常量。**注意请勿修改这些预定义常量的各分量值，也不要对其进行相关set操作，Tesserxel内部也会用到它们，修改了会带来不可预知的错误和bug！**我们将单位旋转平面通过`mulf`(乘以浮点数的缩写)函数乘上要旋转的角度（弧度制单位）即可。最后exp函数将平面的2-向量代数转换为旋转代数，然后调用rotates方法最终执行旋转。之前的例子中我们进行了两次绝对垂直平面上的旋转，合成了一次等角双旋转:
```javascript
mesh.rotates(Bivec.xw.mulf(0.01).exp());
mesh.rotates(Bivec.yz.mulf(0.01).exp());
```
除了直接给`position`属性设值，还可以使用`translates`方法来移动物体，这样的好处是支持链式操作：
```javascript
// 将物体位置向y轴移动0.1个单位，然后绕物体自身的原点在xy平面中旋转30°
mesh.translates(Vec4.y.mulf(0.1)).rotates(Bivec.xy.mulf(30*Math.PI/180).exp());
```

## Four模块的一般架构

在Four模块中，执行四维场景渲染一般需要下面几个东西：
- Scene: 四维场景，且一般需要把以下内容加入至场景中，它们都支持设置位置与朝向：
  + Camera: 摄像机
  + Mesh: 要渲染的物体网格，可以有很多个。每个Mesh包含：
    - Geometry: 具体的四面体几何数据
    - Material: 材质
  + Light: 灯光
- Renderer: 渲染器
- ControlRegistry: 交互控制器

刚才我们已经了解了四维场景中的物体的位置与朝向设置。下面来具体看看每类物体：
### Camera

默认的四维相机采用透视投影，且视场角(Field of Vision)为90°。可以修改的属性有：（等号后面展示的是默认配置）
- fov（视场角，可与焦距换算） = 90
- near（近距裁剪平面位置） = 0.1
- far（远距裁剪平面位置） = 100

跟三维情况一样，正确设置适当的远近裁剪平面位置才会让渲染器的深度缓冲正常工作。若此处有疑问，请参阅网上一般的三维计算机图形学教程。如果想换成没有近大远小的正交投影相机，则需要这样写：
```javascript
app.camera = new FOUR.OrthographicCamera();
```
正交投影相机可以修改的属性有：（等号后面展示的是默认配置）
- size = 2
- near（近距裁剪平面位置） = -10
- far（远距裁剪平面位置） = 10
<!---补三维体素的链接--->
<!---补三维体素的链接--->
<!---补三维体素的链接--->
<!---补三维体素的链接--->
注意，这些参数针对的是渲染四维场景的相机配置，而不是渲染三维体素的相机配置。Tesserxel默认会加载一个齿轮图标来让用户自己配置体素渲染的参数。如果想在代码中指定体素渲染参数或做一些限制，下篇文章将会说如何配置它们。
### Mesh与Geometry

Mesh与Geometry两个东西看起来差不多，但其实有很大区别。Geometry是存放的物体的几何数据，Mesh则是存放该物体在场景中的位置朝向、材质等信息。一个场景中可以有多个Mesh共用同一个Geometry，比如一堆五颜六色的小球的位置材质都不同，但形状都一样。Tesserxel中内置了下面的Geometry几何数据库：
|名称|解释|
|----|-----|
|TesseractGeometry|超立方体|
|GlomeGeometry|超球|
|CubeGeometry|立方体平胞，法线默认朝向y轴|
|SpheritorusGeometry|球环，默认躺在xw平面内|
|TorisphereGeometry|环球，默认躺在xzw平面内|
|SpherinderSideGeometry|球柱侧面，母线默认朝向w轴|
|TigerGeometry|双圆环，默认朝向为xy-zw|
|DitorusGeometry|圆环环，主圆环位于xyz平面内，大圆周位于xy平面|
|DuocylinderGeometry|双圆柱，默认朝向为xy-zw|

其它的图形将在以后的建模中细说。

### 更丰富的灯光与材质

在我们刚才最简单的例子当中，超立方体使用的基本材质`BasicMaterial`，渲染为均匀的纯红色，因此不再需要定义灯光照明。如果要更真实的光照，除了将材质换成`LambertMaterial`或`PhongMaterial`外，还需要给场景添加光源，否则渲染的物体是漆黑的。灯光也支持动态调整位置，但须记得将其`alwaysUpdateCoord`属性设为`true`以开启位置更新。
#### 示例一：Lambert + 平行光
Lambert材质也只有单一颜色参数，但物体的明暗会随着其法线跟光线的夹角来变化，适合表达漫反射材质。平行光只用指定光源颜色和来光方向。该**方向必须要是单位向量**，即向量长度要为1。为提高性能，Tesserxel不会自动把方向单位化。比如下面示例代码中的向量不是单位长度，需要手动加上`.norms()`后将其强制缩放至单位长度，否则**渲染出的颜色可能会很怪异**。
```javascript
// Lambert材质也只有单一颜色参数
const material = new FOUR.LambertMaterial([1,0,0]);
const dirLight = new FOUR.DirectionalLight(
  // 用r/g/b表示的光源强度，其值可以超过1
  [0.9, 0.8, 0.8], 
  // 指定平行光的来光方向，需用norms函数将其单位化
  new tesserxel.math.Vec4(-1, 1, 0, 1).norms() 
);
// 别忘了把灯光加入场景
app.scene.add(dirLight);
// 然后做同样的事情：指定材质
let mesh = new FOUR.Mesh(cubeGeometry, material);
// ..... 其它代码不变
```
#### 示例二：Phong + 点光源
Phong材质除了颜色参数，还有个光泽度参数，可以控制高光亮斑的大小和高光颜色，适合表达光滑的材质。
```javascript
// 换成光滑的双圆环几何
let tigerGeometry = new FOUR.TigerGeometry();
// Phong材质有颜色、高光度、高光颜色三个参数，后面两个参数都是可选的，默认值分别为20和白色
const material = new FOUR.PhongMaterial([0.93, 0.87, 0.8],10);
// 点光源只有光源强度这个参数
const pLight = new FOUR.PointLight([0.9, 0.8, 0.8]);
// 其位置默认位于原点，可通过前述所有修改其位置的方法来改变位置
pLight.position.w = 2;
// 别忘了把灯光加入场景
app.scene.add(pLight);
// 然后做同样的事情：指定材质
let mesh = new FOUR.Mesh(tigerGeometry, material);
// ..... 其它代码不变
```

#### 环境光
默认照不到光的背光面都是纯黑的。如果场景不想要太黑，可以引入没有方向性的环境光`AmbientLight`。
```javascript
app.scene.add(new FOUR.AmbientLight(0.3));
```
## 示例代码演示
完整的示例代码演示都可以在[Tesserxel Playground](/tesserxel/playground/)示例场景中的“你好超立方体”中找到。

