function DimensionMarker(camera, dimText, size, x, y, z, rotate=null) {
    const idName = x + '-' + y;
    if(document.getElementById(idName)){
        const alreadyDiv = document.getElementById(idName);
        document.getElementById(idName).parentNode.removeChild(alreadyDiv);
    }
    
    
    const div = document.createElement('div');
    div.innerHTML = dimText;
    div.style.height = size+'px';

    const vector = projectToScreen(x,y,z,camera,canvas);

    div.style.left = vector.x +'px';
    div.style.top = vector.y+'px';
    div.id = idName;
    div.className = 'dimMarker';

    if(rotate){
        div.style.transform = 'rotate(45deg)';
    }

    document.getElementById('dimensionMarkerContainer').appendChild(div);
    // let bAT = document.getElementById("bottomAnchor");
    // let tAT = document.getElementById("topAnchor");
    // let cT = document.getElementById("center");

    // let newVec = projectToScreen(this.anchorPointList[0].mesh, this.camera, canvas);
    // newLeft = newVec.x;
    // newTop = newVec.y;
    // bAT.style.top = newTop + 'px';
    // bAT.style.left = newLeft + 'px';

    // newVec = projectToScreen(this.anchorPointList[1].mesh, this.camera, canvas);
    // newLeft = newVec.x;
    // newTop = newVec.y;
    // tAT.style.top = newTop + 'px';
    // tAT.style.left = newLeft + 'px';

    // newVec = projectToScreen(this.anchorPointList[2].mesh, this.camera, canvas);
    // newLeft = newVec.x;
    // newTop = newVec.y;
    // cT.style.top = newTop + 'px';
    // cT.style.left = newLeft + 'px';
    // console.log(canvas.width, canvas.height);
    // var geometry = new THREE.TextBufferGeometry(dimText, {
    //     font: font,
    //     size: size,
    //     height: 0.1,
    //     curveSegments: 12,

    // });

    // const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    // this.mesh = new THREE.Mesh(geometry, material);
    // this.mesh.position.set(x, y, z);
    // if (rotate) {
    //     this.mesh.rotation.z = -Math.PI / 3.75
    // }


    // scene.add(this.mesh);

}
