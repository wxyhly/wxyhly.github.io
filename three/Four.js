/**
 *	javascript.webGL.FOUR.js:
 *	using javascript.webGL.THREE.js;
 *  using javascript.Math.Cmplx.js;
 * 	@author wxy - FiberedKnot
 *	version 1.0 - 2015
**/
FOUR = function FOUR(){};

FOUR.Edge
{
	FOUR.Edge = function (a,b){
		this.a = a;
		this.b = b;
		//Index
	}
	FOUR.Edge.reduce = function (edges) {
		var result = [], isRepeated;
		for (var i = 0; i < edges.length; i++) {
			isRepeated = false;
			for (var j = 0; j < result.length; j++) {
				if ((edges[i].a == result[j].a && edges[i].b == result[j].b)||(edges[i].a == result[j].b && edges[i].b == result[j].a)) {   
					isRepeated = true;
					break;
				}
			}
			if (!isRepeated) {
				result.push(edges[i]);
			}
		}
		return result;
	}
}

FOUR.Face
{
	FOUR.Face = function (PointIndexs){
		this.PointIndexs = PointIndexs;
	}
}

FOUR.Cell
{
	FOUR.Cell = function (FaceIndexs){
		this.FaceIndexs = FaceIndexs;
	}
}

FOUR.Mesh
{
	FOUR.Mesh = function (geometry, material, updateMatrix){
		this.Geometry = geometry;
		this.Material = material;
		this.updateMatrix = (updateMatrix == false) ? false : true;
		this.visible = true;
	}
	FOUR.Mesh.prototype.applyMatrix4 = function (M4){
		for (var VertexIndex in this.Geometry.Vertices){
			var Vertex = this.Geometry.Vertices[VertexIndex];
			Vertex.applyMatrix4(M4);
		}
	}
	FOUR.Mesh.prototype.setVisible = function (flag){
		if(this.Geometry.Edges){
			for (var EdgeIndex in this.Geometry.Edges){
				if(this.Geometry.Edges[EdgeIndex].boundTHREEobj)
					this.Geometry.Edges[EdgeIndex].boundTHREEobj.visible = flag;
			}
		}
		if(this.Geometry.Vertices){
			for (var VertexIndex in this.Geometry.Vertices){
				if(this.Geometry.Vertices[VertexIndex].boundTHREEobj)
					this.Geometry.Vertices[VertexIndex].boundTHREEobj.visible = flag;
			}
		}
		this.visible = flag;
	}
	FOUR.Mesh.prototype.createInTHREEScene = function (Scene3,Scene4){
		if(this.Material.vertexColor != null){
			for (var VertexIndex in this.Geometry.Vertices){
				var Vertex = this.Geometry.Vertices[VertexIndex];
				Vertex.boundTHREEobj = new THREE.Mesh(
					new THREE.SphereGeometry(Scene4.SphereR,Scene4.SphereSeg,Scene4.SphereSeg),
					new THREE.MeshLambertMaterial({color:this.Material.vertexColor})
				);
				Scene3.add(Vertex.boundTHREEobj);
			}
		}
		if(this.Material.edgeColor != null){
			for (var EdgeIndexs in this.Geometry.Edges){
				var Edge = this.Geometry.Edges[EdgeIndexs];
				Edge.boundTHREEobj = new THREE.Mesh(
					new THREE.CylinderGeometry(Scene4.CylinderR,Scene4.CylinderR,1,Scene4.CylinderSeg),
					new THREE.MeshLambertMaterial({color:this.Material.edgeColor})
				);
				Scene3.add(Edge.boundTHREEobj);
			}
		}
	}
}

FOUR.Euler4
{
	FOUR.Euler4 = function (xw,yw,zw,order){
		this.set(xw,yw,zw,order);
	}
	FOUR.Euler4.prototype.set = function (xw,yw,zw,order){
		this.xw = xw;
		this.yw = yw;
		this.zw = zw;
		this.order = order;
	}
	THREE.Matrix4.prototype.setRotationFromEuler4 = function(euler4){
		var x = euler4.xw, y = euler4.yw, z = euler4.zw;
		var a = Math.cos( x ), b = Math.sin( x );
		var c = Math.cos( y ), d = Math.sin( y );
		var e = Math.cos( z ), f = Math.sin( z );
		var te = this.elements;
		this.elements = [a, -b*d, -b*c*f, b*c*e, 0, c, -d*f, d*e, 0, 0, e, f, -b, -a*d, -a*c*f, a*c*e];
		return this;
	}
}

