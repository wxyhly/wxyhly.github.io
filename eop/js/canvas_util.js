$ = function (obj){
	return document.getElementById(obj);
}
ctxt$ = function (obj){
	return $(obj).getContext("2d");
}
loop$ = function (call){
	window.requestAnimationFrame(call);
}
saveImg = function (canvas, url){
	var txt = $(canvas).toDataURL("image/png").replace(/data:image\/png;base64,/,'');
	var xmlr = new XMLHttpRequest();
	xmlr.open("Post","/api/canvas_util/saveImg",true);
	xmlr.send(txt);
}
writeData = function (ImageData, x, y, _color, alpha){
	if(x>=ImageData.width||y>=ImageData.heigth||x<0||y<0)return 0;
	var te = (ImageData.width * y + x) << 2;
	ImageData.data[te] = _color >> 16;
	ImageData.data[te + 1] = _color >> 8 & 0xFF;
	ImageData.data[te + 2] = _color & 0xFF;
	ImageData.data[te + 3] = (alpha) ? alpha : 0xFF;
}
readData = function (ImageData, x, y, antiAliasing){
	if(x>=ImageData.width||y>=ImageData.heigth||x<0||y<0)return 0;
	if(antiAliasing){
		var P = Math.floor(x);
		var Q = Math.floor(y);
		if(P>=ImageData.width||Q>=ImageData.heigth||Q<0||P<0)return 0;
		var data1 = Number.toRGB(readData(ImageData,P,Q));
		var data2 = Number.toRGB(readData(ImageData,P+1,Q));
		var data3 = Number.toRGB(readData(ImageData,P,Q+1));
		var data4 = Number.toRGB(readData(ImageData,P+1,Q+1));
		var m = x-P;var n = y-Q;
		return ((data1[0]*(1-m)*(1-n)+data2[0]*m*(1-n)+data3[0]*(1-m)*n+data4[0]*m*n)<<16)+
				((data1[1]*(1-m)*(1-n)+data2[1]*m*(1-n)+data3[1]*(1-m)*n+data4[1]*m*n)<<8)+
				data1[2]*(1-m)*(1-n)+data2[2]*m*(1-n)+data3[2]*(1-m)*n+data4[2]*m*n;
	}
	var te = (ImageData.width * y + x) << 2;
	return (ImageData.data[te] << 16) +
		(ImageData.data[te + 1] << 8)+
		ImageData.data[te + 2];
}
Number.toRGB = function (n){
	return [n>> 16,n>> 8 & 0xFF,n & 0xFF];
}
/***

DEFINE VECTORS AND BIVECTORS
(if parameter flag is false then create new instance, otherwise modify itself.)
***/
p = function(x,y){
	return new vec2(x,y);
}
v = function(args){
	switch(args.length){
		case 1: return args;
		case 2: return p(args[0],args[1]);
		case 3: return new vec3(args[0],args[1],args[2]);
	}
	return 0;
}
vec2 = function(x,y){
	this.x = x;
	this.y = y ? y :0;
}
vec3 = function(x,y,z){
	this.x = x;
	this.y = y;
	this.z = z;
}
/***
2-element
	add
	sub
	mul(between two vectors regard as complex numbers)
	div(between two vectors regard as complex numbers)
	dot
	cross
1-element
	len (abs) (if flag is false, return len^2)
	norm (normalize)
	clone
***/
vec2.prototype.add = function (v2,flag){
	if(typeof v2 =="number")v2 = p(v2);
	if(flag === false){
		return new vec2(this.x+v2.x,this.y+v2.y);
	}else{
		this.x += v2.x;
		this.y += v2.y;
		return this;
	}
}
vec3.prototype.add = function (v3,flag){
	if(flag === false){
		return new vec3(this.x+v3.x,this.y+v3.y,this.z+v3.z);
	}else{
		this.x += v3.x;
		this.y += v3.y;
		this.z += v3.z;
		return this;
	}
}

vec2.prototype.sub = function (v2,flag){
	if(typeof v2 =="number")v2 = p(v2);
	if(flag === false){
		return new vec2(this.x-v2.x,this.y-v2.y);
	}else{
		this.x -= v2.x;
		this.y -= v2.y;
		return this;
	}
}
vec3.prototype.sub = function (v3,flag){
	if(flag === false){
		return new vec3(this.x-v3.x,this.y-v3.y,this.z-v3.z);
	}else{
		this.x -= v3.x;
		this.y -= v3.y;
		this.z -= v3.z;
		return this;
	}
}

vec2.prototype.mul = function (k,flag){
	if(k instanceof vec2){
		if(flag === false){
			return new vec2(this.x*k.x - k.y*this.y, this.x*k.y + k.x*this.y);
		}else{
			var x = this.x*k.x - k.y*this.y;
			this.y = this.x*k.y + k.x*this.y;
			this.x = x;
			return this;
		}
	}
	if(flag === false){
		return new vec2(k*this.x,k*this.y);
	}else{
		this.x *= k;
		this.y *= k;
		return this;
	}
}
vec2.prototype.div = function (k,flag){
	if(k instanceof vec2){
		var x = k.x*k.x+k.y*k.y;
		if(flag === false){
			return new vec2((this.x*k.x + k.y*this.y)/x, (k.x*this.y - this.x*k.y)/x);
		}else{
			var y = (this.x*k.x + k.y*this.y)/x;
			this.y = (this.x*k.y - k.x*this.y)/x;
			this.x = x;
		}
	}
	return this.mul(1/k,flag)
}
vec3.prototype.mul = function (k,flag){
	if(flag === false){
		return new vec3(k*this.x,k*this.y,k*this.z,k*this.t);
	}else{
		this.x *= k;
		this.y *= k;
		this.z *= k;
		return this;
	}
}
vec3.prototype.div = function (k,flag){
	return this.mul(1/k,flag)
}
vec2.prototype.dot = function (v2){
	return this.x*v2.x + this.y*v2.y;
}
vec3.prototype.dot = function (v3){
	return this.x*v3.x + this.y*v3.y + this.z*v3.z;
}
vec2.prototype.len = function (flag){
	var L = this.x*this.x + this.y*this.y;
	if(flag === false){
		return L;
	}
	return Math.sqrt(L);
}
vec3.prototype.len = function (flag){
	var L = this.x*this.x + this.y*this.y + this.z*this.z;
	if(flag === false){
		return L;
	}
	return Math.sqrt(L);
}

