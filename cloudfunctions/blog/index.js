// 云函数入口文件
const cloud = require('wx-server-sdk');
const tcbRouter = require('tcb-router');
cloud.init()
const db = cloud.database();
const blogCollection = db.collection('blog')

// 云函数入口函数
exports.main = async (event, context) => {

  const app = new tcbRouter({event})

  app.router('blogList',async(ctx,next) => {
    ctx.body = await blogCollection.skip(event.start).limit(event.count).
    orderBy('createDate','desc').get().then(res => res.data)
  })

  return app.serve();
}