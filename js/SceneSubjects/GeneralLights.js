function GeneralLights(scene,intensity, color, distance,x,y,z) {

	const light = new THREE.PointLight(color, intensity, distance);
	light.position.set(x,y,z);

    scene.add(light);

	this.changeLightColor = function(mouseX){
		let oldMax = -.02;
		let oldMin = -.6;
		let newMax = 1;
		let newMin = 0;
		let color = convertRange(mouseX, oldMin, oldMax, newMin, newMax);
		light.color.setHSL(color, 0.5, 0.5 );
	}

	this.update = function(time) {
		// light.intensity = (Math.sin(time)+1.5)/1.5;
		// light.color.setHSL( Math.sin(time), 0.5, 0.5 );
	}
}
