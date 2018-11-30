//index.js 
//地址管理
//获取应用实例
var addressApi = require('../../../net/address_api.js')
var utils = require('../../../utils/util.js')

const app = getApp()

Page({
    data: {

        svWidth: 0

    },
    onLoad: function() {
        utils.showConsole('onLoad')
    },


    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        utils.showConsole('onShow')
        this.loadAddressList()

    },

  onClickDefaultAddress:function(e){

utils.showConsole(e.currentTarget.dataset)
let addressId=e.currentTarget.dataset.addressid
let isDefault=e.currentTarget.dataset.default
if(isDefault==0){
  addressApi.requestSetDefaultAddress(addressId,this.defaultAddressSuccess,this.defaultAddressFail)

}

   



  },
  defaultAddressSuccess: function (result) {
this.loadAddressList()
  },
  defaultAddressFail:function(e){
    utils.showConsole(e)

  },
    loadAddressList: function() {
        addressApi.requestAddressList(this.addressListSuccess, this.addressListFail)

    },
    //编辑地址
    onClickEdit: function(event) {
        var address = this.data.addressList[event.currentTarget.id]

        wx.navigateTo({
            url: '/pages/me/address/edit/index?userName=' + address.contact + '&province=' + address.province + '&city=' + address.city + '&county=' + address.county + '&address=' + address.address + '&phone=' + address.phone + '&default=' + address.default+'&id=' + address.id,
        })

    },
    //删除地址
    onClickDel: function(event) {

        utils.showConsole(event.currentTarget.id)
        var that = this
        wx.showModal({
            title: '提示',
            content: '您确定要删除该地址吗？',
            showCancel: true,
            success: function(res) {

                that.delAddress(event.currentTarget.id)

            },
            fail: function(res) {

            },
        })

    },

    delAddress: function(addressId) {
        addressApi.requestDelAddress(addressId, this.delAddressSuccess, this.delAddressFail)
    },

    //添加地址
    onClickAdd: function(event) {

        wx.navigateTo({
            url: '/pages/me/address/edit/index',
        })

    },

    addressListSuccess: function(result) {
        utils.showConsole(result)
        this.setData({
            addressList: result.data.res
        });

    },

    addressListFail: function(e) {
        utils.showConsole(e)

    },
    delAddressSuccess: function(result) {
        utils.showSuccess("删除成功")
        this.loadAddressList();
    },
    delAddressFail: function(e) {
        utils.showModel('提示', e.data.msg)
    }

})