function SpiralCurve(scene, curve) {
    this.curve = curve;
    // const revolutions = 20;
    
    const curveResolution = Math.floor(eventBus.state.curveResolution);
    const spiralResolution = eventBus.state.spiralResolution;
    const points = this.curve.getSpacedPoints(curveResolution);
    
    // const bottomY = this.curve.points[this.curve.points.length-1].y;
    const bottomY = eventBus.state.anchorPointsPosition[eventBus.state.anchorPointsPosition.length-1][1];

    // const totalHeight = eventBus.state.totalHeight;
    const slope = eventBus.state.spiralSlope;
    // const curveLength = this.curve.getLength()
    // let deltaS = curveLength / curveResolution;

    let deltaT = slope;
    
    this.spiralPoints = [];
    


    // let getRadius = function(pointList,y) {
    //     for(i=0;i<pointList.length;i++){
    //         if(y>=pointList[i].y){
    //             // debugger;
    //             // console.log(pointList[i]);
    //             return pointList[i].x;
    //         }
    //     }
    // }


    for (let k = curveResolution; k >= 0; k--) {
        // console.log(k)
        // let curY = points[k].y;
        let t = k * deltaT;
        // console.log(points[k])
        let y = points[k].y
        let curRadius = points[k].x   
        let x = curRadius * Math.cos(t);
        let z = curRadius * Math.sin(t);


        let newPt = new THREE.Vector3(x, y, z);

        this.spiralPoints.push(newPt);
    }
    // }

    this.catMull = new THREE.CatmullRomCurve3(this.spiralPoints);
    this.catMullPoints = this.catMull.getPoints(curveResolution);
    this.lineGeo = new THREE.BufferGeometry().setFromPoints(this.catMullPoints);

    const lineMat = new THREE.LineBasicMaterial({ color: 0xff22ff });


    this.line = new THREE.Line(this.lineGeo,lineMat);

    scene.add(this.line);
    this.line.visible = eventBus.state.spiralVisible;
    // this.spiralVisible.onFinishChange(() => { eventBus.state.spiralVisible = this.line.visible })

    // this.spiralVisible = gui.add(this.line, 'visible').name('show spiral');

    // eventBus.subscribe()

    this.update = function (time) {
    }
}
