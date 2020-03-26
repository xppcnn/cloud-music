// components/bottom-player/bottom-player.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    playIndex: {
      type: Number,
    },
    musicCache: {
      type: Array,
    },
    musicId: {
      type: Number,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    show: false,
    activeId: -1,
    _musicCache: [],
  },

  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      console.log("bbbbb", this.properties.musicCache)
      this.setData({
        _musicCache: this.properties.musicCache,
      })
      console.log("bbbbb", this.properties.musicCache)
      console.log("cccccc", this.data._musicCache)
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
      this.setData({
        _musicCache: [],
      })

    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    openMusicCache() {
      console.log(this.properties.musicCache)
      this.setData({
        _musicCache: this.properties.musicCache,
        show: true
      })
    },

    onClose(){
      this.setData({
        show: false
      })
    },
    goToPlayer(){
      wx:wx.navigateTo({
        url: `../../pages/player/player?playIndex=${this.properties.playIndex}`
      })
    },

    goToPlayList(){
      const listId = wx.getStorageSync("playMusic").listId
      wx.navigateTo({
        url: `../../pages/musicList/musicList?playlistId=${listId}`
      })
    },
    handleDel(e){
      const a = this.properties.musicCache.filter(item => item.id !== e.currentTarget.dataset.clickid)
      console.log(a)
      wx.setStorageSync("musicCache", a)
      this.setData({
        _musicCache: a
      })
      console.log("cccccc", this.data._musicCache)
    }  
  }
})
