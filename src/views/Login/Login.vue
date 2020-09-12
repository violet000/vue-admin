<template>
  <div id="login">
    <div class="login-wrap">
      <ul class="menu-tab">
        <li v-for="item in menuTab" :key="item.id" :class="{'current': item.current}" @click="toggleMenu(item)">
          {{ item.txt }}
        </li>
      </ul>
      <el-form :model="ruleForm" status-icon :rules="rules" ref="loginForm" class="login-form" size="medium">
        <el-form-item prop="username" class="item-from">
          <label for="username">邮箱</label>
          <el-input id="username" type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item prop="password" class="item-from">
          <label for="password">密码</label>
          <el-input id="password" type="password" v-model="ruleForm.password" autocomplete="off" minlength="6" maxlength="20"></el-input>
        </el-form-item>

        <el-form-item prop="passwords" class="item-from" v-show="model === 'register'">
          <label>重复密码</label>
          <el-input type="password" v-model="ruleForm.passwords" autocomplete="off" minlength="6" maxlength="20"></el-input>
        </el-form-item>

        <el-form-item prop="code" class="item-from">
          <label>验证码</label>
          <el-row :gutter="10">
            <el-col :span="15">
              <el-input v-model="ruleForm.code" minlength="6" maxlength="6"></el-input>
            </el-col>
            <el-col :span="9">
              <el-button type="success" class="block" @click="getSms()" :disabled="codeButtonStatus.status">{{ codeButtonStatus.text }}</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" class="login-btn block" :disabled="loginButtonStatus" @click="submitForm('loginForm')" v-if="model == 'login'">登录</el-button>
            <el-button type="danger" class="login-btn block" :disabled="loginButtonStatus" @click="submitForm('loginForm')" v-if="model == 'register'">注册</el-button>  
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { Message } from 'element-ui';
import { GetSms ,Register,Login} from "@/api/login";
import { reactive, ref, isRef, toRefs, onMounted, watch, onUnmounted } from '@vue/composition-api';
import { stripscript, validatePass, validateEmail, validateVCode } from '@/utils/validate';
export default {
    name: 'login',
    setup(props, { refs, root }){
      // 验证用户名
      let validateUsername = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入用户名'));
        } else if(validateEmail(value)){
          callback(new Error('用户名格式有误'));
        } else {
          callback(); //true
        }
      };
      // 验证密码
      let validatePassword = (rule, value, callback) => {
        // 过滤后的数据
        ruleForm.password = stripscript(value);
        value = ruleForm.password;
        if (value === '') {
          callback(new Error("请输入密码"));
        } else if (validatePass(value)) {
          callback(new Error("密码为6至20位数字+字母"));
        } else {
          callback();
        }
      };
      // 验证重复密码
      let validatePasswords = (rule, value, callback) => {
        // 如果模块值为login, 直接通过
        if(model.value === 'login') { callback(); }
        // 过滤后的数据
        ruleForm.passwords = stripscript(value);
        value = ruleForm.passwords;
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value != ruleForm.password) {
          callback(new Error('重复密码不正确'));
        } else {
          callback();
        }
      };
      // 验证验证码
      let validateCode = (rule, value, callback) => {
        if (value === '') {
          return callback(new Error('请输入验证码'));
        }else if(validateVCode(value)){
          return callback(new Error('验证码格式有误'));
        }else{
          callback();
        }
      };
      /*
       * 声明数据
       */
      // 这里面放置data数据、生命周期、自定义的函数
      const menuTab = reactive([
        { txt: '登录', current: true, type: 'login' },
        { txt: '注册', current: false, type: 'register' }
      ]);
      // 模块值 
      const model = ref('login');
      // 登录按钮禁用状态
      const loginButtonStatus = ref(true);
      // 验证码按钮状态
      const codeButtonStatus = reactive(
        {
          status: false,
          text: '获取验证码'
        }
      );
      // 倒计时
      const timer = ref(null);
      // 表单绑定数据
      const ruleForm = reactive({
        username: '',
        password: '',
        passwords: '',
        code: ''
      });
      // 表单的验证
      const rules = reactive({
        username: [
          { validator: validateUsername, trigger: 'blur' }
        ],
        password: [
          { validator: validatePassword, trigger: 'blur' }
        ],
        passwords: [
          { validator: validatePasswords, trigger: 'blur' }
        ],
        code: [
          { validator: validateCode, trigger: 'blur' }
        ]
      });
      /**
       * 声明函数
       */
      // 切换模块
      const toggleMenu = (data => {
        menuTab.forEach((elem, index) => {
          elem.current = false;
        });
        // 高光
        data.current = true;
        // 修改模块值
        model.value = data.type;
        resetFromData();
         clearCountDown();
      });
      // 清除表单数据
      const resetFromData = (() => {
        // 重置表单
        refs.loginForm.resetFields();  
      })
      // 更新按钮状态
      const updataButtonStatus = ((params) => {
        codeButtonStatus.status = params.status;
        codeButtonStatus.text = params.text;
      })
      const getSms = (() => {
        // 进行提示
        if(ruleForm.username == '' ) {
          root.$message.error('邮箱不能为空！！');
          return false;
        }
        if(validateEmail(ruleForm.username)) {
          root.$message.error('邮箱格式有误，请重新输入！！');
          return false;
        }
        let requestData = {
          username: ruleForm.username, 
          module: model.value
        }
        // 修改获取验证按钮状态
        updataButtonStatus({
          status: true,
          text: '发送中'
        })
        // 延时多长时间
        GetSms(requestData).then(response => {
          let data = response.data;
          root.$message({
            message: data.message,
            type: 'success',
            dangerouslyUseHTMLString: true
          });
          // 启用登录或注册按钮
          loginButtonStatus.value = false;
          // 调定时器，倒计时
          countDown(60);
        }).catch(error => {
          // 启用登录或注册按钮
          loginButtonStatus.value = false;
          updataButtonStatus({
            status: false,
            text: '再次获取'
          })
          console.log(error);
        })
      })
      /**
       * 提交表单
       */
      const submitForm = (formName => {
        refs[formName].validate((valid) => {
          // 表单验证通过
          if (valid) {
            model.value === 'login' ? login() : register();
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      }) 
      // 登录接口
       const login = (() => {
        let questData = {
            username: ruleForm.username,
            password: ruleForm.password,
            code: ruleForm.code
          }
         Login(questData).then(response => {
           console.log('登录结果');
           console.log(response)
          clearCountDown()
        }).catch(error => {});
      })
     // 注册接口
      const Register = (()=>{
         let questData = {
             username: ruleForm.username,
             password: ruleForm.password,
             code: ruleForm.code
           }
           Register(questData).then( response =>{
             let data = response.data;
             root.$message({
               message:data.message,
               type:'success'
             })
             //注册成功的话就自动跳转到登录页面
             toggleMenu(menuTab[0]);
             clearCountDown()
              }).catch(error => {
             console.log(error);
           });
      })
      const countDown = ((number) => {
        // 判断定时器是否存在，存在则清除
        if(timer.value) { clearInterval(timer.value); }
        let time = number
        timer.value = setInterval(() => {
          time--;
          if(time === 0) {
            clearInterval(timer.value)
            updataButtonStatus({
              status: false,
              text: '再次获取'
            })
          }else{
            codeButtonStatus.text = `请在${time}秒重新发送`   
          }
        }, 1000)
      })
      /**
       * 清除倒计时
       */
      const clearCountDown = (() => {
        // 还原验证码按钮默认状态
        updataButtonStatus({
          status: false,
          text: '获取验证码'
        })
        // 清除倒计时
        clearInterval(timer.value)
      })

      onUnmounted(() => {
        clearInterval(timer.value);
      })

      return {
        menuTab,
        model,
        loginButtonStatus,
        codeButtonStatus,
        ruleForm,
        rules,
        timer,
        toggleMenu,
        submitForm,
        getSms,
        countDown,
        clearCountDown
      }
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
.login-wrap {
  width: 330px;
  margin: auto;
}
.menu-tab {
  text-align: center;
  li {
    display: inline-block;
    width: 88px;
    line-height: 36px;
    font-size: 14px;
    color: #fff;
    margin-top: 200px;
    border-radius: 2px;
    cursor: pointer;
  }
  .current {
    background-color: rgba(0, 0, 0, .1);
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
  .item-from { margin-bottom: 13px; }
  .block {
    display: block;
    width: 100%;
  }
  .login-btn { margin-top: 19px; }
}
</style>