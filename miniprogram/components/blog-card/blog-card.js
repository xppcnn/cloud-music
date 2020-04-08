import formatTime from '../../utils/formatTime.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blog: Object,
  },

  observers: {
    ['blog.createDate'](time) {
      if (time) {
        this.setData({
          _createDate: formatTime(new Date(time))
        })
      }
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    _createDate: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    previewImage(e) {
      console.log(e)
      wx.previewImage({
        current: e.target.dataset.imgsrc,
        urls: e.target.dataset.imgs,
      });
    }
  }
})