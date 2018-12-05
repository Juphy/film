//index.js 
// 公示栏
//获取应用实例

var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
var publicityApi = require('../../net/publicity_api.js')
var hz2py = require('../../utils/hz2py.js')

const app = getApp()

Page({
  data: {
    publicityList: []
  },

  onLoad: function() {
    util.showConsole('aaaaa')
    this.loadMessageList()
  },

  loadMessageList: function() {
    wx.showLoading({
      title: '数据加载中...',
    })
    publicityApi.messageAppMsg(this.messageAppMsgSuccess, this.messageAppMsgFail)

  },

  messageAppMsgSuccess: function(result) {
    wx.stopPullDownRefresh()
    wx.hideLoading()
    util.showConsole(result)





    this.setData({
      publicityList: result.data.res
    })
  },
  messageAppMsgFail: function(e) {
    wx.stopPullDownRefresh()
    wx.hideLoading()
    utils.showModel('提示', e)
  },
  // 下拉刷新
  onPullDownRefresh: function() {
    this.loadMessageList()
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  onClickItem: function(e) {

    util.showConsole(e.currentTarget.id)

    wx.navigateTo({
      url: '/pages/activity/detail/detail?id=' + e.currentTarget.id,
    })
  },

})