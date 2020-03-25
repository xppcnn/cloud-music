// miniprogram/pages/musicList/musicList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    musiclist: [],
    listInfo: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    wx.cloud.callFunction({
      name: 'music',
      data: {
        $url: "musicList",
        playlistId: options.playlistId
      }
    }).then( res => {
      console.log(JSON.parse(res.result))
      const plist = JSON.parse(res.result).playlist
      this.setData({
        musiclist: plist.tracks,
        listInfo: {
          imgUrl: plist.coverImgUrl,
          name: plist.name,
          commentCount: plist.commentCount,
          shareCount: plist.shareCount,
          subscribedCount: plist.subscribedCount,
        }
      })
    })
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