//index.js
var util = require('../../utils/md5.js') 
const app = getApp()
const salt = app.globalData.salt
const sign = app.globalData.sign

Page({
  data: {
    userInfo: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    openid: '',
    order: {},
    hidden: true,

    closeApp: false,
     news: {},
  },
  navToPlan: function(event) {
    if(this.data.hidden) return //没有加载出数据之前禁止跳转
    if (app.globalData.balance <= 0.0) {
      wx.showModal({
        title: '温馨提示',
        content: '您的余额不足，为了不影响您的正常订餐，请及时充值',
        showCancel: false,
        confirmText: '知道了',
        confirmColor: '#FF0000'
      })
      return
    }
    let tapSrc = event.currentTarget.dataset.meal
    wx.navigateTo({
      url: '../plan/plan?meal=' + tapSrc,
      success: (res) => { },
      fail: (err) => {
        console.log(err)
      }
    })
  },
  navToOrder: function(event) {
    if(this.data.hidden) return //没有加载出数据之前禁止跳转
    let tapData = event.currentTarget.dataset.data
    app.globalData.doctorInfo = tapData;
    wx.navigateTo({
      url: '../order/order', 
      success: (res) => { },
      fail: (err) => {
        console.log(err)
      }
    })
  },



  getProfessorList: function () {
    let that = this
    app.request({
      url: 'https://qx.sj0763.com/2020/wxapp_xlfd/api/professorlist.php',
      // data: {
      //   "openid": app.globalData.openID,
      //   "sign": util.hexMD5(app.globalData.openID + sign)
      // },
      msg: '更新数据',
      hideStstus: false,
      success: function(res) {
        console.log(res)
        let resData = res
        if(resData.desc == 'ok') {
          resData.dateStr = resData.now.split(' ')[0].split('-')
          let weekDay = new Array('周日', '周一', '周二', '周三', '周四', '周五', '周六');
          resData.dateStr.push(weekDay[(new Date(resData.now)).getDay()])
          that.setData({order: resData, hidden: false})
          typeof success == 'function' && success(resData);
        }
      },       
      fail: function(res) {
        typeof fail == 'function' && fail(resData);
      },
      complete: function() {
      }  

    })
  },
  wxLoading: function() {
    let that = this;
    wx.login({
      success: res => {

      },
      fail: function () {
          app.showToast('warn', 1500, '登录失败')
      }
    })
  },
  onLoad: function (options) {
    // console.log('onload')
    this.getProfessorList()
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
    if (app.globalData.pageBindSta) {
      console.log('back form bindPage')
      app.globalData.pageBindSta = false
      this.getStatus()
    } 
    // if (app.globalData.pageOrderSta) {
    //   console.log('back form orderPage')
    //   app.globalData.pageOrderSta = false
    //   this.getStatus()
    // }
    // if (app.globalData.pagePlanSta) {
    //   console.log('back form planPage')
    //   app.globalData.pagePlanSta = false
    //   this.getStatus()
    // }
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
    let that = this
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          that.wxLoading()
          wx.stopPullDownRefresh()
        } else {
          that.showSetModel()
        }
      }
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    return {
      title: "佛冈供电局订餐小程序",
      path: '/pages/index/index',
      //imageUrl: "../../imgs/share.png",
      success: function (res) {
        app.showToast('转发成功', 'success', 1000)
      },
      fail: function (res) {
        app.showToast('转发失败', 'none', 1000)
      }
    }
  }


})
