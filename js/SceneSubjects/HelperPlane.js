function HelperPlane(scene, width, height) {
	const geometry = new THREE.PlaneBufferGeometry(width, height, 8,8);
	const material = new THREE.MeshBasicMaterial({color:0xf00fff, side: THREE.DoubleSide});
	material.visible = false;
	const plane = new THREE.Mesh(geometry, material)
	// plane.visible = true;
	this.mesh = plane;
	// const radius = 2;
	

	scene.add(plane);

	this.update = function(time) {

		// mesh.scale.set(scale/2, 1, 1);
	}
}
