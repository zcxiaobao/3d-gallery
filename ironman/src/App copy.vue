

<template>
  <div class="canvas-container" ref="canvasDom">
    <!-- <button>123</button> -->
  </div>
</template>
  <script setup>
import { onMounted, ref } from 'vue';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { gsap } from 'gsap';
import * as THREE from 'three';
import { AnimationMixer, Clock } from 'three';
const setScale = object => {
    const bbox = new THREE.Box3().setFromObject(object);
    let mdlen = bbox.max.x - bbox.min.x; //边界的最小坐标值 边界的最大坐标值
    let mdhei = bbox.max.y - bbox.min.y;
    let mdwid = bbox.max.z - bbox.min.z;

    object.position.set(0, 0, 0);

    let dist = Math.abs(camera.position.z - object.position.z - mdwid / 2);
    //console.log('dist值为:' + dist );
    let vFov = (camera.fov * Math.PI) / 180;
    //console.log('vFov值为:' + vFov );
    let vheight = 2 * Math.tan(vFov * 0.5) * dist;
    //console.log('vheight值为:' + vheight );
    let fraction = mdhei / vheight;
    // console.log('fraction值为:' + fraction );
    let finalHeight = height * fraction;
    //console.log('finalHeight值为:' + finalHeight);
    let finalWidth = (finalHeight * mdlen) / mdhei;
    //console.log('finalWidth值为:' + finalWidth );

    let value1 = width / finalWidth;
    console.log('value1缩放比例值为:' + value1);
    let value2 = height / finalHeight;
    console.log('value2缩放比例值为:' + value2);

    if (value1 >= value2) {
        object.scale.set(value2, value2, value2);
    } else {
        object.scale.set(value1, value1, value1);
    }
    let box = new THREE.Box3().setFromObject(object); // 获取模型的包围盒
    mdlen = box.max.x - box.min.x; // 模型长度
    mdwid = box.max.z - box.min.z; // 模型宽度
    mdhei = box.max.y - box.min.y; // 模型高度
    let x1 = box.min.x + mdlen / 2; // 模型中心点坐标X
    let y1 = box.min.y + mdhei / 2; // 模型中心点坐标Y
    let z1 = box.min.z + mdwid / 2; // 模型中心点坐标Z
    object.position.set(-x1, -y1, -z1); // 将模型进行偏移
    scene.add(object);

    let boxhelper = new THREE.BoxHelper(object, 0xbe1915); //外面红色框
    scene.add(boxhelper);
};
// const setMidden = obj => {
//     // 将模型的中心点设置到canvas坐标系的中心点，保证模型显示是居中的，object就是操作的目标模型
//     let box = new THREE.Box3().setFromObject(obj); // 获取模型的包围盒
//     let mdlen = box.max.x - box.min.x; // 模型长度
//     let mdwid = box.max.z - box.min.z; // 模型宽度
//     let mdhei = box.max.y - box.min.y; // 模型高度
//     let x1 = box.min.x + mdlen / 2; // 模型中心点坐标X
//     let y1 = box.min.y + mdhei / 2; // 模型中心点坐标Y
//     let z1 = box.min.z + mdwid / 2; // 模型中心点坐标Z
//     obj.position.set(-x1, -y1, -z1); // 将模型进行偏移
// };
// const setModelAdapt = object => {
//     var boxHelper = new THREE.BoxHelper();
//     boxHelper.setFromObject(object);
//     boxHelper.geometry.computeBoundingSphere(); //一定要先调用计算包围盒后再生成
//     var center = boxHelper.geometry.boundingSphere.center; //包围球中心
//     var radius = boxHelper.geometry.boundingSphere.radius; //包围球半径
//     console.log(center, radius);
//     var cameraPos = new THREE.Vector3(
//         -object.position.x + radius * 1,
//         object.position.y + radius,
//         object.position.z + radius * 2
//     ); //相机自适应的位置

//     var lookPos = new THREE.Vector3(
//         center.x + object.position.x,
//         center.y + object.position.y,
//         center.z + object.position.z
//     ); //相机及控制器自适应的目标

