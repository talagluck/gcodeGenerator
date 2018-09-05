function destroyOnUpdateMesh(scene, mesh) {
    scene.remove(mesh);
    mesh.geometry.dispose();
    mesh.material.dispose();
    mesh = undefined; // garbage collecting?
}
