// import '../styles/index.scss';

import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import Cube from "./Cube";

var camera, scene, renderer, controls, light;
var meshes;

var cube;

function init() {
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 50 );
    camera.position.z = 30;

    controls = new OrbitControls( camera, renderer.domElement );
    controls.update();

    scene = new THREE.Scene();
    light = new THREE.PointLight( 0xffffff, 1, 100 );
    light.position.set( 50, 50, 50 );
    scene.add( light );




    meshes = new Array();

    const xDiv = [2.1, 1.9, 1.7];
    const yDiv = [0.9, 1.9, 2.9];
    const yDiv4 = [0.9, 1.9, 1.9, 0.9];

    let layers = [
        {xDiv, yDiv, height:1.3, rotateCenter:{x:3.15, y:1.95}},
        {xDiv, yDiv, height:1.9,  rotateCenter:{x:3.15, y:1.95}},
        {xDiv, yDiv:yDiv4, height:2.5, rotateCenter:{x:3.15, y:3.95}},
        {xDiv, yDiv:yDiv.slice().reverse(), height:1.9, rotateCenter:{x:3.15, y:3.95}},
        {xDiv, yDiv:yDiv4, height:1.3, rotateCenter:{x:3.15, y:1.95}},
        {xDiv, yDiv, height:1.9, rotateCenter:{x:3.15, y:1.95}},
        {xDiv, yDiv:yDiv4, height:2.5, rotateCenter:{x:3.15, y:3.95}},
        {xDiv, yDiv:yDiv.slice().reverse(), height:1.9, rotateCenter:{x:3.15, y:3.95}},
        {xDiv, yDiv:yDiv.slice().reverse(), height:1.3},
    ];

    cube = new Cube(layers);

    global.cube = cube;


    for(let mesh of cube.meshes){
        // mesh.rotateX(0.5)
        scene.add( mesh );
        meshes.push(mesh);
    }

}

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

function animate() {

    requestAnimationFrame( animate );

    // for(let mesh of meshes){
    //     mesh.rotation.x += 0.01;
    //
    //     mesh.rotation.y += 0.01;
    //     // mesh.rotation.z += 0.01;
    // }

    controls.update();
    cube.update();


    light.position.set( camera.position.x, camera.position.y, camera.position.z );
    raycaster.setFromCamera( mouse, camera );

    // calculate objects intersecting the picking ray
    var intersects = raycaster.intersectObjects( scene.children );
    if(intersects.length>0){
        let mesh = intersects.sort((i1,i2)=>i1.distance - i2.distance)[0].object;
        mesh.material = new THREE.MeshBasicMaterial({wireframe:true});
        m: for(let i=0; i<cube.state.length; i++){
            for(let j=0; j<cube.state[i].length; j++){
                for(let k=0; k<cube.state[i][j].length; k++){
                    if(cube.state[i][j][k].mesh===mesh){
                        console.log("i="+i+", j="+j+",  k="+k);
                        break m;
                    }
                }
            }
        }

    }


    renderer.render( scene, camera );

}


function onMouseMove( event ) {

    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

window.addEventListener( 'mousemove', onMouseMove, false );




// let intervar = setInterval(()=>{
//     let index = Math.round(Math.random()*10)%cube.rotators.length;
//     let clockwise = Math.round(Math.random()*10)%2===0;
//     cube.rotators[index].rotate(clockwise);
// }, 2000);



init();
animate();
