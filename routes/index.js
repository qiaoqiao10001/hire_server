var express = require('express');
var router = express.Router();

const md5 = require('blueimp-md5')

const UserModel = require('../db/models').UserModel

const filter = {password:0}   //指定过滤属性




/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
//注册的路由请求
router.post('/register',function(req,res){
    //读取请求参数
    const {username,password,type} = req.body
    //处理
        //判断用户是否已经存在；
    //如果存在，返回错误提示，  （先查询，后保存）根据username查询
    UserModel.findOne({username},function(err,userdoc){
        if(userdoc){
            //返回 json 错误信息
            res.send({code:1,msg:'用户已经存在'})
        }else{
            //不存在则存入数据库
            new UserModel({username,password:md5(password),type}).save(function(err,user){
                res.cookie('userid',user._id,{maxAge:1000*60*60*24*7})  //持久化cookie 浏览器保存在本地文件
                const data = {username,type,_id:user._id} //x相应数据中不要携带密码
                res.send({code:0,data:user})
            })
        }
    })
})

//
// router.post('/login', function (req, res) {
// // 1. 获取请求参数数据(username, password)
//     const {username, password} = req.body
// // 2. 处理数据: 根据 username 和 password 去数据库查询得到 user
//      UserModel.findOne({username, password: md5(password)}, filter, function (err, user)
//     {
//         if(!user) {
//             res.send({code: 1, msg: '用户名或密码错误'})
//         } else {
// // 生成一个 cookie(userid: user._id), 并交给浏览器保存
//             res.cookie('userid', user._id, {maxAge: 1000*60*60*24*7}) // 3.2. 如果 user 有值, 返回 user
//             res.send({code: 0, data: user})
//
//         }
//     })
// })
//
router.post('/login',function(req,res){
    const {username,password} = req.body
    //根据username和password查询数据库，如果没有，提示错误信息， 如果有，返回成功的信息（包含user）
    UserModel.findOne({username,password:md5(password)},filter,function(err,user){
        if(user){  //如果存在  登录成功
            res.cookie('userid',user._id,{maxAge:1000*60*60*24*7})
            res.send({code:0,data:user})
        }else{  //登录失败
            res.send({code:1,msg:'用户名或者密码不正确'})
        }
    })
})


module.exports = router;
