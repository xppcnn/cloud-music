// miniprogram/pages/recommend/recommend.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    artistRank: {}, // 歌手榜
    officialRank: {}, // 官方榜
    rewardRank: {}, //赞赏榜
    recommendRank: {}, // 推荐榜
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.cloud.callFunction({
      name: 'getRankList',
      data: {
        $url: 'rankList'
      }
    }).then(res => {
      console.log(JSON.parse(res.result));
      const result = JSON.parse(res.result);
      const officialRank = result.list.filter(item => item.hasOwnProperty("ToplistType"));
      const recommendRank = result.list.filter(item => !item.hasOwnProperty("ToplistType"));
      this.setData({
        officialRank,
        recommendRank,
        artistRank: result.artistToplist,
        rewardRank: result.rewardToplist
      })

      console.log(recommendRank);
      

    }).catch(err => {
      console.log(err);
      
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