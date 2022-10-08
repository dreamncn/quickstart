<template>
  <div style="text-align: left;padding: 20px;">
    <el-button type="primary" @click="update" size="large" >更新面板数据</el-button>
    <el-form :model="formInline" style="padding-top: 20px;">
      <el-form-item label="显示风格" >
        <el-radio-group v-model="formInline.style" >
          <el-radio label="card" border>卡片</el-radio>
          <el-radio label="border-card" border>边框卡片</el-radio>
          <el-radio label="" border>默认</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="显示位置">
        <el-radio-group v-model="formInline.location">
          <el-radio label="top" border>上</el-radio>
          <el-radio label="bottom" border>下</el-radio>
          <el-radio label="left" border>左</el-radio>
          <el-radio label="right" border>右</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue'
const emit = defineEmits(["setIndex"]);

function update() {
  emit("setIndex",1)
}
function save() {
  utools.db.remove("setting")
  utools.db.put({_id:"setting",data:JSON.stringify(formInline.value)})

  emit("setIndex",0)
}

let formInline = ref({style:"",location:"top"})
let d = utools.db.get("setting")

if(d!==null)
  formInline.value = JSON.parse(d.data);


</script>

<style scoped>

</style>