FOUR.Geometry
{
	FOUR.Geometry = function (Vertices, Edges, Faces, Cells){
		this.Vertices = Vertices;
		this.Edges = Edges;
		this.Faces = Faces;
		this.Cells = Cells;
	}
	FOUR.PushGeometry = function (Geometry3,V){
		this.Vertices = [];
		this.Edges = [];
		this.Faces = [];
		for(var i in Geometry3.vertices){
			var V0 = new THREE.Vector4(Geometry3.vertices[i].x,Geometry3.vertices[i].y,Geometry3.vertices[i].z,0);
			this.Vertices.push(V0);
			this.Vertices.push(new THREE.Vector4(Geometry3.vertices[i].x+V.x,Geometry3.vertices[i].y+V.y,Geometry3.vertices[i].z+V.z,V.w));
			this.Edges.push(new FOUR.Edge(2*i,2*i+1));
		}
		for(var i in Geometry3.faces){
			var ti = Geometry3.faces[i];
			if(ti instanceof THREE.Face3){
				this.Faces.push(new FOUR.Face([ti.a*2,ti.b*2,ti.c*2]));
				this.Faces.push(new FOUR.Face([ti.a*2+1,ti.b*2+1,ti.c*2+1]));
				this.Edges.push(new FOUR.Edge(ti.a*2,ti.b*2));
				this.Edges.push(new FOUR.Edge(ti.a*2,ti.c*2));
				this.Edges.push(new FOUR.Edge(ti.c*2,ti.b*2));
				this.Edges.push(new FOUR.Edge(ti.a*2+1,ti.b*2+1));
				this.Edges.push(new FOUR.Edge(ti.a*2+1,ti.c*2+1));
				this.Edges.push(new FOUR.Edge(ti.c*2+1,ti.b*2+1));
			}else if (ti instanceof THREE.Face4){
				this.Faces.push(new FOUR.Face([ti.a*2,ti.b*2,ti.c*2,ti.d*2]));
				this.Faces.push(new FOUR.Face([ti.a*2+1,ti.b*2+1,ti.c*2+1,ti.d*2+1]));
				this.Edges.push(new FOUR.Edge(ti.a*2,ti.b*2));
				this.Edges.push(new FOUR.Edge(ti.b*2,ti.c*2));
				this.Edges.push(new FOUR.Edge(ti.c*2,ti.d*2));
				this.Edges.push(new FOUR.Edge(ti.a*2,ti.d*2));
				this.Edges.push(new FOUR.Edge(ti.a*2+1,ti.b*2+1));
				this.Edges.push(new FOUR.Edge(ti.b*2+1,ti.c*2+1));
				this.Edges.push(new FOUR.Edge(ti.c*2+1,ti.d*2+1));
				this.Edges.push(new FOUR.Edge(ti.a*2+1,ti.d*2+1));
			}
		}
		this.Edges = FOUR.Edge.reduce(this.Edges);
		for ( var i = Geometry3.vertices.length; i < this.Edges.length; i++ ){
			if(this.Edges[i].a%2==0&&this.Edges[i].b%2==0)
				this.Faces.push(new FOUR.Face([this.Edges[i].a,this.Edges[i].b,this.Edges[i].b+1,this.Edges[i].a+1]));
		}
	}
	//FOUR.TorusGeometry._uneSeg = function (){
		
	//};
	FOUR.TorusGeometry = function (Geometry3,P,D,seg){
		this.Vertices = [];
		this.Edges = [];
		this.Faces = [];
		var rotM = D.generateRotation(2*Math.PI/seg)
		for (var i in Geometry3.vertices){
			var K = new THREE.Vector3().subVectors(Geometry3.vertices[i],P);
			var KK = new THREE.Vector4(K.x,K.y,K.z,0);
			for (var j = 0; j < seg; j++){
				this.Vertices[seg*i+j] = KK.clone();
				KK.applyMatrix4(rotM);
				if(j==seg-1)
					this.Edges.push(new FOUR.Edge(i*seg+j,i*seg));
				else
					this.Edges.push(new FOUR.Edge(i*seg+j,i*seg+j+1));
			}
		}
		for(var i in Geometry3.faces){
			for (var j = 0; j < seg; j++){
				var ti = Geometry3.faces[i];
				if(ti instanceof THREE.Face3){
					this.Faces.push(new FOUR.Face([ti.a*seg+j,ti.b*seg+j,ti.c*seg+j]));
					this.Edges.push(new FOUR.Edge(ti.a*seg+j,ti.b*seg+j));
					this.Edges.push(new FOUR.Edge(ti.a*seg+j,ti.c*seg+j));
					this.Edges.push(new FOUR.Edge(ti.c*seg+j,ti.b*seg+j));
				}else if (ti instanceof THREE.Face4){
					this.Faces.push(new FOUR.Face([ti.a*seg+j,ti.b*seg+j,ti.c*seg+j,ti.d*seg+j]));
					this.Edges.push(new FOUR.Edge(ti.a*seg+j,ti.b*seg+j));
					this.Edges.push(new FOUR.Edge(ti.b*seg+j,ti.c*seg+j));
					this.Edges.push(new FOUR.Edge(ti.c*seg+j,ti.d*seg+j));
					this.Edges.push(new FOUR.Edge(ti.a*seg+j,ti.d*seg+j));
				}
			}
		}
		this.Edges = FOUR.Edge.reduce(this.Edges);
		for ( var i = Geometry3.vertices.length*seg; i < this.Edges.length; i++ ){
			if(this.Edges[i].a%seg==0&&this.Edges[i].b%seg==0){
				//var farrce = [];
				for (var j = 0; j < seg; j++){
					if(j!=seg-1){
						//this.Edges.push(new FOUR.Edge(i*seg+j,i*seg));
						this.Faces.push(new FOUR.Face([this.Edges[i].a+j,this.Edges[i].b+j,this.Edges[i].b+1+j,this.Edges[i].a+1+j]));
					}else
						this.Faces.push(new FOUR.Face([this.Edges[i].a+j,this.Edges[i].b+j,this.Edges[i].b,this.Edges[i].a]));
				}
			}	
		}
	}
	FOUR.SphereringGeometry = function (R,r,segu,segv,seg){
		this.Vertices = [];
		this.Edges = [];
		this.Faces = [];
		var rotM = 2*Math.PI/seg;
		var rR = r/R;
		var Geometry3 = new THREE.SphereGeometry(R,segu,segv);
		for (var i in Geometry3.vertices){
			for (var j = 0; j < seg; j++){
				var KK = new THREE.Vector4(Geometry3.vertices[i].x,Geometry3.vertices[i].y,Geometry3.vertices[i].z,0);
				this.Vertices[seg*i+j] = KK.multiplyScalar(1-Math.cos(rotM*j)*rR).add(new THREE.Vector4(0,0,0,Math.sin(rotM*j)*rR))
				if(j==seg-1)
					this.Edges.push(new FOUR.Edge(i*seg+j,i*seg));
				else
					this.Edges.push(new FOUR.Edge(i*seg+j,i*seg+j+1));
			}
		}
		for(var i in Geometry3.faces){
			for (var j = 0; j < seg; j++){
				var ti = Geometry3.faces[i];
				if(ti instanceof THREE.Face3){
					this.Faces.push(new FOUR.Face([ti.a*seg+j,ti.b*seg+j,ti.c*seg+j]));
					this.Edges.push(new FOUR.Edge(ti.a*seg+j,ti.b*seg+j));
					this.Edges.push(new FOUR.Edge(ti.a*seg+j,ti.c*seg+j));
					this.Edges.push(new FOUR.Edge(ti.c*seg+j,ti.b*seg+j));
				}else if (ti instanceof THREE.Face4){
					this.Faces.push(new FOUR.Face([ti.a*seg+j,ti.b*seg+j,ti.c*seg+j,ti.d*seg+j]));
					this.Edges.push(new FOUR.Edge(ti.a*seg+j,ti.b*seg+j));
					this.Edges.push(new FOUR.Edge(ti.b*seg+j,ti.c*seg+j));
					this.Edges.push(new FOUR.Edge(ti.c*seg+j,ti.d*seg+j));
					this.Edges.push(new FOUR.Edge(ti.a*seg+j,ti.d*seg+j));
				}
			}
		}
		this.Edges = FOUR.Edge.reduce(this.Edges);
		for ( var i = Geometry3.vertices.length*seg; i < this.Edges.length; i++ ){
			if(this.Edges[i].a%seg==0&&this.Edges[i].b%seg==0){
				//var farrce = [];
				for (var j = 0; j < seg; j++){
					if(j!=seg-1){
						//this.Edges.push(new FOUR.Edge(i*seg+j,i*seg));
						this.Faces.push(new FOUR.Face([this.Edges[i].a+j,this.Edges[i].b+j,this.Edges[i].b+1+j,this.Edges[i].a+1+j]));
					}else
						this.Faces.push(new FOUR.Face([this.Edges[i].a+j,this.Edges[i].b+j,this.Edges[i].b,this.Edges[i].a]));
				}
			}	
		}
	}
		
	FOUR.DuoprismGeometry = function (shape1,shape2){
		var XYV = shape1.getPoints();
		var ZTV = shape2.getPoints();
		this.Vertices = [];
		this.Edges = [];
		this.Faces = [];
		for (var i in XYV){
			for (var j in ZTV){
				this.Vertices.push(
					new THREE.Vector4(XYV[i].x,XYV[i].y,ZTV[j].x,ZTV[j].y)
				);
				this.Edges.push(new FOUR.Edge(
					i*ZTV.length+Number(j),
					i*ZTV.length+((j<ZTV.length-1)?Number(j)+1:0)
				));
				this.Faces.push(new FOUR.Face([
					i*ZTV.length+Number(j),
					i*ZTV.length+((j<ZTV.length-1)?Number(j)+1:0),
					((i<XYV.length-1)?Number(i)+1:0)*ZTV.length+((j<ZTV.length-1)?Number(j)+1:0),
					((i<XYV.length-1)?Number(i)+1:0)*ZTV.length+Number(j)
				]));
				this.Edges.push(new FOUR.Edge(
					i*ZTV.length+Number(j),
					((i<XYV.length-1)?Number(i)+1:0)*ZTV.length+Number(j)
				));
			}
		}
		for (var i in XYV){
			this.Faces.push(new FOUR.Face([]));
			for (var j in ZTV){
				this.Faces[this.Faces.length-1].PointIndexs.push(i*ZTV.length+Number(j));
			}
		}
		for (var j in ZTV){
			this.Faces.push(new FOUR.Face([]));
			for (var i in XYV){
				this.Faces[this.Faces.length-1].PointIndexs.push(i*ZTV.length+Number(j));
			}
		}
	}
	FOUR.DuocylinderGeometry = function (u ,v){
		var s1 = new THREE.Shape();
		var s2 = new THREE.Shape();
		s1.moveTo(1,0);
		s2.moveTo(1,0);
		for(var i = 1;i<u;i++){
			s1.lineTo(Math.cos(Math.PI*2/u*i),Math.sin(Math.PI*2/u*i));
		}
		for(var j = 1;j<v;j++){
			s2.lineTo(Math.cos(Math.PI*2/v*j),Math.sin(Math.PI*2/v*j));
		}
		return new FOUR.DuoprismGeometry(s1,s2);
	}
	FOUR.SimplexGeometry = function (p1,p2,p3,p4,p5){
		this.Vertices = [];
		this.Edges = [];
		this.Faces = [];
		this.Vertices.push(p1);
		this.Vertices.push(p2);
		this.Vertices.push(p3);
		this.Vertices.push(p4);
		this.Vertices.push(p5);
		for (var i = 0; i != 4; i++) { 
			for (var j = i + 1; j != 5; j++){
				this.Edges.push(new FOUR.Edge(i, j));
			} 
		}
		for (var i = 0; i != 3; i++) { 
			for (var j = i + 1; j != 4; j++){
				for (var k = j + 1; k != 5; j++){
					this.Faces.push(new FOUR.Face([i,j,k]));
				}
			} 
		}
	}
	FOUR.TesseractGeometry = function (a,b,c,d){
		this.Vertices = [];
		for(var i = 0; i < 16; i++){
			var _x = ((i & 1) > 0) ? 1 : -1;
			var _y = ((i & 2) > 0) ? 1 : -1;
			var _z = ((i & 4) > 0) ? 1 : -1;
			var _w = ((i & 8) > 0) ? 1 : -1;
			this.Vertices.push(new THREE.Vector4(a*_x,b*_y,c*_z,d*_w));
		}
		this.Edges = [];
		this.Faces = [];
		for(var i = 0; i < 15; i++){
			for(var j = 1; j < 16; j *= 2){
				if((i & j) == 0) this.Edges.push(new FOUR.Edge(i,i+j));
			}
		}
		for(var i in this.Edges){
			var v1 = this.Edges[i].a;
			var v2 = this.Edges[i].b;
			for(var j=1;j<16;j*=2){
				if((v1 & j) == 0 && (v2-v1) < j){
					this.Faces.push(new FOUR.Face([v1,v2,v2+j,v1+j]));
				}
			}
		}
	}
	FOUR.HexadecachoronGeometry = function (radius){
		this.Vertices = [];
		this.Edges = [];
		this.faces = [];
		this.Vertices.push(new THREE.Vector4(radius,0,0,0));
		this.Vertices.push(new THREE.Vector4(0,radius,0,0));
		this.Vertices.push(new THREE.Vector4(0,0,radius,0));
		this.Vertices.push(new THREE.Vector4(0,0,0,radius));
		this.Vertices.push(new THREE.Vector4(-radius,0,0,0));
		this.Vertices.push(new THREE.Vector4(0,-radius,0,0));
		this.Vertices.push(new THREE.Vector4(0,0,-radius,0));		
		this.Vertices.push(new THREE.Vector4(0,0,0,-radius));
		for (var i = 0; i != 7; i++){
			for (var j = i + 1; j != 8; j++){
				if((j-i)!=4)this.Edges.push(new FOUR.Edge(i, j));
			}
		}
	}
	FOUR.IcositetrachoronGeometry = function (radius){
		this.Vertices = [];
		this.Edges = [];	
		this.Vertices.push(new THREE.Vector4(-radius,0,0,0));
		this.Vertices.push(new THREE.Vector4(0,-radius,0,0));
		this.Vertices.push(new THREE.Vector4(0,0,-radius,0));		
		this.Vertices.push(new THREE.Vector4(0,0,0,-radius));
		this.Vertices.push(new THREE.Vector4(radius,0,0,0));
		this.Vertices.push(new THREE.Vector4(0,radius,0,0));
		this.Vertices.push(new THREE.Vector4(0,0,radius,0));
		this.Vertices.push(new THREE.Vector4(0,0,0,radius));
		for (var i = 0; i < 16; i++){
			var _x = ((i & 1) > 0) ? 0.5 : -0.5;
			var _y = ((i & 2) > 0) ? 0.5 : -0.5;
			var _z = ((i & 4) > 0) ? 0.5 : -0.5;
			var _w = ((i & 8) > 0) ? 0.5 : -0.5;
			this.Vertices.push(new THREE.Vector4(radius*_x,radius*_y,radius*_z,radius*_w));
		}
		for(var i = 0; i < 15; i++){
			for(var j = 1; j < 16; j *= 2){
				if((i & j) == 0) this.Edges.push(new FOUR.Edge(i+8,i+j+8));
			}
		}
		for(var i = 0; i < 16; i++){
			for (var j = 0; j < 4; j++){
				if((i & (1 << j)) > 0)this.Edges.push(new FOUR.Edge(i+8,j+4));
				else this.Edges.push(new FOUR.Edge(i+8,j))
			}
		}
	}
}

