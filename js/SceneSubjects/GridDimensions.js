function GridDimensions(scene, maxMM, size, originX,originY,originZ) {
    let divisions = 10;

    for(let i=0;i<divisions;i++){
        let position = (10*i)
        let dimText = `${(maxMM/divisions*i).toFixed(1)}mm`
        let horizontalDim = new DimensionMarker(scene,dimText,size,originX+position,originY-2.5,0,true);
        if(dimText.length < maxMM.toFixed(1).length+2){
            let dif = (maxMM.toFixed(1).length + 2) - dimText.length
            dimText = " ".repeat(dif) + dimText
        }
        let verticalDim = new DimensionMarker(scene,dimText,size,originX-(dimText.length*1.75),originY+position,0);

    }

    this.update = function () {}

        // mesh.scale.set(scale/2, 1, 1);
    
}
