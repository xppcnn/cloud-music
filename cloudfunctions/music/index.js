// 云函数入口文件
const cloud = require('wx-server-sdk');
const TcbRouter = require('tcb-router');
const rp = require("request-promise");
cloud.init()
const db = cloud.database();
const playListCollection =  db.collection("playList");
const BASE_URL = 'http://musicapi.xiecheng.live'
// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({ event });

  app.use( async (ctx, next) => {
    ctx.data = {};
    await next();
  })
  // 歌单
  app.router('playList', async(ctx, next) => {
    ctx.body = await playListCollection.skip(event.start)
      .limit(event.count)
      .orderBy('createTime', 'desc')
      .get()
      .then(res => res)
  })

  app.router("musicList", async(ctx, next) => {
    ctx.body = await rp(BASE_URL + '/playlist/detail?id=' + parseInt(event.playlistId))
    .then( res => {
      return res
    }).catch(err => console.log(err))
  })

  return app.serve();
}