<template>
    <div class="Goods-Manage">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <h3 class="title">商品管理</h3>
            </div>
            <div>
                <!-- 模糊查询 -->
                <el-form :inline="true"
                         :model="GoodsManageForm"
                         :rules="rules"
                         size="small"
                         ref='GoodsManage'
                 >
                   
                    <el-form-item prop='classify'>
                        <el-select v-model="GoodsManageForm.classify" placeholder="请选择分类">
                            <el-option label="全部分类" value="全部分类"></el-option>
                            <el-option label="奶粉" value="奶粉"></el-option>
                            <el-option label="五谷杂粮" value="五谷杂粮"></el-option>
                            <el-option label="饮品" value="饮品"></el-option>
                        </el-select>
                    </el-form-item>

                     <el-form-item label="关键字" prop='keyword'>
                        <el-input v-model="GoodsManageForm.keyword"></el-input>
                    </el-form-item>

                    <el-form-item>
                        (商品名称,条形码)
                        <el-button type="primary" @click="search">查询</el-button>
                    </el-form-item>
                </el-form>
                <!-- 表格 -->
                <el-table
                    ref="GoodsManageTable"
                    :data="tableData"
                    tooltip-effect="dark"
                    style="width: 100%"
                    @selection-change="handleSelectionChange"
                    >
                    <el-table-column
                    type="selection"
                    width="55">
                    </el-table-column>

                    <el-table-column
                    prop="goodBarCode"
                    label="商品条形码"
                    width="120">
                    </el-table-column>

                    <el-table-column
                    prop="goodName"
                    label="商品名称"
                    width="160">
                    </el-table-column>

                    <el-table-column
                    prop="classify"
                    label="所属分类"
                    width="100"
                    show-overflow-tooltip>
                    </el-table-column>

                     <el-table-column
                    prop="goodPrice"
                    label="售价(元)"
                    width="100">
                    </el-table-column>

                     <el-table-column
                    prop="maketPrice"
                    label="市场价(元)"
                    width="100">
                    </el-table-column>

                     <el-table-column
                     prop="goodNum" 
                    label="库存"
                    width="100">
                    </el-table-column>

                     <el-table-column
                    prop="goodCostPrice"
                    label="商品进价(元)"
                    width="100">
                    </el-table-column>

                     <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button
                            size="mini"
                            type="primary"
                            @click="handleEdit(scope.row.id)">
                            <i class="el-icon-edit"></i>
                            编辑
                            </el-button>
                            <el-button
                            size="mini"
                            type="danger"
                            @click="handleDelete(scope.row.id)">
                            <i class="el-icon-delete"></i>
                            删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
               
                <!-- 分页 -->
                 <div class="block">
                    <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[3, 5,10, 20]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                    </el-pagination>
                </div>

                 <!-- 批量删除和取消选择 -->
                <div style="margin-top: 20px">
                    <el-button @click="batchSelection" size="small" type='danger'>批量删除</el-button>
                    <el-button @click="cancelSelection" size="small" type='primary'>取消选择</el-button>
                </div>

                <!-- 模态框 -->
                <el-dialog title="商品修改" :visible.sync="isVisible" width='400px'>
                        <!-- 修改表单 -->
                        <el-form :model="goodsform" :rules="rules" ref='goodsform' size="small">
                            <el-form-item label="商品条形码" label-width="80" prop="goodBarCode">
                               <el-input v-model="goodsform.goodBarCode" autocomplete="off"></el-input>
                            </el-form-item>

                            <el-form-item label="商品名称" label-width="80" prop="goodName">
                               <el-input v-model="goodsform.goodName" autocomplete="off"></el-input>
                            </el-form-item>

                             <el-form-item label="所属分类" label-width="80" prop="classify">
                                <el-select v-model="goodsform.classify" placeholder="请选择活动区域">
                                    <el-option label="奶粉" value="奶粉"></el-option>
                                    <el-option label="五谷杂粮" value="五谷杂粮"></el-option>
                                    <el-option label="饮品" value="饮品"></el-option>
                                </el-select>
                            </el-form-item>
                            
                             <el-form-item label="商品进价" label-width="80" prop="goodCostPrice">
                               <el-input v-model="goodsform.goodCostPrice" autocomplete="off"></el-input>
                            </el-form-item>

                            <el-form-item label="售价" label-width="80" prop="goodPrice">
                               <el-input v-model="goodsform.goodPrice" autocomplete="off"></el-input>
                            </el-form-item>

                            <el-form-item label="市场价" label-width="80" prop="maketPrice">
                               <el-input v-model="goodsform.maketPrice" autocomplete="off"></el-input>
                            </el-form-item>

                            <el-form-item label="库存" label-width="80" prop="goodNum">
                               <el-input v-model="goodsform.goodNum" autocomplete="off"></el-input>
                            </el-form-item>
                             
                        </el-form>

                        <div slot="footer" class="dialog-footer">
                            <el-button @click="isVisible = false">取 消</el-button>
                            <el-button type="primary" @click="isenter">确 定</el-button>
                        </div>
                </el-dialog>
            </div>
        </el-card>
    </div>
