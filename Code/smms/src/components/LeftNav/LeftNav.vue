<template>
    <div class="Left-Nav">
            <!-- title -->
            <h3 class="title">
                <i class="systemName">永辉超市</i>
                <img src="./logo.jpg" alt="">
            </h3>
            <!-- 导航栏 -->
            <el-menu
            :default-active="$route.path"
            class="el-menu-vertical-demo"
            unique-opened
            router
            active-text-color='rgb(64, 158, 255)'
            >
                <el-submenu :index="(index+1)+''" v-for="(menu,index) in leftNav" :key="index">
                    <template slot="title">
                        <i :class="menu.iconCls"></i>
                        <span>{{menu.navTitle}}</span>
                    </template>
                    <el-menu-item-group v-for="(son,i) in menu.children" :key='i'>
                        <el-menu-item :index="son.path">{{son.navChild}}</el-menu-item>
                    </el-menu-item-group>
                </el-submenu>          
        </el-menu>
    </div>
</template>

<script>
//引入api中权限分配请求
import {userRoot} from '@/api/accounts'
    export default {
        data(){
            return{
                leftNav:[]
             
            }
        },
        created(){
            //发送请求
            userRoot()
             .then(res=>{
                 //接受请求
                 let {rooter}=res;
                //  console.log(rooter);
                 let nav=[
                    {iconCls:"el-icon-setting",
                     navTitle:"系统信息",
                     rooter:['超级管理员','普通用户'],
                     children:[
                        {path:"/home/SystemInfo",navChild:'系统信息'}
                        ]
                    },
                    {
                    iconCls:'el-icon-user-solid',
                    navTitle:'账号管理',
                    rooter:['超级管理员'],
                    children:[
                        {path:"/home/AccountManage",navChild:'账号管理'},
                        {path:"/home/AccountAdd",navChild:'添加账号'},
                        {path:"/home/PasswordModify",navChild:'密码修改'}
                        ]
                    },
                    {
                    iconCls:"el-icon-s-goods",
                    navTitle:"商品管理",
                    rooter:['超级管理员','普通用户'],
                    children:[
                        {path:"/home/GoodsManage",navChild:'商品管理'},
                        {path:"/home/GoodsAdd",navChild:'商品添加'}
                        ]
                    },
                    {
                    iconCls:"el-icon-tickets",
                    navTitle:"统计管理",
                    rooter:['超级管理员'],
                    children:[
                        {path:"/home/SellTotal",navChild:'销售统计'},
                        {path:"/home/StockTotal",navChild:'进货统计'}
                        ]
                    },
                    {
                    iconCls:"el-icon-user",
                    navTitle:"会员管理",
                    rooter:['超级管理员'],
                    children:[
                        {path:"/home/VipUser",navChild:'账号管理'},
                        {path:"/home/VipUserAdd",navChild:'添加账号'}
                        ]
                    },
                    {
                    iconCls:"el-icon-s-cooperation",
                    navTitle:"进货管理",
                    rooter:['超级管理员','普通用户'],
                    children:[
                        {path:"/home/StockManage",navChild:'库存管理'},
                        {path:"/home/AddStock",navChild:'添加库存'}
                        ]
                    }
                 ]
                 //过滤函数，判断是超级管理员或者是普通用户
                 this.leftNav=nav.filter(v=>v.rooter.includes(rooter))
             })
             .catch(err=>{
                 console.log(err);
                 
             })
        }
    }
</script>

<style lang="less">
   .Left-Nav{
       .title{
           width:100%;
           height:100%;
           color: #fff;
           font-size: 18px;
           margin: 20px auto;
           display: flex;
           justify-content: center;
           align-items: center;
           .systemName{
               display:inline-block;
           }
           img{
               width:50%;
               height:50%;
               border-radius:6px;
           }
       }
       .el-menu{
           border-right:none;
           background-color:  #2d3a4b;
           .el-submenu{
               .el-submenu__title{
                   color: #fff;
                   i{
                       color: #fff;
                   }
               }
               &>.el-menu{
                   .el-menu-item-group{
                       .el-menu-item{
                           color:#fff;
                       }
                   }
               }
           }
       }
       
   }
</style>