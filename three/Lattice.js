/**
 *	javascript.webGL.FOUR.Lattice.js:
 *	using javascript.webGL.FOUR.js;
 *	using javascript.webGL.THREE.js;
 *  using javascript.Math.Cmplx.js;
 * 	@author wxy - FiberedKnot
 *	version 1.0 - 2015
**/
FOUR.Lattice = function (w1,w2,a,b){
	if(arguments.length == 0){
		this.w1 = new Complex(1,0);
		this.w2 = new Complex(0,1);
	}else if(arguments.length == 1){
		this.w1 = new Complex(w1.elements[0],w1.elements[1]);
		this.w2 = new Complex(w1.elements[2],w1.elements[3]);
	}else if(arguments.length == 2){
		this.w1 = w1;
		this.w2 = w2;
	}else if(arguments.length == 4){
		this.w1 = new Complex(w1,w2);
		this.w2 = new Complex(a,b);
	}
}
FOUR.Lattice.prototype.set = function (w1,w2){
	if(arguments.length == 0){
		this.w1 = new Complex(1,0);
		this.w2 = new Complex(0,1);
	}else if(arguments.length == 1){
		this.w1 = new Complex(w1.elements[0],w1.elements[1]);
		this.w2 = new Complex(w1.elements[2],w1.elements[3]);
	}else{
		this.w1 = w1;
		this.w2 = w2;
	}
	return this;
}
FOUR.Lattice.prototype.clone = function (){
	return new FOUR.Lattice(this.w1.clone(), this.w2.clone());
}
FOUR.Lattice.prototype.toArea1 = function (){
	var det = Math.sqrt(Math.abs(this.w1.real*this.w2.imag-this.w1.imag*this.w2.real));
	if(det != 0){
		this.w1.real/=det;
		this.w2.real/=det;
		this.w1.imag/=det;
		this.w2.imag/=det;
	}
	return this;
}
FOUR.Lattice.prototype.getPoints = function (row,col){
	var Points = [];
	for(var x = -row;x <= row;x++){
		for(var y = -col;y <= col;y++){
			Points.push(new THREE.Vector2(
				this.w1.real*x+this.w2.real*y,
				this.w1.imag*x+this.w2.imag*y
			));
		}
	}
	return Points;
}
FOUR.Lattice.prototype.getTaus = function (){
	buffer = [];
	if(!FOUR.Lattice._I){
		FOUR.Lattice._I = new Cmplx.Mobius(1,0,0,1);
		FOUR.Lattice._X = new Cmplx.Mobius(0,-1,1,0);
		FOUR.Lattice._Y = new Cmplx.Mobius(0,-1,1,1);
		FOUR.Lattice._Z = new Cmplx.Mobius(1,-1,1,0);
		FOUR.Lattice._Maxdepth = 14;
		FOUR.Lattice._Maxwidth = 30;
	}
	function _Next (buffer, depth, tau, M, prev){
		var newTau = tau.applyMobius(M);
		buffer.push(newTau);
		if(depth > FOUR.Lattice._Maxdepth || newTau.imag < 0.1 || Math.abs(newTau.real) > FOUR.Lattice._Maxwidth) return 0;
		//$ if tilling must replace above to below
		//$ if(depth > FOUR.Lattice._Maxdepth) return 0;
		switch(prev){
			case "I":
				_Next(buffer,depth + 1,tau,FOUR.Lattice._X.dot(M),"X");
				_Next(buffer,depth + 1,tau,FOUR.Lattice._Y.dot(M),"Y");
				_Next(buffer,depth + 1,tau,FOUR.Lattice._Z.dot(M),"Z");
				break;
			case "Y": case "Z":
				_Next(buffer,depth + 1,tau,FOUR.Lattice._X.dot(M),"X");
				break;
			case "X":
				_Next(buffer,depth + 1,tau,FOUR.Lattice._Y.dot(M),"Y");
				_Next(buffer,depth + 1,tau,FOUR.Lattice._Z.dot(M),"Z");
				break;
		}
	}
	this.setFundamentalDomain();
	var tau = Cmplx.div(this.w2,this.w1);
	if(tau.imag < 0) tau = Cmplx.div(this.w1,this.w2);
	_Next(buffer,0,tau,FOUR.Lattice._I,"I");
	return buffer;
}

