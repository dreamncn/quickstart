<template>
  <div>
    <el-empty>
      <el-button type="primary" size="large" round="round" @click="add"  v-loading.fullscreen.lock="fullscreenLoading">添加数据</el-button>
    </el-empty>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const emit = defineEmits(["setIndex"]);
const fullscreenLoading = ref(false)
utools.db.remove("quick_list")
utools.db.remove("quick_sort")
function add(){
  //添加数据
  //emit("setIndex",2)
  const result = utools.showOpenDialog({
    filters: [],
    properties: ['openDirectory']
  })
  if(result===undefined)return;
  const path = result[0];
  fullscreenLoading.value = true
  const list = transferDirs(path)
  console.log(list)
  let sort = {};
  Object.keys(list).forEach(function (value, index, array) {
    sort[index]=value
  })
  utools.db.put({
    //存储的时候自动排序
    _id:"quick_list",data:JSON.stringify(list)
  })
  utools.db.put({
    //存储的时候自动排序
    _id:"quick_sort",data:JSON.stringify(sort)
  })
  fullscreenLoading.value = false;
  emit("setIndex",0)
}
</script>

<style scoped>

</style>
