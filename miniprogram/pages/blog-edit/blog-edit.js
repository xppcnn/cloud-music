// miniprogram/pages/blog-edit/blog-edit.js
const MAX_WORDR_NUM = 140;
const MAX_IMG = 9;
const db = wx.cloud.database();
let content = '';
let userInfo = {};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wordNum: 0,
    imageList: [],
    keyHeight: 0,
    selectImgFlag: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    userInfo = options;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //发布博客
  send() {
    if (content.trim() === '') {
      wx.showModal({
        title: '输入文字不得为空',
      });
      return
    }
    wx.showLoading({
      title: "发布中"
    });
    let promiseArr = []
    let imgIds = []
    // 上传图片
    for (let i = 0, len = this.data.imageList.length; i < len; i++) {
      let result = new Promise((resolve, reject) => {
        let item = this.data.imageList[i];
        //获取文件扩展名
        const suffix = /\.\w+$/.exec(item)[0];
        wx.cloud.uploadFile({
          cloudPath: "blog/" + Date.now() + '-' + Math.random() * 100000 + suffix,
          filePath: item,
          success: res => {
            console.log(res);
            // imgIds = imgIds.concat(res.fileID)
            imgIds.push(res.fileID)
            resolve();
          },
          fail: err => {
            console.error(err);
            reject();
          }
        })
      })
      promiseArr.push(result)
    }
    //插入数据库
    Promise.all(promiseArr).then(res => {
      db.collection('blog').add({
        data: {
          ...userInfo,
          img: imgIds,
          content,
          createDate: db.serverDate(), //服务端时间
        }
      }).then(res => {
        console.log(res)
        wx.hideLoading();
        wx.showToast({
          title: '发布成功',
        });

        wx.navigateBack()
      }).catch(err => {
        wx.hideLoading()
        wx.showToast({
          title: '发布失败',
        })
      })
    })
  },
  // 添加图片
  selectImg() {
    wx.chooseImage({
      count: MAX_IMG - this.data.imageList.length,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (result) => {
        const tempFilePaths = result.tempFilePaths
        this.setData({
          imageList: [...this.data.imageList, ...tempFilePaths],
        })
        this.setData({
          selectImgFlag: MAX_IMG - this.data.imageList.length <= 0 ? false : true
        })
      },
      fail: () => {},
      complete: () => {}
    });
  },

  // 删除图片
  deleteImg(e) {
    // console.log(e)
    const index = e.target.dataset.index;
    // splice返回值为被删除的元素，原数组会被修改
    this.data.imageList.splice(index, 1);
    this.setData({
      imageList: this.data.imageList
    })
    // 相对于 this.data.imgageList.length < MAX_IMG 提高了性能
    if (this.data.imageList.length === MAX_IMG - 1) {
      this.setData({
        selectImgFlag: true
      })
    }
  },

  // 预览图片
  previewImg(e) {
    wx.previewImage({
      current: e.target.dataset.imgsrc,
      urls: this.data.imageList
    });
  },

  handleInput(e) {
    let wordNum = e.detail.value.length;
    if (wordNum >= MAX_WORDR_NUM) {
      wordNum = `最大数字为${MAX_WORDR_NUM}`
    }
    this.setData({
      wordNum,
    })
    //因为不要显示，可以不用存到data
    content = e.detail.value
  },

  handleFocus(e) {
    const keyHeight = e.detail.height;
    this.setData({
      keyHeight: keyHeight,
    })
  },

  handleBlur() {
    this.setData({
      keyHeight: 0,
    })
  }
})