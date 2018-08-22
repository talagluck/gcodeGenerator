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
	var intersects = sceneManager.raycaster.intersectObjects(sceneManager.anchorPointList.map(obj => obj.mesh));
	if(intersects.length>0){
		// sceneManager.controls.enabled = false;
		sceneManager.selection = intersects[0].object;

		var intersects = sceneManager.raycaster.intersectObject(sceneManager.plane.mesh);
		sceneManager.offset=intersects[0].point.sub(sceneManager.plane.mesh.position);

		for (var i = 0; i < intersects.length; i++) {
			// intersects[ i ].object.material.color.set( 0xffff00 );
			// intersects[i].object.material.color.setHSL(Math.sin(elapsedTime), .75, 0.5);

		}
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

		var i = sceneManager.anchorPointList.map(obj => obj.mesh.uuid).indexOf(currentAnchorPt.uuid);
		var top = i == 0 ? maxY : sceneManager.anchorPointList[i - 1].mesh.position.y;
		var bottom = i == sceneManager.anchorPointList.length - 1 ? minY : sceneManager.anchorPointList[i + 1].mesh.position.y;
		
		if (sceneManager.anchorPointList[i].mesh.position.x < minX) {
			sceneManager.anchorPointList[i].mesh.position.x = minX;
		}
		if (sceneManager.anchorPointList[i].mesh.position.x > maxX) {
			sceneManager.anchorPointList[i].mesh.position.x = maxX;
		}
		if (sceneManager.anchorPointList[i].mesh.position.y >= top - 1) {
			// debugger
			sceneManager.anchorPointList[i].mesh.position.y = top - 1;
		}
		if (sceneManager.anchorPointList[i].mesh.position.y <= bottom + 1) {
			sceneManager.anchorPointList[i].mesh.position.y = bottom + 1;
		}

		// for (i = 0; i < sceneManager.anchorPointList.length; i++) {

		// 	// anchorPoint = sceneManager.anchorPointList[i].mesh.position.x
		// 	//  = anchorPointBounds(anchorPointList[i],'x','lessThan',minX)
			
		// 	debugger
			
			
			


		// }
	} else {
		const intersects = sceneManager.raycaster.intersectObjects(sceneManager.anchorPointList.map(obj => obj.mesh));
		if(intersects.length > 0){
			sceneManager.plane.mesh.position.copy(intersects[0].object.position);
			sceneManager.plane.mesh.lookAt(sceneManager.camera.position);
		}

	}



}

function onMouseUp( event ){
	console.log("yup");
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
