<template>
    <div class="right-header">
         <el-row>
               <!-- 左 -->
               <el-col :span="12">
                   <h2 class="title"><span class="el-icon-menu"></span>永辉超市管理系统</h2>
               </el-col>
               <!-- 右 -->
               <el-col :span="12">
                   <el-row :gutter="20">
                       <el-col :span="18">
                           <div class="avatar">
                               <img :src="avatarUrl" alt="">
                           </div>
                       </el-col>
                       <el-col :span="6">
                            <el-dropdown @command="handleCommand">
                                <span class="el-dropdown-link">
                                    {{account}}<i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="personal">个人中心</el-dropdown-item>
                                    <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                       </el-col>
                    </el-row>
               </el-col>
         </el-row>
    </div>
</template>

<script>
//引入对本地存储的操作函数
import local from '@/utils/local'
//引入api
import {PersonalInfo} from '@/api/accounts'
    export default {
        data(){
            return{
                account:'',//账号名
                avatarUrl:''//头像地址
            }
        },
        methods:{
            handleCommand(command){
                if(command==='logout'){//跳转登陆
                      //清除本地token
                 local.remove('d-c')
                 //弹出提示
                 this.$message({
                     type:'success',
                     message:'退出成功'
                 })
                 //跳转页面
                 setTimeout(()=>{
                    this.$router.push('/login')
                 },2000)
              }else if(command==='personal'){//跳转个人中心
                   this.$router.push('/home/personal')
              }
                
            },
            //获取用户信息函数
            getuserInfo(){
                 PersonalInfo()
                 .then(res=>{
                     let {data}=res;
                    //  console.log(data);
                    let {account,avatarUrl}=data[0]
                    this.account=account
                    this.avatarUrl = 'http://127.0.0.1:888' + avatarUrl; // 渲染头像地址
                 })
                 .catch(err=>{
                     console.log(err);
                     
                 })
            }
        },
        created(){
            this.getuserInfo()//调用获取用户信息函数
        }
    }
</script>

<style lang="less">
    .right-header{
        border-bottom: 1px solid #ccc;
        &>.el-row{
            .el-col:first-child{
                .title{
                    font-size: 20px;
                    span{margin-right:10px;}
                }
            }
            .el-col:last-child{
                &>.el-row{
                    .el-col:first-child{
                        text-align: right;
                        .avatar{
                            background-color: #ccc;
                            width:50px;
                            height:50px;
                            border-radius:50%;
                            margin:10px 0 10px 370px;
                            img{
                                width:100%;
                                height:100%;
                                border-radius:50%;
                            }
                        }
                    }
                    .el-col:last-child{
                        text-indent:10px;
                        .el-dropdown-link {
                            cursor: pointer;
                            color: #409EFF;
                            .el-icon-arrow-down {
                            font-size: 12px;
                           }
                        }
                    }
                }
            }
        }
    }
</style>