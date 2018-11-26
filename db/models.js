const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/bossz')

const conn = mongoose.connection

conn.on('connected',function () {
    console.log('数据库连接成功')
})

//描述文档结构
const userSchema = mongoose.Schema({
    username:{type:String,required:true},
    password:{type:String,required: true},
    type:{type:String,required:true},
    header:{type:String},
    post:{type:String},
    info:{type:String},
    company:{type:String}
})

const UserModel = mongoose.model('user',userSchema)

exports.UserModel = userModel
