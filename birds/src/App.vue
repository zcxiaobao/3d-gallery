

<template>
  <div class="canvas-container" ref="canvasDom">
    <!-- <button>123</button> -->
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as THREE from 'three';
import {
    DirectionalLight,
    HemisphereLight,
    AnimationMixer,
    Clock,
} from 'three';

let canvasDom = ref(null);
let controls;
let width = window.innerWidth;
let height = window.innerHeight;
const birds = [];
// 设置场景
const scene = new THREE.Scene();
const clock = new Clock();

// 设置相机
const camera = new THREE.PerspectiveCamera(65, width / height, 0.01, 1000);
camera.position.set(-30, 30, 100);
camera.aspect = width / height;
camera.updateProjectionMatrix();
scene.add(camera);
// 设置渲染器
const renderer = new THREE.WebGLRenderer({
    antialias: true, // 抗锯齿
});
renderer.setSize(width, height);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setPixelRatio(window.devicePixelRatio);

window.addEventListener('resize', () => {
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

function setupModel(data) {
    const model = data.scene.children[0];
    const clip = data.animations[0];
    const mixer = new AnimationMixer(model);
    const action = mixer.clipAction(clip);
    action.play();

    model.tick = delta => mixer.update(delta);
    return model;
}

async function loadBirds() {
    const loader = new GLTFLoader();
    const [parrotData, storkData, flamingoData] = await Promise.all([
        loader.loadAsync('/model/Parrot.glb'),
        loader.loadAsync('/model/Stork.glb'),
        loader.loadAsync('/model/Flamingo.glb'),
    ]);

    const parrot = setupModel(parrotData);
    parrot.position.set(0, 0, 50);

    const flamingo = setupModel(flamingoData);
    flamingo.position.set(150, 0, -200);

    const stork = setupModel(storkData);
    stork.position.set(0, -50, -200);

    return {
        parrot,
        flamingo,
        stork,
    };
}

const render = () => {
    renderer.render(scene, camera);
    const delta = clock.getDelta();
    birds.forEach(bird => {
        bird.tick(delta);
    });
    controls && controls.update();
    requestAnimationFrame(render);
};

onMounted(async () => {
    canvasDom.value.appendChild(renderer.domElement);
    renderer.setClearColor('#000');
    controls = new OrbitControls(camera, renderer.domElement);
    controls.update();
    scene.background = new THREE.Color('skyblue');

    render();
    const { parrot, flamingo, stork } = await loadBirds();
    scene.add(parrot, flamingo, stork);
    birds.push(parrot, flamingo, stork);

    controls.target.copy(parrot.position);

    const ambientLight = new HemisphereLight('white', 'darkslategrey', 5);

    const mainLight = new DirectionalLight('white', 4);
    mainLight.position.set(10, 10, 10);
    scene.add(ambientLight, mainLight);
});
</script>
<style scope>
* {
    margin: 0;
    padding: 0;
}
</style>
