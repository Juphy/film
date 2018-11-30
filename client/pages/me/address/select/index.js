//index.js 
//选择收货地址
//获取应用实例
var addressApi = require('../../../../net/address_api.js')
var utils = require('../../../../utils/util.js')
const app = getApp()

Page({
  data: {

  },
  onLoad: function() {
    this.loadAddressList()

  },
  loadAddressList: function() {
    addressApi.requestAddressList(this.addressListSuccess, this.addressListFail)
  },
  addressListSuccess: function(result) {
    utils.showConsole(result)

    this.setData({
      addressList: result.data.res
    })

  },
  addressListFail: function(e) {
    utils.showModel('提示', e)
  },
  onClickManageAddress: function() {
    wx.navigateTo({
      url: '/pages/me/address/index',
    })
  },
  onClickAddAddress: function() {
    wx.navigateTo({
      url: '/pages/me/address/edit/index',
    })
  },
  onClickSelectAddress:function(e){

utils.showConsole(e)
let addressinfo=e.currentTarget.dataset.addressinfo
wx.setStorage({
  key: 'selectAddressInfo',
  data: addressinfo,
})

wx.navigateBack({
  delta:1
})

  }


})