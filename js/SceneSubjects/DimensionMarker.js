function DimensionMarker(scene, font, dimText, size, x, y, z, rotate=null) {

    // debugger;
    // var loader = new THREE.FontLoader();
    var geometry = new THREE.TextBufferGeometry(dimText, {
        font: font,
        size: size,
        height: 0.1,
        curveSegments: 12,
        // bevelEnabled: true,
        // bevelThickness: 10,
        // bevelSize: 8,
        // bevelSegments: 5
    });

    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.set(x, y, z);
    if (rotate) {
        this.mesh.rotation.z = -Math.PI / 3.75
    }


    scene.add(this.mesh);

    // loader.load('./js/SceneSubjects/helvetikerFont.json', (font) => {

       
    // });   
    this.update = function () {}

        // mesh.scale.set(scale/2, 1, 1);
    
}
