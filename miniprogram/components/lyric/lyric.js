// components/lyric/lyric.js
let lyricHeight = 0
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    lyricShow: {
      type: Boolean,
      value: false
    },
    lyric: {
      type: String
    },
  },
  
  observers: {
    lyric(lrc) {
      if(lrc === "暂无歌词"){
        this.setData({
          lyricList: [{
            lrc,
            time: 0,
          }],
          nowLyricIndex: -1
        })
      }else{
        this._parseLyric(lrc)
      }
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    lyricList: [],
    nowLyricIndex: 0,
    scrollTop: 0,
  },

  lifetimes: {
    ready() {
      // 默认屏幕宽度750rpx;样式中设置最小高度为64rpx
      wx.getSystemInfo({
        success: function(res) {
          lyricHeight = res.screenWidth / 750 * 64
        },
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    updateLyric(currentTime) {
      const lyricList = this.data.lyricList;
      if(lyricList.length === 0) {
        return 
      }
      if (currentTime > lyricList[lyricList.length - 1].time) {
        if (this.data.nowLyricIndex != -1) {
          this.setData({
            nowLyricIndex: -1,
            scrollTop: lyricList.length * lyricHeight
          })
        }
      }
      for (let i =0, len = lyricList.length; i < len; i++) {
        if(currentTime <= lyricList[i].time) {
          this.setData({
            nowLyricIndex: i - 1,
            scrollTop: (i - 1) * lyricHeight
          })
          break
        }
      }
    },
    _parseLyric(lyric){
      const _lyricList = [];
      const line = lyric.split("\n");
      line.forEach(item => {
        const time = item.match(/\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g);
        if(time != null) {
          const lrc = item.split(time)[1];
          const timeReg = time[0].match(/(\d{2,}):(\d{2})(?:\.(\d{2,3}))?/);
          const timeSeconds = parseInt(timeReg[1]) * 60 + parseInt(timeReg[2]) + parseInt(timeReg[3]) / 1000;
          _lyricList.push({
            lrc,
            time: timeSeconds
          })
        }
      })
      this.setData({
        lyricList : _lyricList
      })
    }
  }
})
