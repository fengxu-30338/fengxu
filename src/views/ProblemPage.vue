<template>
  <div calss="problempage">
    <div id="nav">
      {{title}}
    </div>
    <van-search v-model="kw" show-action placeholder="请输入搜索关键词" @search="startSearch()" @cancel="cancelSearch()"/>
    <problem class="question" ref="child"
        v-for="(item,index) in questionList.questions" :key="index"
        :index="index + 1" :title="item.problem" 
        :option_a="item.option_a" :option_b="item.option_b" 
        :option_c="item.option_c" :option_d="item.option_d"
        :answer="item.answer" :difficulty="item.difficulty">
    </problem>
    <div id="pagebox" v-show="isSuccess">
      <van-button type="primary" size="small" @click="changePage(-1)">上一页</van-button>
      <input type="number" placeholder="页数" v-model="page" @keypress.prevent.enter="getQuestion(type,page)">
      <van-button type="primary" size="small" @click="changePage(1)">下一页</van-button>
    </div>
    <div id="slider" v-show="slider.isShow">
        <div class="switchbox">
          <span>开启全部答案:</span>
          <br><br>
          <van-switch v-model="slider.chicked" size="15px" @input="showAllAnswer(slider.chicked)"/>
        </div>
        <br>
        <div class="btnbox">
          <van-button round type="info" size="mini" @click="scrollToFont()">到顶部</van-button>
          <br><br>
          <van-button round type="info" size="mini" @click="changePage(-1)">上一页</van-button>
          <br><br>
          <van-button round type="info" size="mini" @click="changePage(1)">下一页</van-button>
        </div>
    </div>
    <div id="rondslider" v-show="isSuccess"
         v-swipeleft=" (e) => showSlider(false)" 
         v-swiperight=" (e) => showSlider(true)"
         v-tap=" (e) => showSlider(!slider.isShow)">
      <span>&gt;&gt;</span>
    </div>
  </div>
</template>

<script>
import problem from '../components/Problem'
import axios from 'axios'
import Vue from 'vue';
import { Search } from 'vant';
import { Toast } from 'vant';
import { Switch } from 'vant';
import { Button } from 'vant';
import vueTouch from 'kim-vue-touch'

Vue.use(vueTouch)
Vue.use(Button);
Vue.use(Switch);
Vue.use(Toast);
Vue.use(Search);

