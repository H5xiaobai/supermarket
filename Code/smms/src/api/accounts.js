/* 

    账号管理模块
*/

//引入axios封装get和post模块文件
import req from '@/utils/request.js'

//账号添加模块
export function accountAdd(params){
    return req.post('/account/accountadd',params)
}


//账号列表   修改
export function accountEdit(params){
    return req.get('/account/accountedit',params)
}
//账号列表   保存修改
export function accountsaveEdit(params){
    return req.post('/account/saveedit',params)
}
//账号列表   单键删除
export function accountsaveDelete(params){
    return req.get('/account/accountdel',params)
}
//账号列表   批量删除
export function accountbatchDel(params){
    return req.get('/account/accounteditdel',params)
}
//原密码 验证
export function oldpass(params){
    return req.post('/account/oldpwd',params)
}
//新密码 提交确定
export function newpass(params){
     return req.post('/account/newpwd',params)
}

//账号列表   分页
export function accountByPage(params){
    return req.get('/account/accountlistbypage',params)
}

//获取当前登陆个人信息
export function PersonalInfo(){
    return req.get('/account/personalinfo')
}


//分配员工的权限  请求
export function userRoot(){
    return req.get('/account/userroot')
}