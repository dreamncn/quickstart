<script setup>

import { ref } from 'vue'
import Icon from "./Icon.vue";
const emit = defineEmits(["setIndex"]);

let data = {},sort = {};

try{
  data = JSON.parse(utools.db.get("quick_list").data);
}catch (e) {
  emit("setIndex",3);
}
let keys = Object.keys(data);
if(keys.length === 0){
  emit("setIndex",3)
}


const activeName = ref(keys[0])

let formInline = ref({style:"",location:"left",dir:"",icon:"icon",utools:true})

let d = utools.db.get("setting")
if(d!==null)formInline.value = JSON.parse(d.data);


</script>
<template style="max-height: 100%">

  <el-tabs  v-model="activeName" :type="formInline.style" :tab-position="formInline.location" >
    <el-tab-pane v-for="name in keys" :label="name" :name="name">
      <Icon v-for="d in data[name]" :name="d.name" :link = "d.link" :icon_item="formInline.icon"></Icon>
    </el-tab-pane>
  </el-tabs>




</template>



<style>
.el-tabs{
  height: 100%!important;
}
.el-tabs__nav{
  overflow: auto!important;
  height: 100%!important;
}
.el-tabs--border-card{
  border: unset!important;
}
.el-tabs__content{
  max-height: 100%!important;
  box-sizing: border-box;
  overflow-x: hidden;
  overflow-y: auto!important;
}
.el-tabs__nav-prev,.el-tabs__nav-next{
  display: none!important;
}
.el-tabs--left .el-tabs__nav-wrap.is-left.is-scrollable, .el-tabs--left .el-tabs__nav-wrap.is-right.is-scrollable, .el-tabs--right .el-tabs__nav-wrap.is-left.is-scrollable, .el-tabs--right .el-tabs__nav-wrap.is-right.is-scrollable {
  padding: 0!important;
}
</style>
