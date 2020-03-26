// components/musiclist/musiclist.js
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
          url: `../../pages/player/player?musicId=${ds.musicid}&playIndex=${ds.index}`
        })
      }
      else {
        this.setData({
          activeId: ds.musicid
        })
        console.log(this.properties.listId)
        wx.setStorageSync("musicCache", this.properties.musiclist)
        wx.setStorageSync("playMusic", {
          index: ds.index,
          id: ds.musicid,
          listId: this.properties.listId, 
        })
        this.triggerEvent("twoLevelCommentBtn", { index:ds.index, musicId: ds.musicid });
      }
    },
  }
})