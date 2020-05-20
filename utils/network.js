function request(url, params, success, fail) {
  this.requestLoading(url, params, "", success, fail)
}
// 展示进度条的网络请求
// url:网络请求的url
// params:请求参数
// message:进度条的提示信息
// success:成功的回调函数
// fail：失败的回调
function requestLoading(url, params, message, success, fail) {
  console.log(params)
  wx.showNavigationBarLoading()
  if (message != "") {
    wx.showLoading({
      title: message,
    })
  }
  wx.request({
    url: url,
    data: params,
    header: {
      //'Content-Type': 'application/json'
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'post',
    success: function (res) {
      //console.log(res.data)
      wx.hideNavigationBarLoading()
      if (message != "") {
        wx.hideLoading()
      }
      if (res.statusCode == 200) {
        success(res.data)
      } else {
        fail()
      }

    },
    fail: function (res) {
      wx.hideNavigationBarLoading()
      if (message != "") {
        wx.hideLoading()
      }
      fail()
    },
    complete: function (res) {

    },
  })
}
module.exports = {
  request: request,
  requestLoading: requestLoading
}

// //路径根据自己项目路径修改
// var network = require("/utils/network.js")
// getData: function() {
//   network.requestLoading(URL.MY_SCORE, that.data.params, '正在加载数据', function (res) {
//     //res就是我们请求接口返回的数据
//     console.log(res)
//   }, function () {
//     wx.showToast({
//       title: '加载数据失败',
//     })
//   })
// }