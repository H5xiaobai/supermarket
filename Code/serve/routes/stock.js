var express=require('express')
var router=express.Router()
//连接数据库
var connection=require('./js/conn')

//拦截所有请求
const expressJwt = require('express-jwt');//引入token模块
//密钥
const secret = 'itsource';
//验证token合法性
router.use(expressJwt ({
  secret
}).unless({
  path: ['/login/checklogin']  //排除不需要验证的URL，其他的URL都需要验证
}));
//拦截器
router.use(function (err, req, res, next) {
  //当token验证失败时会抛出如下错误
  if (err.name === 'UnauthorizedError') {   
      //这个需要根据自己的业务逻辑来处理（ 具体的err值 请看下面）
      res.status(401).send('token无效');
  }
});
//-------------------------
//设置跨域头
router.all('*',(req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*')
    res.header("Access-Control-Allow-Headers", "authorization ");//允许携带这个响应信息
	next()
})

//商品入库
router.post('/instock',(req,res)=>{
    //接受数据
    let {goodcode,goodname,goodnum,costprice}=req.body;
    //准备sql
    let sqlStr=`insert into goodsstock(goodcode,goodname,goodnum,costprice) value('${goodcode}','${goodname}','${goodnum}','${costprice}')`
    //执行sql
    connection.query(sqlStr,(err,data)=>{
        if (err) throw err
        if(data.affectedRows>0){
            res.send({code:0,msg:'入库成功'})
        }else{
            res.send({code:1,msg:'入库失败'})
        }
        
    })
})

//库存  分页列表
router.get('/stocklist',(req,res)=>{
      //接收分页数量和当前页
      let {pageSize,currentPage}=req.query;
      //准备sql
      let sqlStr=`select * from goodsstock order by ctime desc`
      //定义变量保存总数量
      let total;
      //执行sql
      connection.query(sqlStr,(err,data)=>{
          if (err) throw err
          total=data.length
      })
      //获取每一页的数据数量
      let n=(currentPage-1)*pageSize
      sqlStr += ` limit ${n},${pageSize}`
      //执行sql
      connection.query(sqlStr,(err,data)=>{
          if (err) throw err
          res.send({data,total})
      })
})

//库存  单键删除
router.get('/stockdel',(req,res)=>{
    let {id}=req.query
    //准备sql
    let sqlStr=`delete from goodsstock where id=${id}`
    //执行sql
    connection.query(sqlStr,(err,data)=>{
          if (err) throw err
          if(data.affectedRows>0){
              res.send({code:0,msg:'删除成功'})
          }else{
              res.send({code:1,msg:'删除失败'})
          }
           
    })
})


//库存  编辑修改
router.get('/stockedit',(req,res)=>{
    //接收id
    let {id}=req.query;
    //准备sql
    let sqlStr=`select * from goodsstock where id=${id}`
    //执行sql
    connection.query(sqlStr,(err,data)=>{
        if (err) throw err
        res.send({data})
    })
})

//库存  编辑后保存
router.post('/stocksaveEdit',(req,res)=>{
    let {goodcode,goodname,goodnum,costprice,id}=req.body;
    //准备sql
    let sqlStr=`update goodsstock set goodcode='${goodcode}',goodname='${goodname}',goodnum='${goodnum}',costprice='${costprice}' where id=${id}`
    //执行sql
    connection.query(sqlStr,(err,data)=>{
        if (err) throw err
        if(data.affectedRows>0){
            res.send({code:0,msg:'修改成功'})
        }else{
            res.send({code:1,msg:'修改失败'})
        }  
    })
})


//库存  批量删除
router.get('/stockdelsome',(req,res)=>{
    //接收参数
    let {idArr}=req.query;
    //准备sql
    let sqlStr=`delete from goodsstock where id in (${idArr})`
    //执行sql
    connection.query(sqlStr,(err,data)=>{
         if (err) throw err
         if(!data.length){
             //成功
             res.send({code:0,msg:"删除成功"})
         }else{
             //失败
             res.send({code:1,msg:'删除失败'})
         }
    })
})
// 暴露路由
module.exports=router;