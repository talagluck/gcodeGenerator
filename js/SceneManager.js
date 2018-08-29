function SceneManager(canvas) {

    const clock = new THREE.Clock();

    const screenDimensions = {
        width: canvas.width,
        height: canvas.height
    }

    this.scene = buildScene();
    const renderer = buildRender(screenDimensions);
    this.camera = buildCamera(screenDimensions);
    this.sceneSubjects = createSceneSubjects(this.scene);
    // this.controls = new THREE.OrbitControls( this.camera );
    this.raycaster = new THREE.Raycaster();
    this.plane = new HelperPlane(this.scene, 200, 200 );
    this.offset = new THREE.Vector3();

    let anchors = createAnchors(this.scene);

    this.grid = new Grid(this.scene, 20, anchors);

//doublecheck scope - this is scene subjects, the other is window
    // eventBus.subscribe("updatePlaneColor", (mouseX) => {
    //     console.log(this);
    //     this.grid.changePlaneColor(mouseX);

    //     // this.grid.plane.material.color.set(0x00ff00);
    // })
    eventBus.subscribe("updatePlaneColor", (mouseX)=>{
        // console.log(this);
        // debugger;
        this.grid.changePlaneColor(mouseX);

        // this.grid.plane.material.color.set(0x00ff00);
    })
    
    // this.cameraZposition = new THREE.Group();
    // this.cameraXrotation = new THREE.Group();

    // this.cameraZposition.add(this.camera);
    // this.cameraXrotation.add(this.cameraZposition);
    // this.scene.add(this.cameraXrotation);

    // this.cameraZposition.position.z = 100;
    // this.cameraXrotation.rotation.x = 2.9;

    // const gui = new dat.GUI();
    // gui.add(this.cameraXrotation.rotation, 'x', Math.PI-.5, Math.PI+.5);

    function createAnchors(scene) {
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
            cylinder = new Cylinder(scene, x1-anchorPointDistance, x2-anchorPointDistance, y1-y2, (y1+y2)/2.0);
            cylinders.push(cylinder);
        }

        return cylinders
    }



    function createSceneSubjects(scene) {
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        let sceneSubjects = [
            new GeneralLights(scene, 1, "#ffffff",30,0,0,-50),
            new GeneralLights(scene, 1, "#ffffff",-30,0,0,-50),
            new GeneralLights(scene, .5, "#ff00ff",0,0,-100,0),
            new GeneralLights(scene, .5, "#ff00ff",0,0,100,0),
        ];

        sceneSubjects.forEach(function(light){
            eventBus.subscribe("updateLightColor", (mouseX) => {
                light.changeLightColor(mouseX);
                
            })
        })

        return sceneSubjects;
    }

    this.update = function() {
        // this.controls.update();
        renderer.clear();


        if(this.grid){
            this.grid.gridPointList.forEach(function (obj) {
                this.scene.remove(obj);
                obj.geometry.dispose();
                obj.material.dispose();
            }, this)



        }

        const elapsedTime = clock.getElapsedTime();
        if(this.cyls){
            this.cyls.forEach(function(obj){
                obj = obj.mesh;
                this.scene.remove(obj);
                obj.geometry.dispose();
                obj.material.dispose();
            },this)
        }
        this.grid.makeGridPoints(this.scene)

        this.cyls = buildCylinders(this.scene);

        renderer.render(this.scene, this.camera);

        this.clearGeometry = function(obj) {
            this.scene.remove(obj);
            obj.geometry.dispose();
            obj.material.dispose();
        }

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

