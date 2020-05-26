// pages/perfectinfo/perfectinfo.js
var util = require('../../utils/md5.js')
const app = getApp()
const salt = app.globalData.salt
const sign = app.globalData.sign

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},      //userInfo是获取的微信信息
    hasUserInfo: false,

    storageInfo: {     //storageInfo是用户填写的个人信息
      name: '',
      sex: 'man',
      birthday: '1990-01-01',
      phone: '',
      addr: '铁木真路'
    },        
    hasStorageInfo: false,

    endDate: new Date().toLocaleDateString('chinese', {hour12: false}).replace("/", "-").replace("/", "-")
  },

  bindconfirm: function(e) {
    console.log(e.detail.value)
    let thisInfo = this.data.storageInfo
    thisInfo.name = e.detail.value
    this.setData({
      storageInfo: thisInfo
    })  
  },
  radioChange: function(e) {
    console.log(e.detail.value)
    let thisInfo = this.data.storageInfo
    thisInfo.sex = e.detail.value
    this.setData({
      storageInfo: thisInfo
    })
  },
  bindDateChange: function(e) {
    console.log(e.detail.value)
    let thisInfo = this.data.storageInfo
    thisInfo.birthday = e.detail.value
    this.setData({
      storageInfo: thisInfo
    })
  },
  getPhoneNumber: function(e) {
    let that = this
    console.log(e)
    if(e.detail.errMsg == 'getPhoneNumber:ok') {
      console.log(app.globalData.openid )
      console.log(app.globalData.sessionkey)
      console.log(app.globalData.hasinfo)

      wx.request({
        url: 'https://qx.sj0763.com/2020/wxapp_xlfd/api/aesdecrypt.php',
        data: {
            'appid': app.globalData.appid,
            'session_key': app.globalData.sessionkey,
            'iv': e.detail.iv,
            'encrypted_data': e.detail.encryptedData,
        },
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        success: function (res) {
          console.log(res)
          if( res.errMsg == "request:ok") {
            let thisInfo = that.data.storageInfo
            let phone = JSON.parse(res.data.data).phoneNumber
            thisInfo.phone = phone
            that.setData({
              storageInfo: thisInfo
            })
           }
        },
        fail: function (err) {
            console.log(err);
        }
      })
    }
  },
  bindDetailAddr: function(e) {
    console.log(e.detail.value)
    let thisInfo = this.data.storageInfo
    thisInfo.addr = e.detail.value
    this.setData({
      storageInfo: thisInfo
    })  
  },
  catchTapSbumit: function(e) {
    let that = this
    // wx.setStorageSync('storageInfo', this.data.storageInfo)
    let name = this.data.storageInfo.name
    let sex = (this.data.storageInfo.sex == 'man') ? 0 : 1
    let birthday = this.data.storageInfo.birthday
    let phone = this.data.storageInfo.phone
    let addr = this.data.storageInfo.addr
    let openid = app.globalData.openid
    console.log(addr + birthday + name + openid + phone + sex)
    if((name != '') && (birthday != '') && (phone != '') && (addr != '')) {
      // 提交到后台
      wx.request({
        url: 'https://qx.sj0763.com/2020/wxapp_xlfd/api/setuserinfo.php',
        data: {
          'address': addr,
          'birthday': birthday,
          'name':  name,
          'openid': openid,
          'phone': phone,
          'sex': sex,
          "skipsign": '1',
          'sign': util.hexMD5(salt + addr + birthday + name + openid + phone + sex + '1' )
        },
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: { 'content-type': 'application/x-www-form-urlencoded;charset=utf-8' },
        success: function (res) {
          
          console.log(res)
          // console.log()
          if(res.errMsg == "request:ok") {
            wx.setStorageSync('hasStorageInfo', true)
            wx.setStorageSync('storageInfo', that.data.storageInfo)
            app.globalData.storageInfo =  that.data.storageInfo
            app.globalData.hasStorageInfo = true
            app.globalData.hasinfo = true  //服务端保存并返回的信息
            wx.showToast({
              title: '提交成功',
              icon: 'success'
            })
            setTimeout(() => {
              wx.hideToast()
              wx.navigateBack({ //返回上一级并关闭当前页面
                delta: 1
              })
            }, 2000);
          }
        },
        fail: function (err) {
            console.log(err);
        }
      })   

    } else {
      wx.showToast({
        title: '请填写完整',
        icon: 'none'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(wx.getStorageSync('hasStorageInfo'))
    console.log(wx.getStorageSync('storageInfo'))
    if(wx.getStorageSync('hasStorageInfo')) {
      this.setData({
        storageInfo: wx.getStorageSync('storageInfo'),
        hasStorageInfo: true
      })
      app.globalData.storageInfo = wx.getStorageSync('storageInfo')
      app.globalData.hasStorageInfo = true
    } else {
      this.setData({
        hasStorageInfo: false
      })
      app.globalData.storageInfo = {}
      app.globalData.hasStorageInfo = false     
    }
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } 
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
    app.globalData.pageBackstate = true
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