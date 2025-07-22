---
title: 用Tesserxel（三）：你好，四面体
tags:
  - 四维
  - 图形学
  - javascript
  - tesserxel
  - webgpu
  - 系列文章
categories: Tesserxel系列
---

我们已经介绍了Tesserxel的Four模块可快速构建四维场景，Four模块是建立在底层渲染模块Render之上的。这篇文章我们将来介绍这个偏向底层的模块以完成一些更高级的定制化操作。本文涉及到图形学绘制的一些底层概念及相关操作，读者最好要对现代可编程渲染管线有所了解。

## 绘制你的第一个体素四面体

配置好Tesserxel的路径后，首先创建一个GPU对象，并对其初始化。该对象是WebGPU中的原生`gpu`、`device`、`adapter`等对象的封装，将一些繁琐的配置打包了在了单一的`init`函数中。
```javascript
const gpu = await new tesserxel.render.GPU().init();
```
初始化GPU之后，下面我们来指定画布。HTML中使用`<canvas>`标签来定义画布。要想通过Javascript在`<canvas>`画布上绘制图形，必须要通过一个上下文对象进行相关操作。我们通过下面的代码获取一个上下文，以后所有的绘制操作都会调用上下文的方法，而不是去调用Canvas Dom本身：
```javascript
// 选择页面中第一个<canvas>元素DOM对象
const canvas = document.querySelector("canvas") as HTMLCanvasElement;
// 通过刚才建立的GPU对象得到关于该画布的上下文
const context = gpu.getContext(canvas);
```
Tesserxel将绝大多数工作都打包在了切片渲染器`SliceRenderer`中，Tesserxel的逻辑是把四维图形的处理封装成跟三维图形的处理一样，它将自动完成复杂的体素渲染与截面计算（详细算法见[《四维计算机图形学：渲染篇》](/archives/cg4d/)）。，然而WebGPU是一个相当底层的API。在绘制三角形前我们必须自己绑定GPU缓冲区，配置着色器与渲染管线。因此我们同样也需对如何绘制四面体指定相应的GPU缓冲区，配置着色器与渲染管线。下面给一个简单的例子：
```javascript
// 通过刚才建立的GPU对象得到切片渲染器
const renderer = new tesserxel.render.SliceRenderer(gpu);
// 顶点着色器代码：这段代码通过一个4x4的矩阵定义了一个四面体的4个顶点坐标。WebGPU用的是一种新的着色器语言WGSL，我们以后将详细介绍它
const vertexShaderCode = `
@tetra fn main() -> @builtin(position) mat4x4<f32> {
    return mat4x4<f32> (
            1.0, 1.0, 1.0, -1.0,
        -1.0,-1.0, 1.0, -1.0,
            1.0,-1.0,-1.0, -1.0,
        -1.0, 1.0,-1.0, -1.0
    );
}
`;
// 片元着色器代码：这段代码指定了四面体的颜色是纯红色。
const fragmentShaderCode = `
@fragment fn main() -> @location(0) vec4<f32> {
    return vec4<f32> (1.0,0.0,0.0,1.0);
}
`;
// 有了顶点着色器和片段着色器，我们将它们串起来编译成可执行的渲染管线。注意该编译方法是异步的
const pipeline = await renderer.createTetraSlicePipeline({
    vertex: {
        code: vertexShaderCode,
        entryPoint: "main"
    },
    fragment: {
        code: fragmentShaderCode,
        entryPoint: "main"
    }
});
```
上面的代码虽然有点长，但我们在着色器中指定了顶点数据、体素颜色和渲染管线，下一步就可以渲染了。在最终渲染之前让我们执行一下渲染器的初始化函数，并加上异步函数的await修饰符确保初始化已完成，否则执行后面渲染步骤会报错。
```javascript
await renderer.init();
```
注意：这里不推荐在初次声明renderer时就写这个代码。因为renderer在创建的时候会默认开始初始化，期间我们还可以同时做编译着色器代码等工作，如果提前执行`await init`将导致代码在此停止执行，直到初始化完成后才会执行后面的命令。

最后，让我们调用render方法完成最终四面体的绘制。render方法接受一个回调函数作为参数，定义了所有的渲染步骤要绘制一个四面体最简单需要三步：1.指定用哪个渲染管线；2.指定绘制哪些数据并计算截面；3.将截面渲染上屏。这些步骤都通过回调函数中的参数renderstate来调用。第二步指定绘制数据并计算截面的函数`sliceTetras`有两个参数，第一个为参数时要绘制的GPU缓冲数据源，这里不涉及，故用null占位，第二个参数表示绘制的数量，这里只绘制一个四面体，因此填1。
对了，绘制之前你可能还需要调整canvas画布的大小，否则默认的画面很小。
```javascript
renderer.render(context, (renderState) => {
    // 指定用之前定义的渲染管线，准备开始绘制四面体
    renderState.beginTetras(pipeline);
    // sliceTetras函数开始绘制四面体，null表示不需要顶点缓冲数据，1表示绘制一个四面体
    renderState.sliceTetras(null, 1);
    // 结束本次渲染管线，绘制完毕
    renderState.drawTetras();
});
```
为什么要分好几步来呢？SliceRenderer的内部其实有两个流程：一是将四面体切片，计算截面形状，二是使用传统三位渲染方式将截面渲染出来。使用相同渲染管线的数据批量执行这两个管线的渲染效率比一个一个执行高得多，后面我们将在复杂的例子中具体说这些细节。问什么这里要弄个回调函数来写渲染步骤呢？因为体素是分层渲染的，可能会不止一次执行这些绘制函数，用回调函数的好处是将什么时候对哪些层执行渲染的逻辑隐藏了，使我们更能专注于四面体渲染本身。

