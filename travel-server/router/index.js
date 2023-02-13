// 专门处理所有接口操作
const express = require('express')
const Router = express.Router() // 接口路由中间件
const infRouter = require('./inf.js')
const loginRouter = require('./login.js')
const regRouter = require('./reg.js')
const hotelRouter = require('./hotel.js')

//对所有接口的post请求得到数据进行处理
Router.use(express.urlencoded({ extended: false }), express.json())

Router.use('/inf', infRouter)
Router.use('/login', loginRouter)
Router.use('/reg', regRouter)
Router.use('/hotel',hotelRouter)

module.exports = Router
