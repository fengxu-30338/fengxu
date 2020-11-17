<template>
    <div class="test">
        <van-nav-bar  title="考试界面" fixed>
            <template #left>
                <span v-show="isShowScore">分数:</span>
                <span v-show="isShowScore" style="color: red">{{score}}</span>
            </template>
            <template #right>
                <span>倒计时:</span>
                <van-count-down ref="countDown" :time="time" @finish="finishExam" />
            </template>
        </van-nav-bar>
        <div class="content">
            <test-problem class="question" ref="child"
                v-for="(item,index) in questionList" :key="index" :sort="index"
                :index="index + 1" :title="item.problem" 
                :option_a="item.option_a" :option_b="item.option_b" 
                :option_c="item.option_c" :option_d="item.option_d"
                :answer="item.answer" :difficulty="item.difficulty"
                @onChange="selectChange">
            </test-problem>
        </div>
        <van-button id="submit" type="primary" size="small" @click="finishExam" v-show="isSuccess">提 交 答 案</van-button>
        <div class="slider" v-show="isShowSlider">
            <div class="small" @click="scrollToQuestionByIndex(index)"
             v-for="(item,index) in smallAnswer" :key="index">
                <span>{{index + 1}}</span>
                <span :sort="index">{{item}}</span>
            </div>
        </div>
        <div class="roundSlider" v-tap="e => showSlider(!isShowSlider)">
            <span>&gt;&gt;</span>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import vueTouch from 'kim-vue-touch'
import Vue from 'vue';
import { Toast,NavBar,CountDown,Button} from 'vant'
import testProblem from '../components/TestProblem'

Vue.use(Toast);
Vue.use(NavBar);
Vue.use(CountDown);
Vue.use(Button);

export default {
    beforeCreate(){
        this.$store.state.active = 1
    },
    beforeMount(){
        this.startTest()
    },
    data(){
        return {
            isSuccess: false,
            questionList: '',
            smallAnswer:[],
            time: 30*60*1000,
            score:0,
            isShowScore:false,
            isShowSlider:false
        }
    },
    methods:{
        startTest(){ //请求初始化参数
            axios.post('/api/startTest').then(response => {
                if(response.data.result == false){
                    this.isSuccess = false
                    Toast(response.data.msg)
                    this.$router.push({path : '/resolve'})
                } else {
                    this.isSuccess = true
                    let res = this.transferText(JSON.stringify(response.data))
                    res = JSON.parse(res)
                    this.questionList = res.questions
                    for(let i=0 ; i<this.questionList.length; i++){
                        this.smallAnswer.push(this.questionList[i].answer)
                    }
                    this.time = res.time
                    this.$refs.countDown.start()
                }
            }).catch(error => {
                this.isSuccess = false
                Toast('请求考试失败!\n'+error)
                this.$router.push({path : '/resolve'})
            })
        },
        selectChange(index,answer){ //考试选项改变事件
            this.smallAnswer.splice(index - 1,1,answer)
            axios.post('/api/existAnswer',"index="+(index - 1)+"&answer="+answer)
                .then(response => {
                    if(response.data.result == true){
                        this.time = response.data.time
                    }else{
                        Toast(response.data.msg)
                    }
                }).catch(error => {
                    Toast('服务器连接失败!\n'+error)
                })
        },
        finishExam(){ //结束测试
            axios.post('/api/endTest').then(response => {
                document.querySelector('#submit').setAttribute("disabled","disabled")
                let curNum = 0
                for(let i = 0; i < this.$refs.child.length; i++){
                    if(this.$refs.child[i].verifyAnswer(response.data[i])){
                        curNum += 1
                    }else{
                        document.querySelector(`.small span[sort="${i}"]`).style.backgroundColor = "red"
                    }
                    this.$refs.child[i].disableSelect()
                }
                this.score = (curNum*100)/this.$refs.child.length
                Toast('您的分数为:'+this.score+"分")
                this.isShowScore = true
                this.$refs.countDown.pause();
                window.scrollTo(0,0)
            }).catch(error => {
                Toast('提交错误,服务器连接失败!\n'+error)
            })
        },
        scrollToQuestionByIndex(index){
            let top = document.querySelector(`.question[sort='${index}']`).offsetTop
            window.scrollTo(0,top)
        },
        showSlider(value){
            this.isShowSlider = value
            if(value){
                document.querySelector('.roundSlider').style.left='80px'
                document.querySelector('.roundSlider span').innerHTML='&lt;&lt;'
            } else {
                document.querySelector('.roundSlider').style.left='0px'
                document.querySelector('.roundSlider span').innerHTML='&gt;&gt;'
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
		}
    },
    components:{
        testProblem
    }
}
</script>

<style scoped lang="less">
.content {
    margin-top: 46px;
}
#submit {
     margin: 10px;
     width: 90%;
}
.question  {
  margin-top: 10px !important;
}
.slider{
    position: fixed;
    left: 0;
    top: 50%;
    margin-top: -200px;
    height: 400px;
    width: 80px;
    background-color: black;
    opacity: 0.5;
    overflow:auto;
    display: flex;
    align-items: center;
    flex-direction: column;
    .small {
        width: 90%;
        height: 40px;
        line-height: 40px;
        margin: 5px;
        text-align: center;
        display: block;
        
        span{
            display: block;
            width: 50%;
            height: 40px;
            line-height: 40px;
            color: white;
        }
        :nth-child(1){
            background-color: teal;
        }
        :nth-child(2){
            background-color: green;
            margin-left: 50%;
            margin-top: -40px;
        }
    }
}
.roundSlider{
  position: fixed;
  left: 0;
  top: 50%;
  width: 28px;
  height: 50px;
  opacity: 0.5;
  margin-top: -20px;
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