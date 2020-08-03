// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router');
const rp = require("request-promise");
const BASE_URL = 'http://musicapi.xiecheng.live'

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({
    event
  });

  const wxContext = cloud.getWXContext()

  app.use(async (ctx, next) => {
    ctx.data = {};
    await next();
  })

  app.router("rankList", async (ctx, next) => {
    ctx.body = await rp(BASE_URL + '/toplist/detail')
      .then(res => {
        return res
      }).catch(err => console.log(err))
  })


  return app.serve();
}