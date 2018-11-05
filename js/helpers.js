function destroyOnUpdateMesh(scene, mesh) {
    scene.remove(mesh);
    mesh.geometry.dispose();
    mesh.material.dispose();
    mesh = undefined; // garbage collecting?
}

function projectToScreen(object, camera, canvas){
    const vector = new THREE.Vector3();
    ptX = object.position.x;
    ptY = object.position.y;
    ptZ = object.position.z;
    vector.set(ptX,ptY,ptZ);
    console.log(canvas.width,canvas.height)    
    //map to normalized device coordinate space
    camera.updateMatrixWorld();
    vector.project(camera);

    //map to 2d screen

    //-50,50;-50,50;0

    // console.log(vector.x,vector.y,vector.z)
    //
    vector.x = Math.round((vector.x+1)/2 * window.innerWidth);
    vector.y = Math.round((vector.y+1)/2 * window.innerHeight);
    vector.z = 0;
    // debugger;
    console.log(vector.x,vector.y,vector.z);
    return vector;
}

function convertDimsToMM(spiralPoints){
    spiralMinX = -50;
    spiralMaxX = 50;
    // spiralMinY = -50;
    spiralMaxY = 50;
    spiralMinZ = -50;
    spiralMaxZ = 50;
    // spiralMinX = Math.min(...pts.map((pt) => pt.x))
    // spiralMaxX = Math.max(...pts.map((pt) => pt.x))
    spiralMinY = Math.min(...spiralPoints.map((pt) => pt.y))
    // spiralMaxY = Math.max(...pts.map((pt) => pt.y))
    // spiralMinZ = Math.min(...pts.map((pt) => pt.z))
    // spiralMaxZ = Math.max(...pts.map((pt) => pt.z))

    printerMinX = 0;
    printerMaxX = 150;
    printerMinY = 0;
    printerMaxY = 150;
    printerMinZ = 0;
    printerMaxZ = 150;

    const printerPts = []
    spiralPoints.map(
        (pt) =>{
            let x = THREE.Math.mapLinear(pt.x,spiralMinX,spiralMaxX,printerMinX,printerMaxX);
            let y = THREE.Math.mapLinear(pt.y,spiralMinY,spiralMaxY,printerMinY,printerMaxY);
            let z = THREE.Math.mapLinear(pt.z,spiralMinZ,spiralMaxZ,printerMinZ,printerMaxZ);
            printerPts.push({x,y,z})
    }
    )
    return printerPts;
}

function outputGcode(spiralPoints, startingExtrusion,layerHeight,feedrate ){
    //add an option to adjust the z level while extruding. this needs to not apply
    //to the base of the shape, probably, but can otherwise be loose. need to 
    //put together the bottom spiral with the main spiral, but also understand how to keep
    //them separate to apply different z-levels. are maybe don't need to put them together,
    //just output the gcode in sequence?

    //make use of G2 and G3 to create some wobbling. skip every other point, and use
    //the skipped point as the i and j values. and alternate between G2 and G3 for steady
    //wobbling, or use continuous for a more scalloped shape.

    //do i need to offset the z ever so slightly so that the first row has space to print?
    //figure out the height space between rows compared to extruder height, and the 
    //width space in the bottom spiral compared to extruder width so that the extruder 
    //doesn't disturb previously printed lines. some z-height will likely help with this


    // M190 S45.000000
    // M109 S215.000000
    //     ; Sliced at: Fri 10 - 08 - 2018 11: 12: 03
    //     ; Basic settings: Layer height: 0.1 Walls: 1 Fill: 30
    //         ; Print time: 29 minutes
    //     ; Filament used: 1.491m 4.0g
    //     ; Filament cost: None
    //         ; M190 S45; Uncomment to add your own bed temperature line
    //     ; M109 S215; Uncomment to add your own temperature line
    // G21; metric values
    // G90; absolute positioning
    // M82; set extruder to absolute mode
    // M107; start with the fan off
    // G28 X0 Y0; move X / Y to min endstops
    // G28 Z0; move Z to min endstops
    // G1 Z15.0 F12000; move the platform down 15mm
    // G92 E0; zero the extruded length
    // G1 F200 E3; extrude 3mm of feed stock
    // G92 E0; zero the extruded length again
    // G1 F12000
    //     ; Put printing message on LCD screen
    // M117 Printing...
    spiralPoints = convertDimsToMM(spiralPoints);
    // let feedrate = 1200;
    let curExtrusion = startingExtrusion;
    // let extrusionRate = extrusion;
    // const allGcode = "";
    let allGcode = "";
    let prevPoint = undefined;
    let distance = .1;
    let flowModifier = 1;
    //all of the opening gcode
    spiralPoints.forEach(
        (pt) => {
            if(prevPoint){
                let deltaX2 = Math.pow(pt.x-prevPoint.x,2);
                let deltaY2 = Math.pow(pt.y - prevPoint.y, 2);
                let deltaZ2 = Math.pow(pt.z - prevPoint.z, 2);
                distance = Math.sqrt(deltaX2 + deltaY2 + deltaZ2);
            } 

            let increaseExtrusion = (distance * layerHeight * flowModifier) / (Math.PI * 0.5)

            curExtrusion += increaseExtrusion

            let gcodeLine = `G1 F${feedrate} `;
            gcodeLine+= `X${pt.x} `;
            gcodeLine+= `Y${pt.z} `;
            gcodeLine+= `Z${pt.y + layerHeight} `;
            gcodeLine+= `E${curExtrusion} \n`;
            // curExtrusion+=extrusionRate;
            // allGcode.push(gcodeLine);
            allGcode+=gcodeLine;
            prevPoint = pt;
        }
    )
    return allGcode;
    //all of the closing gcode
}