

<template>
  <div class="canvas-container" ref="canvasDom"></div>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { gsap } from 'gsap';
import * as THREE from 'three';
const setScale = object => {
    const bbox = new THREE.Box3().setFromObject(object);
    let mdlen = bbox.max.x - bbox.min.x; //边界的最小坐标值 边界的最大坐标值
    let mdhei = bbox.max.y - bbox.min.y;
    let mdwid = bbox.max.z - bbox.min.z;

    object.position.set(0, 0, 0);

    let dist = Math.abs(camera.position.z - object.position.z - mdwid / 2);
    let vFov = (camera.fov * Math.PI) / 180;
    let vheight = 2 * Math.tan(vFov * 0.5) * dist;
    let fraction = mdhei / vheight;
    let finalHeight = height * fraction;
    let finalWidth = (finalHeight * mdlen) / mdhei;

    let value1 = width / finalWidth;
    console.log('value1缩放比例值为:' + value1);
    let value2 = height / finalHeight;
    console.log('value2缩放比例值为:' + value2);

    if (value1 >= value2) {
        object.scale.set(value2, value2, value2);
    } else {
        object.scale.set(value1, value1, value1);
    }

    // let boxhelper = new THREE.BoxHelper(object, 0xbe1915); //外面红色框
    // scene.add(boxhelper);
};
const setMidden = obj => {
    let box = new THREE.Box3().setFromObject(obj); // 获取模型的包围盒
    let mdlen = box.max.x - box.min.x; // 模型长度
    let mdwid = box.max.z - box.min.z; // 模型宽度
    let mdhei = box.max.y - box.min.y; // 模型高度
    let x1 = box.min.x + mdlen / 2; // 模型中心点坐标X
    let y1 = box.min.y + mdhei / 2; // 模型中心点坐标Y
    let z1 = box.min.z + mdwid / 2; // 模型中心点坐标Z
    obj.position.set(-x1, -y1, -z1); // 将模型进行偏移
};

let canvasDom = ref(null);
let controls;
let width = window.innerWidth;
let height = window.innerHeight;
// 设置场景
const scene = new THREE.Scene();

// 设置相机
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.01,
    10000
);
camera.position.set(0, 0, 300);
camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();
scene.add(camera);
// 设置渲染器
const renderer = new THREE.WebGLRenderer({
    antialias: true, // 抗锯齿
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setPixelRatio(window.devicePixelRatio);

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

const render = () => {
    renderer.render(scene, camera);
    controls && controls.update();
    requestAnimationFrame(render);
};

onMounted(() => {
    canvasDom.value.appendChild(renderer.domElement);
    renderer.setClearColor('#000');
    scene.background = new THREE.Color('#C0C0C0');
    scene.environment = new THREE.Color('#C0C0C0');
    render();

    // 引入 loader
    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);
    loader.load('/model/heart.glb', gltf => {
        const heart = gltf.scene;
        heart.traverse(function (child) {
            if (child.isMesh) {
                console.log(child);
                if (child.name === 'Sphere000_0') {
                    gsap.to(child.rotation, {
                        x: (Math.PI / 180) * 3,
                        y: (Math.PI / 180) * 3,
                        ease: 'none',
                        repeat: -1,
                        yoyo: true,
                        duration: 0.8,
                    });
                }
            }
        });

        setScale(heart);
        heart.scale.set(40, 40, 40);

        setMidden(heart);
        scene.add(heart);

        gsap.to(heart.rotation, {
            y: Math.PI * 2,
            duration: 6,
            ease: 'none',
            repeat: -1,
        });
        gsap.to(heart.position, {
            y: 0.8,
            duration: 1,
            yoyo: true,
            repeat: -1,
        });
    });

    // 添加灯光
    const light1 = new THREE.DirectionalLight(0x333333, 1);
    light1.position.set(0, 0, 20);
    scene.add(light1);
    const light2 = new THREE.DirectionalLight(0x333333, 1);
    light2.position.set(0, 0, -10);
    scene.add(light2);
    const light3 = new THREE.DirectionalLight(0x333333, 1);
    light3.position.set(20, 0, 0);
    scene.add(light3);
    const light4 = new THREE.DirectionalLight(0x333333, 1);
    light4.position.set(-20, 0, 0);
    scene.add(light4);
    const light5 = new THREE.DirectionalLight(0x333333, 1);
    light5.position.set(0, 10, 0);
    scene.add(light5);
    const light6 = new THREE.DirectionalLight(0x333333, 0.3);
    light6.position.set(5, 20, 0);
    scene.add(light6);
    const light7 = new THREE.DirectionalLight(0xeeeeee, 0.3);
    light7.position.set(0, 20, 5);
    scene.add(light7);
    const light8 = new THREE.DirectionalLight(0x333333, 0.3);
    light8.position.set(0, 20, -5);
    scene.add(light8);
    const light9 = new THREE.DirectionalLight(0x333333, 0.3);
    light9.position.set(-5, 10, 0);
    scene.add(light9);
    const light10 = new THREE.AmbientLight(0x333333, 1);
    light10.position.set(0, 100, 100);
    scene.add(light10);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.update();
});
</script>
<style scope>
* {
    margin: 0;
    padding: 0;
}
</style>
