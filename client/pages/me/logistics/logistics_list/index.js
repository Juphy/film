//index.js 
//我的 奖品
//获取应用实例
var logisticsApi = require('../../../../net/logistics_api')
var utils = require('../../../../utils/util.js')
const app = getApp()
var page = 1
var pageSize = 10
var totalPage

Page({
  data: {
    awardList:[]
  },

  onLoad: function() {
    this.loadLogisticsList()
  },

  loadLogisticsList: function() {
    wx.showLoading({
      title: '数据加载中....',
    })
    logisticsApi.requestSelectPrizeList(page, pageSize, this.selectPrizeListSuccess, this.selectPrizeListFail)
  },
  selectPrizeListSuccess: function(result) {
    utils.showConsole(result)
    wx.stopPullDownRefresh()
    wx.hideLoading()

    totalPage = result.data.res.page.total

    let that = this
    for (let item in result.data.res.data) {
      this.data.awardList.push(result.data.res.data[item])
    }

    this.setData({
      awardList: that.data.awardList
    })
  },
  selectPrizeListFail: function(e) {
    utils.showModel("提示", e)
    wx.stopPullDownRefresh()
    wx.hideLoading()
  },

  onClickAward: function(e) {

    utils.showConsole(e)

    wx.navigateTo({
      url: '/pages/me/logistics/index?mailno=' + e.currentTarget.dataset.ordernumber,
    })
  },
  // 下拉刷新
  onPullDownRefresh: function() {
    page = 1;
    // 显示顶部刷新图标
    this.data.awardList = []
    this.loadLogisticsList('')
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
      wx.stopPullDownRefresh()
      return
    }

    this.loadLogisticsList('')
  },


})