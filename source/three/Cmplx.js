/**
 *	javascript.Math.Cmplx.js:
 * 	@author wxy - FiberedKnot
 *	version 1.2 - 2015
**/
Cmplx = function Cmplx() {throw "Cmplx can't create instance! use Complex instead."}
Math
{
	/** @Override **/
	Math.sinh = function sinh(x){
		return (Math.exp(x) - Math.exp(-x))/2;
	}
	Math.cosh = function cosh(x){
		return (Math.exp(x) + Math.exp(-x))/2;
	}
	Math.tanh = function tanh(x){
		return (Math.exp(x) - Math.exp(-x))/ (Math.exp(x)+Math.exp(-x))
	}
	Math.asinh = function asinh(x){
		return Math.log(x + Math.sqrt(x*x+1));
	}
	Math.acosh = function acosh(x){
		return Math.log(x + Math.sqrt(x*x-1));
	}
	Math.atanh = function atanh(x){
		return (Math.log((x+1)/(1-x)))/2;
	}
	Math.sgn = function sgn(x){
		return (x == 0)?0:(x>0)?1:-1;
	}
}
Cmplx.version = "1.2.0";
Complex = function (real,imag){
	if(typeof real == "undefined"){
		this.real = 0;
		this.imag = 0;
	}else if(arguments.length == 1){
		if(typeof real == "string"){
			if(!isNaN(Number(real))){
				this.real = real;
				this.imag = 0;
			}else if(real.indexOf(",")!=-1){
				var strarr = real.split(',');
				this.real = Number(strarr[0]);
				this.imag = Number(strarr[1]);
			}else if(real=="i"){
				this.real = 0;
				this.imag = 1;
			}else if(real=="-i"){
				this.real = 0;
				this.imag = -1;
			}
		}else{
			this.real = real.real;
			this.imag = real.imag;
		}
	}else{
		this.real = real;
		this.imag = imag;
	}
}
Complex.prototype.toString = function(){
	if(this.imag == 0)return this.real;
	if(this.real == 0)return this.imag+"*i";
	if(this.imag<0)return this.real+" - "+(-this.imag)+"*i";
	return this.real+" + "+this.imag+"*i";
}
Complex.prototype.format = function(n){
	var N = Cmplx.pow(10,n);
	return new Complex(Math.round(this.real*N)/N,Math.round(this.imag*N)/N)
}
Complex.prototype.clone = function(){
	return new Complex(this.real, this.imag);
}
Complex.prototype.toArray = function(){
	return Cmplx.toArray(this);
}
Complex.prototype.toVector2 = function(){
	return Cmplx.toVector2(this);
}
Complex.prototype.length = function(){
	return Cmplx.length(this);
}
Complex.prototype.sqrabs = function(){
	return Cmplx.sqrabs(this);
}
Complex.prototype.sqrlength = function(){
	return Cmplx.sqrlength(this);
}
Complex.prototype.abs = function(){
	return Cmplx.abs(this);
}
Cmplx
{
	Cmplx.I = new Complex(0,1);//declare i
	Cmplx.isCmplx = function isCmplx(c){
		return (c instanceof Complex);
	}
	Cmplx.Simplify = function (z){
		if(typeof z.imag == "number" && Math.abs(z.imag) < 1e-10)return z.real;
		else return z;
	}
	Cmplx.toArray = function (a){
		return [a.real,a.imag];
	}
	Cmplx.fromArray = function (a){
		return new Complex(a[0],a[1]);
	}
	Cmplx.toVector2 = function (a){
		return new THREE.Vector2(a.real,a.imag);
	}
	Cmplx.fromVector2 = function (a){
		return new Complex(a.x,a.y);
	}
	Cmplx.toString = function (obj){
		var str;
		if(Cmplx.isCmplx(obj))
			str=obj.real+"+"+obj.imag+"i";
		else str=obj;
		return str;
	}
	Cmplx.real = function (c){
		if(Cmplx.isCmplx(c)) return c.real;
		if(typeof c == "number")return c;
			return NaN;
	}
	Cmplx.imag = function (c){
		if(Cmplx.isCmplx(c)) return c.imag;
		if(typeof c == "number") return 0;
		return NaN;
	}
	Cmplx.conj = function (c){
		if(Cmplx.isCmplx(c)) return new Complex(c.real,-c.imag);
		if(typeof c == "number") return c;
		return NaN;
	}
	Cmplx.add = function (a,b){
		if(typeof a == 'number'&& typeof b == 'number')return a+b;
		if(typeof a == 'number'&& Cmplx.isCmplx(b)) a = new Complex(a,0);
		else if(typeof b == 'number'&& Cmplx.isCmplx(a)) b = new Complex(b,0);
		if(Cmplx.isCmplx(a)&&Cmplx.isCmplx(b))return (new Complex(a.real+b.real,a.imag+b.imag));
			return NaN;
	} 
	Cmplx.sub = function (a,b){
		if(typeof a == 'number'&& typeof b == 'number')return a-b;
		if(typeof a == 'number'&& Cmplx.isCmplx(b)) a = new Complex(a,0);
		else if(typeof b == 'number'&& Cmplx.isCmplx(a)) b = new Complex(b,0);
		if(Cmplx.isCmplx(a)&&Cmplx.isCmplx(b)) return (new Complex(a.real-b.real,a.imag-b.imag));
		return NaN;
	}
	Cmplx.mul = function (a,b){ 
		if(typeof a == 'number'&& typeof b == 'number')return a*b;
		if(typeof a == 'number'&& Cmplx.isCmplx(b)) a = new Complex(a,0);
		else if(typeof b == 'number'&& Cmplx.isCmplx(a)) b = new Complex(b,0);
		if(Cmplx.isCmplx(a)&&Cmplx.isCmplx(b))
			return new Complex(a.real*b.real-a.imag*b.imag,a.real*b.imag+a.imag*b.real);
		return NaN;
	}
	Cmplx.div = function (a,b){
		if(typeof a == 'number'&& typeof b == 'number')return a/b;
		if(typeof a == 'number'&& Cmplx.isCmplx(b)) a = new Complex(a,0);
		else if(typeof b == 'number'&& Cmplx.isCmplx(a)) b = new Complex(b,0);
		if(Cmplx.isCmplx(a)&&Cmplx.isCmplx(b)){
			var b_2=b.imag*b.imag+b.real*b.real;if(b_2 == 0)return Infinity;
			return  new Complex((a.real*b.real+a.imag*b.imag)/b_2,(a.imag*b.real-a.real*b.imag)/b_2);
		}
		return NaN;
	}
	Cmplx.sqrabs = function (z){
		if(typeof z == 'number')return z*z;
		if(Cmplx.isCmplx(z))return z.imag*z.imag+z.real*z.real;
		return NaN;
	}
	Cmplx.sqrlength = function (z){
		return Cmplx.sqrlength(z);
	}
	Cmplx.abs = function (z){
		return Math.sqrt(Cmplx.sqrabs(z));
	}
	Cmplx.length = function (z){
		return Cmplx.length(z);
	}
	Cmplx.arg = function (z){
		if(typeof z == 'number') return (z>=0)?0:Math.PI;
		if(Cmplx.isCmplx(z)) return Math.atan2(z.imag,z.real);
		return NaN;
	}
	Cmplx.log = function (z){
		 if(typeof z == 'number' && z >= 0)return Math.log(z);
		 if(typeof z == 'number' && z < 0)z = new Complex(z,0);
		 if(Cmplx.isCmplx(z))
			 return new Complex(Math.log(z.imag*z.imag+z.real*z.real)/2,Cmplx.arg(z));
		 return NaN;
	}
	Cmplx.ln = Cmplx.log;
	Cmplx.exp = function (z){
		if(Cmplx.isCmplx(z))
		return Cmplx.mul(Math.exp(z.real),new Complex(Math.cos(z.imag),Math.sin(z.imag)));
		if(typeof z == 'number') return Math.exp(z);
		return NaN;
	}
	Cmplx.sqrt = function (a){
		if(typeof a == "number")
			return (a >= 0) ? Math.sqrt(a) : new Complex(0,Math.sqrt(-a));
		r = Cmplx.abs(a);
		return new Complex(Math.sqrt((r+a.real)/2),Math.sgn(a.imag)*Math.sqrt((r-a.real)/2));
	}
	Cmplx.pow = function (a,b){
		if((typeof b == 'number'&&b == Math.floor(b)&&Math.abs(b)<20)){
			if(b<0){b=-b;a=Cmplx.div(1,a)}
			if(b == 0) return 1;
			var prod=1;
			for(var t=0;t<b;t++)
				prod= Cmplx.mul(prod,a);
			return prod;
		}else if(typeof a == 'number'&& typeof b == 'number'&&a>=0){
			return (b == 0.5)?Math.sqrt(a):Math.pow(a,b)
		}else{
		  if(!Cmplx.isCmplx(a))a = new Complex(a,0);
		  if(b == 0.5)return Cmplx.sqrt(a);
		  if(!Cmplx.isCmplx(b))b = new Complex(b,0);
		   return Cmplx.exp(Cmplx.mul(b,Cmplx.log(a)))
		}
	}
	Cmplx.gamma = function (z){
		var p = [ 676.5203681218851,   -1259.1392167224028,  771.32342877765313,
				 -176.61502916214059,     12.507343278686905, -0.13857109526572012,
					9.9843695780195716e-6, 1.5056327351493116e-7];
		var C = Math.sqrt(2*Math.PI);
		var x = 0.99999999999980993;
		if(typeof z == 'number' && z == Math.floor(z) && z < 100){
			if(z>0){
				var prod,t;
				prod = 1;
				for(t=2;t<z;t++)prod *= t;
				return prod;
				//(n-1)!for int
			}else return Infinity;
		}else if(typeof z == 'number'){
			if (z < 0.5)
				return Math.PI / (Math.sin(Math.PI*z) * gamma(1-z));
			else{
				z--;
				for (var i = 0; i < p.length;i++)
					x += p[i] / (z+i+1);
			}
			t = z + p.length - 0.5;
			return C * Math.pow(t,z+0.5) * Math.exp(-t) * x;
		}else if(Cmplx.isCmplx(z)){
			if (z.real < 0.5)
				result = Cmplx.div(Math.PI,Cmplx.mul(Cmplx.sin(Cmplx.mul(Math.PI,z)),gamma(Cmplx.sub(1,z))));
			else{
				z1 = Cmplx.sub(z,1);
				for (var i = 0; i < p.length;i++)
					x = Cmplx.add(x,Cmplx.div(p[i],Cmplx.add(z1,i+1)));
				var t = Cmplx.add(z1 , p.length - 0.5);
				result = Cmplx.mul(Cmplx.div(Cmplx.mul(C,Cmplx.pow(t,Cmplx.add(z1,0.5))) , Cmplx.exp(t)),x);
			}
			return result;
		}
	}
}
//Hyperbolic and Triangular Functions
{
	Cmplx.sin = function sin(z){
		if(Cmplx.isCmplx(z))
			return Cmplx.div(Cmplx.sub(Cmplx.exp(new Complex(-z.imag,z.real)),Cmplx.exp(new Complex(z.imag,-z.real))),new Complex(0,2));
		else if(typeof z == 'number')return Math.sin(z);return NaN;
	}
	Cmplx.cos = function cos(z){
		if(Cmplx.isCmplx(z))
			return Cmplx.sin(new Complex(z.real+Math.PI/2,z.imag))
		else if(typeof z == 'number')return Math.cos(z);return NaN;
	}
	Cmplx.sec = function sec(z){
		return Cmplx.div(1, Cmplx.cos(z));
	}
	Cmplx.csc = function csc(z){
		return Cmplx.div(1, Cmplx.sin(z));
	}
	Cmplx.tan = function tan(z){
		return Cmplx.div( Cmplx.sin(z), Cmplx.cos(z) );
	}
	Cmplx.cot = function cot(z){
		return Cmplx.div( Cmplx.cos(z), Cmplx.sin(z) );
	}
	Cmplx.sinh = function sinh(z){
		if(Cmplx.isCmplx(z))
			return Cmplx.mul(new Complex(0,-1), Cmplx.sin(Cmplx.mul(new Complex(0,1),z)) );
		else return Math.sinh(z);
	}
	Cmplx.cosh = function cosh(z){
		if( Cmplx.isCmplx(z))
		return Cmplx.cos(Cmplx.mul(new Complex(0,1),z));
		else return Math.cosh(z);
	}
	Cmplx.sech = function sech(z){
		return Cmplx.div(1, Cmplx.cosh(z) );
	}
	Cmplx.csch = function csch(z){
		return Cmplx.div(1, Cmplx.sinh(z) );
	}
	Cmplx.tanh = function tanh(z){
		return Cmplx.div( Cmplx.sinh(z), Cmplx.cosh(z) );
	}
	Cmplx.coth = function coth(z){
		return Cmplx.div( Cmplx.cosh(z), Cmplx.sinh(z) );
	}
	Cmplx.arcsin = function arcsin(z){
		if(typeof z == "number"&&Math.abs(z)<=1)return Math.asin(z);
		if(typeof z == "number")z = new Complex(z,0);
		return Cmplx.mul(Cmplx.log(Cmplx.add(new Complex(-z.imag,z.real),Cmplx.sqrt(Cmplx.sub(1,Cmplx.mul(z,z))))),new Complex(0,-1));
	}
	Cmplx.arccos = function arccos(z){
		if(typeof z == "number"&&Math.abs(z)<=1)return Math.acos(z);
		return Cmplx.sub(Math.PI/2,Cmplx.arcsin(z));
	}
	Cmplx.arctan = function arctan(z){
		if(typeof z == "number")return Math.atan(z);
		z1 = new Complex(-z.imag,z.real);
		return Cmplx.mul(Cmplx.log(Cmplx.div(Cmplx.sub(1,z1),Cmplx.add(1,z1))),new Complex(0,0.5));
	}
	Cmplx.arccot = function arccot(z){
		return Cmplx.sub(Math.PI/2,Cmplx.arctan(z));
	}
	Cmplx.arcsec = function arcsec(z){
		return Cmplx.div(1,Cmplx.arccos(z));
	}
	Cmplx.arccsc = function arccsc(z){
		return Cmplx.div(1,Cmplx.arcsin(z));
	}
	Cmplx.arcsinh = function arcsinh(z){
		if(typeof z == "number")return Math.asinh(z);
		return Cmplx.log(Cmplx.add(z,Cmplx.sqrt(Cmplx.add(1,Cmplx.mul(z,z)))));
	}
	Cmplx.arccosh = function arccosh(z){
		if(typeof z == "number"&&z>=1)return Math.acosh(z);
		return Cmplx.log(Cmplx.add(z,Cmplx.mul(Cmplx.sqrt(Cmplx.add(1,z)),Cmplx.sqrt(Cmplx.add(-1,z)))));
	}
	Cmplx.arctanh = function arctanh(z){
		if(typeof z == "number"&&Math.abs(z)<1)return Math.atanh(z);
		return Cmplx.mul(Cmplx.log(Cmplx.div(Cmplx.add(1,z),Cmplx.sub(1,z))),0.5);
	}
	Cmplx.arccoth = function arccoth(z){
		return Cmplx.arctanh(Cmplx.div(1,z));
	}
	Cmplx.arcsech = function arcsech(z){
		return Cmplx.arccosh(Cmplx.div(1,z));
	}
	Cmplx.arccsch = function arccsch(z){
		return Cmplx.arcsinh(Cmplx.div(1,z));
	}
}
Cmplx.Mobius
{
	Cmplx.Mobius = function (args){
		if(arguments.length == 1){
			this.elements = args.elements;
		}else if(arguments.length == 4){
			this.elements = [arguments[0],arguments[1],arguments[2],arguments[3]];
		}else this.elements = [1,0,0,1];
	}
	Cmplx.Mobius.prototype.toString = function (){
		return "["+this.elements[0]+","+this.elements[1]+";"
			+this.elements[2]+","+this.elements[3]+"]";
	}
	Cmplx.Mobius.prototype.dot = function (mobius){
		var e = this.elements, f = mobius.elements;
		var a = Cmplx.add(Cmplx.mul(e[0],f[0]) , Cmplx.mul(e[1],f[2]));
		var b = Cmplx.add(Cmplx.mul(e[0],f[1]) , Cmplx.mul(e[1],f[3]));
		var c = Cmplx.add(Cmplx.mul(e[2],f[0]) , Cmplx.mul(e[3],f[2]));
		var d = Cmplx.add(Cmplx.mul(e[2],f[1]) , Cmplx.mul(e[3],f[3]));
		return new Cmplx.Mobius(a,b,c,d);
	}
	Cmplx.Mobius.prototype.inverse = function (){
		var e = this.elements;
		var a = e[3];
		var b = Cmplx.sub(0,e[1]);
		var c = Cmplx.sub(0,e[2]);
		var d = e[0];
		return new Cmplx.Mobius(a,b,c,d);
	}
	Complex.prototype.applyMobius = function (mobius){
		var e = mobius.elements;
		return Cmplx.div(Cmplx.add(Cmplx.mul(e[0],this),e[1]),Cmplx.add(Cmplx.mul(e[2],this),e[3]));
	}
}
//Elliptic Functions and ModularForms
{
	Cmplx.theta3 = function (z,nome){
		var eta=Cmplx.exp(Cmplx.mul(new Complex(0,2*Math.PI),z));
		var sum=0;
		for(var n = -9; n <= 9; n++){
			var temp = Cmplx.pow(nome,n*n);
			var t2 = Cmplx.pow(eta,n);
			sum=Cmplx.add(sum,Cmplx.mul(temp,t2));
		}
		return sum;
	}
	Cmplx.theta00 = function (z,tau){
		var nome=Cmplx.exp(Cmplx.mul(new Complex(0,Math.PI),tau));
		return Cmplx.theta3(z,nome);
	}
	Cmplx.theta01 = function (z,tau){
		return Cmplx.theta00(Cmplx.add(z,0.5),tau);
	}
	Cmplx.theta10 = function (z,tau){
		var _th=Cmplx.theta00(Cmplx.add(z,Cmplx.mul(0.5,tau)),tau);
		var _exp=Cmplx.exp(Cmplx.mul(new Complex(0,Math.PI),Cmplx.add(z,Cmplx.mul(0.25,tau))));
		return Cmplx.mul(_exp,_th);
	}
	Cmplx.theta11 = function (z,tau){
		return Cmplx.theta10(Cmplx.add(z,0.5),tau);
	}
	Cmplx.weierstrassP = function (z0,w1,w20){
		var tau=Cmplx.div(w20,w1);
		if(Cmplx.imag(tau)<0){
			var temp=w1;
			w1=w20;w20=temp;
			tau=Cmplx.div(w20,w1);
		}
		var z=Cmplx.div(z0,w1);
		var w2=Cmplx.div(w20,w1);
		var a=Cmplx.theta00(0,tau);
		var b=Cmplx.theta10(0,tau);
		var c=Cmplx.theta01(z,tau);
		var d=Cmplx.theta11(z,tau);
		var A=Cmplx.pow(a,2);
		var B=Cmplx.pow(b,2);
		var C=Cmplx.pow(c,2);
		var D=Cmplx.pow(d,2);
		var S1=Cmplx.mul(A,Cmplx.mul(B,Cmplx.div(C,D)));
		var S2=Cmplx.add(Cmplx.mul(A,A),Cmplx.mul(B,B));
		return Cmplx.div(Cmplx.mul(Cmplx.sub(S1,Cmplx.div(S2,3)),Math.PI*Math.PI),Cmplx.mul(w1,w1));
	}
	Cmplx.weierstrassInvariant = function (W1,W2){
		var w1=Cmplx.mul(W1,0.5);
		var w2=Cmplx.mul(W2,0.5);
		var tau=Cmplx.div(w2,w1);
		if(tau.imag < 0){
			var temp = w1;
			w1 = w2; w2 = temp;
			tau = Cmplx.div(w2,w1);
		}
		var a=Cmplx.theta10(0,tau);
		var b=Cmplx.theta00(0,tau);
		var A=Cmplx.pow(Cmplx.div(Math.PI,w1),2);
		var A4=Cmplx.pow(a,4);
		var A8=Cmplx.mul(A4,A4);
		var B4=Cmplx.pow(b,4);
		var B8=Cmplx.mul(B4,B4);
		var g2=Cmplx.add(Cmplx.sub(A8,Cmplx.mul(A4,B4)),B8);
		var g3=Cmplx.add(Cmplx.add(Cmplx.mul(A4,A8),Cmplx.mul(-1.5,Cmplx.add(Cmplx.mul(A4,B8),Cmplx.mul(B4,A8)))),Cmplx.mul(B4,B8));
		g2=Cmplx.mul(Cmplx.mul(g2,Cmplx.mul(A,A)),1/12);
		g3=Cmplx.mul(Cmplx.mul(g3,Cmplx.mul(Cmplx.mul(A,A),A)),1/216);
		if(FOUR && FOUR.Lattice)
			return new FOUR.Lattice.G2G3(g2,g3);
		return {g2:g2,g3:g3};
	}
	Cmplx.hypergeometric2F1 = function (a, b, c, z){
		var A = B = C = N = 1;
		var sum = new Complex(1,0);
		for (n = 1; n < 17; n++){
			A *= a + n - 1; B *= b + n - 1; C *= c + n - 1; N *= n;
			sum = Cmplx.add(sum, Cmplx.mul(A / C * B / N, Cmplx.pow(z,n)));
		}
		return sum;
	}
}