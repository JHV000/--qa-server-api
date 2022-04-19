// 导入 express 模块
const express = require('express')
// 创建 express 的服务器实例
const app = express()
const http = require('http')
const socketIO = require('socket.io');
const server = http.createServer(app);
const io = socketIO(server,{
    cors: {
        origin: '*'
    },
    path: "/api/socket.io/" 
});

// io.on('connection',(socket) => {
//   console.log('user connected');
//   socket.on('hello',(data) => {
//       console.log(`收到客户端的消息：${data}`);
//   })
//   // socket.emit('message','服务端向客户端推送消息...');
// });
app.get('/api/socket.io',()=>{
  console.log("api");
  io.on('connection',function(socket) {
    console.log("connected!");
    //接收数据
    socket.on('login', function (obj) {                
        console.log(obj.username);
        // 发送数据
        socket.emit('relogin', {
          msg: `你好${obj.username}`,
          code: 200
        });  
    });
  });
  
})

// 导入 cors 中间件
const cors = require('cors')
// 将 cors 注册为全局中间件
app.use(cors())
//注册解析json的全局中间件
app.use(express.json())
//通过如下的代码，配置解析 `application/x-www-form-urlencoded` 格式的表单数据的中间件：
app.use(express.urlencoded({ extended: false }))


// 响应数据的中间件,处理响应提示信息，封装一个res.cc()函数，一定要在路由之前引入
app.use(function (req, res, next) {
    // status = 0 为成功； status = 1 为失败； 默认将 status 的值设置为 1，方便处理失败的情况
    res.cc = function (err, code = 0) {
      res.send({
        // 状态
        code,
        // 状态描述，判断 err 是 错误对象 还是 字符串
        msg: err instanceof Error ? err.message : err,
      })
    }
    next()
  })

  // 导入配置文件
const config = require('./config')

// 解析 token 的中间件
const expressJWT = require('express-jwt')

// 使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] }))








// 导入并注册用户路由模块
const userRouter = require('./router/user')
const questionRouter = require('./router/question')
app.use('/api', userRouter)
app.use('/api', questionRouter)
// 导入并使用用户信息路由模块
const userinfoRouter = require('./router/userinfo')
// 注意：以 /my 开头的接口，都是有权限的接口，需要进行 Token 身份认证
app.use('/my', userinfoRouter)


// 错误中间件
app.use(function (err, req, res, next) {
  // 捕获身份认证失败的错误
  if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！')
  //其他错误
  res.cc(err)

})



// 调用 app.listen 方法，指定端口号并启动web服务器
app.listen(3007, function () {
  console.log('api server running at http://127.0.0.1:3007')
})