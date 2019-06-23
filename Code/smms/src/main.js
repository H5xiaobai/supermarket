import Vue from 'vue'
import App from './App.vue'
import router from './router'
//引入重置样式
import './assets/css/reset.css'
//引入公共样式
import './assets/css/common.css'
import ElementUI from 'element-ui'; // 引入JS组件
import 'element-ui/lib/theme-chalk/index.css'; // 引入css样式
Vue.use(ElementUI);
//引入对本地存储的操作函数
import local from '@/utils/local'
// import axios from 'axios'//引入axios
// import qs from 'qs' //引入qs

//引入echarts报表
import echarts from 'echarts'
Vue.prototype.echarts=echarts
//设置路由守卫 拦截路由
router.beforeEach((to,from,next)=>{
    //获取token
    let token=local.get('d-c')
    if(token){
      next()//有token就放行
    }else{
       if(to.path==='/login'){
          next()//放行
       }else{
         next({path:'/login'})//如果去其他页面，就让它跳去登陆页面才能访问内部
       }
    }
})
//将引入的axios，qs挂在原型方法上
// Vue.prototype.req=axios
// Vue.prototype.qs=qs

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
