<template>
<div :class="icon_cls" @click="click">
  <img :src="icon"  alt="" />
  <span>{{name}}</span>
</div>
</template>

<script setup>

const props = defineProps({
  link:String,
  name:String,
  icon_item:String
});

let icon = utools.db.get(props.link).data;
let icon_cls = "icon-main "+props.icon_item;
function click() {
  utools.shellOpenPath(props.link)
}

</script>

<style scoped>
.icon-main{
  width: 60px;
  height: 60px;
  text-align: center;
  padding: 16px;
  display: inline-block;
  cursor: pointer;
  position: relative;
}
.icon-main.list{
  height: 50px;
  padding: 16px;
  display: block;
  cursor: pointer;
  position: relative;
  width: calc(100% - 50px);
  text-align: left;
}

.icon-main>img{
  width: 50px;
  height: 50px;
  display: inline-block;
  vertical-align: middle;
  align-items: center;
  justify-content: center;
  line-height: 30px;
  margin: 0 auto;
  border-radius: 8px;
}
.icon-main>span{
  font-size: 12px;
  color: #222;
  line-height: 22px;
  text-align: center;
  margin: 0;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: 50px;
  display: block;
}
.icon-main.list > span{
  display: inline-block;
  font-size: 22px;
  vertical-align:middle;
  width: calc(100% - 100px);
  text-align: left;
}
.icon-main.list > img{
  margin-right: 20px;
}
.icon-main.list{
  border-radius: 8px;
}
.icon-main.list:nth-child(odd){
  background: #fcfcfc;

}
.icon-main.list:nth-child(even){

}
.icon-main:hover {
  border-radius: 8px;
  background-color: #f5f5f5!important;
}
</style>