FOUR.Material
{
	FOUR.FrameMaterial = function (vertexColor, edgeColor, vertexSize, edgeSize){
		this.Material = "FrameMaterial";
		this.vertexColor = vertexColor;
		this.edgeColor = edgeColor;
		this.vertexSize = (vertexSize) ? vertexSize : 0.1;
		this.edgeSize = (edgeSize) ? edgeSize : 0.05;
	}
	FOUR.BlockMaterial = function (blockColor){
		this.Material = "BlockMaterial";
		this.blockColor = blockColor;
	}
}

FOUR.Camera4
{	FOUR.Camera4 = function (){
		this.projectMatrix = new THREE.Matrix4();
		this.up = new THREE.Vector4(1,2,3,4);
		this.right = new THREE.Vector4(4,3,2,1);
	}
	FOUR.Camera4.prototype.setFromEuler4 = function (euler4){
		this.projectMatrix = this.projectMatrix.setRotationFromEuler4(euler4);
	}
	FOUR.Camera4.prototype.lookAt = function (v){
		this.front = this.up.wedge(this.right).wedge(v);
		FOUR.Orthog(v,this.up,this.right,this.front);
		this.projectMatrix.elements=[
			this.up.x,this.front.x,this.right.x,v.x,
			this.up.y,this.front.y,this.right.y,v.y,
			this.up.z,this.front.z,this.right.z,v.z,
			this.up.w,this.front.w,this.right.w,v.w
		];
		this.projectMatrix.getInverse(this.projectMatrix);
	}
	FOUR.OrthographicCamera = function (obj){
		FOUR.Camera4.call(this);
		if(obj instanceof FOUR.Euler4)this.projectMatrix = this.projectMatrix.setRotationFromEuler4(obj);
	}
	FOUR.OrthographicCamera.prototype = Object.create(FOUR.Camera4.prototype);
	FOUR.OrthographicCamera.prototype.applyVector4 = function (V){
		var V3 = new THREE.Vector4();
		var e = this.projectMatrix.elements;
		//V3.x = e[0] * V.w + e[1] * V.y + e[2] * V.z + e[3] * V.x;
		//V3.y = e[4] * V.w + e[5] * V.y + e[6] * V.z + e[7] * V.x;
		//V3.z = e[8] * V.w + e[9] * V.y + e[10] * V.z + e[11] * V.x;
		V3 = V.clone().applyMatrix4(this.projectMatrix)
		return new THREE.Vector3(V3.x,V3.y,V3.z);
	}
	FOUR.Orthog = function (a1,a2,a3,a4){
		var a11 = a1.dot(a1);
		var b2 = new THREE.Vector4().subVectors(a2,a1.clone().multiplyScalar(a2.dot(a1)/a11));
		var b22 = b2.dot(b2);
		var b3 = new THREE.Vector4().subVectors(a3,a1.clone().multiplyScalar(a3.dot(a1)/a11)).sub(b2.clone().multiplyScalar(a3.dot(b2)/b22));
		var b4 = new THREE.Vector4().subVectors(a4,a1.clone().multiplyScalar(a4.dot(a1)/a11)).sub(b2.clone().multiplyScalar(a4.dot(b2)/b22)).sub(b3.clone().multiplyScalar(a4.dot(b3)/b3.dot(b3)));
		a1.normalize();
		a2.copy(b2.normalize());
		a3.copy(b3.normalize());
		a4.copy(b4.normalize());
	}
	
	FOUR.PerspectiveCamera = function (obj,distance,Stereographic){
		FOUR.Camera4.call(this);
		if(obj instanceof FOUR.Euler4)this.projectMatrix = this.projectMatrix.setRotationFromEuler4(obj);
		this.distance = distance;
		this.Stereographic = (Stereographic) || Stereographic;
		this.maxVertexRadius = 4;
		this.maxEdgeRadius = 2;
		
	}
	FOUR.PerspectiveCamera.prototype = Object.create(FOUR.Camera4.prototype);
	FOUR.PerspectiveCamera.prototype.applyVector4 = function (v){
		var V, V3 = new THREE.Vector4();
		var e = this.projectMatrix.elements;
		if(this.Stereographic){
			V = v.clone().normalize().multiplyScalar(this.distance);
		}else V = v;
		V3 = V.clone().applyMatrix4(this.projectMatrix);
		// / V3.w = e[12] * V.w + e[13] * V.y + e[14] * V.z + e[15] * V.x+this.distance;
		V3.w += this.distance;
		if(V3.w == 0){return new THREE.Vector4(100000,100000,100000,100000);}
		var VV = new THREE.Vector3(V3.x,V3.y,V3.z).divideScalar(V3.w);
		VV.w = V3.w;
		//if( w + this.distance < 0) console.log ( "error in FOUR.PerspectiveCamera: distance is too low.");
		return VV
	}
}

