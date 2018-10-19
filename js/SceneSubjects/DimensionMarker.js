function DimensionMarker(scene, dimText, x, y, z) {
    // create a canvas element
    var canvas1 = document.createElement('canvas')
    // debugger
    var context1 = canvas1.getContext('2d');
    context1.font = "Bold 100px Arial";
    context1.fillStyle = "rgba(255,0,0,0.95)";
    context1.fillText('X', x=50, y=25);

    // canvas1 contents will be used for a texture
    var texture1 = new THREE.Texture(canvas1)
    texture1.needsUpdate = true;

    var material1 = new THREE.MeshBasicMaterial({ map: texture1, side: THREE.DoubleSide });
    material1.transparent = true;

    var mesh1 = new THREE.Mesh(
        new THREE.PlaneGeometry(100, 50),
        material1
    );
    console.log(canvas1.width)
    console.log(canvas1.height)
    mesh1.position.set(0, 0, 0);
    scene.add(mesh1);

    // var text2 = document.createElement('div');
    // text2.style.position = 'absolute';
    // //text2.style.zIndex = 1;    // if you still don't see the label, try uncommenting this
    // text2.style.width = 100;
    // text2.style.height = 100;
    // text2.style.backgroundColor = "blue";
    // text2.innerHTML = "hi there!";
    // text2.style.top = 200 + 'px';
    // text2.style.left = 200 + 'px';
    // document.body.appendChild(text2);
    
    // function toXYCoords(pos) {
    //     var vector = projector.projectVector(pos.clone(), camera);
    //     vector.x = (vector.x + 1) / 2 * window.innerWidth;
    //     vector.y = -(vector.y - 1) / 2 * window.innerHeight;
    //     return vector;
    // }
    // const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    // this.mesh = new THREE.Mesh(geometry, material);

    // this.mesh.position.set(x, y, z);
    // scene.add(this.mesh);

    
    this.update = function () {}

        // mesh.scale.set(scale/2, 1, 1);
    
}
