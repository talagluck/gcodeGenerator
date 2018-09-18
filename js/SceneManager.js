function SceneManager(canvas) {

    const segments = 20;
    const screenDimensions = {
        width: canvas.width,
        height: canvas.height
    }

    this.scene = buildScene();
    const renderer = buildRender(screenDimensions);
    const lights = buildLights(this.scene);
    this.camera = buildCamera(screenDimensions);
    this.controls = new THREE.OrbitControls( this.camera,canvas);
    this.raycaster = new THREE.Raycaster();
    this.plane = new HelperPlane(this.scene, 400, 400 );
    this.offset = new THREE.Vector3();
    const gui = makeGUI();
    this.gui = gui;
    this.anchorPointList = createFirstAnchors(this.scene, eventBus.state.anchorPointsPosition);
    this.gridPlane = new GridPlane(this.scene, 100, 0x333333, segments)
    this.gridPointList = makeGridPoints(this.scene, segments);
    

    this.lathe = buildLathe(this.scene,50);
    this.spiral = buildSpiral(this.scene, this.lathe);
    this.bottomSpiral = buildBottomSpiral(this.scene,this.anchorPointList,this.gui);


    this.redrawOptions = ''
    this.redraw = () => {
        let option = this.gui.root.__controllers[1].__select.selectedOptions[0].value;
        let selectedState = eventBus.prevState.filter(
            (obj)=>obj.timestamp == option
        )[0]


        eventBus.post("deleteAllAnchorPoints")
        eventBus.state = Object.assign({},selectedState);
        this.anchorPointList = createFirstAnchors(this.scene, eventBus.state.anchorPointsPosition);  
        eventBus.post("buildNewLathe");
        eventBus.post("buildNewSpiral");
        eventBus.post("showHideGridPoints");
        
        // this.gridPointList = makeGridPoints(this.scene, segments);

    }
    gui.root.add(eventBus, 'save').onChange();
    
    function getAnchorPointsPlacement() {
        eventBus.state.anchorPointsPosition = this.anchorPointList.map(
            anchorPoint => [anchorPoint.mesh.position.x, anchorPoint.mesh.position.y,0]
        )
    }

    function makeGUI () {
        const gui = new dat.GUI();

        // gui.remember(eventBus.state);
        const latheGUI = gui.addFolder('Lathe Controls');
        const spiralGUI = gui.addFolder('Spiral Controls');
        const bottomSpiralGUI = gui.addFolder('Bottom Spiral Controls');
        // const anchorGUI = gui.addFolder('Anchor Points');
        // latheGUI.open();
        spiralGUI.open();
        bottomSpiralGUI.open();
        
        // spiralGUI.add(eventBus.state,'curveResolution',1,200)
        //         .name('curve resolution')
        //         .onChange(()=>eventBus.post('buildNewSpiral'));
        spiralGUI.add(eventBus.state,'spiralResolution',1000,8000)
                .name('spiral resolution')
                .onChange(() => {
                    eventBus.post('buildNewSpiral')
                    eventBus.state.slopeXres = eventBus.state.spiralResolution*eventBus.state.spiralSlope;
                    eventBus.state.curveResolution = eventBus.state.curveXspiral*eventBus.state.spiralResolution;
                    console.log('slopeXres', eventBus.state.slopeXres)
                    // eventBus.state.spiralResolution = eventBus.state.heightXres / eventBus.state.totalHeight;
                    // eventBus.state.spiralSlope = eventBus.state.heightXslope / eventBus.state.totalHeight;
                    // eventBus.state.heightXres = eventBus.state.spiralResolution / eventBus.state.totalHeight;
                //    eventBus.state.heightXslopeXres = eventBus.state.totalHeight*eventBus.state.resXslope ;                
                })
                .listen();
                    
                
        spiralGUI.add(eventBus.state, 'spiralSlope', 0.001, 0.01)
                .name('spiral density')
                .onChange(() => {
                    // debugger;
                    // console.log(1, eventBus.state.spiralResolution);
                    eventBus.state.spiralResolution = eventBus.state.slopeXres/eventBus.state.spiralSlope;
                    eventBus.state.heightXslope = eventBus.state.spiralSlope / eventBus.state.totalHeight;
                    console.log('heightXslope', eventBus.state.heightXslope)
                    // eventBus.state.heightXres = eventBus.state.spiralResolution / eventBus.state.totalHeight;
                    eventBus.post('buildNewSpiral');
                    // console.log(2,eventBus.state.spiralResolution);
                    
                })
                .listen();
                
        spiralGUI.add(eventBus.state, 'spiralVisible')
                .name('show spiral')
                .onChange(() => eventBus.post('buildNewSpiral'));
                

        //TODO: this.spiralVisible = gui.add(this.line, 'visible').name('show spiral');

        // const spiralResGUI = gui.add(eventBus.state,'spiralResolution',100,2500).name('spiral resolution');
        // spiralResGUI.onChange(() => eventBus.post('buildNewSpiral'));
        // const spiralSlopeGUI = gui.add(eventBus.state, 'spiralSlope', 0.01, .25).name('spiral density');
        // spiralSlopeGUI.onChange(() => {

        // console.log(eventBus.state.spiralResolution);
        // let resXslope = eventBus.state.spiralResolution * eventBus.state.spiralSlope;
        // eventBus.state.spiralResolution = resXslope / eventBus.state.spiralSlope;

        // eventBus.post('buildNewSpiral');
        // console.log(gui);
    // });
        

        bottomSpiralGUI.add(eventBus.state, 'bottomSpiralRevolutions', 30, 80)
                .name('density')
                .onChange(() => eventBus.post('buildNewBottomSpiral'));
        bottomSpiralGUI.add(eventBus.state, 'bottomSpiralOffset', 0, 2)
                .name('height')
                .onChange(() => eventBus.post('buildNewBottomSpiral'));
        bottomSpiralGUI.add(eventBus.state, 'bottomSpiralXZSpeed', 1, 4)
                .name('XZ acceleration')
                .onChange(() => eventBus.post('buildNewBottomSpiral'));
        bottomSpiralGUI.add(eventBus.state, 'bottomSpiralYSpeed', 1, 8)
                .name('Y acceleration')
                .onChange(() => eventBus.post('buildNewBottomSpiral'));
        bottomSpiralGUI.add(eventBus.state, 'bottomSpiralResolution', 3, 360)
                .name('resolution')
                .onChange(() => eventBus.post('buildNewBottomSpiral'));

    

        const guiDict = {
            root: gui,
            lathe: latheGUI,
            spiral: spiralGUI,
            bottomSpiral: bottomSpiralGUI,
            //add spiral slope to dictionary
            // anchor: anchorGUI
        }

        // return [anchorGUI, latheGUI, spiralGUI];
        return guiDict
    }

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

    function buildAnchorPoint(scene, x, y, z) {
        let anchorPoint = new AnchorPoint(scene, x, y, z);
        // gui.root.remember(anchorPoint.mesh.position);
        // anchorPoint.posX = gui.anchor.add(anchorPoint.mesh.position, 'x', 0, 50)
        //                     .listen()
        //                     .onChange((val) => { 
        //                         // debugger
        //                         anchorPoint.mesh.position.setX(val);
        //                         eventBus.post("buildNewLathe");
        //                         eventBus.post("buildNewSpiral");
        //                     });
        // anchorPoint.posY = gui.anchor.add(anchorPoint.mesh.position, 'y', -50, 50)
        //                     .listen()
        //                     .onChange((val) => {
        //                         anchorPoint.mesh.position.setY(val);
        //                         eventBus.post("buildNewLathe");
        //                         eventBus.post("buildNewSpiral");
        //                     }); 

        return anchorPoint
    }

    function createFirstAnchors(scene, startingDims) {
        anchorPointList = [];
        startingDims.forEach(
            (dims) => {
                let anchorPt = buildAnchorPoint(scene, ...dims)
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
        lathe = new Lathe(scene, this.anchorPointList, resolution, gui.lathe,eventBus);
        return lathe;
    }
    function buildSpiral(scene,lathe, visible){
        spiral = new SpiralCurve(scene, lathe.curve,gui.spiral);
        return spiral;
    }

    function buildBottomSpiral(scene, anchorPointList, gui){
        let bottomSpiral = new BottomSpiral(scene, this.anchorPointList, gui);
        return bottomSpiral;
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

    eventBus.subscribe("updateAnchorPoints", getAnchorPointsPlacement);
    
    eventBus.subscribe("addAnchorPoint", ([newAnchorPtX, newAnchorPtY]) => {
        //currently uuids redraw each time. need to maintain a consistent list for matching purposes. then filter and remove
        //from the grid point list.

        let newAnchorPt = buildAnchorPoint(this.scene, newAnchorPtX, newAnchorPtY, 0);
        // let newAnchorPt = new AnchorPoint(this.scene, anchorGUI, newAnchorPtX, newAnchorPtY, 0);
        this.anchorPointList.push(newAnchorPt);
        this.anchorPointList.sort(function (a, b) {
            return b.mesh.position.y - a.mesh.position.y
        });
    }, this)

    eventBus.subscribe("deleteAnchorPoint", () => {
        this.anchorPointList.forEach(
            (pt) => {
                if (pt.mesh.uuid == anchorPointIntersects[0].object.uuid) {
                    // gui.anchor.remove(pt.posX);
                    // gui.anchor.remove(pt.posY);
                    this.anchorPointList.splice(this.anchorPointList.indexOf(pt), 1);
                    destroyOnUpdateMesh(this.scene, pt.mesh);
                }
            }
        )
    }, this)


    eventBus.subscribe("deleteAllAnchorPoints", () => {
        this.anchorPointList.forEach(
            (pt) => {            
                    // gui.anchor.remove(pt.posX);
                    // gui.anchor.remove(pt.posY);
                    destroyOnUpdateMesh(this.scene, pt.mesh);           
            }        
        ) 
        this.anchorPointList = []
    }, this)



    eventBus.subscribe("buildNewLathe", () => {
        if(this.lathe){
            destroyOnUpdateMesh(this.scene,this.lathe.mesh);
            gui.lathe.remove(this.lathe.latheVisible);
            gui.lathe.remove(this.lathe.latheOpacity);
        }
        this.lathe = buildLathe(this.scene, 50)
    })

    eventBus.subscribe("buildNewSpiral", () => {
        if(this.spiral){
            destroyOnUpdateMesh(this.scene,this.spiral.line);
            // gui.spiral.remove(this.spiral.spiralVisible);
        }

        this.spiral = buildSpiral(this.scene,this.lathe)
    })
    
    eventBus.subscribe("buildNewBottomSpiral", () => {
        if (this.bottomSpiral) {
            destroyOnUpdateMesh(this.scene, this.bottomSpiral.line);
            // gui.remove(this.spiral.spiralVisible);

        }
        this.bottomSpiral = buildBottomSpiral(this.scene, this.anchorPointList, gui)

    })

    eventBus.subscribe("showHideGridPoints",() => {
        const gridPointsToHide = []
        anchorPointList.forEach(anc => {
            let gridAnchorNear = this.gridPointList.filter(obj => Math.abs(obj.meshAttr().position.y - anc.mesh.position.y) < 2);
            if (gridAnchorNear[0]) {
                gridAnchorNear[0].hideGridPoint();
                gridPointsToHide.push(gridAnchorNear[0]);
            };
        })
        let gridPointsToShow = this.gridPointList.filter(obj => -1 === gridPointsToHide.indexOf(obj));
        gridPointsToShow.map(obj => obj.showGridPoint());
    }
)

    eventBus.subscribe("heightSpiralChanges", ()=>{
        console.log('slopeXres', eventBus.state.slopeXres)
        console.log('heightXslope', eventBus.state.heightXslope)
        eventBus.state.totalHeight = eventBus.state.anchorPointsPosition[0][1] - eventBus.state.anchorPointsPosition[eventBus.state.anchorPointsPosition.length - 1][1]
        eventBus.state.spiralSlope = eventBus.state.heightXslope * eventBus.state.totalHeight;
        eventBus.state.spiralResolution = eventBus.state.slopeXres / eventBus.state.spiralSlope;
        eventBus.state.curveResolution = eventBus.state.curveXspiral * eventBus.state.spiralResolution;
        console.log('curveRes', eventBus.state.curveResolution)


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

