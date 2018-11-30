//index.js 
//我的 绑定手机
//获取应用实例

var phone_api = require('../../../net/phone_api.js')
var utils = require('../../..//utils/util.js')
var meApi = require('../../../net/me_api.js')
var qcloud = require('../../../vendor/wafer2-client-sdk/index')

const app = getApp()

Page({
  data: {
    send_text: '获取验证码',
    send_disabled: false,
    send_time: null
  },
  onLoad: function(options) {

  },
  onReady: function() {
    // 页面渲染完成
  },
  onShow: function() {
    // 页面显示
  },
  onHide: function() {
    // 页面隐藏
  },
  onUnload: function() {
    // 页面关闭
    utils.showConsole('页面关闭')
  },

  loadUserInfo: function() {
    wx.showLoading({
      title: '数据加载中...',
    })
    meApi.userAppMonitor(this.userAppMonitorSuccess, this.userAppMonitorFail)
  },

  userAppMonitorSuccess: function(result) {
    util.showConsole(result)

  },
  userAppMonitorFail: function(e) {
    util.showModel('提示', e)
  },

  onPhoneNumberListen: function(even) {

    this.setData({
      phoneNumber: even.detail.value
    })

  },
  sendSMSCode: function(even) {
    var phoneNumber = even.currentTarget.dataset.phonenumber
    if (!utils.phoneNumberCheck(phoneNumber)) {
      utils.showModel('提示', '请输入正确的手机号。')
      return
    }

    this.setData({
      send_disabled: true
    })

    phone_api.requestCheckCode(
      even.currentTarget.dataset.phonenumber,
      this.sendPhoneCheckCodeSuccess,
      this.sendPhoneCheckCodeFail)

  },

  formSubmit: function(e) {

    wx.showLoading({
      title: '数据提交中....',
    })

    var phoneNumber = e.detail.value.phoneNumber;
    var code = e.detail.value.code;

    if (!utils.phoneNumberCheck(phoneNumber)) {
      utils.showModel("提示", "请输入正确的手机号。")
      return;
    }

    if (code == null || code == "") {
      utils.showModel("提示", "请输入验证码。")
      return;

    }

    phone_api.bindingPhone(
      phoneNumber,
      parseInt(code),
      this.bindingPhoneSuccess,
      this.bindingPhoneFail,
    )

  },

  bindingPhoneSuccess: function(res) {
    utils.showSuccess(res.data.msg)
    this.login()
  },

  bindingPhoneFail: function(error) {
    wx.hideLoading()
    utils.showModel('提示', error.data.msg)
  },


  login: function() {
    const session = qcloud.Session.get()

    if (session) {
      qcloud.loginWithCode({
        success: res => {
          wx.hideLoading()

          wx.navigateBack({
            delta: 1
          })
        },
        fail: err => {
          utils.showModel("提示", err)
        }
      })
    }



  },



  sendPhoneCheckCodeSuccess: function(res) {
    // 开始倒计时
    this.setData({
      send_time: Math.round(+new Date() / 1000)
    })
    this.sendCountDown()

  },
  sendPhoneCheckCodeFail: function(error) {
    this.setData({
      send_disabled: false
    })
    utils.showModel('提示', error)
  },
  sendCountDown: function() {
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

})