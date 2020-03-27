// components/musiclist/musiclist.js
const backgroundAudioManager = wx.getBackgroundAudioManager();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    musiclist: {
      type: Array,
    },
    listId: {
      type: Number,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    activeId: -1, // 选中的歌曲ID
    playing: false,
  },

  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
      this.setData({
        activeId: wx.getStorageSync("playMusic").id,
      })
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
      this.setData({
        activeId: -1,
      })

    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    clickMusic(e) {
      const ds = e.currentTarget.dataset;
      if (this.data.activeId === ds.musicid) {
        wx: wx.navigateTo({
          url: `../../pages/player/player?musicId=${ds.musicid}&playIndex=${ds.index}&playStatus=${this.data.playing}`,
          events: {
            // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
            changePlayStatus: data => {
              console.log("----------",data)
              this.setData({
                playing: data.value
              })
              this.triggerEvent("twoLevelCommentBtn", { index: ds.index, musicId: ds.musicid, playStatus: this.data.playing });
            },
          },
        })
      }
      else {
        this.setData({
          activeId: ds.musicid,
        })
        console.log(this.properties.listId)
        wx.setStorageSync("musicCache", this.properties.musiclist)
        wx.setStorageSync("playMusic", {
          index: ds.index,
          id: ds.musicid,
          listId: this.properties.listId, 
        })
        wx.cloud.callFunction({
          name: 'music',
          data: {
            $url: 'getMusic',
            id: ds.musicid
          }
        }).then(res => {
          const result = JSON.parse(res.result)
          console.log(result)
          backgroundAudioManager.src = result.data[0].url;
          backgroundAudioManager.title = this.properties.musiclist[ds.index].name
          this.setData({
            playing: true,
          })
        })
        this.triggerEvent("twoLevelCommentBtn", { index:ds.index, musicId: ds.musicid, playStatus: this.data.playing });
      }
    },
  }
})