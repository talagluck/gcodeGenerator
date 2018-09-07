function Lathe(scene, anchorPointList,resolution, gui, eventBus) {
    let curvePointList=[]
    // const opacity = 0.2

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
    const material = new THREE.MeshStandardMaterial(
        { depthTest: false, 
          side: THREE.DoubleSide, 
          transparent: true, 
          color: 0xffffff,
          opacity:eventBus.state.latheOpacity,
          roughness:.8,
          metalness:1.0,
        }
    );


    this.mesh = new THREE.Mesh(geometry, material);
    // this.line = new THREE.Line(this.lineGeo,lineMat);
    this.mesh.visible = eventBus.state.latheVisible;
    scene.add(this.mesh);
    // scene.add(this.line);
    this.latheVisible = gui.add(this.mesh, 'visible').name('show lathe');
    this.latheVisible.onFinishChange(()=>{eventBus.state.latheVisible=this.mesh.visible})

    this.latheOpacity = gui.add(this.mesh.material, 'opacity',0,1).name('opacity');
    this.latheOpacity.onChange(() => { eventBus.state.latheOpacity = this.mesh.material.opacity})

    // this.curveVisible = gui.add(this.curve, 'visible').name('spline visible');

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