import * as THREE from "three";


export const SEPARATE_SIZE = 0.1;

export function createBox(w, h, d){
    let res = new THREE.Geometry();
    res.vertices.push(new THREE.Vector3(0,0,0));
    res.vertices.push(new THREE.Vector3(w,0,0));
    res.vertices.push(new THREE.Vector3(0,h,0));
    res.vertices.push(new THREE.Vector3(w,h,0));
    res.vertices.push(new THREE.Vector3(w,h,-d));
    res.vertices.push(new THREE.Vector3(0,h,-d));
    res.vertices.push(new THREE.Vector3(w,0,-d));
    res.vertices.push(new THREE.Vector3(0,0,-d));

    res.faces.push(new THREE.Face3(0,1,2));
    res.faces.push(new THREE.Face3(1,3,2));
    res.faces.push(new THREE.Face3(2, 3, 4));
    res.faces.push(new THREE.Face3(2,4,5));
    res.faces.push(new THREE.Face3(3, 1, 4));
    res.faces.push(new THREE.Face3(0, 2, 5));
    res.faces.push(new THREE.Face3(4, 1, 6));
    res.faces.push(new THREE.Face3(5, 4, 6));

    res.faces.push(new THREE.Face3(0,5, 7));
    res.faces.push(new THREE.Face3(1, 0, 7));
    res.faces.push(new THREE.Face3(1, 7, 6));
    res.faces.push(new THREE.Face3(6, 7, 5));

    res.computeFaceNormals();
    return res;
}

export function createLayer(xDiv, yDiv, height, baseHeight=0){
    let geometries = [];

    let sumY=0;
    for(let i=0; i<yDiv.length; i++){
        geometries[i]=[];
        let sumX=0;
        for(let j=0; j<xDiv.length; j++){
            let geometry = createBox(xDiv[j], height, yDiv[i]);
            geometry.translate(sumX, baseHeight, sumY);
            geometries[i][j]=geometry;
            sumX+=xDiv[j]+SEPARATE_SIZE;
        }
        sumY-=yDiv[i]+SEPARATE_SIZE;
    }
    return geometries;
}

/**
 * @param obj - your object (THREE.Object3D or derived)
 * @param point - the point of rotation (THREE.Vector3)
 * @param axis - the axis of rotation (normalized THREE.Vector3)
 * @param theta -  radian value of rotation
 * @param pointIsWorld - boolean indicating the point is in world coordinates (default = false)
 */
export function rotateAboutPoint(obj, point, axis, theta, pointIsWorld){
    pointIsWorld = (pointIsWorld === undefined)? false : pointIsWorld;

    if(pointIsWorld){
        obj.parent.localToWorld(obj.position); // compensate for world coordinate
    }

    obj.position.sub(point); // remove the offset
    obj.position.applyAxisAngle(axis, theta); // rotate the POSITION
    obj.position.add(point); // re-add the offset

    if(pointIsWorld){
        obj.parent.worldToLocal(obj.position); // undo world coordinates compensation
    }

    obj.rotateOnAxis(axis, theta); // rotate the OBJECT
}
