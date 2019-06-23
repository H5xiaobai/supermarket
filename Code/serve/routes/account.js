var express = require('express');
var router = express.Router();
//连接数据库
let connection=require('./js/conn.js')

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
//配置所有跨域的请求头问题
router.all('*',(req,res,next)=>{
	res.header('Access-Control-Allow-Origin',"*")//*允许所有跨域
	res.header("Access-Control-Allow-Headers", "authorization ");
	//允许携带这个响应信息
	next()//放行
})
//第一步配好路由测试用的
// router.get('/',(req,res)=>{
// 	res.send('给你了')
// })

//账号列表  后台通过post接收前台数据
router.post('/accountadd',(req,res)=>{
	//获取前台数据
	let {account,password,userGroup}=req.body;
	// console.log(account,password,userGroup)
	//准备sql
	let sqlStr=`insert into accounts(account,password,userGroup) value('${account}','${password}','${userGroup}')`
	//执行sql
	connection.query(sqlStr,(err,data)=>{
		if (err) throw err;
		  //console.log(data)
		//根据受影响的行数判断添加是否成功同时响应数据给前台
		if(data.affectedRows>0){
			//表示成功,响应数据给前台
			res.send({code:0,msg:'添加成功'})
		}else{
			res.send({code:1,msg:'添加失败'})
		}
	})
})

//单键删除
router.get('/accountdel',(req,res)=>{
	//接收前端传来的id
	let {id}=req.query
	//准备sql
	let sqlStr=`delete from accounts where id=${id}`
	//执行sql
	connection.query(sqlStr,(err,data)=>{
		if (err) throw err
		// console.log(data)
		//根据打印结果，判断是否影响表里面的行
		if( data.affectedRows>0){//成功
		 res.send({code:0,msg:'删除成功'})	
		}else{//失败
		 res.send({code:1,msg:'删除失败'})
		}
  })
})

//修改回填数据
router.get('/accountedit',(req,res)=>{
	//获取ID
	let {id}=req.query;
	//准备sql
	let sqlStr=`select * from accounts where id=${id}`
	//执行sql
	connection.query(sqlStr,(err,data)=>{
		if (err) throw err
		res.send({data})//响应数据给前台
	})
})

//保存修改后的数据
router.post('/saveedit',(req,res)=>{
	//接受请求需要保存的数据
	let {account,userGroup,id}=req.body;
	//准备sql
	let sqlStr=`update accounts set account='${account}',userGroup='${userGroup}' where id=${id}`;
	// console.log(sqlStr)
	//执行sql
	 connection.query(sqlStr,(err,data)=>{
		 if(err) throw err
		 //判断
		 if(data.affectedRows>0){
			 //成功
			 res.send({code:0,msg:'修改成功'})
		 }else{
			 //失败
			 res.send({code:1,msg:'修改失败'})
		 }
	 })
})
module.exports = router;

//批量删除
router.get('/accounteditdel',(req,res)=>{
	//接受前台发过来的要删除批量ID是个数组
	let {idArr}=req.query;
	//准备sql
	let sqlStr=`delete from accounts where id in (${idArr})`
	// console.log(sqlStr)
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

//分页

router.get('/accountlistbypage',(req,res)=>{
	//接收参数
	let {currentPage,pageSize}=req.query;
	//准备sql
	let sqlStr=`select * from accounts order by ctime desc`
	//定一个变量保存 数据总条数
	let total;
	//执行sql
	connection.query(sqlStr,(err,data)=>{
		 if (err) throw err
		  total=data.length//将拿到的数据总条数赋值给total
	})
	let n=(currentPage-1)*pageSize
	//获取每一页的数据
	sqlStr +=` limit ${n},${pageSize}`
	//执行sql
	connection.query(sqlStr,(err,data)=>{
		if (err) throw err
		res.send({total,data})
	})
})

//原密码  验证
router.post('/oldpwd',(req,res)=>{
	  let {oldPassword}=req.body;
	   //判断旧密码和登陆的密码是否一致
	   if(oldPassword===req.user.password){
		    res.send({code:0,msg:"原密码正确"})
	   }else{
		   res.send({code:1,msg:'原密码错误'})
	   }
})

//新密码 提交确定
router.post('/newpwd',(req,res)=>{
	let {newPassword}=req.body;
	//取出id
	let id=req.user.id
	//准备sql
	let sqlStr=`update accounts set password=${newPassword} where id=${id}`
	//执行sql
	connection.query(sqlStr,(err,data)=>{
		if (err) throw err
		if(data.affectedRows>0){
			//修改成功
			res.send({code:0,msg:'修改成功'})
		}else{
			res.send({code:1,msg:'修改失败'})
		}
		
	})
})

//-------------------------------------------------
//获取个人信息
router.get('/personalinfo',(req,res)=>{
	//获取当前登陆ID
	let id=req.user.id
	//准备sql
	sqlStr=`select * from accounts where id=${id}`
	//执行sql
	connection.query(sqlStr,(err,data)=>{
		if (err) throw err
		res.send({data})
		
	})
})

/* -----上传开始---- */ 
// 引入node上传模块
var multer = require('multer');

// 配置存储路径 和 重命名
var storage = multer.diskStorage({
    // 图片上传到服务器以后 要放置的路径
    destination: 'public/upload',

    // 图片重命名
    filename: function (req, file, cb) {
        var fileFormat =(file.originalname).split(".");
        // 获取时间戳
        var filename = new Date().getTime();  
        // 124354654 + "." + jpg
        cb(null, filename + "." + fileFormat[fileFormat.length - 1]);
    }
});

// 上传对象
var upload = multer({
    storage,
});

// 接收上传请求
router.post('/uploadavatar', upload.single('file'), (req, res) => {
    // 接收到的文件信息
	var file = req.file;
	console.log(file)

	// 文件名
	let fileName = file.filename;
	// 拼接文件路径
	let avatarUrl = '/upload/' + fileName

	// 构造sql
	const sqlStr = `update accounts set avatarUrl = '${avatarUrl}' where id=${req.user.id}`;
	// 执行sql
	connection.query(sqlStr, (err, data) => {
		if (err) throw err;
		if (data.affectedRows > 0) {
			res.send({code: 0, reason: "上传成功", avatarUrl})
		} else {
			res.send({code: 1, reason: "上传失败"})
		}
	})
})

/*-------上传结束-------- */ 


//员工  权限分配
router.get('/userroot',(req,res)=>{
      res.send({rooter:req.user.userGroup})
})