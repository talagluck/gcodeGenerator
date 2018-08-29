function Cylinder(scene, radiusTop, radiusBottom, height, positionY) {
	this.radiusTop = radiusTop;
	this.radiusBottom = radiusBottom;

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

	// eventBus.subscribe()
	
	this.update = function(time){
		
		// const scale = Math.sin(time)+2;	
		// this.mesh.radiusTop=time*5;
		// this.mesh.position.set(time,0,0);
	}
}
