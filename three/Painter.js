function $(obj){
	return document.getElementById(obj);
}
if(typeof THREE == 'undefined'){
	THREE = function (){};
	{
		THREE.Vector2=function(x,y){this.x=x||0;this.y=y||0;};THREE.Vector2.prototype={constructor:THREE.Vector2,
		set:function(x,y){this.x=x;this.y=y;return this;},copy:function(v){this.x=v.x;this.y=v.y;return this;
		},add:function(v){this.x+=v.x;this.y+=v.y;return this;},addVectors:function(a,b){this.x=a.x+b.x;this.y=a.y+b.y;
		return this;},addScalar:function(s){this.x+=s;this.y+=s;return this;},sub:function(v,w){this.x-=v.x;this.y-=v.y;
		return this;},subVectors:function(a,b){this.y=a.y-b.y;return this;},dot: function(v){return this.x * v.x + this.y * v.y;
		},lengthSq:function(){return this.x*this.x+this.y*this.y;},length:function(){return Math.sqrt(this.x*this.x+this.y*this.y);
		},normalize:function(){return this.divideScalar(this.length());},distanceTo:function(v){return Math.sqrt(this.distanceToSquared(v));
		},distanceToSquared:function(v){var dx=this.x-v.x,dy=this.y-v.y;return dx*dx+dy*dy;},multiplyScalar:function(s){this.x*=s;this.y*=s;return this;},divideScalar:function ( scalar ) {
		if(scalar!==0){var invScalar=1/scalar;this.x*=invScalar;this.y*=invScalar;}else{this.x=0;this.y=0;}},clone: function(){return new THREE.Vector2(this.x,this.y);}};
	}
}
Painter
{
	function Painter(obj,scale,center){
		this.domElement = obj;
		this.width = obj.width;
		this.height = obj.height;
		this.graphics = obj.getContext("2d");
		this.scale = (scale) ? scale : 50;
		this.center = (center) ? center : new THREE.Vector2();
		this.ImageData = null;
	}
	Painter.prototype.clear = function(){
		this.graphics.clearRect(0,0,this.width,this.height);
	}
	Painter.prototype.beginPath = function (){
		this.graphics.beginPath();
	}
	Painter.prototype.closePath = function (){
		this.graphics.closePath();
	}
	Painter.prototype.fill = function (){
		this.graphics.fill();
	}
	Painter.prototype.stroke = function (){
		this.graphics.stroke();
	}
	Painter.prototype.strokeText = function (text,v2){
		var V2 = v2;
		if(typeof Complex != 'undefined' && v2 instanceof Complex) V2 = v2.toVector2();
		var p = this.applyTransformation(V2);
		this.graphics.strokeText(text,p.x,p.y);
	}
	Painter.prototype.fillCircle = function (v2,radius,color,offset){
		this.graphics.beginPath();
		var V2 = v2;
		if(typeof Complex != 'undefined' && v2 instanceof Complex) V2 = v2.toVector2();
		if(offset) V2 = V2.add(offset);
		var nv2 = this.applyTransformation(V2);
		this.graphics.arc(nv2.x,nv2.y,radius,0,2*Math.PI);
		if(color) this.graphics.fillStyle = color;
		this.graphics.fill();
	}
	Painter.prototype.lineTo = function (v2,move,color,offset){
		if(color) this.graphics.strokeStyle = color;
		V2 = v2;
		if(typeof Complex != 'undefined' && v2 instanceof Complex) V2 = v2.toVector2();
		if(offset) V2 = V2.add(offset);
		var nv2 = this.applyTransformation(V2);
		if(move)
			this.graphics.moveTo(nv2.x,nv2.y);
		else
			this.graphics.lineTo(nv2.x,nv2.y);
	}
	Painter.prototype.applyTransformation = function (v){
		return new THREE.Vector2(v.x, -v.y).sub
			(new THREE.Vector2(this.center.x, -this.center.y)).multiplyScalar
			(this.scale).add(new THREE.Vector2(this.width/2,this.height/2));
	}
	Painter.prototype.applyInverseTransformation = function (v){
		var te = v.clone().sub(new THREE.Vector2(this.width/2,this.height/2)).divideScalar
		(this.scale).add(new THREE.Vector2(this.center.x, -this.center.y));
		te.y = -te.y;
		return te;
	}
	Painter.prototype.createImageData = function (){
		this.ImageData = this.graphics.createImageData(this.width,this.height);
	}
	Painter.prototype.getImageData = function (){
		this.ImageData = this.graphics.getImageData(this.width,this.height);
	}
	
	Painter.loadIMG = function (src,todo){
		Painter._todo = todo;
		Painter._img = new Image();
		Painter._img.src = src;
		Painter._img.onload = function (){
			var c = document.createElement('canvas');
			c.height = Painter._img.height;
			c.width = Painter._img.width;
			var clctx = new Painter(c);
			clctx.graphics.drawImage(Painter._img,0,0);
			clctx.ImageData = clctx.graphics.getImageData(0,0,c.width,c.height);
			Painter.loadedIMG = clctx;
			Painter._todo();
		}
	}
	Painter.prototype.putImageData = function (data){
		if(data){
			this.ImageData = data;
			this.graphics.putImageData(data,0,0);
		}else{
			this.graphics.putImageData(this.ImageData,0,0);
		}
	}
	Painter.prototype.writeData = function (x, y, _color, alpha){
		var te = (this.width * y + x) << 2;
		this.ImageData.data[te] = _color >> 16;
		this.ImageData.data[te + 1] = _color >> 8 & 0xFF;
		this.ImageData.data[te + 2] = _color & 0xFF;
		this.ImageData.data[te + 3] = (alpha) ? alpha : 0xFF;
	}
	Painter.prototype.readData = function (x, y){
		var te = (this.width * y + x) << 2;
		return (this.ImageData.data[te] << 16) +
			(this.ImageData.data[te + 1] << 8)+
			this.ImageData.data[te + 2];
	}
	Painter.prototype.readRGBData = function (x, y){
		var te = (this.width * y + x) << 2;
		return [this.ImageData.data[te],
			this.ImageData.data[te + 1],
			this.ImageData.data[te + 2]];
	}
	Painter.getRGB = function (n){
		return [n>> 16,n>> 8 & 0xFF,n & 0xFF];
	}
	Painter.prototype.readAntiAliasingData = function(P0,Q0){
		var P = Math.floor(P0);
		var Q = Math.floor(Q0);
		if(P>=this.width||Q>=this.heigth||Q<0||P<0)return 0;
		var data1 = this.readRGBData(P,Q);
		var data2 = this.readRGBData(P+1,Q);
		var data3 = this.readRGBData(P,Q+1);
		var data4 = this.readRGBData(P+1,Q+1);
		var m = P0-P;var n = Q0-Q;
		return ((data1[0]*(1-m)*(1-n)+data2[0]*m*(1-n)+data3[0]*(1-m)*n+data4[0]*m*n)<<16)+
				((data1[1]*(1-m)*(1-n)+data2[1]*m*(1-n)+data3[1]*(1-m)*n+data4[1]*m*n)<<8)+
				data1[2]*(1-m)*(1-n)+data2[2]*m*(1-n)+data3[2]*(1-m)*n+data4[2]*m*n;
	}
}