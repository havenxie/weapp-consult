// pages/orderInfo/orderInfo.js
var util = require('../../utils/md5.js') 
const app = getApp()
const salt = app.globalData.salt

Page({

  /**
   * 页面的初始数据
   */
  data: {
    appointments: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    app.request({
      url: 'https://qx.sj0763.com/2020/wxapp_xlfd/api/myappointments.php',
      data: {
        "openid": app.globalData.openID, 
        "sign": util.hexMD5(salt + app.globalData.openID )
      },
      msg: '获取预约',
      hideStatus: false,
      success: function (res) {
        // console.log(res)
        if(res.desc == 'ok') {
          if(res.appointments) {
            let appointments = res.appointments
            that.setData({
              appointments: appointments
            })
            appointments.forEach(function(item, index) {
              console.log(item)
            })
          } else {
            wx.showToast({
              title: '没有预约信息',
              icon: 'none'
            })
          }
        }
      },
      fail: function (res) { 
        console.log(res)
        wx.showToast({
          title: '获取预约信息失败',
          icon: 'none',
          duration: 2000,
          mask: true        
        })
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