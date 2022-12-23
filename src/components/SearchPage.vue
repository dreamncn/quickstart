<script setup>

import {onMounted, watch} from "vue";

const emit = defineEmits(["setIndex"]);
const props = defineProps({
  text:String
})

let tableData = [];
let data = [];
try{
  data = JSON.parse(utools.db.get("quick_list").data);
}catch (e) {

}

function search(newVal) {
  if(newVal===""){
    emit("setIndex",0)
  }else{
    tableData = [];
    for (const dataKey in data) {
      for (const item of data[dataKey]) {
        //console.log(data[dataKey][i])
        if(item.name.toLowerCase().indexOf(newVal.toString().toLowerCase())!==-1){
          tableData.push({
            name:item.name,
            sort:dataKey,
            link:item.link,
            icon:utools.db.get(item.link).data
          });
        }
      }
    }
  }
}
search(props.text);
onMounted(()=>{
  if(data.length===0) {
    emit("setIndex",1)
    return
  }

  watch(
      () => props.text,
      (newVal, oldVal) => {
       if(newVal===oldVal&&newVal!=="")return;
       search(newVal);
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



<style>
@media (prefers-color-scheme: dark) {
  .el-table tr{
    color: #d7d7d7!important;
  }
  .el-table tr:nth-child(odd){
    background: #222;
  }
  .el-table__row--striped td{
    background: #333!important;
  }
  .el-table--enable-row-hover .el-table__body tr:hover>td.el-table__cell  {
    background-color: #444!important;
  }
}
</style>
