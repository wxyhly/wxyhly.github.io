---
title: 四维计算机图形学：旋转篇
tags:
  - 四维
  - 数学
  - 几何
  - 图形学
  - 算法
categories: 四维计算机图形学
date: 2024-05-21 21:05:36
---

这次来看看如何实现最基础的坐标变换——旋转，它是渲染建模动画等一切技术的基石。这篇文章相当于一篇关于旋转的算法综述，虽然不需要读者熟悉计算机图形学，但会对数学水平要求稍微高一些，本文主要是罗列陈述算法，因此内容略显枯燥，若读者仅想学习使用这些工具构建四维交互场景，请关注后续的Tesserxel4D场景开发教程。
<div style="float:right">
<img src="/img/so4001.png" style="max-width:200px;" alt="一般使用旋量表示N维空间中的旋转。特别地，3维与4维的旋量代数可以用四元数表示"/>
</div>

## 特色内容
- 三维四元数旋转相关算法
- “几何代数”与“四元数”版四维旋量算法对比
- 各种“lookAt”旋转生成算法
- 四维相机的常见交互控制方式
## 前置知识
<!--more-->我本来打算先讲二维旋转、三维旋转的表示方法再讲到四维，逐渐引入旋转平面、2-向量、几何代数、旋量的，但由于低维旋转方面网上资料很多，且前面我也已经写过关于旋转平面、2-向量、几何代数、旋量的内容了，因此就不想啰嗦了（其实是懒~~），于是我整理了一下需要读者先了解的前置知识，大致知道这些内容后就可再继续阅读：
1. [《四维空间（七）：N维的向量》](/archives/bivector4ds/) 中开头至奇异2-向量小节。
2. [《四维空间（十一）：几何代数、四元数与空间旋转》](/archives/gaqr/) 中开头至四元数与四维空间旋转小节。

## 三维旋转的处理
首先空间中的点与向量都以三个浮点数来储存定义为三维向量类（```class Vec3```），我采用四元数表示三维旋转，因此需要定义个四元数类（```class Quaternion```），最后，矩阵（```class Mat3```、```class Mat4```）作为最经典的图形学工具也是必不可少的。

建议在计算机上采用四元数储存旋转，首先欧拉角有万向锁问题，其次矩阵有16个元素，远多于三维旋转的3个自由度，一是浪费内存，二是不便于纠正浮点数误差累积。若想利用显卡对矩阵乘法的并行优化，可在发送给显卡时再转换为矩阵。
### 基础数学类的运算
我们会定义上面类的成员变量和一些常用方法，下面以三维向量Vec3类为例，它的伪代码大概是这个样子：
```typescript
class Vec3{

    // 成员变量：

    x: number; y: number; z: number;

    // 构造函数：

    constructor(x: number, y: number, z: number){
        this.x = x; this.y = y; this.z = z;
    }

    // 常用方法：

    // 反向
    neg():Vec3{
        return new Vec3(-this.x, -this.y, -this.z);
    }
    // 加法
    add(v3:Vec3):Vec3{
        return new Vec3(this.x + v3.x, this.y + v3.y, this.z + v3.z);
    }
    ...
    // 内积
    dot(v3:Vec3):number{
        return this.x * v3.x + this.y * v3.y + this.z * v3.z;
    }
    ...
}
```
如果你无法理解上述代码，提前学习typescript/javascript、java、C#或C++中某一个语言中关于类(class)的相关概念即可，它们并不复杂。本文采用类似typescript的伪代码来描述算法，即函数参数名冒号后面代表参数类型，函数返回值类型则在参数括号后以冒号标注。

四元数类的定义为：
```typescript
class Quaternion{
    // r代表实数分量，i/j/k分别代表三个虚数前的系数
    r: number; i:number; j: number; k: number;
    ...
}
```
### 旋转坐标与四元数转矩阵
给定一个旋转$R$和一个向量$p$，如何计算旋转后的新向量$R(p)$是最基本的需求，我们将这个函数命名为```apply```。如果旋转用的是矩阵表示，则使用矩阵乘法完成计算：（矩阵与向量的乘法公式是明确的，本文假设读者有能力写出写出该函数的实现细节，故省略之，下同）

```typescript
function apply(R:Mat3, p:Vec3):Vec3{
    return R.mul(p); // mul函数是矩阵与向量的乘法。
}
```


