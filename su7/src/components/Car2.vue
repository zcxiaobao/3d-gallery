<template>
  <div class="car-container">
    <div :ref="canvasName" class="canvas-container"></div>
  </div>
</template>

<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import Car from "../model/Car";
let scene, camera, controls, renderer, cameraHelper, marker;
export default {
  name: "Car",
  props: {
    modelPath: {
      type: String,
      required: true,
    },
    canvasName: {
      type: String,
    },
    name: {
      type: String
    }
  },
  data() {
    return {
      car: null
    };
  },
  mounted() {
    this.initThree();
    this.loadModel();
    // window.addEventListener("resize", this.handleWindowResize);
  },

  methods: {
     createBackground() {
      // 创建背景网格
      const geometry = new THREE.PlaneGeometry(100, 100);

      // 使用 MeshPhysicalMaterial 实现金属效果
      const material = new THREE.MeshPhysicalMaterial({
        color: 0xcccccc, // 起始颜色：浅灰色
        metalness: 0.5, // 金属度
        roughness: 0.2, // 粗糙度
        envMapIntensity: 1.0, // 环境贴图强度
      });

      // 加载环境贴图
      // const loader = new THREE.CubeTextureLoader();
      // const envMap = loader.load([
      //   'path_to_positive_x.jpg',
      //   'path_to_negative_x.jpg',
      //   'path_to_positive_y.jpg',
      //   'path_to_negative_y.jpg',
      //   'path_to_positive_z.jpg',
      //   'path_to_negative_z.jpg',
      // ]);

      // 将环境贴图应用到材质上
      // material.envMap = envMap;

      const plane = new THREE.Mesh(geometry, material);
      plane.rotation.x = -Math.PI / 2;
      scene.add(plane);

      // 增加环境光的强度
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.5); // 增加到1.5
      scene.add(ambientLight);

      // 调整光源位置和强度
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
      directionalLight.position.set(1, 1, 1);
      scene.add(directionalLight);

      const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
      directionalLight2.position.set(-1, -1, -1);
      scene.add(directionalLight2);

      const directionalLight3 = new THREE.DirectionalLight(0xffffff, 0.5);
      directionalLight3.position.set(-1, 1, -1);
      scene.add(directionalLight3);

      const directionalLight4 = new THREE.DirectionalLight(0xffffff, 0.5);
      directionalLight4.position.set(1, -1, 1);
      scene.add(directionalLight4);
    },

    initThree() {
      const width = window.innerWidth / 2;
      const height = window.innerHeight;

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
      camera.position.set(-3, 3, 3);

      // const markerGeometry = new THREE.SphereGeometry(0.1, 16, 16);
      // const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      // marker = new THREE.Mesh(markerGeometry, markerMaterial);
      // // 将标记物体的位置设置为相机的位置
      // marker.position.copy(camera.position);
      // // 将标记物体添加到场景
      // scene.add(marker);

      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(window.devicePixelRatio);

      // 创建坐标辅助线
      // const axesHelper = new THREE.AxesHelper(5);
      // scene.add(axesHelper);

      this.$refs[this.canvasName].appendChild(renderer.domElement);

      controls = new OrbitControls(camera, renderer.domElement);

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(1, 1, 1);
      scene.add(directionalLight);

      const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight2.position.set(-1, -1, -1);
      scene.add(directionalLight2);

      const directionalLight3 = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight3.position.set(-1, 1, -1);
      scene.add(directionalLight3);

      const directionalLight4 = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight4.position.set(1, -1, 1);
      scene.add(directionalLight4);

      // 创建相机位置指示器
      // cameraHelper = new THREE.CameraHelper(camera);
      // const material = cameraHelper.material;
      // cameraHelper.visible = true;
      // material.opacity = 0.7;
      // material.transparent = true;
      // scene.add(cameraHelper);

      this.createBackground();

      const animate = () => {
        requestAnimationFrame(animate);
        // cameraHelper.update();
        renderer.render(scene, camera);
      };

      animate();

      window.addEventListener("resize", () => {
        const width = window.innerWidth / 2;
        const height = window.innerHeight;

        camera.aspect = width / height;

        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
      });
    },
    loadModel() {
      this.loader = new GLTFLoader();
      this.loader.load(this.modelPath, (gltf) => {
        this.car = new Car(gltf.scene, scene, camera, controls, this.carColor, this.name); // 传递初始颜色

        // this.model = gltf.scene;
        // scene.add(this.model);
      });
    },
    viewFromInside() {
      // 设置相机位置到汽车内部
      camera.position.set(0.2, 0.5, 0.4);
      // 设置主驾驶视角目标点，假设看向汽车前方中心位置，比如(0.5, 0, 0.8)
      const targetPoint = new THREE.Vector3(0.2, 0.5, 0.8);
      camera.lookAt(targetPoint);
    }
  },
  beforeDestroy() {
    renderer.dispose();
    // window.removeEventListener("resize", this.handleWindowResize);
  },
  // handleWindowResize() {
  //   console.log(1111)
  //   const width = window.innerWidth / 2;
  //   const height = window.innerHeight;

  //   camera.aspect = width / height;
  //   camera.updateProjectionMatrix();

  //   renderer.setSize(width, height);
  // },
};
</script>

<style scoped>
.car-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.canvas-container {
  width: 100%;
  height: 100%;
}
</style>
