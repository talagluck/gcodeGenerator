function SceneManager(canvas) {

    const clock = new THREE.Clock();

    const screenDimensions = {
        width: canvas.width,
        height: canvas.height
    }

    this.scene = buildScene();
    const renderer = buildRender(screenDimensions);
    this.camera = buildCamera(screenDimensions);
    this.anchorPointList = createAnchors(this.scene);
    this.sceneSubjects = createSceneSubjects(this.scene);
    // this.controls = new THREE.OrbitControls( this.camera );
    this.raycaster = new THREE.Raycaster();
    this.plane = new HelperPlane(this.scene, 200, 200 );
    this.offset = new THREE.Vector3();


    // this.cameraZposition = new THREE.Group();
    // this.cameraXrotation = new THREE.Group();

    // this.cameraZposition.add(this.camera);
    // this.cameraXrotation.add(this.cameraZposition);
    // this.scene.add(this.cameraXrotation);

    // this.cameraZposition.position.z = 100;
    // this.cameraXrotation.rotation.x = 2.9;

    // const gui = new dat.GUI();
    // gui.add(this.cameraXrotation.rotation, 'x', Math.PI-.5, Math.PI+.5);

    
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
        camera.position.z = -100;
      	// camera.position.x = 100;
      	// camera.position.y = 10;
      	camera.lookAt(new THREE.Vector3(0, 0, 0));
        return camera;
    }

    function buildCylinders(scene) {
        const anchorPointDistance = 3

        cylinders = []
        for(var i=0; i<this.anchorPointList.length - 1; i++){
            var pt1, pt2, x1, y1, x2, y2
            [pt1, pt2] = [this.anchorPointList[i].mesh, this.anchorPointList[i + 1].mesh]
            var x1 = pt1.position.x;
            var y1 = pt1.position.y;
            var x2 = pt2.position.x;
            var y2 = pt2.position.y;
            cylinder = new Cylinder(scene, x1-anchorPointDistance, x2-anchorPointDistance, y1-y2, (y1+y2)/2.0)
            // scene, radiusTop, radiusBottom, height, positionY
            cylinders.push(cylinder);
        }

        return cylinders
    }

    function createAnchors(scene){
        anchorPointList = [];
        let startingDims = [[10, 10], [10, -10]];
        startingDims.forEach(function (dims) {
            anchorPt = new AnchorPoint(scene, dims[0], dims[1]);
            anchorPointList.push(anchorPt);
            // sceneSubjects.push(anchorPt);
        }
        )
        return anchorPointList;
    }

    function createSceneSubjects(scene, anchorPointList) {
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        // let startingDims = [[10, 10], [10, -10]];
        // startingDims.forEach((x,y) => populateDims(x, y))
        // start

        // var anchorPointList = [];
        const sceneSubjects = [
            new GeneralLights(scene, 1, "#ffffff",0,0,0,-20),
            new GeneralLights(scene, .5, "#ff00ff",0,0,-100,0),
            new GeneralLights(scene, .5, "#ff00ff",0,0,100,0),
            // new GeneralLights(scene, 1,0,50,0,-20),

            // new SceneSubject(scene),
            // new Cylinder(scene, 10,5,10,-10),
            // new Cylinder(scene, 2,10,10,0),
            // new Cylinder(scene, 10,2,10,10),
            // new AnchorPoints(scene, 10, 5)
        ];
        // startingDims.forEach(function(dims){
        //     anchorPt = new AnchorPoint(scene, dims[0], dims[1]);
        //     anchorPointList.push(anchorPt);
        //     sceneSubjects.push(anchorPt);
        //     }
        // )


        // for(var i=0;i<startingDims.length;i++){
        //     anchorPt = new AnchorPoint(scene,startingDims[i][0], startingDims[i][1]);
        //     this.anchorPointList.push(anchorPt);
        //     sceneSubjects.push(anchorPt);

        // }

        sceneSubjects.concat(anchorPointList);
        
        sceneSubjects.concat(buildCylinders(scene));
        // console.log(sceneSubjects[2]);
        return sceneSubjects;
    }

    this.update = function() {
        // this.controls.update();
        const elapsedTime = clock.getElapsedTime();

        for(let i=0; i<this.sceneSubjects.length; i++)
        	this.sceneSubjects[i].update(elapsedTime);

        renderer.render(this.scene, this.camera);
    }

    this.onWindowResize = function() {
        const { width, height } = canvas;

        screenDimensions.width = width;
        screenDimensions.height = height;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        renderer.setSize(width, height);
    }
}
