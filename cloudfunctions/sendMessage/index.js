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
      thing2: {
        value: event.nickName
      },
      thing1: {
        value: event.content
      },
      time3: {
        value: '20:00'
      },
    },
    templateId: 'AdQx1ohti1Q8BUsvZhI9cfnS80QFfgeyr_kPBj-MtoQ'
  })
  return res
}