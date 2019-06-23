/* 
 封装get和post请求(axios封装)
*/

//引入axios和qs
import axios from 'axios'
import qs from 'qs'
//引入对本地存储的操作函数
import local from '@/utils/local'
//设置请求默认请求地址
axios.defaults.baseURL = 'http://127.0.0.1:888'

//设置请求拦截器
axios.interceptors.request.use(function(config) {
    //获取token
    let token=local.get('d-c')
    config.headers.authorization = `Bearer ${token}` 
    return config;
})


export default{
    get(url,params={}){
        return new Promise((resolve,reject)=>{
             axios.get(url,{params})
                  .then(response=>{
                      resolve(response.data)
                  })
                  .catch(err=>{
                      reject(err)
                  })
       })
    },
    post(url,params={}){
           return new Promise((resolve,reject)=>{
               axios.post(url,qs.stringify(params))
                    .then(response=>{
                         resolve(response.data)
                    })
                    .catch(err=>{
                        reject(err)
                    })
           })
    }
    
}