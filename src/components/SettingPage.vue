<template>
  <div style="text-align: left;padding: 20px;">

    <el-form :model="formInline" style="padding-top: 20px;" size="large">
      <el-form-item label="显示风格" >
        <el-radio-group v-model="formInline.style" >
          <el-radio label="card" border>卡片</el-radio>
          <el-radio label="border-card" border>边框卡片</el-radio>
          <el-radio label="" border>默认</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="导航位置">
        <el-radio-group v-model="formInline.location">
          <el-radio label="left" border>左</el-radio>
          <el-radio label="right" border>右</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="图标显示">
        <el-radio-group v-model="formInline.icon">
          <el-radio label="list" border>列表显示</el-radio>
          <el-radio label="icon" border>仅显示图标</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="在UTools中搜索">
        <el-switch v-model="formInline.utools" />
      </el-form-item>

      <el-form-item label="数据文件夹" >
        <el-col :span="20">
          <el-input v-model="formInline.dir" disabled placeholder="请选择文件夹" />
        </el-col>
        <el-col :span="4">
        <el-button type="primary" @click="update" style="margin-left: 10px">重新选择</el-button>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {ElMessage} from "element-plus";
const emit = defineEmits(["setIndex"]);

function update() {
  const path = selectDir();
  if(path!==null){
    formInline.value.dir = path;
  }
}
function save() {
  ElMessage('正在保存')
  utools.db.remove("setting")
  utools.db.put({_id:"setting",data:JSON.stringify(formInline.value)})
  addApps(formInline.value.dir);
  ElMessage({
    message: '数据刷新成功',
    type: 'success',
  })
  emit("setIndex",0)
}

let formInline = ref({style:"",location:"left",dir:"",icon:"icon",utools:true})
let d = utools.db.get("setting")
if(d!==null)
  formInline.value = JSON.parse(d.data);


</script>

<style>
@media (prefers-color-scheme: dark) {
  .el-input__wrapper{
    background: #292929!important;
  }
}
</style>
