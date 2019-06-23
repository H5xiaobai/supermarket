<template>
    <div class="Goods-Add">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <h3 class="title">商品添加</h3>
            </div>
            <div>
                <el-form :model="GoodsAddForm"
                         :rules="rules"
                         ref="GoodsAddForm"
                         label-width="100px"
                         :label-position="labelPosition"
                         style="width:400px"
                         >
                    <!-- 所属分类 -->
                    <el-form-item label="所属分类:" prop="classify">
                        <el-select v-model="GoodsAddForm.classify" placeholder="请选择分类">
                        <el-option label="奶粉" value="奶粉"></el-option>
                        <el-option label="五谷杂粮" value="五谷杂粮"></el-option>
                        <el-option label="饮品" value="饮品"></el-option>
                        </el-select>
                    </el-form-item>
                     
                     <!-- 商品条形码 -->
                      <el-form-item label="商品条形码:" prop="goodBarCode">
                        <el-input v-model.number="GoodsAddForm.goodBarCode" style="width:280px;margin-right:20px"></el-input>
                        <el-button type="success" @click='create(10000000000,999999999999)' style="width:100px;">生成条形码</el-button>
                      </el-form-item>

                      <!-- 商品名称 -->
                      <el-form-item label="商品名称:" prop="goodName">
                        <el-input v-model="GoodsAddForm.goodName" style="width:300px"></el-input>
                      </el-form-item>

                       <!-- 商品进价 -->
                      <el-form-item label="商品进价:" prop="goodCostPrice">
                        <el-input v-model="GoodsAddForm.goodCostPrice" @blur="autoprice" style="width:300px;margin-right:5px"></el-input>元
                      </el-form-item>

                      <!-- 商品售价 -->
                      <el-form-item label="商品售价:" prop="goodPrice">
                        <el-input v-model="GoodsAddForm.goodPrice" style="width:300px;margin-right:5px"></el-input>元
                      </el-form-item>

                      <!-- 市场价 -->
                      <el-form-item label="市场价:" prop="maketPrice">
                        <el-input v-model="GoodsAddForm.maketPrice" style="width:300px;margin-right:5px"></el-input>元
                        <p>默认市场价为售价的1.2倍</p>
                      </el-form-item>
                      
                     
                      <!-- 入库数量 -->
                      <el-form-item label="入库数量:" prop="goodNum">
                        <el-input v-model.number="GoodsAddForm.goodNum"  style="width:300px;margin-right:5px"></el-input>件
                      </el-form-item>

                      <!-- 商品重量 -->
                      <el-form-item label="商品重量:" prop="goodWeight">
                        <el-input v-model.number="GoodsAddForm.goodWeight"  style="width:300px;margin-right:5px"></el-input>kg
                      </el-form-item>
                      
                      <!-- 商品单位 -->
                      <el-form-item label="商品单位:" prop="goodUnit">
                        <el-input v-model.number="GoodsAddForm.goodUnit" style="width:300px"></el-input>
                      </el-form-item>

                      <!-- 会员享受 -->
                      <el-form-item label="会员享受:" prop="vip">
                            <el-radio-group v-model="GoodsAddForm.vip">
                                <el-radio label="享受"></el-radio>
                                <el-radio label="不享受"></el-radio>
                            </el-radio-group>
                       </el-form-item>
                       
                        <!-- 是否促销 -->
                      <el-form-item label="是否促销:" prop="Promotion">
                            <el-radio-group v-model="GoodsAddForm.Promotion">
                                <el-radio label="启用"></el-radio>
                                <el-radio label="禁用"></el-radio>
                            </el-radio-group>
                       </el-form-item>
                        
                        <!-- 商品简介 -->
                        <el-form-item label="活动形式" prop="introduce">
                            <el-input type="textarea" v-model="GoodsAddForm.introduce"></el-input>
                            <p>不超过200字</p>
                        </el-form-item>
                        
                        <!-- 添加按钮 -->
                        <el-form-item>
                            <el-button type="primary" @click="submitForm()">
                                添加
                            </el-button>
                        </el-form-item>
                    </el-form>
            </div>
        </el-card>

    </div>
</template>

