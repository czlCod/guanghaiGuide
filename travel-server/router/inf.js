const mongodb = require('mongodb')
const ObjectId = mongodb.ObjectId

// 景点相关接口
const express = require('express')
const Router = express.Router() // 接口路由中间件
const { formatData } = require('../utils/index.js')

const { insert, remove, update, find } = require('../db/index.js')

Router.get('/list', async function (req, res) {
  let { page, size, name, mark } = req.query
  // 1. 所有景点信息
  // let data = await find('inf')
  // 2. 输入框条件筛选
  // let data = await find('inf', { name: '广州塔' })
  // 3. 页码、每页条数
  // let data = await find('inf', {}, { page: 3, size: 2 })
  // 综述：
  let query = {}
  name && (query.name = new RegExp(name))
  mark && (query.mark = new RegExp(mark))

  let data = await find('inf', query, {
    page: Number(page),
    size: Number(size)
  })
  // 获取所有景点数
  let allList = await find('inf')
  console.log(allList)

  res.send({
    code: 200,
    msg: 'success',
    data: data,
    total: allList.length
  })
})

Router.delete('/delete', async function (req, res) {
  // ids: '1'               '1, 3, 4'
  let idsArr = req.query.ids.split(',') // 将字符串转成数组
  idsArr = idsArr.map(function (item) {
    return ObjectId(item)
  })
  let result = await remove('inf', { _id: { $in: idsArr } })
  res.send(
    formatData({
      code: result === true ? 200 : 400
    })
  )
})

// 新增或编辑
Router.post('/details', async function (req, res) {
  let infDetails = req.body
  let _id = infDetails._id
  let result
  if (_id) {
    // 编辑
    delete infDetails.created
    delete infDetails._id
    result = await update('inf', { _id }, { $set: infDetails })
  } else {
    // 新增
    infDetails.created = new Date()
    result = await insert('inf', infDetails)
  }
  res.send(
    formatData({
      code: result === true ? 200 : 400
    })
  )
})

module.exports = Router
