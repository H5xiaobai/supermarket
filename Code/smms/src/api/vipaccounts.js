/* 
会员账号添加和管理接口
*/

//引入axios封装好的get和post
import req from '@/utils/request.js'

//账号添加接口
export function vipAdd(params){
    return req.post('/vip/vipadd',params)
}
//账号管理页面   编辑
export function vipEdit(params){
    return req.get('/vip/vipbackfill',params)
}
//账号管理页面   确认编辑
export function vipenterEdit(params){
    return req.post('/vip/vipsavenum',params)
}
//账号管理页面   单键删除
export function vipDelete(params){
    return req.get('/vip/vipdel',params)
}
//账号管理页面   批量删除
export function vipbatchdel(params){
    return req.get('/vip/vipbatch',params)
}
//账号管理页面   分页
export function vipbypage(params){
    return req.get('/vip/vippage',params)
}