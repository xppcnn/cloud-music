// miniprogram/pages/player/player.js
const backgroundAudioManager = wx.getBackgroundAudioManager();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    playStatus: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    const musiclist = wx.getStorageSync("musicCache");
    const index = options.playIndex
    console.log(musiclist[index])
    this.setData({
      detail: musiclist[index],
      playStatus: options.playStatus
    })
    wx.setNavigationBarTitle({
      title: this.data.detail.name,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  togglePlaying: function() {
    const eventChannel = this.getOpenerEventChannel()
    if(this.data.playStatus){
      backgroundAudioManager.pause()
     
      this.setData({
        playStatus: false
      })
      eventChannel.emit('changePlayStatus', { value: false });
    }else{
      backgroundAudioManager.play()
      this.setData({
        playStatus: true
      })
      eventChannel.emit('changePlayStatus', { value: true });
    }
  }
})