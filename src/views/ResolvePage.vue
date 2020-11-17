<template>
  <div class="resolve">
    <div class="title">请选择答题相关选项</div>
    <div class="form">
      <van-cell-group>
        <van-field v-model="username" label="昵称" placeholder="请输入昵称" maxlength="10" />
      </van-cell-group>
      <van-cell-group>
        <van-field readonly clickable  label="试题类型" :value="values.value1" 
            placeholder="选择试题类型(必选)"   @click="openPicker(1)" />
      </van-cell-group>
      <van-cell-group>
        <van-field readonly clickable  label="试题类型" :value="values.value2" 
            placeholder="选择试题类型(可选)"   @click="openPicker(2)" />
      </van-cell-group>
      <van-cell-group>
        <van-field readonly clickable  label="试题类型" :value="values.value3" 
            placeholder="选择试题类型(可选)"   @click="openPicker(3)" />
      </van-cell-group>
      <van-cell-group>
        <van-field readonly clickable  label="试题总数" :value="num" type="digit"
            placeholder="选择试题数量"   @click="openPicker(4)" />
      </van-cell-group>
      <van-cell-group id="upload">
        <span>上传成绩</span>
        <van-switch id="switch" v-model="isUpload" size="20px" active-color="#07c160" inactive-color="#ee0a24" />
      </van-cell-group>
      <van-cell-group>
        <van-field readonly rows="6"  label="测试须知" type="textarea" value="试题类型，第一空必填，其他两空选填，服务器会从您选择的内容中随机选择相应数量的相应题型，上传成绩如果选择，服务器将会将您的成绩保存，并与其他人比较。考试时间为30分钟。"/>
      </van-cell-group>
      <van-button id="submit" type="primary" block @click="startTest()">开始测试</van-button>
      <div class="more">
        <a href="/resolve/showExam">查看所有答题记录</a>
      </div>
      <van-popup v-model="showPicker" round position="bottom">
        <van-picker show-toolbar :columns="columns"
          @cancel="showPicker = false"   @confirm="onConfirm" />
      </van-popup>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { NavBar,Picker,Field,Popup,CellGroup,Toast,Dialog} from "vant";
import axios from "axios";

Vue.use(NavBar);
Vue.use(Picker);
Vue.use(Field);
Vue.use(Popup);
Vue.use(CellGroup);
Vue.use(Toast);
Vue.use(Dialog);

