<template>
  <div id="login" class="Login_wrapper">
      <div class="Login_container">
          <div class="Login_img"><img src="../assets/logo.png" alt=""></div>
          <el-form label-width="0px" class="username" :model="LoginForm"
          :rules="LoginFormRules"
          ref="loginFormRef">
           <el-form-item prop="username">
           <el-input prefix-icon="iconfont icon-yonghu" v-model="LoginForm.username"></el-input>
            </el-form-item>
           <el-form-item prop="password">
           <el-input prefix-icon="iconfont icon-mima" v-model="LoginForm.password" type="password"></el-input>
            </el-form-item>
        <el-form-item class="button">
         <el-button type="primary" @click="login">登录</el-button>
           <el-button type="info" @click="resetLoginForm">重置</el-button>
         </el-form-item>
        </el-form>
      </div>
  </div>
</template>

<script>
export default {
    name:'login',
    data(){
        return{
            LoginForm:{
                username:"",
                password:""
            },
            LoginFormRules:{
                username:[
                    {required: true, message: '请输入用户名', trigger: 'blur'},
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                password:[
                    {required: true, message: '请输入用户密码', trigger: 'blur'},
                    { min: 6, max: 15, message: '长度在 6 到 15个字符', trigger: 'blur' }
                ]
            }
        }
    },
    methods:{
        resetLoginForm(){
            this.$refs.loginFormRef.resetFields()
        },
        login(){
            this.$refs.loginFormRef.validate(async valid=>{
                if(!valid) return
                const {data:res}=await this.$http.post("login",this.LoginForm);
                if(res.meta.status!==200) return this.$message.error("登录失败")
                this.$message.success("登录成功");
                window.sessionStorage.setItem("token",res.data.token);
                this.$router.push("/home");
            })
        }
    }
}
</script>

<style lang="less" scope>
.Login_wrapper{
    height: 100%;
    background-color: skyblue;
}
.Login_container{
    height: 300px;
    width: 450px;
    background-color: #fff;
    position: relative;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    border-radius:10px;
}
.Login_img{
    height: 130px;
    width: 130px;
    border-radius: 50%;
    border:1px solid gray;
    padding: 10px;
    box-sizing: border-box;
    position: relative;
    left: 50%;
    transform: translate(-50%,-50%);
    background-color: white;
    img{
        height: 100%;
        width: 100%;
        border-radius: 50%;
        border:1px solid gray;
        box-sizing: border-box;
        background: rgb(216, 204, 204);
    }
}
.username{
    padding: 0px 20px;
    position: relative;
    bottom: 20px;
}
.button{
    width: 200px;
    height: 40px;
    margin-left:260px;
}
</style>