FOUR.Lattice.prototype.getG2G3 = function () {
	var W = this.setFundamentalDomain();//.compress();
	return Cmplx.weierstrassInvariant(W.w1,W.w2);
}
FOUR.Lattice.prototype.applyMatrix2 = function (m){
	var e = m.elements;
	var w1x = this.w1.real * e[0] + this.w1.imag * e[2];
	var w1y = this.w1.real * e[1] + this.w1.imag * e[3];
	var w2x = this.w2.real * e[0] + this.w2.imag * e[2];
	var w2y = this.w2.real * e[1] + this.w2.imag * e[3];
	this.w1.real = w1x; this.w1.imag = w1y;
	this.w2.real = w2x; this.w2.imag = w2y;
	return this;
}
FOUR.Lattice.prototype.setFundamentalDomain = function () {
	var dot = this.w1.real * this.w2.real + this.w1.imag * this.w2.imag;
	var nw1 = new Complex(this.w1);
	var nw2 = new Complex(this.w2);
	var tau0 = Cmplx.div(nw1,nw2);
	var tau1 = Cmplx.div(nw2,nw1);
	var Count = 0;       //Avoid forever loop
	function isntInF(t){ //return t isn't in FundamentalDomain
		return (Cmplx.sqrabs(t) < 1 || Math.abs(t.real) > 0.5);
	}
	var tau0isntInF = isntInF(tau0);
	var tau1isntInF = isntInF(tau1);
	while (tau0isntInF && tau1isntInF && Count < 1000) {
		Count++;
		if (dot < 0) {
			if ((nw1.real * nw1.real + nw1.imag * nw1.imag) < (nw2.real * nw2.real + nw2.imag * nw2.imag)) {
				nw2.real += nw1.real;
				nw2.imag += nw1.imag;
			} else {
				nw1.real += nw2.real;
				nw1.imag += nw2.imag;
			}
		}else{
			if ((nw1.real * nw1.real + nw1.imag * nw1.imag) < (nw2.real * nw2.real + nw2.imag * nw2.imag)) {
				nw2.real -= nw1.real;
				nw2.imag -= nw1.imag;
			} else {
				nw1.real -= nw2.real;
				nw1.imag -= nw2.imag;
			}
		}
		dot = nw1.real * nw2.real + nw1.imag * nw2.imag;
		tau0 = Cmplx.div(nw1, nw2);
		tau0isntInF = isntInF(tau0);
		tau1 = Cmplx.div(nw2, nw1);
		tau1isntInF = isntInF(tau1);
	}
	this.w1 = nw1;
	this.w2 = nw2;
	return this;
}
FOUR.Lattice.prototype.compress = function (){
	var K = Math.sqrt(Cmplx.abs(this.w1)/Cmplx.abs(this.w2));
	K = Math.sqrt((K));
	return new FOUR.Lattice(Cmplx.mul(this.w1,1/K),Cmplx.mul(this.w2,K));
}
FOUR.Lattice.modularMatrix = function (tau){
	return new THREE.Matrix2(Math.exp(tau),0,0,Math.exp(-tau));
}
FOUR.Lattice.rotationMatrix = function (tau){
	return new THREE.Matrix2(Math.cos(tau),Math.sin(tau),Math.sin(-tau),Math.cos(tau));
}
FOUR.Lattice.horocyclicPMatrix = function (tau){
	return new THREE.Matrix2(1,tau,0,1);
}
FOUR.Lattice.horocyclicMMatrix = function (tau){
	return new THREE.Matrix2(1,0,tau,1);
}
FOUR.Lattice.G2G3
{
	FOUR.Lattice.G2G3 = function (g2r,g2i,g3r,g3i){
		if(arguments.length == 2){
			this.g2 = g2r;
			this.g3 = g2i;

		}else{
			this.g2 = new Complex(g2r,g2i);
			this.g3 = new Complex(g3r,g3i);
		}
	}
	FOUR.Lattice.G2G3.prototype.clone = function (){
		return new FOUR.Lattice.G2G3(this.g2,this.g3)
	}
	FOUR.Lattice.G2G3.prototype.delta = function (){
		var g23 = Cmplx.mul(this.g2,Cmplx.mul(this.g2,this.g2));
		var g327 = Cmplx.mul(27,Cmplx.mul(this.g3,this.g3));
		return Cmplx.sub(g23,g327);
	}
	FOUR.Lattice.G2G3.prototype.jInvariant = function (){
		var g23 = Cmplx.mul(this.g2,Cmplx.mul(this.g2,this.g2));
		var g327 = Cmplx.mul(27,Cmplx.mul(this.g3,this.g3));
		return Cmplx.div(g23,Cmplx.sub(g23,g327));//return g2^3/delta
	}
	FOUR.Lattice.G2G3.prototype.tau = function (){
		var g232 = Cmplx.mul(Cmplx.sqrt(this.g2),this.g2);
		var a = Cmplx.add(Cmplx.mul(Cmplx.div(this.g3,g232),2.598076211),0.5);
		var F1 = Cmplx.hypergeometric2F1(1/6, 5/6, 1, Cmplx.sub(1, a));
		var F2 = Cmplx.hypergeometric2F1(1/6, 5/6, 1, a);
		var tau = Cmplx.mul(Cmplx.div(F1, F2),Cmplx.I);
		return tau;
	}
	FOUR.Lattice.G2G3.prototype.normalizeToS3 = function(R){
		if(!R) R = 1;
		var R_2 = R*R;
		var g22 = Cmplx.sqrabs(this.g2);
		var g32 = Cmplx.sqrabs(this.g3);
		var c2 = Math.min(R/Math.sqrt(g22),Math.pow(R_2/g32,1/3));
		c1 = 0;
		for (var tnt = 1; tnt<100; tnt++) {
			var k_4 = (c1 + c2)/2;
			if (k_4 * k_4 * (g22 + k_4 * g32)>R_2) c2 = k_4;
			else c1 = k_4;
		}
		k_6 = Math.sqrt(k_4)*k_4;
		return new FOUR.Lattice.G2G3(Cmplx.mul(this.g2,k_4),Cmplx.mul(this.g3,k_6));
	}
	FOUR.Lattice.G2G3.prototype.applyRotation = function (tau){
		var tau4 = tau*4, tau6 = tau*6;
		this.g2 = new Complex(
			this.g2.real*Math.cos(tau4)+this.g2.imag*Math.sin(tau4),
			this.g2.real*Math.sin(-tau4)+this.g2.imag*Math.cos(tau4)
		);
		this.g3 = new Complex(
			this.g3.real*Math.cos(tau6)+this.g3.imag*Math.sin(tau6),
			this.g3.real*Math.sin(-tau6)+this.g3.imag*Math.cos(tau6)
		);
		return this;
	}
	FOUR.Lattice.G2G3.prototype.getPoint = function (method){//5*S3R1
		if(!method) method = "";
		var radius = method.split('R')[1].split('D')[0];
		var strarr = method.split('*');
		var ratio = (strarr.length > 1) ? Number(strarr[0]) : 1;
		var strengthen = method.split('*')[0];
		var te = this;
		if(radius){
			te = this.normalizeToS3(radius);
			/* to make points away from the trefoil delta */
			
			if(false && Cmplx.sqrabs(te.delta())<0.1 && method.split('D').length == 1){
				var k_4 = 2-(Cmplx.sqrabs(te.delta())*10);
				k_6 = Math.sqrt(k_4)*k_4;
				te = new THREE.Vector4(te.g2.real*k_4,te.g2.imag*k_4,te.g3.real*k_6*ratio,te.g3.imag*k_6*ratio);
				return te;
			}//else te = new THREE.Vector4(te.g2.real,te.g2.imag,te.g3.real,te.g3.imag);
		}
		return new THREE.Vector4(te.g2.real,te.g2.imag,te.g3.real*ratio,te.g3.imag*ratio);
	}
	FOUR.Lattice.G2G3.prototype.getPoint2 = function (){//5*S3R1
		te = this.clone();
		te.g2 = Cmplx.div(te.g2,60);
		te.g3 = Cmplx.div(te.g3,140);
		te = te.normalizeToS3(1);
		return new THREE.Vector4(te.g2.real*60,te.g2.imag*60,te.g3.real*140,te.g3.imag*140);
	}
}
FOUR.Lattice.CreateClosedGeodesics = function (method,A){
	var e = A.elements, f = [0,0,0,0];
	var tr = e[0] + e[3], tr_2 = tr * tr;
	//x2 - tr x + 1=0
	if (tr_2 < 4) return -1;
	var x1, x2, Ps = [], Es = [], Lattice = new FOUR.Lattice();
	eig = (tr - Math.sqrt(tr_2 - 4))/2;
	if(Math.abs(e[1]) < 0.2){
		x2 = (eig - e[0]) / e[1]; x1 = 1;
	}else{
		x1 = e[1] / (eig - e[0]); x2 = 1;
	}
	f[0] = x1; f[2] = x2;
	eig = 1 / eig;
	if(Math.abs(e[1]) < 0.2){
		x2 = (eig - e[0]) / e[1]; x1 = 1;
	}else{
		x1 = e[1] / (eig - e[0]); x2 = 1;
	}
	f[1] = x1; f[3] = x2;
	var g = new Cmplx.Mobius({elements: f}).inverse().elements;
	Lattice.w1 = new Complex(g[0],g[2]);
	Lattice.w2 = new Complex(g[1],g[3]);
	var period = Math.log(eig);
	var j = 0;
	for(var i = 0; i < period; i += 0.01){
		var temp = Lattice.clone().applyMatrix2(FOUR.Lattice.modularMatrix(i));
		Ps.push(temp.getG2G3().getPoint(method));
		if(j != 0) Es.push(new FOUR.Edge(j-1,j));
		j++;
	}
	if(j != 0) Es.push(new FOUR.Edge(j-1,0));
	return new FOUR.Geometry(Ps,Es);
}
FOUR.Lattice.CreateMobiusSurface = function (method){
	var Ps = [];
	for(var i=0.4;i<1.1;i+=0.04){
		var d30 = Math.PI/120;
		var L = new FOUR.Lattice(new Complex(i,0),new Complex(0,1/i));
		var G2G3 = L.getG2G3().normalizeToS3();
		for(var j=0;j<120;j++)
			Ps.push(G2G3.applyRotation(d30).getPoint(method));
	}
	return new FOUR.Geometry(Ps);
}
FOUR.Lattice.CreateSeifertSurface = function (method,angle){
	//Q = FOUR.Lattice.CreateSeifertSurface(LatticeMethod,0);
	//main3d.scene4.add(new FOUR.Mesh(Q,new FOUR.FrameMaterial(0xFF00FF,null)))
	var Ps = [];
	if(true){
		while(Ps.length < 1000){
			var d30 = Math.PI/6;
			var L = new FOUR.Lattice(new Complex(Math.random(),Math.random()),new Complex(Math.random(),Math.random()));
			var G2G3 = L.getG2G3().normalizeToS3();
			var g23 = Cmplx.mul(G2G3.g2,Cmplx.mul(G2G3.g2,G2G3.g2));
			var g327 = Cmplx.mul(27,Cmplx.mul(G2G3.g3,G2G3.g3));
			var delta = Cmplx.sub(g23,g327)
			var arg = Cmplx.arg(delta);
			if(Math.abs(arg - angle) < 0.1 && Cmplx.sqrabs(delta)>0.01){
				Ps.push(G2G3.getPoint(method));
				Ps.push(G2G3.applyRotation(d30).getPoint(method));
				Ps.push(G2G3.applyRotation(d30).getPoint(method));
				Ps.push(G2G3.applyRotation(d30).getPoint(method));
				Ps.push(G2G3.applyRotation(d30).getPoint(method));
				Ps.push(G2G3.applyRotation(d30).getPoint(method));
			}
		}
	}else if(true){
		var SinRatio;
		var S32,S23,s2,s3;
		var p2 = Math.PI*2;
		var r3;
		function Pspush (Ps,r2,r3,S32,S23,S32m,S23m){
			Ps.push(new FOUR.Lattice.G2G3(r2*Math.cos(S32),r2*Math.sin(S32),r3*Math.cos(S23),r3*Math.sin(S23)));
			Ps.push(new FOUR.Lattice.G2G3(r2*Math.cos(S32),r2*Math.sin(S32),r3*Math.cos(S23m),r3*Math.sin(S23m)));
			Ps.push(new FOUR.Lattice.G2G3(r2*Math.cos(S32m),r2*Math.sin(S32m),r3*Math.cos(S23),r3*Math.sin(S23)));
			Ps.push(new FOUR.Lattice.G2G3(r2*Math.cos(S32m),r2*Math.sin(S32m),r3*Math.cos(S23m),r3*Math.sin(S23m)));
		}
		for(var r2 = 0; r2 < 1; r2 += 0.2){
			r3 = Math.sqrt(1 - r2 * r2);
			SinRatio = 27*r3*r3/(r2*r2*r2);
			for(var r = 0; r < 1; r += 0.2){
				if(SinRatio > 1){
					S32 = (Math.asin(r) + angle)/3;
					S32m = (Math.PI - Math.asin(r) + angle)/3;
					S23 = (Math.asin(r) / SinRatio + angle)/2;
					S23m = ((Math.PI - Math.asin(r / SinRatio)) + angle)/2;
				}else{
					S32 = (Math.asin(r * SinRatio) + angle)/3;
					S32m = (Math.PI - Math.asin(r * SinRatio) + angle)/3;
					S23 = (Math.asin(r) + angle)/2;
					S23m = (Math.PI - Math.asin(r) + angle)/2;
				}
				Pspush (Ps,r2,r3,S32,S23,S32m,S23m);
				Pspush (Ps,r2,r3,S32 + p2/3,S23,S32m + p2/3,S23m);
				Pspush (Ps,r2,r3,S32,S23 + Math.PI,S32m,S23m + Math.PI);
				
				
			}
		}
		for(var i = 0; i < Ps.length; i++){
			Ps[i] = Ps[i].getPoint(method);
		}
	}
	return new FOUR.Geometry(Ps);
}
FOUR.Lattice.CreateBoundsGeometrys = function (method){
	var sv = [], se = [], hv = [], he = [], de = [], dv = [], G = [];
	var determinant = new FOUR.Lattice.G2G3(0.982291,0,0.187361,0);
	var square = new FOUR.Lattice.G2G3(1,0,0,0);
	var hexagon = new FOUR.Lattice.G2G3(0,0,1,0);
	for (var i = 0; i < 120; i ++){
		square.applyRotation(0.5*Math.PI/120);
		sv.push(square.getPoint(method));
		se.push(new FOUR.Edge(i,(i==119)?0:(i+1)));
	}
	for (var i = 0; i < 90; i ++){
		hexagon.applyRotation(Math.PI/3/90);
		hv.push(hexagon.getPoint(method));
		he.push(new FOUR.Edge(i,(i==89)?0:(i+1)));
	}
	for (var i = 0; i < 320; i ++){
		determinant.applyRotation(Math.PI/320);
		dv.push(determinant.getPoint(method+"D"));
		de.push(new FOUR.Edge(i,(i==319)?0:(i+1)));
	}
	return [new FOUR.Geometry(sv,se), new FOUR.Geometry(hv,he), new FOUR.Geometry(dv,de)];
}
