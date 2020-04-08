// miniprogram/pages/blog-comment/blog-comment.js
import formatTime from "../../utils/formatTime.js";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    blogId: "",
    detail: {},
    commentList: [],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      blogId: options.blogId,
    });
    this._getBlogDetail();
  },

  _getBlogDetail() {
    wx.showLoading({
      title: "加载中",
      mask: true,
    });
    wx.cloud
      .callFunction({
        name: "blog",
        data: {
          $url: "detail",
          blogId: this.data.blogId,
        },
      })
      .then((res) => {
        console.log(res.result.detail[0]);
        let commentList = res.result.commentlist.data;
        for (let i = 0, len = commentList.length; i < len; i++) {
          commentList[i].createDate = formatTime(
            new Date(commentList[i].createDate)
          );
        }
        this.setData({
          detail: res.result.detail[0],
          commentList,
        });
        wx.hideLoading();
      });
  },

  onShareAppMessage: function () {
    const blog = this.data.blog;
    return {
      title: blog.content,
      path: `/pages/blog-comment/blog-comment?blogId=${blog._id}`,
    };
  },
});