//     camera.position.copy(cameraPos); //初始化场景时，相机自适应的位置
//     controls.target = lookPos; //初始化场景时，相机控制器的目标
//     camera.lookAt(lookPos); //初始化场景时，相机的目标,要在OrbitControls实例化之后
//     console.log(camera);
// };
// const setScaleToFitSize = obj => {
//     const box = new THREE.Box3.setFromObject(gltf.scene);
//     // boxHelper.geometry.computeBoundingBox();
//     // const box = boxHelper.geometry.boundingBox;
//     const maxDiameter = Math.max(
//         box.max.x - box.min.x,
//         box.max.y - box.min.y,
//         box.max.z - box.min.z
//     );
//     const scaleValue = camera.position.z / maxDiameter;
//     obj.scale.set(scaleValue, scaleValue, scaleValue);
// };
let canvasDom = ref(null);
let controls;
let width = window.innerWidth;
let height = window.innerHeight;
const animations = [];
const clock = new Clock();
// 设置场景
const scene = new THREE.Scene();

// 设置相机
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.01,
    10000
);
camera.position.set(0, 0, 100);
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
    const mixerUpdateDelta = clock.getDelta();
    animations.forEach(mixer => mixer.tick(mixerUpdateDelta));
    requestAnimationFrame(render);
};
function setupModel(data) {
    const model = data.scene.children[0];
    const clip = data.animations[0];
    const mixer = new AnimationMixer(model);
    const action = mixer.clipAction(clip);
    action.play();

    model.tick = delta => mixer.update(delta);
    return model;
}
// function setupModel(data) {
//     const model = data.scene.children[0];
//     const modelScene = data.scene;
//     return { model, modelScene };
// }

async function loadIronman() {
    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);
    const ironmanData = await loader.loadAsync('/ironman/ironman-dropkick.glb');
    // const ironmanData = await loader.loadAsync('/ironman/ironman-hippop.glb');
    // const ironmanData = await loader.loadAsync('/ironman/ironman-normal.glb');
    // const ironmanData = await loader.loadAsync('/ironman/ironman-tauting.glb');
    const ironman = setupModel(ironmanData);
    console.log(ironmanData);
    return ironman;
}
onMounted(async () => {
    canvasDom.value.appendChild(renderer.domElement);
    renderer.setClearColor('#000');
    scene.background = new THREE.Color('#eee');
    scene.environment = new THREE.Color('#eee');
    render();
    const allMesh = [];
    let r = 3000;
    const ironman = await loadIronman();
    // console.log(ironman);
    // ironScene.traverse(function (child) {
    //     console.log(child.name);
    // });
    // allMesh.forEach(child => {
    //     const toPosition = [
    //         Math.random() * r,
    //         (Math.random() * r) / 1.5,
    //         (Math.random() * r) / 2,
    //     ];
    //     gsap.to(child.position, {
    //         x: toPosition[0],
    //         y: toPosition[1],
    //         z: toPosition[2],
    //         duration: 1,
    //     });
    // });
    animations.push(ironman);
    setScale(ironman);

    // gsap.to(ironman.rotation, { y: Math.PI, duration: 10 });

    // 添加灯光
    const light1 = new THREE.DirectionalLight(0xffffff, 1);
    light1.position.set(0, 0, 10);
    scene.add(light1);
    const light2 = new THREE.DirectionalLight(0xffffff, 1);
    light2.position.set(0, 0, -10);
    scene.add(light2);
    const light3 = new THREE.DirectionalLight(0xffffff, 1);
    light3.position.set(10, 0, 0);
    scene.add(light3);
    const light4 = new THREE.DirectionalLight(0xffffff, 1);
    light4.position.set(-10, 0, 0);
    scene.add(light4);
    const light5 = new THREE.DirectionalLight(0xffffff, 1);
    light5.position.set(0, 10, 0);
    scene.add(light5);
    const light6 = new THREE.DirectionalLight(0xffffff, 0.3);
    light6.position.set(5, 10, 0);
    scene.add(light6);
    const light7 = new THREE.DirectionalLight(0xffffff, 0.3);
    light7.position.set(0, 10, 5);
    scene.add(light7);
    const light8 = new THREE.DirectionalLight(0xffffff, 0.3);
    light8.position.set(0, 10, -5);
    scene.add(light8);
    const light9 = new THREE.DirectionalLight(0xffffff, 0.3);
    light9.position.set(-5, 10, 0);
    scene.add(light9);

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
  