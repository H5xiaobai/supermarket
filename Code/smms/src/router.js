import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
     {path:'/',redirect:'/login'},
     {path:'/login',component:()=>import('./views/Login/Login.vue')},
     { 
       path:'/home',component:()=>import('./views/Home/Home.vue'),
       redirect:'/home/SystemInfo',
       children:[
        {path:'/home/AccountAdd',component:()=>import('./views/AccountAdd/AccountAdd.vue')},
        {path:'/home/AccountManage',component:()=>import('./views/AccountManage/AccountManage.vue')},
        {path:'/home/GoodsAdd',component:()=>import('./views/GoodsAdd/GoodsAdd.vue')},
        {path:'/home/GoodsManage',component:()=>import('./views/GoodsManage/GoodsManage.vue')},
        {path:'/home/PasswordModify',component:()=>import('./views/PasswordModify/PasswordModify.vue')},
        {path:'/home/SellTotal',component:()=>import('./views/SellTotal/SellTotal.vue')},
        {path:'/home/StockTotal',component:()=>import('./views/StockTotal/StockTotal.vue')},
        {path:'/home/SystemInfo',component:()=>import('./views/SystemInfo/SystemInfo.vue')},
        {path:'/home/VipUserAdd',component:()=>import('./views/VipUserAdd/VipUserAdd.vue')},
        {path:'/home/VipUser',component:()=>import('./views/VipUser/VipUser.vue')},
        {path:'/home/AddStock',component:()=>import('./views/AddStock/AddStock.vue')},
        {path:'/home/StockManage',component:()=>import('./views/StockManage/StockManage.vue')},
        // 个人中心
        {path:'/home/personal',component:()=>import('./views/Personal/Personal.vue')}
       ]
     }
  ]
})
