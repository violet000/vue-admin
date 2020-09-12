<template>
    <div id="login">
         <div class="login-header">
             <ul class="menu-tab">
                 <li v-bind:class="{'current':item.isActive}" v-for="item in menuTab" :key="item.id" @click="clickMenuTab(item)">{{ item.txt }}</li>
             </ul>
            <el-form class="login-form" :model="ruleForm" :rules="rules" ref="ruleForm"   size="medium">
                <el-form-item prop="email">
                    <label>邮箱地址</label>
                    <el-input v-model="ruleForm.email" ></el-input>
                </el-form-item>
              
                <el-form-item  prop="password">
                     <label>密码</label>
                    <el-input v-model="ruleForm.password" minlength="6" maxlength="20"></el-input>
                </el-form-item>  

                 <el-form-item  prop="passwords" v-if="model == 'register'">
                     <label>确认密码</label>
                    <el-input v-model="ruleForm.passwords" minlength="6" maxlength="20"></el-input>
                </el-form-item>  
                    
                <el-form-item  prop="code">
                    <label>验证码</label>
                    <el-row :gutter="24">
                        <el-col :span="15"><div  class="grid-content bg-purple"> <el-input v-model="ruleForm.code" auto-complete="off"></el-input></div></el-col>
                        <el-col :span="9"><div class="grid-content bg-purple"><el-button type="success" class="identifying" @click="getCode()">获取验证码</el-button></div></el-col>
                    </el-row>      
                </el-form-item> 

                <div class="sumBtn">
                    <el-button type="primary" @click="submitForm('ruleForm')" v-if="model == 'login'">登录</el-button>
                    <el-button type="danger" @click="submitForm('ruleForm')" v-if="model == 'register'">注册</el-button>
                </div>          
            </el-form>
         </div>

    </div>
</template>

<script>
import axios from 'axios';
import { GetSms } from '@/api/login'
import { reactive } from '@vue/composition-api';
export default {
    name:'login',
    setup(props, context) {
        //这里面放置生命周期，data数据，自定义函数等
        var  menuTab = reactive([
                {txt:'登录',isActive:true,type:'login'},
                {txt:'注册',isActive:false,type:'register'}
            ])
        console.log(menuTab)
    },
    data(){
        //邮箱验证
        var validateEmail = (rule, value, callback) => {
            let reg = new RegExp("^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-z]{2,}$");
            if (value === '') {
                callback(new Error('请输入邮箱!'));
            } else if(!reg.test(value)) {
                callback(new Error("请输入正确的邮箱格式!"))
            }else{
                callback();
            }
        };
        //密码验证
         var validatePassword = (rule, value, callback) => {
            let reg = new RegExp("^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$");
            this.box = value;
            if (value === '') {
                callback(new Error('请输入密码!'));
            } else if(!reg.test(value)) {
                callback(new Error("请输入大于6位数小于20位数的密码!"))
            }else{
                callback();
            }
        };
        //密码再次验证
         var validatePasswords = (rule, value, callback) => {
            let reg = new RegExp("^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$");
            if (value === '') {
                callback(new Error('请再次输入密码!'));
            } else if(value != this.box) {
                callback(new Error("密码不匹配,请重新输入!"))
            }else{
                callback();
            }
        };
        //验证码验证
         var validatePassword2 = (rule, value, callback) => {
            let reg = new RegExp("^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{4}$");
            if (value === '') {
                callback(new Error('请输入密码!'));
            } else if(!reg.test(value)) {
                callback(new Error("请输入正确的验证码格式!"))
            }else{
                callback();
            }
        };
        return {
            model:'login',
            menuTab:[
                 {txt:'登录',isActive:true,type:'login'},
                {txt:'注册',isActive:false,type:'register'}
            ],
            ruleForm: {
                password:'',
                code:'',
                email:'',
                passwords:'',
                box:''
            },
            rules: {
                password: [
                    { validator: validatePassword, trigger: 'blur' }
                ],
                passwords:[
                     { validator: validatePasswords, trigger: 'blur' }
                ],
                code:[
                    { validator: validatePassword2, trigger: 'blur' }
                ],
                email:[
                     { validator: validateEmail, trigger: 'blur' }
                ]
            }
        }
    },
    created(){

    },
    mounted(){
       
    },
    methods:{
        // 切换tab栏事件
        clickMenuTab:function(item){
          this.menuTab.forEach(element => {
              element.isActive = false;
          });
            item.isActive = true;
            this.model = item.type;
        },
        // 提交表单事件
        submitForm(formName) {         
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    alert('submit!');
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // 获取验证码事件
        getCode:function(){
            console.log(this.ruleForm.email)
            GetSms({username:this.ruleForm.email}).then(response => {
                console.log(response);
            }).catch(error => {
                console.log(error)
            });
        }
    },
    props:{

    },
    watch:{

    }
}
</script>

<style lang="scss" scoped>
*{
    margin: 0px;
    padding: 0px;
}
#login {
  height: 100vh;
  background-color: #344a5f;
}
.login-header {
    width: 330px;
    margin: auto;
}
.menu-tab {
    text-align: center;
    li{
        display: inline-block;
        width: 88px;
        margin-top: 200px;
        line-height: 36px;
        font-size: 14px;
        color: #fff;
        border-radius: 2px;
        cursor: pointer;
    }
    .current {
        background-color:rgba($color: #000000, $alpha: 0.1);

    }
}
.login-form {
    margin-top: 29px;
    label {
        display: inline-block;
        margin-top: 10px;
        margin-bottom: 3px;
        font-size: 14px;
        color: #fff;
    }
}
.sumBtn {
  margin-top: 20px;
  .el-button{
      display: block;
      width: 100%;
      height: 40px;
  }
}
.identifying{
    width: 100%;
}
</style>