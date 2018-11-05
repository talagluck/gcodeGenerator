const canvas = document.getElementById("canvas");
let sceneManager = new SceneManager(canvas);
console.log(canvas.width, canvas.height);

bindEventListeners();
render();
console.log(canvas.width, canvas.height);



function anchorPointBounds(anchorPoint) {
	var a = anchorPoint.mesh.position[axis];
	var b = bound;
	if (direction == 'lessThan' ? a < b : b < a) {
		a = bound;
	}
	return a;
}


function bindEventListeners() {
	window.onresize = resizeCanvas;
	canvas.addEventListener( 'mousedown', onMouseClick, false );
	canvas.addEventListener( 'mouseup', onMouseUp, true );
	canvas.addEventListener( 'mousemove', onMouseMove, false );
	canvas.addEventListener( 'contextmenu', onMouseRight , false );

	resizeCanvas();
}

function onMouseClick( event ) {
	event.preventDefault();

	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components
	const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
	const mouseY = - (event.clientY / window.innerHeight) * 2 + 1;

	const vector = new THREE.Vector3(mouseX, mouseY, 1);
	vector.unproject(sceneManager.camera);

	sceneManager.raycaster.set(sceneManager.camera.position, vector.sub(sceneManager.camera.position).normalize());

	// calculate objects intersecting the picking ray
	let anchorPointIntersects = sceneManager.raycaster.intersectObjects(sceneManager.anchorPointList.map(obj => obj.mesh));
	if (anchorPointIntersects.length > 0) {
		sceneManager.controls.enabled = false;
		sceneManager.selection = anchorPointIntersects[0].object;

		let planeIntersects = sceneManager.raycaster.intersectObject(sceneManager.plane.mesh);
		
		sceneManager.offset.copy(planeIntersects[0].point.sub(sceneManager.plane.mesh.position));
		// sceneManager.offset = planeIntersects[0].point.sub(sceneManager.plane.mesh.position);
	}

	//grid point intersection
	let gridPointIntersects = sceneManager.raycaster.intersectObjects(sceneManager.gridPointList.map(obj => obj.meshAttr()));
	if (gridPointIntersects.length > 0) {
		let gridPointIntersect = sceneManager.gridPointList.filter(
			obj => obj.meshAttr().uuid === gridPointIntersects[0].object.uuid)[0];
        gridPointIntersect.hideGridPoint();
        let newAnchorPtX = gridPointIntersect.meshAttr().position.x;
        let newAnchorPtY = gridPointIntersect.meshAttr().position.y;
	//whichever grid point was selected, convert that to an anchor point, 
	//then repop and sort anchor point list, then remove from grid point list
		eventBus.post("updateAnchorPoints");
		eventBus.post("heightSpiralChanges");
		// eventBus.state.totalHeight = eventBus.state.anchorPointsPosition[0][1] - eventBus.state.anchorPointsPosition[eventBus.state.anchorPointsPosition.length - 1][1]
		// eventBus.state.spiralSlope = eventBus.state.heightXslope * eventBus.state.totalHeight;
		// eventBus.state.spiralResolution = eventBus.state.slopeXres/ eventBus.state.spiralSlope;
		eventBus.post("addAnchorPoint", [newAnchorPtX, newAnchorPtY]);
		eventBus.post("updateLightColor", mouseY);
		eventBus.post("buildNewLathe")
		eventBus.post("buildNewSpiral");
		eventBus.post("buildNewBottomSpiral");


	}
}

