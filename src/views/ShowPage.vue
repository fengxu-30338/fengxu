<template>
    <div class="show">
        <van-nav-bar title="历史考试记录"/>
        <div class="titleBar">
            <div class="title">昵称</div>
            <div class="title">分数</div>
        </div>
        <van-list v-model="loading"   :finished="finished"
            finished-text="没有更多了"  @load="onLoad" >
            <div class="centent" v-for="(item,index) in list" :key="index"> 
                <div class="name">{{item.username}}</div>
                <div class="score">{{item.score}}</div>
            </div>
        </van-list>
    </div>
</template>

<script>
import axios from 'axios'
import Vue from 'vue';
import { List,Cell,NavBar,Toast } from 'vant';

Vue.use(List);
Vue.use(Cell)
Vue.use(NavBar)
Vue.use(Toast)

export default {
    beforeCreate(){
        this.$store.state.active = 1
    },
    data(){
        return {
            loading:false,
            finished:false,
            list:[],
            page:1
        }
    },
    methods:{
        onLoad(){
            axios.post('/api/lookExam','page='+this.page).then(response => {
                if(response.data.result){
                    this.page += 1
                    this.loading = false
                    for(let i=0 ;i<response.data.data.length;i++){
                        this.list.push(response.data.data[i])
                    }
                } else {
                    if(response.data.code == 111){
                        this.finished = true
                    }
                    Toast(response.data.msg)
                }
            }).catch(error => {
                Toast('获取数据失败!\n'+error)
            })
        }
    }
}
</script>

<style lang="less" scoped>
.titleBar{
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    .title{
        width: 50%;
        text-align: center;
    }
}
.centent{
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    border-top: 1px solid #eee;
    div{
        width: 50%;
        height: 40px;
        line-height: 40px;
        text-align: center;
    }
}
</style>