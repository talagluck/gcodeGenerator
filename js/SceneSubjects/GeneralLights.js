function GeneralLights(scene,intensity, color, distance,x,y,z) {

	const light = new THREE.PointLight(color, intensity, distance);
	light.position.set(x,y,z);

    scene.add(light);

	this.changeLightColor = function(mouseY){
		let oldMax = .85;
		let oldMin = -.85;
		let newMax = 1;
		let newMin = 0;
		let color = convertRange(mouseY, oldMin, oldMax, newMin, newMax);
		light.color.setHSL(color, 0.8, 0.5 );
	}
	eventBus.subscribe("updateLightColor", (mouseY) => {
		this.changeLightColor(mouseY);

	})
	this.update = function(time) {
		// light.intensity = (Math.sin(time)+1.5)/1.5;
		// light.color.setHSL( Math.sin(time), 0.5, 0.5 );
	}
}