function onMouseMove ( event ) {
	event.preventDefault();

	const minX = 4;
	const maxX = 50
	const minY = -51;
	const maxY = 51;

	const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
	const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

	const vector = new THREE.Vector3(mouseX,mouseY,1);
	vector.unproject(sceneManager.camera)
	
	const currentAnchorPtMesh = sceneManager.selection;
	sceneManager.raycaster.set(sceneManager.camera.position, vector.sub(sceneManager.camera.position).normalize());

	if (currentAnchorPtMesh){
		const intersects = sceneManager.raycaster.intersectObjects([sceneManager.plane.mesh]);
		// console.log(`before: ${currentAnchorPtMesh.position.y}`)
		sceneManager.selection.position.copy(intersects[0].point.sub(sceneManager.offset));
		// console.log(`after: ${currentAnchorPtMesh.position.y}`)

		const i = sceneManager.anchorPointList.map(obj => obj.mesh.uuid).indexOf(currentAnchorPtMesh.uuid);
		if ( i >= 0 ) {
			// const top = i == 0 ? maxY : sceneManager.anchorPointList[i - 1].mesh.position.y;
			// const bottom = i == sceneManager.anchorPointList.length - 1 ? minY : sceneManager.anchorPointList[i + 1].mesh.position.y;
			const top = maxY;
			const bottom = minY;
			// if (currentAnchorPtMesh.position.x < minX) { currentAnchorPtMesh.position.x = minX; }
			if (currentAnchorPtMesh.position.x > maxX) { currentAnchorPtMesh.position.x = maxX; }
			if (currentAnchorPtMesh.position.y >= top - 1) { currentAnchorPtMesh.position.y = top - 1; }
			if (currentAnchorPtMesh.position.y <= bottom + 1) { currentAnchorPtMesh.position.y = bottom + 1; }
	
			// const gridPointsToHide = []
			// anchorPointList.forEach(anc => {
			// 	let gridAnchorNear = sceneManager.gridPointList.filter(obj => Math.abs(obj.meshAttr().position.y - anc.mesh.position.y) < 2);
			// 	if (gridAnchorNear[0]) { 
			// 		gridAnchorNear[0].hideGridPoint();
			// 		gridPointsToHide.push(gridAnchorNear[0]);	
			// 	};
			// })	
	
			// let gridPointsToShow = sceneManager.gridPointList.filter(obj => -1 === gridPointsToHide.indexOf(obj));
			// gridPointsToShow.map(obj => obj.showGridPoint());
			eventBus.post("showHideGridPoints");
			eventBus.post("updateAnchorPoints");
			eventBus.post("heightSpiralChanges");
			// eventBus.state.totalHeight = eventBus.state.anchorPointsPosition[0][1] - eventBus.state.anchorPointsPosition[eventBus.state.anchorPointsPosition.length - 1][1]
			// eventBus.state.spiralSlope = eventBus.state.heightXslope * eventBus.state.totalHeight;
			// eventBus.state.spiralResolution = eventBus.state.slopeXres/ eventBus.state.spiralSlope;
			eventBus.post("buildNewLathe");
			eventBus.post("buildNewSpiral");
			eventBus.post("buildNewBottomSpiral");

		}
	} else {
		const intersects = sceneManager.raycaster.intersectObjects(sceneManager.anchorPointList.map(obj => obj.mesh));
		if(intersects.length > 0){
			sceneManager.plane.mesh.position.copy(intersects[0].object.position);
		}
	}
}

function onMouseUp( event ) {
	sceneManager.selection = null;
	sceneManager.controls.enabled = true;
}

function onMouseRight( event ) {
	const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
	const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

	const vector = new THREE.Vector3(mouseX, mouseY, 1);
	vector.unproject(sceneManager.camera)

	const currentAnchorPtMesh = sceneManager.selection;

	sceneManager.raycaster.set(sceneManager.camera.position, vector.sub(sceneManager.camera.position).normalize());

	if (currentAnchorPtMesh) {
		anchorPointIntersects = sceneManager.raycaster.intersectObjects(sceneManager.anchorPointList.map(obj => obj.mesh));
		
		if ( anchorPointIntersects.length > 0 && sceneManager.anchorPointList.length>2 ) {
			// To Discuss: line below offsets position unreliably, maybe this is related to
			// weird snapping behavior on mouse drag sometimes?
			// console.log(`before: ${currentAnchorPtMesh.position.y}`)
			// sceneManager.selection.position.copy(anchorPointIntersects[0].point.sub(sceneManager.offset));
			// console.log(`after: ${currentAnchorPtMesh.position.y}`)
			eventBus.post("deleteAnchorPoint", mouseX,sceneManager.anchorPointList);
			eventBus.post("updateAnchorPoints");
			eventBus.post("heightSpiralChanges");
			// eventBus.state.totalHeight = eventBus.state.anchorPointsPosition[0][1] - eventBus.state.anchorPointsPosition[eventBus.state.anchorPointsPosition.length - 1][1]
			// eventBus.state.spiralSlope = eventBus.state.heightXslope * eventBus.state.totalHeight;
			// eventBus.state.spiralResolution = eventBus.state.slopeXres/eventBus.state.spiralSlope;
			eventBus.post("buildNewLathe");
			eventBus.post("buildNewSpiral");
			eventBus.post("buildNewBottomSpiral");


			// debugger
			let gridPointToShow = sceneManager.gridPointList.filter( 
				obj => obj.meshAttr().visible === false && 
					   Math.abs(obj.meshAttr().position.y - currentAnchorPtMesh.position.y) <= 2
			)[0]
			if( gridPointToShow ) { gridPointToShow.showGridPoint() }
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
