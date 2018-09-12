function BottomSpiral(scene, anchorPointList, gui) {
    const bottomPoint = anchorPointList[anchorPointList.length-1];
    const bottomPointY = bottomPoint.mesh.position.y
    const bottomPointX = bottomPoint.mesh.position.x
    // const density = .1
    // const revolutions = 20;

    


    this.spiralPoints = []
    const spStart = 0;
    const spEnd = bottomPointX * 30;
    const spacing = spEnd/3;
    // const spEnd = bottomPoint.mesh.position.x;

    for (let i = spStart; i < spEnd; i++) {
   
        let density = .1;

        let a=spacing*Math.PI/2.75;
        let t= i/(spEnd/spacing);
        let x=density*t*Math.cos(t+a);
        let z=density*t*Math.sin(t+a);
        let y = bottomPointY;
        let newPt = new THREE.Vector3(x, y, z);

        this.spiralPoints.push(newPt);

    }
    // console.log(this.spiralPoints);
    this.catMull = new THREE.CatmullRomCurve3(this.spiralPoints);
    this.catMullPoints = this.catMull.getPoints(100);
    this.lineGeo = new THREE.BufferGeometry().setFromPoints(this.spiralPoints);

    const lineMat = new THREE.LineBasicMaterial({ color: 0xff0000 });


    this.line = new THREE.Line(this.lineGeo, lineMat);

    scene.add(this.line);



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
