function GridPlane(scene, planeSize, planeColor, numberSegments) {
    const geometry = new THREE.PlaneBufferGeometry(planeSize, planeSize, numberSegments, numberSegments);
    const material = new THREE.LineBasicMaterial({ color: planeColor });
    // const plane = new THREE.Mesh(geometry, material);
    const wireFrame = new THREE.WireframeGeometry(geometry);
    const line = new THREE.LineSegments(wireFrame, material);

    line.material.depthTest = true;
    line.material.opacity = 1;
    line.material.transparent = true;
    // plane.visible = true;
    // const radius = 2;

    // this.plane = line;
    scene.add(line);
}
