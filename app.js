//app.js
var util = require('./utils/md5.js') 
App({
  onLaunch: function () {
    var that = this
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        that.globalData.code = res.code
        wx.request({
          url: 'https://qx.sj0763.com/2020/wxapp_xlfd/api/getopenid.php',
          method: 'POST',
          header: { 'content-type': 'application/x-www-form-urlencoded;charset=utf-8' },
          data: {
            "code": that.globalData.code,
            "sign": util.hexMD5(that.globalData.salt + that.globalData.code)
          },
          success: function(res) {
            console.log(res)
            that.globalData.openid = res.data.openid;
            that.globalData.sessionkey = res.data.session_key;
            that.globalData.hasinfo = res.data.hasinfo;
            that.globalData.hasStorageInfo = wx.getStorageSync('hasStorageInfo')
            that.globalData.storageInfo = wx.getStorageSync('storageInfo')
            console.log(that.globalData.hasStorageInfo)
            console.log(that.globalData.storageInfo)
          }
      })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        } else {

        }
      }
   })
 },

  globalData: {
    userInfo: null,       //从微信获取的用户信息，包括头像、昵称等
    hasinfo: 0,          //从后台获取的
    storageInfo: null,   //需要用户自己填写的信息，包括用户名、手机号码（住址可选填）
    hasStorageInfo: 0,   //本地存储的用户信息Flag
    appid: 'wx949aba32354ba88f',//appid需自己提供，此处的appid我随机编写
    sessionkey: '',
    secret: '12f61530ee2ffd767c4bffbdfefc835e',//secret需自己提供，此处的secret我随机编写
    sign: "8765bc4e8854efcbc",
    openid: '',
    
    pageBackstate: false,
    salt: "qsXLFD",
    doctorInfo: {},
  },

  showToast: function (icon, duration, str) {
    wx.showToast({
      title: str,
      icon: icon,
      duration: duration,
    })
  },

  request: function ({ url, data, msg, hideStstus, success, fail, complete }) {
    // console.log({ url, data, msg, success, fail })
    // console.log(data)
    if(!hideStstus) wx.showLoading({ title: msg + '...'})
    let that = this
    wx.request({
      url: url,
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: data,
      success: function (res) {
        // console.log(res)
        let resdata = res.data
        if(!hideStstus) wx.hideLoading()
        if (res.data.code == 200) {
          if (!hideStstus) that.showToast('success', 1000, msg)
          typeof success == 'function' && success(resdata);
        } else {
          if (!hideStstus) {
            wx.showModal({
              title: '提示',
              content: res.data.desc,
              showCancel: false,
              confirmText: '知道了',
              confirmColor: '#FF0000'
            })
          }
          typeof fail == 'function' && fail(resdata);
        }
      },
      fail: function (res) {
        // console.log(res)
        if(!hideStstus) {
          wx.hideLoading()
          that.showToast('none', 2000, '数据请求失败')
        }
      },
      complete: function() {
        typeof complete == 'function' && complete();
      }
    })
  },

})