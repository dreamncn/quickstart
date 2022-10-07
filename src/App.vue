<script setup>
import MainPage from './components/MainPage.vue'
import EmptyPage from './components/EmptyPage.vue'
import {ref} from "vue";
import SearchPage from "./components/SearchPage.vue";
import SettingPage from "./components/SettingPage.vue";

let index = ref(0)

function setIndex(i) {
  index.value = i;
}
let textData = ref("");

utools.onPluginEnter(({code, type, payload, optional}) => {

  console.log('用户进入插件应用', code, type, payload,optional)

  if(code==="quicksearch"){
    setIndex(2);
  }else if(code==="quicksetting"){
    setIndex(3);
  }else{
    setIndex(0);
  }

utools.removeSubInput();
utools.setSubInput(({ text }) => {
  textData.value = text;
  if(index.value!==2)setIndex(2)
  }, '请输入搜索内容进行检索')
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
