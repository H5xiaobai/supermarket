<template>
    <div class="Stock-manage">
         <el-card class="box-card">
            <div slot="header" class="clearfix">
                <h3 class="title">商品管理</h3>
            </div>
            <div class="item">
                <!-- 搜索框 -->
                <el-form :inline="true"
                        :model="StockmanageForm"
                        :rules="rules"
                        size="small"
                        ref="search"
                >
                
                    <el-form-item prop='classify'>
                        <el-select v-model="StockmanageForm.classify" placeholder="选择分类">
                        <el-option label="商品名称" value="商品名称"></el-option>
                        <el-option label="条形码" value="条形码"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="关键字" prop='users'>
                        <el-input v-model="StockmanageForm.users"></el-input>
                    </el-form-item>

                    <el-form-item>
                        (商品名称,条形码)
                        <el-button type="primary" @click="onSubmit">查询</el-button>
                    </el-form-item>
                </el-form>
                <!-- 表格 -->
                <el-table
                    ref="StocklistTable"
                    :data="StocktableData"
                    tooltip-effect="dark"
                    style="width: 100%"
                    @selection-change="handleSelectionChange">
                    <el-table-column
                    type="selection"
                    width="55">
                    </el-table-column>

                    <el-table-column
                    prop="goodcode"
                    label="商品条形码"
                    width="200">
                    </el-table-column>
                
                    <el-table-column
                    prop="goodname"
                    label="商品名称"
                    width="200">
                    </el-table-column>

                    <el-table-column
                    prop="goodnum"
                    label="库存"
                    width="100"
                    show-overflow-tooltip>
                    </el-table-column>
                    
                    <el-table-column
                    prop="costprice"
                    label="进价"
                    width="120"
                    show-overflow-tooltip>
                    </el-table-column>

                    <el-table-column lable='日期' width='120'>
                    <template slot-scope="scope">{{ scope.row.ctime | filterCtime}}</template>
                    </el-table-column>

                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button
                            size="mini"
                            type="primary"
                            @click="handleEdit(scope.row.id)">
                             <i class="el-icon-edit"></i>编辑</el-button>
                            <el-button
                            size="mini"
                            type="danger"
                            @click="handleDelete(scope.row.id)">
                            <i class="el-icon-delete"></i>删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 分页 -->
                <div class="block">
                    <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[3, 5, 10, 20]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                    </el-pagination>
                </div>
                <!-- 批量删除和取消选择 -->
                 <div style="margin-top: 20px">
                        <el-button @click="someSelection" size="small" type='danger'>批量删除</el-button>
                        <el-button @click="cancelSelection" size="small" type='primary'>取消选择</el-button>
                </div>
                <!-- 模态框 -->
                <el-dialog title="收货地址" :visible.sync="Visible" width="400px">
                    <el-form :model="stockform" ref='stockform' :rules="rules">
                        <el-form-item label="商品条形码" label-width="120px" prop='goodcode'>
                            <el-input v-model="stockform.goodcode" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="商品名称" label-width="120px" prop='goodname'>
                            <el-input v-model="stockform.goodname" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" label-width="120px" prop='goodnum'>
                           <el-input v-model="stockform.goodnum" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="进价" label-width="120px" prop='costprice'>
                           <el-input v-model="stockform.costprice" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="Visible=false">取 消</el-button>
                        <el-button type="primary" @click="isenter">确 定</el-button>
                    </div>
                </el-dialog>
            </div>  
        </el-card>    
    </div>
</template>

