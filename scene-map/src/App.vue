

<template>
  <div class="canvas-container" ref="canvasDom"></div>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { gsap } from 'gsap';
import * as THREE from 'three';
let canvasDom = ref(null);
let controls;
// 设置场景
const scene = new THREE.Scene();

// 设置相机
const camera = new THREE.PerspectiveCamera(
    40,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(0, 50, 0);
camera.up.set(0, 0, 1);
camera.lookAt(0, 0, 0);

scene.add(camera);
// 设置渲染器
const renderer = new THREE.WebGLRenderer({
    antialias: true, // 抗锯齿
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
// 要更新旋转角度的对象数组
const rotations = [];
const sunEarchScene = new THREE.Group();
scene.add(sunEarchScene);
rotations.push(sunEarchScene);
// 一球多用
const radius = 1;
const widthSegments = 6;
const heightSegments = 6;
const sphereGeometry = new THREE.SphereGeometry(
    radius,
    widthSegments,
    heightSegments
);

const sunMaterial = new THREE.MeshPhongMaterial({ emissive: 0xffff00 });
const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
sunMesh.scale.set(5, 5, 5); // 扩大太阳的大小
sunEarchScene.add(sunMesh);
rotations.push(sunMesh);

const earchMoonScene = new THREE.Group();
earchMoonScene.position.x = 10;
sunEarchScene.add(earchMoonScene);
rotations.push(earchMoonScene);

const earthMaterial = new THREE.MeshPhongMaterial({
    color: 0x2233ff,
    emissive: 0x112244,
});
const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
rotations.push(earthMesh);
earchMoonScene.add(earthMesh);

const moonMaterial = new THREE.MeshPhongMaterial({
    color: 0x888888,
    emissive: 0x222222,
});
const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
moonMesh.scale.set(0.5, 0.5, 0.5);
moonMesh.position.x = 2;
earchMoonScene.add(moonMesh);
rotations.push(moonMesh);

const render = time => {
    time *= 0.001;
    renderer.render(scene, camera);
    controls && controls.update();
    rotations.forEach(obj => {
        obj.rotation.y = time;
    });
    rotations.forEach(node => {
        const axes = new THREE.AxesHelper();
        axes.material.depthTest = false;
        axes.renderOrder = 1;
        node.add(axes);
    });
    requestAnimationFrame(render);
};
onMounted(() => {
    canvasDom.value.appendChild(renderer.domElement);
    renderer.setClearColor('#000');
    scene.background = new THREE.Color('#eee');
    scene.environment = new THREE.Color('#eee');
    render();

    const color = 0xffffff;
    const intensity = 3;
    const light = new THREE.PointLight(color, intensity);
    scene.add(light);

    console.log(scene);

    scene.traverse(function (obj) {
        if (obj.type === 'Group') {
            console.log('Group ', obj);
        }
        if (obj.type === 'Mesh') {
            console.log('Mesh ', obj);
        }
    });
});
</script>
<style scope>
* {
    margin: 0;
    padding: 0;
}
</style>
