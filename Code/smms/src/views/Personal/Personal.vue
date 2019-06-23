<template>
    <div class="personal">
         <el-card class="box-card">
            <div slot="header" class="clearfix">
                <h3 class="title">个人中心</h3>
            </div>
            <div class="item">
                <p>用户ID：{{userInfo.id}}</p>
                <p>账号：{{userInfo.account}}</p>
                <p>密码:{{userInfo.password}}</p>
                <p>用户组:{{userInfo.userGroup}}</p>
                <p>创建时间：{{userInfo.ctime | filtersCtime}}</p>
            </div>
            <div style="margin-top:30px">
                <el-upload
                    class="avatar-uploader"
                    action="#"
                    :show-file-list="false"
                    :http-request="uploadAvatar"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
                    <img v-if="imageUrl" :src="imageUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </div>
         </el-card>
    </div>
</template>

<script>

 //引入api
import {PersonalInfo} from '@/api/accounts.js'
//引入moment
import moment from 'moment'
//引入axios
import axios from 'axios'
    export default {
        data(){
            return{
                userInfo:{},
                imageUrl:''

            }
        },
        methods:{
            //定义一个获取用户数据的函数
            getuserInfo(){
                PersonalInfo()//发送请求
                 .then(res=>{
                     //接受参数
                     let {data}=res;
                    //  console.log(data);
                    this.userInfo=data[0]
                     
                 })
                 .catch(err=>{
                     console.log(err);
                     
                 })
            },
             // 头像上传成功
            handleAvatarSuccess(res, file) {
                this.imageUrl = URL.createObjectURL(file.raw);
            },
            // 头上上传之前限制
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },
            //自定义上传函数
            uploadAvatar(file){
                let formData=new FormData()
                // console.log(formData); 浏览器自带
                //把文件信息添加进对象
                formData.append('file',file.file)
                //发送请求
                axios.post('/account/uploadavatar',formData)
                     .then(response=>{
                         // 获取地址
                         let {avatarUrl}=response.data;
                         //回填地址
                         this.imageUrl='http://127.0.0.1:888'+avatarUrl;
                         //传给父组件
                         this.$emit('tofather')
                     })
                     .catch(err=>{
                         console.log(err);
                         
                     })
            }
        },
        created(){
            this.getuserInfo()
        },
        filters:{
            filtersCtime(ctime){
                 return moment(ctime).format('YYYY-MM-DD HH:mm:ss')
            }
        }
        
    }
</script>

<style lang="less">
  .personal{
         .el-card{
             .el-card__header{
                 background-color: #f1f1f1;
                 .clearfix{
                     .title{
                         font-size:20px;
                     }
                 }
             }
             .el-card__body{
                 .item{
                      p{
                        font-size: 20px;
                        margin: 20px auto;
                     }
                 }
                 .avatar-uploader .el-upload {
                    border: 1px dashed #d9d9d9;
                    border-radius: 6px;
                    cursor: pointer;
                    position: relative;
                    overflow: hidden;
                }
                .avatar-uploader .el-upload:hover {
                    border-color: #409EFF;
                }
                .avatar-uploader-icon {
                    font-size: 28px;
                    color: #8c939d;
                    width: 178px;
                    height: 178px;
                    line-height: 178px;
                    text-align: center;
                }
                .avatar {
                    width: 178px;
                    height: 178px;
                    display: block;
                }
                
             }
         }
    }
</style>