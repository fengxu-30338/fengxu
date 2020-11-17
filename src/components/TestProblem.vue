<template>
    <div class="problem">
        <div id="sign"></div>
        <div id="question">
            <span class="index">{{index}}.</span>
            <span id="title">【{{difficulty}}】{{title}}</span>
        </div>
        <div id="options">
            <van-radio-group v-model="select" @change="selectChange" :disabled="disabled">
                <van-radio name="A" checked-color="#07c160">
                    <div class="option">
                        <span class="index">A.</span>
                        <span class="content">{{option_a}}</span>
                    </div>
                </van-radio>
                <van-radio name="B" checked-color="#07c160">
                    <div class="option">
                        <span class="index">B.</span>
                        <span class="content">{{option_b}}</span>
                    </div>
                </van-radio>
                <van-radio name="C" checked-color="#07c160">
                    <div class="option">
                        <span class="index">C.</span>
                        <span class="content">{{option_c}}</span>
                    </div>
                </van-radio>
                <van-radio name="D" checked-color="#07c160">
                    <div class="option">
                        <span class="index">D.</span>
                        <span class="content">{{option_d}}</span>
                    </div>
                </van-radio>
            </van-radio-group>
        </div>
        <div class="answer" v-show="isShowAnswer">
            <span v-if="isCurrent" class="current">答案正确</span>
            <span v-else class="fail">正确答案:{{currentAnswer}}</span>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import { RadioGroup, Radio} from 'vant';

Vue.use(Radio);
Vue.use(RadioGroup);

export default {
    props:['index','title','option_a','option_b','option_c','option_d','answer','difficulty'],
    data(){
        return {
            select : this.answer,
            disabled: false,
            isShowAnswer:false,
            isCurrent: false,
            currentAnswer: ''
        }
    },
    methods:{
        selectChange(answer){
            this.$emit('onChange',this.index,answer)
        },
        disableSelect(){
            this.disabled = true
        },
        verifyAnswer(answer){ //验证答案是否正确
            this.currentAnswer = answer
            if(answer == this.select){
                this.isCurrent = true
            } else {
                this.isCurrent = false
            }
            this.isShowAnswer = true
            return this.isCurrent
        }
    }
}
</script>

<style lang="less" scoped>
    .index {
        display: block;
           width: 40px;
           height: 15px;
           line-height: 15px;
           text-align: center;
    }

   .problem {
       margin: 0px 12px;
       background-color: #f7f8fa;
       position: relative;
       display: block;
       position: relative;
       box-shadow: 5px 5px 0 0 #eee;
   }
   #sign {
       width: 0px;
       height: 0px;
       border: 10px solid ;
       border-color: #99FF99 transparent  transparent #99FF99 ;
   }
   #question {
       display: block;
       width: 95%;
       height: auto;
       text-align: left;
       font: inherit;
       word-break:break-all;
       margin-top: -10px;
       margin-left: 10px;
       #title {
           margin: -15px 0 0 40px;
           display: block;
           text-align: left;
           line-height: 20px;
       }
   }
   #options {
       display: block;
       width: 90%;
       height: auto;
       text-align: left;
       word-break:break-all;
       margin:auto 15px;
       padding:10px 0 0 10px;
       font-size: 14px;
       :not(:first-child) {
           margin-top: 10px;
       }
       .content {
           margin: -15px 0 0 40px;
           display: block;
           text-align: left;
           line-height: 15px;
       }
   }
   .answer {
       width: 100%;
       height: auto;
       padding: 10px;
       text-align: left;
   }
   .current{
       color: green;
   }
   .fail{
       color: red;
   }
</style>