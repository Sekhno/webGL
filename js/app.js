import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import fragment from './shaders/fragment.glsl';
import vertex from './shaders/vertex.glsl'

export default class Sketch{
    constructor(options) {
        this.time = 0;
        this.container = options.container;
        this.width = this.container.offsetWidth;
        this.heigth = this.container.offsetHeight;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 70, this.width / this.heigth, 0.01, 10 );
        this.camera.position.z = 1;

        this.renderer = new THREE.WebGLRenderer( { antialias: true } );

        this.container.appendChild( this.renderer.domElement );

        this.controls = new OrbitControls( this.camera, this.renderer.domElement );

        this.resize();
        this.setupResize();
        this.addObjects();
        this.render();
    }

    setupResize(){
        window.addEventListener('resize', this.resize.bind(this))
    }

    resize(){
        this.width = this.container.offsetWidth;
        this.heigth = this.container.offsetHeight;
        this.renderer.setSize( this.width, this.heigth );
        this.camera.aspect = this.width / this.heigth;
        this.camera.updateProjectionMatrix();
    }

    addObjects(){
        // this.geometry = new THREE.BoxGeometry( 0.4, 0.4, 0.4 );
        this.geometry = new THREE.PlaneBufferGeometry( 0.5, 0.5, 50, 50 );
        this.material = new THREE.MeshNormalMaterial();

        this.material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 }
            },
            side: THREE.DoubleSide,
            fragmentShader: fragment,
            vertexShader: vertex,
            wireframe: false
        })

        this.mesh = new THREE.Mesh( this.geometry, this.material );
        this.scene.add( this.mesh );
    }

    render(){
        this.time += 0.05;
        this.mesh.rotation.x = this.time / 2000;
        this.mesh.rotation.y = this.time / 1000;

        this.material.uniforms.time.value = this.time;
        this.renderer.render( this.scene, this.camera );
        window.requestAnimationFrame(this.render.bind(this))
    }
}

new Sketch({
    container: document.getElementById('container')
});
