function GridPoint(scene, numberSegments, x, y, z) {
    const radius = 0.5;
    const geometry = new THREE.SphereGeometry(radius, numberSegments, numberSegments);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z)
    scene.add(mesh);

    this.meshAttr = () => mesh
    this.hideGridPoint = function(){
        mesh.visible = false;
    }
    this.showGridPoint = function(){
        mesh.visible = true;
    }

}

