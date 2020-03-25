// components/musiclist/musiclist.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    musiclist: {
      type: Array,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    activeId: '', // 选中的歌曲ID
  },

  /**
   * 组件的方法列表
   */
  methods: {
    clickMusic(e){
      const ds = e.currentTarget.dataset;
      this.setData({
        activeId: ds.musicid
      })
      wx:wx.navigateTo({
        url: `../../pages/player/player?musicId=${ds.musicid}&playIndex=${ds.index}`
      })
    }
  }
})
