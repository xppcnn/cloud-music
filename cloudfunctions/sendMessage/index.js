// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  
 const res = await cloud.openapi.subscribeMessage.send({
    touser: OPENID,
    page: `../../miniprogram/pages/blog-comment/blog-comment?blogId=${event.blogId}`,
    data: {
      name2: {
        value: event.nickName
      },
      thing3: {
        value: event.content
      },
      time4: {
        value: '20:00'
      },
      thing5: {
        value: '广州市海珠区新港中路397号'
      }
    },
    templateId: '5jHgKspVo0tQHqY6vZsEhIe8b6upLvTOh51BQM3lA7w'
  })
  return res
}