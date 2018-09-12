const canvas = document.getElementById("canvas");
const clock = new THREE.Clock();
const sceneManager = new SceneManager(canvas);
const mouse = new THREE.Vector2();
sceneManager.mouse = mouse;

const minX = 4;
const maxX = 50
const minY = -51;
const maxY = 51;

bindEventListeners();
render();


function anchorPointBounds(anchorPoint) {
	var a = anchorPoint.mesh.position[axis];
	var b = bound;
	if (direction == 'lessThan' ? a < b : b < a) {
		a = bound;
	}
	return a;
}

function convertRange(oldVal,oldMin,oldMax,newMin,newMax){
	return (((oldVal - oldMin) * (newMax - newMin)) / (oldMax - oldMin)) + newMin;

}
function bindEventListeners() {
	window.onresize = resizeCanvas;
	window.addEventListener( 'mousedown', onMouseClick, false );
	window.addEventListener( 'mouseup', onMouseUp, true );
	window.addEventListener( 'mousemove', onMouseMove, false );
	window.addEventListener( 'contextmenu', onMouseRight , false );

	resizeCanvas();
}

function onMouseClick(event) {
	event.preventDefault();

	const elapsedTime = clock.getElapsedTime();
	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components
	const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
	const mouseY = - (event.clientY / window.innerHeight) * 2 + 1;

	const vector = new THREE.Vector3(mouseX, mouseY, 1);
	vector.unproject(sceneManager.camera);

	sceneManager.raycaster.set(sceneManager.camera.position, vector.sub(sceneManager.camera.position).normalize());
	// sceneManager.raycaster.setFromCamera(sceneManager.mouse, sceneManager.camera);


	// calculate objects intersecting the picking ray
	let anchorPointIntersects = sceneManager.raycaster.intersectObjects(sceneManager.anchorPointList.map(obj => obj.mesh));
	if (anchorPointIntersects.length > 0) {
		sceneManager.controls.enabled = false;
		sceneManager.selection = anchorPointIntersects[0].object;

		let planeIntersects = sceneManager.raycaster.intersectObject(sceneManager.plane.mesh);
		sceneManager.offset = planeIntersects[0].point.sub(sceneManager.plane.mesh.position);
	}
	//grid point intersection
	
	this.gridPointIntersects = sceneManager.raycaster.intersectObjects(sceneManager.gridPointList.map(obj => obj.meshAttr()));
	if (gridPointIntersects.length > 0) {
		// debugger;
		// eventBus.post("updatePlaneColor", gridPointIntersects[0].point.y);

//whichever grid point was selected, convert that to an anchor point, 
//then repop and sort anchor point list, then remove from grid point list
		eventBus.post("addAnchorPoint");
		eventBus.post("updateLightColor", mouseY);
		eventBus.post("buildNewLathe")
		eventBus.post("buildNewSpiral")

	}
}

function onMouseMove ( event ){
	event.preventDefault();

	const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
	const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

	const vector = new THREE.Vector3(mouseX,mouseY,1);
	vector.unproject(sceneManager.camera)
	
	const currentAnchorPtMesh = sceneManager.selection;

	sceneManager.raycaster.set(sceneManager.camera.position, vector.sub(sceneManager.camera.position).normalize());
	// eventBus.post("updateLatheColor", mouseX);

	if (currentAnchorPtMesh){
		const intersects = sceneManager.raycaster.intersectObjects([sceneManager.plane.mesh]);
		sceneManager.selection.position.copy(intersects[0].point.sub(sceneManager.offset));

		var i = sceneManager.anchorPointList.map(obj => obj.mesh.uuid).indexOf(currentAnchorPtMesh.uuid);
		var top = i == 0 ? maxY : sceneManager.anchorPointList[i - 1].mesh.position.y;
		var bottom = i == sceneManager.anchorPointList.length - 1 ? minY : sceneManager.anchorPointList[i + 1].mesh.position.y;
		
		if (sceneManager.anchorPointList[i].mesh.position.x < minX) {
			sceneManager.anchorPointList[i].mesh.position.x = minX;
		}
		if (sceneManager.anchorPointList[i].mesh.position.x > maxX) {
			sceneManager.anchorPointList[i].mesh.position.x = maxX;
		}
		if (sceneManager.anchorPointList[i].mesh.position.y >= top - 1) {
			sceneManager.anchorPointList[i].mesh.position.y = top - 1;
		}
		if (sceneManager.anchorPointList[i].mesh.position.y <= bottom + 1) {
			sceneManager.anchorPointList[i].mesh.position.y = bottom + 1;
		}

		let gridPointsToHide = [];
		anchorPointList.forEach(anc => 
			{let gridAnchorNear = sceneManager.gridPointList.filter(obj => Math.abs(obj.meshAttr().position.y - anc.mesh.position.y) < 2)
			gridPointsToHide.push(gridAnchorNear[0])}
		)	
		// debugger;		
		// let gridAnchorNear = sceneManager.gridPointList.filter(obj => Math.abs(obj.meshAttr().position.y - currentAnchorPtMesh.position.y)<2);
		if(gridPointsToHide.length>=1){
			// debugger;
			gridPointsToHide.map(obj=> { if(obj) { obj.hideGridPoint() } } )
		}

		let gridPointsToShow = sceneManager.gridPointList.filter(obj => -1 === gridPointsToHide.indexOf(obj));
		// let hiddenGridPoints = sceneManager.gridPointList.filter(obj => obj.meshAttr().visible === false);
		gridPointsToShow.map(obj => obj.showGridPoint());
		eventBus.post("buildNewLathe");
		eventBus.post("buildNewSpiral");
		eventBus.post("buildNewBottomSpiral");



	} else {
		const intersects = sceneManager.raycaster.intersectObjects(sceneManager.anchorPointList.map(obj => obj.mesh));
		if(intersects.length > 0){
			sceneManager.plane.mesh.position.copy(intersects[0].object.position);
		}
	}
}

function onMouseUp( event ){
	sceneManager.selection = null;
	sceneManager.controls.enabled = true;


}

function onMouseRight( event ){
	const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
	const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

	const vector = new THREE.Vector3(mouseX, mouseY, 1);
	vector.unproject(sceneManager.camera)

	const currentAnchorPtMesh = sceneManager.selection;

	sceneManager.raycaster.set(sceneManager.camera.position, vector.sub(sceneManager.camera.position).normalize());

	if (currentAnchorPtMesh) {
		this.anchorPointIntersects = sceneManager.raycaster.intersectObjects(sceneManager.anchorPointList.map(obj => obj.mesh));
		
		if (anchorPointIntersects.length > 0 && sceneManager.anchorPointList.length>2 ) {
			sceneManager.selection.position.copy(anchorPointIntersects[0].point.sub(sceneManager.offset));
			eventBus.post("deleteAnchorPoint", mouseX,sceneManager.anchorPointList);
			eventBus.post("buildNewLathe");
			eventBus.post("buildNewSpiral");
		}
	}
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
