var express = require('express');
var router = express.Router();

const md5 = require('blueimp-md5')

const UserModel = require('../db/models').UserModel

const filter = {password:0}




/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/register', function (req, res) {
    const {username, password,type} = req.body

    UserModel.findOne({username},function(err,user){
        if(user){
            res.send({code:1,msg:'此用户已存在'})
        }else{
            //如果不存在就把user保存到数据库
            new UserModel({username,password: md5(password),type}).save(function (err,user) {
                res.cookie('userid',user._id,{maxAge:1000*60*60*24*7})
                res.send({code:0,data:{_id:user._id,username:type}})
            })
        }
    })

})
router.post('/login',function(req,res){
    const {username,password} = req.body

    UserModel.findOne({username,password:md5(password)},filter,)
})


module.exports = router;
