// miniprogram/pages/player/player.js
const backgroundAudioManager = wx.getBackgroundAudioManager();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    playStatus: false,
    playIndex: 0,
  },

  _loadMusicDetail: function (playIndex){
    const musiclist = wx.getStorageSync("musicCache");
    wx.cloud.callFunction({
      name: 'music',
      data: {
        $url: 'getMusic',
        id: musiclist[playIndex].id
      }
    }).then(res => {
      const result = JSON.parse(res.result)
      console.log(result)
      backgroundAudioManager.src = result.data[0].url;
      backgroundAudioManager.title = musiclist[playIndex].name
      this.setData({
        detail: musiclist[playIndex],
        playStatus: true,
      })
      wx.setNavigationBarTitle({
        title: this.data.detail.name,
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    // const playStatus = options.playStatus === "true" 
    const musiclist = wx.getStorageSync("musicCache");
    const index = options.playIndex
    console.log(musiclist[index])
    this.setData({
      detail: musiclist[index],
      playStatus: options.playStatus === "true",
      playIndex: parseInt(index)
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
  },

  onPrev() {
    const musiclist = wx.getStorageSync("musicCache");
    this.setData({
      playIndex: this.data.playIndex === 0? musiclist.length -1 :this.data.playIndex-1
    })
    this._loadMusicDetail(this.data.playIndex)
  },
  
  onNext() {
    const musiclist = wx.getStorageSync("musicCache");
    this.setData({
      playIndex: this.data.playIndex === musiclist.length -1 ? 0 : this.data.playIndex+1
    })
    this._loadMusicDetail(this.data.playIndex)
  }
})