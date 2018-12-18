//index.js
//活动
//获取应用实例
const app = getApp()
var activityApi = require('../../net/activity_api.js')
var meApi = require('../../net/me_api.js')
var util = require('../../utils/util.js')
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var hz2py = require('../../utils/hz2py.js')
var detailActivityId
var currentTag = 0
var form

Page({
  data: {
    nowDate: util.getNowTime(),
    activityList: [],
    inputVal: '',
    lotteyIsShow: false,
    uploadIsShow: false


  },

  setTab: function(e) {
    const edata = e.currentTarget.dataset;
    currentTag = edata.tabindex
    this.setData({
      showtab: edata.tabindex,

    })
  },
  inputValueChange: function(e) {
    this.setData({
      inputVal: e.detail.value
    })
  },

  onLoad: function(options) {
    let that = this
    wx.getSystemInfo({
      success: function(res) {
        util.showConsole(res)
        that.setData({
          pw: res.screenWidth * 2 * 0.90
        });
      }
    });
    form = options.form



    util.showConsole('=============home')

    util.showConsole(options)
    if (options.form == 'avtivityDetail') {
      meApi.userAppShare(options.uuid, this.userAppShareSuccess, this.userAppShareFail)
      detailActivityId = options.id
    } else if (options.form == 'lotteyDetail') {
      meApi.userAppShare(options.uuid, this.userAppShareSuccess, this.userAppShareFail)
      detailActivityId = options.id
    }


  },

  onShow: function() {
    this.loadActivityList('')

  },

  userAppShareSuccess: function(result) {

    if (form == 'avtivityDetail') {
      wx.navigateTo({
        url: '/pages/activity/detail/detail?id=' + detailActivityId,
      })
    } else if (form == 'lotteyDetail') {
      wx.navigateTo({
        url: '/pages/activity/lottey/index?id=' + detailActivityId,
      })
    }



  },
  userAppShareFail: function(e) {
    util.showModel("提示", e)
  },

  showInput: function() {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function() {
    this.loadActivityList(this.data.inputVal)
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function() {
    this.loadActivityList('')
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  onClickItem: function(e) {
    util.showConsole(e)

    if (e.currentTarget.dataset.atype == 1) {
      wx.navigateTo({
        url: '/pages/activity/detail/detail?id=' + e.currentTarget.id,
      })
    } else {
      wx.navigateTo({
        url: '/pages/activity/lottey/index?id=' + e.currentTarget.id,
      })
    }


  },
  inputTyping: function(e) {
    util.showConsole(e.detail.value)
    this.loadActivityList(e.detail.value)

  },
  loadActivityList: function(name) {
    wx.showLoading({
      title: '数据加载中...',
    })
    activityApi.activityList(name, this.activityListSuccess, this.activityListFail)
  },
  activityListSuccess: function(result) {
    wx.hideLoading()
    wx.stopPullDownRefresh()
    let lotteyIsShow = false
    let uploadIsShow = false

    if (result.data.res.lottey_activite.length > 0) {
      lotteyIsShow = true
    }

    if (result.data.res.upload_activite.length > 0) {
      uploadIsShow = true
    }

    this.setData({
      activityList: result.data.res,
      lotteyIsShow: lotteyIsShow,
      uploadIsShow: uploadIsShow
    })


  },
  activityListFail: function(error) {
    wx.hideLoading()
    wx.stopPullDownRefresh()
    util.showModel("加载失败", error)


  },
  // 下拉刷新
  onPullDownRefresh: function() {
    // 显示顶部刷新图标
    this.data.activityList = []

    this.loadActivityList('')


  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    wx.stopPullDownRefresh()
  },


})