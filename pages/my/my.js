//index.js
//获取应用实例
var util = require('../../utils/md5.js') 
const app = getApp()
const salt = app.globalData.salt

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},      //userInfo是获取的微信信息
    hasUserInfo: false,
    storageInfo: {},        //storageInfo是用户填写的个人信息
    hasStorageInfo: true,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    showModel: false
  },
  getUserInfo: function(e) {
    console.log('111')
    if(e.detail.userInfo) {
      this.closeSetModel()
      app.globalData.userInfo = e.detail.userInfo //应该存在本地
      app.globalData.hasUserInfo = true
      console.log(e.detail.userInfo)
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
      if(!app.globalData.hasStorageInfo) { //本地存储丢失
        console.log("goto perfectinfo")
        wx.navigateTo({ url: '../perfectinfo/perfectinfo' })
     }
    }
  },
  catchTapGotoInfo: function() {
    let that = this
    if(that.data.hasStorageInfo) {
      console.log("goto myInfo")
      wx.navigateTo({
        url: '../myinfo/myinfo'
      })
    } else {
      console.log("goto perfectinfo")
      wx.navigateTo({
        url: '../perfectinfo/perfectinfo'
      })
    }
  },
  catchtapGotoOrderInfo: function() {
    let that = this
    let state = !app.globalData.hasinfo || !app.globalData.userInfo || !app.globalData.hasStorageInfo
    if (state) {
      wx.showModal({
        title: '提示',
        content: '请登录授权并完善个人信息',
      })
      return
    } 
    console.log("goto OrderInfo")
    wx.navigateTo({
      url: '../appointments/appointments'
    })
  },
  catchtapGotoLog: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  catchTapFeedback: function() {
    wx.navigateTo({
      url: '../feedback/feedback',
    })
  },

  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      app.userInfoReadyCallback = res => {
        console.log('ddd')
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      console.log('ccc')
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

  showSetModel:function() {
    this.setData({
      showModel: true
    })
  },

  closeSetModel: function() {
    this.setData({
      showModel: false
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
    // console.log(app.globalData.hasinfo)
    // console.log(app.globalData.userInfo)
    if( app.globalData.hasinfo && app.globalData.userInfo ) { //后台有数据并且已经授权
      if(app.globalData.hasStorageInfo) { //本地有存储
        //  console.log(app.globalData.storageInfo)
      } else {
        if(app.globalData.pageBackstate) {
          app.globalData.pageBackstate = false
        } else {
          console.log("goto perfectinfo")
          wx.navigateTo({ url: '../perfectinfo/perfectinfo'})
        }
      }
    }
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


})
