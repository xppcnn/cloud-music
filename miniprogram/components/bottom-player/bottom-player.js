// components/bottom-player/bottom-player.js
const backgroundAudioManager = wx.getBackgroundAudioManager();
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
    },
    playStatus: {
      type: Boolean,
    }
  },

  // 数据监听器
  observers: {
    'playStatus'(e) {
      console.log(e)
      this.setData({
        _playStatus: e
      })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    show: false,
    activeId: -1,
    _musicCache: [],
    _playStatus: false,
  },

  lifetimes: {
    // attached: function() {
    //   // 在组件实例进入页面节点树时执行
    //   console.log("bbbbb", this.properties.musicCache)
    //   this.setData({
    //     _musicCache: this.properties.musicCache,
    //   })
    //   console.log("bbbbb", this.properties.musicCache)
    //   console.log("cccccc", this.data._musicCache)
    // },
    // detached: function() {
    //   // 在组件实例被从页面节点树移除时执行
    //   this.setData({
    //     _musicCache: [],
    //   })

    // }
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

    onClose() {
      this.setData({
        show: false
      })
    },
    goToPlayer() {
      wx.navigateTo({
        url: `../../pages/player/player?playIndex=${this.properties.playIndex}&playStatus=${this.data._playStatus}`,
        events: {
          // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
          changePlayStatus: data => {
            this.setData({
              _playStatus: data.value
            })
          },
        },
      })
    },

    goToPlayList() {
      const listId = wx.getStorageSync("playMusic").listId
      wx.navigateTo({
        url: `../../pages/musicList/musicList?playlistId=${listId}`
      })
    },

    handleDel(e) {
      const a = this.properties.musicCache.filter(item => item.id !== e.currentTarget.dataset.clickid)
      console.log(a)
      wx.setStorageSync("musicCache", a)
      this.setData({
        _musicCache: a
      })
      console.log("cccccc", this.data._musicCache)
    },

    togglePlaying(){
      if (this.data._playStatus) {
        backgroundAudioManager.pause()
        this.setData({
         _playStatus: false
        })
      } else {
        backgroundAudioManager.play()
        this.setData({
          _playStatus: true
        })
      }
    }
  }
})