// components/search/search.js
let keyword ='';
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    placeholder: {
      type: String,
      value: "请输入关键字"
    }
  },

  // 引用外部样式方法二
  externalClasses: [
    'iconfont',
    'icon-suosou'
  ],

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleInput(e){
      keyword = e.detail.value
    },

    handleSearch() {
      this.triggerEvent('search',keyword)
    }
  }
})