FOUR.Scene4
{
	FOUR.Scene4 = function (scene3){
		this.scene3 = scene3;
		this.children = [];
		this.SphereSeg = this.CylinderSeg = 16;
		this.SphereR = 0.1; this.CylinderR = 0.05;
	}
	FOUR.Scene4.prototype.add = function (obj4){
		this.children.push(obj4);
		obj4.createInTHREEScene(this.scene3,this);
	}
	FOUR.Scene4.prototype.remove = function (obj4){
		for(var i in obj4.Geometry.Vertices){
			this.scene3.remove(obj4.Geometry.Vertices[i].boundTHREEobj);
		}
		for(var i in obj4.Geometry.Edges){
			this.scene3.remove(obj4.Geometry.Edges[i].boundTHREEobj);
		}
		var index = this.children.indexOf(obj4);
		if(index!=-1){
			this.children[index]={type:"removed"};
		}
	}
}

FOUR.Renderer4
{
	FOUR.Renderer4 = function (scene4,camera4){
		this.scene4 = scene4;
		this.camera4 = camera4;
	}
	FOUR.Renderer4.prototype.render = function (){
		for (var mesh in this.scene4.children){
			var thisMesh = this.scene4.children[mesh];
			if(thisMesh.Geometry && !(thisMesh.updateMatrix == false) && !(thisMesh.visible == false)){
				//some might be removed
				var isFM = thisMesh.Material.Material == "FrameMaterial";
				
				for (var VertexIndex in thisMesh.Geometry.Vertices){
					var Vertex = thisMesh.Geometry.Vertices[VertexIndex];
					Vertex.projection = this.camera4.applyVector4(Vertex);
					if(!isFM || thisMesh.Material.vertexColor){
						Vertex.boundTHREEobj.position.set(Vertex.projection.x,Vertex.projection.y,Vertex.projection.z);
						if (this.camera4 instanceof FOUR.PerspectiveCamera){
							var scale = Math.abs(1/Vertex.projection.w);
							scale = Math.min(this.camera4.maxVertexRadius,scale);
							Vertex.boundTHREEobj.scale.set(scale, scale, scale);
						}
					}
				}
				if(!isFM || thisMesh.Material.edgeColor){
					for (var EdgeIndex in thisMesh.Geometry.Edges){
						var Edge = thisMesh.Geometry.Edges[EdgeIndex];
						var p1 = thisMesh.Geometry.Vertices[Edge.a].projection;
						var p2 = thisMesh.Geometry.Vertices[Edge.b].projection;
						var L = Math.sqrt((p1.x - p2.x)*(p1.x - p2.x)+(p1.y - p2.y)*(p1.y - p2.y)+(p1.z - p2.z)*(p1.z - p2.z));
						var v = new THREE.Vector3(p2.z - p1.z, 0, p1.x - p2.x).normalize();
						var quaternion = new THREE.Quaternion(0.2,0.4,0.5);
						if(this.camera4 instanceof FOUR.PerspectiveCamera){
							var scale = 2/(Math.abs(p1.w)+Math.abs(p2.w));
							scale =  Math.min(this.camera4.maxEdgeRadius,scale)
						}else{var scale = 1}
						Edge.boundTHREEobj.setRotationFromAxisAngle(v, -Math.acos((p1.y - p2.y)/L));
						if(isFM && !thisMesh.Material.vertexColor)
							Edge.boundTHREEobj.scale.set(scale,L*1.1,scale);
							//if don't display ball, then extend edgs.
						else
							Edge.boundTHREEobj.scale.set(scale,L,scale);
						Edge.boundTHREEobj.position.set((p1.x + p2.x)/2, (p1.y + p2.y)/2, (p1.z + p2.z)/2);
					}
				}
			}
		}
	}
}

FOUR.Section
{
	FOUR.Section = function (geometry,hyperplane){
		this.geometry = geometry;
		this.hyperplane = hyperplane;
	}
	FOUR.Section.prototype.excute = function (){
		var edges = [];
		var points = [];
		for(var i in this.geometry.Faces){
			var count = 0;
			var a,inP;
			for(var j in this.geometry.Faces[i].PointIndexs){
				var temp = (j<this.geometry.Faces[i].PointIndexs.length-1)?(Number(j)+1):0
				var Line = {
					a : this.geometry.Vertices[this.geometry.Faces[i].PointIndexs[j]],
					b : this.geometry.Vertices[this.geometry.Faces[i].PointIndexs[temp]]
				};
				inP = this.hyperplane.intersection_line(Line);
				if(inP != 0){
					count++;
					if(count == 1) a = inP;
					else if(count == 2) {
						points.push(a);
						points.push(inP);
						edges.push({a: points.length-2, b: points.length-1});
					}
				}
			}
		}
		return new FOUR.Geometry(points,edges);
	}
}

FOUR.HyperPlane
{
	FOUR.HyperPlane = function (V4, P){
		this.normal = V4;
		this.P = P;
	}
	FOUR.HyperPlane.prototype.intersection_line = function (line){
		var te = new THREE.Vector4;
		var p_an = this.normal.dot(te.subVectors(this.P,line.a));
		var p_bn = this.normal.dot(te.subVectors(this.P,line.b));
		if ((p_an < 0) ^ (p_bn < 0)){
			var b_an = this.normal.dot(te.subVectors(line.b,line.a));
			var te1 = new THREE.Vector4;
			var te2 = new THREE.Vector4;
			te1.copy(line.b);
			te2.copy(line.a);
			te1.multiplyScalar(p_an/b_an);
			te2.multiplyScalar(p_bn/b_an);
			return te.subVectors(te1,te2);
		}else return 0;//0 represent non intersection
	}
}

