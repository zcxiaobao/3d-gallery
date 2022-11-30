

<template>
  <div class="canvas-container" ref="canvasDom" v-show="props.isShow">
    <!-- <button>123</button> -->
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
// import { gsap } from 'gsap';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import * as THREE from 'three';
import {
    AnimationMixer,
    Clock,
    DirectionalLight,
    HemisphereLight,
} from 'three';

const props = defineProps({
    ironman_action: {
        type: String,
        default: '',
    },
    width: {
        type: Number,
        default: 0,
    },
    height: {
        type: Number,
        default: 0,
    },
    scale: {
        type: Number,
        default: 0.8,
    },
    isShow: {
        type: Boolean,
        default: false,
    },
});
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
    let finalHeight = props.height * fraction;
    let finalWidth = (finalHeight * mdlen) / mdhei;

    let sacle1 = props.width / finalWidth;
    // console.log('sacle1缩放比例值为:' + sacle1);
    let sacle2 = props.height / finalHeight;
    // console.log('sacle2缩放比例值为:' + sacle2);
    sacle2 *= props.scale;
    sacle1 *= props.scale;
    if (sacle1 >= sacle2) {
        object.scale.set(sacle2, sacle2, sacle2);
    } else {
        object.scale.set(sacle1, sacle1, sacle1);
    }
};
function setMiddle(object) {
    let box = new THREE.Box3().setFromObject(object); // 获取模型的包围盒
    let mdlen = box.max.x - box.min.x; // 模型长度
    let mdwid = box.max.z - box.min.z; // 模型宽度
    let mdhei = box.max.y - box.min.y; // 模型高度
    let x1 = box.min.x + mdlen / 2; // 模型中心点坐标X
    let y1 = box.min.y + mdhei / 2; // 模型中心点坐标Y
    let z1 = box.min.z + mdwid / 2; // 模型中心点坐标Z
    object.position.set(-x1, -y1, -z1); // 将模型进行偏移
}
let canvasDom = ref(null);
let controls;
const animations = [];
const clock = new Clock();
// 设置场景
const scene = new THREE.Scene();

// 设置相机
const camera = new THREE.PerspectiveCamera(
    45,
    props.width / props.height,
    0.01,
    10000
);
camera.position.set(0, 0, 100);
camera.aspect = props.width / props.height;
camera.updateProjectionMatrix();

scene.add(camera);
// 设置渲染器
const renderer = new THREE.WebGLRenderer({
    antialias: true, // 抗锯齿
});
renderer.setSize(props.width, props.height);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setPixelRatio(window.devicePixelRatio);

window.addEventListener('resize', () => {
    renderer.setSize(props.width, props.height);
    renderer.setPixelRatio(window.devicePixelRatio);
    camera.aspect = props.width / props.height;
    camera.updateProjectionMatrix();
});

const render = () => {
    renderer.render(scene, camera);
    controls && controls.update();
    const mixerUpdateDelta = clock.getDelta();
    animations.forEach(mixer => mixer.tick(mixerUpdateDelta));
    requestAnimationFrame(render);
};
function setupModel(data) {
    const model = data.scene.children[0];
    const clip = data.animations[0];
    console.log(data);
    const mixer = new AnimationMixer(model);
    const action = mixer.clipAction(clip);
    action.timeScale = 0.75;
    console.log(action);
    action.play();

    model.tick = delta => mixer.update(delta);
    return model;
}

async function loadIronman() {
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    // loader.setMeshoptDecoder(MeshoptDecoder);
    dracoLoader.setDecoderPath('/draco/');
    // dracoLoader.setDecoderConfig({ type: 'js' }) // 设置兼容性强的解码器，如果加载不出来，就设置下这个
    // DRACOLoader预加载
    dracoLoader.preload();
    loader.setDRACOLoader(dracoLoader);
    const ironmanData = await loader.loadAsync(props.ironman_action);
    const ironman = setupModel(ironmanData);
    console.log(ironmanData);
    return ironman;
}
onMounted(async () => {
    canvasDom.value.appendChild(renderer.domElement);
    renderer.setClearColor('#000');
    scene.background = new THREE.Color('#ddd');
    scene.environment = new THREE.Color('#aaa');
    render();
    const ironman = await loadIronman();

    animations.push(ironman);
    scene.add(ironman);
    setScale(ironman);
    setMiddle(ironman);
    // let boxhelper = new THREE.BoxHelper(ironman, 0xbe1915); //外面红色框
    // scene.add(boxhelper);

    // gsap.to(ironman.rotation, { y: Math.PI, duration: 10 });

    // 添加灯光
    const ambientLight = new HemisphereLight('gray', 'darkslategrey', 5);
    const mainLight = new DirectionalLight('white', 4);
    mainLight.position.set(100, 100, 100);
    scene.add(ambientLight, mainLight);
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
    