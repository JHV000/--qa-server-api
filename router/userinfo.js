const express = require('express')
const router = express.Router()

// 导入用户信息的处理函数模块
const userinfo_handler = require('../router_handler/userinfo')

// 获取用户的基本信息
router.get('/getUserinfo', userinfo_handler.getUserInfo)

// 更新用户的基本信息
router.post('/userinfo', userinfo_handler.updateUserInfo)

// 重置密码的路由
router.post('/updatepwd', userinfo_handler.updatePassword)

module.exports = router