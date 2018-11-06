//index.js 
//参与记录
//获取应用实例
const app = getApp()

Page({
  data: {
    winWidth: 0,
    winHeight: 0, 
    showtab: 0,  //顶部选项卡索引
    tabnav: {
      tabnum: 2,
      tabitem: [
        {
          "id": 0,
          "text": "进行中"
        },
        {
          "id": 1,
          "text": "已结束"
        },
       
      ]
    },
    productList: [],

    overActivityList:[
      {title:'我是标题哇哈哈哈' , state:"待开奖" },
      { title: '我是标题哇哈哈哈', state: "待开奖" },
      { title: '我是标题哇哈哈哈', state: "待开奖" },
      { title: '我是标题哇哈哈哈', state: "待开奖" },
    ],
    doingActivityList: [
      { title: '我是标题嘿哇哈哈哈', state: "待开奖" },
      { title: '我是标题哇哈哈哈', state: "待开奖" },
      { title: '我是标题哇哈哈哈', state: "待开奖" },
      { title: '我是标题哇哈哈哈', state: "待开奖" },
    ],

  },
  onLoad: function () {

    var that = this;

    /** 
     * 获取系统信息 
     */
    wx.getSystemInfo({

      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }

    }); 

  },
  setTab: function (e) {
    const edata = e.currentTarget.dataset;
    this.setData({
      showtab: edata.tabindex,

    })
  },
  bindChange: function (e) {

    var that = this;
    that.setData({ showtab: e.detail.current });

  },

  onClickDetail:function(e){
    wx.navigateTo({
      url: '/pages/me/partake_record/detail/index',
    })
  }



})
