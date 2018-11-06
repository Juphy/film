//index.js
//活动
//获取应用实例
const app = getApp()

Page({
  data: {
    activityList: [{
      icon: "/images/dwsj.jpg",
        name: "动物世界"
      },
      {
        icon: "/images/xfmsl.jpg",
        name: "侏罗纪世界"
      },
      {
        icon: "/images/xfmsl.jpg",
        name: "幸福马上来"
      },
    ]
  },

  showInput: function() {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function() {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function() {

    this.setData({
      inputVal: ""
    });
  },
  onClickItem:function(e){
wx.navigateTo({
  url: '/pages/activity/detail/detail',
})
  },
  inputTyping: function(e) {
    this.setData({
      inputVal: e.detail.value
    });
  }

})