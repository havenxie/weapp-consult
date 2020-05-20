var util = require('../../utils/md5.js')
var utilTime = require('../../utils/util.js')
const app = getApp()
const salt = app.globalData.salt
const sign = app.globalData.sign

Page({
  /**
   * 页面的初始数据
   */
  date: new Date(), //当前的时间
  data: {           //小红点的选择。后续增加的功能
    selected: [
      // {
      //   date: '2019-05-29'
      // }, {
      //   date: '2019-06-18'
      // }, {
      //   date: '2019-06-19'
      // }, {
      //   date: '2019-06-21'
      // }
    ],
    choices: [],     //批量日期的存储
    canteens: [],    //存放餐厅信息原始数据
    canteensAddr: {},//存放探听名称和地址用于显示
    currentDate: '', //当前选择的日期
    currentInfo: {}, //当前选择的详细信息
    batch: false,    //是否按下了批量操作
    minDate: null,   //最小时间
    maxDate: null    //最大时间
  },
  getOrders: function() {
    let that = this
    app.request({
      url: 'https://wm.sj0763.com/wxapp_dingcan/api/getorders.php',
      data: {
        "date": that.data.currentDate,
        "openid": app.globalData.openID,
        "sign": util.hexMD5(that.data.currentDate + app.globalData.openID + sign)
      },
      msg: '获取',
      hideStstus: true,
      success: function (res) {
        if ((res.desc == 'ok') || (res.bind == true)) {
          // console.log(res.orders)
          that.setData({ currentInfo: res.orders })
        }
      },
      fail: function (res) {
        // console.log(res)
        if(res.code == 405 && res.desc == 'date out of range') {
          that.setData({ currentInfo: null })
        }
      }
    })
  },
  /**
   * 获取选择日期
   */
  bindgetdate(e) {
    let time = e.detail;
    let timeStr = time.year + '-' + time.month + '-' + time.date
    console.log(timeStr)
    this.setData({ currentDate: timeStr })
    if(!this.data.batch) {//不是批量选择时候执行
      this.getOrders()
    } else {              //批量选择的时候执行
      let minDay = this.data.minDate.getDate()
      let maxDay = this.data.maxDate.getDate()
      let minMonth = this.data.minDate.getMonth()
      let maxMonth = this.data.maxDate.getMonth()
      
      console.log(parseInt(time.month))
      console.log(parseInt(time.date))
      console.log(minMonth+1)
      console.log(maxMonth+1)
      console.log(minDay)
      console.log(maxDay)

      let tmp = this.data.choices
      let i = 0; let length = tmp.length
      for(i = 0; i < length; i++) {
        if(tmp[i].date == timeStr) {
          tmp.splice(i, 1) 
          break;
        }
      }
      if(i == length) {
        tmp.push({ 'date': timeStr })
      }
      // console.log(tmp)
      this.setData({ date: timeStr })
      this.setData({ choices: tmp })
    }
  },

  cancel: function(e) {
    let that = this
    app.request({
      url: 'https://wm.sj0763.com/wxapp_dingcan/api/cancelorder.php',
      data: {
        "date": that.data.currentDate,
        "meal": e.currentTarget.dataset.meal,
        "openid": app.globalData.openID,
        "sign": util.hexMD5(that.data.currentDate + e.currentTarget.dataset.meal + app.globalData.openID + sign)
      },
      msg: '取消',
      success: function (res) {
        let tmp = that.data.currentInfo
        switch (e.currentTarget.dataset.meal) {
          case '0': tmp.breakfast = ''; break;
          case '1': tmp.lunch = ''; break;
          case '2': tmp.dinner = ''; break;
          default: break;
        }
        that.setData({ currentInfo: tmp })
      },
      fail: function (res) {
        // console.log(res)
      }
    })
  },

  bindPickerChange: function (e) {
    let that = this
    let index = parseInt(e.detail.value)
    let canteenName = this.data.canteens[index].name
    let canteenid = this.data.canteens[index].id
    if(!this.data.batch) {
      app.request({ 
        url: 'https://wm.sj0763.com/wxapp_dingcan/api/setstatus.php', 
        data: {
          "action": e.currentTarget.dataset.action,
          "canteen": canteenid,
          "date": that.data.currentDate,
          "meal": e.currentTarget.dataset.meal,
          "openid": app.globalData.openID,
          "sign": util.hexMD5(e.currentTarget.dataset.action + canteenid + that.data.currentDate + e.currentTarget.dataset.meal + app.globalData.openID + sign)
        }, 
        msg: '订餐', 
        success: function(res) {
          let tmp = that.data.currentInfo
          switch(e.currentTarget.dataset.meal) {
            case '0': tmp.breakfast = canteenName; break;
            case '1': tmp.lunch = canteenName; break;
            case '2': tmp.dinner = canteenName; break;
            default: break;
          }
          that.setData({ currentInfo: tmp })
        }, 
        fail: function(res) {} 
      }) 
    } else {
      let json_dates = JSON.stringify(that.data.choices)
      // console.log(json_dates)
      app.request({
        url: 'https://wm.sj0763.com/wxapp_dingcan/api/setorders.php',
        data: {
          "canteen": canteenid,
          "json_dates": json_dates,
          "meal": e.currentTarget.dataset.meal,
          "openid": app.globalData.openID,
          "sign": util.hexMD5(canteenid + json_dates + e.currentTarget.dataset.meal + app.globalData.openID + sign)
        },
        msg: '批量订餐',
        success: function (res) {
          that.batchBtn()

          // console.log(res)
          // let tmp = that.data.currentInfo
          // switch (e.currentTarget.dataset.meal) {
          //   case '0': tmp.breakfast = canteenName; break;
          //   case '1': tmp.lunch = canteenName; break;
          //   case '2': tmp.dinner = canteenName; break;
          //   default: break;
          // }
          // that.setData({ currentInfo: tmp })
        },
        fail: function (res) { } 
      })
    }
  },

  batchBtn: function() {
    let that = this
    this.setData({ batch: !that.data.batch})
    this.getOrders()
  },

  navToPlan: function() {
    wx.navigateTo({
      url: '../plan/plan',
      success: (res) => { },
      fail: (err) => {
        console.log(err)
      }
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this

    app.requestAddr({
      lat: 0,
      lon: 0,
      hideStstus: true,
      success: function (res) {
        let revCanteens = res.canteens
        let tmpArr = []
        revCanteens.forEach(function (value, index, revCanteens) {
          tmpArr[index] = value.name + ' 地址: ' + value.address
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

    let thisTime = new Date()
    let startIndex = 0, length = 30
    if (thisTime.getHours() <= 11) {
      startIndex = 1
    } else {
      startIndex = 2
    }
    let time = utilTime.formatDate(new Date(thisTime.getTime() + startIndex * 24 * 60 * 60 * 1000 ))
    let choices = utilTime.getDates2(length, time)
    
    let minDate = new Date(thisTime.getTime() + startIndex * 24 * 60 * 60 * 1000)
    let maxDate = new Date(thisTime.getTime() + (startIndex + length - 1) * 24 * 60 * 60 *1000)
    this.setData({ 
      choices: choices,
      minDate: minDate,
      maxDate: maxDate
    })
    console.log(minDate)
    console.log(maxDate.getDate())
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
    if(this.data.currentDate) {
      this.getOrders()
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