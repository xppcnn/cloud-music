// components/blog-ctrl/blog-ctrl.js
let userInfo = {}
const db = wx.cloud.database();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blogId: String,
  },

  options: {
    styleIsolation: 'apply-shared',
  },
  /**
   * 组件的初始数据
   */
  data: {
    loginShow: false,
    modalShow: false,
    content: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleComment() {
      wx.getSetting({
        success: (result) => {
          if (result.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              withCredentials: 'false',
              lang: 'zh_CN',
              timeout: 10000,
              success: (result) => {
                userInfo = result.userInfo
                this.setData({
                  modalShow: true,
                })
              },
            });
          } else {
            this.setData({
              loginShow: true,
            })
          }
        },
      });
    },

    loginSuccess() {
      this.setData({
        loginShow: false,
      }, () => {
        this.setData({
          modalShow: true,
        })
      })
    },

    loginFail() {
      wx.showModal({
        title: '用户授权之后才可以添加评论！',
        content: '',
      });
    },
    onInput(e) {
      console.log(e)
      this.setData({
        content: e.detail.value
      })
    },
    handleSend(e) {
      const content = e.detail.value.content;
      if (content.trim() === "") {
        wx.showToast({
          title: '请添加评论',
          icon: 'none',
        });
        return
      }
      wx.showLoading({
        title: "评论中",
        mask: true,
      });
      db.collection("blog-comment").add({
        data: {
          content,
          createDate: db.serverDate(),
          blogId: this.data.blogId,
          nickName: userInfo.nickName,
          avatarUrl: userInfo.avatarUrl
        }
      }).then(res => {
        // 调用微信 API 申请发送订阅消息
        wx.requestSubscribeMessage({
          // 传入订阅消息的模板id，模板 id 可在小程序管理后台申请
          tmplIds: ['5jHgKspVo0tQHqY6vZsEhIe8b6upLvTOh51BQM3lA7w'],
          success:(res)=> {
            // 申请订阅成功
            if (res.errMsg === 'requestSubscribeMessage:ok') {
              // 这里将订阅的课程信息调用云函数存入db
              wx.cloud
                .callFunction({
                  name: 'sendMessage',
                  data:{
                    content,
                    nickName: userInfo.nickName,
                    blogId: this.data.blogId,
                  },
                })
                .then(() => {
                  wx.showToast({
                    title: '订阅成功',
                    icon: 'success',
                    duration: 2000,
                  });
                })
                .catch(() => {
                  wx.showToast({
                    title: '订阅失败',
                    icon: 'success',
                    duration: 2000,
                  });
                });
            }
          }
        });
        wx.hideLoading();
        wx.showToast({
          title: '评论成功',
        });
        this.setData({
          modalShow: false,
          content: '',
        })
      })
    }
  }
})