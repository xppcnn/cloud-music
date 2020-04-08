// 云函数入口文件
const cloud = require("wx-server-sdk");
const tcbRouter = require("tcb-router");
cloud.init();
const db = cloud.database();
const blogCollection = db.collection("blog");
const MAX_LIMIT = 100;

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new tcbRouter({
    event,
  });

  app.router("blogList", async (ctx, next) => {
    const keyword = event.keyword;
    let w = {};
    if (keyword.trim() !== "") {
      w = {
        content: new db.RegExp({
          regexp: keyword,
          options: "i",
        }),
      };
    }
    ctx.body = await blogCollection
      .where(w)
      .skip(event.start)
      .limit(event.count)
      .orderBy("createDate", "desc")
      .get()
      .then((res) => res.data);
  });

  app.router("detail", async (ctx, next) => {
    const detail = await blogCollection
      .where({
        _id: event.blogId,
      })
      .get()
      .then((res) => res.data);

    // 查询评价数据（突破100条数据限制）
    const countResult = await db.collection("blog-comment").count();
    const total = countResult.total;
    let commentlist = {};
    if (total > 0) {
      const batchTimes = Math.ceil(total / MAX_LIMIT);
      const tasks = [];
      for (let i = 0; i < batchTimes; i++) {
        const promise = db
          .collection("blog-comment")
          .where({
            blogId: event.blogId,
          })
          .skip(i * MAX_LIMIT)
          .limit(MAX_LIMIT)
          .orderBy("createDate", "desc")
          .get();
        tasks.push(promise);
      }
      commentlist = (await Promise.all(tasks)).reduce((acc, cur) =>
        acc.data.concat(cur.data)
      );
    }
    ctx.body = {
      detail,
      commentlist,
    };
  });

  return app.serve();
};
