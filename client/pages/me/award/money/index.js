var utils = require('../../../../utils/util.js')
var awardApi = require('../../../../net/award_api.js')
var qcloud = require('../../../../vendor/wafer2-client-sdk/index')

var winner_id
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    winner_id = options.winner_id

    utils.showConsole(qcloud.Session.get().userinfo.phone)

    this.setData({
      phone: qcloud.Session.get().userinfo.phone
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
    
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)

    let userName=e.detail.value.userName
    let bankNumber=e.detail.value.bankNumber
    let userID=e.detail.value.userID
    let userPhone=e.detail.value.userPhone

    if(!userName){
      utils.showModel("提示",'请输入真实姓名')
      return
    }

    if(!userPhone){
      utils.showModel("提示", '请输入手机号')
      return
    }

    if (!utils.phoneNumberCheck(userPhone)){
      utils.showModel("提示", '请输入正确的手机号')
      return
    }

    if(!bankNumber){
      utils.showModel("提示","请输入银行卡号")
      return
    }

    if(!userID){
      utils.showModel("提示", "请输入身份证号")
      return
    }

    if (!utils.isCardNo(userID)){
      utils.showModel("提示", "请输入正确的身份证号")
      return
    }


    awardApi.winnerAcceptMoneyPrize(winner_id, bankNumber, userID, userPhone, userName, this.winnerAcceptMoneyPrizeSuccess, this.winnerAcceptMoneyPrizeFail)


  },

  winnerAcceptMoneyPrizeSuccess:function(result){
    utils.showSuccess(result.msg)
    wx.navigateBack({
      delta:1
    })
  },

  winnerAcceptMoneyPrizeFail:function(e){
    utils.showModel("提示",e)
  }


})