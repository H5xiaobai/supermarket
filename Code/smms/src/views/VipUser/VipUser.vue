<template>
    <div class="vip-user">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <h1 class="title">会员管理</h1>
            </div>
            <div class="item">
                <!-- 搜索框 -->
                <el-form :model="VipuserForm"
                         :rules="rules"
                         ref="VipuserForm"
                         label-width="100px"
                         size="small"
                >
                    <el-form-item label="搜索:" prop="content">
                        <el-input v-model="VipuserForm.content" style="width:250px"></el-input>
                        <span>会员卡，会员名,手机号</span>
                        <el-button  style="width:60px"
                        type="primary" @click="submitForm()">查询</el-button>
                    </el-form-item>
                </el-form>
                <!-- 表格 -->
                 <el-table
                    ref="VipuserTable"
                    :data="ViptableData"
                    tooltip-effect="dark"
                    style="width: 100%"
                    @selection-change="handleSelectionChange">
                    <el-table-column
                    type="selection"
                    width="55">
                    </el-table-column>

                     <el-table-column
                    prop="Realname"
                    label="真实姓名"
                    width="120">
                    </el-table-column>
                   
                    <el-table-column
                    prop="Vipcard"
                    label="会员卡号"
                    width="120">
                    </el-table-column>

                     <el-table-column
                    prop="Idcard"
                    label="身份证"
                    width="200"
                    show-overflow-tooltip>
                    </el-table-column>

                     <el-table-column
                    prop="tel"
                    label="手机号"
                    width="160"
                    show-overflow-tooltip>
                    </el-table-column>


                     <el-table-column
                    prop="Address"
                    label="详细地址"
                    width="200"
                    show-overflow-tooltip>
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
                        :current-page.sync="currentPage"
                        :page-sizes="[3, 6, 9, 12]"
                        :page-size="pageSize"
                        layout="total,sizes,prev,pager, next, jumper"
                        :total="total">
                        </el-pagination>
                </div>
                <!-- 批量删除和取消选择 -->
                <div style="margin-top: 20px">
                    <el-button @click="batchdel" type='danger' size="small">批量删除</el-button>
                    <el-button @click="cancelSelection" type='primary' size="small">取消选择</el-button>
                </div>
                <!-- 模态框 -->
                <el-dialog title="vip账户修改" :visible.sync="isVisible" width=400px>
                    <el-form :model="vipform" :rules="rules" ref="vipform">
                        <el-form-item label="真实姓名" prop="Realname" label-width="80">
                            <el-input v-model="vipform.Realname" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="会员卡号" prop="Vipcard" label-width="80">
                            <el-input v-model="vipform.Vipcard" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="身份证" prop="Idcard" label-width="80">
                            <el-input v-model="vipform.Idcard" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="手机号" prop="tel" label-width="80">
                            <el-input v-model="vipform.tel" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="地址" prop="Address" label-width="80">
                            <el-input v-model="vipform.Address" autocomplete="off"></el-input>
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
   //引入工具函数
   import {realName,VipNum,IdNum,telNum,HomeAddress} from '@/utils/res.js'
   //引入api
   import {vipEdit,vipenterEdit,vipDelete,vipbatchdel,vipbypage} from '@/api/vipaccounts.js'
    export default {
        data(){
             // 真实姓名
            const realname=(rule,value,callback)=>{
                if(value===''){
                    callback(new Error('账户不能为空'))
                }else if(!realName(value)){
                    callback(new Error('账户只能是2~6位中文'))
                }else{
                    callback()
                }
            }
            //vip卡号
            const vipcard=(rule,value,callback)=>{
                 if(value===''){
                    callback(new Error('卡号不能为空'))
                }else if(!VipNum(value)){
                    callback(new Error('卡号只能是6位'))
                }else{
                    callback()
                }
            }
            // 身份证
            const idcard=(rule,value,callback)=>{
                if(value===''){
                    callback(new Error('身份证不能为空'))
                }else if(!IdNum(value)){
                    callback(new Error('请输入有效证件号'))
                }else{
                    callback()
                }
            }
            //手机号
            const telnum=(rule,value,callback)=>{
                if(value===''){
                    callback(new Error('手机号不能为空'))
                }else if(!telNum(value)){
                    callback(new Error('请输入有效手机11位号码'))
                }else{
                    callback()
                }
            }
            //详细家庭地址
             const address=(rule,value,callback)=>{
                if(value===''){
                    callback(new Error('详细家庭地址不能为空'))
                }else if(!HomeAddress(value)){
                    callback(new Error('请输入中文表示的地址,至少6个中文'))
                }else{
                    callback()
                }
            }
            return{
                VipuserForm:{
                    content:''
                },
                rules:{
                    content:[
                        { required: true, message: '请输入要查询的内容', trigger: 'blur' },
                    ],
                    Realname:[
                       { required: true, validator:realname, trigger: 'blur' }
                    ],
                    Vipcard:[
                        { required: true, validator:vipcard, trigger: 'blur' }
                    ],
                    Idcard:[
                         { required: true, validator:idcard, trigger: 'blur' }
                    ],
                    tel:[
                          { required: true, validator:telnum, trigger: 'blur' }
                    ],
                    Address:[
                          { required: true, validator:address, trigger: 'blur' }
                    ]
                },
                //表格
                ViptableData:[],
                currentPage:1,
                vipId:'',//用于保存id
                isVisible:false,
                vipform:{
                    Realname:'',
                    Vipcard:'',
                    Idcard:'',
                    tel:'',
                    Address:''
                },
                batchIdarr:[],//定义一个空数组收集多选框的id
                total:0,
                pageSize:3
            }
        },
        methods:{
            submitForm(){

            },
            //编辑
            handleEdit(id){
                 //弹出模态框
                 this.isVisible=true
                 //保存id,修改后下次发送给后端
                 this.vipId=id
                 //后台传入id发送请求，同时弹出模态框
                 vipEdit({id})
                //  this.req.get('http://127.0.0.1:888/vip/vipbackfill',{
                //      params:{
                //          id
                //      }
                //  })
                 .then(res=>{
                    //接收参数
                    let {data}=res;
                    
                    //回填进表单
                    this.vipform.Realname=data[0].Realname
                    this.vipform.Vipcard=data[0].Vipcard
                    this.vipform.Idcard=data[0].Idcard
                    this.vipform.tel=data[0].tel
                    this.vipform.Address=data[0].Address
                 })
                 .catch(err=>{
                     console.log(err);
                 })


            },
            //确认修改
            isenter(){
               //表单全部通过才能提交
                this.$refs.vipform.validate((valid)=>{
                    if(valid){
                    //全部通过
                       // 隐藏模态框
                        this.isVisible=false;
                        //把需要发送的id和用户修改后的数据用变量保存
                        let params={
                            Realname:this.vipform.Realname,
                            Vipcard:this.vipform.Vipcard,
                            Idcard:this.vipform.Idcard,
                            tel:this.vipform.tel,
                            Address:this.vipform.Address,
                            oldId:this.vipId
                        }
                        //将修改后的数据和已保存的id再次发送给后端
                       vipenterEdit(params)
                                .then(res=>{
                                    //就收后台响应的数据
                                    let {code,msg}=res;
                                    if(code===0){
                                        //修改成功，弹出提示告知客户
                                        this.$message({
                                            type:'success',
                                            message:msg
                                        })
                                        //刷新页面
                                        this.getVipbypage()
                                    }else if(code===1){
                                        //失败
                                        this.$message.error(msg)
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
                //做一个防误删除优化
                this.$confirm('你确定要继续删除吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    //发送请求将要删除的行的ID传给后端
                    vipDelete({id})
                    // this.req.get('http://127.0.0.1:888/vip/vipdel',{
                    //     params:{
                    //         id
                    //     }
                    // })
                    .then(res=>{
                        //接受后台反馈的信息
                        let {code,msg}=res;
                        //判断
                        if(code===0){
                            //成功删除
                            this.$message({
                                type:'success',
                                message:msg
                            })
                            //刷新页面，再次请求数据
                            this.getVipbypage()
                        }else if(code===1){
                            //删除失败
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
               this.$refs.VipuserTable.clearSelection()//内置方法
            },
            // 表格选中状态改变事件
             handleSelectionChange(selectiondata){//这个函数会自动传送选择的参数
                this.batchIdarr=selectiondata.map(v=>v.id)//v是对象，通过循环取到id放进一个新数组
            },
            //批量删除
            batchdel(){
                //判断用户是否选择，如果未选择，点击批量删除会造成后台服务器蹦掉
                if(!this.batchIdarr.length){
                    this.$message('请选择后再删除')
                    return 
                }
                //优化用户体验，防止误删，给个提示框
                 this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                     let idArr=this.batchIdarr
                      //发送批量删除的ID给后台
                    vipbatchdel({idArr})
                    // this.req.get('http://127.0.0.1:888/vip/vipbatch',{
                    //     params:{
                    //         idArr
                    //     }
                    // })
                    .then(res=>{
                        //接受后台响应的数据
                        let {code,msg}=res;
                        //判断
                        if(code===0){
                            //成功
                            this.$message({
                                type:'success',
                                message:msg
                            })
                            //刷新页面
                            this.getVipbypage()
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
            //每一页的数据数量
            handleSizeChange(pagesize){//都是形参
                this.pageSize=pagesize//用户选择每页的数据条数应该赋值给页面本身的pageSize，才能对应
                this.getVipbypage()
            },
            //当前页
            handleCurrentChange(currentpage){
                this.currentPage=currentpage//用户选择的第几页应该赋值给页面本身的currentPage，才能对应
                this.getVipbypage()
            },
            //定义一个分页函数,请求数据
            getVipbypage(){
               //收集用户数据
               let params={
                   pagesize:this.pageSize,
                   currentpage:this.currentPage
               }
               
               //发送数据给后台
               vipbypage(params)
            //    this.req.get('http://127.0.0.1:888/vip/vippage',{
            //        params
            //    })
                .then(res=>{
                    //接受后台数据
                    let {data,total}=res;
                    this.ViptableData=data;
                    this.total=total
                    //判断边界
                    if(!data.length && this.currentpage-1!==1){
                        this.currentpage-=1;
                         this.getVipbypage()
                    }  
                })
                .catch(err=>{
                    console.log(err)
                })
            }
        },
        created(){
            this.getVipbypage()
        }
    }
</script>

<style lang="less">
    .vip-user{
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