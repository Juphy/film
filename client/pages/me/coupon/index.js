//我的优惠卷
var awardApi = require('../../../net/award_api.js')
var util = require('../../../utils/util.js')
var page = 1
var pageSize = 10
var totalPage


Page({

  /**
   * 页面的初始数据
   */
  data: {
    couponList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.loadCouponList()
  },

  loadCouponList: function() {
    wx.showLoading({
      title: '数据加载中....',
    })
    awardApi.winnerCouponList(this.winnerCouponListSuccess, this.winnerCouponListFail)
  },
  winnerCouponListSuccess: function(result) {
    wx.hideLoading()
    wx.stopPullDownRefresh()
    let that = this
    for (let item in result.data.res) {
      this.data.couponList.push(result.data.res[item])
    }
    util.showConsole(this.data.couponList)
    this.setData({
      couponList: that.data.couponList
    })

    util.showConsole(result)
  },
  winnerCouponListFail: function(e) {
    wx.hideLoading()
    wx.stopPullDownRefresh()

    util.showModel('提示', e)
  },

  // 下拉刷新
  onPullDownRefresh: function () {


  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
  

  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },





})