FOUR.Hopf
{
	FOUR.Hopf = function (order){
		if(typeof order == "string"){
			var O = [];
			for(var i = 0; i < 4; i++){
				switch(order.charAt(i)){
					case '1':
						O[i*4] = 1;O[i*4+1] = O[i*4+2] = O[i*4+3] = 0;
					break;
					case '2':
						O[i*4+1] = 1;O[i*4] = O[i*4+2] = O[i*4+3] = 0;
					break;
					case '3':
						O[i*4+2] = 1;O[i*4+1] = O[i*4] = O[i*4+3] = 0;
					break;
					case '4':
						O[i*4+3] = 1;O[i*4+1] = O[i*4+2] = O[i*4] = 0;
					break;
				}
			}
			this.order = {elements: O};
		}else
			this.order = order;
	}
	FOUR.Hopf.prototype.tov4 = function(z1,z2){
		var V = new THREE.Vector4(z1.real,z1.imag,z2.real,z2.imag);
		V.applyMatrix4(this.order);
		return V;
	}
	FOUR.Hopf.prototype.toz1z2 = function(p){
		var V = new THREE.Vector4(p.x,p.y,p.z,p.w);
		var M = new THREE.Matrix4().getInverse(this.order);
		V.applyMatrix4(M);
		return {
			z1:new Complex(V.x,V.y),
			z2:new Complex(V.z,V.w)
		};
	}
	FOUR.Hopf.prototype.getTangent = function(p){
		var Z = this.toz1z2(p);
		var Z1=Cmplx.mul(Cmplx.I,Z.z1);
		var Z2=Cmplx.mul(Cmplx.I,Z.z2);
		return this.tov4(Z1,Z2);
	}
	FOUR.Hopf.prototype.coordinate = function(eta,k1,k2){
		z1 = new Complex(Math.cos(k1+k2)*Math.sin(eta),Math.sin(k1+k2)*Math.sin(eta));
		z2 = new Complex(Math.cos(k1-k2)*Math.cos(eta),Math.sin(k1-k2)*Math.cos(eta));
		return this.tov4(z1,z2);
	}
	FOUR.Hopf.prototype.getBivector = function (k){
		var R = Cmplx.div(1,Math.sqrt(1+Cmplx.sqrabs(k)));// R = sqrt 1/(1+|k|^2)
		var z1 = new Complex(R,0);
		var e1 = this.tov4(z1,Cmplx.mul(z1,k));//new THREE.Vector4(R,0,k.real*R,k.imag*R);
		var z2 = new Complex(0,R);
		var e2 = this.tov4(z2,Cmplx.mul(z2,k));//new THREE.Vector4(0,R,-k.imag*R,k.real*R);
		//this.tov4(z1,z2);
		return e1.wedge(e2);
	}
	FOUR.Hopf.prototype.GenerateHopfCirles = function (k, N){
		var R = Cmplx.div(1,Math.sqrt(1+Cmplx.sqrabs(k)));// R = sqrt 1/(1+|k|^2)
		var step = Math.PI * 2 / N;
		var Count = 0;
		var Ps = [], Es = [];
		for (var i = 0; i < Math.PI * 2; i += step, Count++){
			var z1 = new Complex(R * Math.cos(i),R * Math.sin(i));
			var z2 = Cmplx.mul(z1, k);
			Ps.push(this.tov4(z1,z2));
			Es.push(new FOUR.Edge(Count,(Count > 0)?(Count - 1) : N - 1));
		}
		return new FOUR.Geometry(Ps,Es);
	}
}

