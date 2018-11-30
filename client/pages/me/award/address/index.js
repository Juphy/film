//index.js 
//领奖信息确认 地址信息
//获取应用实例
const app = getApp()

var addressApi = require('../../../../net/address_api.js')
var awardApi = require('../../../../net/award_api.js')
var utils = require('../../../../utils/util.js')
var winner_id
Page({
  data: {

  },

  onLoad: function(options) {
    utils.showConsole(options)
    winner_id = options.winner_id
    this.loadAddressList()
  },
  onShow: function() {

    let that = this

    wx.getStorage({
      key: 'selectAddressInfo',
      success: function(res) {
        that.setData({
          addressInfo: res.data
        });
      },
    })
  },
  loadAddressList: function() {
    addressApi.userGetDefaultAddress(this.userGetDefaultAddressSuccess, this.userGetDefaultAddressFail)
  },
  onClickAddAddress: function(e) {
    wx.navigateTo({
      url: '/pages/me/address/edit/index',
    })
  },
  userGetDefaultAddressSuccess: function(result) {
    utils.showConsole(result)
    this.setData({
      addressInfo: result.data.res
    });

  },

  userGetDefaultAddressFail: function(e) {
    utils.showConsole(e)

  },

  onClickChangeAddress: function(e) {

    wx.navigateTo({
      url: '/pages/me/address/select/index',
    })
  },

  onClickOk: function(e) {
    utils.showConsole(e.currentTarget.dataset.addressinfo)
    let addressInfo = e.currentTarget.dataset.addressinfo

    awardApi.winnerAcceptGoodsPrize(winner_id, addressInfo.contact, addressInfo.phone, addressInfo.province + addressInfo.city + addressInfo.county + addressInfo.address, this.winnerAcceptGoodsPrizeSuccess, this.winnerAcceptGoodsPrizeFail)

    wx.removeStorage({
      key: 'selectAddressInfo',
      success: function(res) {},
    })
  },
  winnerAcceptGoodsPrizeSuccess: function(result) {
    utils.showSuccess("领奖成功，请耐心等待派奖。")
    wx.navigateBack({
      delta: 1
    })
  },
  winnerAcceptGoodsPrizeFail: function(e) {
    utils.showModel('提示', e)
  }
})