function AnchorPoint(scene, x, y, z) {
    // const radius = 2;
    const numberSegments = 20;
    const geometry = new THREE.SphereGeometry(
        .5, numberSegments,numberSegments);

    // const material = new THREE.MeshBasicMaterial({ color: 0xff00ff });
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    this.mesh = new THREE.Mesh(geometry, material);

    this.mesh.position.set(x, y, z);
    scene.add(this.mesh);

    // this.posX = gui.add(this.mesh.position, 'x');
    // this.posY = gui.add(this.mesh.position, 'y');
    // this.deleteAnchorPoint = function (mouseX) {
    //     debugger;
    //     sceneManager.grid.anchorPointList.forEach(
    //         (pt) => {
    //             if (pt.mesh.uuid == anchorPointIntersects[0].object.uuid){
    //             sceneManager.grid.anchorPointList.splice( sceneManager.grid.anchorPointList.indexOf(pt),1);
    //             }
    //         }
    //     )
    // }

    
    this.update = function () {}

        // mesh.scale.set(scale/2, 1, 1);
    
}
