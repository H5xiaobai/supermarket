/* 
商品入库请求
*/
import req from '@/utils/request.js'

//商品 入库
export function addStcok(params){
    return req.post('/stock/instock',params)
}
//商品 单键删除
export function delStcok(params){
    return req.get('/stock/stockdel',params)
}
//商品 编辑
export function stockEdit(params){
    return req.get('/stock/stockedit',params)
}
//商品  编辑后保存
export function stocksaveEdit(params){
    return req.post('/stock/stocksaveEdit',params)
}
//批量删除
export function stockdelSome(params){
    return req.get('/stock/stockdelsome',params)
}

//分页
export function stockByPage(params){
    return req.get('/stock/stocklist',params)
}