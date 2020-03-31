// miniprogram/pages/blog/blog.js
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  this._loadBlogList()
  },

  _loadBlogList(){
    wx.cloud.callFunction({
      name: 'blog',
      data: {
        $url: 'blogList',
        count: 10,
        start: 0
      }
    }).then(res => {
      this.setData({
        blogList: [...this.data.blogList,...res.result]
      })
    })
  }
})