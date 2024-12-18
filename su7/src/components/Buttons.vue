<template>
  <div>
    <button
      v-for="(color, index) in colors"
      :key="color.name"
      :style="{
        backgroundColor: color.color,
        left: index * 100 + 'px',
        border: isSelectedColor(color.color) ? '2px solid #007bff' : 'none',
      }"
      @click="changeCarColor(color.color)"
    >
      {{ color.name }}
    </button>
    <button
      v-for="(metalness, index) in metalnesses"
      :key="metalness.name"
      :style="{
        backgroundColor: metalness.color,
        left: index * 100 + 'px',
        bottom: '100px',
        border: isSelectedMetalness(metalness.value)
          ? '2px solid #007bff'
          : 'none',
      }"
      @click="changeCarMetalness(metalness.value)"
    >
      {{ metalness.name }}
    </button>
    <button
      v-for="(roughness, index) in roughnesses"
      :key="roughness.name"
      :style="{
        backgroundColor: roughness.color,
        left: index * 100 + 'px',
        bottom: '200px',
        border: isSelectedRoughness(roughness.value)
          ? '2px solid #007bff'
          : 'none',
      }"
      @click="changeCarRoughness(roughness.value)"
    >
      {{ roughness.name }}
    </button>
    <button
      @click="viewFromInsideHandle"
      :style="{
        left: 100 + 'px',
        bottom: '300px',
      }"
    >
      从内部看
    </button>
    <button
      @click="viewFromOutsideHandle"
      :style="{
        left: 200 + 'px',
        bottom: '300px',
      }"
    >
      从外部看
    </button>
    <button
      @click="openCarDoor"
      :style="{
        left: 0 + 'px',
        bottom: '300px',
      }"
    >
      打开车门
    </button>
    
  </div>
</template>

<script>
export default {
  data() {
    return {
      cameraPosition: { x: 0, y: 0, z: 0 }, // 相机初始位置
      cameraLookAt: { x: 0, y: 0, z: -1 }, // 相机初始看向的方向
      viewFromInside: false, // 是否从内部看
      viewFromOutside: false, // 是否从外部看
      selectedColor: null,
      selectedMetalness: null,
      selectedRoughness: null,
      colors: [
        {
          name: "土豪金",
          color: "#ff9900",
          isSelected: true,
        },
        {
          name: "传奇黑",
          color: "#343a40",
          isSelected: false,
        },
        {
          name: "海蓝",
          color: "#409EFF",
          isSelected: false,
        },
        {
          name: "玫瑰紫",
          color: "#6600ff",
          isSelected: false,
        },
        {
          name: "银灰色",
          color: "#DCDFE6",
          isSelected: false,
        },
      ], // 定义颜色列表
      carColor: "土豪金", // 初始颜色
      car: null,
      metalnesses: [
        {
          name: "低金属度",
          value: 0.2,
          isSelected: true,
        },
        {
          name: "中金属度",
          value: 0.5,
          isSelected: false,
        },
        {
          name: "高金属度",
          value: 0.8,
          isSelected: false,
        },
      ],
      roughnesses: [
        {
          name: "低粗糙度",
          value: 0.2,
          isSelected: true,
        },
        {
          name: "中粗糙度",
          value: 0.5,
          isSelected: false,
        },
        {
          name: "高粗糙度",
          value: 0.8,
          isSelected: false,
        },
      ],
    };
  },
  methods: {
    changeCarColor(color) {
      this.selectedColor = color;
      this.carColor = color;
      this.$emit("colorChange", color)
    },
    changeCarMetalness(metalness) {
      this.selectedMetalness = metalness;
      this.$emit('metalnessChange', metalness)
      
    },
    changeCarRoughness(roughness) {
      this.selectedRoughness = roughness;
      this.$emit('roughnessChange', roughness)
    },
    isSelectedColor(color) {
      return this.selectedColor === color;
    },
    isSelectedMetalness(metalness) {
      return this.selectedMetalness === metalness;
    },
    isSelectedRoughness(roughness) {
      return this.selectedRoughness === roughness;
    },
    viewFromInsideHandle() {
      this.viewFromInside = true;
      this.viewFromOutside = false;
      this.$emit('viewFromInside')
    },
    viewFromOutsideHandle() {
      this.viewFromInside = false;
      this.viewFromOutside = true;
      this.$emit('viewFromOutside')
    },
    openCarDoor() {
      this.$emit('openCarDoor')
    }
  }
};
</script>

<style scoped>
button {
  position: fixed;
  bottom: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}
</style>