如果旋转用的是四元数表示，则我们采用[这里的旋转坐标算法](/archives/gaqr/#quanternion_as_rotor3)计算：
```typescript
function apply(R:Quaternion, p:Vec3):Vec3{
    let p0 = new Quaternion(0, p.x, p.y, p.z); // 向量转四元数，注意实部为0。
    let p1 = R.mul(p0).mul(R.conj()); // mul、conj函数分别是四元数乘法与共轭。
    return new Vec3(p1.i, pi.j, p1.k); // 四元数转回向量。
}
```
但一般显卡中处理旋转还是用矩阵比较多，如何将四元数表示的旋转转为矩阵表示呢？下面提供两种方法：
1. 硬推公式法：我们将上面算法中的四元数乘法按坐标展开，整理出线性变换的公式，将它写成矩阵即可，建议使用Mathematica等工具推导公式，推导结果可见我的tesserxel库中[Quaternion类的toMat3函数](https://github.com/wxyhly/tesserxel/blob/main/src/math/algebra/quaternion.ts#L170)。
2. 变换基向量法：如果嫌公式推导麻烦，可直接将矩阵按列分块，会发现它是由所有坐标基向量旋转后得到的新向量拼成的。因此我们无需理会四元数如何旋转空间中的点，就能构造出矩阵（注意这些都是是列向量）：

$$M=\begin{pmatrix}R(e_x)&R(e_y)&R(e_z)\end{pmatrix}$$

翻译成伪代码则是：
```javascript
function quaternion2mat3(R:Quaternion):Mat3{
    let ex = apply(R, new Vec3(1, 0, 0));
    let ey = apply(R, new Vec3(0, 1, 0));
    let ez = apply(R, new Vec3(0, 0, 1));
    return new Mat3(
        ex.x, ey.x, ez.x, 
        ex.y, ey.y, ez.y, 
        ex.z, ey.z, ez.z, 
    );
}
```
注意虽然第二种方法看似写出的代码优雅，但效率不如第一种快：基向量中要么是1要么是0，很多乘法与加法都是不必要的，将式子化简后效率更高，但其实就变成第一种方法了。

相反，把矩阵转换为四元数不太容易，我们将在[后面](/archives/so4/#mat32q)解决这个问题。现在有了初步处理旋转的能力，下面先来看怎样生成旋转。
### 旋转的复合与逆
采用欧拉角或其它多步骤复合表示旋转：则使用该算法生成多次旋转的四元数，注意四元数$p$、$q$先后作用到点$x$上为$q(pxp^\*)q^\*=(qp)x(qp)^\*$，相当于四元数$qp$单次作用，因此四元数跟矩阵一样表示复合旋转是直接按从右到左的顺序乘起来。求旋转的逆就更简单了，单位四元数乘以自己的共轭就是1，因此四元数共轭就是逆。

### 轴与角度生成旋转

1. 直接给出旋转的轴与角度：其算法已在[刚才的链接](/archives/gaqr/#quanternion_as_rotor3)中与旋转坐标算法一起给出了，这里放一下伪代码：
```javascript
// 给定单位向量axis表示的旋转轴，与旋转角度angle，生成四元数表示的旋转
function axisAngle2quaternion(axis: Vec3, angle: number): Quaternion{
    angle *= 0.5; // 将角度减半，并计算其正余弦值s与c
    let s = Math.sin(angle);
    let c = Math.cos(angle);
    return new Quaternion(c, s * axis.x, s * axis.y, s * axis.z);
}
```
2. 直接给出旋转生成元2-向量：由于三维的2-向量可以霍奇对偶到普通的1-向量，因此其实这相当于给出了平行于旋转轴的向量，且向量的长度为旋转角度，相当于把旋转的轴与角度两个参数合二为一了，类似于角速度矢量这种东西，这种把大小方向合二为一的表示法又是比第一种更方便。它的算法其实是一样的，只是增加一些步骤：首先计算向量的长度的一半得到半角$\theta = ||l||/2$，然后将向量单位化后就跟第一种方法一样了。我们可进行化简：由于单位化即除以角度$2\theta$，最后四元数的虚部是单位向量乘以半角的正弦值$\sin(\theta)$，把这两步合并即向量乘以$\sin(\theta)/(2\theta)$。显然这个系数在角度接近零时分子分母都接近0，但极限为1/2，这并不是个数值稳定的方法，可以在角度小于$\epsilon$时将表达式用前两项泰勒展开$\(1/2)(1-\theta^2/3!)$来避免。这相当于生成元到旋转的指数映射，因此该函数命名为```exp```。下面给出伪代码：
```javascript
function exp(v: Vec3): Quaternion {
    let theta = v.length() * 0.5; // length函数求向量模长，得到半角
    let epsilon = 0.005;
    // 若角度的绝对值大于epsilon，则直接计算系数s，否则用泰勒展开
    let s:number;
    if (Math.abs(theta) > epsilon) {
        s = Math.sin(theta) / theta * 0.5;
    } else {
        s = 0.5 - theta * theta / 12;
    } 
    return new Quaternion(Math.cos(theta), s * v.x, s * v.y, s * v.z);
}
```
### lookAt生成旋转
仅给出物体的初始朝向与最终朝向，找到符合要求的旋转：比如在一个射击游戏里，大炮需要始终自动对焦到移动的敌机，设大炮的局部坐标系中炮管的方向为$x$轴，则要求一个旋转变换，它能把$x$轴旋转到从炮到敌机连线的方向$v$。几乎所有游戏引擎中都有现成的函数供程序员使用，一般叫“lookAt”函数，下面我们来看如何实现它。
给定两个单位向量$u$与$v$，我们希望构造旋转$R$，使得$R(u)=v$。由于两个向量确定一个平面，最简便的方式就是在$u$-$v$平面中进行旋转，或绕轴$u\times v$旋转，旋转的角度则可以通过计算向量的夹角得到，此时已知转轴和夹角，使用前面的算法就能生成旋转了：
```typescript
function lookAt(u:Vec3, v:Vec3):Quaternion{
    let axis = u.cross(v); // 通过向量叉乘函数cross计算旋转轴
    let e_axis = axis.normalize(); // normalize函数将转轴缩放为单位向量
    let angle = Math.acos(u.dot(v)); // 内积dot函数求夹角余弦，反余弦函数Math.acos求角度
    return axisAngle2quaternion(e_axis, angle); // 已知转轴和夹角，使用前面的算法生成旋转
}
```
其实上面的代码漏掉了一个特殊情况：若$u$与$v$方向相同或相反，叉乘得到的轴为$0$，这些特殊情况的处理留作习题。
注意，满足$R(u)=v$的旋转$R$是不唯一的：$R$上再任意复合一个以$v$为轴的旋转也符合要求。上面算法求得的旋转在某种意义下是“距离”最近的旋转，但有时候会像下图那样出现不好的“倾斜”感，比如摄像机运镜时可能就希望画面不要左右倾斜，我们马上来解决这个问题。![将蓝色方向对齐的“最短”旋转路径会让绿色水平轴不再水平](/img/so4001.gif)

给出物体的初始朝向与最终朝向，与物体的上方，找到保持物体不侧倾的旋转。方法有两种，一是将旋转拆成水平与垂直的两步可以避免物体侧倾，二是可以先用```lookAt```函数旋转到位后，再叠加一个以目标为轴的旋转纠正倾斜。这两种方法其实都相当于欧拉角，只是旋转的次序存在差异，具体代码实现留作习题。![避免绿轴“侧倾”的旋转生成方法之一](/img/so4002.gif)
<a name="mat32q"></a>

### 旋转矩阵转四元数
前面说过旋转矩阵的自由度超过了旋转的自由度，数值误差导致不一定是精确的旋转矩阵，因此很可能问题没有解，但有了“lookAt”函数，我们就可以通过类似“Schmidt正交化”的方式来逐步逼近得到四元数：旋转矩阵按列分块后能够告诉我们原来的各坐标轴旋转到的新位置，因此可先使用```lookAt```函数生成对齐x轴前后位置的旋转```r1```，此时y轴与z轴还没对齐，然后再来一次lookAt对齐y轴，剩下的z轴就自动对齐了，将两次lookAt得到的四元数乘起来就得到了最终的转换结果。
```typescript
function mat32quaternion(m:mat3): Quaternion{
    // 第一次旋转：对齐x轴
    let r1 = lookAt(new Vec3(1, 0, 0), m.x_()); // x_函数返回矩阵m的第一个列向量
    // 第二次旋转：对齐y轴
    let newY = apply(r1, new Vec3(0, 1, 0)); // 注意y轴已经被r1旋转到了newY
    let r2 = lookAt(newY, m.y_()); // y_函数返回矩阵m的第二个列向量
    return r2.mul(r1); // 将两步旋转复合
}
```
### 已知旋转找转轴与角度
有些时候会遇到旋转的生成的逆问题：给定旋转找出它的生成元，由于生成元生成旋转是指数映射```exp```，因此这个函数叫它对数映射```log```。求逆映射并不难，很容易通过四元数实部值求出半角的余弦，下面是伪代码：
```typescript
log(R: quaternion): Vec3 {
    let theta = Math.acos(R.r); // 通过四元数实部求半角
    let s = 2 * theta / Math.sin(theta); // 恢复旋转轴，再乘上角度值
    return new Vec3(R.i * s, R.j * s, R.k * s);
}
```
### 旋转的插值
在动画制作中常会遇到已知物体始末初始状态，需补出中间帧以实现动画效果。若已知$0$时刻的旋转对应四元数$R_a$，$1$时刻对应四元数$R_b$，求时刻$t$的旋转对应的四元数$R_t$。旋转是由单位四元数表示的，相当于在超球面$S^3$上插值，算法可参考[这里](https://zhuanlan.zhihu.com/p/538653027)，代码见[这里的slerp函数](https://github.com/wxyhly/tesserxel/blob/main/src/math/algebra/quaternion.ts#L134)。
### 数值稳定性
在对场景的计算中，随着三维物体的不断旋转，四元数一直在做连乘，这是数值不稳定的，因为只要有点误差，四元数的模长不为1，就会导致一段时间后要么衰减至零或发散至无穷。解决该问题的方法很简单，隔一段时间（如刷新每一帧时）强行把四元数除以它的长度单位化即可。
## 四维旋转的处理
计算机表示四维空间中的点、向量跟三维向量是大同小异的，比如有四维向量类（```class Vec4```），和矩阵（```class Mat4```），甚至你可以定义仿射矩阵（```class Mat5```）。四维旋转同样不建议用矩阵表示，它采用旋量（Rotor）表示旋转，且旋量还分四元数与几何代数两种版本。无论用哪个版本，都会用到表示平面的2-向量（```class Bivec```），我们先来看它的定义。
### 2-向量类

四维空间的2-向量则用六个浮点数来储存，定义为2-向量类（class Bivec4）。由于我不打算开发通用的高维图形库，因此不会出现Bivec5、Bivec6……又由于霍奇对偶，三维中的Bivec3其实就是Vec3、因此也就只有Bivec4才有用，于是我把Bivec4简写为Bivec不会有歧义。它的伪代码定义如下：
```
class Bivec{
    xy: number; xz:number; xw: number;
    yz: number; yw:number; zw: number;
}
```
其实它很像一个6维的向量，比如可以定义加法(add)、减法(sub)、取反(neg)、数乘(mul)、内积(dot)、单位化(normalize)等方法。同时，我们添加一些2-向量独有的方法，比如霍奇对偶(dual)、混合积（也叫交换积）(cross)，并给四维向量类添加楔积运算(wedge)得以生成2-向量等。

### 四维旋量

四维旋量分两种表示法：一是四元数版的旋量（```class Rotorq```），二是几何代数版的旋量（```class Rotorg```），其中几何代数版最原始且易懂，而四元数版处理旋转算法更多更方便。由于几乎没人会直接输入旋量的各分量来描述旋转，它们仅为程序内部的中间数据，所以搭建渲染引擎时一般仅选其一，比如[Marc ten Bosch的四维引擎](https://marctenbosch.com/ndphysics/)就仅支持几何代数版本的旋量，而[我的tesserxel引擎](https://github.com/wxyhly/tesserxel/)就只支持四元数版本的旋量而不支持几何代数版的，下面我把这两种版本旋量各自的相关旋转算法分为两节进行罗列，请**按需展开阅读**：

<br/>

### <a href="javascript:void(0);" onclick="$('#ga').toggle();$('#ga_').text($('#ga_').text()==='+'?'-':'+')"><span id="ga_">+</span>旋量类（几何代数版）</a>

<div style="background-color: #FFF3F3; display:none" id="ga">

由[这里的介绍](/archives/gaqr/#def_spinor)可知，旋量是几何代数中偶数阶向量组成的子代数，因此对于四维空间，它由标量```r```(0-向量)、2-向量```b```与伪标量```i```(4-向量)三部分组成，于是可以这样定义旋量类：
```
class Rotorg{
    r: number; b: Bivec, i: number;
}
```
除此之外，我们定义旋量之间的加减法、数乘、单位化、共轭与几何积等。注意可以利用2-向量定义好的函数简化某些工作，比如2-向量乘以伪标量等于2-向量取霍奇对偶后乘以标量等等。
#### 旋转坐标算法
给定旋量$R$，它作用在坐标$p$上后$R(p)$的坐标为$RpR^\dagger$，即
```typescript
function apply(R:Rotorg, p:Vec4){
    return R.mul(p).mul(R.conj()); // 如何定义这里的mul函数？
}
```
可惜这样写会导致一个问题：由偶数阶k-向量组成的旋量乘上向量会产生1-向量或3-向量，这并不在旋量（class Rotorg）的定义中，因此我们无法写出mul函数的实现。有两个解决思路：一是写一个几何代数类(class GA)，它包含从0至4阶所有向量，二是直接将公式按坐标展开，把化简结果放在apply函数中。我推荐第二种方法，因为第一种方法包含所有阶数向量分量在大多数时候用不上，会浪费计算步骤与内存空间，第二种则没有这些问题且化简公式后性能最优。

#### 旋转的复合与逆
与四元数一样，四维旋量的复合就是按从右到左的顺序做几何积，求逆对应几何代数里的共轭：几何代数里的共轭是将所有k-向量的顺序反着写，比如$(e_xe_y)^\dagger=e_ye_x=-e_xe_y$，$(e_xe_ye_ze_w)^\dagger=e_we_ze_ye_x=e_xe_ye_ze_w$，对应到四维旋量其实就是将2-向量部分取反，标量和伪标量部分均不变。
#### 旋转平面算法
四维比三维多一种情况，即旋转可以通过作用张成2-向量的两个基向量上来作用到2-向量（平面）上对其旋转，即定义$R(a\wedge b) = R(a)\wedge R(b)$，最朴素的方法是写出2-向量的六个坐标基底$e_ie_j$，计算旋转$R$作用后的新2-向量基底$R(e_i)\wedge R(e_j)$，将2-向量视为六维线性空间，这样就得到了一个6x6的旋转2-向量的矩阵。其实几何代数还有个更好的方法，设$a$与$b$垂直，注意到$$R(a)\wedge R(b)=R(a)R(b)=(RaR^\dagger) (RbR^\dagger) = Ra(R^\dagger R)bR^\dagger=R a b R^\dagger$$
因此可以直接两边做几何积。又由于所有2-向量都能分解为正交的坐标基向量楔积之和，所以这个算法对任意2-向量均成立：
```typescript
function apply(r:Rotorg, b:Bivec){
    return r.mul(b).mul(r.conj());
}
```

#### 平面与角度生成旋转
跟三维的旋转生成需求类似但有些不同：
1. 给定旋转平面$B$与角度$\alpha$生成旋转：注意旋转平面只能用2-向量表示，它可能是对应简单旋转的简单2-向量，也可能是对应双旋转的复合（奇异）2-向量。我们先考虑简单旋转，因为[这里的算法](/archives/gaqr/#formula_spinor_rotate)必须假设2-向量$B$是简单且单位化的，才能得到旋转公式：$R=\cos(\alpha/2)+B\sin(\alpha/2)$，这跟三维旋转的四元数公式可以说几乎一样。下面是伪代码：
```javascript
// 给定简单单位2-向量plane表示的旋转平面，与旋转角度angle，生成旋量表示的旋转
function planeAngle2rotorg(plane: Bivec, angle: number): Quaternion{
    angle *= 0.5; // 将角度减半，并计算其正余弦值s与c
    let s = Math.sin(angle);
    let c = Math.cos(angle);
    return new Rotorg(
        c,            // 标量部分
        plane.mul(s), // 2-向量部分，mul函数为2-向量的数乘
        0             // 无伪标量分量
    );
}
```
注意简单旋转是不含伪标量分量的，因此上面最后构造```Rotorg```时最后参数是0，但简单旋转的复合可能得到双旋转，此时伪标量分量不再为0。
2. 直接给出旋转生成元2-向量：此时我们不再要求2-向量是简单的、单位化的，然而对于一般的2-向量，指数映射公式并不好化简，要么按定义$$R=\exp(B\theta/2)=I+B\theta/2+{B^2(\theta/2)^2\over2!}+{B^3(\theta/2)^3\over3!}+..$$计算，但这是个无穷级数，只能算前$n$项将其截断；要么将它分解为简单2-向量计算，[这里给出了一个分解算法](/archives/bivector4ds/#orth)，但相当麻烦，后面我们将看到，用四元数表示的旋量版本不会存在这些问题，故tesserxel选用四元数表示四维旋量。<a name="lookat"></a>

#### lookAt生成旋转
1. 仅给出物体的初始朝向与最终朝向，找到符合要求的旋转，即四维版本的```lookAt```函数：只要把叉乘换成它的推广楔积即可。
```typescript
function lookAt(u:Vec4, v:Vec4):Rotorg{
    let plane = u.wedge(v); // 通过向量楔积函数wedge计算旋转平面2-向量
    let e_plane = plane.normalize(); // normalize函数将其缩放为单位2-向量
    let angle = Math.acos(u.dot(v)); // 内积dot函数求夹角余弦，反余弦函数Math.acos求角度
    return planeAngle2rotorg(e_plane, angle); // 已知旋转平面和夹角，使用前面的算法生成旋转
}
```
与三维情况类似，若u与v方向相同或相反，楔积得到的平面也为0，这些特殊情况的处理同样留作习题。

2. 通过lookAt函数旋转四维相机同样会有水平倾斜的问题，此时亦可采用两种方法解决：一是先做水平旋转，再做垂直旋转，二是先用lookAt函数旋转到位后再去对齐其它轴。到了四维，由于轴数增多，第二种方法其实比较困难，故推荐第一种：设竖直方向为$y$轴，则水平胞为三维子空间$xzw$。第一次旋转我们只在子空间$xzw$中通过lookAt函数对齐初始向量与目标向量在其中的投影，第二次旋转则再次用lookAt仅在竖直平面中旋转。
#### 旋转矩阵转旋量
与三维情形类似，可先使用```lookAt```函数生成对齐x轴前后位置的旋转```r1```，此时y、z、w轴还没对齐，然后来一次```lookAt```对齐y轴，剩下的z轴、w轴还没对齐，最后再来一次```lookAt```对齐z轴此时w轴就自动对齐了，将三次```lookAt```得到的旋量按几何积乘起来就得到了最终的转换结果。
#### 已知旋转找平面与角度
与三维情况类似，通过求指数映射的逆可解得旋转平面与角度：
$$B=\log(R)=(R-I)-(R-I)^2/2+(R-I)^3/3-..$$
注意得到的2-向量若是简单的，则它的模长就是旋转角度，若它是复合（奇异）的，则需要通过[此算法](/archives/bivector4ds/#orth)分解后才知道具体的双旋转的两个旋转平面与角度。若不想用泰勒级数展开，后面的四元数版旋量给了一个<a href='javascript:void(0);' onclick='if($("#qt_").text()=="+"){$("#qt").show();$("#qt_").text("-");}window.location.href="#rotorq_log";'>更好的算法</a>。
#### 旋转的插值
对旋量进行插值并不方便，因为它的拓扑空间不再是一个高维球面。我们可以通过取对数操作先求得生成元，生成元做完线性插值缩放后重新再做指数映射：设$0$时刻的旋转对应四元数$R_a$，$1$时刻对应四元数$R_b$，则时刻$t$的旋转对应的四元数$R_t=\exp(t\log(R_bR_a^{-1}))R_a$。说明一下，该方法是通用的，它对三维空间旋转也适用。
### 数值稳定性
在对场景的计算中，随着四维物体的不断旋转，旋量一直在做连乘，也会产生数值不稳定问题。然而将几何代数版的旋量做单位化并没有简单的算法。[Marc ten bosch的这篇论文中](https://marctenbosch.com/ndphysics/)提到，他将旋量进行“因式分解”后再对每部分单位化，具体算法仅给出了一个参考文献书籍，但我没找到免费的全文阅读，可能类似于四元数版旋量。</div>
<br>

### <a href="javascript:void(0);" onclick="$('#qt').toggle();$('#qt_').text($('#qt_').text()==='+'?'-':'+')"><span id="qt_">+</span>旋量类（四元数版）</a>

<div style="background-color: #F3FFF3; display:none" id="qt">

首先明确一下什么是四元数版的旋量。旋量的定义其实只有几何代数那一种，之所以有所谓“几何代数版”、“四元数版”可以理解为选择的表示方法不一样，就像不同的坐标系那样。几何代数版旋量直接在直角坐标系中展开所有分量，而四元数版的旋量则是将旋量因式分解为左、右等角旋转两部分，其中每个部分都类似于一个三维空间中的旋转，所以用两个四元数表示。但注意不管是哪种表示法，旋量的特殊“二对一”的性质始终是不变的，举个例子：$xy$平面旋转90度，有以下两种拆分方式：
1. “$xy$旋转45度与$zw$旋转45度右等角双旋转”复合“$xy$旋转45度与$zw$旋转-45度左等角双旋转”
2. “$xy$旋转-135度与$zw$旋转-135度右等角双旋转”复合“$xy$旋转-135度与$zw$旋转135度左等角双旋转”

再举个极端的例子，$xy$与$zw$平面均旋转180度，它是唯一没有手性的双旋转——中心反演变换，把它视为左手/右手等角双旋转就对应着两种旋量表示：
1. “$xy$旋转180度与$zw$旋转180度右等角双旋转”复合“$xy$旋转0度与$zw$旋转-0度左等角双旋转”
2. “$xy$旋转0度与$zw$旋转0度右等角双旋转”复合“$xy$旋转180度与$zw$旋转-180度左等角双旋转”

定义四元数版旋量类的伪代码很简单，它包含左/右两个四元数：
```typescript
class Rotorq{
    l: Quaternion; r: Quaternion;
}
```
我们无需为```Rotorq```定义加法与数乘运算，不像几何代数既表示2-向量又表示旋转，这里的四元数版旋量无法表示线性的2-向量，加法与数乘是无意义的，后面我们仅定义乘法与逆。
#### 旋转坐标算法
三维空间中，需把空间向量$v=(x,y,z)$映射到四元数纯虚数$V=ix+jy+kz$，四维空间则直接是坐标一一对应，将空间向量$v=(x,y,z,w)$直接映射到四元数$V=x+iy+jz+kw$。给定旋量$R$，由于左等角（生成元自对偶）对应左乘，右等角（生成元反自对偶）对应右乘，因此记它的左等角旋转的四元数为$R_l$，右等角旋转的四元数为$R_r$，它作用在坐标$p$上后$R(p)$的坐标计算公式为$R_lpR_r$，即
```typescript
function apply(R:Rotorq, p:Vec4){
  let P = new Quaternion(p); // 将向量p转四元数P
    return new Vec4(R.l.mul(P).mul(R.r)); // 将计算后的四元数转回向量
}
```
#### 旋转平面算法
使用四元数表示的旋量作用于2-向量（平面）上也有更直接的算法，而无需使用2-向量的6维线性空间中的6阶矩阵。我们将2-向量$B$分解为自对偶与反自对偶部分：$B=B_a+B_b=(B+B^*)/2+(B-B^*)/2$，它们可按照以下方式同构于三维向量，比如自对偶部分：
$(x_a,y_a,z_a)$对应$B_a = x_a (e_{xy}+e_{zw}) + y_a (e_{xz}-e_{yw}) + z_a (e_{xw}+e_{yz})$
反自对偶部分：
$(x_b,y_b,z_b)$对应$B_b = x_b (e_{xy}-e_{zw}) + y_b (e_{xz}+e_{yw}) + z_b (e_{xw}-e_{yz})$

左/右等角旋转则同构于（严格说是二对一的同态）三维向量的普通三维旋转，因此我们可以使用左右四元数来旋转这两部分向量，最后再将2-向量恢复到普通的直角坐标系表示。注意虽然这些左右等角旋转空间跟三维空间局部同构，但四元数上的同构映射不一定是恒等映射，共轭也是同构映射，代入具体算例可以发现右乘的右等角旋转需要取共轭。注：左乘不取共轭而右乘取共轭的深层原因其实是一般旋转的复合都是左乘，同态映射到右乘当然要逆一下顺序才一致）
```typescript
function apply(r: Rotorq, b: Bivec): Bivec {
    // 计算2-向量的自对偶与反自对偶部分
    let A = new Vec3(this.xy + this.zw, this.xz - this.yw, this.xw + this.yz);
    let B = new Vec3(this.xy - this.zw, this.xz + this.yw, this.xw - this.yz);
    // 左等角旋转旋转对偶分量
    A = apply(r.l, A);
    // 右等角旋转旋转反对偶分量，注意该同构差一个共轭映射
    B = apply(r.r.conj(), B);
    // 从对偶分解表示法中恢复至普通直角坐标表示旋转后的2-向量
    return new Bivec(
        A.x + B.x, A.y + B.y, A.z + B.z, A.z - B.z, B.y - A.y, A.x - B.x
    ).mul(0.5);
}
```

#### 旋转的复合与逆
由于四元数版的旋量有两部分，复合时两部分要分别做复合，且要注意旋转顺序，比如旋转R1再旋转R2：$$R_{2l}(R_{1l}pR_{1r})R_{2r}=(R_{2l}R_{1l})p(R_{1r}R_{2r})$$即新的$R_l=R_{2l}R_{1l}$，$R_r=R_{1r}R_{2r}$。于是我们定义旋量的乘法：
```typescript
// 旋转R1再旋转R2定义为r2乘r1:
mul(r2:Rotorq, r1:Rotorq){
    return new Rotorq(r2.l.mul(r1.l), r1.r.mul(r2.r));
}
```
旋量的逆则是将左右四元数分别取逆，即共轭：
```typescript
// 求旋量r的逆
inverse(r:Rotorq){
    return new Rotorq(r.l.conj(), r.r.conj());
}
```

#### 平面与角度生成旋转
由于左右等角旋转完全不互相干扰，我们可将生成元2-向量分解为自对偶向量与反自对偶向量，由于左右等角旋转的结构类似三维旋转，因此可套用三维空间的旋转生成四元数的公式：
```typescript
exp(p:Bivec): Rotorq {
    // A 为 p的自对偶部分，B 为反自对偶部分
    let A = new Vec3(p.xy + p.zw, p.xz - p.yw, p.xw + p.yz).mul(0.5);
    let B = new Vec3(p.xy - p.zw, p.xz + p.yw, p.xw - p.yz).mul(0.5);
    // a与b为自对偶/反自对偶2-向量的模长
    let a = A.norm(); let b = B.norm();
    // 按三维2-向量生成四元数的公式分别计算左右等角两部分四元数
    // 注意由于算对偶分解时已经将向量长度除以2，因此这里的四元数旋转角度不再需除以2
    let sa = Math.sin(a) / a;
    let sb = Math.sin(b) / b;
    return new Rotorq(
        new Quaternion(Math.cos(aa), sa * A.x, sa * A.y, sa * A.z),
        new Quaternion(Math.cos(bb), sb * B.x, sb * B.y, sb * B.z)
    );
}
```
#### lookAt生成旋转
用于给定始末向量的lookAt生成旋转的算法其实并不依赖具体使用的是哪种旋量的表示法，请参考<a href='javascript:void(0);' onclick='if($("#qa_").text()=="+"){$("#ga").show();$("#ga_").text("-");}window.location.href="#lookat";'>几何代数版旋量小节中的lookAt算法</a>
其实四维空间除了通过旋转让向量对齐向量，还会有向量对齐平面、平面对齐平面两种新需求。
1. 向量对齐平面：给定向量$v$与简单的单位化的2-向量表示的平面$B$，求将$v$旋转至平面$B$中的距离最近的旋转。我们可通过几何积的技巧找到向量$v$在平面$B$上的投影，然后使用普通向量至向量的lookAt函数将$v$旋转至投影即符合要求：向量与2-向量可以规定一种部分的内积，定义为它们的几何积的1-向量部分，容易验证若它们都是单位化的，则向量与2-向量内积后得到的新向量为该向量在平面上的投影顺着平面的涡漩方向旋转90度的新向量，我们可以将新向量再与平面做一次内积，此时得到与投影反向的向量，再求内积即得投影。于是定义投影函数与lookAt函数如下：
```typescript
function project(v:Vec4,b:Bivec):Vec4{
    // dot函数为向量与2-向量的内积，neg函数将向量取反
    return v.dot(b).dot(b).neg();
}
function lookAt(v:Vec4,b:Bivec):Rotorq{
    // 求得投影并将其单位化
    let pv = project(v,b).normalize();
    return lookAt(v, pv);
}
```
注：以上算法对两种版本旋量均可用。

2. 平面对齐平面：给定两个简单的单位化的2-向量表示的平面$A$与$B$，求将$A$旋转至与$B$重合的距离最近的旋转。虽然也可以在平面上选取两个向量投影到另一张平面上，用多次向量至向量lookAt方法处理，但平面上方向很多，选取方向就是个麻烦问题，更别说还要处理各种垂直、反向等特殊情况。我找到了一个仅适用于四元数版本旋量的精妙算法：因此我们可以将2-向量做对偶分解，这个旋转的左等角旋转会将两个2-向量的自对偶部分对齐，而右等角旋转则将反自对偶部分对齐。由于自对偶/反自对偶2-向量同构于三维空间，我们可以使用三维空间的向量至向量的lookAt函数来实现对齐，代码如下：
```typescript
function lookAt(A: Bivec, B: Bivec): Rotorq {
    let Aa = new Vec3(A.xy + A.zw, A.xz - A.yw, A.xw + A.yz);
    let Ab = new Vec3(A.xy - A.zw, A.xz + A.yw, A.xw - A.yz);
    let Ba = new Vec3(B.xy + B.zw, B.xz - B.yw, B.xw + B.yz);
    let Bb = new Vec3(B.xy - B.zw, B.xz + B.yw, B.xw - B.yz);
    // 注意这里lookAt是前面定义过的三维向量至向量的，此处为重载而非递归调用自身
    return new Rotorq(lookAt(Aa, Ba), lookAt(Bb, Ab));
}
```
注意虽然这些左右等角旋转空间跟三维空间局部同构，但由于同样的原因，右乘的右等角分量的四元数变换需要取共轭（即旋转的逆），因此最后返回的第二个参数为```lookAt(Bb, Ab)```而不是```lookAt(Ab, Bb)```。
#### 旋转矩阵转旋量
多次使用lookAt函数实现，方法完全与几何代数版旋量一样，请参考<a href='javascript:void(0);' onclick='if($("#ga_").text()=="+"){$("#ga").show();$("#ga_").text("-");}window.location.href="#lookat";'>这里</a>。<a name="rotorq_log"></a>
#### 已知旋转找平面与角度
除了使用对数映射的泰勒展开，四元数的版本还有更方便的做法：由于旋量由两个四元数表示的等角旋转组成，我们可以使用这里的三维旋转找生成元的方法得到相应的自对偶与反自对偶2-向量，最后再合成恢复出整个2-向量：
```typescript
function log(r: Rotorq): Bivec {
    // 计算log(r.l)，由于这里只是一半的旋转，故恢复角度无需乘2
    // 因此这里无法直接调用前面三维空间中对四元数的对数函数
    let ls = Math.acos(r.l.x);
    let a = new Vec3(r.l.y, r.l.z, r.l.w).mul(ls / Math.sin(ls));
    // 计算log(r.r)，方法同上
    let rs = Math.acos(r.r.x);
    let b = new Vec3(r.r.y, r.r.z, r.r.w).mul(rs / Math.sin(rs));
    // 将左右两半的生成元合并，转换至普通直角坐标表示
    return new Bivec(
        a.x + b.x, a.y + b.y, a.z + b.z, a.z - b.z, b.y - a.y, a.x - b.x
    );
}
```
</div>

<br/>

## 随机方向/旋转的生成
### 随机单位向量的生成
随机单位向量的生成问题其实等价于在球面上生成均匀分布的点。这个问题在数学上已经研究得十分透彻了：首先直接均匀生成一段区间上的随机数，再根据坐标映射的“伸缩”系数通过一个非线性函数映射到球坐标上的经纬度值。下面直接列出伪代码：
```typescript
function randVec3(){
    let a = Math.random() * 2.0 * Math.PI;
    let c = Math.random() * 2.0 - 1.0;
    let b = Math.sqrt(1.0 - c * c);
    return new Vec3(b * Math.cos(a), b * Math.sin(a), c);
}
function randVec4(){
    let a = Math.random() * 2.0 * Math.PI;
    let b = Math.random() * 2.0 * Math.PI;
    let c = Math.random();
    let sc = Math.sqrt(c);
    let cc = Math.sqrt(1.0 - c);
    return new Vec4(sc * Math.cos(a), sc * Math.sin(a), cc * Math.cos(b), cc * Math.sin(b));
}
```
顺便提一句，这两个函数在[上一篇文章](/archives/cg4d/)提到的路径追踪算法生成照片级渲染中大有用处。<a name="randrotor"></a>
### 随机旋转的生成
由于三维旋转可以由同构于超球面的单位四元数表示，因此可以使用前面生成四维随机单位向量的算法生成四元数。若采用四元数版本的旋量，则四维旋转由左、右两个四元数表示，随机生成两个超球上的两个点即可；若采用几何代数版本的旋量，我目前还不知道有很方便的生成算法。
```typescript
function randQuaternion():Quaternion{
    return new Quaternion(randVec4());
}
function randRotorq():Rotorq{
    return new Rotorq(randQuaternion(), randQuaternion());
}
```
<a name="randsimplbiv"></a>

### 随机简单旋转的生成
上面的随机旋转算法生成的朝向是任意的，如果要求必须生成简单旋转则必须先生成随机朝向的简单单位2-向量，再随机生成一个角度来实现。最简单生成随机朝向的简单单位2-向量的做法为先生成两个随机向量，通过楔积张成2-向量将它单位化即可。其实还有一种更快捷的生成方法：简单2-向量的自对偶与反自对偶部分大小相等，因此它们的长度都是$\sqrt 2/2$。而每个部分都相当于一个二维球面，因此可以用过随机生成二维球面上的点来生成这些单位自对偶/反自对偶2-向量，将它们乘以$\sqrt 2/2$加在一起就得到了单位化的简单2-向量。

## 四维相机的常见控制方式
### 轨道球（TrackBall）控制模式
该模式类似一般3D软件中的视图旋转，对应到四维则类似Jenn3D的操作方式。该控制器存储一个旋转中心点和距离，再加一个相机朝向的旋量，该模式中相机始终面对中心点，设相机坐标系下前方为w轴，则可按以下方式更新它的位置：
```typescript
class TrackBallController{
    // 旋转中心坐标
    center: Vec4;
    // 相机距中心的距离
    distance: number;
    // 相机朝向
    rotor: Rotorq;
    update(camera: Object4D){
        // 更新相机旋转
        camera.rotation = this.rotor;
        // 初始位置设为相机前方给定长度的向量，通过相机朝向求出相机相对中心的位置，最后叠加上中心
        camera.position = center.add(apply(this.rotor,new Vec4(0,0,0,distance)));
    }
}
```
用户使用键鼠交互更新距离与旋量，比如鼠标左键在屏幕上上下左右拖拽时在每帧的移动量被转换成一个在相机坐标系下仅有yw和xw分量的2-向量$B$，它生成的旋转$V'=\exp(B)$首先变换至世界坐标$V$，即$V=RV'R^{-1}$，然后再叠加到目前相机的朝向$R$上得到总旋转$VR = RV'R^{-1}R=RV'=R\exp(B)$，这可以总结为若后面叠加的旋转是在旋转物体的局部坐标系中表示的就用右乘，若都是同样的全局坐标系则使用通常的左乘。伪代码如下：
```typescript
class TrackBallController{
    ...
    onLeftButtonDrag(dx:number, dy:number){
        // 根据鼠标移动距离生成2-向量 dx*exw + dy * eyw
        let localBivec = new Bivec(0, 0, dx, 0, dy, 0);
        // 生成旋转R
        let localRotation = exp(localBivec);
        // 将其转换至世界坐标系，叠加旋转后更新新的相机朝向，注意叠加的旋转在局部坐标，乘法顺序颠倒
        this.rotor = localRotation.mul(this.rotor);
    }
}
```
### 自由飞行（FreeFly）控制模式
该模式一般模拟无重力下的第一人称游走，它不用单独储存信息，直接读取相机的位置与朝向来根据用户的键鼠输入更新即可，需注意用户的旋转平移都应在相机的局部坐标系中定义再转换至世界坐标，这里不再给出伪代码。
### 保持竖直（KeepUp）模式
该模式一般模拟在重力环境下的第一人称游走，要求相机的侧前后方与左右方张成的平面始终保持在水平胞中不倾斜。有两种方法，第一种是使用类似欧拉角的技术，用两个旋量分别储存水平旋转与垂直旋转，第二种则是在每次旋转后纠偏。实际使用中我发现第二种方法稳定性差一些，因此tesserxel引擎中采用第一种方式。该旋转的自由度仅为4，它由水平胞内的三维自由旋转加一个垂直方向的俯仰角构成，因此我们用一个旋量与一个俯仰角来储存旋转，我采用的是鼠标拖拽控制水平胞内的旋转，使用滚轮控制俯仰角。最后每帧按下面方式更新相机朝向:
```typescript
class KeepUpController{
    // 水平方向的朝向由一个旋量表示
    rotorH: Rotorq;
    // 垂直方向的俯仰角由一个标量数字表示
    rotorV: number;
    update(camera: Object4D){
        // 计算仅考虑水平胞旋转的相机局部坐标系中产生俯仰角的垂直旋转，它由yw平面上的2-向量生成
        let verticalRotation = planeAngle2rotorq(new Bivec(0,0,0,0,1,0), this.rotorV);
        // 本来该按水平旋转再垂直旋转的顺序合成最终旋转，但叠加的旋转在局部坐标，乘法顺序颠倒
        camera.rotation = rotorH.mul(this.verticalRotation);
    }
}
```
控制相机移动可以有两种模式，一是飞行模式，即在旋转时除了使用上述方法保持水平胞不倾斜外，其余的体验跟自由飞行模式相当，即若相机有俯仰角时，前进后退会让相机高度随之改变，二是地面漫游模式，这种模式下相机的前进后退不会考虑俯仰角，始终在地平面内运动（比如Minecraft在地面行走的玩家），并额外增加直接控制竖直升降相机的键盘交互。