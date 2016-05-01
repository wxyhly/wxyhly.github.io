FOUR.Stero = function() {

}
FOUR.Stero.R = 1;
FOUR.Stero.projectOnSphere = function(v) {
	var l = v.length();
	return v.clone().normalize().multiplyScalar(FOUR.Stero.R / l);
}
FOUR.Stero.project = function(v) {
	var l;
	if (instanceof v == FOUR.Vector4) {
		l = 2 / (2 - FOUR.Stero.R * FOUR.Stero.R - FOUR.Stero.R * v.w);
		return new THREE.Vector3(v.x * l, v.y * l, v.z * l);
	} else if (instanceof v == FOUR.Vector3) {
		l = 2 / (2 - FOUR.Stero.R * FOUR.Stero.R - FOUR.Stero.R * v.z);
		return new THREE.Vector2(v.x * l, v.y * l);
	}
}
FOUR.Stero.drawVertex3 = function(v, radius) {
	var t = new THREE.Vector3(1.0, 1.234567, 2.0);
	var e1 = t.cross(v).normalize().multiplyScalar(radius);
	if (!e1.length()) {
		t = new THREE.Vector3(1.23, 3.45, -2.34);
		e1 = t.cross(v).normalize().multiplyScalar(radius);
	}
	var e2 = e1.clone().cross(v).normalize().multiplyScalar(radius);
	var seg = 16, angle = Math.PI * 2;
	var circle = [];
	while (angle -= Math.PI * 2 / seg) {
		circle.push(FOUR.Stero.project(new THREE.Vector3(
			e1.x * Math.cos(seg) + e2.x * Math.sin(seg) + v.x,
			e1.y * Math.cos(seg) + e2.y * Math.sin(seg) + v.y,
			e1.z * Math.cos(seg) + e2.z * Math.sin(seg) + v.z,
		)))
	}
}
FOUR.Stero.drawVertex4 = function(v, radius) {
	var t = new FOUR.Bivector(1.0, 1.4,1.7,0,0,0);
	var e1 = t.cross(v).normalize().multiplyScalar(radius);
	if (!e1.length()) {
		t = new FOUR.Bivector(0,0,0,-1.3,1.4,2.9);
		e1 = t.cross(v).normalize().multiplyScalar(radius);
	}
	var e2 = e1.wedge(v).cross(new THREE.Vector4(0.2,0.3,0.4,0.5)).normalize().multiplyScalar(radius);
	if (!e2.length()) {
		e2 = e1.wedge(v).cross(new THREE.Vector4(0.44,-0.3,-0.66,0.4)).normalize().multiplyScalar(radius);
	}
	var seg = 16, angle = Math.PI * 2;
	var circle = [];
	while (angle -= Math.PI * 2 / seg) {
		circle.push(FOUR.Stero.project(new THREE.Vector3(
			e1.x * Math.cos(seg) + e2.x * Math.sin(seg) + v.x,
			e1.y * Math.cos(seg) + e2.y * Math.sin(seg) + v.y,
			e1.z * Math.cos(seg) + e2.z * Math.sin(seg) + v.z,
			e1.w * Math.cos(seg) + e2.w * Math.sin(seg) + v.w,
		)))
	}
}