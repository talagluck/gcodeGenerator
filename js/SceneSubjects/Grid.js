// select gridPoint
// if not already anchorpoint, create new anchorpoint

// wireFrame


// anchorpoints
// gridpoints
// cylinder




function Grid(scene, size, anchorPointList) {
    this.numberSegments = size;
    this.anchorPointList = anchorPointList;
    this.gridPointList = [];

    this.makeGridPoints = function(scene) {
        this.gridPointList = [];
        const anchorPointYs = this.anchorPointList.map(obj => obj.mesh.position.y)

        for (let i = 0; i <= this.numberSegments; i++) {
            // if anchorpoint not nearby
            let drawThisOne = true;
            let yDim = (i * 5) - 50;
            for (let j = 0; j < anchorPointYs.length; j++) {
                if (Math.abs(yDim - anchorPointYs[j]) < 2) {
                    drawThisOne = false;
                }
            }

            if (drawThisOne) {
                let gridPoint = this.makeGridPoint(.5, 10, yDim, 0);
                scene.add(gridPoint);
                this.gridPointList.push(gridPoint);
            }
        }   
    }

    this.makeGridPoint = function(radius, x, y, z) {
        const geometry = new THREE.SphereGeometry(
            radius, this.numberSegments, this.numberSegments);
        // const material = new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 0.5 });
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });

        mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z)

        return mesh;
    }

    this.makeGridPlane = function(planeSize, planeColor) {
        const geometry = new THREE.PlaneBufferGeometry(planeSize, planeSize, this.numberSegments, this.numberSegments);
        const material = new THREE.LineBasicMaterial({ color: planeColor });
        // const plane = new THREE.Mesh(geometry, material);
        const wireFrame = new THREE.WireframeGeometry(geometry);
        const line = new THREE.LineSegments(wireFrame, material);

        line.material.depthTest = true;
        line.material.opacity = 1;
        line.material.transparent = true;
        // plane.visible = true;
        // const radius = 2;

        this.plane = line;
        scene.add(this.plane);
    }

    this.changePlaneColor = function (mouseX) {
        let oldMax = 50;
        let oldMin = -50;
        let newMax = 1;
        let newMin = 0;
        let color = convertRange(mouseX,oldMin, oldMax,newMin,newMax);
        this.plane.material.color.setHSL(color, 0.5, 0.5);
    }
    
    this.makeGridPlane(100, 0x333333);
    
    // this.makeGridPoints(scene)


    // this.mesh.position.set(x, y, 0);

    // scene.add(this.mesh);
    // scene.add(this.plane);
    // list.push({
    //     'x': x,
    //     'y': y
    // })

    this.update = function () {

        // mesh.scale.set(scale/2, 1, 1);
    }
}

