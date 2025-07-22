---
title: 自我描述的代码(in javascript)
tags:
  - 自我描述
  - javascript
  - 递归
date: 2016-05-02 15:06:20
index_img: /img/jsloop.gif
excerpt: 自我描述的代码(Quine)就是程序运行时可以打印自己的源代码。网上有很多C语言、C#版的，我准备写一个javascript版本的。题外话：eval函数/无限递归……
---

　　自我描述的代码(Quine)就是程序运行时可以打印自己的源代码。网上有很多C语言、C#版的，我准备写一个javascript版本的。
## 题外话：eval函数/无限递归
　　javascript是解释型语言，它有一个很牛的函数`eval()`：它能把接受到的字符串当成javascript代码执行。我想出了这段代码：
```javascript
s="eval(s)";eval(s);
```
　　我们可以在任何浏览器上做这个实验：在地址栏输入`javascript:s="eval(s)";eval(s);`即可。（快试试吧。。）
<!--more-->
　　在Chrome控制台运行一会儿后得到这样的报错：<span style="color:#F00">Uncaught RangeError: Maximum call stack size exceeded</span><span style="color:#999">(…)</span>
　　意思是**递归错误，超出堆栈大小**。
<hr/>
　　还有一个很有意思的无限递归实验：在Chrome控制台执行这些语句：
```javascript
A = {};
B = {};
A.a = B;
B.b = A;
```
　　然后输出A，我们得到了一个无限嵌套的东西：

![](/img/jsloop.gif)
　　（其实不是真的无限嵌套，而是两个互指的指针）

## 正题：自我打印的程序
　　我们先看网上流行的C语言版本：
```c
char*s="char*s=%c%s%c;main(){printf(s,34,s,34);}";main(){printf(s,34,s,34);}
```
　　最后的printf函数输出了整个程序的源代码，printf中34是引号 " 的Ascii码，这是为了避免引号中又出现引号无法书写。在格式化输出中巧妙用%s来代表整个字符串是整个自我描述的**核心**：只有这样自己指代自己才能用有限的代码输出自身。
　　参考网上给的C语言版本的写法我有了在javascript语言里写的思路：必须要使用某个方法来代表整个字符串。但js中好像并没有格式化输出的命令，我们必须自己想办法用一个很短的字符串来代表整个字符串。我想到了随便用一个字符（比如“@”）在字符串里起占位作用，然后我们用字符串分组查找功能Split函数把“@”替换成整个字符串输出。所以我们先写一个函数来做这件事：
```javascript
function r(s){
	j = String.fromCharCode(34); //j代表双引号
	k = '@';
	q = s.split(k);
	return q[0]+k+q[1]+j+s+j+q[2] //返回s中@被s替换的字符串，比如"abc@d"变成了"abcabc@dd"
}
```
　　然后我们就要写那个字符串了，那个字符串是什么样子的我们还不知道，先看下一步，也是最后一步——输出字符串：我们用console.log 函数输出最终结果，所以最后有代码`console.log(r(s))`，意思是让替换后的字符串输出。我们的代码现在有：
```javascript
function r(s){
	j = String.fromCharCode(34); 
	k = '@';
	q = s.split(k);
	return q[0]+k+q[1]+j+s+j+q[2]
}
s = .....
console.log(r(s))
```
　　现在我们知道字符串s该等于什么了吧，它就等于上面的所有代码文本（因为我们的目的就是输出所有代码），上面打省略号的地方用“@”占位到时就能描述自身了。于是最终代码如下：
```javascript
function r(s){j=String.fromCharCode(34);k='@';q=s.split(k);return q[0]+k+q[1]+j+s+j+q[2]}s="function r(s){j=String.fromCharCode(34);k='@';q=s.split(k);return q[0]+k+q[1]+j+s+j+q[2]}s=@;console.log(r(s))";console.log(r(s))
```
　　我们追求的是简短，所以没有必要单独搞个函数，这样优化一下我们得到：
```javascript
s="s=@;j=String.fromCharCode(34);k='@';q=s.split(k);z=q[0]+j+s+j+q[1]+k+q[2];console.log(z)";j=String.fromCharCode(34);k='@';q=s.split(k);z=q[0]+j+s+j+q[1]+k+q[2];console.log(z)
```
　　要充分发挥javascript语言的功能使代码更短，我们还能用前面提到过的**eval函数**。我们看到大量代码前后出现了两次——第一次是代码本身，第二次在字符串s里面。我们其实只用写一遍这些字符串内容，一份用eval函数变成代码本身，另一份给字符串s，化简后如下：
```javascript
x="j=String.fromCharCode(34)";y="k='@';q=s.split(k);z='x='+j+x+j+';y='+j+y+j+';eval(x);s='+j+q[0]+k+q[1]+j+q[1];console.log(z);";eval(x);s="s=@;eval(y)";eval(y)
```
　　再优化一下：
```javascript
j=String.fromCharCode(34);y="k='@';q=s.split(k);z='j=String.fromCharCode(34);y='+j+y+j+';s='+j+q[0]+k+q[1]+j+q[1];console.log(z);";s="s=@;eval(y)";eval(y)
```
　　感觉还是不够短。javascript还有一个优势我们没利用上，那就是单双引号的嵌套使用。如果我们用得好就可以不用`String.fromCharCode(34)`这么长的代码来表示引号了。优化结果如下：
```javascript
x="'";v='"';y="k='@';q=s.split(k);z='x='+j+x+j+';v='+x+v+x+';y='+j+y+j+';s='+j+q[0]+k+q[1]+j+q[1];console.log(z);";s="s=@;eval(y);";eval(y);
```
　　我们也不需要专门搞一个符号“@”，就用现成的单引号做标记又能省几个字：
```javascript
x="'";v='"';y="q=s.split(x);z='x='+v+x+v+';v='+x+v+x+';y='+v+y+v+';s='+v+q[0]+x+q[1]+v+q[1];console.log(z);";s="s=';eval(y)";eval(y)
```
　　字符串`s=';eval(y)`中的单引号被`s.split(x)`查找到然后做替换。当然，我们还能用更现成的replace函数来替换字符串。但后来我看到了这个[网站](http://www.nyx.net/~gthompso/quine.htm)上javascript的最短代码后惊呆了：
```javascript
function a(){console.log(a+"a()")}a()
```
　　它的原理很简单：直接console.log输出a这个函数变量，然后javascript会自动把a转换成字符串，这个字符串直接就是函数a的源代码。当然有人说这是作弊的做法。。。其实用eval函数都有作弊之嫌。。。