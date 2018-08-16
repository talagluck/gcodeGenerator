function SceneManager(canvas) {

    const clock = new THREE.Clock();

    const screenDimensions = {
        width: canvas.width,
        height: canvas.height
    }

    const scene = buildScene();
    const renderer = buildRender(screenDimensions);
    const camera = buildCamera(screenDimensions);
    const sceneSubjects = createSceneSubjects(scene);
    const controls = new THREE.OrbitControls( camera );
    const raycaster = new THREE.Raycaster();



    function buildScene() {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color("#000");

        return scene;
    }

    function buildRender({ width, height }) {
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
        const DPR = (window.devicePixelRatio) ? window.devicePixelRatio : 1;
        renderer.setPixelRatio(DPR);
        renderer.setSize(width, height);

        renderer.gammaInput = true;
        renderer.gammaOutput = true;

        return renderer;
    }

    function buildCamera({ width, height }) {
        const aspectRatio = width / height;
        const fieldOfView = 45;
        const nearPlane = 1;
        const farPlane = 1000;
        const camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
        camera.position.z = -20;
      	// camera.position.x = 10;
      	camera.position.y = 10;
      	camera.lookAt(new THREE.Vector3(0, 0, 0));
        return camera;
    }
    function createSceneSubjects(scene) {
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        const sceneSubjects = [
            new GeneralLights(scene, 1,0,15,40,0),
            new GeneralLights(scene, 1,0,15,-40,0),
            // new SceneSubject(scene),
            cylinder1 = new Cylinders(scene, 10,5,10,-10),
            cylinder2 = new Cylinders(scene, 2,10,10,0),
            cylinder3 = new Cylinders(scene, 10,2,10,10)
        ];

        return sceneSubjects;
    }

    this.update = function() {
        controls.update();
        raycaster.setFromCamera( this.mouse, camera );

        const elapsedTime = clock.getElapsedTime();
      	// calculate objects intersecting the picking ray
      	const intersects = raycaster.intersectObjects( scene.children );

      	for ( var i = 0; i < intersects.length; i++ ) {
      		// intersects[ i ].object.material.color.set( 0xffff00 );
      		intersects[ i ].object.material.color.setHSL( Math.sin(elapsedTime), .75, 0.5 );

      	}

        for(let i=0; i<sceneSubjects.length; i++)
        	sceneSubjects[i].update(elapsedTime);

        renderer.render(scene, camera);
    }

    this.onWindowResize = function() {
        const { width, height } = canvas;

        screenDimensions.width = width;
        screenDimensions.height = height;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
    }
}
