import Rotator from "./Rotator";
import * as THREE from "three";
import {rotateClockwise} from "../Helper";

const material = new THREE.MeshStandardMaterial({color:"brown"});
material.name="normal";


class Side{

    static FRONT = "front";
    static RIGHT = "right";
    static LEFT = "left";
    static BACK = "back";
    static sides = [Side.FRONT, Side.RIGHT, Side.BACK, Side.LEFT];

    constructor(side) {
        this.currentIndex = Side.sides.indexOf(side);
    }

    next(){
        if(this.currentIndex===Side.sides.length-1){
            this.currentIndex=0;
        }else{
            this.currentIndex++;
        }
        return this.get();
    }

    previous(){
        if(this.currentIndex===0){
            this.currentIndex=Side.sides.length-1;
        }else{
            this.currentIndex--;
        }
        return this.get();
    }

    get(){
        return Side.sides[this.currentIndex];
    }

}

export default class SideRotator extends Rotator{

    static FRONT = Side.FRONT;
    static RIGHT = Side.RIGHT;
    static LEFT = Side.LEFT;
    static BACK = Side.BACK;


    constructor(state, side, layer, center) {
        super();
        this.state = state;
        this.side = new Side(side);
        this.layer = layer;
        this.center= center;

        this.clockwise=true;
    }




    rotate(clockwise=true) {
        // if(clockwise){
        //     this.side.next();
        // }else{
        //     this.side.previous();
        // }

        let meshes = [];

        switch (this.side.get()){
            case "back":{
                for(let i= this.layer-1; i<=this.layer+1; i++){
                    const backIndex = this.state[i].length-1;
                    for(let j=0; j<this.state[i][0].length; j++){
                        meshes.push(this.state[i][backIndex][j]);
                        this.state[i][backIndex][j].material = material;
                    }
                }
                break;
            }
            case "right":{
                let matrix = [];

                for(let i= this.layer-1, x=0; i<=this.layer+1; i++, x++){
                    matrix[x]=[];
                    for(let j=0, y=0; j<this.state[i].length; j++, y++){
                        const rightIndex = this.state[i][j].length-1;
                        meshes.push(this.state[i][j][rightIndex].mesh);
                        matrix[x][y]=this.state[i][j][rightIndex];
                        this.state[i][j][rightIndex].mesh.material = material;
                    }
                }

                if(matrix.every(m=>m.length===matrix.length)) {
                    rotateClockwise(matrix, true);

                    for (let mesh of meshes) {
                        let geometry = mesh.geometry;
                        geometry.translate(0, -2.35, 3.15 + 0.8);
                        geometry.rotateX(Math.PI / 2);
                        geometry.translate(0, +2.35, -3.15 - 0.8);
                    }
                }




                break;
            }
            case "left":{
                for(let i= this.layer-1; i<=this.layer+1; i++){
                    for(let j=0; j<this.state[i].length; j++){
                        meshes.push(this.state[i][j][0]);
                        this.state[i][j][0].material = material;
                    }
                }




                break;
            }
            case "front":{
                for(let i= this.layer-1; i<=this.layer+1; i++){
                    for(let j=0; j<this.state[i][0].length; j++){
                        meshes.push(this.state[i][0][j].mesh);
                        this.state[i][0][j].mesh.material = material;
                    }
                }

                // for (let mesh of meshes) {
                //     let geometry = mesh.geometry;
                //     geometry.translate(-3.15, -2.35, 0);
                //     geometry.rotateZ(Math.PI/2);
                //     geometry.translate(3.15, 2.35, 0);
                // }



                break;
            }
        }


    }

    update() {
    }
}
