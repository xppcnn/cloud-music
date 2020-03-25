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
    play: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    clickMusic(){
      this.setData({
        play: !this.data.play,
      })
      console.log(this.data.play)
    }
  }
})
