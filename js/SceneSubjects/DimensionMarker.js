function DimensionMarker(scene, dimText, size, x, y, z, rotate=null) {


    var loader = new THREE.FontLoader();

    loader.setPath('./js/SceneSubjects')

    loader.load('/helvetikerFont.json', (font) => {

        var geometry = new THREE.TextGeometry(dimText, {
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
        if(rotate){
            this.mesh.rotation.z=-Math.PI/3.75
        }


        scene.add(this.mesh);
    });   
    this.update = function () {}

        // mesh.scale.set(scale/2, 1, 1);
    
}
