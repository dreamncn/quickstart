<script setup>

import {onMounted, watch} from "vue";

const emit = defineEmits(["setIndex"]);

const props = defineProps({
  text:String
})

let tableData = [];

onMounted(()=>{
  let data = [];
  try{
    data = JSON.parse(utools.db.get("quick_list").data);
  }catch (e) {
    console.log("错误",e)
  }
  if(data.length===0) {
    emit("setIndex",1)
    return
  }
  watch(
      () => props.text,
      (newVal, oldVal) => {
        if(newVal===""){
          emit("setIndex",0)
        }else{
          tableData = [];
          for (const dataKey in data) {
            //   console.log(dataKey)
            for (let i = 0; i < data[dataKey].length; i++) {
              //console.log(data[dataKey][i])
              if(data[dataKey][i]["name"].toLowerCase().indexOf(newVal.toString().toLowerCase())!==-1){
                tableData.push({
                  name:data[dataKey][i]["name"],
                  sort:dataKey,
                  link:data[dataKey][i]["link"],
                  icon:utools.db.get(data[dataKey][i]["link"]).data
                });
              }
            }
          }
        }
      }
  )


})

function cellClick(row, column, cell, event) {
  utools.shellOpenPath(row.link)
}
</script>
<template>

    <el-table  :data="tableData" stripe style="width: 100%
" :show-header="false" @cell-click="cellClick">
      <el-table-column label="Thumbnail" width="100" prop="icon"  align="center">
        <template  #default="scope">
          <img :src="scope.row.icon" style="width: 50px;height: 50px">
        </template>
      </el-table-column>
      <el-table-column prop="name" >
        <template #default="scope">
          <h2 style="margin: 0">{{scope.row.name}}</h2><h3 style="margin: 0">{{scope.row.sort}}</h3>
        </template>
      </el-table-column>
    </el-table>

</template>



<style scoped>
.demo-tabs{
  width: 100%;
}
</style>
