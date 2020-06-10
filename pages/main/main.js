// pages/main.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    playlist: [],
    controls: true,
    playBtn: false,
    duration: 1000,
    cache: false,
    indexCurrent: null,
    playFlag: false
  },
  videoPlay: function (e) {
    let that = this
    var curIdx = e.currentTarget.dataset.index;
    if(this.data.indexCurrent != curIdx) {
      for(let i = 0; i < this.data.playlist.length; i++ )
      {
        var videoContext = wx.createVideoContext('myVideo' + i) //这里对应的视频id
        videoContext.pause()
      }
      this.setData({
        indexCurrent: curIdx,
        playFlag: false
      })
      var videoContext = wx.createVideoContext('myVideo' + curIdx) //这里对应的视频id
      videoContext.play()
    } else {
      var videoContext = wx.createVideoContext('myVideo' + curIdx) //这里对应的视频id
      this.data.playFlag ? videoContext.play() : videoContext.pause()
      this.setData({
        playFlag : !that.data.playFlag
      })
    }

  },
  // 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    app.request({
      url: 'https://qx.sj0763.com/2020/wxapp_xlfd/api/vod.demo.php',
      msg: '获取数据',
      hideStstus: false,
      success: function(res) {
        console.log(res)
        if(res.desc == 'ok') {
          that.setData({
            playlist: res.playlist
          })
        }
      }

    })
    
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
    //console.log(app.globalData.userInfo)
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

  }
})