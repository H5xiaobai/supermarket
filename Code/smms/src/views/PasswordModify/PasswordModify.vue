<template>
    <div class="Password-Modify">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <h3 class="title">账户密码修改</h3>
            </div>
            <div>
                <el-form :model="PwdModifyForm"
                         status-icon
                         :rules="rules"
                         ref="PwdModifyForm"
                         label-width="100px"
                         style="width:400px"
                     >
                    <el-form-item label="原密码" prop="oldPassword">
                        <el-input type="text" v-model="PwdModifyForm.oldPassword" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="新密码" prop="newPassword">
                        <el-input type="text" v-model="PwdModifyForm.newPassword" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="确认新密码" prop="checkPass">
                        <el-input type="text" v-model="PwdModifyForm.checkPass" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm()">确认修改</el-button>
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
    //引入本地存储操作函数
    import local from '@/utils/local.js'
    //引入api
    import {oldpass,newpass} from '@/api/accounts.js'
    export default {
        data(){
             //原密码
             const oldPwd=(rule,value,callback)=>{
                 let len=value.length
               if(value===''){
                  callback(new Error('密码不能为空'))
                }else{
                    oldpass({oldPassword:value})
                    .then(res=>{
                        let {code,msg}=res;
                         if(code===0){
                             callback();
                         }else if(code===1){
                             callback(new Error(msg))
                         }
                    })
                    .catch(err=>{
                        console.log(err);
                    })
                }
             }
             //新密码
             const newPwd=(rule,value,callback)=>{
                  let len=value.length
                 if(value===''){
                    callback(new Error('密码不能为空'))
                 }else if(len<3 || len>6){
                  callback(new Error('密码在3~6位'))
                }else if(!pwdReg(value)){
                    callback(new Error('密码只能是数字和字母'))
                }else if(value===this.PwdModifyForm.oldPassword){
                     callback(new Error('新密码不能和旧密码相同'))
                }else{
                    //密码一致性
                    if(this.PwdModifyForm.checkPass!==''){
                        this.$refs.PwdModifyForm.validateField('checkPass')
                    }
                    callback()
                }
             }
             //确认新密码
             const chePwd=(rule,value,callback)=>{
                   let len=value.length
                 if(value===''){
                    callback(new Error('密码不能为空'))
                 }else if(len<3 || len>6){
                  callback(new Error('密码在3~6位'))
                }else if(!pwdReg(value)){
                    callback(new Error('密码只能是数字和字母'))
                }else if(value!==this.PwdModifyForm.newPassword){
                     callback(new Error('两次输入的密码不一致'))
                }else{
                    callback()
                }
             }
            return{
                PwdModifyForm:{
                    oldPassword:'',
                    newPassword:'',
                    checkPass:''
                },
                rules:{
                    oldPassword:[
                        { require:true,validator:oldPwd, trigger: 'blur' }
                    ],
                    newPassword:[
                        { require:true,validator:newPwd, trigger: 'blur' }
                    ],
                    checkPass:[
                        { require:true,validator:chePwd, trigger: 'blur' }
                    ]
                }
            }
        },
        methods:{
            submitForm(){
                //前端所有验证通过，valid为true否则为false
                 this.$refs.PwdModifyForm.validate((valid)=>{
                       if(valid){
                            //收集用户数据
                            let params={
                                newPassword:this.PwdModifyForm.newPassword,
                            }
                            //发送请求
                            newpass(params)
                            .then(res=>{
                                 //接收参数
                                 let{code,msg}=res;
                                 if(code===0){
                                     this.$message({
                                         type:'success',
                                         message:msg
                                     })
                                //清除token
                                local.remove('d-c')
                                //退出到登陆界面
                                this.$router.push('/login')
                                 }else if(code===1){
                                     this.message.error(msg)
                                 }
                            })
                            .catch(err=>{
                                console.log(err);
                                
                            })
                       }else{
                           alert('不能验证通过')
                           return false
                       }
                 })
                
                
                 
            },
            resetForm(){
                //重置表单
                this.$refs.PwdModifyForm.resetFields()
            }
        }
    }
</script>

<style lang="less">
 .Password-Modify{
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