//index.js 
//我的
//获取应用实例
const app = getApp()

Page({
  data: {
    awardList: [{
        title: "哇哈哈哈哈哈哈哈",
        state: true,
        awardtype: 1
      },
      {
        title: "哇哈哈哈哈哈哈哈",
        state: true,
        awardtype: 2
      },
      {
        title: "哇哈哈哈哈哈哈哈",
        state: false,
        awardtype: 3
      },
      {
        title: "哇哈哈哈哈哈哈哈",
        state: false,
        awardtype: 1
      },
      {
        title: "哇哈哈哈哈哈哈哈",
        state: false,
        awardtype: 2
      },
      {
        title: "哇哈哈哈哈哈哈哈",
        state: false,
        awardtype: 3
      },
      {
        title: "哇哈哈哈哈哈哈哈",
        state: false,
        awardtype: 1
      },
      {
        title: "哇哈哈哈哈哈哈哈",
        state: false,
        awardtype: 2
      },
      {
        title: "哇哈哈哈哈哈哈哈",
        state: false,
        awardtype: 3
      },
      {
        title: "哇哈哈哈哈哈哈哈",
        state: false,
        awardtype: 1
      },
      {
        title: "哇哈哈哈哈哈哈哈",
        state: false,
        awardtype: 2
      },
      {
        title: "哇哈哈哈哈哈哈哈",
        state: false,
        awardtype: 3
      },



    ]
  },

  onLoad: function() {

  },

  onClickAward: function(e) {

    switch (e.currentTarget.dataset.type) {
      case 1:
        //实物 填写收货 地址
       this.goAwardAddress();
        break;
      case 2:
        //电影票 
      case 3:
        //钱

        this.sohwDialog();

        break;
    }

  },
  goAwardAddress:function(){
    wx.navigateTo({
      url: '/pages/me/award/address/index',
    })
  },
  sohwDialog: function() {
    wx.showModal({
      title: '提示',
      content: ' 请等待客服接洽，领奖事宜。',
    })
  }


})