FOUR.Controls = function ( object, domElement, object4) {

	var _this = this;
	var STATE = { NONE: -1, ROTATE: 0, ZOOM: 10,ROTATE_T:1, ROTATE_XYZ: 2, TOUCH_ROTATE: 3, TOUCH_ZOOM_PAN: 4 };

	this.object = object;
	this.domElement = ( domElement !== undefined ) ? domElement : document;

	// API

	this.enabled = true;

	this.screen = { left: 0, top: 0, width: 0, height: 0 };

	this.rotateSpeed = 1.0;
	this.zoomSpeed = 1.2;
	this.panSpeed = 0.3;

	this.noRotate = false;
	this.noZoom = false;
	this.noPan = false;
	this.noRotate_t = false;
	this.noRotate_xyz = false;
	
	this.staticMoving = false;
	this.dynamicDampingFactor = 0.2;

	this.minDistance = 0;
	this.maxDistance = Infinity;

	// internals

	this.target = new THREE.Vector3();

	var EPS = 0.000001;

	var lastPosition = new THREE.Vector3();

	var _state = STATE.NONE,
	_prevState = STATE.NONE,

	_eye = new THREE.Vector3(),

	_movePrev = new THREE.Vector2(),
	_moveCurr = new THREE.Vector2(),
	
	_movePrevs = new THREE.Vector2(),
	_moveCurrs = new THREE.Vector2(),
	
	_movePrevse = new THREE.Vector2(),
	_moveCurrse = new THREE.Vector2(),

	_lastAxis = new THREE.Vector3(),
	_lastAxis2 = new FOUR.Bivector(),
	_lastAngle = 0,
	_lastAngle2 = 0,
	_lastAngle3 = 0,

	_zoomStart = new THREE.Vector2(),
	_zoomEnd = new THREE.Vector2(),

	_touchZoomDistanceStart = 0,
	_touchZoomDistanceEnd = 0,

	_panStart = new THREE.Vector2(),
	_panEnd = new THREE.Vector2();

	// for reset

	this.target0 = this.target.clone();
	this.position0 = this.object.position.clone();
	this.up0 = this.object.up.clone();

	// events

	var changeEvent = { type: 'change' };
	var startEvent = { type: 'start' };
	var endEvent = { type: 'end' };
	
	this.keyCode = 0;
	this.keyDown = false;

	// methods

	this.handleResize = function () {

		if ( this.domElement === document ) {

			this.screen.left = 0;
			this.screen.top = 0;
			this.screen.width = window.innerWidth;
			this.screen.height = window.innerHeight;

		} else {

			var box = this.domElement.getBoundingClientRect();
			// adjustments come from similar code in the jquery offset() function
			var d = this.domElement.ownerDocument.documentElement;
			this.screen.left = box.left + window.pageXOffset - d.clientLeft;
			this.screen.top = box.top + window.pageYOffset - d.clientTop;
			this.screen.width = box.width;
			this.screen.height = box.height;

		}

	};

	this.handleEvent = function ( event ) {

		if ( typeof this[ event.type ] == 'function' ) {

			this[ event.type ]( event );

		}

	};

	var getMouseOnScreen = ( function () {

		var vector = new THREE.Vector2();

		return function ( pageX, pageY ) {

			vector.set(
				( pageX - _this.screen.left ) / _this.screen.width,
				( pageY - _this.screen.top ) / _this.screen.height
			);

			return vector;

		};

	}() );

	var getMouseOnCircle = ( function () {

		var vector = new THREE.Vector2();

		return function ( pageX, pageY ) {

			vector.set(
				( ( pageX - _this.screen.width * 0.5 - _this.screen.left ) / ( _this.screen.width * 0.5 ) ),
				( ( _this.screen.height + 2 * ( _this.screen.top - pageY ) ) / _this.screen.width ) // screen.width intentional
			);

			return vector;
		};

	}() );

	this.rotateCamera = (function() {

		var axis = new THREE.Vector3(),
			quaternion = new THREE.Quaternion(),
			eyeDirection = new THREE.Vector3(),
			objectUpDirection = new THREE.Vector3(),
			objectSidewaysDirection = new THREE.Vector3(),
			moveDirection = new THREE.Vector3(),
			angle;

		return function () {

			moveDirection.set( _moveCurr.x - _movePrev.x, _moveCurr.y - _movePrev.y, 0 );
			angle = moveDirection.length();

			if ( angle ) {
				_this.active3 = true;
				_eye.copy( _this.object.position ).sub( _this.target );

				eyeDirection.copy( _eye ).normalize();
				objectUpDirection.copy( _this.object.up ).normalize();
				objectSidewaysDirection.crossVectors( objectUpDirection, eyeDirection ).normalize();

				objectUpDirection.setLength( _moveCurr.y - _movePrev.y );
				objectSidewaysDirection.setLength( _moveCurr.x - _movePrev.x );

				moveDirection.copy( objectUpDirection.add( objectSidewaysDirection ) );

				axis.crossVectors( moveDirection, _eye ).normalize();

				angle *= _this.rotateSpeed;
				quaternion.setFromAxisAngle( axis, angle );

				_eye.applyQuaternion( quaternion );
				_this.object.up.applyQuaternion( quaternion );

				_lastAxis.copy( axis );
				_lastAngle = angle;

			}

			else if ( !_this.staticMoving && _lastAngle ) {
				_this.active3 = true;
				_lastAngle *= Math.sqrt( 1.0 - _this.dynamicDampingFactor );
				_eye.copy( _this.object.position ).sub( _this.target );
				quaternion.setFromAxisAngle( _lastAxis, _lastAngle );
				_eye.applyQuaternion( quaternion );
				_this.object.up.applyQuaternion( quaternion );

			}

			_movePrev.copy( _moveCurr );

		};

	}());


	this.zoomCamera = function () {

		var factor;

		if ( _state === STATE.TOUCH_ZOOM_PAN ) {
			_this.active3 = true;
			factor = _touchZoomDistanceStart / _touchZoomDistanceEnd;
			_touchZoomDistanceStart = _touchZoomDistanceEnd;
			_eye.multiplyScalar( factor );

		} else {

			factor = 1.0 + ( _zoomEnd.y - _zoomStart.y ) * _this.zoomSpeed;

			if ( factor !== 1.0 && factor > 0.0 ) {
				_this.active3 = true;
				_eye.multiplyScalar( factor );

				if ( _this.staticMoving ) {

					_zoomStart.copy( _zoomEnd );

				} else {

					_zoomStart.y += ( _zoomEnd.y - _zoomStart.y ) * this.dynamicDampingFactor;

				}

			}

		}

	};

	this.panCamera = (function() {

		var mouseChange = new THREE.Vector2(),
			objectUp = new THREE.Vector3(),
			pan = new THREE.Vector3();

		return function () {

			mouseChange.copy( _panEnd ).sub( _panStart );

			if ( mouseChange.lengthSq() ) {
				_this.active3 = true;
				mouseChange.multiplyScalar( _eye.length() * _this.panSpeed );

				pan.copy( _eye ).cross( _this.object.up ).setLength( mouseChange.x );
				pan.add( objectUp.copy( _this.object.up ).setLength( mouseChange.y ) );

				_this.object.position.add( pan );
				_this.target.add( pan );

				if ( _this.staticMoving ) {

					_panStart.copy( _panEnd );

				} else {

					_panStart.add( mouseChange.subVectors( _panEnd, _panStart ).multiplyScalar( _this.dynamicDampingFactor ) );

				}

			}
		};

	}());
	
this.rotateTCamera = (function() {

		var quaternion = new THREE.Quaternion(),
			moveDirection = new THREE.Vector3(),
			angle, v, bivector4;

		return function () {
			moveDirection.set( _moveCurrs.x - _movePrevs.x, _moveCurrs.y - _movePrevs.y, 0 );
			angle = moveDirection.length();

			if ( angle ) {
				_this.active3 = _this.active4 = true;
				v = new THREE.Vector3(_this.object.matrix.elements[8],_this.object.matrix.elements[9],_this.object.matrix.elements[10]);
				moveDirection.x *= _this.rotateSpeed;
				moveDirection.y *= _this.rotateSpeed;
				bivector4 = new THREE.Vector4(v.x,v.y,v.z,0).wedge(new THREE.Vector4(0,0,0,1));
				object4.projectMatrix = (bivector4.generateRotation(moveDirection.y).multiply(object4.projectMatrix));
				
				quaternion.setFromAxisAngle( v, moveDirection.x );
				_eye.applyQuaternion( quaternion );
				_this.object.up.applyQuaternion( quaternion );

				_lastAxis.copy( v );
				_lastAxis2.copy( bivector4 );
				_lastAngle = moveDirection.x;
				_lastAngle2 = moveDirection.y;

			}

			else if ( !_this.staticMoving && (_lastAngle||_lastAngle2) ) {
				_this.active3 = _this.active4 = true;
				_lastAngle *= Math.sqrt( 1.0 - _this.dynamicDampingFactor );
				_lastAngle2 *= Math.sqrt( 1.0 - _this.dynamicDampingFactor );
				quaternion.setFromAxisAngle( _lastAxis, _lastAngle );
				_eye.applyQuaternion( quaternion );
				_this.object.up.applyQuaternion( quaternion );
				object4.projectMatrix = _lastAxis2.generateRotation(_lastAngle2).multiply(object4.projectMatrix);
			}

			_movePrevs.copy( _moveCurrs );

		};

	}());	
	
this.rotateXYZCamera = (function() {
		var moveDirection = new THREE.Vector3(),
			angle, v, v2, v3, bivector4;
		return function () {
			moveDirection.set( _moveCurrse.x - _movePrevse.x, _moveCurrse.y - _movePrevse.y, 0 );
			angle = moveDirection.length();
			if ( angle ) {
				_this.active3 = _this.active4 = true;
				v = new THREE.Vector3(_this.object.matrix.elements[8],_this.object.matrix.elements[9],_this.object.matrix.elements[10]);
				angle *= _this.rotateSpeed;
				v2 = _this.object.up.clone().normalize().multiplyScalar(moveDirection.y);
				v3 = _this.object.up.clone().cross(v).normalize().multiplyScalar(moveDirection.x).add(v2);
				bivector4 = new THREE.Vector4(v3.x,v3.y,v3.z,0).wedge(new THREE.Vector4(0,0,0,1));
				object4.projectMatrix = (bivector4.generateRotation(angle).multiply(object4.projectMatrix));
				_lastAxis2.copy( bivector4 );
				_lastAngle3 = angle;
			}else if ( !_this.staticMoving && (_lastAngle3) ) {
				_this.active3 = _this.active4 = true;
				_lastAngle3 *= Math.sqrt( 1.0 - _this.dynamicDampingFactor );
				object4.projectMatrix = _lastAxis2.generateRotation(_lastAngle3).multiply(object4.projectMatrix);
			}
			_movePrevse.copy( _moveCurrse );
		};

	}());

	
	this.checkDistances = function () {

		if ( !_this.noZoom || !_this.noPan ) {

			if ( _eye.lengthSq() > _this.maxDistance * _this.maxDistance ) {
				_this.object.position.addVectors( _this.target, _eye.setLength( _this.maxDistance ) );
			}
			if ( _eye.lengthSq() < _this.minDistance * _this.minDistance ) {
				_this.object.position.addVectors( _this.target, _eye.setLength( _this.minDistance ) );
			}
		}
	};

	this.update = function () {
		_eye.subVectors( _this.object.position, _this.target );
		_this.active3 = _this.active4 = false;
		if ( !_this.noRotate ) {
			_this.rotateCamera();
		}
		if ( !_this.noRotate_t ) {
			_this.rotateTCamera();
		}
		if ( !_this.noRotate_xyz ) {
			_this.rotateXYZCamera();
		}
		if ( !_this.noZoom ) {
			_this.zoomCamera();
		}
		if ( !_this.noPan ) {
			_this.panCamera();
		}
		if ( Math.abs(_lastAngle) < 0.001)_lastAngle = 0;
		if ( Math.abs(_lastAngle2) < 0.001)_lastAngle2 = 0;
		if ( Math.abs(_lastAngle3) < 0.001)_lastAngle3 = 0;
		_this.object.position.addVectors( _this.target, _eye );
		_this.checkDistances();
		_this.object.lookAt( _this.target );
		if ( lastPosition.distanceToSquared( _this.object.position ) > EPS ) {
			_this.dispatchEvent( changeEvent );
			lastPosition.copy( _this.object.position );
		}
	};
	
	this.reset = function () {

		_state = STATE.NONE;
		_prevState = STATE.NONE;

		_this.target.copy( _this.target0 );
		_this.object.position.copy( _this.position0 );
		_this.object.up.copy( _this.up0 );

		_eye.subVectors( _this.object.position, _this.target );

		_this.object.lookAt( _this.target );

		_this.dispatchEvent( changeEvent );

		lastPosition.copy( _this.object.position );

	};

	// listeners


	function mousedown( event ) {

		if ( _this.enabled === false ) return;

		event.preventDefault();
		event.stopPropagation();

		if ( _state === STATE.NONE ) {

			_state = event.button;

		}

		if ( _state === STATE.ROTATE && !_this.noRotate ) {

			_moveCurr.copy( getMouseOnCircle( event.pageX, event.pageY ) );
			_movePrev.copy(_moveCurr);

		} else if ( _state === STATE.ZOOM && !_this.noZoom ) {

			_zoomStart.copy( getMouseOnScreen( event.pageX, event.pageY ) );
			_zoomEnd.copy(_zoomStart);

		} else if ( _state === STATE.PAN && !_this.noPan ) {

			_panStart.copy( getMouseOnScreen( event.pageX, event.pageY ) );
			_panEnd.copy(_panStart);

		} else if ( _state === STATE.ROTATE_T && !_this.noRotate_t ) {

			_moveCurrs.copy( getMouseOnCircle( event.pageX, event.pageY ) );
			_movePrevs.copy(_moveCurrs);

		} else if ( _state === STATE.ROTATE_XYZ && !_this.noRotate_xyz ) {

			_moveCurrse.copy( getMouseOnCircle( event.pageX, event.pageY ) );
			_movePrevse.copy(_moveCurrse);

		}

		document.addEventListener( 'mousemove', mousemove, false );
		document.addEventListener( 'mouseup', mouseup, false );

		_this.dispatchEvent( startEvent );

	}

	function mousemove( event ) {

		if ( _this.enabled === false ) return;

		event.preventDefault();
		event.stopPropagation();
		if ( _state === STATE.ROTATE && !_this.noRotate ) {

			_movePrev.copy(_moveCurr);
			_moveCurr.copy( getMouseOnCircle( event.pageX, event.pageY ) );

		}else if ( _state === STATE.ROTATE_T && !_this.noRotate_t ) {

			_movePrevs.copy(_moveCurrs);
			_moveCurrs.copy( getMouseOnCircle( event.pageX, event.pageY ) );

		}else if ( _state === STATE.ROTATE_XYZ && !_this.noRotate_xyz ) {

			_movePrevse.copy(_moveCurrse);
			_moveCurrse.copy( getMouseOnCircle( event.pageX, event.pageY ) );

		} else if ( _state === STATE.ZOOM && !_this.noZoom ) {

			_zoomEnd.copy( getMouseOnScreen( event.pageX, event.pageY ) );

		} else if ( _state === STATE.PAN && !_this.noPan ) {

			_panEnd.copy( getMouseOnScreen( event.pageX, event.pageY ) );

		}

	}

	function mouseup( event ) {

		if ( _this.enabled === false ) return;

		event.preventDefault();
		event.stopPropagation();

		_state = STATE.NONE;

		document.removeEventListener( 'mousemove', mousemove );
		document.removeEventListener( 'mouseup', mouseup );
		_this.dispatchEvent( endEvent );

	}

	function mousewheel( event ) {

		if ( _this.enabled === false ) return;

		event.preventDefault();
		event.stopPropagation();

		var delta = 0;

		if ( event.wheelDelta ) { // WebKit / Opera / Explorer 9

			delta = event.wheelDelta / 40;

		} else if ( event.detail ) { // Firefox

			delta = - event.detail / 3;

		}

		_zoomStart.y += delta * 0.01;
		_this.dispatchEvent( startEvent );
		_this.dispatchEvent( endEvent );

	}

	function touchstart( event ) {

		if ( _this.enabled === false ) return;

		switch ( event.touches.length ) {

			case 1:
				_state = STATE.TOUCH_ROTATE;
				_moveCurr.copy( getMouseOnCircle( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY ) );
				_movePrev.copy(_moveCurr);
				break;

			case 2:
				_state = STATE.TOUCH_ZOOM_PAN;
				var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
				var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;
				_touchZoomDistanceEnd = _touchZoomDistanceStart = Math.sqrt( dx * dx + dy * dy );

				var x = ( event.touches[ 0 ].pageX + event.touches[ 1 ].pageX ) / 2;
				var y = ( event.touches[ 0 ].pageY + event.touches[ 1 ].pageY ) / 2;
				_panStart.copy( getMouseOnScreen( x, y ) );
				_panEnd.copy( _panStart );
				break;

			default:
				_state = STATE.NONE;

		}
		_this.dispatchEvent( startEvent );


	}

	function touchmove( event ) {

		if ( _this.enabled === false ) return;

		event.preventDefault();
		event.stopPropagation();

		switch ( event.touches.length ) {

			case 1:
				_movePrev.copy(_moveCurr);
				_moveCurr.copy( getMouseOnCircle(  event.touches[ 0 ].pageX, event.touches[ 0 ].pageY ) );
				break;

			case 2:
				var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
				var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;
				_touchZoomDistanceEnd = Math.sqrt( dx * dx + dy * dy );

				var x = ( event.touches[ 0 ].pageX + event.touches[ 1 ].pageX ) / 2;
				var y = ( event.touches[ 0 ].pageY + event.touches[ 1 ].pageY ) / 2;
				_panEnd.copy( getMouseOnScreen( x, y ) );
				break;

			default:
				_state = STATE.NONE;

		}

	}

	function touchend( event ) {

		if ( _this.enabled === false ) return;

		switch ( event.touches.length ) {

			case 1:
				_movePrev.copy(_moveCurr);
				_moveCurr.copy( getMouseOnCircle(  event.touches[ 0 ].pageX, event.touches[ 0 ].pageY ) );
				break;

			case 2:
				_touchZoomDistanceStart = _touchZoomDistanceEnd = 0;

				var x = ( event.touches[ 0 ].pageX + event.touches[ 1 ].pageX ) / 2;
				var y = ( event.touches[ 0 ].pageY + event.touches[ 1 ].pageY ) / 2;
				_panEnd.copy( getMouseOnScreen( x, y ) );
				_panStart.copy( _panEnd );
				break;

		}

		_state = STATE.NONE;
		_this.dispatchEvent( endEvent );

	}

	this.domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );

	this.domElement.addEventListener( 'mousedown', mousedown, false );

	this.domElement.addEventListener( 'mousewheel', mousewheel, false );
	this.domElement.addEventListener( 'DOMMouseScroll', mousewheel, false ); // firefox

	this.domElement.addEventListener( 'touchstart', touchstart, false );
	this.domElement.addEventListener( 'touchend', touchend, false );
	this.domElement.addEventListener( 'touchmove', touchmove, false );
	document.addEventListener('keydown', function( ev ) {
		_this.keyDown = true;
		_this.keyCode = ev.keyCode;
	});
	document.addEventListener('keyup', function( ev ) {
		_this.keyDown = false;
	});
	this.handleResize();

	// force an update at start
	this.update();

};

