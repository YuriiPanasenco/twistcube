import Rotator from "./Rotator";
import * as THREE from "three";
import {rotateClockwise, rotateUnClockwise} from "../Helper";

const COUNT=25;


export default class LayerRotator extends Rotator{

    /**
     *
     * @param state
     * @param {number} index
     * @param {THREE.Vector3} center
     * @param {Rotator} dependent
     */
    constructor(state, index, center, dependent) {
        super();

        this.state = state;
        this.index=index;

        /** @type {Rotator} */
        this.dependent = dependent;

        /** @type {THREE.Vector3} */
        this.center=center;

        this.axis = new THREE.Vector3(0,1,0);

        this.angle = Math.PI/2;
        this._rotateStep = 0;
        this._rotateCenter;
        this.clockwise=true;
    }

    get meshes(){
        return this.state[this.index].flat(2).map(s=>s.mesh);
    }

    rotate(clockwise=true) {
        if(this._rotateStep!==0){
            console.warn("The rotator is not done the previous rotation yet!");
            return ;
        }
        this.clockwise=clockwise;
        this._rotateCenter=this.center;
        this._rotateStep=1;

        if(clockwise) {
            this.state[this.index] = rotateClockwise(this.state[this.index], false);
        }else{
            this.state[this.index] = rotateUnClockwise(this.state[this.index], false);
        }

        if(this.dependent){
            this.dependent.rotateSub(this.center, clockwise);
        }
    }

    rotateSub(center, clockwise){
        if(this._rotateStep!==0){
            console.warn("The rotator is not done the previous rotation yet!");
            return ;
        }
        this.clockwise=clockwise;
        this._rotateCenter=center;
        this._rotateStep=1;

        if(clockwise) {
            this.state[this.index] = rotateClockwise(this.state[this.index], false);
        }else{
            this.state[this.index] = rotateUnClockwise(this.state[this.index], false);
        }

        this.center.sub(center);
        this.center.applyAxisAngle(this.axis, this.angle* (this.clockwise?1:-1));
        this.center.add(center);
        if(this.dependent){
            this.dependent.rotateSub(center, clockwise);
        }
    }

    update() {
        if(this._rotateStep===0){
            return ;
        }
        for (let mesh of this.meshes) {
            let geometry = mesh.geometry;
            geometry.translate(-this._rotateCenter.x, -this._rotateCenter.y, -this._rotateCenter.z);
            geometry.rotateY((Math.PI/2)/COUNT);
            geometry.translate(this._rotateCenter.x, this._rotateCenter.y, this._rotateCenter.z);
        }
        if(COUNT>this._rotateStep){
            this._rotateStep++;
        }else{
            this._rotateCenter=null;
            this._rotateStep=0;
        }

        if(this.dependent){
            this.dependent.update();
        }
    }
}
