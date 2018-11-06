//index.js 
//我的 绑定手机
//获取应用实例
const app = getApp()


Page({
  data: {
    send_text: '获取验证码',
    send_disabled: false,
    send_time: null
  },
  onLoad: function (options) {
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  sendSMSCode: function () {
    this.setData({
      send_disabled: true
    })
    var that = this


    that.setData({
      send_time: Math.round(+new Date() / 1000)
    })
    that.sendCountDown()

    // wx.request({
    //   url: 'this is your send sms sode url',
    //   data: {},
    //   method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    //   // header: {}, // 设置请求的 header
    //   success: function (res) {
    //     // success
    //     // 开始倒计时
    //     that.setData({
    //       send_time: Math.round(+new Date() / 1000)
    //     })
    //     that.sendCountDown()
    //   },
    //   fail: function () {
    //     // fail
    //     that.setData({
    //       send_disabled: false
    //     })
    //   },
    //   complete: function () {
    //     // complete
    //   }
    // })


    
  },
  sendCountDown: function () {
    if (!this.data.send_time) {
      return
    }
    var seconds = this.data.send_time + 60 - Math.round(+new Date() / 1000)
    if (seconds > 0) {
      this.setData({
        send_text: `(${seconds}s)`
      })
      setTimeout(this.sendCountDown, 1000)
    } else {
      this.setData({
        send_text: '获取验证码',
        send_disabled: false,
        send_time: null
      })
    }
  },
  //example.js
  submit: function (e) {
    
    console.log(e.detail.formId);
    wx.showModal({
      title: 'formId',
      content: e.detail.formId,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }


    });

    wx.getUserInfo({
      success: res => {
        app.globalData.userInfo = res.userInfo
        console.log(app.globalData.userInfo);
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })

    
  },


  onSubmitContent:function(){

    wx.request({
      url: 'https://api2.huayingjuhe.top/app/info',
      success(res){

console.log(res);
      },
      fail(e){
        console.log(e);

      }


    })

  }





})