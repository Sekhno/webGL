import * as THREE from 'three';
import imagesLoaded from 'imagesloaded';
import FontFaceObserver from 'fontfaceobserver';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import fragment from './shaders/fragment.glsl';
import vertex from './shaders/vertex.glsl'

export default class Sketch {
    constructor(options) {
        this.time = 0;
        this.container = options.container;
        this.width = this.container.offsetWidth;
        this.heigth = this.container.offsetHeight;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 70, this.width / this.heigth, 100, 2000 );
        this.camera.position.z = 600;

        this.camera.fov = 2 * Math.atan( (this.heigth/2)/600 )* (180/Math.PI)

        this.renderer = new THREE.WebGLRenderer( {
            antialias: true,
            alpha: true
        } );

        this.container.appendChild( this.renderer.domElement );

        this.controls = new OrbitControls( this.camera, this.renderer.domElement );

        this.images = [...document.querySelectorAll('img')];

        const fontOpen = new Promise(resolve => {
            new FontFaceObserver("Open Sans").load().then(() => {
                resolve();
            });
        });

        const fontPlayfair = new Promise(resolve => {
            new FontFaceObserver("Playfair Display").load().then(() => {
                resolve();
            });
        });

        // Preload images
        const preloadImages = new Promise((resolve, reject) => {
            imagesLoaded(document.querySelectorAll("img"), { background: true }, resolve);
        });

        let allDone = [fontOpen, fontPlayfair, preloadImages];

        Promise.all(allDone).then(()=>{
            this.addImages();
            this.setPosition();

            this.resize();
            this.setupResize();
            this.addObjects();
            this.render();
        });
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

    addImages() {
        this.imagesStore = this.images.map(img=>{
            let bounds = img.getBoundingClientRect();

            let geometry = new THREE.PlaneBufferGeometry(bounds.width, bounds.height, 1, 1);
            let texture = new THREE.Texture(img);
            texture.needsUpdate = true;
            // texture.needsUpdate = true;
            let material = new THREE.MeshBasicMaterial({
                color: 0xff0000,
                map: texture
            });

            let mesh = new THREE.Mesh(geometry, material);

            this.scene.add(mesh)

            return {
                img: img,
                mesh: mesh,
                top: bounds.top,
                left: bounds.left,
                width: bounds.width,
                height: bounds.height
            }
        });

        console.log(this.imagesStore)
    }

    setPosition(){
        this.imagesStore.forEach(o=>{
            o.mesh.position.y = -o.top + this.heigth/2 - o.height/2;
            o.mesh.position.x = o.left - this.width/2 + o.width/2;
        })
    }

    addObjects(){
        // this.geometry = new THREE.BoxGeometry( 0.4, 0.4, 0.4 );
        // this.geometry = new THREE.SphereBufferGeometry(0.4, 40, 40);
        this.geometry = new THREE.PlaneBufferGeometry( 200, 400, 10, 10 );
        this.material = new THREE.MeshNormalMaterial();

        this.material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 }
            },
            side: THREE.DoubleSide,
            fragmentShader: fragment,
            vertexShader: vertex,
            wireframe: true
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