export default {
    name:"ProblemPage",
    components:{
      problem
    },
    data(){
      return {
        title:'综合题库',
        type:this.$route.params.type,
        model:0, //model=0为看题模式，model=1为搜题模式
        page:1,
        questionList:'',
        kw:'',
        slider:{
          chicked:false,
          isShow:false
        },
        isSuccess:false
      }
    },
     beforeMount(){
      this.showTitle()
    },
    mounted(){
      this.getQuestion(this.type,this.page)
    },
    methods:{
      getQuestion(type,page){ //获取题库
        this.model = 0
        //console.log('看题模式')
        Toast.loading({
          message: '加载题库中...',
          forbidClick: true,
          duration: 500
        });
        axios.post('/api/query',"type="+type+"&page="+page).then(response => {
          let res = this.transferText(JSON.stringify(response.data))
          this.questionList = JSON.parse(res)
          if(this.questionList.result == false){
            this.isSuccess = false
            Toast(this.questionList.msg)
            }else{
              this.isSuccess = true
              window.scrollTo(0,0)
            }
          }).catch(error => {
            this.isSuccess = false
            Toast('页面加载失败!\n'+error)
          })
          this.slider.chicked = false
          this.showAllAnswer(false)
        },
        startSearch(){
          this.model = 1
          this.page = 1
          this.searchQuestion()
        },
        cancelSearch(){
          this.model = 0
          this.page = 1
          this.getQuestion(this.type,this.page)
        },
        searchQuestion(){ //搜索题库
          //console.log('搜题模式')
          Toast.loading({
            message: '查询题库中...',
            forbidClick: true,
            duration: 500
          });
          axios.post('/api/search',"kw="+this.kw+"&page="+this.page).then(response => {
            let res = this.transferText(JSON.stringify(response.data))
            this.questionList = JSON.parse(res)
            if(this.questionList.result == false){
              this.isSuccess = false
              Toast(this.questionList.msg)
             }else{
               this.isSuccess = true
               window.scrollTo(0,0)
             }
          }).catch(error => {
            this.isSuccess = false
            Toast('页面加载失败!\n'+error)
          })
          this.slider.chicked = false
          this.showAllAnswer(false)
        },
        changePage(step){  //换页step=1为下一页，step=-1为上一页
          this.page = parseInt(this.page)
          if(step == 1){
            this.page += 1
            if(this.model == 0){
              this.getQuestion(this.type,this.page)
            } else {
              this.searchQuestion()
            }
          } else {
            if(this.page > 1){
              this.page -= 1
              if(this.model == 0){
              this.getQuestion(this.type,this.page)
            } else {
              this.searchQuestion()
            }
            }else{
              Toast('已经到第一页了!')
            }
          }
        },
        scrollToFont(){
          window.scrollTo(0,0)
        },
        showAllAnswer(isShow){  //是否显示所有答案
          try {
            if(isShow){
            for(let i=0 ; i<this.$refs.child.length; i++){
            this.$refs.child[i].showAnswer()
            }
          }else{
            for(let i=0 ; i<this.$refs.child.length; i++){
            this.$refs.child[i].closeAnswer()
            }
          }
          } catch (error) {
            //题目可能还未加载出来!
          }
        },
        showSlider(value){ //打开或隐藏侧边栏
          this.slider.isShow = value
          if(value){
            document.querySelector('#rondslider').style.left='100px'
            document.querySelector('#rondslider span').innerHTML='&lt;&lt;'
          } else {
            document.querySelector('#rondslider').style.left='0px'
            document.querySelector('#rondslider span').innerHTML='&gt;&gt;'
          }
        },
      transferText(str) {
			  str = str.replace(/&lt;/g,'<')
				.replace(/&gt;/g,'>')
				.replace(/&amp;/g,'&')
				.replace(/&quot;/g,'"')
				.replace(/&#39/g,"'")
				.replace(/&nbsp;/g,' ')
			return str
		},
      showTitle(){
        switch(this.type){
          case '1': 
          this.title='C语言题库' 
          break
          case '2': 
          this.title='C++题库'
          break
          case '3': 
          this.title='Java题库'
          break
          case '4': 
          this.title='JavaScript题库'
          break
          case '5': 
          this.title='C#题库'
          break
          case 'J': 
          this.title='数据结构题库'
          break
          case 'K': 
          this.title='数据库原理题库'
          break
          case 'W': 
          this.title='网络题库'
          break
          case 'R': 
          this.title='软件工程题库'
          break
          case 'Z': 
          this.title='操作系统题库'
          break
          case 'C': 
          this.title='应用基础题库'
          break
          case 'D': 
          this.title='多媒体技术题库'
          break
          case 'Y': 
          this.title='硬件部分题库'
          break
          case 'H': 
          this.title='移动互联应用题库'
          break
          case 'S': 
          this.title='数据表示和计算题库'
          break
          case 'L': 
          this.title='离散数学题库'
          break
          case 'Q': 
          this.title='软件知识产权题库题库'
          break
          default: '综合题库'
        }
      }
    }
}
</script>

<style lang="less" scoped>
#nav {
  text-align: center;
  width: 100vw;
  height: 30px;
  line-height: 30px;
  border-style: 1px solid #ccc;
  border-radius: 5% 5% 0 0;
  position: relative;
}

.question  {
  margin-top: 10px !important;
}

#pagebox {
  margin-top: 10px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  > * {
    margin:0 20px;
  }
  input{
    outline: none;
    width:30px;
    text-align: center;
  }
}

#slider {
  position: fixed;
  left: 0;
  top: 50%;
  width: 100px;
  height: 200px;
  opacity: 0.5;
  margin-top: -50px;
  background-color: black;
  .switchbox {
    span {
      font-size: 5px;
      color: white;
    }
  }
}

#rondslider {
  position: fixed;
  left: 0;
  top: 50%;
  width: 28px;
  height: 50px;
  opacity: 0.5;
  margin-top: 20px;
  background-color: black;
  border-radius: 0 50% 50% 0;
  text-align: center;
  z-index: 5;
  span {
    font-size: 20px;
    color: #ccc;
    display: block;
    line-height: 50px;
  }
}

</style>