vec2.prototype.norm = function (flag){
	return this.div(this.len(),flag)
}
vec3.prototype.norm = function (flag){
	return this.div(this.len(),flag)
}
vec2.prototype.cross = function (v2){
	return this.x*v2.y - this.y*v2.x;
}
vec3.prototype.cross = function (v3,flag) {
	var X = this.y*v3.z - this.z*v3.y;
	var Y = this.z*v3.x - this.x*v3.z;
	var Z = this.x*v3.y - this.y*v3.x;
	if(flag === false){
		return new vec3(X,Y,Z);
	}
	this.x = X;
	this.y = Y;
	this.z = Z;
	return this;
}
vec2.prototype.clone = function (){
	return p(this.x, this.y);
}
vec3.prototype.clone = function (){
	return new vec3(this.x, this.y, this.z);
}
/***
vec2 as complex number
2-element
	pow
1-element
	abs (same as len)
	arg
	conj 
	log 
	exp
	sqrt
***/
vec2.prototype.abs = vec2.prototype.len;
vec2.prototype.arg = function (){
	return Math.atan2(this.y,this.x);
}
vec2.prototype.conj = function (flag){
	if(flag === false){
		return new vec2(this.x,-this.y);
	}
	this.y = -this.y;
	return this;
}
vec2.prototype.log = function (flag){
	if(flag === false){
		return new vec2(Math.log(this.x*this.x+this.y*this.y)/2,this.arg());
	}
	var a = this.arg();
	this.x = Math.log(this.x*this.x+this.y*this.y)/2;
	this.y = a;
	return this;
}
vec2.prototype.exp = function (flag){
	var x = Math.exp(this.x);
	if(flag === false){
		return new vec2(Math.cos(this.y)*x,Math.sin(this.y)*x);
	}
	this.x = Math.cos(this.y)*x;
	this.y = Math.sin(this.y)*x;
	return this;
}
vec2.prototype.pow = function (v2,flag){
	if(flag === false){
		return this.log(false).mul(v2).exp();
	}
	return this.log().mul(v2).exp();
}
function fft(d) {
    // 倒位序排列
	var dataArray = d.slice(0);
    this.sort = function(data, r) {
        if(data.length <=2) return data;
        var index = [0,1];
        for(var i=0; i<r-1; i++) {
            var tempIndex = [];
            for(var j=0; j<index.length; j++) {
                tempIndex[j] = index[j]*2;
                tempIndex[j+index.length] = index[j]*2+1;
            }
            index = tempIndex;
        }
        var datatemp = [];
        for(var i=0; i<index.length; i++) {
            datatemp.push(data[index[i]]);
        }
        return datatemp;
    };
    var dataLen = dataArray.length;
    var r = 1, i = 1;
    while(i*2 < dataLen) {
        i *= 2;
        r++;
    }
    var count = 1<<r; // 相当于count=2^r
    // 如果数据dataArray的长度不是2^N，则开始补0
	for(var i=0; i<dataLen; i++) {
		if(typeof dataArray[i] == "number") dataArray[i] = p(dataArray[i]);
    }
    for(var i=dataLen; i<count; i++) {
        dataArray[i] = p(0,0);
    }
    // 倒位序处理
    dataArray = this.sort(dataArray, r);
    // 计算加权系数w
    var w = [];
    for(var i=0; i<count/2; i++) {
        var angle = -i*Math.PI*2/count;
        w.push(p(Math.cos(angle), Math.sin(angle)));
    }
    for(var i=0; i<r; i++) { // 级循环
        var group = 1<<(r-1-i);
        var distance = 1<<i;
        var unit = 1<<i;
        for(var j=0; j<group; j++) { // 组循环
            var step = 2*distance*j;
            for(var k=0; k<unit; k++) { // 计算单元循环
                var temp = dataArray[step+k+distance].mul(w[count*k/2/distance],false);
                dataArray[step+k+distance] = dataArray[step+k].sub(temp,false);
                dataArray[step+k] = dataArray[step+k].add(temp,false);
            }
        }
    }
    return dataArray;
}
//上面是一维快速傅里叶的算法，快速傅里叶变换的逆变换用JavaScript实现的完整代码如下：

function ifft(d) {
	var dataArray = d.slice(0);
    for(var i=0, dataLen=dataArray.length; i<dataLen; i++) {
        if(typeof(dataArray[i])!='object'){
            dataArray[i] = p(dataArray[i],0);
        }
        dataArray[i].y *= -1;
    }
    dataArray = fft(dataArray);
    for(var i=0, dataLen=dataArray.length; i<dataLen; i++) {
        dataArray[i].x *= 1/dataLen;
        dataArray[i].y *= -1/dataLen;
    }
    return dataArray;
}