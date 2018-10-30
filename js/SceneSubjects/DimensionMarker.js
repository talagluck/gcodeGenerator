function DimensionMarker(scene, dimText, size, x, y, z, rotate=null) {


    var loader = new THREE.FontLoader();

    loader.setPath('./js/SceneSubjects')

    loader.load('/helvetikerFont.json', function (font) {

        var geometry = new THREE.TextGeometry(dimText, {
            font: font,
            size: size,
            height: 0,
            curveSegments: 12,
            // bevelEnabled: true,
            // bevelThickness: 10,
            // bevelSize: 8,
            // bevelSegments: 5
        });

        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        var mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);
        if(rotate){
            mesh.rotation.z=-Math.PI/3.75
        }


        scene.add(mesh);
    });   
    this.update = function () {}

        // mesh.scale.set(scale/2, 1, 1);
    
}