到了这里，你的代码应该跟[这里](playground???)差不多，并且可以看到这样的画面：![](/img/tsxdev20101.png)

我们绘制的四面体默认开启了左右裸眼3D两个画面，并且包含了从中心抽取的3个方向的截面。以后我们将说明如何配置它们。

## 初识WGSL(WebGPU Shader Language)

虽然我们已经渲染了第一个体素四面体，但整个四面体是纯红色的，简直丑陋无比。本节我们将修改片元着色器，给四面体体素赋予美丽的渐变色，同时也讲解一下WGSL语言的相关语法。之前我们没有详细讲解顶点着色器代码的含义，下面重新解释一下：
```wgsl
// @tetra 是一个函数修饰符，表示这是个四面体的顶点着色器的主函数
// fn 是定义函数的关键字，类似js中的function
// WGSL类似C语言，所有变量和函数返回值都有类型。
// 这里的 -> mat4x4<f32> 表示main函数返回一个4x4的浮点数矩阵
// @builtin(position) 修饰符表示该返回值作为最终的四面体顶点交给GPU硬件来处理
@tetra fn main() -> @builtin(position) mat4x4<f32> {
    // 返回一个浮点数矩阵，每行对应一个四面体的顶点
    return mat4x4<f32> (
            1.0, 1.0, 1.0, -1.0,
        -1.0,-1.0, 1.0, -1.0,
            1.0,-1.0,-1.0, -1.0,
        -1.0, 1.0,-1.0, -1.0
    );
}
```
### 插曲：吐槽代码高亮与hexo主题更新

