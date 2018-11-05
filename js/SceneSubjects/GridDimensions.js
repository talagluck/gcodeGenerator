function GridDimensions(scene, maxMM, size, originX,originY,originZ) {
    let divisions = 10;
    this.allDims = []
    
    var loader = new THREE.FontLoader();
    loader.load('./js/SceneSubjects/helvetikerFont.json', (font) =>
        {   
            // debugger;
            for(let i=0;i<divisions;i++){
            let position = (10*i)
            let dimText = `${(maxMM/divisions*i).toFixed(1)}mm`
            let horizontalDim = new DimensionMarker(scene, font, dimText,size,originX+position,originY-2.5,0,true);
            this.allDims.push(horizontalDim);
            if(dimText.length < maxMM.toFixed(1).length+2){
                let dif = (maxMM.toFixed(1).length + 2) - dimText.length
                dimText = " ".repeat(dif) + dimText
            }
            let verticalDim = new DimensionMarker(scene,font, dimText,size,originX-(dimText.length*1.75),originY+position,0);
            this.allDims.push(verticalDim);
        }
        }
    )
}
// maxinwh1234567890.