/**
 * router is just for 路由和处理函数的映射关系
 */

 const express = require('express')
 const router = express.Router()
 
 // 导入用户路由处理函数模块
 const userHandler = require('../router_handler/user')
 
 // 注册新用户
 router.post('/register', userHandler.regUser)
 // 登录
 router.post('/login', userHandler.login)
 
 module.exports = router