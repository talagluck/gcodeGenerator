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

	function convertRange(oldVal,oldMin,oldMax,newMin,newMax){
		return (((oldVal - oldMin) * (newMax - newMin)) / (oldMax - oldMin)) + newMin;
	
	}

	eventBus.subscribe("updateLightColor", (mouseY) => {
		this.changeLightColor(mouseY);

	})

}
