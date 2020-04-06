// miniprogram/pages/blog-comment/blog-comment.js
import formatTime from '../../utils/formatTime.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail:{},
    commentList: [],
  },

  _getBlogDetail(blogId){
    console.log(blogId)
    wx.cloud.callFunction({
      name: 'blog',
      data:{
        $url: 'detail',
        blogId, 
      }
    }).then( res => {
      console.log(res.result.detail[0])
      let commentList = res.result.commentlist.data
      for (let i = 0, len = commentList.length; i < len; i++) {
        commentList[i].createDate = formatTime(new Date(commentList[i].createDate))
      }
      this.setData({
        detail: res.result.detail[0],
        commentList,
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getBlogDetail(options.blogId);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})