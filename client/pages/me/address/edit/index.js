//index.js 
//编辑/新建 地址
//获取应用实例
const app = getApp()

Page({
  data: {
    isDefault: true
  },
  onLoad: function() {},
  onSwitch2Change: function(event) {
    console.log(event.detail.value);
  },
  formSubmit: function(e) {
    console.log(e);
    wx.navigateBack({

    })
  }

})