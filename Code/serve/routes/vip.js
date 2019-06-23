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
// router.get('/',(req,res)=>{
// 	res.send('通了')
// })
//获取表单数据
router.post('/vipadd',(req,res)=>{
	let {Realname,Vipcard,Groups,Idcard,Userstatus,tel,Landline,Emailaddress,Province,city,Address,Postalcode}=req.body;
	// console.log(Realname,Vipcard,Groups,Idcard,Userstatus,tel,Landline,Emailaddress,Province,city,Address,Postalcode)
    //准备sql
	let sqlStr=`insert into vipaccounts(Realname,Vipcard,Groups,Idcard,Userstatus,tel,Landline,Emailaddress,Province,city,Address,Postalcode)
	 values('${Realname}','${Vipcard}','${Groups}','${Idcard}','${Userstatus}','${tel}','${Landline}','${Emailaddress}','${Province}','${city}','${Address}','${Postalcode}')`
	//执行sql
	connection.query(sqlStr,(err,data)=>{
		if (err) throw err
		if(data.affectedRows>0){
			res.send({code:0,msg:'添加成功'})
		}else{
			res.send({code:1,msg:'添加失败'})
		}
	})
})

//单行删除
router.get('/vipdel',(req,res)=>{
	//获取前端发来的ID
	let {id}=req.query;
	//准备Sql
	let sqlStr=`delete from vipaccounts where id=${id}`
	//执行sql
	connection.query(sqlStr,(err,data)=>{
		if (err) throw err;
		console.log(data)
		if(data.affectedRows>0){//删除成功
			res.send({code:0,msg:'删除成功'})
		}else{
			res.send({code:1,msg:'删除失败'})
		}
	})
})

//编辑修改，回填表单
router.get('/vipbackfill',(req,res)=>{
	//接受前端传来的id
	let {id}=req.query;
	//准备sql查询
	let sqlStr=`select * from vipaccounts where id=${id}`
	//执行sql
	connection.query(sqlStr,(err,data)=>{
		if (err) throw err
		res.send({data})
	})
})

//确认修改
router.post('/vipsavenum',(req,res)=>{
	//接收参数
	let {Realname,Vipcard,Idcard,tel,Address,oldId}=req.body;
	//准备sql
	let sqlStr=`update vipaccounts set Realname='${Realname}',Vipcard='${Vipcard}',Idcard='${Idcard}',tel='${tel}',Address='${Address}' where id=${oldId}`
	 //执行sql
	 connection.query(sqlStr,(err,data)=>{
		 if (err) throw err;
		//  console.log(data);
		 if(data.affectedRows>0){
			 //表示成功
			 res.send({code:0,msg:'修改成功'})
		 }else{
			 //表示修改失败
			 res.send({code:1,msg:'修改失败'})
		 }
	 })
})

//批量删除
router.get('/vipbatch',(req,res)=>{
	 //接收参数id们
	 let {idArr}=req.query;
	 //准备sql
	 let sqlStr=`delete from vipaccounts where id in (${idArr})`
	 //执行sql
	 connection.query(sqlStr,(err,data)=>{
		  if(err) throw err
		  if(data.affectedRows>0){
			  //表示成功
			  res.send({code:0,msg:'删除成功'})
		  }else{
			  //失败
			  res.send({code:1,msg:'删除失败'})
		  }
	 })
})

//分页数据
router.get('/vippage',(req,res)=>{
	//接受前台传过来的每一页的数据和当前页
	let {pagesize,currentpage}=req.query;
	//定义变量保存总数据条数
	let total;
	//准备sql
	let sqlStr=`select * from vipaccounts`
	//执行sql
	connection.query(sqlStr,(err,data)=>{
		if (err) throw err;
		total=data.length;	
	})
	 let n=(currentpage-1)*pagesize
	//当前页对应的数据条数
	sqlStr+=` limit ${n},${pagesize}`
	//执行sql
	connection.query(sqlStr,(err,data)=>{
		if (err) throw err;
		res.send({data,total})
	})
})
module.exports=router;