</template>

<script>
    //引入api
    import {goodsEdit,goodsenterEdit,goodsDelete,goodsbatchdel,goodsbypage} from '@/api/goods'
    export default {
          data(){
              return{
                 //模糊查询
                 GoodsManageForm:{
                     classify:'',
                     keyword:''
                 } ,
                 rules:{
                     classify:[
                         { required: true, message: '请选择分类', trigger: 'change' },
                     ],
                     users:[
                         { required: true, message: '请输入关键字查询', trigger: 'blur' },
                     ]
                 },
                 //表格
                 tableData:[],
                 //分页
                 currentPage:1,
                 //修改表单
                 goodsform:{
                     goodBarCode:'',
                     goodName:'',
                     classify:'',
                     goodCostPrice:'',
                     goodPrice:'',
                     maketPrice:'',
                     goodNum:''
                     
                 },
                 rules:{
                     goodBarCode:[
                         { required: true, message:'验证码不能为空' , trigger: 'change' }
                     ],
                     goodName:[
                         { required: true, message: '请输入活动名称', trigger: 'blur' },
                         { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
                     ],
                    classify:[
                         { required: true, message: '请选择分类', trigger: 'change' }
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
                          { required: true, message: '商品数量不能为空', trigger: 'blur' }
                     ]
                 },
                 isVisible:false,//模态框的显示和隐藏
                 
                 //保存修改的id
                 goId:'',
                 //定义一个数组保存多选的ID
                 idArr:[],
                 total:0,
                 pageSize:3,
              }
          },
          methods:{
              //模糊查询内的函数
              search(){
                //直接调用分页函数
                   this.getgoodsbypage()
                // this.$refs.GoodsManage.validate((valid)=>{
                //     if(valid){
                //         let params={
                //             classify:this.GoodsManageForm.classify,
                //             users:this.GoodsManageForm.users
                //         }
                //         console.log(params);
                        
                //     }else{
                //         alert('不能为空')
                //         return false
                //     }
                // })
              },
              
              //当选择项发生变化时会触发该事件
              handleSelectionChange(selectionid){//自动传入的数据是个对象，可以直接进来打印这个形参
                  //定义变量保存id
                  this.idArr=selectionid.map(v=>v.id)//v是遍历出来的对象，获取ID放入一个新的数组中
              },
              //编辑
              handleEdit(id){
                  //弹出模态框
                  this.isVisible=true;
                  //保存这个id
                  this.goId=id
                 //发送id,弹出模态框
                 goodsEdit({id})
                //  this.req.get('http://127.0.0.1:888/goods/goodsmodify',{
                //      params:{
                //          id
                //        }
                //     })
                .then(res=>{
                    //接收参数，回填修改表单中
                    let {data}=res;
                    this.goodsform=data[0]
                })
                .catch(err=>{
                    console.log(err);
                    
                })
              },
              //模态框确认修改
              isenter(){
                  //表单全部验证通过
                  this.$refs.goodsform.validate((valid)=>{
                      if(valid){
                            //隐藏模态框
                    this.isVisible=false;
                    //发送修改后的数据和老ID
                    let params={
                        goodBarCode:this.goodsform.goodBarCode,
                        goodName:this.goodsform.goodName,
                        classify:this.goodsform.classify,
                        goodPrice:this.goodsform.goodPrice,
                        maketPrice:this.goodsform.goodPrice,
                        goodNum:this.goodsform.goodNum,
                        goodCostPrice:this.goodsform.goodCostPrice,
                        oldId:this.goId
                    }
                    //发送请求
                    goodsenterEdit(params)
                            .then(res=>{
                                //接收参数
                                let {code,msg}=res;
                                if(code===0){
                                    this.$message({
                                        type:'success',
                                        message:msg
                                    })
                                }else if(code===1){
                                    this.$message.error(msg)
                                }
                                //刷新页面
                                this.getgoodsbypage()//调用分页函数
                            })
                            .catch(err=>{
                                console.log(err);
                                
                            })
                      }else{
                         return false
                      }
                  })
                 
              },
              //单键删除
              handleDelete(id){
                  //优化用户体验，给个弹框
                   this.$confirm('你确认删除吗', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }).then(() => {
                        goodsDelete({id})
                        .then(res=>{
                            //接收数据
                            let {code,msg}=res;
                            //判断
                            if(code===0){
                                this.$message({
                                    type:'success',
                                    message:msg
                                })
                            //刷新页面
                            this.getgoodsbypage()//调用分页函数
                            }else if(code===1){
                                this.$message.error(msg)
                            }
                        })
                        .catch(err=>{
                        console.log(err);
                        })
                    }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });
                
              },
              //取消全部
              cancelSelection(){
                  this.$refs.GoodsManageTable.clearSelection()
              },
              //批量删除
              batchSelection(){
                  //给用户一个取消的机会
                  this.$confirm('你真的要删除吗', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                        }).then(() => {
                            //定义一个收集id数组的变量发送给后台
                          let idArr=this.idArr
                        //发送请求
                       goodsbatchdel({idArr})
                        .then(res=>{
                            //接收参数
                            let {code,msg}=res;
                            //判断
                            if(code===0){
                                    this.$message({
                                        type:'success',
                                        message:msg
                                    })
                                    //刷新页面
                                this.getgoodsbypage()//调用分页函数
                            }else if(code===1){
                                this.$message.error(msg)
                            }
                            
                        })
                        .catch(err=>{
                            console.log(err);
                      
                  })
                        }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });          
                    });
                 
              },
              //每页的数据数据条数
              handleSizeChange(pagesize){//用户一点自动传入
                 this.pageSize=pagesize//把用户选择的每页显示条数赋给pagesize
                 this.getgoodsbypage()//调用分页函数
              },
              //当前页
              handleCurrentChange(currentpage){//同上
                 this.currentPage=currentpage//把用户选择的当前页赋给currentpage
                 this.getgoodsbypage()//调用分页函数
              },
              //定义分页函数，用于请求数据
              getgoodsbypage(){
                  //把收集的用户需求发给后台
                  let params={
                      currentpage:this.currentPage,
                      pagesize:this.pageSize,
                      classify:this.GoodsManageForm.classify,
                      keyword:this.GoodsManageForm.keyword
                  }
                  //发送
                 goodsbypage(params)
                  .then(res=>{
                      //接收参数
                      let {data,total}=res;
                    //   console.log(data,total);
                      //渲染进表格和分页栏总数
                      this.tableData=data;
                      this.total=total;
                      
                      //临界判断
                      if(!data.length && this.currentPage!==1){
                            this.currentPage-=1
                            //刷新页面
                            this.getgoodsbypage()
                      }
                  })
                  .catch(err=>{
                      console.log(err);
                      
                  })
              },
              //定义一个请求数据，刷新页面的函数，方便多次调用
            //   getgoodsNum(){
            //         this.req.get('http://127.0.0.1:888/goods/goodsmanage')
            //                .then(response=>{
            //                    let {data}=response.data;
            //                    //将拿到的数据渲染到表格中
            //                    this.tableData=data;
            //                })
            //                .catch(err=>{
            //                  console.log(err);
            //               })
          
            //   }
          },
          created(){//生命周期函数中created阶段是发送请求最佳时间段
              this.getgoodsbypage()//调用分页函数 
          } 
    }
</script>

<style lang="less">
    .Goods-Manage{
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
                   .el-table{
                       margin-bottom: 30px;
                   }
             }
         }
    }
</style>