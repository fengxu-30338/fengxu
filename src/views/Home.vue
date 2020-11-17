<template>
  <div class="home">
    <div id="nav">
      信息技术题库
    </div>
    <div class="notice">
      <van-notice-bar  left-icon="smile-comment-o" :text="notice"/>
    </div>
    <van-grid :column-num="3">
      <van-grid-item :icon="imgList.img1" text="数据结构" @click="goQuestion('J')"/>
      <van-grid-item :icon="imgList.img2" text="软件工程" @click="goQuestion('R')" />
      <van-grid-item :icon="imgList.img3" text="操作系统" @click="goQuestion('Z')" />
      <van-grid-item :icon="imgList.img4" text="数据库原理" @click="goQuestion('K')" />
      <van-grid-item :icon="imgList.img5" text="C语言" @click="goQuestion('1')" />
      <van-grid-item :icon="imgList.img6" text="C++" @click="goQuestion('2')" />
      <van-grid-item :icon="imgList.img7" text="Java" @click="goQuestion('3')" />
      <van-grid-item :icon="imgList.img8" text="JavaScript" @click="goQuestion('4')" />
      <van-grid-item :icon="imgList.img9" text="C#" @click="goQuestion('5')" />
      <van-grid-item :icon="imgList.img10" text="网络" @click="goQuestion('W')" />
      <van-grid-item :icon="imgList.img11" text="应用基础" @click="goQuestion('C')" />
      <van-grid-item :icon="imgList.img12" text="多媒体技术" @click="goQuestion('D')" />
      <van-grid-item :icon="imgList.img13" text="硬件部分" @click="goQuestion('Y')" />
      <van-grid-item :icon="imgList.img14" text="移动互联网应用" @click="goQuestion('H')" />
      <van-grid-item :icon="imgList.img15" text="数据表示和计算" @click="goQuestion('S')" />
      <van-grid-item :icon="imgList.img16" text="离散数学" @click="goQuestion('L')" />
      <van-grid-item :icon="imgList.img17" text="软件知识产权" @click="goQuestion('Q')" />
      <van-grid-item :icon="imgList.img18" text="综合题库" @click="goQuestion('all')" />
    </van-grid>
  </div>
</template>

<script>
import Vue from 'vue';
import axios from 'axios';
import { Grid, GridItem,NoticeBar,Toast } from 'vant';

Vue.use(NoticeBar);
Vue.use(Grid);
Vue.use(GridItem);

export default {
  name: "Home",
  beforeMount(){
    this.$store.state.showBar = true
    this.getNotice()
  },
  data() {
    return {
      imgList:{
        img1:require('../assets/img1.png'),
        img2:require('../assets/img2.png'),
        img3:require('../assets/img3.png'),
        img4:require('../assets/img4.png'),
        img5:require('../assets/img5.png'),
        img6:require('../assets/img6.png'),
        img7:require('../assets/img7.png'),
        img8:require('../assets/img8.png'),
        img9:require('../assets/img9.png'),
        img10:require('../assets/img10.png'),
        img11:require('../assets/img11.png'),
        img12:require('../assets/img12.png'),
        img13:require('../assets/img13.png'),
        img14:require('../assets/img14.png'),
        img15:require('../assets/img15.png'),
        img16:require('../assets/img16.png'),
        img17:require('../assets/img17.png'),
        img18:require('../assets/img18.png')
      },
      notice:'欢迎各位小伙伴使用本题库哦!'
    };
  },
  methods:{
    goQuestion(type){
      this.$router.push({
        path:'/problem/'+type
      })
    },
    getNotice(){
      axios.post('/api/notice').then(response => {
        this.notice = response.data.text
      }).catch(error => {
          Toast('信息获取失败!\n'+error)
      })
    }
  }

};
</script>

<style scoped lang="less">
#nav {
  text-align: center;
  width: 100vw;
  height: 30px;
  line-height: 30px;
  border-style: 1px solid #ccc;
  border-radius: 5% 5% 0 0;
}
.bottom{
	width: 100%;
	height: 40px;
	line-height: 40px;
	background-color: #eeeeee;
	text-align: center;
	color: #B2B2B2;
}
</style>