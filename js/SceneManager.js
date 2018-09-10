function SceneManager(canvas) {

    const segments = 20;
    const screenDimensions = {
        width: canvas.width,
        height: canvas.height
    }
    const gui = new dat.GUI();
    const curveResGUI = gui.add(eventBus.state,'curveResolution',1,200).name('curve resolution');
    curveResGUI.onChange(()=>eventBus.post('buildNewSpiral'))
    const spiralResGUI = gui.add(eventBus.state,'spiralResolution',100,3000).name('spiral resolution');
    spiralResGUI.onChange(() => eventBus.post('buildNewSpiral'))
    const spiralSlopeGUI = gui.add(eventBus.state, 'spiralSlope', 0.0001, 0.1).name('spiral density');
    spiralSlopeGUI.onChange(() => eventBus.post('buildNewSpiral'))

    this.scene = buildScene();
    const renderer = buildRender(screenDimensions);
    const lights = buildLights(this.scene);
    this.camera = buildCamera(screenDimensions);
    this.controls = new THREE.OrbitControls( this.camera,canvas);
    this.raycaster = new THREE.Raycaster();
    this.plane = new HelperPlane(this.scene, 400, 400 );
    this.offset = new THREE.Vector3();

    this.anchorPointList = createFirstAnchors(this.scene);
    this.gridPlane = new GridPlane(this.scene, 100, 0x333333, segments)
    this.gridPointList = makeGridPoints(this.scene, segments);
    
    this.lathe = buildLathe(this.scene,50, gui,eventBus);
    this.spiral = buildSpiral(this.scene, this.lathe, gui);

    function makeGridPoints (scene, numberSegments) {
        const gridPointList = [];
        const anchorPointYs = this.anchorPointList.map(obj => obj.mesh.position.y)
        for (let i = 0; i <= numberSegments; i++) {
            // if anchorpoint not nearby
            let yDim = (i * 5) - 50;
            let gridPoint = new GridPoint(scene, numberSegments, 10, yDim, 0);

            anchorPointYs.forEach( 
                (anchorPoint) => {
                    if (Math.abs(yDim - anchorPoint) < 2) {
                        gridPoint.hideGridPoint();
                    } 
                }
            )

            gridPointList.push(gridPoint);
        }
        return gridPointList;
    }

    function createFirstAnchors(scene) {
        anchorPointList = [];
        let startingDims = [[10, 10], [10, -10]];
        startingDims.forEach(
            (dims) => {
                anchorPt = new AnchorPoint(scene, ...dims);
                anchorPointList.push(anchorPt);
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
      	camera.lookAt(new THREE.Vector3(0, 0, 0));
        return camera;
    }

    function buildLathe(scene, resolution){
        lathe = new Lathe(scene, this.anchorPointList, resolution, gui,eventBus);
        return lathe;
    }
    function buildSpiral(scene,lathe, visible){
        spiral = new SpiralCurve(scene, lathe.curve,gui);
        return spiral;
    }

    function buildLights(scene) {
        // distance, x, y, z
        const cameraParams = [
            [0, 50, 0, -50],
            [0, -50, 0, -50],
            [0, 0, 0, 50],
            [0, 0, -100, 0],
            [0, 0, 100, 0]
        ]
        
        const lights = cameraParams.map( 
            cp => new GeneralLights(scene, 1, "#ffffff", ...cp)
        )
        return lights
    }

    eventBus.subscribe("addAnchorPoint", () => {

        //currently uuids redraw each time. need to maintain a consistent list for matching purposes. then filter and remove
        //from the grid point list.

        let gridPointIntersect = this.gridPointList.filter(obj => obj.meshAttr().uuid === gridPointIntersects[0].object.uuid)[0];
        gridPointIntersect.hideGridPoint();
        let newAnchorPtX = gridPointIntersect.meshAttr().position.x;
        let newAnchorPtY = gridPointIntersect.meshAttr().position.y;
        let newAnchorPt = new AnchorPoint(this.scene, newAnchorPtX, newAnchorPtY);
        this.anchorPointList.push(newAnchorPt);
        this.anchorPointList.sort(function (a, b) {
            return b.mesh.position.y - a.mesh.position.y
        });
    }, this)

    eventBus.subscribe("deleteAnchorPoint", () => {
        this.anchorPointList.forEach(
            (pt) => {
                if (pt.mesh.uuid == anchorPointIntersects[0].object.uuid) {
                    this.anchorPointList.splice(this.anchorPointList.indexOf(pt), 1);
                    destroyOnUpdateMesh(this.scene, pt.mesh);
                }
            }
        )
    }, this)

    eventBus.subscribe("buildNewLathe", () => {
        if(this.lathe){

            destroyOnUpdateMesh(this.scene,this.lathe.mesh);
            gui.remove(this.lathe.latheVisible);
            gui.remove(this.lathe.latheOpacity);
            

        }
        this.lathe = buildLathe(this.scene, 50, gui,eventBus)

    })
    eventBus.subscribe("buildNewSpiral", () => {
        if(this.spiral){
            destroyOnUpdateMesh(this.scene,this.spiral.line);
            gui.remove(this.spiral.spiralVisible);

        }
        this.spiral = buildSpiral(this.scene,this.lathe,gui)

    })

    this.update = function() {
        this.controls.update();
        renderer.clear();

        if(this.grid){
            this.grid.update(this.scene)
    
        }
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

