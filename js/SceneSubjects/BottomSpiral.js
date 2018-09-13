function BottomSpiral(scene, anchorPointList, gui) {
    const bottomPoint = anchorPointList[anchorPointList.length-1];
    const bottomPointY = bottomPoint.mesh.position.y
    const bottomPointX = bottomPoint.mesh.position.x
    // const density = .1
    // const revolutions = 20;

    


    this.spiralPoints = []

    const numRevolutions =30; //N
    const resolution = 360; //k
    const spEnd = numRevolutions*resolution;
    const accelerationRate = 1; //increase to decrease density as it goes out

    const offsetY = 1; //make this bigger to lower the bottom of the bowl
    const otherPointY = bottomPointY - offsetY;

    for (let t = 0; t <= spEnd; t++) {
        //this formula needs t to start at 0
        let radius = bottomPointX * Math.pow(t/spEnd,accelerationRate);
        // let radius = bottomPointX/spEnd*t
        let x=radius*Math.cos(2*Math.PI*t/resolution);
        let z=radius*Math.sin(2*Math.PI*t/resolution);
        let curvatureGradient = Math.pow(t/spEnd,4); //decrease the 4 to decrease 'roundness'
        let y = bottomPointY*curvatureGradient + otherPointY*(1 - curvatureGradient);
        let newPt = new THREE.Vector3(x, y, z);

        this.spiralPoints.push(newPt);

    }
    this.catMull = new THREE.CatmullRomCurve3(this.spiralPoints);
    this.catMullPoints = this.catMull.getPoints(100);
    this.lineGeo = new THREE.BufferGeometry().setFromPoints(this.spiralPoints);

    const lineMat = new THREE.LineBasicMaterial({ color: 0xff0000 });


    this.line = new THREE.Line(this.lineGeo, lineMat);

    // scene.add(this.line);



    // this.curve = new THREE.CatmullRomCurve3(this.spiralPoints);

    // console.log(this.curve);
    // this.points = this.curve.getPoints(200);
    // this.geometry = new THREE.BufferGeometry().setFromPoints(this.points);

    // const lineMat = new THREE.LineBasicMaterial({ color: 0xff00ff });


    // this.line = new THREE.Line(this.geometry, lineMat);
    // console.log(this.line);

    // scene.add(this.line);

    // this.spiralPoints = [];


    // var curve = new THREE.SplineCurve([
    //     new THREE.Vector2(-10, 0),
    //     new THREE.Vector2(-5, 5),
    //     new THREE.Vector2(0, 0),
    //     new THREE.Vector2(5, -5),
    //     new THREE.Vector2(10, 0)
    // ]);





    // let getRadius = function (pointList, y) {
    //     for (i = 0; i < pointList.length; i++) {
    //         if (y >= pointList[i].y) {
    //             // debugger;
    //             // console.log(pointList[i]);
    //             return pointList[i].x;
    //         }
    //     }
    // }


    // for (let k = 0; k < spiralResolution + 1; k++) {

    //     let t = k * deltaT;
    //     let y = bottomY + slope * t

    //     let curRadius = getRadius(points, y);

    //     let x = curRadius * Math.cos(t);
    //     let z = curRadius * Math.sin(t);


    //     let newPt = new THREE.Vector3(x, y, z);

    //     this.spiralPoints.push(newPt);
    // }

    // this.catMull = new THREE.CatmullRomCurve3(this.spiralPoints);
    // this.catMullPoints = this.catMull.getPoints(spiralResolution);
    // this.lineGeo = new THREE.BufferGeometry().setFromPoints(this.catMullPoints);

    // const lineMat = new THREE.LineBasicMaterial({ color: 0xff0000 });


    // this.line = new THREE.Line(this.lineGeo, lineMat);

    // scene.add(this.line);
    // this.line.visible = eventBus.state.spiralVisible;
    // this.spiralVisible = gui.add(this.line, 'visible').name('show spiral');
    // this.spiralVisible.onFinishChange(() => { eventBus.state.spiralVisible = this.line.visible })

    this.update = function (time) {
    }
}
