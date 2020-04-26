// miniprogram/pages/profile/profile.js
const db = wx.cloud.database(); 
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDbImg()
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

  changeImg: function(name) {
    var i = name;
    var bgImg = 'cloud://xwl-2s29y.7877-xwl-2s29y-1301647289/comment/1585028599611.jpg';
    this.setData( {
      pBackgroundImg: bgImg
    } );
  },

  changeBg() {
    wx.chooseImage({  // 这个api为让用户从文件中选择图片
      count: 1,  // 选择的照片数，只能一张
      sizeType: ['original', 'compressed'],  // 选择原图或是压缩图
      sourceType: ['album'],  // 从相册中选择，还可以再写一个选项通过拍照
      success: (res) => {  // 选择成功后,会返回一个数组，这个数组保存了照片的临时路径
        wx.showLoading({
          title: '加载中',
        })
        let tempFilePath = res.tempFilePaths[0]    // 因为我只存一张，所以是[0],获取这个图片的临时路径
        let suffix = /\.\w+$/.exec(tempFilePath)[0]   // 获取图片拓展名,供保存到云存储使用
        wx.cloud.uploadFile({   // 存储到云存储上
          cloudPath: 'bgImg/' + Date.now() + '-' + Math.random() + suffix,  // 保存的路径,为了名字防止重复
          filePath: tempFilePath,  // 文件的路径
          success: (res) => {  // 存储成功
            let fileID = res.fileID  // 拿到存储在云存储的图片id
            this.setDbImg(fileID)  // 执行存储到数据库的方法
          }
        })
      }
    })
  },

  setDbImg(fileID) {
    // 同样，要现在云数据库的控制台上创建一个集合，通过.collection来操作集合
    db.collection('bgImg').get().then((res) => {  // 查询集合的数据
      let data = res.data
      if(data.length === 0) {  // 如果是第一次存直接添加
        db.collection('bgImg').add({
          data: {
            bgImg: fileID  // 将上面传下来的图片路径保存
          }
        }).then((res) => {
          this.getDbImg()  // 读取数据的方法，在下面执行
        })
      } else {  // 如果是第二次存就替换
        let id = data[0]._id  // 因为只能存储一张背景图，直接获取到这条数据中数据库中的_id,唯一标识
        db.collection('bgImg').doc(id).update({  // 更新数据
          data: {
            bgImg: fileID
          }
        }).then((res) => {
          this.getDbImg() // 读取数据的方法，在下面执行
        })
      }
    })
  },

  getDbImg() {  // 从数据库获取图片
    db.collection('bgImg').get().then((res) => {
      let data = res.data
      if(data.length > 0) { // 如果有数据才能赋值
        this.setData({
          bgImg: data[0].bgImg  // data里面的变量,赋值给wxml的image标签的src展示
        })
        wx.hideLoading()
      }
    })
  },
})