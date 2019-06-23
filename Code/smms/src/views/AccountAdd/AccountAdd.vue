<template>
    <div class="Account-Add">
       <el-card class="box-card">
            <div slot="header" class="clearfix">
                <h3 class="title">添加管理员账号</h3>
            </div>
            <div class="item">
                 <!-- 表单 -->
                <el-form :model="accountFormAdd"
                         status-icon
                         :rules="rules"
                         ref="accountFormAdd"
                         label-width="100px"
                         style="width:400px"
                >
                    <el-form-item label="账号" prop="account">
                        <el-input type="text" v-model="accountFormAdd.account" autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item label="密码" prop="password">
                        <el-input type="password" v-model="accountFormAdd.password" autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item label="确认密码" prop="checkPass">
                        <el-input type="password" v-model="accountFormAdd.checkPass" autocomplete="off"></el-input>
                    </el-form-item>

                     <el-form-item label="选择用户组" prop="userGroup">
                        <el-select v-model="accountFormAdd.userGroup" placeholder="请选择用户组">
                        <el-option label="超级管理员" value="超级管理员"></el-option>
                        <el-option label="普通用户" value="普通用户"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="submitForm()">添加</el-button>
                        <el-button @click="resetForm()">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
    </div>
</template>

<script>
   //引入工具函数
   import {pwdReg} from '@/utils/res.js'
   //引入api
   import {accountAdd} from '@/api/accounts.js'
    export default {
        data(){
            //密码
            let checkPwd=(rule,value,callback)=>{
                //获取密码长度
                let len=value.length
                if(value===''){
                    callback(new Error('密码不能为空'))
                }else if(len<3 || len>6){
                    callback(new Error('密码长度在3~6位之间'))
                }else if(!pwdReg(value)){
                    callback(new Error('只可以输入字母和数字'))
                }else{
                    //触发一致性验证
                    if(this.accountFormAdd.checkPass!==''){
                        this.$refs.accountFormAdd.validateField('checkPass')//触发确认密码的一致性验证
                    }
                    callback()
                }
            }

            //确认密码
            let confirmPwd=(rule,value,callback)=>{
                if(value===''){
                    callback(new Error('请再次输入密码'))
                }else if(value!==this.accountFormAdd.password){
                    callback(new Error('两次输入的密码不一致'))
                }else{
                    callback()
                }
            }
            return{
                accountFormAdd:{
                    account:'',
                    password:'',
                    checkPass:'',
                    userGroup:''
                },
                rules:{
                    account:[
                       { required: true, message: '请输入账户名', trigger: 'blur' },
                       { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
                    password:[
                       { required: true,validator:checkPwd ,trigger: 'blur' }
                    ],
                    checkPass:[
                       { required: true, validator:confirmPwd, trigger: 'blur' }
                    ],
                     userGroup: [
                        { required: true, message: '请选择一个用户组', trigger: 'change' } 
                     ]
                }
            }
        },
        methods:{
           submitForm(){
               //表单全部通过验证
               this.$refs.accountFormAdd.validate((valid)=>{
                   if(valid){
                                    //收集用户数据
                        let params={
                            account:this.accountFormAdd.account,
                            password:this.accountFormAdd.password,
                            userGroup:this.accountFormAdd.userGroup
                        }
                     //调用封装函数
                        accountAdd(params)   
                       .then(res=>{
                           //接后后台响应的数据
                           let {code,msg}=res;
                           //根据后台的提示给出用户相应的提示信息
                           if(code===0){
                                 this.$message({//成功提示信息，element ui组建中的
                                showClose: true,
                                message:msg,
                                type: 'success'
                                });
                                //跳转到账号管理界面
                                this.$router.push('/home/AccountManage')
                           }else if(code===1){
                                this.$message({
                                showClose: true,
                                message:msg,
                                type: 'error'
                                });
                           }
                       })
                       .catch(err=>{
                           console.log(err);
                           
                       })
                   }else{
                       alert('不能通过，请重新填写')
                       return false
                   }
               })
           } ,
           resetForm(){
               //重置
                this.$refs.accountFormAdd.resetFields()
           }
        }
    }
</script>

<style lang="less">
    .Account-Add{
         .el-card{
             .el-card__header{
                 background-color: #f1f1f1;
                 .clearfix{
                     .title{
                         font-size:20px;
                     }
                 }
             }
         }
    }
</style>