export default {
    beforeCreate(){
      this.$store.state.active = 1
    },
  data() {
    return {
      username:'',
      type1: '',
      type2: '',
      type3: '',
      num: '',
      isUpload: false,
      showPicker: false,
      mode:0,
      values:{value1:'',value2:'',value3:''},
      types1: ['C语言', 'C++', 'Java', 'JavaScript', 'C#', '数据结构', '软件工程', '操作系统','数据库原理','网络','应用基础','多媒体技术','硬件部分','移动互联应用','软件知识产权','综合题库'],
      types2: ['C语言', 'C++', 'Java', 'JavaScript', 'C#', '数据结构', '软件工程', '操作系统','数据库原理','网络','应用基础','多媒体技术','硬件部分','移动互联应用','软件知识产权'],
      columns:[],
      nums:[]
    };
  },
  methods:{
      startTest(){
          if(this.username==''){
            Toast('用户昵称不能为空!')
            return;
          }
          if(this.transferType(this.type1) == ''){
            Toast('您必选试题类型未填写或类型不正确!')
            return;
          }
          if(this.num == ''){
            Toast('您未选择题目数量!')
            return;
          }
          if(parseInt(this.num)<=0){
            Toast('试题总数需大于0')
            return;
          }
          let types = this.type1
          if(this.type2 != '') types += ','+this.type2
          if(this.type3 != '') types += ','+this.type3
          //开始测试
          axios.post("/api/test",`username=${this.username}&types=${types}&num=${this.num}&isUpload=${this.isUpload}`).then(response => {
            if(response.data.result){
               //跳转到答题网站
               Toast.loading({
                message: '加载考试信息中...',
                forbidClick: true,
                duration: 500
              });
              this.$router.push({path:'/resolve/test'})
            } else {
              if(response.data.code == 103){
                Dialog.confirm({
                  message: '您已经考试考试了是否跳转到上次的答题页面?',
                }).then(() => {
                    Toast.loading({
                      message: '加载考试信息中...',
                      forbidClick: true,
                      duration: 500
                    });
                    this.$router.push({path:'/resolve/test'})
                  }).catch(() => {
                    // on cancel
                  });
              } else {
                Toast(response.data.msg)
              }
            }
          }).catch(error => {
            Toast('开始答题失败!\n'+error)
          })
      },
      getCount(){//发送获取题目数量请求
        this.nums = []
        let types = this.type1
        if(this.type2 != '') types += ','+this.type2
        if(this.type3 != '') types += ','+this.type3
          axios.post("/api/count","types="+types).then(response => {
            if(response.data.result){
              for(let i = 20 ; i<=response.data.max ; i+=20){
                  this.nums.push(''+i)
                }
            }else{
                Toast('题库该类型题目不足您无法进行考试!')
              }
            }).catch(error => {
              Toast('页面加载失败!\n'+error)
            })
      },
      openPicker(mode){
        this.mode = mode
        if(mode == 1){
          this.columns = this.types1
        } else if(mode == 2 || mode == 3){
          this.columns = this.types2
        } else if(mode == 4){
          if(this.transferType(this.type1) == ''){
            Toast('您必选试题类型未填写或类型不正确!')
            return;
          }
          this.getCount()
          this.columns = this.nums
        }
        this.showPicker = true
      },
      onConfirm(value) {
        this.num = '';
        let [beforeType1,beforeType2,beforeType3] = [this.type1,this.type2,this.type3]
        let [beforeValue1,beforeValue2,beforeValue3] = [this.values.value1,this.values.value2,this.values.value3]
        if(this.mode == 1){
          this.values.value1 = value
          this.type1 = this.transferType(value)
        } else if(this.mode == 2){
          this.values.value2 = value
          this.type2 = this.transferType(value)
        } else if(this.mode == 3 ){
          this.values.value3 = value
          this.type3 = this.transferType(value)
        } else if(this.mode == 4){
          this.num = value
        }
        if(this.mode == 1 || this.mode == 2 || this.mode == 3){
            if(this.transferType(this.type1) == ''){
              Toast('您必选试题类型未填写或类型不正确!')
              this.type1 = beforeType1; this.values.value1 = beforeValue1
              this.type2 = beforeType2; this.values.value2 = beforeValue2
              this.type3 = beforeType3; this.values.value3 = beforeValue3
              return;
            }
            if(this.type1==this.type2 || this.type1==this.type3 || (this.type2 == this.type3 && this.type2!='')){
              Toast('不能选择相同类型的试题!')
              this.type1 = beforeType1; this.values.value1 = beforeValue1
              this.type2 = beforeType2; this.values.value2 = beforeValue2
              this.type3 = beforeType3; this.values.value3 = beforeValue3
              return;
            }
            let types = this.type1
            if(this.type2 != '') types += ','+this.type2
            if(this.type3 != '') types += ','+this.type3
          }
        this.showPicker = false;
      },
      transferType(str){
        if(str=='C语言'){return '1'}
        if(str=='1'){return 'C语言'}
        if(str=='C++'){return '2'}
        if(str=='2'){return 'C++'}
        if(str=='Java'){return '3'}
        if(str=='3'){return 'Java'}
        if(str=='JavaScript'){return '4'}
        if(str==='4'){return 'JavaScript'}
        if(str=='C#'){return '5'}
        if(str=='5'){return 'C#'}
        if(str=='数据结构'){return 'J'}
        if(str=='J'){return '数据结构'}
        if(str=='数据库原理'){return 'K'}
        if(str=='K'){return '数据库原理'}
        if(str=='网络'){return 'W'}
        if(str=='W'){return '网络'}
        if(str=='软件工程'){return 'R'}
        if(str=='R'){return '软件工程'}
        if(str=='操作系统'){return 'Z'}
        if(str=='Z'){return '操作系统'}
        if(str=='应用基础'){return 'C'}
        if(str=='C'){return '应用基础'}
        if(str=='多媒体技术'){return 'D'}
        if(str=='D'){return '多媒体技术'}
        if(str=='硬件部分'){return 'Y'}
        if(str=='Y'){return '硬件部分'}
        if(str=='移动互联应用'){return 'H'}
        if(str=='H'){return '移动互联应用'}
        if(str=='数据表示和计算'){return 'S'}
        if(str=='S'){return '数据表示和计算'}
        if(str=='离散数学'){return 'L'}
        if(str=='L'){return '离散数学'}
        if(str=='软件知识产权'){return 'Q'}
        if(str=='Q'){return '软件知识产权'}
        if(str=='综合题库'){return 'all'}
        if(str=='all'){return '综合题库'}
        return ''
      }
  }
};
</script>

<style scoped>
.resolve {
  position: relative;
}
.title {
  text-align: center;
  width: 100%;
  margin: 2px;
  padding: 5px;
}
#upload {
  position: relative;
}
#upload span{
  display: block;
  font-size: 14px;
  color: #646566;
  width: 64px;
  padding:12px;
}
#upload #switch{
  position: absolute;
  top: 12px;
  left: 115px;
}
</style>