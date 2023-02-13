const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient // 连接客户端对象

const { DB_NAME } = require('../config/index.js')

//1. 连接mongoDB
function connect() {
  return new Promise(function (resolve, reject) {
    MongoClient.connect('mongodb://localhost:27017', function (err, client) {
      if (err) throw err
      // 2.连接数据库，无则自动创建
      let db = client.db(DB_NAME)
      resolve({
        client,
        db
      })
    })
  })
}

// db跟client怎么拿到？
//（一）
// promiseObj.then(function (obj) {
//   console.log(obj)
// })

// function insertSpot() {
//   let promiseObj = connect()
//   promiseObj.then(async function ({ client, db }) {
//     // 3.操作集合
//     let col = db.collection('spot')
//     // 4.操作文档
//     await col.insertOne({ name: '长隆水上乐园' })
//     // 5. 关闭连接, 释放资源
//     client.close()
//   })
// }

async function insertSpot() {
  let { client, db } = await connect()
  // 等的是promise对象的结果
  let col = db.collection('spot')
  // 4.操作文档
  await col.insertOne({ name: '长隆水上乐园' })
  // 5. 关闭连接, 释放资源
  client.close()
}

insertSpot()
