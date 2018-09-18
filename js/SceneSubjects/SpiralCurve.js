function SpiralCurve(scene, curve, gui) {
    this.curve = curve;
    // const revolutions = 20;
    
    const curveResolution = eventBus.state.curveResolution;
    const spiralResolution = eventBus.state.spiralResolution;
    const points = this.curve.getPoints(curveResolution);
    // const bottomY = this.curve.points[this.curve.points.length-1].y;
    const bottomY = eventBus.state.anchorPointsPosition[eventBus.state.anchorPointsPosition.length-1][1];
    // const topY = this.curve.points[0].y;
    // const totalHeight = topY - bottomY;
    const totalHeight = eventBus.state.totalHeight;
    const slope = eventBus.state.spiralSlope;
    let deltaY = totalHeight / spiralResolution;

    let deltaT = deltaY / slope;
    
    this.spiralPoints = [];
    


    let getRadius = function(pointList,y) {
        for(i=0;i<pointList.length;i++){
            if(y>=pointList[i].y){
                // debugger;
                // console.log(pointList[i]);
                return pointList[i].x;
            }
        }
    }


    for (let k = 0; k < spiralResolution+1; k++) {
        
        // let curY = points[k].y;
        let t = k * deltaT;
        let y = bottomY + slope * t
        // debugger;
        // console.log("test",points[0],y);
        // console.log("test",points[1],y);
        // console.log("test",points[2],y);
        let curRadius = getRadius(points, y);
        
        let x = curRadius * Math.cos(t);
        let z = curRadius * Math.sin(t);


        let newPt = new THREE.Vector3(x, y, z);

        this.spiralPoints.push(newPt);
    }
    // }

    this.catMull = new THREE.CatmullRomCurve3(this.spiralPoints);
    this.catMullPoints = this.catMull.getPoints(spiralResolution);
    this.lineGeo = new THREE.BufferGeometry().setFromPoints(this.catMullPoints);

    const lineMat = new THREE.LineBasicMaterial({ color: 0xff0000 });


    this.line = new THREE.Line(this.lineGeo,lineMat);

    scene.add(this.line);
    this.line.visible = eventBus.state.spiralVisible;
    // this.spiralVisible.onFinishChange(() => { eventBus.state.spiralVisible = this.line.visible })

    // this.spiralVisible = gui.add(this.line, 'visible').name('show spiral');

    // eventBus.subscribe()

    this.update = function (time) {
    }
}
