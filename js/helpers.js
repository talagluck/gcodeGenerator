function destroyOnUpdateMesh(scene, mesh) {
    scene.remove(mesh);
    mesh.geometry.dispose();
    mesh.material.dispose();
    mesh = undefined; // garbage collecting?
}


function convertDimsToMM(spiralPoints){
    spiralMinX = -50;
    spiralMaxX = 50;
    spiralMinY = -50;
    spiralMaxY = 50;
    spiralMinZ = -50;
    spiralMaxZ = 50;
    // spiralMinX = Math.min(...pts.map((pt) => pt.x))
    // spiralMaxX = Math.max(...pts.map((pt) => pt.x))
    // spiralMinY = Math.min(...pts.map((pt) => pt.y))
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

function outputGcode(spiralPoints){
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
    let feedrate = 1200;
    let curExtrusion = .5;
    let extrusionRate = 3;
    // const allGcode = "";
    let allGcode = "";
    //all of the opening gcode
    spiralPoints.forEach(
        (pt) => {
            let gcodeLine = `G1 F${feedrate} `;
            gcodeLine+= `X${pt.x} `;
            gcodeLine+= `Y${pt.z} `;
            gcodeLine+= `Z${pt.y} `;
            gcodeLine+= `E${curExtrusion} \n`;
            curExtrusion+=extrusionRate;
            // allGcode.push(gcodeLine);
            allGcode+=gcodeLine;
        }
    )
    return allGcode;
    //all of the closing gcode
}