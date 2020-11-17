<template>
  <div id="app">
    <router-view id="rv" />
    <div id="place" v-show="$store.state.showBar"></div>
    <div id="buttomNav" v-show="$store.state.showBar">
      <van-tabbar v-model="$store.state.active" >
        <van-tabbar-item :icon="img1" @click="jumpPage('/')">信息题库</van-tabbar-item>
        <van-tabbar-item :icon="img2" @click="jumpPage('/resolve')">模拟测试</van-tabbar-item>
      </van-tabbar>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { Tabbar, TabbarItem } from "vant";

Vue.use(Tabbar);
Vue.use(TabbarItem);

export default {
  data(){
    return {
      img1:require('./assets/main1.png'),
      img2:require('./assets/main2.png')
    }
  },
  methods:{
    jumpPage(path){
      if(this.$route.fullPath != path){
          this.$router.push({path:path})
      }
    }
  }
};
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  position: relative;
}
#place{
  width: 100%;
  height: 50px;
  display: block;
}
</style>
