// components/progress-bar/progress-bar.js
let movableAreaWidth = 0;
let movableViewWidth = 0;
const backgroundAudioManager = wx.getBackgroundAudioManager();
let currentSec = -1; // 当前的秒数
let duration = 0 ; // f当前歌曲的总时长
let isMoveing = false; // 表示当前进度条是否被拖动
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isSame: Boolean,
  },

  /**
   * 组件的初始数据
   */
  data: {
    showTime: {
      currentTime: "00:00",
      totalTime: "00:00"
    },
    movableDis: 0,
    progress: 0,
  },

  lifetimes: {
    ready(){
      if(this.properties.isSame && this.data.showTime.totalTime==="00:00"){
        this._setTime();
      }
      this._getMovableDis();
      this._bindBGMEvent();
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onChange(e) {
      // console.log(e)
      if(e.detail.source === 'touch'){
        // 拖动进度条时，只是更新值，只要在停止拖动时，再进行setData
        this.data.progress = e.detail.x / (movableAreaWidth - movableViewWidth) * 100;
        this.data.movableDis = e.detail.x;
        isMoveing = true;
      }
    },
    // todo: 执行完touchEnd  后，可能会再执行一次onChange事件
    touchEnd(e) {
      const currentTimeFmt = this._dateFormat(Math.floor(backgroundAudioManager.currentTime))
      this.setData({
        progress: this.data.progress,
        movableDis: this.data.movableDis,
        ['showTime.currentTime'] : currentTimeFmt.min + ':' + currentTimeFmt.sec,
      })
      backgroundAudioManager.seek(duration * this.data.progress /100);
      isMoveing = false;
    },
    _bindBGMEvent() {
      backgroundAudioManager.onPlay(() => {
        console.log('onPlay') 
        isMoveing = false;
        this.triggerEvent('musicPlay')
      })

      backgroundAudioManager.onStop(() => {
        console.log('onStop')
      })

      backgroundAudioManager.onPause(() => {
        console.log('Pause')
        this.triggerEvent('musicPause')
      })

      backgroundAudioManager.onWaiting(() => {
        console.log('onWaiting')
      })

      backgroundAudioManager.onCanplay(() => {
        console.log('onCanplay')
        // console.log(backgroundAudioManager.duration)
        // 部分机型会出现undefined
        if (typeof backgroundAudioManager.duration != 'undefined') {
          this._setTime()
        } else {
          setTimeout(() => {
            this._setTime()
          }, 1000)
        }
      })

      // 监听背景音频播放进度更新事件
      backgroundAudioManager.onTimeUpdate(() => {
        // 只要在进度条没被拖动时，在进行执行
        if(!isMoveing){
          const currentTime = backgroundAudioManager.currentTime;
          const duration = backgroundAudioManager.duration;
          const sec = currentTime.toString().split('.')[0];
          if(sec !== currentSec){
            const currentTimeFmt = this._dateFormat(currentTime);
            this.setData({
              movableDis: (movableAreaWidth -movableViewWidth) * currentTime / duration,
              progress: currentTime / duration * 100,
              ['showTime.currentTime'] : `${currentTimeFmt.min}:${currentTimeFmt.sec}`,
            })
            currentSec = sec;
            // 歌词联动
            this.triggerEvent("timeUpdate", { currentTime })
          }
        }
      })

      backgroundAudioManager.onEnded(() => {
        console.log("onEnded")
        this.triggerEvent('musicEnd')
      })

      backgroundAudioManager.onError((res) => {
        console.error(res.errMsg)
        console.error(res.errCode)
        wx.showToast({
          title: '错误:' + res.errCode,
        })
      })
    },

    _getMovableDis(){
      //  获取不同设备下 宽度的大小
      const query = this.createSelectorQuery();
      query.select(".movable-area").boundingClientRect();
      query.select(".movable-view").boundingClientRect();
      query.exec( rect => {
        console.log(rect)
        movableAreaWidth = rect[0].width;
        movableViewWidth = rect[1].width;
        console.log(movableViewWidth,movableAreaWidth)
      })
    },

    _setTime() {
      duration = backgroundAudioManager.duration
      const durationFmt = this._dateFormat(duration);
      this.setData({
        ['showTime.totalTime'] : `${durationFmt.min}:${durationFmt.sec}`
      })
    },

    _dateFormat(time) {
      const min = Math.floor(time / 60);
      const sec = Math.floor(time % 60);
      return {
        'min': this._parse0(min),
        'sec': this._parse0(sec),
      }
    },
    _parse0(time) {
      return time < 10 ? '0' + time : time
    }

  }
})
