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

//设置响应头解决跨域
router.all('*',(req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header("Access-Control-Allow-Headers", "authorization");//允许携带这个响应信息
    next()//放行
})
//连接数据库
let connection=require('./js/conn')

//引入token
const jwt= require('jsonwebtoken');

//准备密钥
// const secret = 'itsource';

router.post('/checklogin',(req,res)=>{
    //接受前台参数
    let {account,password}=req.body;
    //准备sql
    let sqlStr=`select * from accounts where account='${account}' and password='${password}'`
    //执行sql
    connection.query(sqlStr,(err,data)=>{
        if (err) throw err
        // console.log(data);
        if(data.length){
            //生成token
            const token = jwt.sign(Object.assign({},data[0]), secret, {
                expiresIn:  60 * 60 * 2 // 过期时间
            });
            //表示已查到数据
            res.send({code:0,msg:'登录成功',token})
        }else{
            //未查到数据
            res.send({code:1,msg:'登陆失败'})
        }
        
    })
})




//暴露路由
module.exports=router;