这里我说一些离题的话。可能老读者发现我的网站主题有所变动。其实是因为我在写这篇文章时，发现markdown不支持WGSL语言的语法高亮。于是我在往上搜寻如何添加高亮，但配置始终不对。正好我的Blog主题框架太老了，很多东西都不兼容了，于是我一气之下将主题框架换成了[Fluid](https://github.com/fluid-dev/hexo-theme-fluid)，我又重新配置了每篇文章的封面图与文章摘要，弄了大约一周。还好Fluid的配置比原来的主题简单多了，切换到prism直接就正常显示WGSL代码了。
### 回到着色器

下面我们将给每个顶点指定不同的颜色并传给后续的片元着色器进行自动插值，就像一般的3D渲染管线那样。
现在我们的main函数除了输出顶点坐标，还需要输出顶点的颜色。我们在定义main函数之前，先定义一个结构体来描述这个复杂的输出的类型：
```wgsl
struct TetraOutput{
    // 这是原来的四面体顶点输出
    @builtin(position) position: mat4x4<f32>,
    // 这是新加入的顶点颜色输出，用@location(0)修饰它以便在后面的片元着色器中访问
    @location(0) color: mat4x4<f32>
}
```
虽然颜色只有R/G/B三个分量，但WGSL默认颜色还要多一个表示不透明度的分量，即R/G/B/A四个分量，且基于内存对齐等性能考量，因此我们还是用一个4x4的矩阵像储存四面体顶点坐标那样来储存。下面我们修改main函数，注意WGSL中结构体跟矩阵一样，像构造函数那样创建：`TetraOutput(·，·)` ——它接受两个四阶矩阵作为参数，其中第一个代表位置，第二个代表颜色。
```wgsl
@tetra fn main() -> TetraOutput {
    return TetraOutput(
        // 原来的顶点位置矩阵
        mat4x4<f32> (
            1.0, 1.0, 1.0, -1.0,
            -1.0,-1.0, 1.0, -1.0,
            1.0,-1.0,-1.0, -1.0,
            -1.0, 1.0,-1.0, -1.0
        ),
        // 下面的颜色最后一位都是1.0，表示不透明度最大
        mat4x4<f32> (
            0.0, 0.0, 1.0, 1.0, // blue
            0.0, 1.0, 0.0, 1.0, // green
            1.0, 0.0, 0.0, 1.0, // red
            1.0, 1.0, 1.0, 1.0, // white
        ),
    );
}
```
下面我们修改片元着色器。修改很简单，只需要给函数加入一个参数，并加上相应的修饰符即可：
```wgsl
@fragment fn main(@location(0) color: vec4<f32>) -> @location(0) vec4<f32> {
    return color;
}
```
如果要传递多个变量，只需要将location括号中填入不同的序号区分地址即可，并保持顶点着色器的输出location序号跟片元着色器的输入location序号一样。注意，片元着色器还有一个输出@location(0)，这个location序号跟输入无关，它用于指定渲染的画布目标，在四维渲染中一般都默认为@location(0)。

好了，现在运行代码，我们就能看到一个颜色丰富的四面体了：

![](/img/tsxdev20101.jpg)

## 初识GPU缓冲区

现在我们的四面体有了缤纷的色彩，但场景还是静态的，无法多角度观察。本节将在上一个场景的基础上动态修改顶点坐标数据，添加让四面体转起来的功能。我们将使用四维矩阵来描述旋转，并在顶点着色器中给原来的顶点进行相应的坐标变换。然而要实现转起来的动态效果，就必须每帧更新矩阵的值。我们将通过建立GPU缓冲区对象让javascript与GPU进行通信。下面我们修改顶点着色器代码，并引入一个Uniform变量（即GPU用的全局变量）viewMat来存储Javascript传来的旋转矩阵。WebGPU把所有外部传来的变量都分了组(group)，每个变量在每组中有像location那样的绑定位置(binding)。本来组与位置都是从0开始其实编号的，但Tesserxel将第0组用于内部切片化四面体用，因此我们从第1组开始绑定。我把顶点着色器中有修改的地方都加入了注释：
```wgsl
// 声明一个类型为mat4x4<f32>的Uniform变量，并通过修饰符指定其位于第一组的第0个绑定位置
@group(1) @binding(0) var<uniform> viewMat: mat4x4<f32>;
struct TetraOutput{
    @builtin(position) position: mat4x4<f32>,
    @location(0) color: mat4x4<f32>,
}
@tetra fn main() -> TetraOutput {
    return TetraOutput(
        // 通过矩阵乘法来旋转四面体
        viewMat * mat4x4<f32> (
            1.0, 1.0, 1.0, -1.0,
            -1.0,-1.0, 1.0, -1.0,
            1.0,-1.0,-1.0, -1.0,
            -1.0, 1.0,-1.0, -1.0
        ),
        mat4x4<f32> (
            0.0, 0.0, 1.0, 1.0, // blue
            0.0, 1.0, 0.0, 1.0, // green
            1.0, 0.0, 0.0, 1.0, // red
            1.0, 1.0, 1.0, 1.0, // white
        ),
    );
}
```
然后我们新建一个Javascript Float32Array数组，在GPU上调用`createBuffer`创建对应的GPU缓冲区。`createBuffer`函数的第一个参数是一个位标志整数，`GPUBufferUsage.UNIFORM`这一位告诉GPU这个缓冲区的用于绑定着色器中的Uniform变量，`GPUBufferUsage.COPY_DST`这一位表示随时可允许通过Javascript向其中写入值。WebGPU会对这些设置在GPU内部采取不同的内存布局以优化性能。
```javascript
const viewMatJsBuffer = new Float32Array(16);
const viewMatGpuBuffer = gpu.createBuffer(
    GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST, // 告诉这块缓冲区的用途：1.用于Uniform变量, 2.可写入
    viewMatJsBuffer // 用viewMatJsBuffer来初始化这块缓冲区
);
```
我们还要定义一个对象用来指定把viewMatGpuBuffer对象跟顶点着色器中的@group(1) @binding(0)对应：
```javascript
const viewMatBindGroup = renderer.createVertexShaderBindGroup(pipeline, 1, [viewMatGpuBuffer]);
```
下面我们将每帧的渲染逻辑写入一个叫loop的自定义函数中，并通过window.requestAnimationFrame方法来实现动画效果。
```javascript
await renderer.init();
let angle = 0; // 保存旋转的角度
function loop() {
    angle += 0.01; // 每一帧角度增加0.01弧度
    // 通过矩阵旋转公式将四面体的x、z坐标进行旋转，y、w坐标不变
    let s = Math.sin(angle), c = Math.cos(angle);
    viewMatJsBuffer.set([
        c, 0, s, 0,
        0, 1, 0, 0,
        -s, 0, c, 0,
        0, 0, 0, 1
    ]);
    // 调用WebGPU API的writeBuffer方法，将Javascript数据写入GPU中的缓冲区
    gpu.device.queue.writeBuffer(viewMatGpuBuffer, 0, viewMatJsBuffer);

    renderer.render(context, (renderState) => {
        renderState.beginTetras(pipeline);
        // 这里我们通过刚才定义的viewMatBindGroup指定着色器中相应数据与GPU缓冲区的绑定关系
        renderState.sliceTetras(viewMatBindGroup, 1);
        renderState.drawTetras();
    });
    // 继续绘制下一帧
    window.requestAnimationFrame(loop);
}
// 开始执行帧循环
loop();
```


