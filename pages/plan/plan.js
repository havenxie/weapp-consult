// pages/schedule/schedule.js
var util = require('../../utils/md5.js')
const app = getApp()
const salt = app.globalData.salt
const sign = app.globalData.sign
Page({
  /**
   * 页面的初始数据
   */
  data: {
    meal: 0,
    schedules: [],
    orders: [],
    canteens: [],    //存放餐厅信息原始数据
    canteensAddr: {},//存放餐厅名称和地址用于显示
  },
  mealBtn: function(e) {
    let meal = e.currentTarget.dataset.meal
    this.setData({meal: meal})
    let navName = ''
    switch (meal) {
      case '0': navName = '我的早餐订餐计划'; break;
      case '1': navName = '我的午餐订餐计划'; break;
      case '2': navName = '我的晚餐订餐计划'; break;
      default: navName = '订餐X计划'; break;
    }
    wx.setNavigationBarTitle({
      title: navName,  //页面标题
      success: () => { },   //接口调用成功的回调函数
      fail: () => { },      //接口调用失败的回调函数
      complete: () => { }   //接口调用结束的回调函数（调用成功、失败都会执行）
    })
  },

  bindSetOrder: function (e) {
    let that = this
    let index = parseInt(e.detail.value)
    let canteenId = this.data.canteens[index].id
    // console.log(canteenId)
    let orderInfo = [{ date: e.currentTarget.dataset.date, meal: e.currentTarget.dataset.meal}]
    let orders =  JSON.stringify(orderInfo)
    app.request({
      url: 'https://wm.sj0763.com/wxapp_dingcan/api/setorders2.php',
      data: {
        "canteen": canteenId,
        "openid": app.globalData.openID,
        "orders": orders,
        "sign": util.hexMD5(canteenId + app.globalData.openID + orders + sign)
      },
      msg: (canteenId == 0) ? '取消完成' : '设置完成',
      hideStstus: false,
      success: function (res) {
        console.log(res)
        that.setData({ orders: res.orders })
      },
      fail: function (res) { }
    })
  },
  loadData(meal, pullDownRefresh = false) {
    // wx.showLoading({
    //   title: '获取计划...',
    // })
    let that = this
    let navName = ''
    this.setData({ meal: meal })
    switch (meal) {
      case '0': navName = '我的早餐订餐计划'; break;
      case '1': navName = '我的午餐订餐计划'; break;
      case '2': navName = '我的晚餐订餐计划'; break;
      default: navName = '订餐X计划'; break;
    }
    wx.setNavigationBarTitle({
      title: navName,  //页面标题
      success: () => { },   //接口调用成功的回调函数
      fail: () => { },      //接口调用失败的回调函数
      complete: () => { }   //接口调用结束的回调函数（调用成功、失败都会执行）
    })

    app.requestAddr({
      lat: 0,
      lon: 0,
      hideStstus: true,
      success: function (res) {
        // console.log(res)
        let revCanteens = res.canteens
        let tmpArr = []
        revCanteens.forEach(function (value, index) {
          tmpArr[index] = (value.id != 0) ? (value.name + ' ( ' + value.address + ')') : value.name
        })
        that.setData({
          canteens: revCanteens,
          canteensAddr: tmpArr
        })
      },
      fail: function (res) {
        console.log(res)
      }
    })

    app.request({
      url: 'https://wm.sj0763.com/wxapp_dingcan/api/getorders2.php',
      data: {
        "openid": app.globalData.openID,
        "sign": util.hexMD5(app.globalData.openID + sign)
      },
      msg: '更新数据',
      hideStstus: false,
      success: function (res) {
        console.log(res)
        if (res.desc == 'ok') {
          that.setData({ orders: res.orders })
        }
        if(pullDownRefresh) {
          wx.stopPullDownRefresh()
        }
      },
      fail: function (res) {
        if (pullDownRefresh) {
          wx.stopPullDownRefresh()
        }
        console.log(res)
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let meal = '0'
    if (options.meal) {
      meal = options.meal
    }
    this.loadData(meal)
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
    app.globalData.pagePlanSta = true
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let that = this
    this.loadData(that.data.meal, true )
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