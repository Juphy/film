//index.js 
//选择收货地址
//获取应用实例
const app = getApp()

Page({
  data: {
    addressList: [
      { name: "张三", phone: "15501059685", address: "北京市海淀区花园路13号庚坊国际八层华影聚合", isDefault: false },
      { name: "张三", phone: "15501059685", address: "北京市海淀区花园路13号庚坊国际八层华影聚合", isDefault: false },
      { name: "张三", phone: "15501059685", address: "北京市海淀区花园路13号庚坊国际八层华影聚合", isDefault: true },
      { name: "张三", phone: "15501059685", address: "北京市海淀区花园路13号庚坊国际八层华影聚合", isDefault: false },
      { name: "张三", phone: "15501059685", address: "北京市海淀区花园路13号庚坊国际八层华影聚合", isDefault: false },
      { name: "张三", phone: "15501059685", address: "北京市海淀区花园路13号庚坊国际八层华影聚合", isDefault: false },
      { name: "张三", phone: "15501059685", address: "北京市海淀区花园路13号庚坊国际八层华影聚合", isDefault: false },
      { name: "张三", phone: "15501059685", address: "北京市海淀区花园路13号庚坊国际八层华影聚合", isDefault: false },
      { name: "张三", phone: "15501059685", address: "北京市海淀区花园路13号庚坊国际八层华影聚合", isDefault: false },
      { name: "张三", phone: "15501059685", address: "北京市海淀区花园路13号庚坊国际八层华影聚合", isDefault: false },
      { name: "张三", phone: "15501059685", address: "北京市海淀区花园路13号庚坊国际八层华影聚合", isDefault: false },
      { name: "张三", phone: "15501059685", address: "北京市海淀区花园路13号庚坊国际八层华影聚合", isDefault: false },
    ],

  },
  onLoad: function () {
  },
  onClickManageAddress:function(){
    wx.navigateTo({
      url: '/pages/me/address/index',
    })
  },
  onClickAddAddress:function(){
    wx.navigateTo({
      url: '/pages/me/address/edit/index',
    })
  }
  

})
