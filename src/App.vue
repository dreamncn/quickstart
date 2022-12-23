<script setup>
import MainPage from './components/MainPage.vue'
import EmptyPage from './components/EmptyPage.vue'
import {ref} from "vue";
import SearchPage from "./components/SearchPage.vue";
import SettingPage from "./components/SettingPage.vue";
import {ElMessage} from "element-plus";

let index = ref(0)

function setIndex(i) {
  index.value = i;
}
let textData = ref("");

utools.onPluginEnter(({code, type, payload, optional}) => {
  if(code.startsWith("quick_link:")){
    openLink(code.replace("quick_link:",""));
  }else if(code==="quicksearch"){
    setIndex(2);
  }else if(code==="quicksetting"){
    setIndex(3);
  }else{
    setIndex(0);
  }

utools.removeSubInput();
utools.setSubInput(({ text }) => {
  textData.value = text;
  if(text === "~"){
    setIndex(3);
    return;
  }

  if(text === "!"||text === "！"){
    let d = utools.db.get("setting")
    if(d!==null){
      ElMessage('正在刷新数据')
      addApps(JSON.parse(d.data).dir);
      setIndex(0);
      ElMessage({
        message: '数据刷新成功',
        type: 'success',
      });
      return;
    }
  }

  if(index.value!==2)setIndex(2);

  }, '输入"~"进入设置。输入"!"刷新数据。输入其他内容进行搜索。')
})


</script>

<template>
  <MainPage v-if="index===0" @setIndex="setIndex"  />
  <EmptyPage v-else-if="index===1" @setIndex="setIndex" />
  <SearchPage v-else-if="index===2" @setIndex="setIndex" :text="textData"/>
  <SettingPage v-else-if="index===3" @setIndex="setIndex"/>
</template>



<style>
body{
  display: block;
}
#app{
  padding: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 100%;
  width: 100%;
}
</style>
