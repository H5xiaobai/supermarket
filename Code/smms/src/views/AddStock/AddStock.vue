<template>
    <div class="Add-stock">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <h3 class="title">商品入库</h3>
            </div>
            <div>
                <el-form :model="AddstockForm"
                         :rules="rules"
                         ref="AddstockForm"
                         label-width="100px"
                         size='small'
                >
                    <!-- 商品条形码 -->
                    <el-form-item label="商品条形码" prop="goodcode">
                        <el-input v-model.number="AddstockForm.goodcode" style="width:300px"></el-input>
                    </el-form-item>

                    <!-- 商品名称 -->
                     <el-form-item label="商品名称" prop="goodname">
                        <el-input v-model.number="AddstockForm.goodname" style="width:150px"></el-input>
                    </el-form-item>
                    
                    <!-- 商品数量 -->
                    <el-form-item label="商品数量" prop="goodnum">
                        <el-input v-model.number="AddstockForm.goodnum" style="width:150px;margin-right:5px"></el-input>件
                    </el-form-item>

                    <!-- 进价 -->
                    <el-form-item label="进价" prop="costprice">
                        <el-input v-model.number="AddstockForm.costprice" style="width:150px;margin-right:5px"></el-input>元
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm()">添加入库</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
    </div>
</template>

<script>
// 引入api
import {addStcok} from '@/api/stock'

    export default {
        data(){
            return{
                AddstockForm:{
                    goodcode:'',
                    goodname:'',
                    goodnum:'',
                    costprice:''
                },
                rules:{
                    goodcode:[
                        { required: true, message: '请输入条形码', trigger: 'blur' },
                        {type:'number' ,message: '只能输入数字', trigger: 'blur' }
                    ],
                    goodname:[
                        { required: true, message: '请输入商品名字', trigger: 'blur' }
                    ],
                    goodnum:[
                        { required: true, message: '请输入库商品数量', trigger: 'blur' }
                    ],
                    costprice:[
                        { required: true, message: '请输入商品进价', trigger: 'blur' }
                    ]
                }
            }
        },
        methods:{
            submitForm(){
                 //表单全部通过验证
                 this.$refs.AddstockForm.validate((valit)=>{
                     if(valit){
                         //成功后，收集所有入库数据
                         let params={
                             goodcode:this.AddstockForm.goodcode,
                             goodname:this.AddstockForm.goodname,
                             goodnum:this.AddstockForm.goodnum,
                             costprice:this.AddstockForm.costprice
                         }
                          //发送请求
                          addStcok(params)
                                   .then(res=>{
                                       //接收参数
                                       let {code,msg}=res;
                                       if(code===0){
                                           this.$message({
                                               type:'success',
                                               message:msg
                                           })
                                           //跳转
                                           this.$router.push('/home/StockManage')
                                       }else if(code===1){
                                             this.$message.error(msg)
                                       }
                                   })
                                   .catch(err=>{
                                       console.log(err);
                                       
                                   })
                         
                     }else{
                         alert('入库失败')
                         return false
                     }
                 })
            }
        }
    }
</script>

<style lang="less">
      .Add-stock{
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