function Cylinder(scene, radiusTop, radiusBottom, height, positionY) {

	// const radius = 2;
  const numberSegments = 60;
  const geometry = new THREE.CylinderGeometry(
    radiusTop, radiusBottom, height, numberSegments
  );

  // const material = new THREE.MeshBasicMaterial({ color: 0xff00ff });
  const material = new THREE.MeshStandardMaterial({ flatShading: false, roughness: 1.0 });
	this.mesh = new THREE.Mesh(geometry, material );

	this.mesh.position.set(0, positionY, 0);

	scene.add(this.mesh);

	this.update = function(time) {
		const scale = Math.sin(time)+2;

		// mesh.scale.set(scale/2, 1, 1);
	}
}
