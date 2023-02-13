const express = require('express')
const app = express()
const config = require('./config/index.js')
const rootRouter = require('./router/index.js')

// Cors解决跨域问题
app.use(function (req, res, next) {
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers':
      'Content-Type,Content-Length, Authorization, Accept,X-Requested-With',
    'Access-Control-Allow-Methods': 'PUT,POST,GET,PATCH,DELETE,OPTIONS'
  })

  // 跨域请求CORS中的预请求
  if (req.method == 'OPTIONS') {
    res.sendStatus(200) /*让options请求快速返回*/
  } else {
    next()
  }
})

app.use('/api', rootRouter)
// 只要是localhost:1193/api,都会进入这个中间件处理函数

app.listen(config.PORT, function () {
  console.log(`服务已开启在端口${config.PORT}`)
})
