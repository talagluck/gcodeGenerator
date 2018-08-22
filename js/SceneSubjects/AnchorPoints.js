function AnchorPoint(scene, x, y, list) {

    // const radius = 2;
    const numberSegments = 20;
    const geometry = new THREE.SphereGeometry(
        .5, numberSegments,numberSegments);

    // const material = new THREE.MeshBasicMaterial({ color: 0xff00ff });
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    this.mesh = new THREE.Mesh(geometry, material);

    this.mesh.position.set(x, y, 0);

    scene.add(this.mesh);
    // list.push({
    //     'x': x,
    //     'y': y
    // })

    this.update = function () {

        // mesh.scale.set(scale/2, 1, 1);
    }
}