FOUR.Controls.prototype = Object.create( THREE.EventDispatcher.prototype );
FOUR.Controls.prototype.constructor = FOUR.Controls;

FOUR.Bivector
{
	FOUR.Bivector = function (xy,xz,xw,yz,yw,zw){
		this.set(xy,xz,xw,yz,yw,zw);
	}
	FOUR.Bivector.prototype.set = function (xy,xz,xw,yz,yw,zw){
		this.xy = (xy)?xy:0;
		this.xz = (xz)?xz:0;
		this.xw = (xw)?xw:0;
		this.yz = (yz)?yz:0;
		this.yw = (yw)?yw:0;
		this.zw = (zw)?zw:0;
	}
	FOUR.Bivector.prototype.clone = function (){
		return new FOUR.Bivector(this.xy,this.xz,this.xw,this.yz,this.yw,this.zw);
	}
	FOUR.Bivector.prototype.copy = function (a){
		this.set(a.xy,a.xz,a.xw,a.yz,a.yw,a.zw);
	}
	FOUR.Bivector.prototype.normalize = function (a){
		if(this.mangtitude())return this.divideScalar(this.mangtitude());
		else return this;
	}
	FOUR.Bivector.prototype.dot = function (W){
		if(W instanceof THREE.Vector4)
			return this.clone().hodgeDual().wedge(W);
		return this.xy * W.xy +
			this.xz * W.xz +
			this.xw * W.xw +
			this.yz * W.yz +
			this.yw * W.yw +
			this.zw * W.zw;
	}
	THREE.Vector4.prototype.wedge = function (V){
		if (V instanceof THREE.Vector4)
			return new FOUR.Bivector(
				this.x * V.y - this.y * V.x,
				this.x * V.z - this.z * V.x,
				this.x * V.w - this.w * V.x,
				this.y * V.z - this.z * V.y,
				this.y * V.w - this.w * V.y,
				this.z * V.w - this.w * V.z
			);
		else if (V instanceof FOUR.Bivector){
			return V.wedge(this);
		}
	}
	FOUR.Bivector.prototype.toMatrix = function (){
		return new THREE.Matrix4().set(
			 0,this.xy,this.xz,this.xw,
			-this.xy,0,this.yz,this.yw,
			-this.xz,-this.yz,0,this.zw,
			-this.xw,-this.yw,-this.zw,0
		);
	}
	FOUR.Bivector.prototype.hodgeDual = function (){
		var temp;
		temp = this.xy; this.xy = this.zw; this.zw = temp;
		temp = this.xz; this.xz = -this.yw; this.yw = -temp;
		temp = this.xw; this.xw = this.yz; this.yz = temp;
		return this;
	}
	FOUR.Bivector.prototype.mangtitude = function (){
		return Math.sqrt(this.xy * this.xy +
			this.xz * this.xz +
			this.xw * this.xw +
			this.yz * this.yz +
			this.yw * this.yw +
			this.zw * this.zw
		);
	}
	FOUR.Bivector.prototype.add = function (W){
		this.xy += W.xy;
		this.xz += W.xz;
		this.xw += W.xw;
		this.yz += W.yz;
		this.yw += W.yw;
		this.zw += W.zw;
		return this;
	}
	FOUR.Bivector.prototype.sub = function (W){
		this.xy -= W.xy;
		this.xz -= W.xz;
		this.xw -= W.xw;
		this.yz -= W.yz;
		this.yw -= W.yw;
		this.zw -= W.zw;
		return this;
	}
	FOUR.Bivector.prototype.multiplyScalar = function (m){
		this.xy *= m;
		this.xz *= m;
		this.xw *= m;
		this.yz *= m;
		this.yw *= m;
		this.zw *= m;
		return this;
	}
	FOUR.Bivector.prototype.divideScalar = function (m){
		m = 1 / m;
		this.xy *= m;
		this.xz *= m;
		this.xw *= m;
		this.yz *= m;
		this.yw *= m;
		this.zw *= m;
		return this;
	}
	FOUR.Bivector.prototype.cross = function (W){
		return this.clone().hodgeDual().dot(W);
	}
	FOUR.Bivector.prototype.wedge = function (W){
		if(W instanceof FOUR.Bivector){
			return this.cross(W);
		}else if(W instanceof THREE.Vector4){
			return new THREE.Vector4(
				-this.yz*W.w - this.zw*W.y + this.yw*W.z,
				this.xz*W.w + this.zw*W.x - this.xw*W.z,
				-this.xy*W.w - this.yw*W.x + this.xw*W.y,
				this.xy*W.z + this.yz*W.x - this.xz*W.y
			);
		}
	};
	FOUR.Bivector.prototype.generateRotation = function (s){
		var F = this.clone().normalize().toMatrix();
		var P = new THREE.Matrix4().multiplyMatrices(F,F);
		var Q = new THREE.Matrix4().multiplyScalar(Math.cos(s)).add(F.multiplyScalar(Math.sin(s))).multiply(P);
		return new THREE.Matrix4().add(P).add(Q.multiplyScalar(-1));
	}
	FOUR.Bivector.prototype.getAngles = function (W) {
		if (W instanceof FOUR.Bivector){
			var M = 1 / (this.mangtitude() * W.mangtitude())*0.9999999999999999;
			var P = Math.abs(this.dot(W)), Q = Math.abs(this.cross(W));
			var cmm = Math.acos((P + Q) * M);
			var cpp = Math.acos((P - Q) * M);
			return [(cpp+cmm)*90/Math.PI,(cpp-cmm)*90/Math.PI];
		}else if (W instanceof THREE.Vector4){
			var P = 1 / (this.mangtitude() * W.length());
			return Math.asin(this.wedge(W).length() * P)*180/Math.PI;
		}
	}
	FOUR.Bivector.prototype.show = function (){
		console.table([
			[0,this.xy,this.xz,this.xw],
			[-this.xy,0,this.yz,this.yw],
			[-this.xz,-this.yz,0,this.zw],
			[-this.xw,-this.yw,-this.zw,0]
		]);
	}
}

