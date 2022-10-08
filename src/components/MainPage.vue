<script setup>

import { ref } from 'vue'
import Icon from "./Icon.vue";
const emit = defineEmits(["setIndex"]);

let data = {},sort = {};

function refreshData() {
  try{
    sort = JSON.parse(utools.db.get("quick_sort").data);
  }catch (e) {
    console.log("错误",e)
    emit("setIndex",1)
  }
  try{
    data = JSON.parse(utools.db.get("quick_list").data);
  }catch (e) {
    console.log("错误",e)
    emit("setIndex",1)
  }
}
refreshData();
if(Object.keys(data).length === 0){
  emit("setIndex",1)
}


const activeName = ref(sort[0])

let formInline = ref({style:"",location:"top"})

let d = utools.db.get("setting")
if(d!==null)formInline.value = JSON.parse(d.data);


</script>
<template>

  <el-tabs  v-model="activeName" class="demo-tabs" :type="formInline.style" :tab-position="formInline.location" >
    <el-tab-pane v-for="name in sort" :label="name" :name="name">
      <el-scrollbar style="text-align: left;">
        <Icon v-for="d in data[name]" :name="d.name" :link = "d.link" ></Icon>
      </el-scrollbar>
    </el-tab-pane>
  </el-tabs>




</template>



<style scoped>
.el-tabs--left .el-tabs__nav-wrap.is-left>.el-tabs__nav-next{
  right: 0 !important;
}
.el-tabs--left .el-tabs__nav-wrap.is-left>.el-tabs__nav-prev{
  right: 0 !important;
}
.el-tabs--left .el-tabs__nav-wrap.is-right>.el-tabs__nav-next{
  left: 0 !important;
}
.el-tabs--left .el-tabs__nav-wrap.is-right>.el-tabs__nav-prev{
  left: 0 !important;
}
</style>
