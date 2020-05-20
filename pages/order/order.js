// pages/order/order.js
var util = require('../../utils/md5.js')
const app = getApp()
const salt = app.globalData.salt
const sign = app.globalData.sign
Page({

  /**
   * 页面的初始数据
   */
  date: new Date(), //当前的时间
  data: {       
    // current: {selected: false, idx: 0, addr: ''},
    // firstLoad: true,

    thisDoctorInfo: {},
    showMark: {
      textArea: false,
      resume: true,
      pushMsg: true,
      pullMsg: true,
      lists: true,
    },
    showSubmit: true,
    dropBox: false,
    messages: ''
  },

  catchTapPushMsg(event) {
    let that = this
    let state = !app.globalData.hasinfo || !app.globalData.userInfo || !app.globalData.hasStorageInfo
    if (state) {
      wx.showModal({
        title: '提示',
        content: '请前往登录授权并完善个人信息',
        success (res) { if(res.confirm) wx.switchTab({url: '../my/my'}) }
      })
      return
    }

    let thisMark = event.currentTarget.dataset.mark
    let tempShowMask = that.data.showMark
    for(let key in tempShowMask) {
      if(key == 'textArea') tempShowMask[key] = true
      else tempShowMask[key] = false
    }
    that.setData({
      showMark: tempShowMask,
      showSubmit: true,
      messages: ''
    })
  },

  catchTapCancel(event) {
    let that = this
    let state = !app.globalData.hasinfo || !app.globalData.userInfo || !app.globalData.hasStorageInfo
    if (state) {
      wx.showModal({
        title: '提示',
        content: '请前往登录授权并完善个人信息',
        success (res) { if(res.confirm) wx.switchTab({url: '../my/my'}) }
      })
      return
    }

    let tempShowMask = that.data.showMark
    for(let key in tempShowMask) {
      if(key == 'textArea') tempShowMask[key] = false
      else tempShowMask[key] = true
    }
    that.setData({
      showMark: tempShowMask,
      showSubmit: true
    })
  },

  catchTapSubmit(event) {
    let that = this
    let state = !app.globalData.hasinfo || !app.globalData.userInfo || !app.globalData.hasStorageInfo
    if (state) {
      wx.showModal({
        title: '提示',
        content: '请前往登录授权并完善个人信息',
        success (res) { if(res.confirm) wx.switchTab({url: '../my/my'}) }
      })
      return
    }

    let tempShowMask = that.data.showMark
    for(let key in tempShowMask) {
      if(key == 'textArea') tempShowMask[key] = false
      else tempShowMask[key] = true
    }
    that.setData({
      showMark: tempShowMask,
      showSubmit: true
    })
  },

  bindFormSubmit(event) {
    let that = this
    let msglog = event.detail.value.textarea
    if(msglog == '') {
      wx.showModal({
        title: '提示',
        content: '输入内容无效',
        showCancel: false,
        confirmText: '确定',
        confirmColor: '#FF0000'
      })
      return
    }
    let orderDrid = that.data.thisDoctorInfo.drid
    app.request({
      url: 'https://qx.sj0763.com/2020/wxapp_xlfd/api/sentmsg.php',
      data: {
        "openid": app.globalData.openID, 
        "drid": orderDrid,
        "sessid": '0',
        "msg": encodeURI(msglog),
        "sign": util.hexMD5(salt + orderDrid + encodeURI(msglog) + app.globalData.openID + '0')
      },
      msg: '留言',
      hideStstus: true,
      success: function (res) {
        console.log(res)
        wx.showToast({title: '留言成功' })

        let tempShowMask = that.data.showMark
        for(let key in tempShowMask) {
          if(key == 'textArea') tempShowMask[key] = false
          else tempShowMask[key] = true
        }
        that.setData({
          showMark: tempShowMask,
          showSubmit: true
        })
      },
      fail: function (res) { 
        console.log(res)
        wx.showModal({
          title: '提示',
          content: '留言失败,' + res.desc,
          showCancel: false,
          confirmText: '确定',
          confirmColor: '#FF0000'
        })
      }
    })   
  },

  catchTapPullMsg(event) {
    let that = this
    let state = !app.globalData.hasinfo || !app.globalData.userInfo || !app.globalData.hasStorageInfo
    if (state) {
      wx.showModal({
        title: '提示',
        content: '请前往登录授权并完善个人信息',
        success (res) { if(res.confirm) wx.switchTab({url: '../my/my'}) }
      })
      return
    }

    let thisMark = event.currentTarget.dataset.mark
    let tempShowMask = that.data.showMark
    for(let key in tempShowMask) {
      if(key == 'textArea') tempShowMask[key] = true
      else tempShowMask[key] = false
    }
    that.setData({
      showMark: tempShowMask,
      showSubmit: false
    })
    app.request({
      url: 'https://qx.sj0763.com/2020/wxapp_xlfd/api/mymsgs.php',
      data: {
        "openid": app.globalData.openID, 
        "sign": util.hexMD5(salt + app.globalData.openID )
      },
      msg: '获取会话',
      hideStstus: true,
      success: function (res) {
        console.log(res)
        if(res.desc == 'ok') {
          let sessions = res.sessions
          let tmpLongMsgs = ''
          // console.log(msgs)
          sessions.forEach(function(item, index) {
            if(item.drid == that.data.thisDoctorInfo.drid) {
              let msgs = item.msgs
              let tmpMsgs = ''
              msgs.forEach(function(val, idx) {
                tmpMsgs += '@' + val.date + '\r\n' + decodeURI(val.content) + '\r\n'
              })
              tmpLongMsgs += tmpMsgs
            }
          })
          if(tmpLongMsgs == '') {
            wx.showToast({
              title: '没有留言',
              icon: 'none'
            })
          } else {
            that.setData({messages: tmpLongMsgs})
          }
        }
      },
      fail: function (res) { 
        console.log(res)
        wx.showToast({
          title: '获取留言失败',
          icon: 'none',
          duration: 1000,
          mask: true        
        })
      }
    })    
  },

  catchTapLists: function(e) {
    let that = this
    let tempShowMask = that.data.showMark
    this.setData({
      dropBox: !that.data.dropBox
    })
    if(that.data.dropBox)
    {
      for(let key in tempShowMask) {
        if(key == 'lists') tempShowMask[key] = true
        else tempShowMask[key] = false
      }
      that.setData({
        showMark: tempShowMask,
        showSubmit: true
      })
    }
    else
    {
      for(let key in tempShowMask) {
        if(key == 'textArea') tempShowMask[key] = false
        else tempShowMask[key] = true
      }
      that.setData({
        showMark: tempShowMask,
        showSubmit: true
      })
    }
  },

  bindSetOrder: function(e) {
    let that = this
    let state = !app.globalData.hasinfo || !app.globalData.userInfo || !app.globalData.hasStorageInfo
    if (state) {
      wx.showModal({
        title: '提示',
        content: '请前往登录授权并完善个人信息',
        success (res) { if(res.confirm) wx.switchTab({url: '../my/my'}) }
      })
      return
    }
    
    let index = e.detail.value
    let orderDate = that.data.thisDoctorInfo.schedule[index]
    let orderDrid = that.data.thisDoctorInfo.drid
    let orderName = 'test'
    let orderPhone = '18056113210'
    console.log(orderDate)
    console.log(orderDrid)

    // let orders = JSON.stringify(orderInfo)
    app.request({
      url: 'https://qx.sj0763.com/2020/wxapp_xlfd/api/appointment.php',
      data: {
        "openid": app.globalData.openID, 
        "drid": orderDrid,
        "date": orderDate,
        "name": orderName,
        "phone": orderPhone,
        "sign": util.hexMD5(salt + orderDate + orderDrid + orderName + app.globalData.openID + orderPhone )
      },
      msg: '预约专家',
      hideStstus: false,
      success: function (res) {
        console.log(res)
      },
      fail: function (res) { 
        console.log(res)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    // console.log(app.globalData.doctorInfo)
    let oldData = app.globalData.doctorInfo.schedule
    let newData = []
    let weekDay = new Array('周日', '周一', '周二', '周三', '周四', '周五', '周六');
    oldData.forEach(function(item, index){
      newData.push(item + '(' + weekDay[(new Date(item)).getDay()] + ')')
    })
    app.globalData.doctorInfo.scheduleLong = newData
    that.setData({
      thisDoctorInfo: app.globalData.doctorInfo
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
    return {
      title: "轻松心理辅导小程序",
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