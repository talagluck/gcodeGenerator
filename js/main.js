const canvas = document.getElementById("canvas");
const clock = new THREE.Clock();
const sceneManager = new SceneManager(canvas);
const mouse = new THREE.Vector2();
sceneManager.mouse = mouse;

const minX = 1;
const maxX = 30
const minY = -30;
const maxY = 30;

bindEventListeners();
render();
function convertRange(oldVal,oldMin,oldMax,newMin,newMax){
	return (((oldVal - oldMin) * (newMax - newMin)) / (oldMax - oldMin)) + newMin;

}
function bindEventListeners() {
	window.onresize = resizeCanvas;
	window.addEventListener( 'mousedown', onMouseClick, false );
	window.addEventListener( 'mouseup', onMouseUp, false );
	window.addEventListener( 'mousemove', onMouseMove, false );

	resizeCanvas();
}

function onMouseClick(event) {
	const elapsedTime = clock.getElapsedTime();
	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components
	const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
	const mouseY = - (event.clientY / window.innerHeight) * 2 + 1;
	// console.log(sceneManager.mouse.x,sceneManager.mouse.y)

	const vector = new THREE.Vector3(mouseX, mouseY, 1);
	vector.unproject(sceneManager.camera);

	sceneManager.raycaster.set(sceneManager.camera.position, vector.sub(sceneManager.camera.position).normalize());
	// sceneManager.raycaster.setFromCamera(sceneManager.mouse, sceneManager.camera);


	// calculate objects intersecting the picking ray
	let anchorPointIntersects = sceneManager.raycaster.intersectObjects(sceneManager.grid.anchorPointList.map(obj => obj.mesh));
	if (anchorPointIntersects.length > 0) {
		// eventBus.post("updatePlaneColor", mouseX);
		eventBus.post("updateLightColor", mouseX);
		// sceneManager.controls.enabled = false;
		sceneManager.selection = anchorPointIntersects[0].object;

		let planeIntersects = sceneManager.raycaster.intersectObject(sceneManager.plane.mesh);
		sceneManager.offset = planeIntersects[0].point.sub(sceneManager.plane.mesh.position);
	}
	//grid point intersection
	gridPointIntersects = sceneManager.raycaster.intersectObjects(sceneManager.grid.gridPointList);
	if (gridPointIntersects.length > 0) {
		debugger;
		eventBus.post("updatePlaneColor", gridPointIntersects[0].point.y);

//whichever grid point was selected, conver that to an anchor point, 
//then repop and sort anchor point list, then remove from grid point list
		eventBus.post("addAnchorPoint",gridPointIntersects[0].object);


		// eventBus.post("updateLightColor", mouseX);
		// sceneManager.controls.enabled = false;
		// sceneManager.selection = gridPointIntersects[0].object;
		
		// var planeIntersects = sceneManager.raycaster.intersectObject(sceneManager.plane.mesh);
		// sceneManager.offset = planeIntersects[0].point.sub(sceneManager.plane.mesh.position);
	}

	
	

}

function anchorPointBounds(anchorPoint, axisList, directionList, boundList){
	var a = anchorPoint.mesh.position[axis];
	var b = bound;
	if (direction == 'lessThan' ? a < b : b < a) {
		a = bound;
	}
	return a;
}

function onMouseMove ( event ){
	event.preventDefault();

	const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
	const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

	const vector = new THREE.Vector3(mouseX,mouseY,1);
	vector.unproject(sceneManager.camera)
	
	const currentAnchorPt = sceneManager.selection;

	sceneManager.raycaster.set(sceneManager.camera.position, vector.sub(sceneManager.camera.position).normalize());
	
	if (currentAnchorPt){
		const intersects = sceneManager.raycaster.intersectObjects([sceneManager.plane.mesh]);
		sceneManager.selection.position.copy(intersects[0].point.sub(sceneManager.offset));

		var i = sceneManager.grid.anchorPointList.map(obj => obj.mesh.uuid).indexOf(currentAnchorPt.uuid);
		var top = i == 0 ? maxY : sceneManager.grid.anchorPointList[i - 1].mesh.position.y;
		var bottom = i == sceneManager.grid.anchorPointList.length - 1 ? minY : sceneManager.grid.anchorPointList[i + 1].mesh.position.y;
		
		if (sceneManager.grid.anchorPointList[i].mesh.position.x < minX) {
			sceneManager.grid.anchorPointList[i].mesh.position.x = minX;
		}
		if (sceneManager.grid.anchorPointList[i].mesh.position.x > maxX) {
			sceneManager.grid.anchorPointList[i].mesh.position.x = maxX;
		}
		if (sceneManager.grid.anchorPointList[i].mesh.position.y >= top - 1) {
			sceneManager.grid.anchorPointList[i].mesh.position.y = top - 1;
		}
		if (sceneManager.grid.anchorPointList[i].mesh.position.y <= bottom + 1) {
			sceneManager.grid.anchorPointList[i].mesh.position.y = bottom + 1;
		}
	} else {
		const intersects = sceneManager.raycaster.intersectObjects(sceneManager.grid.anchorPointList.map(obj => obj.mesh));
		if(intersects.length > 0){
			sceneManager.plane.mesh.position.copy(intersects[0].object.position);
		}

	}



}

function onMouseUp( event ){
	// console.log("yup");
	// sceneManager.controls.enabled = true;

	sceneManager.selection = null;
}

function resizeCanvas() {
	canvas.style.width = '100%';
	canvas.style.height= '100%';

	canvas.width  = canvas.offsetWidth;
	canvas.height = canvas.offsetHeight;

    sceneManager.onWindowResize();
}

function render() {
    requestAnimationFrame(render);
    sceneManager.update();
}
