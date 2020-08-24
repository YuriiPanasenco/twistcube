import * as THREE from "three";

import {createLayer, SEPARATE_SIZE} from "./ThreeJSHelper";
import LayerRotator from "./rotator/LayerRotator";
import SideRotator from "./rotator/SideRotator";



// const material = new THREE.MeshBasicMaterial({wireframe:true});
const material = new THREE.MeshStandardMaterial({color:"yellow"});
// const material = new THREE.MeshNormalMaterial();
material.name="normal";

export default class Cube{

    constructor(layers) {

        this.meshes = [];

        this.rotators = [];

        this.state = [];

        let base =0;
        for(let i=0; i<layers.length; i++){
            this.state[i]=[];
            let geometries = createLayer(layers[i].xDiv, layers[i].yDiv, layers[i].height, base);
            for(let j=0; j<geometries.length; j++){
                this.state[i][j]=[];
                for(let k=0; k<geometries[j].length; k++){
                    let mesh = new THREE.Mesh(geometries[j][k], material);
                    this.state[i][j][k]={mesh};
                    this.meshes.push(mesh);
                }
            }
            base+=layers[i].height+SEPARATE_SIZE;
        }

        this._initRotators(layers);
    }

    _initRotators(layers){
        let lastRotator = null;
        for(let i=0; i<layers.length; i++){
            if(layers[i].rotateCenter){
                lastRotator = new LayerRotator( this.state, i,
                    new THREE.Vector3(layers[i].rotateCenter.x, 0, -layers[i].rotateCenter.y),
                    lastRotator);
                this.rotators.push(lastRotator);
            }
        }

        this.rotators.push(new SideRotator(this.state, SideRotator.FRONT, 1,
            new THREE.Vector3(3.15, 0, -2.35)));
        this.rotators.push(new SideRotator(this.state, SideRotator.LEFT, 1,
            new THREE.Vector3(3.15, 0, -2.35)));
        this.rotators.push(new SideRotator(this.state, SideRotator.RIGHT, 1,
            new THREE.Vector3(0, 2.35, -2.95)));
        this.rotators.push(new SideRotator(this.state, SideRotator.BACK, 1,
            new THREE.Vector3(3.15, 0, -2.35)));
    }

    update(){
        for(let i=0; i<this.rotators.length; i++){
            this.rotators[i].update();
        }
        for(let mesh of this.meshes){
            if(mesh.material.name!=='normal') {
                mesh.material = material;
            }
        }
    }
}
