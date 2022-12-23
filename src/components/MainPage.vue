<script setup>

import { ref } from 'vue'
import Icon from "./Icon.vue";
const emit = defineEmits(["setIndex"]);

let data = {},sort = {};

function refreshData() {
  try{
    sort = JSON.parse(utools.db.get("quick_sort").data);
  }catch (e) {
   // console.log("错误",e)
    emit("setIndex",1)
  }
  try{
    data = JSON.parse(utools.db.get("quick_list").data);
  }catch (e) {
    //console.log("错误",e)
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
<template style="max-height: 100%">

  <el-tabs  v-model="activeName" :type="formInline.style" :tab-position="formInline.location" >
    <el-tab-pane v-for="name in sort" :label="name" :name="name">
      <el-scrollbar style="text-align: left;" height="100vh">
        <Icon v-for="d in data[name]" :name="d.name" :link = "d.link" ></Icon>
      </el-scrollbar>
    </el-tab-pane>
  </el-tabs>




</template>



<style scoped>
.el-tabs{
  height: 100%!important;
}
.el-tabs__content{
  max-height: 100%!important;
  overflow: auto!important;
}
.el-tabs__nav-prev,.el-tabs__nav-next{
  display: none!important;
}
.el-tabs--left .el-tabs__nav-wrap.is-left.is-scrollable, .el-tabs--left .el-tabs__nav-wrap.is-right.is-scrollable, .el-tabs--right .el-tabs__nav-wrap.is-left.is-scrollable, .el-tabs--right .el-tabs__nav-wrap.is-right.is-scrollable {
  padding: 0!important;
}
</style>
