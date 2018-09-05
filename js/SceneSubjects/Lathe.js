function Lathe(scene, anchorPointList,resolution) {
    let curvePointList=[]

    anchorPointList.forEach(element => {
        let newPoint = new THREE.Vector2(element.mesh.position.x, element.mesh.position.y);   
        curvePointList.push(newPoint);
    });

    this.curve = new THREE.SplineCurve(curvePointList);
    this.points = this.curve.getPoints(resolution);
    // this.lineGeo = new THREE.BufferGeometry().setFromPoints(this.points);
    const geometry = new THREE.LatheGeometry(this.points);

    // const lineMat = new THREE.LineBasicMaterial({ color: 0xff0000 });
    // const material = new THREE.MeshBasicMaterial({ flatShading: false, side: THREE.DoubleSide, transparent: true, opacity: 0.6, color: 0xff00ff  });
    const material = new THREE.MeshStandardMaterial({ depthTest: false, side: THREE.DoubleSide, transparent: true, opacity: 0.2, color: 0xffffff,roughness:.8,metalness:1.0  });


    this.mesh = new THREE.Mesh(geometry, material);
    // this.line = new THREE.Line(this.lineGeo,lineMat);

    scene.add(this.mesh);
    // scene.add(this.line);

    this.changeLatheColor = function (mouseX) {
        // debugger;
        let oldMax = -.02;
        let oldMin = -.6;
        let newMax = 1;
        let newMin = 0;
        let color = convertRange(mouseX, oldMin, oldMax, newMin, newMax);
        lathe.mesh.material.color.setHSL(color, 0.6, 0.6);
    }

    // eventBus.subscribe("updateLatheColor", (mouseX) => {
    //     this.changeLatheColor(mouseX);
    // })

    this.update = function (time) {

        // const scale = Math.sin(time)+2;	
        // this.mesh.radiusTop=time*5;
        // this.mesh.position.set(time,0,0);
    }
}