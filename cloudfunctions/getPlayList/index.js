// 云函数入口文件
const cloud = require('wx-server-sdk')

const rp = require('request-promise');

const URL  = 'http://musicapi.xiecheng.live/personalized'

cloud.init()

// 初始化数据库，必须先初始化cloud
const db = cloud.database();

const playListCollection = db.collection("playList")

const MAX_LIMIT = 10;

// 云函数入口函数
exports.main = async (event, context) => {
  // 数据库的原有数据(平台限制一次最多可以取100条数据)
  // const list = await playListCollection.get();
  // 获取数据总数（Object）
  const countResult = await playListCollection.count();
  const { total } = countResult;
  const batchTimes = Math.ceil(total / MAX_LIMIT)
  const tasks = [];
  //分几次取数据，在合并
  for(let i = 0; i < batchTimes; i++){
    // 异步操作（promise对象）
    let promise = playListCollection.skip( i * MAX_LIMIT).limit(MAX_LIMIT).get();
    tasks.push(promise)
  }

  let list = {
    data: [],
  }

  if(tasks.length> 0 ) {
    list = (await Promise.all(tasks)).reduce((acc,cur) => {
      return {
        data: acc.data.concat(cur.data)
      }
    })
  }

  // 新请求的数据
  const playlist = await rp(URL).then((res) => {
    return JSON.parse(res).result;
  })
  //双层循环判断新获取的数据是否已经在数据库中
  const newData = [];
  for (let i = 0, newLen = playlist.length; i < newLen; i ++) {
    let flag = true;
    for( let j = 0, oldLen = list.data.length; j < oldLen; j++){
      if(playlist[i].id === list.data[j].id){
        flag = false;
        break
      }
    }
    if(flag){
      newData.push(playlist[i])
    }
  }
  // 将获取的数据插入到数据库中（只能单条插入）
  for (let i = 0, len = newData.length; i< len ; i++) {
    await playListCollection.add({
      data: {
        ...newData[i],
        createTime: db.serverDate(),
      }
    }).then((res) => {
      console.log("插入成功");
    }).catch((err) => {
      console.log("插入失败");
    })

  }
  return newData.length;
}