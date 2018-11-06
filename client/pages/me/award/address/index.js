//index.js 
//领奖信息确认
//获取应用实例
const app = getApp()

Page({
  data: {
    


  },

  onLoad: function () {

  },
  onClickAddAddress:function(e){
    wx.navigateTo({
      url: '/pages/me/address/edit/index',
    })
  },


  onClickChangeAddress:function(e){

    wx.navigateTo({
      url: '/pages/me/address/select/index',
    })


   

  },
 

})