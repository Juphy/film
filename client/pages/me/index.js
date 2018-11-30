//index.js 
//我的
//获取应用实例
//index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
var hz2py = require('../../utils/hz2py.js')
var meApi = require('../../net/me_api.js')

const app = getApp()

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    takeSession: false,
    requestResult: ''
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function() {

  },

  onShow: function() {

    let session = qcloud.Session.get()
    if (session) {
      this.setData({
        userInfo: session.userinfo,
        hasUserInfo: true
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/index',
      })
    }

    this.loadUserInfo()

  },

  loadUserInfo: function() {
    wx.showLoading({
      title: '数据加载中...',
    })
    meApi.userAppMonitor(this.userAppMonitorSuccess, this.userAppMonitorFail)
  },
  userAppMonitorSuccess: function(result) {
    wx.hideLoading()
    wx.stopPullDownRefresh()
    util.showConsole(result)
    this.setData({
      countWinner: result.data.res.count_winner,
      countReport: result.data.res.count_report,
      countWinnerSure: result.data.res.count_winner_sure
    })
  },
  userAppMonitorFail: function(e) {
    wx.hideLoading()
    wx.stopPullDownRefresh()
    util.showModel('提示', e)
  },

  onGoAbout: function(e) {
    wx.navigateTo({
      url: '/pages/me/about/about',
    })
  },

  onCallService: function(e) {
    wx.makePhoneCall({
      phoneNumber: '123456'
    })
  },
  onBindingPhone: function(e) {
    wx.navigateTo({
      url: '/pages/me/phone/phone',
    })
  },
  onClickPartakeRecord: function(e) {
    //判断登录 然后跳转

    wx.navigateTo({
      url: '/pages/me/partake_record/index',
    })
  },


  onClickProblem: function() {

    wx.navigateTo({
      url: '/pages/me/problem/problem',
    })
  },
  loginWithCode: function(str) {
    console.log(str);
  },


  onClickBindingPhone: function(e) {
    wx.navigateTo({
      url: '/pages/me/phone/phone',
    })
  },
  onClickLogistics: function(e) {
    wx.navigateTo({
      url: '/pages/me/logistics/logistics_list/index',
    })
  },


  bindGetUserInfo: function(e) {
    if (this.data.logged) return

    util.showBusy('正在登录')

    const session = qcloud.Session.get()

    if (session) {

      // 第二次登录
      // 或者本地已经有登录态
      // 可使用本函数更新登录态
      qcloud.loginWithCode({
        success: res => {
          this.setData({
            userInfo: res,
            hasUserInfo: true
          })
          util.showSuccess('登录成功')
        },
        fail: err => {
          console.error(err)
          util.showModel('登录错误', err.message)
        }
      })
    } else {
      // 首次登录
      qcloud.login({
        success: res => {
          this.setData({
            userInfo: res,
            hasUserInfo: true
          })
          util.showSuccess('登录成功')
        },
        fail: err => {
          console.error(err)
          util.showModel('登录错误', err.message)
        }
      })
    }
  },
  // 切换是否带有登录态
  switchRequestMode: function(e) {
    this.setData({
      takeSession: e.detail.value
    })
    this.doRequest()
  },

  doRequest: function() {
    util.showBusy('请求中...')
    var that = this
    var options = {
      url: config.service.requestUrl,
      login: true,
      success(result) {
        util.showSuccess('请求成功完成')
        console.log('request success', result)
        that.setData({
          requestResult: JSON.stringify(result.data)
        })
      },
      fail(error) {
        util.showModel('请求失败', error);
        console.log('request fail', error);
      }
    }
    if (this.data.takeSession) { // 使用 qcloud.request 带登录态登录
      qcloud.request(options)
    } else { // 使用 wx.request 则不带登录态
      wx.request(options)
    }
  },

  onClickAddress: function(e) {
    wx.navigateTo({
      url: '/pages/me/address/index',
    })
  },
  onGoAward: function(e) {
    wx.navigateTo({
      url: '/pages/me/award/index',
    })
  },
  onClickCouponList: function() {
    wx.navigateTo({
      url: '/pages/me/coupon/index',
    })
  },

  // 下拉刷新
  onPullDownRefresh: function() {
    this.loadUserInfo()
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},


})