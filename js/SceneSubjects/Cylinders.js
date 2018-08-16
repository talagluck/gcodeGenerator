function Cylinders(scene, radiusTop, radiusBottom, height, positionY) {

	// const radius = 2;
  const numberSegments = 60;
  const geometry = new THREE.CylinderGeometry(
    radiusTop, radiusBottom, height, numberSegments
  );

  // const material = new THREE.MeshBasicMaterial({ color: 0xff00ff });
  const material = new THREE.MeshStandardMaterial({ flatShading: false });
	const mesh = new THREE.Mesh(geometry, material );

	mesh.position.set(0, positionY, 0);

	scene.add(mesh);

	this.update = function(time) {
		const scale = Math.sin(time)+2;

		// mesh.scale.set(scale/2, 1, 1);
	}
}
