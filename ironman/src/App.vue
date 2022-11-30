

<template>
  <div class="canvas-container" ref="canvasDom">
    <drop-kick
      ironman_action="/ironman/ironman-taunt.glb"
      :width="width/2"
      :height="height/2"
      :isShow="tauntShow"
    ></drop-kick>
    <!-- <drop-kick
      ironman_action="/ironman/ironman-taunt.glb"
      :width="width/2"
      :height="height/2"
      :isShow="tauntShow"
    ></drop-kick>-->
    <drop-kick
      ironman_action="/ironman/ironman-hiphop.glb"
      :width="width/2"
      :height="height/2"
      :isShow="hippopShow"
    ></drop-kick>
    <drop-kick
      ironman_action="/ironman/ironman-dropkick.glb"
      :width="width/2"
      :height="height/2"
      scale="0.5"
      :isShow="dropKickShow"
    ></drop-kick>
    <drop-kick
      ironman_action="/ironman/ironman-normal.glb"
      :width="width/2"
      :height="height/2"
      scale="0.5"
      :isShow="normalShow"
    ></drop-kick>
  </div>
</template>
<script setup>
import { ElMessageBox, ElMessage } from 'element-plus';

import DropKick from './components/DropKick.vue';
import { onMounted, ref } from 'vue';
const width = window.innerWidth;
const height = window.innerHeight;
let tauntShow = ref(false);
let dropKickShow = ref(false);
let hippopShow = ref(false);
let normalShow = ref(false);
function sleep(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}
onMounted(async () => {
    await ElMessageBox.confirm('准备好迎接钢铁之舞了吗？', '钢铁侠劲舞团', {
        confirmButtonText: '开始',
        cancelButtonText: '拒绝',
        type: 'success',
    }).then(() => {
        ElMessage({
            message: '第一位钢铁侠上来就摆出了挑衅的动作，气势汹汹啊',
            duration: 1800,
            type: 'warning',
        });
        setTimeout(() => {
            tauntShow.value = true;
        }, 300);
    });
    await sleep(2000);
    ElMessage({
        message: '第二位钢铁侠画风骤变，跳起了小舞',
        duration: 2000,
        type: 'success',
    });
    setTimeout(() => {
        hippopShow.value = true;
    }, 300);
    await sleep(2000);
    ElMessage({
        message: '第三位钢铁侠直接来了个酷的，但禁止模仿啊，安全才是第一位',
        duration: 2000,
        type: 'info',
    });
    setTimeout(() => {
        dropKickShow.value = true;
    }, 300);
    await sleep(2000);
    ElMessage({
        message: '第四位钢铁侠怎么直接踢人了，不知道都是关注的爸爸们吗？',
        duration: 2000,
        type: 'error',
    });
    setTimeout(() => {
        normalShow.value = true;
    }, 300);
});
</script>
  <style scope>
* {
    margin: 0;
    padding: 0;
}
.canvas-container {
    display: flex;
    flex-wrap: wrap;
}
</style>
  