/* 
登陆的请求
*/

import req from '@/utils/request'

//登陆界面
export function loginCheck(params){
    return req.post('/login/checklogin',params)
}
