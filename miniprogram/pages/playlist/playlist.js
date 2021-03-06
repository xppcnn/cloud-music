// miniprogram/pages/playlist/playlist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperImgUrl: [
      {
        url: 'http://p1.music.126.net/oeH9rlBAj3UNkhOmfog8Hw==/109951164169407335.jpg',
      },
      {
        url: 'http://p1.music.126.net/xhWAaHI-SIYP8ZMzL9NOqg==/109951164167032995.jpg',
      },
      {
        url: 'http://p1.music.126.net/Yo-FjrJTQ9clkDkuUCTtUg==/109951164169441928.jpg',
      }
    ],
    playList: [],
  },

  getPlayList: function(){
    wx.showLoading({
      title: '数据加载中',
    })
    wx.cloud.callFunction({
      name: 'music',
      data: {
        $url: "playList",
        start: this.data.playList.length,
        count: 15,
      }
    }).then(res => {
      // console.log(res)
      this.setData({
        playList: [...this.data.playList, ...res.result.data]
      })
      // 手动停止当前页面下拉刷新
      wx.stopPullDownRefresh();
      wx.hideLoading();
      if (res.result.data.length === 0) {
        wx.showToast({
          title: "暂无更多数据",
        })
      }
    }).catch(err =>{
      wx.hideLoading();
      console.log(err)
      })
  },

  goTo(e) {
    console.log('e',e);
    const { site } = e.currentTarget.dataset
    wx.navigateTo({
      url: `../../pages/${site}/${site}`
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPlayList();
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
    // 下拉刷新，还需要在json配置"enablePullDownRefresh": true
    this.setData({
      playList: []
    })
    this.getPlayList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getPlayList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})