<script>
//引入时间模块
import moment from 'moment'
//引入api
import {delStcok,stockEdit,stocksaveEdit,stockdelSome,stockByPage} from '@/api/stock'
    export default {
        data(){
            return{
                //查询
                StockmanageForm:{
                    classify:'',
                    users:''
                },
                rules:{
                   classify:[
                     { required: true, message: '请选择分类', trigger: 'change' },
                   ],
                   users:[
                       { required: true, message: '请数输入关键字', trigger: 'blur' }
                   ]
                },
                //表格
                StocktableData:[],
                //分页
                currentPage:1,
                //定义一个变量保存编辑的id，修改完表单可使用
                editId:'',
                pageSize:3,//当前每页条数
                total:0,   //总数
                Visible:false,
                stockform:{//修改表单
                    goodcode:'',
                    goodname:'',
                    goodnum:'',
                    costprice:''
                },
                idArr:[]//定义一个数组保存批量删除中选中的id
            }
        },
        methods:{
            //查询函数
            onSubmit(){
                //输入框全部通过
                this.$refs.search.validate((valid)=>{
                    if(valid){
                        let params={
                            classify:this.StockmanageForm.classify,
                            users:this.StockmanageForm.users
                        }
                        console.log(params);
                        
                    }else{
                        alert('不能为空')
                        return false
                    }
                })
            },
           
            //编辑
            handleEdit(id){
                //弹出修改表单
                 this.Visible=true
                 this.editId=id//收集用户传入id赋给提前定义的变量
                 //发送请求
                 stockEdit({id})
                 .then(res=>{
                     //接受参数
                     let {data}=res;
                    this.stockform=data[0]
                 })
                 .catch(err=>{
                     console.log(err);
                     
                 })

            },
            //确认保存
            isenter(){
                //优化用户体验
                  this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }).then(() => {
                           //模态框隐藏
                        this.Visible=false
                        //将以保存ID和收集的用户数据发送给后台
                        let params={
                            goodcode:this.stockform.goodcode,
                            goodname:this.stockform.goodname,
                            goodnum:this.stockform.goodnum,
                            costprice:this.stockform.costprice,
                            id:this.editId
                        }
                        //发送封装好的api请求函数
                        stocksaveEdit(params)
                        .then(res=>{
                            //接收参数
                            let {code,msg}=res;
                            if(code===0){
                                this.$message({
                                    type:"success",
                                    message:msg
                                })
                                //调用分页函数，重新请求数据，刷新页面
                                this.byPage()
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
            //单键删除
            handleDelete(id){
                //优化提示
                 this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }).then(() => {
                         //发送请求带上id
                       delStcok({id})
                        .then(res=>{
                            let {code,msg}=res;
                            if(code===0){
                                this.$message({
                                    type:'success',
                                    message:msg
                                })
                            //刷新页面
                            this.getstock()  
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
            //取消选择
            cancelSelection(){
                 this.$refs.StocklistTable.clearSelection()

            },
             //当选择项发生变化时会触发该事件
            handleSelectionChange(selection){//自动传入一个参数
                //  console.log(selection) 是一个数组包含几个对象，每一个对象就是一行数据 
                this.idArr=selection.map(v=>v.id)//遍历,v是对象，获取V的id在放进一个定义好的空数组中
                   
            },
            //批量删除
            someSelection(){
                 //优化体验，给予用户一个提示
                  this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }).then(() => {
                        //收集选中保存的id数组
                        let idArr=this.idArr
                        //发送参数
                        stockdelSome({idArr})
                        .then(res=>{
                            //接收参数
                            let {code,msg}=res;
                            //判断
                            if(code===0){
                                //成功
                                this.$message({
                                    type:'success',
                                    message:msg
                                })
                                //调用分页函数重新渲染页面
                                this.byPage()
                            }else if(code===1){
                                //失败
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
            //每页具体条数
            handleSizeChange(pagesize){
                this.pageSize=pagesize;//将用户的选择的页面显示条数赋值给pageSize
                this.byPage()//调用分页函数
            },
            //当前页
            handleCurrentChange(currentpage){
               this.currentPage=currentpage
               this.byPage()//调用分页函数
            },
            //定义分页函数，请求数据
            byPage(){
                //定义变量收集用户参数
                let params={
                    pageSize:this.pageSize,
                    currentPage:this.currentPage
                }
                //发送请求
                 stockByPage(params)
                 .then(res=>{
                     //接收参数
                     let {data,total}=res;
                     //将数据渲染进表格
                     this.StocktableData=data
                     this.total=total
                     //判断临界
                     if(!data.length && this.currentPage !==1){
                         this.currentPage-=1
                         this.byPage()//再次刷新页面数据
                     }
                 })
                 .catch(err=>{
                     console.log(err);
                     
                 })
            },
        },
        created(){
            this.byPage()//调用分页函数
        },
        filters:{ //过滤器
            filterCtime(ctime){
                return moment(ctime).format('YYYY-MM-DD')
            }
        }
    }
</script>

<style lang="less">
     .Stock-manage{
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
                     .el-form{
                         margin-bottom: 20px;
                         border-bottom:1px solid #f1f1f1;
                         span{margin:0 5px;font-size:12px;}
                     }
                     .block{
                         margin-top: 20px;
                     }
                 }
             }
         }
    }
</style>