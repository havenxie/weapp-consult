// pages/storageInfo/storageInfo.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},      //userInfo是获取的微信信息
    hasUserInfo: false,

    storageInfo: {},        //storageInfo是用户填写的个人信息
    age: 0,
    hasStorageInfo: false
  },
  catchTapModify: function() {
    console.log('goto perfectinfo')
    wx.navigateTo({
      url: '../perfectinfo/perfectinfo'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } 

    let thisHasStorageInfo = wx.getStorageSync('hasStorageInfo')
    let thisStorageInfo = wx.getStorageSync('storageInfo')
    console.log(thisHasStorageInfo)
    console.log(thisStorageInfo)
    if(thisHasStorageInfo) {
      let thisYear = new Date().getFullYear()
      let userYear = thisStorageInfo.birthday.split("-")[0]
      this.setData({
        storageInfo: wx.getStorageSync('storageInfo'),
        age: thisYear - userYear,
        hasStorageInfo: true
      })
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

  }
})