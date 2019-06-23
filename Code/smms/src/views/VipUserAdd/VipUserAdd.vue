<template>
    <div class="vipuser-add">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
                <h3 class="title">账号添加编辑</h3>
            </div>
           <div>
              <el-form :model="VipAddForm"
                       :rules="rules"
                       ref="VipAddForm"
                       label-width="100px"
                       size='small'
                       style="width:400px"
                >   
                   <!-- 真实姓名 -->
                    <el-form-item label="真实姓名" prop="Realname">
                       <el-input v-model="VipAddForm.Realname"></el-input>
                    </el-form-item>

                    <!-- 会员卡卡号 -->
                    <el-form-item label="会员卡卡号" prop="Vipcard">
                       <el-input v-model="VipAddForm.Vipcard"></el-input>
                    </el-form-item>
                    
                    <!--用户组  -->
                    <el-form-item label="用户组" prop="Groups">
                      <el-select v-model="VipAddForm.Groups" placeholder="请选择">
                         <el-option label="普通会员60%" value="普通会员"></el-option>
                         <el-option label="黄金会员20%" value="黄金会员"></el-option>
                         <el-option label="白金会员10%" value="白金会员"></el-option>
                         <el-option label="钻石会员10%" value="钻石会员"></el-option>
                      </el-select>
                    </el-form-item>
                    
                    <!-- 身份证 -->
                    <el-form-item label="身份证号" prop="Idcard">
                       <el-input v-model="VipAddForm.Idcard"></el-input>
                    </el-form-item>

                    <!-- 用户状态 -->
                     <el-form-item label="用户状态" prop="Userstatus">
                        <el-radio-group v-model="VipAddForm.Userstatus">
                        <el-radio label="启用" value="启用"></el-radio>
                        <el-radio label="禁用" value="禁用"></el-radio>
                        </el-radio-group>
                    </el-form-item>
                    
                    <!-- 手机 -->
                    <el-form-item label="手机" prop="tel">
                       <el-input v-model="VipAddForm.tel"></el-input>
                    </el-form-item>

                    <!-- 座机 -->
                    <el-form-item label="座机" prop="Landline">
                       <el-input v-model="VipAddForm.Landline"></el-input>
                    </el-form-item>

                    <!-- 邮箱地址 -->
                    <el-form-item label="邮箱地址" prop="Emailaddress">
                       <el-input v-model="VipAddForm.Emailaddress"></el-input>
                    </el-form-item>
                    
                    <!-- 地区选择 -->
                    <el-form-item label="地区选择" required>
                            <el-col :span="11"> 
                                <el-form-item  prop='Province'>
                                    <!-- 省份 -->
                                <el-select v-model="VipAddForm.Province" placeholder="请选择" style="margin-right:5px">
                                    <el-option label="四川省" value="四川省"></el-option>
                                    <el-option label="北京市" value="北京市"></el-option>
                                    <el-option label="上海市" value="上海市"></el-option>
                                    <el-option label="重庆市" value="重庆市"></el-option>
                                </el-select>
                                </el-form-item>
                            </el-col>   
                                <!-- 城市 -->
                            <el-col :span="11">     
                                <el-form-item prop='city'>   
                                <el-select v-model="VipAddForm.city" placeholder="请选择">
                                    <el-option label="成都" value="成都"></el-option>
                                    <el-option label="北京" value="北京"></el-option>
                                    <el-option label="上海" value="上海"></el-option>
                                    <el-option label="重庆" value="重庆"></el-option>
                                </el-select>
                                </el-form-item>
                             </el-col>    
                    </el-form-item>
                    <!-- 详细地址 -->
                     <el-form-item label="详细地址" prop="Address">
                        <el-input v-model="VipAddForm.Address"></el-input>
                     </el-form-item>

                     <!-- 邮政编码 -->
                       <el-form-item label="邮政编码" prop="Postalcode">
                       <el-input v-model="VipAddForm.Postalcode"></el-input>
                    </el-form-item>

                    <!-- 按钮 -->
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
    import {pwdReg,realName,VipNum,IdNum,telNum,zuojiNum,EmailNum,HomeAddress,Emailcode} from '@/utils/res.js'
    //引入该页面的api
    import {vipAdd} from '@/api/vipaccounts.js'
    export default {
        data(){
            //真实姓名
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
            //座机
            const landline=(rule,value,callback)=>{
                if(value===''){
                    callback(new Error('座机号不能为空'))
                }else if(!zuojiNum(value)){
                    callback(new Error('请输入有效座机号码'))
                }else{
                    callback()
                }
            }
            //邮箱地址
             const emailaddress=(rule,value,callback)=>{
                if(value===''){
                    callback(new Error('邮箱地址不能为空'))
                }else if(!EmailNum(value)){
                    callback(new Error('请输入正确的邮箱地址'))
                }else{
                    callback()
                }
            }
            //邮政编码地址
             const postalcode=(rule,value,callback)=>{
                if(value===''){
                    callback(new Error('邮政编码地址不能为空'))
                }else if(!Emailcode(value)){
                    callback(new Error('开头不能为0，共6位'))
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
                VipAddForm:{
                    Realname:'',
                    Vipcard:'',
                    Groups:'',
                    Idcard:'',
                    Userstatus:'',
                    tel:'',
                    Landline:'',
                    Emailaddress:'',
                    Province:'',
                    city:'',
                    Address:'',
                    Postalcode:''

                },
                rules:{
                    Realname:[
                        { required: true, validator: realname, trigger: 'blur' }
                    ],
                    Vipcard:[
                        { required: true, validator: vipcard, trigger: 'blur' }
                    ],
                    Groups:[
                        { required: true, message: '请选择用户组', trigger: 'change' }
                    ],
                    Idcard:[
                        { required: true, validator:idcard, trigger: 'blur' }
                    ],
                    Userstatus:[
                        { required: true,message: '请选择用户状态', trigger: 'change' }
                    ],
                    tel:[
                        { required: true, validator:telnum, trigger: 'blur' }
                    ],
                    Landline:[
                        { required: true, validator:landline, trigger: 'blur' }
                    ],
                    Emailaddress:[
                        { required: true, validator:emailaddress, trigger: 'blur' }
                    ],
                    Province:[
                        { required: true, message: '请输入省份', trigger: 'change' }
                    ],
                    city:[
                        { required: true, message: '请输入所在城市', trigger: 'change' }
                    ],
                    Address:[
                        { required: true, validator:address, trigger: 'blur' }
                    ],
                    Postalcode:[
                        { required: true, validator:postalcode, trigger: 'blur' }
                    ]
                }
            }
        },
        methods:{
           //添加
           submitForm(){
              this.$refs.VipAddForm.validate((success)=>{
                  if(success){
                      //获取用户数据
                      let params={
                          Realname:this.VipAddForm.Realname,
                          Vipcard:this.VipAddForm.Vipcard,
                          Groups:this.VipAddForm.Groups,
                          Idcard:this.VipAddForm.Idcard,
                          Userstatus:this.VipAddForm.Userstatus,
                          tel:this.VipAddForm.tel,
                          Landline:this.VipAddForm.Landline,
                          Emailaddress:this.VipAddForm.Emailaddress,
                          Province:this.VipAddForm.Province,
                          city:this.VipAddForm.city,
                          Address:this.VipAddForm.Address,
                          Postalcode:this.VipAddForm.Postalcode
                      }
                    //   console.log(params);
                            vipAdd(params)
                             .then(res=>{
                                 let {code,msg}=res;
                                 if(code===0){
                                     //成功
                                      this.$message({
                                    message:msg,
                                    type: 'success'
                                    });
                                    //跳转
                                    this.$router.push('/home/VipUser')

                                }else if(code===1){
                                    //失败
                                    this.$message(msg)
                                }
                                
                                 
                             })
                             .catch(err=>{
                                 console.log(err);
                                 
                             })
                      
                  }else{
                     alert('验证不能通过')
                     return false
                  }
              })
           } ,
           //重置
           resetForm(){
             this.$refs.VipAddForm.resetFields()
           }
        }
    }
</script>

<style lang="less">
  .vipuser-add{
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