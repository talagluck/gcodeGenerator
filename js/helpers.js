function destroyOnUpdateMesh(scene, mesh) {
    scene.remove(mesh);
    mesh.geometry.dispose();
    mesh.material.dispose();
    mesh = undefined; // garbage collecting?
}


function convertDimsToMM(spiralPoints){
    spiralMinX = Math.min(...pts.map((pt) => pt.x))
    spiralMaxX = Math.max(...pts.map((pt) => pt.x))
    spiralMinY = Math.min(...pts.map((pt) => pt.y))
    spiralMaxY = Math.max(...pts.map((pt) => pt.y))
    spiralMinZ = Math.min(...pts.map((pt) => pt.z))
    spiralMaxZ = Math.max(...pts.map((pt) => pt.z))

    printerMinX = 0;
    printerMaxX = 6;
    printerMinY = 0;
    printerMaxY = 6;
    printerMinZ = 0;
    printerMaxZ = 6;

    const printerPts = []
    spiralPoints.map(
        (pt) =>{
            x = THREE.Math.mapLinear(pt.x,spiralMinX,spiralMaxX,printerMinX,printerMaxX);
            y = THREE.Math.mapLinear(pt.y,spiralMinY,spiralMaxY,printerMinY,printerMaxY);
            z = THREE.Math.mapLinear(pt.z,spiralMinZ,spiralMaxZ,printerMinZ,printerMaxZ);
            printerPts.push({newX,newY,newZ})
    }
    )
    return printerPts;




    // x = THREE.Math.mapLinear(value, min1,max1,min2,max2)

}