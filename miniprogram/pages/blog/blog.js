// miniprogram/pages/blog/blog.js
// 搜索的关键字
let keyword = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalShow: false,
    blogList: [],
  },


  onPublish() {
    wx.getSetting({
      success: (result)=>{
        // console.log(result)
        if(result.authSetting['scope.userInfo']){
          wx.getUserInfo({
            withCredentials: 'false',
            lang: 'zh_CN',
            timeout:10000,
            success: (result)=>{
              const userInfo = result.userInfo;
              wx.navigateTo({
                url: `../../pages/blog-edit/blog-edit?nickName=${userInfo.nickName}&avatarUrl=${userInfo.avatarUrl}`,
              });
            },
          });
        }else{
          this.setData({
            modalShow: true,
          })
        }
      },
    });
  },
  //登录成功
  loginSuccess(e){
    console.log(e)
    const detail = e.detail;
    wx.navigateTo({
      url: `../../pages/blog-edit/blog-edit?nickName=${detail.nickName}&avatarUrl=${detail.avatarUrl}`,
    });
  },

  loginFail(){
    wx.showModal({
      title: '授权用户才能发布',
      content: '',
    });
  },

  goToComment(e){
    console.log(e)
    wx.navigateTo({
      url: `../../pages/blog-comment/blog-comment?blogId=${e.currentTarget.dataset.blogid}`
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  this._loadBlogList(0)
  },

  _loadBlogList(start){
    wx.cloud.callFunction({
      name: 'blog',
      data: {
        start,
        keyword,
        $url: 'blogList',
        count: 10,
      }
    }).then(res => {
      this.setData({
        blogList: [...this.data.blogList,...res.result]
      })
    })
  },

  onPullDownRefresh: function() {
    this.setData({
      blogList: []
    })
    this._loadBlogList(0)
  },

  onReachBottom: function() {
    // 页面触底时执行
    this._loadBlogList(this.data.blogList.length)
  },

  handleSearch(e) {
    this.setData({
      blogList: [],
    })
    keyword = e.detail
    this._loadBlogList(0)
  },

  onShareAppMessage: function(event) {
    console.log(event)
    let blogObj = event.target.dataset.blog
    return {
      title: blogObj.content,
      path: `/pages/blog-comment/blog-comment?blogId=${blogObj._id}`,
      // imageUrl: ''
    }
  }
})