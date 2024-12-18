// 定义 Car 类
import * as THREE from 'three';
import gsap from 'gsap';
export default class Car {
  constructor(model, scene, camera, controls, color, name) {
    this.model = model;
    this.scene = scene;
    this.camera = camera;
    this.controls = controls;
    this.color = color;
    this.name = name

    // 初始化方法
    this.init();
  }

  init() {
    // 将汽车模型添加到场景中
    this.scene.add(this.model);
    this.model.traverse((child) => {

      if (child.isMesh) {
        // 获取网格的材质
        const material = child.material;
        // 设置新的颜色，这里以红色为例（0xff0000是红色的十六进制表示）
        material.color.set(this.color);

      }
    });

    // 设置轨道控制器的目标为汽车模型
    // this.controls.target = this.model.position;
  }
  changeColor(color) {
    this.color = color;
    this.model.traverse((child) => {
      if (child.isMesh && (!this.name || (this.name && child.name === this.name))) {
        // 获取网格的材质
        console.log(child.name)
        const material = child.material;
        // 设置新的颜色，这里以红色为例（0xff0000是红色的十六进制表示）
        material.color.set(this.color);
      }
    });// 更新颜色
  }

  changeRoughness(roughness) {
    this.model.traverse((child) => {
      if (child.isMesh && (!this.name || (this.name && child.name === this.name))) {
        const material = child.material;
        if (material instanceof THREE.MeshStandardMaterial || material instanceof THREE.MeshPhysicalMaterial) {
          material.roughness = roughness;
        }
      }
    })
  }

  changeMetalness(metalness) {
    this.model.traverse((child) => {
      if (child.isMesh && (!this.name || (this.name && child.name === this.name))) {
        const material = child.material;
        if (material instanceof THREE.MeshStandardMaterial || material instanceof THREE.MeshPhysicalMaterial) {
          material.metalness = metalness;
        }
      }
    })
  }

  openCarDoor() {
    this.model.traverse((child) => {
      if (child.isMesh && child.name === 'Object_52') {
        gsap.to(child.rotation, {
          x: -Math.PI / 4,
          y: -Math.PI / 4,
          duration: 1,
          ease: 'power2.out'
        });
      }
    })
  }
}
