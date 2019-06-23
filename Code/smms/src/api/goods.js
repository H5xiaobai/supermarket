/* 
 商品请求地址
*/
import req from '@/utils/request.js'

//商品添加
export function goodsAdd(params){
    return req.post('/goods/goodsadd',params)
}
//商品  编辑
export function goodsEdit(params){
    return req.get('/goods/goodsmodify',params)
}
//商品  确认编辑
export function goodsenterEdit(params){
    return req.post('/goods/goodssave',params)
}
//商品  单键删除
export function goodsDelete(params){
    return req.get('/goods/goodsdel',params)
}
//商品  批量删除
export function goodsbatchdel(params){
    return req.get('/goods/goodssomedel',params)
}
//商品  分页
export function goodsbypage(params){
    return req.get('/goods/goodspaging',params)
}

// echarts 请求数据
export function getEcharts(params){
    return req.get('/goods/getecharts',params)
}
