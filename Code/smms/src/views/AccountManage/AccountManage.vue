<template>
    <div class="Account-Manage">
         <el-card class="box-card">
            <div slot="header" class="clearfix">
                <h3 class="title">账号管理</h3>
            </div>
            <div class="item">
                  <el-table
                        ref="AccountTable"
                        :data="AccountTableData"
                        tooltip-effect="dark"
                        style="width: 100%"
                        @selection-change='selectChange'
                    >    
                         <!-- 选择框 -->
                        <el-table-column
                        type="selection"
                        width="150">
                        </el-table-column>

                         <!-- 账号 -->
                        <el-table-column
                        label="用户名称"
                        width="200">
                        <template slot-scope="scope">{{ scope.row.account }}</template>
                        </el-table-column>

                        <!-- 用户组 -->
                        <el-table-column
                        prop="userGroup"
                        label="用户组"
                        width="200">
                        </el-table-column>

                        <!-- 日期 -->
                        <el-table-column
                        label="日期"
                        width="200">
                            <template slot-scope="scope">{{ scope.row.ctime | filterCtime}}</template>
                        </el-table-column>
                        
                        <!-- 编辑 -->
                        <el-table-column label="编辑">
                            <template slot-scope="scope">
                                <el-button
                                size="mini"
                                type="primary"
                                @click="handleEdit(scope.row.id)">
                                <i class="el-icon-edit"></i>
                                修改
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
                <div class="block" style="margin-top:30px">
                    <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[5, 10, 15, 20]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                    </el-pagination>
                </div>
                <!-- 添加两个批量删除和取消选择按钮 -->
                <div style="margin-top: 20px">
                    <el-button type="danger" size='small' @click="batchDel">批量删除</el-button>
                    <el-button type="primary" size='small' @click="toggleSelection">取消选择</el-button>
                </div>    
                <!-- 弹出的编辑模态框 -->
                <el-dialog title="账号修改" :visible.sync="Visible" width="400px">
                    <!-- 需要修改的表单 -->
                    <el-form :model="editform" :rules="rules" ref="editForm">
                        <el-form-item label="账号" prop="account" label-width="100px">
                        <el-input v-model="editform.account" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="用户组" label-width="100px">
                        <el-select v-model="editform.userGroup" placeholder="请选择用户组">
                            <el-option label="超级管理员" value="超级管理员"></el-option>
                            <el-option label="普通会员" value="普通会员"></el-option>
                        </el-select>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="Visible = false">取 消</el-button>
                        <el-button type="primary" @click="saveEdit">确 定</el-button>
                    </div>
                </el-dialog>
            </div>
        </el-card>
    </div>
</template>

