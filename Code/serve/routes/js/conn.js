/* 
 
 连接数据库的js文件，抽出来方便其他模块调用 
*/

//引入数据库模块
const mysql=require('mysql');

//创建连接对象
const connection=mysql.createConnection({
     host:'localhost',
     user:'root',
     password:'root',
     database:'smms'
});


//执行连接

connection.connect();
console.log("数据库连接成功");

//暴露连接对象
module.exports=connection;