<script>
   //引入工具函数
   import {VipNum} from "@/utils/res.js"
   //引入api
   import {goodsAdd} from "@/api/goods"
    export default {
        data(){
           
            return{
                 labelPosition:'top',
                 GoodsAddForm:{
                     classify:'',
                     goodBarCode:'',
                     goodName:'',
                     goodCostPrice:'',
                     goodPrice:'',
                     maketPrice:'',
                     goodNum:'',
                     goodWeight:'',
                     goodUnit:'',
                     vip:'',
                     Promotion:'',
                     introduce:''
                 },
                 rules:{
                     classify:[
                         { required: true, message: '请选择分类', trigger: 'change' }
                     ],
                     goodBarCode:[
                         { required: true, message:'验证码不能为空' , trigger: 'change' }
                     ],
                     goodName:[
                         { required: true, message: '请输入活动名称', trigger: 'blur' },
                         { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
                     ],
                      goodCostPrice:[
                          { required: true, message: '商品成本价不能为空', trigger: 'blur' }
                     ],
                     goodPrice:[
                         { required: true, message: '价钱不能为空', trigger: 'blur' }
                     ],
                     maketPrice:[
                          { required: true, message: '市场价不能为空', trigger: 'blur' }
                     ],
                    
                     goodNum:[
                          { required: true, message: '商品数量不能为空', trigger: 'blur' },
                           { type: 'number', message: '商品数量必须为数字值'}
                     ],
                     goodWeight:[
                          { required: true, message: '商品重量不能为空', trigger: 'blur' },
                           { type: 'number', message: '商品重量必须为数字值'}
                     ],
                     goodUnit:[
                          { required: true, message: '商品单位不能为空', trigger: 'blur' },
                           { type: 'number', message: '商品单位必须为数字值'}
                     ],
                     vip:[
                          { required: true, message: '必须选择一种方式', trigger: 'blur' }
                     ],
                     Promotion:[
                          { required: true, message: '必须选择一种', trigger: 'change' }
                     ],
                     introduce:[
                          { required: true, message: '商品简介不能为空', trigger: 'blur' }
                     ]
                 }
            }
        },
        methods:{
            //随机生成条形码
            create(min,max){
               this.GoodsAddForm.goodBarCode=Math.floor(Math.random()*(max-min+1)+min)
            },
            //商品售价和市场价的计算函数
            autoprice(){
                this.GoodsAddForm.goodPrice=parseFloat(this.GoodsAddForm.goodCostPrice*1.5).toFixed(2)//售价
                this.GoodsAddForm.maketPrice=parseFloat(this.GoodsAddForm.goodCostPrice*2)//市场价

            },
            submitForm(){
               //表单验证全部通过
               this.$refs.GoodsAddForm.validate((valid)=>{
                    if(valid){
                         let params={
                            classify:this.GoodsAddForm.classify,
                            goodBarCode:this.GoodsAddForm.goodBarCode,
                            goodName:this.GoodsAddForm.goodName,
                            goodPrice:this.GoodsAddForm.goodPrice,
                            maketPrice:this.GoodsAddForm.maketPrice,
                            goodCostPrice:this.GoodsAddForm.goodCostPrice,
                            goodNum:this.GoodsAddForm.goodNum,
                            goodWeight:this.GoodsAddForm.goodWeight,
                            goodUnit:this.GoodsAddForm.goodUnit,
                            vip:this.GoodsAddForm.vip,
                            Promotion:this.GoodsAddForm.Promotion,
                            introduce:this.GoodsAddForm.introduce
                         }
                        //  console.log(params);
                        //发送请求
                        goodsAdd(params)
                            .then(res=>{
                            //接受后台数据
                            let {code,msg}=res;
                            if(code===0){
                                //成功
                                    this.$message({
                                        type:'success',
                                        message:msg
                                    })
                                    //跳转到商品管理页
                                    this.$router.push('/home/GoodsManage')
                            }else{
                                //失败
                                this.$message.error(msg)
                            }
                            })
                            .catch(err=>{
                                console.log(err);
                                
                            })
                         
                    }else{
                        alert('添加失败')
                        return false
                    }
               })
            }
        }
    }
</script>

<style lang="less">
    .Goods-Add{
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