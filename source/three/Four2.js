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
	FOUR.SphereSeg = FOUR.CylinderSeg = 16;
	FOUR.SphereR = 0.1; FOUR.CylinderR = 0.05;
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
	FOUR.Mesh.prototype.createInTHREEScene = function (Scene3){
		if(this.Material.vertexColor != null){
			for (var VertexIndex in this.Geometry.Vertices){
				var Vertex = this.Geometry.Vertices[VertexIndex];
				Vertex.boundTHREEobj = new THREE.Mesh(
					new THREE.SphereGeometry(FOUR.SphereR,FOUR.SphereSeg,SphereSeg),
					new THREE.MeshLambertMaterial({color:this.Material.vertexColor})
				);
				Scene3.add(Vertex.boundTHREEobj);
			}
		}
		if(this.Material.edgeColor != null){
			for (var EdgeIndexs in this.Geometry.Edges){
				var Edge = this.Geometry.Edges[EdgeIndexs];
				Edge.boundTHREEobj = new THREE.Mesh(
					new THREE.CylinderGeometry(FOUR.CylinderR,FOUR.CylinderR,1,FOUR.CylinderSeg),
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
	FOUR.Euler4.prototype.copy = function (c){
		this.set(c.xw,c.yw,c.zw,c.order);
	}
	FOUR.Euler4.prototype.clone = function (){
		return new FOUR.Euler4(this.xw,this.yw,this.zw,this.order);
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
		for(var i in Geometry3.vertices){
			var V0 = new THREE.Vector4(Geometry3.vertices[i].x,Geometry3.vertices[i].y,Geometry3.vertices[i].z,0);
			this.Vertices.push(V0);
			this.Vertices.push(new THREE.Vector4(Geometry3.vertices[i].x+V.x,Geometry3.vertices[i].y+V.y,Geometry3.vertices[i].z+V.z,V.w));
			this.Edges.push(new FOUR.Edge(2*i,2*i+1));
		}
		for(var i in Geometry3.faces){
			var ti = Geometry3.faces[i];
			if(ti instanceof THREE.Face3){
				this.Edges.push(new FOUR.Edge(ti.a*2,ti.b*2));
				this.Edges.push(new FOUR.Edge(ti.a*2,ti.c*2));
				this.Edges.push(new FOUR.Edge(ti.c*2,ti.b*2));
				this.Edges.push(new FOUR.Edge(ti.a*2+1,ti.b*2+1));
				this.Edges.push(new FOUR.Edge(ti.a*2+1,ti.c*2+1));
				this.Edges.push(new FOUR.Edge(ti.c*2+1,ti.b*2+1));
			}else if (ti instanceof THREE.Face4){
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
	FOUR.DuoCylinderGeometry = function (u ,v){
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
		return new FOUR.DuoprismGeometry(s1,s2);;
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
{
	FOUR.OrthographicCamera = function (euler4){
		var matrix = new THREE.Matrix4();
		this.projectMatrix = matrix.setRotationFromEuler4(euler4);
		this.Euler4 = euler4;
	}
	FOUR.OrthographicCamera.prototype.applyVector4 = function (V){
		var V3 = new THREE.Vector3();
		var e = this.projectMatrix.elements;
		V3.x = e[0] * V.w + e[1] * V.y + e[2] * V.z + e[3] * V.x;
		V3.y = e[4] * V.w + e[5] * V.y + e[6] * V.z + e[7] * V.x;
		V3.z = e[8] * V.w + e[9] * V.y + e[10] * V.z + e[11] * V.x;
		return V3;
	}
	FOUR.OrthographicCamera.prototype.setFromEuler4 = function (euler4){
		this.projectMatrix = this.projectMatrix.setRotationFromEuler4(euler4);
	}
	FOUR.PerspectiveCamera = function (euler4,distance,Stereographic){
	this.Euler4 = euler4;
		var matrix = new THREE.Matrix4();
		this.projectMatrix = matrix.setRotationFromEuler4(euler4);
		this.distance = distance;
		this.Stereographic = (Stereographic) || Stereographic;
		this.maxVertexRadius = 4;
		this.maxEdgeRadius = 2;
		
	}
	FOUR.PerspectiveCamera.prototype.applyVector4 = function (v){
		var V, V3 = new THREE.Vector3();
		var e = this.projectMatrix.elements;
		if(this.Stereographic){
			V = v.clone().normalize().multiplyScalar(this.distance);
		}else V = v;
		V3.w = e[12] * V.w + e[13] * V.y + e[14] * V.z + e[15] * V.x+this.distance;
		if(V3.w == 0){return new THREE.Vector4(100000,100000,100000,100000);}
		//if( w + this.distance < 0)throw "error in FOUR.PerspectiveCamera: distance is too low.";
		V3.x = (e[0] * V.w + e[1] * V.y + e[2] * V.z + e[3] * V.x)/V3.w;
		V3.y = (e[4] * V.w + e[5] * V.y + e[6] * V.z + e[7] * V.x)/V3.w;
		V3.z = (e[8] * V.w + e[9] * V.y + e[10] * V.z + e[11] * V.x)/V3.w;
		return V3;
	}
	FOUR.PerspectiveCamera.prototype.setFromEuler4 = function (euler4){
		this.projectMatrix = this.projectMatrix.setRotationFromEuler4(euler4);
	}
}

FOUR.Scene4
{
	FOUR.Scene4 = function (scene3){
		this.scene3 = scene3;
		this.children = [];
	}
	FOUR.Scene4.prototype.add = function (obj4){
		this.children.push(obj4);
		obj4.createInTHREEScene(this.scene3);
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

FOUR.Controls
{
	FOUR.Controls = function (camera4) {
		camera4.Q = camera4.A = camera4.W = camera4.S = camera4.E = camera4.D = false;
		this.camera4 = camera4;
		this.step = 0.01;
		FOUR.Controls.keyDown = false;
		this.Euler4 = camera4.Euler4.clone();
		document.addEventListener('keydown', function( ev ) {
			FOUR.Controls.keyDown = true;
			FOUR.Controls.keyCode = ev.keyCode;
		});
		document.addEventListener('keyup', function( ev ) {
			FOUR.Controls.keyDown = false;
		});
	}
	FOUR.Controls.prototype.update = function (){
		if(FOUR.Controls.keyDown){
			switch (FOUR.Controls.keyCode){
				case 81: this.Euler4.xw+=this.step; break;//Q
				case 65: this.Euler4.xw-=this.step; break;//A
				case 87: this.Euler4.zw+=this.step; break;//W
				case 83: this.Euler4.zw-=this.step; break;//S
				case 69: this.Euler4.yw+=this.step; break;//E
				case 68: this.Euler4.yw-=this.step; break;//D
				case 82: this.Euler4.set(0.000001,0.000001,0.000001); break;//R
				case 70: this.Euler4.set(0.000001,0.000001,Math.PI/2); break;//F
			}
		}
		this.camera4.setFromEuler4(this.Euler4);
	}
}
FOUR.Bivector
{
	FOUR.Bivector = function (xy,xz,xw,yz,yw,zw){
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
		return new THREE.Matrix4(
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

THREE.Matrix2
{
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