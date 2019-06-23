var express=require('express')
var router=express.Router()

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
    next()//放行
})
//引入数据库连接对象
var connection=require('./js/conn')

//商品添加
router.post('/goodsadd',(req,res)=>{
    //接收参数
    let {classify,goodBarCode,goodName,goodPrice,maketPrice,goodCostPrice,goodNum,goodWeight,goodUnit,vip,Promotion,introduce}=req.body;
    // 准备sql
     let sqlStr=`insert into goods(classify,goodBarCode,goodName,goodPrice,maketPrice,goodCostPrice,goodNum,goodWeight,goodUnit,vip,Promotion,introduce) value('${classify}','${goodBarCode}','${goodName}','${goodPrice}','${maketPrice}','${goodCostPrice}','${goodNum}','${goodWeight}','${goodUnit}','${vip}','${Promotion}','${introduce}')`


     //执行sql
     connection.query(sqlStr,(err,data)=>{
         if(err) throw err
         if(data.affectedRows>0){
             //成功
             res.send({code:0,msg:'添加成功'})
         }else{
             //失败
             res.send({code:1,msg:'添加失败'})
         }
     })
})

//商品管理列表
// router.get('/goodsmanage',(req,res)=>{
     
//      //准备sql
//      let sqlStr=`select * from goods`
//      //执行sql
//      connection.query(sqlStr,(err,data)=>{
//             if(err) throw err
//             res.send({data})
//      })
// })

//单键删除
router.get('/goodsdel',(req,res)=>{
    //接受id
    let {id}=req.query;
    //准备sql
    let sqlStr=`delete from goods where id=${id}`
    //执行sql
    connection.query(sqlStr,(err,data)=>{
         if (err) throw err
         if(data.affectedRows>0){
             //成功
             res.send({code:0,msg:'删除成功'})  
         }else{
             res.send({code:1,msg:'删除失败'})
         }  
    })
})

//商品回填
router.get('/goodsmodify',(req,res)=>{
     //接收参数
     let {id}=req.query;
     //准备sql
     let sqlStr=`select * from goods where id=${id}`
     //执行sql
     connection.query(sqlStr,(err,data)=>{
          if(err) throw err  
          res.send({data})
     })
})

//回填后保存数据
router.post('/goodssave',(req,res)=>{
    let {goodBarCode,goodName,classify,goodPrice,maketPrice,goodNum,goodCostPrice,oldId}=req.body;
    //准备sql
    let sqlStr=`update goods set goodBarCode='${goodBarCode}',goodName='${goodName}',classify='${classify}',goodPrice='${goodPrice}',maketPrice='${maketPrice}',goodNum='${goodNum}',goodCostPrice='${goodCostPrice}' where id=${oldId}`
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

//批量删除
router.get('/goodssomedel',(req,res)=>{
    //接收参数
    let {idArr}=req.query;
    //准备sql
    let sqlStr=`delete from goods where id in (${idArr})`
    //执行sql
    connection.query(sqlStr,(err,data)=>{
        if (err) throw err
        if(!data.length){//当前data的长度没了，表示删除了
              //删除成功
              res.send({code:0,msg:'已删除所选项'})
        }else{
            //失败
            res.send({code:1,msg:'删除失败'})
        }
        
    })
})

//分页
router.get('/goodspaging',(req,res)=>{
    let {pagesize,currentpage,classify,keyword}=req.query;
    
    //定义一个变量保存数据总条数
    let total;
    //准备sql
    let sqlStr=`select * from goods where 1=1`
    //判断
   if(classify!=='' && classify!== '全部分类'){
       //拼接第一个查询条件
       sqlStr +=` and classify='${classify}'`
   }
   // 如果第二个关键字不为空 那么就拼接sql
   if(keyword!==''){
       //拼装第二个查询条件
       sqlStr +=` and (goodName like '%${keyword}%' or goodBarCode like '%${keyword}%')`
   }
    
    //执行sql
    connection.query(sqlStr,(err,data)=>{
        if (err) throw err
        total=data.length
    })

    //定义变量简化代码
    let n=(currentpage-1)*pagesize
    //算取每一页对应的数据
    sqlStr +=` limit ${n},${pagesize}`
    //再次执行sql，将总数和每页对应的数量数据发送给前台
    connection.query(sqlStr,(err,data)=>{
         if(err) throw err
         res.send({total,data})
    })
})

//后端生成的echarts数据
router.get('/getecharts',(req,res)=>{
    res.send({
        xData:['06-01','07-12','08-12','9-12','10-12','11-12','12-12'],
        mainData:[1000,3000,2000,5000,8000,10000,4000]
    })
})
//暴露路由
module.exports=router;