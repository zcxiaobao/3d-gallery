<template>
  <div class="app-container">
    <Car class="half-screen" modelPath="su7.glb" canvasName="su7" ref="su7" name='Object_18' />
    <Car2
      class="half-screen"
      modelPath="2022_porsche_taycan_cross_turismo.glb"
      canvasName="taycan"
      ref="taycan"
      name='Body_Textures_Body_1_0'
    />
    <Buttons
      @colorChange="colorChange"
      @metalnessChange="metalnessChange"
      @roughnessChange="roughnessChange"
      @viewFromInside="viewFromInside"
      @viewFromOutside="viewFromOutside"
      @openCarDoor='openCarDoor'
    />
  </div>
</template>

<script>
import Car from "./components/Car.vue";
import Car2 from "./components/Car2.vue";
import Buttons from "./components/Buttons.vue";

export default {
  name: "App",
  components: {
    Car,
    Car2,
    Buttons,
  },
  methods: {
    colorChange(color) {
      this.$refs.su7.car.changeColor(color);
      this.$refs.taycan.car.changeColor(color);
    },
    metalnessChange(metalness) {
      this.$refs.su7.car.changeMetalness(metalness);
      this.$refs.taycan.car.changeMetalness(metalness);
    },
    roughnessChange(roughness) {
      this.$refs.su7.car.changeRoughness(roughness);
      this.$refs.taycan.car.changeRoughness(roughness);
    },
    viewFromInside() {
      this.$refs.su7.viewFromInside();
      this.$refs.taycan.viewFromInside();
    },
    viewFromOutside() {
      this.$refs.su7.viewFromOutside();
      this.$refs.taycan.viewFromOutside();
    },
    openCarDoor() {
      this.$refs.su7.car.openCarDoor();
    }
  },
};
</script>

<style scoped>
.app-container {
  width: 100vw;
  display: flex;
  height: 100vh;
}

.half-screen {
  flex: 1;
}
</style>