THREE.Matrices
{
THREE.Matrix4.prototype.add = function ( v ) {

var te = this.elements;
var me = v.elements;

te[0] += me[0]; te[4] += me[4]; te[8] += me[8]; te[12] += me[12];
te[1] += me[1]; te[5] += me[5]; te[9] += me[9]; te[13] += me[13];
te[2] += me[2]; te[6] += me[6];te[10] += me[10];te[14] += me[14];
te[3] += me[3]; te[7] += me[7];te[11] += me[11];te[15] += me[15];

return this;

}
THREE.Matrix2 = function ( n11, n12, n21, n22) {
this.elements = new Float32Array(4);
this.set(
( n11 !== undefined ) ? n11 : 1, n12 || 0,
n21 || 0, ( n22 !== undefined ) ? n22 : 1
);
};

THREE.Matrix2.prototype = {

constructor: THREE.Matrix2,

set: function ( n11, n12, n21, n22) {

var te = this.elements;

te[0] = n11; te[2] = n12;
te[1] = n21; te[3] = n22;

return this;

},

identity: function () {

this.set(

1, 0,
0, 1

);

return this;

},

copy: function ( m ) {

var me = m.elements;

this.set(

me[0], me[2],
me[1], me[3]

);

return this;

},

multiplyVector2: function ( vector ) {

console.warn( 'DEPRECATED: Matrix2\'s .multiplyVector2() has been removed. Use vector.applyMatrix2( matrix ) instead.' );
return vector.applyMatrix3( this );

},

multiplyVector2Array: function() {

var v1 = new THREE.Vector2();

return function ( a ) {

for ( var i = 0, il = a.length; i < il; i += 2 ) {

v1.x = a[ i ];
v1.y = a[ i + 1 ];

v1.applyMatrix2(this);

a[ i ] = v1.x;
a[ i + 1 ] = v1.y;

}

return a;

};

}(),

multiplyScalar: function ( s ) {

var te = this.elements;

te[0] *= s; te[2] *= s;
te[1] *= s; te[3] *= s;

return this;

},

determinant: function () {

var te = this.elements;

var a = te[0], b = te[1],
c = te[2], d = te[3];

return a * d - b * c;

},

getInverse: function ( matrix, throwOnInvertible ) {

// input: THREE.Matrix2
// ( based on http://code.google.com/p/webgl-mjs/ )

var me = matrix.elements;
var te = this.elements;

te[ 0 ] = me[3];
te[ 1 ] = -me[1];
te[ 2 ] = -me[2];
te[ 3 ] = me[0];

var det = me[ 0 ] * te[ 0 ] + me[ 1 ] * te[ 2 ];

// no inverse

if ( det === 0 ) {

var msg = "Matrix2.getInverse(): can't invert matrix, determinant is 0";

if ( throwOnInvertible || false ) {

throw new Error( msg );

} else {

console.warn( msg );

}

this.identity();

return this;

}

this.multiplyScalar( 1.0 / det );

return this;

},

transpose: function () {

var tmp, m = this.elements;

tmp = m[1]; m[1] = m[2]; m[2] = tmp;

return this;

},

clone: function () {

var te = this.elements;

return new THREE.Matrix3(

te[0], te[3], te[6],
te[1], te[4], te[7],
te[2], te[5], te[8]

);

}

};
THREE.Vector2.prototype.applyMatrix2 = function (m){
var x = this.x;
var y = this.y;

var e = m.elements;

this.x = e[0] * x + e[2] * y;
this.y = e[1] * x + e[3] * y;

return this;

}
}