<template>
<div class="icon-main" @click="click">
  <img :src="icon"  alt="" />
  <span>{{name}}</span>
</div>
</template>

<script setup>

const props = defineProps({
  link:String,
  name:String
});

let icon = utools.db.get(props.link).data;

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
.icon-main:hover {
  border-radius: 8px;
  background-color: #f5f5f5
}
</style>
