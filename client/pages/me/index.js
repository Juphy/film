//index.js 
//我的
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  onGoAbout:function(e){
    wx.navigateTo({
      url: '/pages/me/about/about',
    })
  },

  onCallService:function(e){
    wx.makePhoneCall({
      phoneNumber: '123456'
    })
  },
  onBindingPhone:function(e){
    wx.navigateTo({
      url: '/pages/me/phone/phone',
    })
  },
  onGoProblem:function(e){
    wx.navigateTo({
      url: '/pages/me/problem/problem',
    })
  },
  onClickPartakeRecord:function(e){


//判断登录 然后跳转

    wx.navigateTo({
      url: '/pages/me/partake_record/index',
    })
  },

  onClickProblem:function(){
    wx.navigateTo({
      url: '/pages/me/problem/problem',
    })
  },
  onClickBindingPhone:function(e){
    wx.navigateTo({
      url: '/pages/me/phone/phone',
    })
  },
  onClickLogistics:function(e){
    wx.navigateTo({
      url: '/pages/me/logistics/index',
    })
  }


})
