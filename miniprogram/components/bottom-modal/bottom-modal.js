// components/bottom-modal/bottom-modal.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    modalShow: Boolean,
  },

  options: {
    "styleIsolation" : "apply-shared", // 引用外部样式方法三
    multipleSlots: true //允许使用多个插槽
  },
  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    closeModal(){
      this.setData({
        modalShow: false
      })
    }
  }
})
