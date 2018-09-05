// select gridPoint
// if not already anchorpoint, create new anchorpoint

// wireFrame


// anchorpoints
// gridpoints
// cylinder




function Grid(scene, size, anchorPointList) {
    this.numberSegments = size;
    this.anchorPointList = anchorPointList;
    // this.gridPointList = [];
    
    const makeGridPoint = function (radius, x, y, z, numberSegments) {
        console.log(numberSegments)
        const geometry = new THREE.SphereGeometry(
            radius, numberSegments, numberSegments);
        // const material = new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 0.5 });
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });

        mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z)

        return mesh;
    }

    const makeGridPoints = function(scene, numberSegments) {
        const gridPointList = [];
        const anchorPointYs = this.anchorPointList.map(obj => obj.mesh.position.y)
        for (let i = 0; i <= numberSegments; i++) {
            // if anchorpoint not nearby
            let drawThisOne = true;
            let yDim = (i * 5) - 50;
            for (let j = 0; j < anchorPointYs.length; j++) {
                if (Math.abs(yDim - anchorPointYs[j]) < 2) {
                    drawThisOne = false;
                }
            }

            if (drawThisOne) {
                let gridPoint = makeGridPoint(.5, 10, yDim, 0, numberSegments);
                scene.add(gridPoint);
                gridPointList.push(gridPoint);
            }
        }
        
        return gridPointList;
    }


    const makeGridPlane = function(scene, planeSize, planeColor, numberSegments) {
        const geometry = new THREE.PlaneBufferGeometry(planeSize, planeSize, numberSegments, numberSegments);
        const material = new THREE.LineBasicMaterial({ color: planeColor });
        // const plane = new THREE.Mesh(geometry, material);
        const wireFrame = new THREE.WireframeGeometry(geometry);
        const line = new THREE.LineSegments(wireFrame, material);

        line.material.depthTest = true;
        line.material.opacity = 1;
        line.material.transparent = true;
        // plane.visible = true;
        // const radius = 2;

        // this.plane = line;
        scene.add(line);
    }

    // this.changePlaneColor = function (mouseX) {
    //     let oldMax = 50;
    //     let oldMin = -50;
    //     let newMax = 1;
    //     let newMin = 0;
    //     let color = convertRange(mouseX,oldMin, oldMax,newMin,newMax);
    //     this.plane.material.color.setHSL(color, 0.5, 0.5);
    // }
    
    makeGridPlane(scene, 100, 0x333333, size);

    eventBus.subscribe("updatePlaneColor", (mouseX) => {
        this.changePlaneColor(mouseX);
    })

    eventBus.subscribe("addAnchorPoint", () => {
 
//currently uuids redraw each time. need to maintain a consistent list for matching purposes. then filter and remove
//from the grid point list.
        
        let newAnchorPtPos = this.gridPointList.filter(value => value.uuid === gridPointIntersects[0].object.uuid)[0];
        let newAnchorPtX = newAnchorPtPos.position.x ;
        let newAnchorPtY = newAnchorPtPos.position.y ;
        let newAnchorPt = new AnchorPoint(scene, newAnchorPtX, newAnchorPtY);
        this.anchorPointList.push(newAnchorPt);
        this.anchorPointList.sort(function(a,b){
            return b.mesh.position.y - a.mesh.position.y});
        // debugger;  
        // this.changePlaneColor(mouseX);


    })
    
    // this.makeGridPoints(scene)


    // this.mesh.position.set(x, y, 0);

    // scene.add(this.mesh);
    // scene.add(this.plane);
    // list.push({
    //     'x': x,
    //     'y': y
    // })

    var gridPointList = makeGridPoints(scene);
    
    this.update = function (scene) {
            gridPointList.forEach(function (gridPoint) {
                destroyOnUpdateMesh(scene, gridPoint);
            })
            gridPointList = makeGridPoints(scene, size);
    }
}

