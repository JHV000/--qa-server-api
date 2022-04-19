/**
 * router is just for 路由和处理函数的映射关系
 */

 const express = require('express')
 const router = express.Router()
 
 // 导入用户路由处理函数模块
 const questionHandler = require('../router_handler/question')
 
 // 获取问题
 router.get('/getAllQuestion', questionHandler.getAllQuestion)
 // 登录
 router.get('/getAllComment', questionHandler.getAllComment)
 //添加新问题
 router.post('/addQuestion', questionHandler.addQuestion)
 //添加新评论
 router.post('/addComment', questionHandler.addComment)

 
 module.exports = router