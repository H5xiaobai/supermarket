<template>
    <div class="login">
        <div class="login-wrap">
            <!-- 标题 -->
             <h3 class="title"><span class="el-icon-s-custom"></span>永辉超市管理系统-登录</h3>
            <!-- 表单 -->
            <el-form :model="loginForm"
                     status-icon
                     :rules="rules"
                      ref="loginForm"
                      label-width="100px"
                      class="demo-ruleForm"
            >

            <el-form-item label="账户" prop="account">
                <el-input type="text" v-model="loginForm.account" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="密码" prop="password">
                <el-input type="password" v-model="loginForm.password" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="确认密码" prop="checkPass">
                <el-input type="password" v-model="loginForm.checkPass" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="submitForm()">登录</el-button>
                <el-button @click="resetForm()">重置</el-button>
            </el-form-item>
            </el-form>


        </div>
    </div>
</template>

<script>
//引入工具函数
import {pwdReg} from '@/utils/res.js'
//引入api
import {loginCheck} from '@/api/login'
//引入对本地存储的操作函数
import local from '@/utils/local'
    export default {
        data(){
            //密码
             let checkPwd=(rule,value,callback)=>{
                 var len=value.length;
                 if(value===''){
                     callback(new Error('密码不能为空'));//非空验证
                 }else if(len<3 || len>6){
                     callback(new Error('密码在3~6位之间'))//长度验证
                 }else if(!pwdReg(value)){
                      callback(new Error('只可以输入字母和数字'))//正则
                 }else{
                     // 确认密码不为空 触发一致性验证
                     if(this.loginForm.checkPass!==""){
                         this.$refs.loginForm.validateField('checkPass')// 触发确认密码的一致性验证
                     }
                     callback();//通过
                 }
             }
            //确认密码
            let confirmPwd=(rule,value,callback)=>{
                 if(value===""){
                     callback(new Error('请再次输入密码'))
                 }else if(value!==this.loginForm.password){
                     callback(new Error('两次输入的密码不一致'))
                 }else{
                     callback();//通过
                 }
            }
            return{
                loginForm:{
                   account:'',
                   password:'',
                   checkPass:''
                },
                rules:{
                   account:[
                        { required: true, message: '请输入活动名称', trigger: 'blur' },
                        { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }//内置验证
                   ],
                   password:[
                        { required: true, validator:checkPwd, trigger: 'blur' }// 自定义验证
                   ],
                   checkPass:[
                        { required: true, validator:confirmPwd, trigger: 'blur' },// 自定义验证
                   ]
                }
            }
        },
        methods:{
            //登陆
             submitForm(){
                this.$refs.loginForm.validate((valid) => {
                    if (valid) {
                         //收集参数
                         let params={
                             account:this.loginForm.account,
                             password:this.loginForm.password
                         }
                        //  console.log(params);
                        //发送请求
                          loginCheck(params)
                                .then(res=>{
                                    //接受后台响应的提示
                                    let {code,msg,token}=res;
                                    //判断
                                    if(code===0){
                                        //将密钥保存到本地存储
                                        local.set('d-c',token)
                                        //成功
                                        this.$message({
                                            type:'success',
                                            message:msg
                                        })
                                        //跳转到后台系统页面
                                        this.$router.push('/home')
                                    }else if(code===1){
                                        //失败
                                        this.$message.error(msg) 
                                    }
                                    
                                })
                                .catch(err=>{
                                    console.log(err);
                                    
                                })
                         

                    } else {
                        console.log('前端没有通过!');
                        return false;
                    }
                })
            } ,     
        
             
            //重置
            resetForm(){
                this.$refs.loginForm.resetFields();
            }
        }
    }
</script>

<style lang="less">
    //引入样式
    @import './Login.less';
</style>