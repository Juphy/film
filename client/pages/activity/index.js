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
var page = 1
var pageSize = 10
var totalPage
var detailActivityId

Page({
  data: {
    nowDate: util.getNowTime(),
    activityList: []
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

    if (options.form == 'avtivityDetail') {
      util.showConsole(options.uuid)
      meApi.userAppShare(options.uuid, this.userAppShareSuccess, this.userAppShareFail)
      detailActivityId = options.id
    } 


  },

  onShow:function(){
    this.loadActivityList('')
    
  },

  userAppShareSuccess: function(result) {
    wx.navigateTo({
      url: '/pages/activity/detail/detail?id=' + detailActivityId,
    })
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
    page = 1
    this.data.activityList = []
    this.loadActivityList('')
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
  onClickItem: function(e) {

    util.showConsole(e.currentTarget.id)

    wx.navigateTo({
      url: '/pages/activity/detail/detail?id=' + e.currentTarget.id,
    })
  },
  inputTyping: function(e) {
    page = 1
    this.data.activityList = []
    util.showConsole(e.detail.value)
    this.loadActivityList(e.detail.value)

  },
  loadActivityList: function(name) {
    wx.showLoading({
      title: '数据加载中...',
    })
    activityApi.activityList(name, page, pageSize, this.activityListSuccess, this.activityListFail)
  },
  activityListSuccess: function(result) {
    let that = this
    totalPage = result.data.res.page.total
    wx.hideLoading()
    wx.stopPullDownRefresh()

    for (var item in result.data.res.data) {
      this.data.activityList.push(result.data.res.data[item])
    }

    this.setData({
      activityList: that.data.activityList
    })

    util.showConsole(that.data.activityList)


  },
  activityListFail: function(error) {
    wx.hideLoading()
    wx.stopPullDownRefresh()
    util.showModel("加载失败", error)


  },
  // 下拉刷新
  onPullDownRefresh: function() {
    page = 1;
    // 显示顶部刷新图标
    this.data.activityList = []

    this.loadActivityList('')


  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

    ++page
    if (page > totalPage) {
      wx.showToast({
        title: '已是最后一页了',
      })
      wx.hideLoading()
      wx.stopPullDownRefresh()
      return
    }

    this.loadActivityList('')
  },


})