<script>
    //引入已经安装好了的moment模块，目的为了改变表格中的时间排版样式
    import moment from 'moment'
    //引入api
    import {accountEdit,accountsaveEdit,accountsaveDelete,accountbatchDel,accountByPage} from "@/api/accounts.js"
    export default {
        data(){
            return{
               AccountTableData:[],
               currentPage:1,
               pageSize:5,
               total:0,
               Visible: false, // 修改模态框的显示和隐藏状态
               editform:{//修改表单
                  account:'',
                  userGroup:''
               },
               editId:'',
               rules:{
                   account:[
                       { required: true, message: '账号不能为空', trigger: 'blur' },
                       { min: 3, max: 6, message:'长度3 ~ 6位', trigger: 'change' }
                   ]
               },
               delIdall:[]//定义一个批量删除ID的数组
            }
        },
        methods:{
            
            //修改
            handleEdit(id){
                // 弹出模态框
                 this.Visible=true,
                  // 保留id 这个id就是要修改的数据的id
                 this.editId=id,
                //传入id,发送数据给后端同时弹出修改框
                 accountEdit({id})
                .then(res=>{
                    //接收响音回来的数据
                    let {data}=res
                    //插入到表单中
                    this.editform.account=data[0].account
                    this.editform.userGroup=data[0].userGroup
                })
                .catch(err=>{
                    console.log(err);
                    
                })
            },
            //保存
            saveEdit(){
                //前端表单全部通过验证
                this.$refs.editForm.validate((valid)=>{
                    if(valid){
                        //全部通过后
                        this.Visible=false;
                        //收集用户修改的数据，发送数据给后台
                        let params={
                            account:this.editform.account,
                            userGroup:this.editform.userGroup,
                            id:this.editId
                        }
                        //发送请求数据
                        accountsaveEdit(params)
                        .then(res=>{
                                //接收后台响应回来的数据
                                let {code,msg}=res;
                                //判断
                                if(code===0){
                                    //成功
                                    this.$message({
                                                type: 'success',
                                                message: msg
                                            })
                                    //重新请求数据，刷新页面
                                    this.getAccountsByPage()
                                }else if(code===1){
                                    //失败
                                    this.$message.error( msg )
                                }
                        })
                        .catch(err=>{
                            console.log(err);
                            
                        })

                    }else{
                        return false
                    }
                })
               
            },
            //删除
            handleDelete(id){
                //为了用户防止误删除，给个优化
                this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    })
                    .then(() => {
                            //传入ID，发送请求告知后端
                            accountsaveDelete({id})
                            .then(res=>{
                                let {code,msg}=res;
                                //判断
                                if(code===0){//删除成功
                                    this.$message({
                                        message:msg,
                                        type: 'success'
                                        });
                                        //根据逻辑，删除后用户应能第一时间看到直观结果，所以刷新页面也就是重新在请求一次数据，调用函数
                                        this.getAccountsByPage()
                                }else if(code===1){//删除失败
                                    this.$message.error(msg);
                                }
                            })
                            .catch(err=>{
                                console.log(err)
                                
                            })
                    })
                    .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });
              
            },
            //取消选择
            toggleSelection(){
               this.$refs.AccountTable.clearSelection();
            },
            // 表格选中状态改变事件
            selectChange(selectData){//selectData是自动传入的数据
                this.delIdall=selectData.map(v=>v.id)//v是selectData中一个对象，循环每一个对象中的ID并放进一个新数组
            },
            //批量删除
            batchDel(){
               //优化体验，假如未选中或者为空还一直点批量删除还在发请求就会造成后台服务器崩溃，所以要处理这种情况
               if(!this.delIdall.length){
                   this.$message.error("请选择后再删除")
                   return false
               }
               //优化用户体验防止误删
                    this.$confirm('你确定要删除所选内容吗', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                   }).then(() => {
                    let idArr=this.delIdall
                    //发送选中框的所有ID给后台
                    accountbatchDel({idArr})
                    // this.req.get('http://127.0.0.1:888/account/accounteditdel',{
                    //     params:{
                    //         idArr
                    //     }
                    // })
                    .then(res=>{
                    //接受后端的响应数据
                    let {code,msg}=res;
                    if(code===0){
                        //成功
                        this.$message({
                            type:'success',
                            message:msg
                        })
                        //重新刷新页面
                        this.getAccountsByPage()
                    }else if(code===1){
                        //失败
                        this.$message.error(msg)
                    }
                    
                })
                .catch(err=>{
                    console.log(err)
                })
                   }).catch(() => {
                    this.$message({
                    type: 'info',
                    message: '已取消删除'
                    });          
              });

            },
            //（每页条数）改变
            handleSizeChange(pagesize){
                this.pageSize=pagesize;//把用户选择的每页条数，赋值给data中的pageSize
                this.getAccountsByPage()//调用分页函数
            },
            //（当前页）改变 
            handleCurrentChange(currentpage){
                this.currentPage=currentpage//把用户选择的当前页，赋值给data中的currentPage
                this.getAccountsByPage()

            },
            //定义分页函数，请求数据
            getAccountsByPage(){
                 //收集用户参数currentPage  pageSize
                 let params={
                    pageSize:this.pageSize,
                    currentPage:this.currentPage
                 }
                 //发送数据给后台
                 accountByPage(params)
                 .then(res=>{
                    let {total,data}=res
                    this.AccountTableData=data
                    this.total=total
                     // 边界判断
                    if (!data.length && this.currentPage !== 1) {
                        this.currentPage -= 1;
                        this.getAccountsByPage();
                    }
                 })
                 .catch(err=>{
                     console.log(err);
                     
                 })
            },
            //请求所有账号的数据,定义这个函数目的为了将来刷新页面可以多次调用
            // getaccounts(){
            //      this.req.get('http://127.0.0.1:888/account/accountlist')
            //             .then(response=>{
            //             //接收后台的响应数据
            //             let {data}=response.data;
            //             //渲染表格
            //             this.AccountTableData=data
                        
            //             })
            //             .catch(err=>{
            //                 console.log(err);
                            
            //             })
            // }
        },
        //生命周期created阶段发送axions
        created(){
             this.getAccountsByPage()
        },
        //过滤器
        filters:{
           filterCtime(ctime){
               return moment(ctime).format('YYYY-MM-DD hh:mm:ss')
           }
        }
    }
</script>

<style lang="less">
    .Account-Manage{
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