/**
 *	javascript.webGL.FOUR.js:
 *	using javascript.webGL.THREE.js;
 *  using javascript.Math.Cmplx.js;
 * 	@author wxy - FiberedKnot
 *	version 1.0 - 2015
 **/
FOUR = function FOUR() {};

FOUR.Edge = function(a, b) {
	this.a = a;
	this.b = b;
	//Index
}
FOUR.Edge.reduce = function(edges) {
	var result = [],
		isRepeated;
	for (var i = 0; i < edges.length; i++) {
		isRepeated = false;
		for (var j = 0; j < result.length; j++) {
			if ((edges[i].a == result[j].a && edges[i].b == result[j].b) || (edges[i].a == result[j].b && edges[i].b == result[j].a)) {
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

FOUR.Face = function(PointIndexs) {
	this.PointIndexs = PointIndexs;
}

FOUR.Cell = function(FaceIndexs) {
	this.FaceIndexs = FaceIndexs;
}

FOUR.Mesh = function(geometry, material, updateMatrix) {
	this.Geometry = geometry;
	this.Material = material;
	this.updateMatrix = (updateMatrix == false) ? false : true;
	this.visible = true;
}
FOUR.Mesh.prototype.applyMatrix4 = function(M4) {
	for (var VertexIndex in this.Geometry.Vertices) {
		var Vertex = this.Geometry.Vertices[VertexIndex];
		Vertex.applyMatrix4(M4);
	}
}
FOUR.Mesh.prototype.setVisible = function(flag) {
	if (this.Geometry.Edges) {
		for (var EdgeIndex in this.Geometry.Edges) {
			if (this.Geometry.Edges[EdgeIndex].boundTHREEobj)
				this.Geometry.Edges[EdgeIndex].boundTHREEobj.visible = flag;
		}
	}
	if (this.Geometry.Vertices) {
		for (var VertexIndex in this.Geometry.Vertices) {
			if (this.Geometry.Vertices[VertexIndex].boundTHREEobj)
				this.Geometry.Vertices[VertexIndex].boundTHREEobj.visible = flag;
		}
	}
	this.visible = flag;
}
FOUR.Mesh.prototype.createInTHREEScene = function(Scene3, Scene4) {
	if (this.Material.vertexColor != null) {
		for (var VertexIndex in this.Geometry.Vertices) {
			var Vertex = this.Geometry.Vertices[VertexIndex];
			Vertex.boundTHREEobj = new THREE.Mesh(
				new THREE.SphereGeometry(Scene4.SphereR, Scene4.SphereSeg, Scene4.SphereSeg),
				new THREE.MeshLambertMaterial({
					color: this.Material.vertexColor
				})
			);
			Scene3.add(Vertex.boundTHREEobj);
		}
	}
	if (this.Material.edgeColor != null) {
		for (var EdgeIndexs in this.Geometry.Edges) {
			var Edge = this.Geometry.Edges[EdgeIndexs];
			Edge.boundTHREEobj = new THREE.Mesh(
				new THREE.CylinderGeometry(Scene4.CylinderR, Scene4.CylinderR, 1, Scene4.CylinderSeg),
				new THREE.MeshLambertMaterial({
					color: this.Material.edgeColor
				})
			);
			Scene3.add(Edge.boundTHREEobj);
		}
	}
}

FOUR.Euler4 = function(xw, yw, zw, order) {
	this.set(xw, yw, zw, order);
}
FOUR.Euler4.prototype.set = function(xw, yw, zw, order) {
	this.xw = xw;
	this.yw = yw;
	this.zw = zw;
	this.order = order;
}
THREE.Matrix4.prototype.setRotationFromEuler4 = function(euler4) {
	var x = euler4.xw,
		y = euler4.yw,
		z = euler4.zw;
	var a = Math.cos(x),
		b = Math.sin(x);
	var c = Math.cos(y),
		d = Math.sin(y);
	var e = Math.cos(z),
		f = Math.sin(z);
	var te = this.elements;
	this.elements = [a, -b * d, -b * c * f, b * c * e, 0, c, -d * f, d * e, 0, 0, e, f, -b, -a * d, -a * c * f, a * c * e];
	return this;
}

FOUR.Geometry = function(Vertices, Edges, Faces, Cells) {
	this.Vertices = Vertices;
	this.Edges = Edges;
	this.Faces = Faces;
	this.Cells = Cells;
}
FOUR.PushGeometry = function(Geometry3, V) {
		this.Vertices = [];
		this.Edges = [];
		this.Faces = [];
		for (var i in Geometry3.vertices) {
			var V0 = new THREE.Vector4(Geometry3.vertices[i].x, Geometry3.vertices[i].y, Geometry3.vertices[i].z, 0);
			this.Vertices.push(V0);
			this.Vertices.push(new THREE.Vector4(Geometry3.vertices[i].x + V.x, Geometry3.vertices[i].y + V.y, Geometry3.vertices[i].z + V.z, V.w));
			this.Edges.push(new FOUR.Edge(2 * i, 2 * i + 1));
		}
		for (var i in Geometry3.faces) {
			var ti = Geometry3.faces[i];
			if (ti instanceof THREE.Face3) {
				this.Faces.push(new FOUR.Face([ti.a * 2, ti.b * 2, ti.c * 2]));
				this.Faces.push(new FOUR.Face([ti.a * 2 + 1, ti.b * 2 + 1, ti.c * 2 + 1]));
				this.Edges.push(new FOUR.Edge(ti.a * 2, ti.b * 2));
				this.Edges.push(new FOUR.Edge(ti.a * 2, ti.c * 2));
				this.Edges.push(new FOUR.Edge(ti.c * 2, ti.b * 2));
				this.Edges.push(new FOUR.Edge(ti.a * 2 + 1, ti.b * 2 + 1));
				this.Edges.push(new FOUR.Edge(ti.a * 2 + 1, ti.c * 2 + 1));
				this.Edges.push(new FOUR.Edge(ti.c * 2 + 1, ti.b * 2 + 1));
			} else if (ti instanceof THREE.Face4) {
				this.Faces.push(new FOUR.Face([ti.a * 2, ti.b * 2, ti.c * 2, ti.d * 2]));
				this.Faces.push(new FOUR.Face([ti.a * 2 + 1, ti.b * 2 + 1, ti.c * 2 + 1, ti.d * 2 + 1]));
				this.Edges.push(new FOUR.Edge(ti.a * 2, ti.b * 2));
				this.Edges.push(new FOUR.Edge(ti.b * 2, ti.c * 2));
				this.Edges.push(new FOUR.Edge(ti.c * 2, ti.d * 2));
				this.Edges.push(new FOUR.Edge(ti.a * 2, ti.d * 2));
				this.Edges.push(new FOUR.Edge(ti.a * 2 + 1, ti.b * 2 + 1));
				this.Edges.push(new FOUR.Edge(ti.b * 2 + 1, ti.c * 2 + 1));
				this.Edges.push(new FOUR.Edge(ti.c * 2 + 1, ti.d * 2 + 1));
				this.Edges.push(new FOUR.Edge(ti.a * 2 + 1, ti.d * 2 + 1));
			}
		}
		this.Edges = FOUR.Edge.reduce(this.Edges);
		for (var i = Geometry3.vertices.length; i < this.Edges.length; i++) {
			if (this.Edges[i].a % 2 == 0 && this.Edges[i].b % 2 == 0)
				this.Faces.push(new FOUR.Face([this.Edges[i].a, this.Edges[i].b, this.Edges[i].b + 1, this.Edges[i].a + 1]));
		}
	}
	//FOUR.TorusGeometry._uneSeg = function (){

//};
FOUR.TorusGeometry = function(Geometry3, P, D, seg) {
	this.Vertices = [];
	this.Edges = [];
	this.Faces = [];
	var rotM = D.generateRotation(2 * Math.PI / seg)
	for (var i in Geometry3.vertices) {
		var K = new THREE.Vector3().subVectors(Geometry3.vertices[i], P);
		var KK = new THREE.Vector4(K.x, K.y, K.z, 0);
		for (var j = 0; j < seg; j++) {
			this.Vertices[seg * i + j] = KK.clone();
			KK.applyMatrix4(rotM);
			if (j == seg - 1)
				this.Edges.push(new FOUR.Edge(i * seg + j, i * seg));
			else
				this.Edges.push(new FOUR.Edge(i * seg + j, i * seg + j + 1));
		}
	}
	for (var i in Geometry3.faces) {
		for (var j = 0; j < seg; j++) {
			var ti = Geometry3.faces[i];
			if (ti instanceof THREE.Face3) {
				this.Faces.push(new FOUR.Face([ti.a * seg + j, ti.b * seg + j, ti.c * seg + j]));
				this.Edges.push(new FOUR.Edge(ti.a * seg + j, ti.b * seg + j));
				this.Edges.push(new FOUR.Edge(ti.a * seg + j, ti.c * seg + j));
				this.Edges.push(new FOUR.Edge(ti.c * seg + j, ti.b * seg + j));
			} else if (ti instanceof THREE.Face4) {
				this.Faces.push(new FOUR.Face([ti.a * seg + j, ti.b * seg + j, ti.c * seg + j, ti.d * seg + j]));
				this.Edges.push(new FOUR.Edge(ti.a * seg + j, ti.b * seg + j));
				this.Edges.push(new FOUR.Edge(ti.b * seg + j, ti.c * seg + j));
				this.Edges.push(new FOUR.Edge(ti.c * seg + j, ti.d * seg + j));
				this.Edges.push(new FOUR.Edge(ti.a * seg + j, ti.d * seg + j));
			}
		}
	}
	this.Edges = FOUR.Edge.reduce(this.Edges);
	for (var i = Geometry3.vertices.length * seg; i < this.Edges.length; i++) {
		if (this.Edges[i].a % seg == 0 && this.Edges[i].b % seg == 0) {
			//var farrce = [];
			for (var j = 0; j < seg; j++) {
				if (j != seg - 1) {
					//this.Edges.push(new FOUR.Edge(i*seg+j,i*seg));
					this.Faces.push(new FOUR.Face([this.Edges[i].a + j, this.Edges[i].b + j, this.Edges[i].b + 1 + j, this.Edges[i].a + 1 + j]));
				} else
					this.Faces.push(new FOUR.Face([this.Edges[i].a + j, this.Edges[i].b + j, this.Edges[i].b, this.Edges[i].a]));
			}
		}
	}
}
FOUR.SphereringGeometry = function(R, r, segu, segv, seg) {
	this.Vertices = [];
	this.Edges = [];
	this.Faces = [];
	var rotM = 2 * Math.PI / seg;
	var rR = r / R;
	var Geometry3 = new THREE.SphereGeometry(R, segu, segv);
	for (var i in Geometry3.vertices) {
		for (var j = 0; j < seg; j++) {
			var KK = new THREE.Vector4(Geometry3.vertices[i].x, Geometry3.vertices[i].y, Geometry3.vertices[i].z, 0);
			this.Vertices[seg * i + j] = KK.multiplyScalar(1 - Math.cos(rotM * j) * rR).add(new THREE.Vector4(0, 0, 0, Math.sin(rotM * j) * rR))
			if (j == seg - 1)
				this.Edges.push(new FOUR.Edge(i * seg + j, i * seg));
			else
				this.Edges.push(new FOUR.Edge(i * seg + j, i * seg + j + 1));
		}
	}
	for (var i in Geometry3.faces) {
		for (var j = 0; j < seg; j++) {
			var ti = Geometry3.faces[i];
			if (ti instanceof THREE.Face3) {
				this.Faces.push(new FOUR.Face([ti.a * seg + j, ti.b * seg + j, ti.c * seg + j]));
				this.Edges.push(new FOUR.Edge(ti.a * seg + j, ti.b * seg + j));
				this.Edges.push(new FOUR.Edge(ti.a * seg + j, ti.c * seg + j));
				this.Edges.push(new FOUR.Edge(ti.c * seg + j, ti.b * seg + j));
			} else if (ti instanceof THREE.Face4) {
				this.Faces.push(new FOUR.Face([ti.a * seg + j, ti.b * seg + j, ti.c * seg + j, ti.d * seg + j]));
				this.Edges.push(new FOUR.Edge(ti.a * seg + j, ti.b * seg + j));
				this.Edges.push(new FOUR.Edge(ti.b * seg + j, ti.c * seg + j));
				this.Edges.push(new FOUR.Edge(ti.c * seg + j, ti.d * seg + j));
				this.Edges.push(new FOUR.Edge(ti.a * seg + j, ti.d * seg + j));
			}
		}
	}
	this.Edges = FOUR.Edge.reduce(this.Edges);
	for (var i = Geometry3.vertices.length * seg; i < this.Edges.length; i++) {
		if (this.Edges[i].a % seg == 0 && this.Edges[i].b % seg == 0) {
			//var farrce = [];
			for (var j = 0; j < seg; j++) {
				if (j != seg - 1) {
					//this.Edges.push(new FOUR.Edge(i*seg+j,i*seg));
					this.Faces.push(new FOUR.Face([this.Edges[i].a + j, this.Edges[i].b + j, this.Edges[i].b + 1 + j, this.Edges[i].a + 1 + j]));
				} else
					this.Faces.push(new FOUR.Face([this.Edges[i].a + j, this.Edges[i].b + j, this.Edges[i].b, this.Edges[i].a]));
			}
		}
	}
}

FOUR.DuoprismGeometry = function(shape1, shape2) {
	var XYV = shape1.getPoints();
	var ZTV = shape2.getPoints();
	this.Vertices = [];
	this.Edges = [];
	this.Faces = [];
	for (var i in XYV) {
		for (var j in ZTV) {
			this.Vertices.push(
				new THREE.Vector4(XYV[i].x, XYV[i].y, ZTV[j].x, ZTV[j].y)
			);
			this.Edges.push(new FOUR.Edge(
				i * ZTV.length + Number(j),
				i * ZTV.length + ((j < ZTV.length - 1) ? Number(j) + 1 : 0)
			));
			this.Faces.push(new FOUR.Face([
				i * ZTV.length + Number(j),
				i * ZTV.length + ((j < ZTV.length - 1) ? Number(j) + 1 : 0),
				((i < XYV.length - 1) ? Number(i) + 1 : 0) * ZTV.length + ((j < ZTV.length - 1) ? Number(j) + 1 : 0),
				((i < XYV.length - 1) ? Number(i) + 1 : 0) * ZTV.length + Number(j)
			]));
			this.Edges.push(new FOUR.Edge(
				i * ZTV.length + Number(j),
				((i < XYV.length - 1) ? Number(i) + 1 : 0) * ZTV.length + Number(j)
			));
		}
	}
	for (var i in XYV) {
		this.Faces.push(new FOUR.Face([]));
		for (var j in ZTV) {
			this.Faces[this.Faces.length - 1].PointIndexs.push(i * ZTV.length + Number(j));
		}
	}
	for (var j in ZTV) {
		this.Faces.push(new FOUR.Face([]));
		for (var i in XYV) {
			this.Faces[this.Faces.length - 1].PointIndexs.push(i * ZTV.length + Number(j));
		}
	}
}
FOUR.DuocylinderGeometry = function(u, v) {
	var s1 = new THREE.Shape();
	var s2 = new THREE.Shape();
	s1.moveTo(1, 0);
	s2.moveTo(1, 0);
	for (var i = 1; i < u; i++) {
		s1.lineTo(Math.cos(Math.PI * 2 / u * i), Math.sin(Math.PI * 2 / u * i));
	}
	for (var j = 1; j < v; j++) {
		s2.lineTo(Math.cos(Math.PI * 2 / v * j), Math.sin(Math.PI * 2 / v * j));
	}
	return new FOUR.DuoprismGeometry(s1, s2);
}
FOUR.SimplexGeometry = function(p1, p2, p3, p4, p5) {
	this.Vertices = [];
	this.Edges = [];
	this.Faces = [];
	this.Vertices.push(p1);
	this.Vertices.push(p2);
	this.Vertices.push(p3);
	this.Vertices.push(p4);
	this.Vertices.push(p5);
	for (var i = 0; i != 4; i++) {
		for (var j = i + 1; j != 5; j++) {
			this.Edges.push(new FOUR.Edge(i, j));
		}
	}
	for (var i = 0; i != 3; i++) {
		for (var j = i + 1; j != 4; j++) {
			for (var k = j + 1; k != 5; k++) {
				this.Faces.push(new FOUR.Face([i, j, k]));
			}
		}
	}
}
FOUR.TesseractGeometry = function(a, b, c, d) {
	this.Vertices = [];
	for (var i = 0; i < 16; i++) {
		var _x = ((i & 1) > 0) ? 1 : -1;
		var _y = ((i & 2) > 0) ? 1 : -1;
		var _z = ((i & 4) > 0) ? 1 : -1;
		var _w = ((i & 8) > 0) ? 1 : -1;
		this.Vertices.push(new THREE.Vector4(a * _x, b * _y, c * _z, d * _w));
	}
	this.Edges = [];
	this.Faces = [];
	for (var i = 0; i < 15; i++) {
		for (var j = 1; j < 16; j *= 2) {
			if ((i & j) == 0) this.Edges.push(new FOUR.Edge(i, i + j));
		}
	}
	for (var i in this.Edges) {
		var v1 = this.Edges[i].a;
		var v2 = this.Edges[i].b;
		for (var j = 1; j < 16; j *= 2) {
			if ((v1 & j) == 0 && (v2 - v1) < j) {
				this.Faces.push(new FOUR.Face([v1, v2, v2 + j, v1 + j]));
			}
		}
	}
}

FOUR.HexadecachoronGeometry = function(radius) {
	this.Vertices = [];
	this.Edges = [];
	this.faces = [];
	this.Vertices.push(new THREE.Vector4(radius, 0, 0, 0));
	this.Vertices.push(new THREE.Vector4(0, radius, 0, 0));
	this.Vertices.push(new THREE.Vector4(0, 0, radius, 0));
	this.Vertices.push(new THREE.Vector4(0, 0, 0, radius));
	this.Vertices.push(new THREE.Vector4(-radius, 0, 0, 0));
	this.Vertices.push(new THREE.Vector4(0, -radius, 0, 0));
	this.Vertices.push(new THREE.Vector4(0, 0, -radius, 0));
	this.Vertices.push(new THREE.Vector4(0, 0, 0, -radius));
	for (var i = 0; i != 7; i++) {
		for (var j = i + 1; j != 8; j++) {
			if ((j - i) != 4) this.Edges.push(new FOUR.Edge(i, j));
		}
	}
}
FOUR.IcositetrachoronGeometry = function(radius) {
	this.Vertices = [];
	this.Edges = [];
	this.Vertices.push(new THREE.Vector4(-radius, 0, 0, 0));
	this.Vertices.push(new THREE.Vector4(0, -radius, 0, 0));
	this.Vertices.push(new THREE.Vector4(0, 0, -radius, 0));
	this.Vertices.push(new THREE.Vector4(0, 0, 0, -radius));
	this.Vertices.push(new THREE.Vector4(radius, 0, 0, 0));
	this.Vertices.push(new THREE.Vector4(0, radius, 0, 0));
	this.Vertices.push(new THREE.Vector4(0, 0, radius, 0));
	this.Vertices.push(new THREE.Vector4(0, 0, 0, radius));
	for (var i = 0; i < 16; i++) {
		var _x = ((i & 1) > 0) ? 0.5 : -0.5;
		var _y = ((i & 2) > 0) ? 0.5 : -0.5;
		var _z = ((i & 4) > 0) ? 0.5 : -0.5;
		var _w = ((i & 8) > 0) ? 0.5 : -0.5;
		this.Vertices.push(new THREE.Vector4(radius * _x, radius * _y, radius * _z, radius * _w));
	}
	for (var i = 0; i < 15; i++) {
		for (var j = 1; j < 16; j *= 2) {
			if ((i & j) == 0) this.Edges.push(new FOUR.Edge(i + 8, i + j + 8));
		}
	}
	for (var i = 0; i < 16; i++) {
		for (var j = 0; j < 4; j++) {
			if ((i & (1 << j)) > 0) this.Edges.push(new FOUR.Edge(i + 8, j + 4));
			else this.Edges.push(new FOUR.Edge(i + 8, j))
		}
	}
}
FOUR.DuopyramidGeometry = function(r1,r2,n,m){
	this.Vertices = [];
	this.Edges = [];
	this.Faces = [];
	N = 2*Math.PI/n,
	M = 2*Math.PI/m;
	for(var i = 0; i< n; i++){
		this.Vertices.push(new THREE.Vector4(r1*Math.cos(i*N),r1*Math.sin(i*N),0,0));
		this.Edges.push(new FOUR.Edge(i,(i==0?n-1:i-1)));
	}
	for(var i = 0; i< m; i++){
		this.Vertices.push(new THREE.Vector4(0,0,r2*Math.cos(i*N),r2*Math.sin(i*N)));
		this.Edges.push(new FOUR.Edge(n+i,n+(i==0?m-1:i-1)));
	}
	for(var i = 0; i< n; i++){
		for(var j = 0; j< m; j++){
			this.Edges.push(new FOUR.Edge(i,n+j));
		}
	}
}
FOUR.HexacosichoronGeometry = function(r){
	this.Vertices = [];
	this.Edges = [];
	this.Faces = [];
	if(!r)r=1;
	for (var i = 0; i < FOUR.vertices600.length; i+=4) {
		this.Vertices.push(
			new THREE.Vector4(FOUR.vertices600[i]*r,FOUR.vertices600[i+1]*r,FOUR.vertices600[i+2]*r,FOUR.vertices600[i+3]*r)
		);
	}
	for (var i = 0; i < FOUR.edges600.length; i+=2) {
		this.Edges.push(new FOUR.Edge(FOUR.edges600[i],FOUR.edges600[i+1]));
	}
	for (var i = 0; i < FOUR.faces600.length; i+=3) {
		this.Faces.push(new FOUR.Face([FOUR.faces600[i],FOUR.faces600[i+1],FOUR.faces600[i+2]]));
	}
}
FOUR.HecatonicosachoronGeometry = function(r){
	this.Vertices = [];
	this.Edges = [];
	this.Faces = [];
	if(!r)r=1;
	for (var i = 0; i < FOUR.vertices120.length; i+=4) {
		this.Vertices.push(
			new THREE.Vector4(FOUR.vertices120[i]*r,FOUR.vertices120[i+1]*r,FOUR.vertices120[i+2]*r,FOUR.vertices120[i+3]*r)
		);
	}
	for (var i = 0; i < FOUR.edges120.length; i+=2) {
		this.Edges.push(new FOUR.Edge(FOUR.edges120[i],FOUR.edges120[i+1]));
	}
	
}

FOUR.FrameMaterial = function(vertexColor, edgeColor, vertexSize, edgeSize) {
	this.Material = "FrameMaterial";
	this.vertexColor = vertexColor;
	this.edgeColor = edgeColor;
	this.vertexSize = (vertexSize) ? vertexSize : 0.1;
	this.edgeSize = (edgeSize) ? edgeSize : 0.05;
}
FOUR.BlockMaterial = function(blockColor) {
	this.Material = "BlockMaterial";
	this.blockColor = blockColor;
}

FOUR.Camera4 = function() {
	this.projectMatrix = new THREE.Matrix4();
	this.up = new THREE.Vector4(1, 2, 3, 4);
	this.right = new THREE.Vector4(4, 3, 2, 1);
}
FOUR.Camera4.prototype.setFromEuler4 = function(euler4) {
	this.projectMatrix = this.projectMatrix.setRotationFromEuler4(euler4);
}
FOUR.Camera4.prototype.lookAt = function(v) {
	this.front = this.up.wedge(this.right).wedge(v);
	FOUR.Orthog(v, this.up, this.right, this.front);
	this.projectMatrix.elements = [
		this.up.x, this.front.x, this.right.x, v.x,
		this.up.y, this.front.y, this.right.y, v.y,
		this.up.z, this.front.z, this.right.z, v.z,
		this.up.w, this.front.w, this.right.w, v.w
	];
	this.projectMatrix.getInverse(this.projectMatrix);
}
FOUR.OrthographicCamera = function(obj) {
	FOUR.Camera4.call(this);
	if (obj instanceof FOUR.Euler4) this.projectMatrix = this.projectMatrix.setRotationFromEuler4(obj);
}
FOUR.OrthographicCamera.prototype = Object.create(FOUR.Camera4.prototype);
FOUR.OrthographicCamera.prototype.applyVector4 = function(V) {
	var V3 = new THREE.Vector4();
	var e = this.projectMatrix.elements;
	//V3.x = e[0] * V.w + e[1] * V.y + e[2] * V.z + e[3] * V.x;
	//V3.y = e[4] * V.w + e[5] * V.y + e[6] * V.z + e[7] * V.x;
	//V3.z = e[8] * V.w + e[9] * V.y + e[10] * V.z + e[11] * V.x;
	V3 = V.clone().applyMatrix4(this.projectMatrix)
	return new THREE.Vector3(V3.x, V3.y, V3.z);
}
FOUR.Orthog = function(a1, a2, a3, a4) {
	var a11 = a1.dot(a1);
	var b2 = new THREE.Vector4().subVectors(a2, a1.clone().multiplyScalar(a2.dot(a1) / a11));
	var b22 = b2.dot(b2);
	var b3 = new THREE.Vector4().subVectors(a3, a1.clone().multiplyScalar(a3.dot(a1) / a11)).sub(b2.clone().multiplyScalar(a3.dot(b2) / b22));
	var b4 = new THREE.Vector4().subVectors(a4, a1.clone().multiplyScalar(a4.dot(a1) / a11)).sub(b2.clone().multiplyScalar(a4.dot(b2) / b22)).sub(b3.clone().multiplyScalar(a4.dot(b3) / b3.dot(b3)));
	a1.normalize();
	a2.copy(b2.normalize());
	a3.copy(b3.normalize());
	a4.copy(b4.normalize());
}

FOUR.PerspectiveCamera = function(obj, distance, Stereographic) {
	FOUR.Camera4.call(this);
	if (obj instanceof FOUR.Euler4) this.projectMatrix = this.projectMatrix.setRotationFromEuler4(obj);
	this.distance = distance;
	this.Stereographic = (Stereographic) || Stereographic;
	this.maxVertexRadius = 4;
	this.maxEdgeRadius = 2;

}
FOUR.PerspectiveCamera.prototype = Object.create(FOUR.Camera4.prototype);
FOUR.PerspectiveCamera.prototype.applyVector4 = function(v) {
	var V, V3 = new THREE.Vector4();
	var e = this.projectMatrix.elements;
	if (this.Stereographic) {
		V = v.clone().normalize().multiplyScalar(this.distance);
	} else V = v;
	V3 = V.clone().applyMatrix4(this.projectMatrix);
	// / V3.w = e[12] * V.w + e[13] * V.y + e[14] * V.z + e[15] * V.x+this.distance;
	V3.w += this.distance;
	if (V3.w == 0) {
		return new THREE.Vector4(100000, 100000, 100000, 100000);
	}
	var VV = new THREE.Vector3(V3.x, V3.y, V3.z).divideScalar(V3.w);
	VV.w = V3.w;
	//if( w + this.distance < 0) console.log ( "error in FOUR.PerspectiveCamera: distance is too low.");
	return VV
}
FOUR.MercatorCamera = function (obj,distance,Stereographic){
	FOUR.Camera4.call(this);
	if(obj instanceof FOUR.Euler4)this.projectMatrix = this.projectMatrix.setRotationFromEuler4(obj);
	this.distance = distance;
	this.Stereographic = (Stereographic) || Stereographic;
	this.maxVertexRadius = 4;
	this.maxEdgeRadius = 2;
}
FOUR.MercatorCamera.prototype = Object.create(FOUR.Camera4.prototype);
FOUR.MercatorCamera.prototype.applyVector4 = function (v){
	var V, V3 = new THREE.Vector4();
	var e = this.projectMatrix.elements;
	if(this.Stereographic){
		V = v.clone().normalize().multiplyScalar(this.distance);
	}else V = v;
	V3 = V.clone().applyMatrix4(this.projectMatrix);
	var WE = Math.atan2(V3.y,V3.x);
	var MG = Math.atan2(V3.w,V3.z);
	var NS = Math.atan2(Math.sqrt(V3.x*V3.x+V3.y*V3.y),Math.sqrt(V3.z*V3.z+V3.w*V3.w))*2;
	var VV = new THREE.Vector3(WE,MG,NS);
	VV.w = V3.w;
	return VV
}
FOUR.Scene4 = function(scene3) {
	this.scene3 = scene3;
	this.children = [];
	this.SphereSeg = this.CylinderSeg = 4;
	this.SphereR = 0.1;
	this.CylinderR = 0.05;
}
FOUR.Scene4.prototype.add = function(obj4) {
	this.children.push(obj4);
	obj4.createInTHREEScene(this.scene3, this);
}
FOUR.Scene4.prototype.remove = function(obj4) {
	for (var i in obj4.Geometry.Vertices) {
		this.scene3.remove(obj4.Geometry.Vertices[i].boundTHREEobj);
	}
	for (var i in obj4.Geometry.Edges) {
		this.scene3.remove(obj4.Geometry.Edges[i].boundTHREEobj);
	}
	var index = this.children.indexOf(obj4);
	if (index != -1) {
		this.children[index] = {
			type: "removed"
		};
	}
}

FOUR.Renderer4 = function(scene4, camera4) {
	this.scene4 = scene4;
	this.camera4 = camera4;
}
FOUR.Renderer4.prototype.render = function() {
	for (var mesh in this.scene4.children) {
		var thisMesh = this.scene4.children[mesh];
		if (thisMesh.Geometry && !(thisMesh.updateMatrix == false) && !(thisMesh.visible == false)) {
			//some might be removed
			var isFM = thisMesh.Material.Material == "FrameMaterial";

			for (var VertexIndex in thisMesh.Geometry.Vertices) {
				var Vertex = thisMesh.Geometry.Vertices[VertexIndex];
				Vertex.projection = this.camera4.applyVector4(Vertex);
				if (!isFM || thisMesh.Material.vertexColor) {
					Vertex.boundTHREEobj.position.set(Vertex.projection.x, Vertex.projection.y, Vertex.projection.z);
					if (this.camera4 instanceof FOUR.PerspectiveCamera) {
						var scale = Math.abs(1 / Vertex.projection.w);
						scale = Math.min(this.camera4.maxVertexRadius, scale);
						Vertex.boundTHREEobj.scale.set(scale, scale, scale);
					}else{
						Vertex.boundTHREEobj.scale.set(1,1,1);
					}
				}
			}
			if (!isFM || thisMesh.Material.edgeColor) {
				for (var EdgeIndex in thisMesh.Geometry.Edges) {
					var Edge = thisMesh.Geometry.Edges[EdgeIndex];
					var p1 = thisMesh.Geometry.Vertices[Edge.a].projection;
					var p2 = thisMesh.Geometry.Vertices[Edge.b].projection;
					var L = Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y) + (p1.z - p2.z) * (p1.z - p2.z));
					var v = new THREE.Vector3(p2.z - p1.z, 0, p1.x - p2.x).normalize();
					var quaternion = new THREE.Quaternion(0.2, 0.4, 0.5);
					if (this.camera4 instanceof FOUR.PerspectiveCamera) {
						var scale = 2 / (Math.abs(p1.w) + Math.abs(p2.w));
						scale = Math.min(this.camera4.maxEdgeRadius, scale)
					} else {
						var scale = 1
					}
					Edge.boundTHREEobj.setRotationFromAxisAngle(v, -Math.acos((p1.y - p2.y) / L));
					if (isFM && !thisMesh.Material.vertexColor)
						Edge.boundTHREEobj.scale.set(scale, L * 1.1, scale);
					//if don't display ball, then extend edgs.
					else
						Edge.boundTHREEobj.scale.set(scale, L, scale);
					Edge.boundTHREEobj.position.set((p1.x + p2.x) / 2, (p1.y + p2.y) / 2, (p1.z + p2.z) / 2);
				}
			}
		}
	}
}

FOUR.Section = function(geometry, hyperplane) {
	this.geometry = geometry;
	this.hyperplane = hyperplane;
}
FOUR.Section.prototype.excute = function() {
	var edges = [];
	var points = [];
	for (var i in this.geometry.Faces) {
		var count = 0;
		var a, inP;
		for (var j in this.geometry.Faces[i].PointIndexs) {
			var temp = (j < this.geometry.Faces[i].PointIndexs.length - 1) ? (Number(j) + 1) : 0
			var Line = {
				a: this.geometry.Vertices[this.geometry.Faces[i].PointIndexs[j]],
				b: this.geometry.Vertices[this.geometry.Faces[i].PointIndexs[temp]]
			};
			inP = this.hyperplane.intersection_line(Line);
			if (inP != 0) {
				count++;
				if (count == 1) a = inP;
				else if (count == 2) {
					points.push(a);
					points.push(inP);
					edges.push({
						a: points.length - 2,
						b: points.length - 1
					});
				}
			}
		}
	}
	return new FOUR.Geometry(points, edges);
}

FOUR.HyperPlane = function(V4, P) {
	this.normal = V4;
	this.P = P;
}
FOUR.HyperPlane.prototype.intersection_line = function(line) {
	var te = new THREE.Vector4;
	var p_an = this.normal.dot(te.subVectors(this.P, line.a));
	var p_bn = this.normal.dot(te.subVectors(this.P, line.b));
	if ((p_an < 0) ^ (p_bn < 0)) {
		var b_an = this.normal.dot(te.subVectors(line.b, line.a));
		var te1 = new THREE.Vector4;
		var te2 = new THREE.Vector4;
		te1.copy(line.b);
		te2.copy(line.a);
		te1.multiplyScalar(p_an / b_an);
		te2.multiplyScalar(p_bn / b_an);
		return te.subVectors(te1, te2);
	} else return 0; //0 represent non intersection
}

FOUR.Hopf = function(order) {
	if (typeof order == "string") {
		var O = [];
		for (var i = 0; i < 4; i++) {
			switch (order.charAt(i)) {
				case '1':
					O[i * 4] = 1;
					O[i * 4 + 1] = O[i * 4 + 2] = O[i * 4 + 3] = 0;
					break;
				case '2':
					O[i * 4 + 1] = 1;
					O[i * 4] = O[i * 4 + 2] = O[i * 4 + 3] = 0;
					break;
				case '3':
					O[i * 4 + 2] = 1;
					O[i * 4 + 1] = O[i * 4] = O[i * 4 + 3] = 0;
					break;
				case '4':
					O[i * 4 + 3] = 1;
					O[i * 4 + 1] = O[i * 4 + 2] = O[i * 4] = 0;
					break;
			}
		}
		this.order = {
			elements: O
		};
	} else
		this.order = order;
}
FOUR.Hopf.prototype.tov4 = function(z1, z2) {
	var V = new THREE.Vector4(z1.real, z1.imag, z2.real, z2.imag);
	V.applyMatrix4(this.order);
	return V;
}
FOUR.Hopf.prototype.toz1z2 = function(p) {
	var V = new THREE.Vector4(p.x, p.y, p.z, p.w);
	var M = new THREE.Matrix4().getInverse(this.order);
	V.applyMatrix4(M);
	return {
		z1: new Complex(V.x, V.y),
		z2: new Complex(V.z, V.w)
	};
}
FOUR.Hopf.prototype.getTangent = function(p) {
	var Z = this.toz1z2(p);
	var Z1 = Cmplx.mul(Cmplx.I, Z.z1);
	var Z2 = Cmplx.mul(Cmplx.I, Z.z2);
	return this.tov4(Z1, Z2);
}
FOUR.Hopf.prototype.coordinate = function(eta, k1, k2) {
	z1 = new Complex(Math.cos(k1 + k2) * Math.sin(eta), Math.sin(k1 + k2) * Math.sin(eta));
	z2 = new Complex(Math.cos(k1 - k2) * Math.cos(eta), Math.sin(k1 - k2) * Math.cos(eta));
	return this.tov4(z1, z2);
}
FOUR.Hopf.prototype.getBivector = function(k) {
	var R = Cmplx.div(1, Math.sqrt(1 + Cmplx.sqrabs(k))); // R = sqrt 1/(1+|k|^2)
	var z1 = new Complex(R, 0);
	var e1 = this.tov4(z1, Cmplx.mul(z1, k)); //new THREE.Vector4(R,0,k.real*R,k.imag*R);
	var z2 = new Complex(0, R);
	var e2 = this.tov4(z2, Cmplx.mul(z2, k)); //new THREE.Vector4(0,R,-k.imag*R,k.real*R);
	//this.tov4(z1,z2);
	return e1.wedge(e2);
}
FOUR.Hopf.prototype.GenerateHopfCirles = function(k, N) {
	var R = Cmplx.div(1, Math.sqrt(1 + Cmplx.sqrabs(k))); // R = sqrt 1/(1+|k|^2)
	var step = Math.PI * 2 / N;
	var Count = 0;
	var Ps = [],
		Es = [];
	for (var i = 0; i < Math.PI * 2; i += step, Count++) {
		var z1 = new Complex(R * Math.cos(i), R * Math.sin(i));
		var z2 = Cmplx.mul(z1, k);
		Ps.push(this.tov4(z1, z2));
		Es.push(new FOUR.Edge(Count, (Count > 0) ? (Count - 1) : N - 1));
	}
	return new FOUR.Geometry(Ps, Es);
}

FOUR.Controls = function(object, domElement, object4) {

	var _this = this;
	var STATE = {
		NONE: -1,
		ROTATE: 0,
		ZOOM: 10,
		ROTATE_T: 1,
		ROTATE_XYZ: 2,
		TOUCH_ROTATE: 3,
		TOUCH_ZOOM_PAN: 4
	};

	this.object = object;
	this.domElement = (domElement !== undefined) ? domElement : document;

	// API

	this.enabled = true;

	this.screen = {
		left: 0,
		top: 0,
		width: 0,
		height: 0
	};

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

	var changeEvent = {
		type: 'change'
	};
	var startEvent = {
		type: 'start'
	};
	var endEvent = {
		type: 'end'
	};

	this.keyCode = 0;
	this.keyDown = false;

	// methods

	this.handleResize = function() {

		if (this.domElement === document) {

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

	this.handleEvent = function(event) {

		if (typeof this[event.type] == 'function') {

			this[event.type](event);

		}

	};

	var getMouseOnScreen = (function() {

		var vector = new THREE.Vector2();

		return function(pageX, pageY) {

			vector.set(
				(pageX - _this.screen.left) / _this.screen.width,
				(pageY - _this.screen.top) / _this.screen.height
			);

			return vector;

		};

	}());

	var getMouseOnCircle = (function() {

		var vector = new THREE.Vector2();

		return function(pageX, pageY) {

			vector.set(
				((pageX - _this.screen.width * 0.5 - _this.screen.left) / (_this.screen.width * 0.5)),
				((_this.screen.height + 2 * (_this.screen.top - pageY)) / _this.screen.width) // screen.width intentional
			);

			return vector;
		};

	}());

	this.rotateCamera = (function() {

		var axis = new THREE.Vector3(),
			quaternion = new THREE.Quaternion(),
			eyeDirection = new THREE.Vector3(),
			objectUpDirection = new THREE.Vector3(),
			objectSidewaysDirection = new THREE.Vector3(),
			moveDirection = new THREE.Vector3(),
			angle;

		return function() {

			moveDirection.set(_moveCurr.x - _movePrev.x, _moveCurr.y - _movePrev.y, 0);
			angle = moveDirection.length();

			if (angle) {
				_this.active3 = true;
				_eye.copy(_this.object.position).sub(_this.target);

				eyeDirection.copy(_eye).normalize();
				objectUpDirection.copy(_this.object.up).normalize();
				objectSidewaysDirection.crossVectors(objectUpDirection, eyeDirection).normalize();

				objectUpDirection.setLength(_moveCurr.y - _movePrev.y);
				objectSidewaysDirection.setLength(_moveCurr.x - _movePrev.x);

				moveDirection.copy(objectUpDirection.add(objectSidewaysDirection));

				axis.crossVectors(moveDirection, _eye).normalize();

				angle *= _this.rotateSpeed;
				quaternion.setFromAxisAngle(axis, angle);

				_eye.applyQuaternion(quaternion);
				_this.object.up.applyQuaternion(quaternion);

				_lastAxis.copy(axis);
				_lastAngle = angle;

			} else if (!_this.staticMoving && _lastAngle) {
				_this.active3 = true;
				_lastAngle *= Math.sqrt(1.0 - _this.dynamicDampingFactor);
				_eye.copy(_this.object.position).sub(_this.target);
				quaternion.setFromAxisAngle(_lastAxis, _lastAngle);
				_eye.applyQuaternion(quaternion);
				_this.object.up.applyQuaternion(quaternion);

			}

			_movePrev.copy(_moveCurr);

		};

	}());

	this.zoomCamera = function() {

		var factor;

		if (_state === STATE.TOUCH_ZOOM_PAN) {
			_this.active3 = true;
			factor = _touchZoomDistanceStart / _touchZoomDistanceEnd;
			_touchZoomDistanceStart = _touchZoomDistanceEnd;
			_eye.multiplyScalar(factor);

		} else {

			factor = 1.0 + (_zoomEnd.y - _zoomStart.y) * _this.zoomSpeed;

			if (factor !== 1.0 && factor > 0.0) {
				_this.active3 = true;
				_eye.multiplyScalar(factor);

				if (_this.staticMoving) {

					_zoomStart.copy(_zoomEnd);

				} else {

					_zoomStart.y += (_zoomEnd.y - _zoomStart.y) * this.dynamicDampingFactor;

				}

			}

		}

	};

	this.panCamera = (function() {

		var mouseChange = new THREE.Vector2(),
			objectUp = new THREE.Vector3(),
			pan = new THREE.Vector3();

		return function() {

			mouseChange.copy(_panEnd).sub(_panStart);

			if (mouseChange.lengthSq()) {
				_this.active3 = true;
				mouseChange.multiplyScalar(_eye.length() * _this.panSpeed);

				pan.copy(_eye).cross(_this.object.up).setLength(mouseChange.x);
				pan.add(objectUp.copy(_this.object.up).setLength(mouseChange.y));

				_this.object.position.add(pan);
				_this.target.add(pan);

				if (_this.staticMoving) {

					_panStart.copy(_panEnd);

				} else {

					_panStart.add(mouseChange.subVectors(_panEnd, _panStart).multiplyScalar(_this.dynamicDampingFactor));

				}

			}
		};

	}());

	this.rotateTCamera = (function() {

		var quaternion = new THREE.Quaternion(),
			moveDirection = new THREE.Vector3(),
			angle, v, bivector4;

		return function() {
			moveDirection.set(_moveCurrs.x - _movePrevs.x, _moveCurrs.y - _movePrevs.y, 0);
			angle = moveDirection.length();

			if (angle) {
				_this.active3 = _this.active4 = true;
				v = new THREE.Vector3(_this.object.matrix.elements[8], _this.object.matrix.elements[9], _this.object.matrix.elements[10]);
				moveDirection.x *= _this.rotateSpeed;
				moveDirection.y *= _this.rotateSpeed;
				bivector4 = new THREE.Vector4(v.x, v.y, v.z, 0).wedge(new THREE.Vector4(0, 0, 0, 1));
				object4.projectMatrix = (bivector4.generateRotation(moveDirection.y).multiply(object4.projectMatrix));

				quaternion.setFromAxisAngle(v, moveDirection.x);
				_eye.applyQuaternion(quaternion);
				_this.object.up.applyQuaternion(quaternion);

				_lastAxis.copy(v);
				_lastAxis2.copy(bivector4);
				_lastAngle = moveDirection.x;
				_lastAngle2 = moveDirection.y;

			} else if (!_this.staticMoving && (_lastAngle || _lastAngle2)) {
				_this.active3 = _this.active4 = true;
				_lastAngle *= Math.sqrt(1.0 - _this.dynamicDampingFactor);
				_lastAngle2 *= Math.sqrt(1.0 - _this.dynamicDampingFactor);
				quaternion.setFromAxisAngle(_lastAxis, _lastAngle);
				_eye.applyQuaternion(quaternion);
				_this.object.up.applyQuaternion(quaternion);
				object4.projectMatrix = _lastAxis2.generateRotation(_lastAngle2).multiply(object4.projectMatrix);
			}

			_movePrevs.copy(_moveCurrs);

		};

	}());

	this.rotateXYZCamera = (function() {
		var moveDirection = new THREE.Vector3(),
			angle, v, v2, v3, bivector4;
		return function() {
			moveDirection.set(_moveCurrse.x - _movePrevse.x, _moveCurrse.y - _movePrevse.y, 0);
			angle = moveDirection.length();
			if (angle) {
				_this.active3 = _this.active4 = true;
				v = new THREE.Vector3(_this.object.matrix.elements[8], _this.object.matrix.elements[9], _this.object.matrix.elements[10]);
				angle *= _this.rotateSpeed;
				v2 = _this.object.up.clone().normalize().multiplyScalar(moveDirection.y);
				v3 = _this.object.up.clone().cross(v).normalize().multiplyScalar(moveDirection.x).add(v2);
				bivector4 = new THREE.Vector4(v3.x, v3.y, v3.z, 0).wedge(new THREE.Vector4(0, 0, 0, 1));
				object4.projectMatrix = (bivector4.generateRotation(angle).multiply(object4.projectMatrix));
				_lastAxis2.copy(bivector4);
				_lastAngle3 = angle;
			} else if (!_this.staticMoving && (_lastAngle3)) {
				_this.active3 = _this.active4 = true;
				_lastAngle3 *= Math.sqrt(1.0 - _this.dynamicDampingFactor);
				object4.projectMatrix = _lastAxis2.generateRotation(_lastAngle3).multiply(object4.projectMatrix);
			}
			_movePrevse.copy(_moveCurrse);
		};

	}());

	this.checkDistances = function() {

		if (!_this.noZoom || !_this.noPan) {

			if (_eye.lengthSq() > _this.maxDistance * _this.maxDistance) {
				_this.object.position.addVectors(_this.target, _eye.setLength(_this.maxDistance));
			}
			if (_eye.lengthSq() < _this.minDistance * _this.minDistance) {
				_this.object.position.addVectors(_this.target, _eye.setLength(_this.minDistance));
			}
		}
	};

	this.update = function() {
		_eye.subVectors(_this.object.position, _this.target);
		_this.active3 = _this.active4 = false;
		if (!_this.noRotate) {
			_this.rotateCamera();
		}
		if (!_this.noRotate_t) {
			_this.rotateTCamera();
		}
		if (!_this.noRotate_xyz) {
			_this.rotateXYZCamera();
		}
		if (!_this.noZoom) {
			_this.zoomCamera();
		}
		if (!_this.noPan) {
			_this.panCamera();
		}
		if (Math.abs(_lastAngle) < 0.001) _lastAngle = 0;
		if (Math.abs(_lastAngle2) < 0.001) _lastAngle2 = 0;
		if (Math.abs(_lastAngle3) < 0.001) _lastAngle3 = 0;
		_this.object.position.addVectors(_this.target, _eye);
		_this.checkDistances();
		_this.object.lookAt(_this.target);
		if (lastPosition.distanceToSquared(_this.object.position) > EPS) {
			_this.dispatchEvent(changeEvent);
			lastPosition.copy(_this.object.position);
		}
	};

	this.reset = function() {

		_state = STATE.NONE;
		_prevState = STATE.NONE;

		_this.target.copy(_this.target0);
		_this.object.position.copy(_this.position0);
		_this.object.up.copy(_this.up0);

		_eye.subVectors(_this.object.position, _this.target);

		_this.object.lookAt(_this.target);

		_this.dispatchEvent(changeEvent);

		lastPosition.copy(_this.object.position);

	};

	// listeners

	function mousedown(event) {

		if (_this.enabled === false) return;

		event.preventDefault();
		event.stopPropagation();

		if (_state === STATE.NONE) {

			_state = event.button;

		}

		if (_state === STATE.ROTATE && !_this.noRotate) {

			_moveCurr.copy(getMouseOnCircle(event.pageX, event.pageY));
			_movePrev.copy(_moveCurr);

		} else if (_state === STATE.ZOOM && !_this.noZoom) {

			_zoomStart.copy(getMouseOnScreen(event.pageX, event.pageY));
			_zoomEnd.copy(_zoomStart);

		} else if (_state === STATE.PAN && !_this.noPan) {

			_panStart.copy(getMouseOnScreen(event.pageX, event.pageY));
			_panEnd.copy(_panStart);

		} else if (_state === STATE.ROTATE_T && !_this.noRotate_t) {

			_moveCurrs.copy(getMouseOnCircle(event.pageX, event.pageY));
			_movePrevs.copy(_moveCurrs);

		} else if (_state === STATE.ROTATE_XYZ && !_this.noRotate_xyz) {

			_moveCurrse.copy(getMouseOnCircle(event.pageX, event.pageY));
			_movePrevse.copy(_moveCurrse);

		}

		document.addEventListener('mousemove', mousemove, false);
		document.addEventListener('mouseup', mouseup, false);

		_this.dispatchEvent(startEvent);

	}

	function mousemove(event) {

		if (_this.enabled === false) return;

		event.preventDefault();
		event.stopPropagation();
		if (_state === STATE.ROTATE && !_this.noRotate) {

			_movePrev.copy(_moveCurr);
			_moveCurr.copy(getMouseOnCircle(event.pageX, event.pageY));

		} else if (_state === STATE.ROTATE_T && !_this.noRotate_t) {

			_movePrevs.copy(_moveCurrs);
			_moveCurrs.copy(getMouseOnCircle(event.pageX, event.pageY));

		} else if (_state === STATE.ROTATE_XYZ && !_this.noRotate_xyz) {

			_movePrevse.copy(_moveCurrse);
			_moveCurrse.copy(getMouseOnCircle(event.pageX, event.pageY));

		} else if (_state === STATE.ZOOM && !_this.noZoom) {

			_zoomEnd.copy(getMouseOnScreen(event.pageX, event.pageY));

		} else if (_state === STATE.PAN && !_this.noPan) {

			_panEnd.copy(getMouseOnScreen(event.pageX, event.pageY));

		}

	}

	function mouseup(event) {

		if (_this.enabled === false) return;

		event.preventDefault();
		event.stopPropagation();

		_state = STATE.NONE;

		document.removeEventListener('mousemove', mousemove);
		document.removeEventListener('mouseup', mouseup);
		_this.dispatchEvent(endEvent);

	}

	function mousewheel(event) {

		if (_this.enabled === false) return;

		event.preventDefault();
		event.stopPropagation();

		var delta = 0;

		if (event.wheelDelta) { // WebKit / Opera / Explorer 9

			delta = event.wheelDelta / 40;

		} else if (event.detail) { // Firefox

			delta = -event.detail / 3;

		}

		_zoomStart.y += delta * 0.01;
		_this.dispatchEvent(startEvent);
		_this.dispatchEvent(endEvent);

	}

	function touchstart(event) {

		if (_this.enabled === false) return;

		switch (event.touches.length) {

			case 1:
				_state = STATE.TOUCH_ROTATE;
				_moveCurr.copy(getMouseOnCircle(event.touches[0].pageX, event.touches[0].pageY));
				_movePrev.copy(_moveCurr);
				break;

			case 2:
				_state = STATE.TOUCH_ZOOM_PAN;
				var dx = event.touches[0].pageX - event.touches[1].pageX;
				var dy = event.touches[0].pageY - event.touches[1].pageY;
				_touchZoomDistanceEnd = _touchZoomDistanceStart = Math.sqrt(dx * dx + dy * dy);

				var x = (event.touches[0].pageX + event.touches[1].pageX) / 2;
				var y = (event.touches[0].pageY + event.touches[1].pageY) / 2;
				_panStart.copy(getMouseOnScreen(x, y));
				_panEnd.copy(_panStart);
				break;

			default:
				_state = STATE.NONE;

		}
		_this.dispatchEvent(startEvent);

	}

	function touchmove(event) {

		if (_this.enabled === false) return;

		event.preventDefault();
		event.stopPropagation();

		switch (event.touches.length) {

			case 1:
				_movePrev.copy(_moveCurr);
				_moveCurr.copy(getMouseOnCircle(event.touches[0].pageX, event.touches[0].pageY));
				break;

			case 2:
				var dx = event.touches[0].pageX - event.touches[1].pageX;
				var dy = event.touches[0].pageY - event.touches[1].pageY;
				_touchZoomDistanceEnd = Math.sqrt(dx * dx + dy * dy);

				var x = (event.touches[0].pageX + event.touches[1].pageX) / 2;
				var y = (event.touches[0].pageY + event.touches[1].pageY) / 2;
				_panEnd.copy(getMouseOnScreen(x, y));
				break;

			default:
				_state = STATE.NONE;

		}

	}

	function touchend(event) {

		if (_this.enabled === false) return;

		switch (event.touches.length) {

			case 1:
				_movePrev.copy(_moveCurr);
				_moveCurr.copy(getMouseOnCircle(event.touches[0].pageX, event.touches[0].pageY));
				break;

			case 2:
				_touchZoomDistanceStart = _touchZoomDistanceEnd = 0;

				var x = (event.touches[0].pageX + event.touches[1].pageX) / 2;
				var y = (event.touches[0].pageY + event.touches[1].pageY) / 2;
				_panEnd.copy(getMouseOnScreen(x, y));
				_panStart.copy(_panEnd);
				break;

		}

		_state = STATE.NONE;
		_this.dispatchEvent(endEvent);

	}

	this.domElement.addEventListener('contextmenu', function(event) {
		event.preventDefault();
	}, false);

	this.domElement.addEventListener('mousedown', mousedown, false);

	this.domElement.addEventListener('mousewheel', mousewheel, false);
	this.domElement.addEventListener('DOMMouseScroll', mousewheel, false); // firefox

	this.domElement.addEventListener('touchstart', touchstart, false);
	this.domElement.addEventListener('touchend', touchend, false);
	this.domElement.addEventListener('touchmove', touchmove, false);
	document.addEventListener('keydown', function(ev) {
		_this.keyDown = true;
		_this.keyCode = ev.keyCode;
	});
	document.addEventListener('keyup', function(ev) {
		_this.keyDown = false;
	});
	this.handleResize();

	// force an update at start
	this.update();

};

FOUR.Controls.prototype = Object.create(THREE.EventDispatcher.prototype);
FOUR.Controls.prototype.constructor = FOUR.Controls;

FOUR.Bivector = function(xy, xz, xw, yz, yw, zw) {
	this.set(xy, xz, xw, yz, yw, zw);
}
FOUR.Bivector.prototype.set = function(xy, xz, xw, yz, yw, zw) {
	this.xy = (xy) ? xy : 0;
	this.xz = (xz) ? xz : 0;
	this.xw = (xw) ? xw : 0;
	this.yz = (yz) ? yz : 0;
	this.yw = (yw) ? yw : 0;
	this.zw = (zw) ? zw : 0;
}
FOUR.Bivector.prototype.clone = function() {
	return new FOUR.Bivector(this.xy, this.xz, this.xw, this.yz, this.yw, this.zw);
}
FOUR.Bivector.prototype.copy = function(a) {
	this.set(a.xy, a.xz, a.xw, a.yz, a.yw, a.zw);
}
FOUR.Bivector.prototype.normalize = function(a) {
	if (this.mangtitude()) return this.divideScalar(this.mangtitude());
	else return this;
}
FOUR.Bivector.prototype.dot = function(W) {
	if (W instanceof THREE.Vector4)
		return this.clone().hodgeDual().wedge(W);
	return this.xy * W.xy +
		this.xz * W.xz +
		this.xw * W.xw +
		this.yz * W.yz +
		this.yw * W.yw +
		this.zw * W.zw;
}
THREE.Vector4.prototype.wedge = function(V) {
	if (V instanceof THREE.Vector4)
		return new FOUR.Bivector(
			this.x * V.y - this.y * V.x,
			this.x * V.z - this.z * V.x,
			this.x * V.w - this.w * V.x,
			this.y * V.z - this.z * V.y,
			this.y * V.w - this.w * V.y,
			this.z * V.w - this.w * V.z
		);
	else if (V instanceof FOUR.Bivector) {
		return V.wedge(this);
	}
}
FOUR.Bivector.prototype.toMatrix = function() {
	return new THREE.Matrix4().set(
		0, this.xy, this.xz, this.xw, -this.xy, 0, this.yz, this.yw, -this.xz, -this.yz, 0, this.zw, -this.xw, -this.yw, -this.zw, 0
	);
}
FOUR.Bivector.prototype.hodgeDual = function() {
	var temp;
	temp = this.xy;
	this.xy = this.zw;
	this.zw = temp;
	temp = this.xz;
	this.xz = -this.yw;
	this.yw = -temp;
	temp = this.xw;
	this.xw = this.yz;
	this.yz = temp;
	return this;
}
FOUR.Bivector.prototype.mangtitude = function() {
	return Math.sqrt(this.xy * this.xy +
		this.xz * this.xz +
		this.xw * this.xw +
		this.yz * this.yz +
		this.yw * this.yw +
		this.zw * this.zw
	);
}
FOUR.Bivector.prototype.add = function(W) {
	this.xy += W.xy;
	this.xz += W.xz;
	this.xw += W.xw;
	this.yz += W.yz;
	this.yw += W.yw;
	this.zw += W.zw;
	return this;
}
FOUR.Bivector.prototype.sub = function(W) {
	this.xy -= W.xy;
	this.xz -= W.xz;
	this.xw -= W.xw;
	this.yz -= W.yz;
	this.yw -= W.yw;
	this.zw -= W.zw;
	return this;
}
FOUR.Bivector.prototype.multiplyScalar = function(m) {
	this.xy *= m;
	this.xz *= m;
	this.xw *= m;
	this.yz *= m;
	this.yw *= m;
	this.zw *= m;
	return this;
}
FOUR.Bivector.prototype.divideScalar = function(m) {
	m = 1 / m;
	this.xy *= m;
	this.xz *= m;
	this.xw *= m;
	this.yz *= m;
	this.yw *= m;
	this.zw *= m;
	return this;
}
FOUR.Bivector.prototype.cross = function(W) {
	return this.clone().hodgeDual().dot(W);
}
FOUR.Bivector.prototype.wedge = function(W) {
	if (W instanceof FOUR.Bivector) {
		return this.cross(W);
	} else if (W instanceof THREE.Vector4) {
		return new THREE.Vector4(-this.yz * W.w - this.zw * W.y + this.yw * W.z,
			this.xz * W.w + this.zw * W.x - this.xw * W.z, -this.xy * W.w - this.yw * W.x + this.xw * W.y,
			this.xy * W.z + this.yz * W.x - this.xz * W.y
		);
	}
};
FOUR.Bivector.prototype.generateRotation = function(s) {
	var F = this.clone().normalize().toMatrix();
	var P = new THREE.Matrix4().multiplyMatrices(F, F);
	var Q = new THREE.Matrix4().multiplyScalar(Math.cos(s)).add(F.multiplyScalar(Math.sin(s))).multiply(P);
	return new THREE.Matrix4().add(P).add(Q.multiplyScalar(-1));
}
FOUR.Bivector.prototype.getAngles = function(W) {
	if (W instanceof FOUR.Bivector) {
		var M = 1 / (this.mangtitude() * W.mangtitude()) * 0.9999999999999999;
		var P = Math.abs(this.dot(W)),
			Q = Math.abs(this.cross(W));
		var cmm = Math.acos((P + Q) * M);
		var cpp = Math.acos((P - Q) * M);
		return [(cpp + cmm) * 90 / Math.PI, (cpp - cmm) * 90 / Math.PI];
	} else if (W instanceof THREE.Vector4) {
		var P = 1 / (this.mangtitude() * W.length());
		return Math.asin(this.wedge(W).length() * P) * 180 / Math.PI;
	}
}
FOUR.Bivector.prototype.show = function() {
	console.table([
		[0, this.xy, this.xz, this.xw],
		[-this.xy, 0, this.yz, this.yw],
		[-this.xz, -this.yz, 0, this.zw],
		[-this.xw, -this.yw, -this.zw, 0]
	]);
}

THREE.Matrix4.prototype.add = function(v) {

	var te = this.elements;
	var me = v.elements;

	te[0] += me[0];
	te[4] += me[4];
	te[8] += me[8];
	te[12] += me[12];
	te[1] += me[1];
	te[5] += me[5];
	te[9] += me[9];
	te[13] += me[13];
	te[2] += me[2];
	te[6] += me[6];
	te[10] += me[10];
	te[14] += me[14];
	te[3] += me[3];
	te[7] += me[7];
	te[11] += me[11];
	te[15] += me[15];

	return this;

}
THREE.Matrix2 = function(n11, n12, n21, n22) {
	this.elements = new Float32Array(4);
	this.set(
		(n11 !== undefined) ? n11 : 1, n12 || 0,
		n21 || 0, (n22 !== undefined) ? n22 : 1
	);
};

THREE.Matrix2.prototype = {

	constructor: THREE.Matrix2,

	set: function(n11, n12, n21, n22) {

		var te = this.elements;

		te[0] = n11;
		te[2] = n12;
		te[1] = n21;
		te[3] = n22;

		return this;

	},

	identity: function() {

		this.set(

			1, 0,
			0, 1

		);

		return this;

	},

	copy: function(m) {

		var me = m.elements;

		this.set(

			me[0], me[2],
			me[1], me[3]

		);

		return this;

	},

	multiplyVector2: function(vector) {

		console.warn('DEPRECATED: Matrix2\'s .multiplyVector2() has been removed. Use vector.applyMatrix2( matrix ) instead.');
		return vector.applyMatrix3(this);

	},

	multiplyVector2Array: function() {

		var v1 = new THREE.Vector2();

		return function(a) {

			for (var i = 0, il = a.length; i < il; i += 2) {

				v1.x = a[i];
				v1.y = a[i + 1];

				v1.applyMatrix2(this);

				a[i] = v1.x;
				a[i + 1] = v1.y;

			}

			return a;

		};

	}(),

	multiplyScalar: function(s) {

		var te = this.elements;

		te[0] *= s;
		te[2] *= s;
		te[1] *= s;
		te[3] *= s;

		return this;

	},

	determinant: function() {

		var te = this.elements;

		var a = te[0],
			b = te[1],
			c = te[2],
			d = te[3];

		return a * d - b * c;

	},

	getInverse: function(matrix, throwOnInvertible) {

		// input: THREE.Matrix2
		// ( based on http://code.google.com/p/webgl-mjs/ )

		var me = matrix.elements;
		var te = this.elements;

		te[0] = me[3];
		te[1] = -me[1];
		te[2] = -me[2];
		te[3] = me[0];

		var det = me[0] * te[0] + me[1] * te[2];

		// no inverse

		if (det === 0) {

			var msg = "Matrix2.getInverse(): can't invert matrix, determinant is 0";

			if (throwOnInvertible || false) {

				throw new Error(msg);

			} else {

				console.warn(msg);

			}

			this.identity();

			return this;

		}

		this.multiplyScalar(1.0 / det);

		return this;

	},

	transpose: function() {

		var tmp, m = this.elements;

		tmp = m[1];
		m[1] = m[2];
		m[2] = tmp;

		return this;

	},

	clone: function() {

		var te = this.elements;

		return new THREE.Matrix3(

			te[0], te[3], te[6],
			te[1], te[4], te[7],
			te[2], te[5], te[8]

		);

	}

};
THREE.Vector2.prototype.applyMatrix2 = function(m) {
	var x = this.x;
	var y = this.y;

	var e = m.elements;

	this.x = e[0] * x + e[2] * y;
	this.y = e[1] * x + e[3] * y;

	return this;

}


//////////////////////////////////////////////////////////////////////
// 600cell.h

//-----------------------------------------------------
// Define the 600-cell's vertices, edges, and faces
// Created : atyuwen. Jan.11, 2009
//-----------------------------------------------------

FOUR.vertices600 = [
   2,0,0,0,-2,0,0,0,0,2,0,0,0,-2,0,0,0,0,2,0,0,0,-2,0,0,0,0,2,0,0,0,-2,0,1,0.618,1.618,0,-1,0.618,1.618,0,1,-0.618,1.618,0,1,0.618,-1.618,0,-1,-0.618,1.618,0,-1,0.618,-1.618,0,1,-0.618,-1.618,0,-1,-0.618,-1.618,0,0.618,1.618,1,0,-0.618,1.618,1,0,0.618,-1.618,1,0,0.618,1.618,-1,0,-0.618,-1.618,1,0,-0.618,1.618,-1,0,0.618,-1.618,-1,0,-0.618,-1.618,-1,0,1.618,1,0.618,0,-1.618,1,0.618,0,1.618,-1,0.618,0,1.618,1,-0.618,0,-1.618,-1,0.618,0,-1.618,1,-0.618,0,1.618,-1,-0.618,0,-1.618,-1,-0.618,1,0,1.618,0.618,-1,0,1.618,0.618,1,0,-1.618,0.618,1,0,1.618,-0.618,-1,0,-1.618,0.618,-1,0,1.618,-0.618,1,0,-1.618,-0.618,-1,0,-1.618,-0.618,0.618,0,1,1.618,-0.618,0,1,1.618,0.618,0,-1,1.618,0.618,0,1,-1.618,-0.618,0,-1,1.618,-0.618,0,1,-1.618,0.618,0,-1,-1.618,-0.618,0,-1,-1.618,1.618,0,0.618,1,-1.618,0,0.618,1,1.618,0,-0.618,1,1.618,0,0.618,-1,-1.618,0,-0.618,1,-1.618,0,0.618,-1,1.618,0,-0.618,-1,-1.618,0,-0.618,-1,0.618,1.618,0,1,-0.618,1.618,0,1,0.618,-1.618,0,1,0.618,1.618,0,-1,-0.618,-1.618,0,1,-0.618,1.618,0,-1,0.618,-1.618,0,-1,-0.618,-1.618,0,-1,1.618,1,0,0.618,-1.618,1,0,0.618,1.618,-1,0,0.618,1.618,1,0,-0.618,-1.618,-1,0,0.618,-1.618,1,0,-0.618,1.618,-1,0,-0.618,-1.618,-1,0,-0.618,1,0.618,0,1.618,-1,0.618,0,1.618,1,-0.618,0,1.618,1,0.618,0,-1.618,-1,-0.618,0,1.618,-1,0.618,0,-1.618,1,-0.618,0,-1.618,-1,-0.618,0,-1.618,1.618,0.618,1,0,-1.618,0.618,1,0,1.618,-0.618,1,0,1.618,0.618,-1,0,-1.618,-0.618,1,0,-1.618,0.618,-1,0,1.618,-0.618,-1,0,-1.618,-0.618,-1,0,1,1.618,0.618,0,-1,1.618,0.618,0,1,-1.618,0.618,0,1,1.618,-0.618,0,-1,-1.618,0.618,0,-1,1.618,-0.618,0,1,-1.618,-0.618,0,-1,-1.618,-0.618,0,0.618,1,1.618,0,-0.618,1,1.618,0,0.618,-1,1.618,0,0.618,1,-1.618,0,-0.618,-1,1.618,0,-0.618,1,-1.618,0,0.618,-1,-1.618,0,-0.618,-1,-1.618,0,1,1,1,1,-1,1,1,1,1,-1,1,1,1,1,-1,1,1,1,1,-1,-1,-1,1,1,-1,1,-1,1,-1,1,1,-1,1,-1,-1,1,1,-1,1,-1,1,1,-1,-1,-1,-1,-1,1,-1,-1,1,-1,-1,1,-1,-1,1,-1,-1,-1,-1,-1,-1,-1
];

FOUR.edges600 = [
  0,48,48,50,50,0,48,64,64,0,50,64,48,66,66,0,50,66,48,80,80,0,64,80,48,82,82,0,66,82,80,82,50,83,83,0,64,83,50,86,86,0,66,86,83,86,0,51,51,54,54,0,51,67,67,0,54,67,51,70,70,0,54,70,51,80,67,80,51,82,70,82,54,83,67,83,54,86,70,86,64,67,66,70,1,49,49,52,52,1,49,65,65,1,52,65,49,68,68,1,52,68,49,81,81,1,65,81,49,84,84,1,68,84,81,84,52,85,85,1,65,85,52,87,87,1,68,87,85,87,1,53,53,55,55,1,53,69,69,1,55,69,53,71,71,1,55,71,53,81,69,81,53,84,71,84,55,85,69,85,55,87,71,87,65,69,68,71,2,24,24,27,27,2,24,88,88,2,27,88,24,89,89,2,27,89,24,56,56,2,24,57,57,2,56,57,56,88,57,89,2,26,26,30,30,2,26,91,91,2,30,91,26,93,93,2,30,93,26,56,26,57,56,91,57,93,27,59,59,2,27,61,61,2,59,61,59,88,61,89,30,59,30,61,59,91,61,93,88,91,89,93,3,25,25,29,29,3,25,90,90,3,29,90,25,92,92,3,29,92,25,58,58,3,25,60,60,3,58,60,58,90,60,92,3,28,28,31,31,3,28,94,94,3,31,94,28,95,95,3,31,95,28,58,28,60,58,94,60,95,29,62,62,3,29,63,63,3,62,63,62,90,63,92,31,62,31,63,62,94,63,95,90,94,92,95,4,16,16,17,17,4,16,32,32,4,17,32,16,33,33,4,17,33,16,96,96,4,32,96,16,97,97,4,33,97,96,97,17,98,98,4,32,98,17,100,100,4,33,100,98,100,4,19,19,21,21,4,19,35,35,4,21,35,19,37,37,4,21,37,19,96,35,96,19,97,37,97,21,98,35,98,21,100,37,100,32,35,33,37,5,18,18,20,20,5,18,34,34,5,20,34,18,36,36,5,20,36,18,99,99,5,34,99,18,101,101,5,36,101,99,101,20,102,102,5,34,102,20,103,103,5,36,103,102,103,5,22,22,23,23,5,22,38,38,5,23,38,22,39,39,5,23,39,22,99,38,99,22,101,39,101,23,102,38,102,23,103,39,103,34,38,36,39,6,8,8,10,10,6,8,72,72,6,10,72,8,73,73,6,10,73,8,40,40,6,8,41,41,6,40,41,40,72,41,73,6,9,9,12,12,6,9,74,74,6,12,74,9,76,76,6,12,76,9,40,9,41,40,74,41,76,10,42,42,6,10,44,44,6,42,44,42,72,44,73,12,42,12,44,42,74,44,76,72,74,73,76,7,11,11,14,14,7,11,75,75,7,14,75,11,77,77,7,14,77,11,43,43,7,11,45,45,7,43,45,43,75,45,77,7,13,13,15,15,7,13,78,78,7,15,78,13,79,79,7,15,79,13,43,13,45,43,78,45,79,14,46,46,7,14,47,47,7,46,47,46,75,47,77,15,46,15,47,46,78,47,79,75,78,77,79,10,56,56,8,10,57,57,8,56,72,57,73,8,16,16,24,24,8,16,104,104,8,24,104,16,105,105,8,24,105,16,40,16,41,40,104,41,105,56,104,57,105,72,104,73,105,12,58,58,9,12,60,60,9,58,74,60,76,9,17,17,25,25,9,17,106,106,9,25,106,17,109,109,9,25,109,17,40,17,41,40,106,41,109,58,106,60,109,74,106,76,109,10,18,18,26,26,10,18,107,107,10,26,107,18,110,110,10,26,110,18,42,18,44,42,107,44,110,56,107,57,110,72,107,73,110,14,59,59,11,14,61,61,11,59,75,61,77,11,19,19,27,27,11,19,108,108,11,27,108,19,111,111,11,27,111,19,43,19,45,43,108,45,111,59,108,61,111,75,108,77,111,12,20,20,28,28,12,20,112,112,12,28,112,20,115,115,12,28,115,20,42,20,44,42,112,44,115,58,112,60,115,74,112,76,115,15,62,62,13,15,63,63,13,62,78,63,79,13,21,21,29,29,13,21,113,113,13,29,113,21,116,116,13,29,116,21,43,21,45,43,113,45,116,62,113,63,116,78,113,79,116,14,22,22,30,30,14,22,114,114,14,30,114,22,117,117,14,30,117,22,46,22,47,46,114,47,117,59,114,61,117,75,114,77,117,15,23,23,31,31,15,23,118,118,15,31,118,23,119,119,15,31,119,23,46,23,47,46,118,47,119,62,118,63,119,78,118,79,119,32,40,33,41,24,96,24,97,96,104,97,105,32,104,33,105,25,98,25,100,98,106,100,109,32,106,33,109,34,42,36,44,26,99,26,101,99,107,101,110,34,107,36,110,35,43,37,45,27,96,27,97,96,108,97,111,35,108,37,111,28,102,28,103,102,112,103,115,34,112,36,115,29,98,29,100,98,113,100,116,35,113,37,116,38,46,39,47,30,99,30,101,99,114,101,117,38,114,39,117,31,102,31,103,102,118,103,119,38,118,39,119,88,96,89,97,88,104,89,105,90,98,92,100,90,106,92,109,91,99,93,101,91,107,93,110,88,108,89,111,94,102,95,103,94,112,95,115,90,113,92,116,91,114,93,117,94,118,95,119,35,80,80,32,35,82,82,32,80,96,82,98,40,48,48,32,48,104,48,106,80,104,82,106,37,81,81,33,37,84,84,33,81,97,84,100,41,49,49,33,49,105,49,109,81,105,84,109,38,83,83,34,38,86,86,34,83,99,86,102,42,50,50,34,50,107,50,112,83,107,86,112,43,51,51,35,51,108,51,113,80,108,82,113,39,85,85,36,39,87,87,36,85,101,87,103,44,52,52,36,52,110,52,115,85,110,87,115,45,53,53,37,53,111,53,116,81,111,84,116,46,54,54,38,54,114,54,118,83,114,86,118,47,55,55,39,55,117,55,119,85,117,87,119,48,72,48,74,49,73,49,76,50,72,50,74,51,75,51,78,52,73,52,76,53,77,53,79,54,75,54,78,55,77,55,79,64,72,66,74,64,104,66,106,65,73,68,76,65,105,68,109,64,107,66,112,67,75,70,78,67,108,70,113,65,110,68,115,69,77,71,79,69,111,71,116,67,114,70,118,69,117,71,119,56,64,64,88,64,91,57,65,65,89,65,93,58,66,66,90,66,94,59,67,67,88,67,91,60,68,68,92,68,95,61,69,69,89,69,93,62,70,70,90,70,94,63,71,71,92,71,95,80,88,83,91,81,89,85,93,82,90,86,94,84,92,87,95
];

FOUR.faces600 = [
  0,48,50,0,48,64,0,50,64,48,50,64,0,48,66,0,50,66,48,50,66,0,48,80,0,64,80,48,64,80,0,48,82,0,66,82,48,66,82,0,80,82,48,80,82,0,50,83,0,64,83,50,64,83,0,50,86,0,66,86,50,66,86,0,83,86,50,83,86,0,51,54,0,51,67,0,54,67,51,54,67,0,51,70,0,54,70,51,54,70,0,51,80,0,67,80,51,67,80,0,51,82,0,70,82,51,70,82,51,80,82,0,54,83,0,67,83,54,67,83,0,54,86,0,70,86,54,70,86,54,83,86,0,64,67,64,67,80,64,67,83,0,66,70,66,70,82,66,70,86,1,49,52,1,49,65,1,52,65,49,52,65,1,49,68,1,52,68,49,52,68,1,49,81,1,65,81,49,65,81,1,49,84,1,68,84,49,68,84,1,81,84,49,81,84,1,52,85,1,65,85,52,65,85,1,52,87,1,68,87,52,68,87,1,85,87,52,85,87,1,53,55,1,53,69,1,55,69,53,55,69,1,53,71,1,55,71,53,55,71,1,53,81,1,69,81,53,69,81,1,53,84,1,71,84,53,71,84,53,81,84,1,55,85,1,69,85,55,69,85,1,55,87,1,71,87,55,71,87,55,85,87,1,65,69,65,69,81,65,69,85,1,68,71,68,71,84,68,71,87,2,24,27,2,24,88,2,27,88,24,27,88,2,24,89,2,27,89,24,27,89,2,24,56,2,24,57,2,56,57,24,56,57,2,56,88,24,56,88,2,57,89,24,57,89,2,26,30,2,26,91,2,30,91,26,30,91,2,26,93,2,30,93,26,30,93,2,26,56,2,26,57,26,56,57,2,56,91,26,56,91,2,57,93,26,57,93,2,27,59,2,27,61,2,59,61,27,59,61,2,59,88,27,59,88,2,61,89,27,61,89,2,30,59,2,30,61,30,59,61,2,59,91,30,59,91,2,61,93,30,61,93,2,88,91,56,88,91,2,89,93,57,89,93,59,88,91,61,89,93,3,25,29,3,25,90,3,29,90,25,29,90,3,25,92,3,29,92,25,29,92,3,25,58,3,25,60,3,58,60,25,58,60,3,58,90,25,58,90,3,60,92,25,60,92,3,28,31,3,28,94,3,31,94,28,31,94,3,28,95,3,31,95,28,31,95,3,28,58,3,28,60,28,58,60,3,58,94,28,58,94,3,60,95,28,60,95,3,29,62,3,29,63,3,62,63,29,62,63,3,62,90,29,62,90,3,63,92,29,63,92,3,31,62,3,31,63,31,62,63,3,62,94,31,62,94,3,63,95,31,63,95,3,90,94,58,90,94,3,92,95,60,92,95,62,90,94,63,92,95,4,16,17,4,16,32,4,17,32,16,17,32,4,16,33,4,17,33,16,17,33,4,16,96,4,32,96,16,32,96,4,16,97,4,33,97,16,33,97,4,96,97,16,96,97,4,17,98,4,32,98,17,32,98,4,17,100,4,33,100,17,33,100,4,98,100,17,98,100,4,19,21,4,19,35,4,21,35,19,21,35,4,19,37,4,21,37,19,21,37,4,19,96,4,35,96,19,35,96,4,19,97,4,37,97,19,37,97,19,96,97,4,21,98,4,35,98,21,35,98,4,21,100,4,37,100,21,37,100,21,98,100,4,32,35,32,35,96,32,35,98,4,33,37,33,37,97,33,37,100,5,18,20,5,18,34,5,20,34,18,20,34,5,18,36,5,20,36,18,20,36,5,18,99,5,34,99,18,34,99,5,18,101,5,36,101,18,36,101,5,99,101,18,99,101,5,20,102,5,34,102,20,34,102,5,20,103,5,36,103,20,36,103,5,102,103,20,102,103,5,22,23,5,22,38,5,23,38,22,23,38,5,22,39,5,23,39,22,23,39,5,22,99,5,38,99,22,38,99,5,22,101,5,39,101,22,39,101,22,99,101,5,23,102,5,38,102,23,38,102,5,23,103,5,39,103,23,39,103,23,102,103,5,34,38,34,38,99,34,38,102,5,36,39,36,39,101,36,39,103,6,8,10,6,8,72,6,10,72,8,10,72,6,8,73,6,10,73,8,10,73,6,8,40,6,8,41,6,40,41,8,40,41,6,40,72,8,40,72,6,41,73,8,41,73,6,9,12,6,9,74,6,12,74,9,12,74,6,9,76,6,12,76,9,12,76,6,9,40,6,9,41,9,40,41,6,40,74,9,40,74,6,41,76,9,41,76,6,10,42,6,10,44,6,42,44,10,42,44,6,42,72,10,42,72,6,44,73,10,44,73,6,12,42,6,12,44,12,42,44,6,42,74,12,42,74,6,44,76,12,44,76,6,72,74,40,72,74,6,73,76,41,73,76,42,72,74,44,73,76,7,11,14,7,11,75,7,14,75,11,14,75,7,11,77,7,14,77,11,14,77,7,11,43,7,11,45,7,43,45,11,43,45,7,43,75,11,43,75,7,45,77,11,45,77,7,13,15,7,13,78,7,15,78,13,15,78,7,13,79,7,15,79,13,15,79,7,13,43,7,13,45,13,43,45,7,43,78,13,43,78,7,45,79,13,45,79,7,14,46,7,14,47,7,46,47,14,46,47,7,46,75,14,46,75,7,47,77,14,47,77,7,15,46,7,15,47,15,46,47,7,46,78,15,46,78,7,47,79,15,47,79,7,75,78,43,75,78,7,77,79,45,77,79,46,75,78,47,77,79,8,10,56,8,10,57,8,56,57,10,56,57,8,56,72,10,56,72,8,57,73,10,57,73,8,16,24,8,16,104,8,24,104,16,24,104,8,16,105,8,24,105,16,24,105,8,16,40,8,16,41,16,40,41,8,40,104,16,40,104,8,41,105,16,41,105,8,24,56,8,24,57,8,56,104,24,56,104,8,57,105,24,57,105,8,72,104,40,72,104,8,73,105,41,73,105,56,72,104,57,73,105,9,12,58,9,12,60,9,58,60,12,58,60,9,58,74,12,58,74,9,60,76,12,60,76,9,17,25,9,17,106,9,25,106,17,25,106,9,17,109,9,25,109,17,25,109,9,17,40,9,17,41,17,40,41,9,40,106,17,40,106,9,41,109,17,41,109,9,25,58,9,25,60,9,58,106,25,58,106,9,60,109,25,60,109,9,74,106,40,74,106,9,76,109,41,76,109,58,74,106,60,76,109,10,18,26,10,18,107,10,26,107,18,26,107,10,18,110,10,26,110,18,26,110,10,18,42,10,18,44,18,42,44,10,42,107,18,42,107,10,44,110,18,44,110,10,26,56,10,26,57,10,56,107,26,56,107,10,57,110,26,57,110,10,72,107,42,72,107,10,73,110,44,73,110,56,72,107,57,73,110,11,14,59,11,14,61,11,59,61,14,59,61,11,59,75,14,59,75,11,61,77,14,61,77,11,19,27,11,19,108,11,27,108,19,27,108,11,19,111,11,27,111,19,27,111,11,19,43,11,19,45,19,43,45,11,43,108,19,43,108,11,45,111,19,45,111,11,27,59,11,27,61,11,59,108,27,59,108,11,61,111,27,61,111,11,75,108,43,75,108,11,77,111,45,77,111,59,75,108,61,77,111,12,20,28,12,20,112,12,28,112,20,28,112,12,20,115,12,28,115,20,28,115,12,20,42,12,20,44,20,42,44,12,42,112,20,42,112,12,44,115,20,44,115,12,28,58,12,28,60,12,58,112,28,58,112,12,60,115,28,60,115,12,74,112,42,74,112,12,76,115,44,76,115,58,74,112,60,76,115,13,15,62,13,15,63,13,62,63,15,62,63,13,62,78,15,62,78,13,63,79,15,63,79,13,21,29,13,21,113,13,29,113,21,29,113,13,21,116,13,29,116,21,29,116,13,21,43,13,21,45,21,43,45,13,43,113,21,43,113,13,45,116,21,45,116,13,29,62,13,29,63,13,62,113,29,62,113,13,63,116,29,63,116,13,78,113,43,78,113,13,79,116,45,79,116,62,78,113,63,79,116,14,22,30,14,22,114,14,30,114,22,30,114,14,22,117,14,30,117,22,30,117,14,22,46,14,22,47,22,46,47,14,46,114,22,46,114,14,47,117,22,47,117,14,30,59,14,30,61,14,59,114,30,59,114,14,61,117,30,61,117,14,75,114,46,75,114,14,77,117,47,77,117,59,75,114,61,77,117,15,23,31,15,23,118,15,31,118,23,31,118,15,23,119,15,31,119,23,31,119,15,23,46,15,23,47,23,46,47,15,46,118,23,46,118,15,47,119,23,47,119,15,31,62,15,31,63,15,62,118,31,62,118,15,63,119,31,63,119,15,78,118,46,78,118,15,79,119,47,79,119,62,78,118,63,79,119,16,17,40,16,32,40,17,32,40,16,17,41,16,33,41,17,33,41,16,24,96,16,24,97,24,96,97,16,96,104,24,96,104,16,97,105,24,97,105,16,32,104,32,40,104,32,96,104,16,33,105,33,41,105,33,97,105,17,25,98,17,25,100,25,98,100,17,98,106,25,98,106,17,100,109,25,100,109,17,32,106,32,40,106,32,98,106,17,33,109,33,41,109,33,100,109,18,20,42,18,34,42,20,34,42,18,20,44,18,36,44,20,36,44,18,26,99,18,26,101,26,99,101,18,99,107,26,99,107,18,101,110,26,101,110,18,34,107,34,42,107,34,99,107,18,36,110,36,44,110,36,101,110,19,21,43,19,35,43,21,35,43,19,21,45,19,37,45,21,37,45,19,27,96,19,27,97,27,96,97,19,96,108,27,96,108,19,97,111,27,97,111,19,35,108,35,43,108,35,96,108,19,37,111,37,45,111,37,97,111,20,28,102,20,28,103,28,102,103,20,102,112,28,102,112,20,103,115,28,103,115,20,34,112,34,42,112,34,102,112,20,36,115,36,44,115,36,103,115,21,29,98,21,29,100,29,98,100,21,98,113,29,98,113,21,100,116,29,100,116,21,35,113,35,43,113,35,98,113,21,37,116,37,45,116,37,100,116,22,23,46,22,38,46,23,38,46,22,23,47,22,39,47,23,39,47,22,30,99,22,30,101,30,99,101,22,99,114,30,99,114,22,101,117,30,101,117,22,38,114,38,46,114,38,99,114,22,39,117,39,47,117,39,101,117,23,31,102,23,31,103,31,102,103,23,102,118,31,102,118,23,103,119,31,103,119,23,38,118,38,46,118,38,102,118,23,39,119,39,47,119,39,103,119,24,27,96,24,88,96,27,88,96,24,27,97,24,89,97,27,89,97,24,88,104,56,88,104,24,89,105,57,89,105,88,96,104,89,97,105,25,29,98,25,90,98,29,90,98,25,29,100,25,92,100,29,92,100,25,90,106,58,90,106,25,92,109,60,92,109,90,98,106,92,100,109,26,30,99,26,91,99,30,91,99,26,30,101,26,93,101,30,93,101,26,91,107,56,91,107,26,93,110,57,93,110,91,99,107,93,101,110,27,88,108,59,88,108,27,89,111,61,89,111,88,96,108,89,97,111,28,31,102,28,94,102,31,94,102,28,31,103,28,95,103,31,95,103,28,94,112,58,94,112,28,95,115,60,95,115,94,102,112,95,103,115,29,90,113,62,90,113,29,92,116,63,92,116,90,98,113,92,100,116,30,91,114,59,91,114,30,93,117,61,93,117,91,99,114,93,101,117,31,94,118,62,94,118,31,95,119,63,95,119,94,102,118,95,103,119,32,35,80,32,35,82,32,80,82,35,80,82,32,80,96,35,80,96,32,82,98,35,82,98,32,40,48,32,48,104,40,48,104,32,48,106,40,48,106,32,48,80,32,48,82,32,80,104,48,80,104,32,82,106,48,82,106,80,96,104,82,98,106,33,37,81,33,37,84,33,81,84,37,81,84,33,81,97,37,81,97,33,84,100,37,84,100,33,41,49,33,49,105,41,49,105,33,49,109,41,49,109,33,49,81,33,49,84,33,81,105,49,81,105,33,84,109,49,84,109,81,97,105,84,100,109,34,38,83,34,38,86,34,83,86,38,83,86,34,83,99,38,83,99,34,86,102,38,86,102,34,42,50,34,50,107,42,50,107,34,50,112,42,50,112,34,50,83,34,50,86,34,83,107,50,83,107,34,86,112,50,86,112,83,99,107,86,102,112,35,43,51,35,51,108,43,51,108,35,51,113,43,51,113,35,51,80,35,51,82,35,80,108,51,80,108,35,82,113,51,82,113,80,96,108,82,98,113,36,39,85,36,39,87,36,85,87,39,85,87,36,85,101,39,85,101,36,87,103,39,87,103,36,44,52,36,52,110,44,52,110,36,52,115,44,52,115,36,52,85,36,52,87,36,85,110,52,85,110,36,87,115,52,87,115,85,101,110,87,103,115,37,45,53,37,53,111,45,53,111,37,53,116,45,53,116,37,53,81,37,53,84,37,81,111,53,81,111,37,84,116,53,84,116,81,97,111,84,100,116,38,46,54,38,54,114,46,54,114,38,54,118,46,54,118,38,54,83,38,54,86,38,83,114,54,83,114,38,86,118,54,86,118,83,99,114,86,102,118,39,47,55,39,55,117,47,55,117,39,55,119,47,55,119,39,55,85,39,55,87,39,85,117,55,85,117,39,87,119,55,87,119,85,101,117,87,103,119,40,48,72,40,48,74,48,72,74,48,72,104,48,74,106,41,49,73,41,49,76,49,73,76,49,73,105,49,76,109,42,50,72,42,50,74,50,72,74,50,72,107,50,74,112,43,51,75,43,51,78,51,75,78,51,75,108,51,78,113,44,52,73,44,52,76,52,73,76,52,73,110,52,76,115,45,53,77,45,53,79,53,77,79,53,77,111,53,79,116,46,54,75,46,54,78,54,75,78,54,75,114,54,78,118,47,55,77,47,55,79,55,77,79,55,77,117,55,79,119,48,50,72,48,64,72,50,64,72,48,50,74,48,66,74,50,66,74,48,64,104,64,72,104,64,80,104,48,66,106,66,74,106,66,82,106,49,52,73,49,65,73,52,65,73,49,52,76,49,68,76,52,68,76,49,65,105,65,73,105,65,81,105,49,68,109,68,76,109,68,84,109,50,64,107,64,72,107,64,83,107,50,66,112,66,74,112,66,86,112,51,54,75,51,67,75,54,67,75,51,54,78,51,70,78,54,70,78,51,67,108,67,75,108,67,80,108,51,70,113,70,78,113,70,82,113,52,65,110,65,73,110,65,85,110,52,68,115,68,76,115,68,87,115,53,55,77,53,69,77,55,69,77,53,55,79,53,71,79,55,71,79,53,69,111,69,77,111,69,81,111,53,71,116,71,79,116,71,84,116,54,67,114,67,75,114,67,83,114,54,70,118,70,78,118,70,86,118,55,69,117,69,77,117,69,85,117,55,71,119,71,79,119,71,87,119,56,64,72,56,64,104,56,64,107,56,64,88,56,64,91,64,88,91,64,88,104,64,91,107,57,65,73,57,65,105,57,65,110,57,65,89,57,65,93,65,89,93,65,89,105,65,93,110,58,66,74,58,66,106,58,66,112,58,66,90,58,66,94,66,90,94,66,90,106,66,94,112,59,67,75,59,67,108,59,67,114,59,67,88,59,67,91,67,88,91,67,88,108,67,91,114,60,68,76,60,68,109,60,68,115,60,68,92,60,68,95,68,92,95,68,92,109,68,95,115,61,69,77,61,69,111,61,69,117,61,69,89,61,69,93,69,89,93,69,89,111,69,93,117,62,70,78,62,70,113,62,70,118,62,70,90,62,70,94,70,90,94,70,90,113,70,94,118,63,71,79,63,71,116,63,71,119,63,71,92,63,71,95,71,92,95,71,92,116,71,95,119,64,67,88,64,80,88,67,80,88,64,67,91,64,83,91,67,83,91,80,88,104,83,91,107,65,69,89,65,81,89,69,81,89,65,69,93,65,85,93,69,85,93,81,89,105,85,93,110,66,70,90,66,82,90,70,82,90,66,70,94,66,86,94,70,86,94,82,90,106,86,94,112,80,88,108,83,91,114,68,71,92,68,84,92,71,84,92,68,71,95,68,87,95,71,87,95,84,92,109,87,95,115,81,89,111,85,93,117,82,90,113,86,94,118,84,92,116,87,95,119,80,88,96,81,89,97,82,90,98,83,91,99,84,92,100,85,93,101,86,94,102,87,95,103
]
FOUR.vertices120 = [
  1.851,0.2701,0,0.7071,1.851,-0.2701,0,0.7071,1.851,0.437,0.437,0.437,1.851,-0.437,0.437,0.437,1.851,0,0.7071,0.2701,1.851,0.437,-0.437,0.437,1.851,-0.437,-0.437,0.437,1.851,0,-0.7071,0.2701,1.851,0.2701,0,-0.7071,1.851,-0.2701,0,-0.7071,1.851,0.437,0.437,-0.437,1.851,-0.437,0.437,-0.437,1.851,0,0.7071,-0.2701,1.851,0.437,-0.437,-0.437,1.851,-0.437,-0.437,-0.437,1.851,0,-0.7071,-0.2701,1.851,0.7071,0.2701,0,1.851,0.7071,-0.2701,0,1.851,-0.7071,0.2701,0,1.851,-0.7071,-0.2701,0,-1.851,0.2701,0,0.7071,-1.851,-0.2701,0,0.7071,-1.851,0.437,0.437,0.437,-1.851,-0.437,0.437,0.437,-1.851,0,0.7071,0.2701,-1.851,0.437,-0.437,0.437,-1.851,-0.437,-0.437,0.437,-1.851,0,-0.7071,0.2701,-1.851,0.2701,0,-0.7071,-1.851,-0.2701,0,-0.7071,-1.851,0.437,0.437,-0.437,-1.851,-0.437,0.437,-0.437,-1.851,0,0.7071,-0.2701,-1.851,0.437,-0.437,-0.437,-1.851,-0.437,-0.437,-0.437,-1.851,0,-0.7071,-0.2701,-1.851,0.7071,0.2701,0,-1.851,0.7071,-0.2701,0,-1.851,-0.7071,0.2701,0,-1.851,-0.7071,-0.2701,0,0.2701,1.851,0.7071,0,-0.2701,1.851,0.7071,0,0,1.851,0.2701,0.7071,0.437,1.851,0.437,0.437,-0.437,1.851,0.437,0.437,0.2701,1.851,-0.7071,0,-0.2701,1.851,-0.7071,0,0,1.851,-0.2701,0.7071,0.437,1.851,-0.437,0.437,-0.437,1.851,-0.437,0.437,0,1.851,0.2701,-0.7071,0.437,1.851,0.437,-0.437,-0.437,1.851,0.437,-0.437,0,1.851,-0.2701,-0.7071,0.437,1.851,-0.437,-0.437,-0.437,1.851,-0.437,-0.437,0.7071,1.851,0,0.2701,-0.7071,1.851,0,0.2701,0.7071,1.851,0,-0.2701,-0.7071,1.851,0,-0.2701,0.2701,-1.851,0.7071,0,-0.2701,-1.851,0.7071,0,0,-1.851,0.2701,0.7071,0.437,-1.851,0.437,0.437,-0.437,-1.851,0.437,0.437,0.2701,-1.851,-0.7071,0,-0.2701,-1.851,-0.7071,0,0,-1.851,-0.2701,0.7071,0.437,-1.851,-0.437,0.437,-0.437,-1.851,-0.437,0.437,0,-1.851,0.2701,-0.7071,0.437,-1.851,0.437,-0.437,-0.437,-1.851,0.437,-0.437,0,-1.851,-0.2701,-0.7071,0.437,-1.851,-0.437,-0.437,-0.437,-1.851,-0.437,-0.437,0.7071,-1.851,0,0.2701,-0.7071,-1.851,0,0.2701,0.7071,-1.851,0,-0.2701,-0.7071,-1.851,0,-0.2701,0.2701,0,1.851,0.7071,-0.2701,0,1.851,0.7071,0.437,0.437,1.851,0.437,-0.437,0.437,1.851,0.437,0,0.7071,1.851,0.2701,0.437,-0.437,1.851,0.437,-0.437,-0.437,1.851,0.437,0,-0.7071,1.851,0.2701,0.2701,0,1.851,-0.7071,-0.2701,0,1.851,-0.7071,0.437,0.437,1.851,-0.437,-0.437,0.437,1.851,-0.437,0,0.7071,1.851,-0.2701,0.437,-0.437,1.851,-0.437,-0.437,-0.437,1.851,-0.437,0,-0.7071,1.851,-0.2701,0.7071,0.2701,1.851,0,0.7071,-0.2701,1.851,0,-0.7071,0.2701,1.851,0,-0.7071,-0.2701,1.851,0,0.2701,0,-1.851,0.7071,-0.2701,0,-1.851,0.7071,0.437,0.437,-1.851,0.437,-0.437,0.437,-1.851,0.437,0,0.7071,-1.851,0.2701,0.437,-0.437,-1.851,0.437,-0.437,-0.437,-1.851,0.437,0,-0.7071,-1.851,0.2701,0.2701,0,-1.851,-0.7071,-0.2701,0,-1.851,-0.7071,0.437,0.437,-1.851,-0.437,-0.437,0.437,-1.851,-0.437,0,0.7071,-1.851,-0.2701,0.437,-0.437,-1.851,-0.437,-0.437,-0.437,-1.851,-0.437,0,-0.7071,-1.851,-0.2701,0.7071,0.2701,-1.851,0,0.7071,-0.2701,-1.851,0,-0.7071,0.2701,-1.851,0,-0.7071,-0.2701,-1.851,0,0.2701,0.7071,0,1.851,-0.2701,0.7071,0,1.851,0,0.2701,0.7071,1.851,0.437,0.437,0.437,1.851,-0.437,0.437,0.437,1.851,0.2701,-0.7071,0,1.851,-0.2701,-0.7071,0,1.851,0,-0.2701,0.7071,1.851,0.437,-0.437,0.437,1.851,-0.437,-0.437,0.437,1.851,0,0.2701,-0.7071,1.851,0.437,0.437,-0.437,1.851,-0.437,0.437,-0.437,1.851,0,-0.2701,-0.7071,1.851,0.437,-0.437,-0.437,1.851,-0.437,-0.437,-0.437,1.851,0.7071,0,0.2701,1.851,-0.7071,0,0.2701,1.851,0.7071,0,-0.2701,1.851,-0.7071,0,-0.2701,1.851,0.2701,0.7071,0,-1.851,-0.2701,0.7071,0,-1.851,0,0.2701,0.7071,-1.851,0.437,0.437,0.437,-1.851,-0.437,0.437,0.437,-1.851,0.2701,-0.7071,0,-1.851,-0.2701,-0.7071,0,-1.851,0,-0.2701,0.7071,-1.851,0.437,-0.437,0.437,-1.851,-0.437,-0.437,0.437,-1.851,0,0.2701,-0.7071,-1.851,0.437,0.437,-0.437,-1.851,-0.437,0.437,-0.437,-1.851,0,-0.2701,-0.7071,-1.851,0.437,-0.437,-0.437,-1.851,-0.437,-0.437,-0.437,-1.851,0.7071,0,0.2701,-1.851,-0.7071,0,0.2701,-1.851,0.7071,0,-0.2701,-1.851,-0.7071,0,-0.2701,-1.851,0,1.414,0,1.414,0.437,1.144,0,1.581,-0.437,1.144,0,1.581,0.2701,1.144,1.144,1.144,-0.2701,1.144,1.144,1.144,0,0.437,1.144,1.581,0.437,0.7071,1.144,1.414,-0.437,0.7071,1.144,1.414,0,1.581,0.437,1.144,0.437,1.414,0.7071,1.144,-0.437,1.414,0.7071,1.144,0.7071,0.7071,0.7071,1.581,-0.7071,0.7071,0.7071,1.581,0.7071,1.144,0.437,1.414,-0.7071,1.144,0.437,1.414,0,-1.414,0,1.414,0.437,-1.144,0,1.581,-0.437,-1.144,0,1.581,0.2701,-1.144,1.144,1.144,-0.2701,-1.144,1.144,1.144,0,-0.437,1.144,1.581,0.437,-0.7071,1.144,1.414,-0.437,-0.7071,1.144,1.414,0,-1.581,0.437,1.144,0.437,-1.414,0.7071,1.144,-0.437,-1.414,0.7071,1.144,0.7071,-0.7071,0.7071,1.581,-0.7071,-0.7071,0.7071,1.581,0.7071,-1.144,0.437,1.414,-0.7071,-1.144,0.437,1.414,0.2701,1.144,-1.144,1.144,-0.2701,1.144,-1.144,1.144,0,0.437,-1.144,1.581,0.437,0.7071,-1.144,1.414,-0.437,0.7071,-1.144,1.414,0,1.581,-0.437,1.144,0.437,1.414,-0.7071,1.144,-0.437,1.414,-0.7071,1.144,0.7071,0.7071,-0.7071,1.581,-0.7071,0.7071,-0.7071,1.581,0.7071,1.144,-0.437,1.414,-0.7071,1.144,-0.437,1.414,0,1.414,0,-1.414,0.437,1.144,0,-1.581,-0.437,1.144,0,-1.581,0.2701,1.144,1.144,-1.144,-0.2701,1.144,1.144,-1.144,0,0.437,1.144,-1.581,0.437,0.7071,1.144,-1.414,-0.437,0.7071,1.144,-1.414,0,1.581,0.437,-1.144,0.437,1.414,0.7071,-1.144,-0.437,1.414,0.7071,-1.144,0.7071,0.7071,0.7071,-1.581,-0.7071,0.7071,0.7071,-1.581,0.7071,1.144,0.437,-1.414,-0.7071,1.144,0.437,-1.414,0.2701,-1.144,-1.144,1.144,-0.2701,-1.144,-1.144,1.144,0,-0.437,-1.144,1.581,0.437,-0.7071,-1.144,1.414,-0.437,-0.7071,-1.144,1.414,0,-1.581,-0.437,1.144,0.437,-1.414,-0.7071,1.144,-0.437,-1.414,-0.7071,1.144,0.7071,-0.7071,-0.7071,1.581,-0.7071,-0.7071,-0.7071,1.581,0.7071,-1.144,-0.437,1.414,-0.7071,-1.144,-0.437,1.414,0,-1.414,0,-1.414,0.437,-1.144,0,-1.581,-0.437,-1.144,0,-1.581,0.2701,-1.144,1.144,-1.144,-0.2701,-1.144,1.144,-1.144,0,-0.437,1.144,-1.581,0.437,-0.7071,1.144,-1.414,-0.437,-0.7071,1.144,-1.414,0,-1.581,0.437,-1.144,0.437,-1.414,0.7071,-1.144,-0.437,-1.414,0.7071,-1.144,0.7071,-0.7071,0.7071,-1.581,-0.7071,-0.7071,0.7071,-1.581,0.7071,-1.144,0.437,-1.414,-0.7071,-1.144,0.437,-1.414,0.2701,1.144,-1.144,-1.144,-0.2701,1.144,-1.144,-1.144,0,0.437,-1.144,-1.581,0.437,0.7071,-1.144,-1.414,-0.437,0.7071,-1.144,-1.414,0,1.581,-0.437,-1.144,0.437,1.414,-0.7071,-1.144,-0.437,1.414,-0.7071,-1.144,0.7071,0.7071,-0.7071,-1.581,-0.7071,0.7071,-0.7071,-1.581,0.7071,1.144,-0.437,-1.414,-0.7071,1.144,-0.437,-1.414,0.2701,-1.144,-1.144,-1.144,-0.2701,-1.144,-1.144,-1.144,0,-0.437,-1.144,-1.581,0.437,-0.7071,-1.144,-1.414,-0.437,-0.7071,-1.144,-1.414,0,-1.581,-0.437,-1.144,0.437,-1.414,-0.7071,-1.144,-0.437,-1.414,-0.7071,-1.144,0.7071,-0.7071,-0.7071,-1.581,-0.7071,-0.7071,-0.7071,-1.581,0.7071,-1.144,-0.437,-1.414,-0.7071,-1.144,-0.437,-1.414,0.437,0,1.581,1.144,-0.437,0,1.581,1.144,0,0,1.414,1.414,0,1.144,1.581,0.437,0.437,1.144,1.414,0.7071,-0.437,1.144,1.414,0.7071,0.7071,0.437,1.414,1.144,0.7071,0.7071,1.581,0.7071,-0.7071,0.437,1.414,1.144,-0.7071,0.7071,1.581,0.7071,0,-1.144,1.581,0.437,0.437,-1.144,1.414,0.7071,-0.437,-1.144,1.414,0.7071,0.7071,-0.437,1.414,1.144,0.7071,-0.7071,1.581,0.7071,-0.7071,-0.437,1.414,1.144,-0.7071,-0.7071,1.581,0.7071,0.437,0,-1.581,1.144,-0.437,0,-1.581,1.144,0,0,-1.414,1.414,0,1.144,-1.581,0.437,0.437,1.144,-1.414,0.7071,-0.437,1.144,-1.414,0.7071,0.7071,0.437,-1.414,1.144,0.7071,0.7071,-1.581,0.7071,-0.7071,0.437,-1.414,1.144,-0.7071,0.7071,-1.581,0.7071,0.437,0,1.581,-1.144,-0.437,0,1.581,-1.144,0,0,1.414,-1.414,0,1.144,1.581,-0.437,0.437,1.144,1.414,-0.7071,-0.437,1.144,1.414,-0.7071,0.7071,0.437,1.414,-1.144,0.7071,0.7071,1.581,-0.7071,-0.7071,0.437,1.414,-1.144,-0.7071,0.7071,1.581,-0.7071,0,-1.144,-1.581,0.437,0.437,-1.144,-1.414,0.7071,-0.437,-1.144,-1.414,0.7071,0.7071,-0.437,-1.414,1.144,0.7071,-0.7071,-1.581,0.7071,-0.7071,-0.437,-1.414,1.144,-0.7071,-0.7071,-1.581,0.7071,0,-1.144,1.581,-0.437,0.437,-1.144,1.414,-0.7071,-0.437,-1.144,1.414,-0.7071,0.7071,-0.437,1.414,-1.144,0.7071,-0.7071,1.581,-0.7071,-0.7071,-0.437,1.414,-1.144,-0.7071,-0.7071,1.581,-0.7071,0.437,0,-1.581,-1.144,-0.437,0,-1.581,-1.144,0,0,-1.414,-1.414,0,1.144,-1.581,-0.437,0.437,1.144,-1.414,-0.7071,-0.437,1.144,-1.414,-0.7071,0.7071,0.437,-1.414,-1.144,0.7071,0.7071,-1.581,-0.7071,-0.7071,0.437,-1.414,-1.144,-0.7071,0.7071,-1.581,-0.7071,0,-1.144,-1.581,-0.437,0.437,-1.144,-1.414,-0.7071,-0.437,-1.144,-1.414,-0.7071,0.7071,-0.437,-1.414,-1.144,0.7071,-0.7071,-1.581,-0.7071,-0.7071,-0.437,-1.414,-1.144,-0.7071,-0.7071,-1.581,-0.7071,0.437,1.581,1.144,0,-0.437,1.581,1.144,0,0,1.414,1.414,0,0.7071,1.581,0.7071,0.7071,-0.7071,1.581,0.7071,0.7071,0.7071,1.414,1.144,0.437,-0.7071,1.414,1.144,0.437,0.437,-1.581,1.144,0,-0.437,-1.581,1.144,0,0,-1.414,1.414,0,0.7071,-1.581,0.7071,0.7071,-0.7071,-1.581,0.7071,0.7071,0.7071,-1.414,1.144,0.437,-0.7071,-1.414,1.144,0.437,0.437,1.581,-1.144,0,-0.437,1.581,-1.144,0,0,1.414,-1.414,0,0.7071,1.581,-0.7071,0.7071,-0.7071,1.581,-0.7071,0.7071,0.7071,1.414,-1.144,0.437,-0.7071,1.414,-1.144,0.437,0.7071,1.581,0.7071,-0.7071,-0.7071,1.581,0.7071,-0.7071,0.7071,1.414,1.144,-0.437,-0.7071,1.414,1.144,-0.437,0.437,-1.581,-1.144,0,-0.437,-1.581,-1.144,0,0,-1.414,-1.414,0,0.7071,-1.581,-0.7071,0.7071,-0.7071,-1.581,-0.7071,0.7071,0.7071,-1.414,-1.144,0.437,-0.7071,-1.414,-1.144,0.437,0.7071,-1.581,0.7071,-0.7071,-0.7071,-1.581,0.7071,-0.7071,0.7071,-1.414,1.144,-0.437,-0.7071,-1.414,1.144,-0.437,0.7071,1.581,-0.7071,-0.7071,-0.7071,1.581,-0.7071,-0.7071,0.7071,1.414,-1.144,-0.437,-0.7071,1.414,-1.144,-0.437,0.7071,-1.581,-0.7071,-0.7071,-0.7071,-1.581,-0.7071,-0.7071,0.7071,-1.414,-1.144,-0.437,-0.7071,-1.414,-1.144,-0.437,1.414,0,1.414,0,1.144,0.437,1.581,0,1.144,-0.437,1.581,0,1.144,0.2701,1.144,1.144,1.144,-0.2701,1.144,1.144,1.581,0,1.144,0.437,1.414,0.437,1.144,0.7071,1.414,-0.437,1.144,0.7071,1.144,0.7071,1.414,0.437,1.144,-0.7071,1.414,0.437,-1.414,0,1.414,0,-1.144,0.437,1.581,0,-1.144,-0.437,1.581,0,-1.144,0.2701,1.144,1.144,-1.144,-0.2701,1.144,1.144,-1.581,0,1.144,0.437,-1.414,0.437,1.144,0.7071,-1.414,-0.437,1.144,0.7071,-1.144,0.7071,1.414,0.437,-1.144,-0.7071,1.414,0.437,1.414,0,-1.414,0,1.144,0.437,-1.581,0,1.144,-0.437,-1.581,0,1.144,0.2701,-1.144,1.144,1.144,-0.2701,-1.144,1.144,1.581,0,-1.144,0.437,1.414,0.437,-1.144,0.7071,1.414,-0.437,-1.144,0.7071,1.144,0.7071,-1.414,0.437,1.144,-0.7071,-1.414,0.437,1.144,0.2701,1.144,-1.144,1.144,-0.2701,1.144,-1.144,1.581,0,1.144,-0.437,1.414,0.437,1.144,-0.7071,1.414,-0.437,1.144,-0.7071,1.144,0.7071,1.414,-0.437,1.144,-0.7071,1.414,-0.437,-1.414,0,-1.414,0,-1.144,0.437,-1.581,0,-1.144,-0.437,-1.581,0,-1.144,0.2701,-1.144,1.144,-1.144,-0.2701,-1.144,1.144,-1.581,0,-1.144,0.437,-1.414,0.437,-1.144,0.7071,-1.414,-0.437,-1.144,0.7071,-1.144,0.7071,-1.414,0.437,-1.144,-0.7071,-1.414,0.437,-1.144,0.2701,1.144,-1.144,-1.144,-0.2701,1.144,-1.144,-1.581,0,1.144,-0.437,-1.414,0.437,1.144,-0.7071,-1.414,-0.437,1.144,-0.7071,-1.144,0.7071,1.414,-0.437,-1.144,-0.7071,1.414,-0.437,1.144,0.2701,-1.144,-1.144,1.144,-0.2701,-1.144,-1.144,1.581,0,-1.144,-0.437,1.414,0.437,-1.144,-0.7071,1.414,-0.437,-1.144,-0.7071,1.144,0.7071,-1.414,-0.437,1.144,-0.7071,-1.414,-0.437,-1.144,0.2701,-1.144,-1.144,-1.144,-0.2701,-1.144,-1.144,-1.581,0,-1.144,-0.437,-1.414,0.437,-1.144,-0.7071,-1.414,-0.437,-1.144,-0.7071,-1.144,0.7071,-1.414,-0.437,-1.144,-0.7071,-1.414,-0.437,1.144,0,0.437,1.581,1.144,0.437,0.7071,1.414,1.144,-0.437,0.7071,1.414,-1.144,0,0.437,1.581,-1.144,0.437,0.7071,1.414,-1.144,-0.437,0.7071,1.414,1.144,0,-0.437,1.581,1.144,0.437,-0.7071,1.414,1.144,-0.437,-0.7071,1.414,1.144,0,0.437,-1.581,1.144,0.437,0.7071,-1.414,1.144,-0.437,0.7071,-1.414,-1.144,0,-0.437,1.581,-1.144,0.437,-0.7071,1.414,-1.144,-0.437,-0.7071,1.414,-1.144,0,0.437,-1.581,-1.144,0.437,0.7071,-1.414,-1.144,-0.437,0.7071,-1.414,1.144,0,-0.437,-1.581,1.144,0.437,-0.7071,-1.414,1.144,-0.437,-0.7071,-1.414,-1.144,0,-0.437,-1.581,-1.144,0.437,-0.7071,-1.414,-1.144,-0.437,-0.7071,-1.414,1.581,0.437,0,1.144,1.581,-0.437,0,1.144,1.414,0,0,1.414,1.414,0.7071,0.437,1.144,1.581,0.7071,0.7071,0.7071,1.414,-0.7071,0.437,1.144,1.581,-0.7071,0.7071,0.7071,-1.581,0.437,0,1.144,-1.581,-0.437,0,1.144,-1.414,0,0,1.414,-1.414,0.7071,0.437,1.144,-1.581,0.7071,0.7071,0.7071,-1.414,-0.7071,0.437,1.144,-1.581,-0.7071,0.7071,0.7071,1.414,0.7071,-0.437,1.144,1.581,0.7071,-0.7071,0.7071,1.414,-0.7071,-0.437,1.144,1.581,-0.7071,-0.7071,0.7071,1.581,0.437,0,-1.144,1.581,-0.437,0,-1.144,1.414,0,0,-1.414,1.414,0.7071,0.437,-1.144,1.581,0.7071,0.7071,-0.7071,1.414,-0.7071,0.437,-1.144,1.581,-0.7071,0.7071,-0.7071,-1.414,0.7071,-0.437,1.144,-1.581,0.7071,-0.7071,0.7071,-1.414,-0.7071,-0.437,1.144,-1.581,-0.7071,-0.7071,0.7071,-1.581,0.437,0,-1.144,-1.581,-0.437,0,-1.144,-1.414,0,0,-1.414,-1.414,0.7071,0.437,-1.144,-1.581,0.7071,0.7071,-0.7071,-1.414,-0.7071,0.437,-1.144,-1.581,-0.7071,0.7071,-0.7071,1.414,0.7071,-0.437,-1.144,1.581,0.7071,-0.7071,-0.7071,1.414,-0.7071,-0.437,-1.144,1.581,-0.7071,-0.7071,-0.7071,-1.414,0.7071,-0.437,-1.144,-1.581,0.7071,-0.7071,-0.7071,-1.414,-0.7071,-0.437,-1.144,-1.581,-0.7071,-0.7071,-0.7071,1.144,1.144,0.2701,1.144,1.144,1.144,-0.2701,1.144,1.144,1.581,0,0.437,1.144,1.414,0.437,0.7071,1.144,1.414,-0.437,0.7071,-1.144,1.144,0.2701,1.144,-1.144,1.144,-0.2701,1.144,-1.144,1.581,0,0.437,-1.144,1.414,0.437,0.7071,-1.144,1.414,-0.437,0.7071,1.144,-1.144,0.2701,1.144,1.144,-1.144,-0.2701,1.144,1.144,-1.581,0,0.437,1.144,-1.414,0.437,0.7071,1.144,-1.414,-0.437,0.7071,1.144,1.144,0.2701,-1.144,1.144,1.144,-0.2701,-1.144,1.144,1.581,0,-0.437,1.144,1.414,0.437,-0.7071,1.144,1.414,-0.437,-0.7071,-1.144,-1.144,0.2701,1.144,-1.144,-1.144,-0.2701,1.144,-1.144,-1.581,0,0.437,-1.144,-1.414,0.437,0.7071,-1.144,-1.414,-0.437,0.7071,-1.144,1.144,0.2701,-1.144,-1.144,1.144,-0.2701,-1.144,-1.144,1.581,0,-0.437,-1.144,1.414,0.437,-0.7071,-1.144,1.414,-0.437,-0.7071,1.144,-1.144,0.2701,-1.144,1.144,-1.144,-0.2701,-1.144,1.144,-1.581,0,-0.437,1.144,-1.414,0.437,-0.7071,1.144,-1.414,-0.437,-0.7071,-1.144,-1.144,0.2701,-1.144,-1.144,-1.144,-0.2701,-1.144,-1.144,-1.581,0,-0.437,-1.144,-1.414,0.437,-0.7071,-1.144,-1.414,-0.437,-0.7071,1.581,1.144,0.437,0,1.581,1.144,-0.437,0,1.414,1.414,0,0,1.414,1.144,0.7071,0.437,1.414,1.144,-0.7071,0.437,-1.581,1.144,0.437,0,-1.581,1.144,-0.437,0,-1.414,1.414,0,0,-1.414,1.144,0.7071,0.437,-1.414,1.144,-0.7071,0.437,1.581,-1.144,0.437,0,1.581,-1.144,-0.437,0,1.414,-1.414,0,0,1.414,-1.144,0.7071,0.437,1.414,-1.144,-0.7071,0.437,1.414,1.144,0.7071,-0.437,1.414,1.144,-0.7071,-0.437,-1.581,-1.144,0.437,0,-1.581,-1.144,-0.437,0,-1.414,-1.414,0,0,-1.414,-1.144,0.7071,0.437,-1.414,-1.144,-0.7071,0.437,-1.414,1.144,0.7071,-0.437,-1.414,1.144,-0.7071,-0.437,1.414,-1.144,0.7071,-0.437,1.414,-1.144,-0.7071,-0.437,-1.414,-1.144,0.7071,-0.437,-1.414,-1.144,-0.7071,-0.437,1.144,1.144,1.144,0.2701,1.144,1.144,1.144,-0.2701,-1.144,1.144,1.144,0.2701,-1.144,1.144,1.144,-0.2701,1.144,-1.144,1.144,0.2701,1.144,-1.144,1.144,-0.2701,1.144,1.144,-1.144,0.2701,1.144,1.144,-1.144,-0.2701,-1.144,-1.144,1.144,0.2701,-1.144,-1.144,1.144,-0.2701,-1.144,1.144,-1.144,0.2701,-1.144,1.144,-1.144,-0.2701,1.144,-1.144,-1.144,0.2701,1.144,-1.144,-1.144,-0.2701,-1.144,-1.144,-1.144,0.2701,-1.144,-1.144,-1.144,-0.2701]
FOUR.edges120 =[
  0,2,2,4,4,3,3,1,1,0,0,5,5,7,7,6,6,1,8,10,10,12,12,11,11,9,9,8,8,13,13,15,15,14,14,9,5,17,17,16,16,2,6,19,19,18,18,3,13,17,16,10,14,19,18,11,12,4,15,7,20,22,22,24,24,23,23,21,21,20,20,25,25,27,27,26,26,21,28,30,30,32,32,31,31,29,29,28,28,33,33,35,35,34,34,29,25,37,37,36,36,22,26,39,39,38,38,23,33,37,36,30,34,39,38,31,32,24,35,27,40,43,43,42,42,44,44,41,41,40,45,48,48,47,47,49,49,46,46,45,40,51,51,50,50,52,52,41,45,54,54,53,53,55,55,46,42,47,48,56,56,43,49,57,57,44,50,53,54,58,58,51,55,59,59,52,58,56,59,57,60,63,63,62,62,64,64,61,61,60,65,68,68,67,67,69,69,66,66,65,60,71,71,70,70,72,72,61,65,74,74,73,73,75,75,66,62,67,68,76,76,63,69,77,77,64,70,73,74,78,78,71,75,79,79,72,78,76,79,77,80,82,82,84,84,83,83,81,81,80,80,85,85,87,87,86,86,81,88,90,90,92,92,91,91,89,89,88,88,93,93,95,95,94,94,89,85,97,97,96,96,82,86,99,99,98,98,83,93,97,96,90,94,99,98,91,92,84,95,87,100,102,102,104,104,103,103,101,101,100,100,105,105,107,107,106,106,101,108,110,110,112,112,111,111,109,109,108,108,113,113,115,115,114,114,109,105,117,117,116,116,102,106,119,119,118,118,103,113,117,116,110,114,119,118,111,112,104,115,107,120,123,123,122,122,124,124,121,121,120,125,128,128,127,127,129,129,126,126,125,120,131,131,130,130,132,132,121,125,134,134,133,133,135,135,126,122,127,128,136,136,123,129,137,137,124,130,133,134,138,138,131,135,139,139,132,138,136,139,137,140,143,143,142,142,144,144,141,141,140,145,148,148,147,147,149,149,146,146,145,140,151,151,150,150,152,152,141,145,154,154,153,153,155,155,146,142,147,148,156,156,143,149,157,157,144,150,153,154,158,158,151,155,159,159,152,158,156,159,157,120,161,161,160,160,162,162,121,163,166,166,165,165,167,167,164,164,163,163,169,169,168,168,170,170,164,122,165,166,171,171,123,167,172,172,124,160,168,169,173,173,161,170,174,174,162,173,171,174,172,125,176,176,175,175,177,177,126,178,181,181,180,180,182,182,179,179,178,178,184,184,183,183,185,185,179,127,180,181,186,186,128,182,187,187,129,175,183,184,188,188,176,185,189,189,177,188,186,189,187,190,193,193,192,192,194,194,191,191,190,190,196,196,195,195,197,197,191,130,192,193,198,198,131,194,199,199,132,160,195,196,200,200,161,197,201,201,162,200,198,201,199,140,203,203,202,202,204,204,141,205,208,208,207,207,209,209,206,206,205,205,211,211,210,210,212,212,206,142,207,208,213,213,143,209,214,214,144,202,210,211,215,215,203,212,216,216,204,215,213,216,214,217,220,220,219,219,221,221,218,218,217,217,223,223,222,222,224,224,218,133,219,220,225,225,134,221,226,226,135,175,222,223,227,227,176,224,228,228,177,227,225,228,226,145,230,230,229,229,231,231,146,232,235,235,234,234,236,236,233,233,232,232,238,238,237,237,239,239,233,147,234,235,240,240,148,236,241,241,149,229,237,238,242,242,230,239,243,243,231,242,240,243,241,244,247,247,246,246,248,248,245,245,244,244,250,250,249,249,251,251,245,150,246,247,252,252,151,248,253,253,152,202,249,250,254,254,203,251,255,255,204,254,252,255,253,256,259,259,258,258,260,260,257,257,256,256,262,262,261,261,263,263,257,153,258,259,264,264,154,260,265,265,155,229,261,262,266,266,230,263,267,267,231,266,264,267,265,80,268,268,270,270,269,269,81,163,272,272,271,271,273,273,164,268,274,274,275,275,82,269,276,276,277,277,83,165,270,274,166,276,167,275,272,271,84,277,273,178,279,279,278,278,280,280,179,268,281,281,282,282,85,269,283,283,284,284,86,180,270,281,181,283,182,282,279,278,87,284,280,100,285,285,287,287,286,286,101,190,289,289,288,288,290,290,191,285,291,291,292,292,102,286,293,293,294,294,103,192,287,291,193,293,194,292,289,288,104,294,290,88,295,295,297,297,296,296,89,205,299,299,298,298,300,300,206,295,301,301,302,302,90,296,303,303,304,304,91,207,297,301,208,303,209,302,299,298,92,304,300,217,306,306,305,305,307,307,218,285,308,308,309,309,105,286,310,310,311,311,106,219,287,308,220,310,221,309,306,305,107,311,307,232,313,313,312,312,314,314,233,295,315,315,316,316,93,296,317,317,318,318,94,234,297,315,235,317,236,316,313,312,95,318,314,108,319,319,321,321,320,320,109,244,323,323,322,322,324,324,245,319,325,325,326,326,110,320,327,327,328,328,111,246,321,325,247,327,248,326,323,322,112,328,324,256,330,330,329,329,331,331,257,319,332,332,333,333,113,320,334,334,335,335,114,258,321,332,259,334,260,333,330,329,115,335,331,40,336,336,338,338,337,337,41,42,168,169,339,339,43,170,340,340,44,336,341,341,339,337,342,342,340,271,338,341,272,342,273,60,343,343,345,345,344,344,61,62,183,184,346,346,63,185,347,347,64,343,348,348,346,344,349,349,347,278,345,348,279,349,280,45,350,350,352,352,351,351,46,47,195,196,353,353,48,197,354,354,49,350,355,355,353,351,356,356,354,288,352,355,289,356,290,50,210,211,357,357,51,212,358,358,52,336,359,359,357,337,360,360,358,298,338,359,299,360,300,65,361,361,363,363,362,362,66,67,222,223,364,364,68,224,365,365,69,361,366,366,364,362,367,367,365,305,363,366,306,367,307,70,237,238,368,368,71,239,369,369,72,343,370,370,368,344,371,371,369,312,345,370,313,371,314,53,249,250,372,372,54,251,373,373,55,350,374,374,372,351,375,375,373,322,352,374,323,375,324,73,261,262,376,376,74,263,377,377,75,361,378,378,376,362,379,379,377,329,363,378,330,379,331,96,381,381,380,380,382,382,97,281,384,384,383,383,274,383,386,386,385,385,387,387,384,380,385,386,388,388,381,387,389,389,382,275,388,282,389,98,391,391,390,390,392,392,99,283,394,394,393,393,276,393,396,396,395,395,397,397,394,390,395,396,398,398,391,397,399,399,392,277,398,284,399,116,401,401,400,400,402,402,117,308,404,404,403,403,291,403,406,406,405,405,407,407,404,400,405,406,408,408,401,407,409,409,402,292,408,309,409,315,411,411,410,410,301,410,413,413,412,412,414,414,411,380,412,413,415,415,381,414,416,416,382,302,415,316,416,118,418,418,417,417,419,419,119,310,421,421,420,420,293,420,423,423,422,422,424,424,421,417,422,423,425,425,418,424,426,426,419,294,425,311,426,317,428,428,427,427,303,427,430,430,429,429,431,431,428,390,429,430,432,432,391,431,433,433,392,304,432,318,433,332,435,435,434,434,325,434,437,437,436,436,438,438,435,400,436,437,439,439,401,438,440,440,402,326,439,333,440,334,442,442,441,441,327,441,444,444,443,443,445,445,442,417,443,444,446,446,418,445,447,447,419,328,446,335,447,383,449,449,448,448,450,450,384,171,449,448,136,186,450,393,452,452,451,451,453,453,394,172,452,451,137,187,453,403,455,455,454,454,456,456,404,198,455,454,138,225,456,410,458,458,457,457,459,459,411,213,458,457,156,240,459,420,461,461,460,460,462,462,421,199,461,460,139,226,462,427,464,464,463,463,465,465,428,214,464,463,157,241,465,434,467,467,466,466,468,468,435,252,467,466,158,264,468,441,470,470,469,469,471,471,442,253,470,469,159,265,471,0,472,472,474,474,473,473,1,472,475,475,476,476,2,473,477,477,478,478,3,448,474,475,449,477,450,476,386,385,4,478,387,20,479,479,481,481,480,480,21,479,482,482,483,483,22,480,484,484,485,485,23,451,481,482,452,484,453,483,396,395,24,485,397,472,486,486,487,487,5,473,488,488,489,489,6,454,474,486,455,488,456,487,406,405,7,489,407,8,490,490,492,492,491,491,9,490,493,493,494,494,10,491,495,495,496,496,11,457,492,493,458,495,459,494,413,412,12,496,414,479,497,497,498,498,25,480,499,499,500,500,26,460,481,497,461,499,462,498,423,422,27,500,424,28,501,501,503,503,502,502,29,501,504,504,505,505,30,502,506,506,507,507,31,463,503,504,464,506,465,505,430,429,32,507,431,490,508,508,509,509,13,491,510,510,511,511,14,466,492,508,467,510,468,509,437,436,15,511,438,501,512,512,513,513,33,502,514,514,515,515,34,469,503,512,470,514,471,513,444,443,35,515,445,516,519,519,518,518,520,520,517,517,516,200,517,516,173,339,519,518,56,353,520,521,524,524,523,523,525,525,522,522,521,201,522,521,174,340,524,523,57,354,525,526,529,529,528,528,530,530,527,527,526,227,527,526,188,346,529,528,76,364,530,531,534,534,533,533,535,535,532,532,531,254,532,531,215,357,534,533,58,372,535,536,539,539,538,538,540,540,537,537,536,228,537,536,189,347,539,538,77,365,540,541,544,544,543,543,545,545,542,542,541,255,542,541,216,358,544,543,59,373,545,546,549,549,548,548,550,550,547,547,546,266,547,546,242,368,549,548,78,376,550,551,554,554,553,553,555,555,552,552,551,267,552,551,243,369,554,553,79,377,555,16,556,556,558,558,557,557,17,486,517,516,475,476,559,559,556,487,560,560,557,518,558,559,519,560,520,36,561,561,563,563,562,562,37,497,522,521,482,483,564,564,561,498,565,565,562,523,563,564,524,565,525,18,566,566,568,568,567,567,19,488,527,526,477,478,569,569,566,489,570,570,567,528,568,569,529,570,530,508,532,531,493,494,571,571,556,509,572,572,557,533,558,571,534,572,535,38,573,573,575,575,574,574,39,499,537,536,484,485,576,576,573,500,577,577,574,538,575,576,539,577,540,512,542,541,504,505,578,578,561,513,579,579,562,543,563,578,544,579,545,510,547,546,495,496,580,580,566,511,581,581,567,548,568,580,549,581,550,514,552,551,506,507,582,582,573,515,583,583,574,553,575,582,554,583,555,571,585,585,584,584,559,415,585,584,388,578,587,587,586,586,564,432,587,586,398,580,589,589,588,588,569,416,589,588,389,572,591,591,590,590,560,439,591,590,408,582,593,593,592,592,576,433,593,592,399,579,595,595,594,594,565,446,595,594,425,581,597,597,596,596,570,440,597,596,409,583,599,599,598,598,577,447,599,598,426,359,585,584,341,360,587,586,342,370,589,588,348,374,591,590,355,371,593,592,349,375,595,594,356,378,597,596,366,379,599,598,367
]
