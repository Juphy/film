//index.js 
//地址管理
//获取应用实例
const app = getApp()

Page({
  data: {

    addressList:[
      {name:"张三",phone:"15501059685",address:"北京市海淀区花园路13号庚坊国际八层华影聚合",isDefault:false},
      { name: "张三", phone: "15501059685", address: "北京市海淀区花园路13号庚坊国际八层华影聚合", isDefault: true },
      { name: "张三", phone: "15501059685", address: "北京市海淀区花园路13号庚坊国际八层华影聚合", isDefault: false },
      { name: "张三", phone: "15501059685", address: "北京市海淀区花园路13号庚坊国际八层华影聚合", isDefault: false },
      { name: "张三", phone: "15501059685", address: "北京市海淀区花园路13号庚坊国际八层华影聚合", isDefault: false },
      { name: "张三", phone: "15501059685", address: "北京市海淀区花园路13号庚坊国际八层华影聚合", isDefault: false },
      { name: "张三", phone: "15501059685", address: "北京市海淀区花园路13号庚坊国际八层华影聚合", isDefault: false },
    ],
    svWidth:0

  },
  onLoad: function () {
  },
//设置默认地址
  onClickDefault:function(event){

    var name=event.currentTarget.id;
    console.log(name);
  },
  //编辑地址
  onClickEdit:function(event){

  },
//删除地址
  onClickDel:function(event){

wx.showModal({
  title: '提示',
  content: '您确定要删除该地址吗？',
  showCancel: true,
  success: function(res) {

  },
  fail: function(res) {
    
  },
  complete: function(res) {},
})

  },
  //添加地址
  onClickAdd:function(event){

wx.navigateTo({
  url: '/pages/me/address/edit/index',
})

  }

  

})
