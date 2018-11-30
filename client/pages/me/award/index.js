//index.js 
//我的 中奖记录
//获取应用实例
var awardApi = require('../../../net/award_api.js')
var util = require('../../../utils/util.js')

const app = getApp()
var page = 1
var pageSize = 10
var totalPage
var winner_id

Page({
  data: {
    awardList: []
  },

  onLoad: function() {},

  onShow: function() {
    page = 1
    this.data.awardList = []
    this.loadAward()

  },

  onClickAward: function(e) {
    if (e.currentTarget.dataset.state === 0) {
      this.getAward(e)
    } else {
      this.goAwardResult(e)
    }

  },
  goAwardResult: function(e) {
    switch (e.currentTarget.dataset.type) {
      case 1:
        //实物 填写收货 地址
        wx.navigateTo({
          url: '/pages/me/logistics/logistics_list/index',
        })
        break;
      case 2:
        //现金 
        util.showModel("提示", "请关注银行卡到账信息，最终结果以收款账户实际到账为准！")
        break;
      case 3:
        //电影票
        wx.navigateTo({
          url: '/pages/me/coupon/index',
        })
        break;
    }
  },
  getAward: function(e) {
    util.showConsole(e)
    winner_id= e.currentTarget.dataset.winner_id

    switch (e.currentTarget.dataset.type) {
      case 1:
        //实物 填写收货 地址
        this.goAwardAddress();
        break;
      case 2:
        //现金 
        this.goGetMoney()
        break;
      case 3:
        //电影票
        this.goCouponList()
        break;
    }
  },

  goCouponList: function() {

    awardApi.winnerAcceptCouponPrize(winner_id,this.winnerAcceptCouponPrizeSuccess,this.winnerAcceptCouponPrizeFail)

  },
  winnerAcceptCouponPrizeSuccess: function(result) {
    wx.navigateTo({
      url: '/pages/me/coupon/index?winner_id=' + winner_id,
    })
  },
  winnerAcceptCouponPrizeFail: function(e) {
    util.showModel('提示', e)
  },
  goGetMoney: function() {
    wx.navigateTo({
      url: '/pages/me/award/money/index?winner_id=' + winner_id,
    })
  },
  goAwardAddress: function() {
    wx.navigateTo({
      url: '/pages/me/award/address/index?winner_id=' + winner_id,
    })
  },

  // 下拉刷新
  onPullDownRefresh: function() {
    page = 1;
    this.data.awardList = []
    // 显示顶部刷新图标
    this.loadAward('')


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
      return
    }

    this.loadAward('')
  },
  loadAward: function() {
    wx.showLoading({
      title: '数据加载中....',
    })
    awardApi.winnerWinnerList(page, pageSize, this.winnerWinnerListSuccess, this.winnerWinnerListFail)
  },
  winnerWinnerListSuccess: function(result) {
    wx.hideLoading()
    wx.stopPullDownRefresh()
    util.showConsole(result)
    totalPage = result.data.res.page.total

    let that = this
    for (let item in result.data.res.data) {
      this.data.awardList.push(result.data.res.data[item])
    }

    this.setData({
      awardList: that.data.awardList
    })
  },
  winnerWinnerListFail: function(e) {
    wx.stopPullDownRefresh()
    wx.hideLoading()
    util.showModel('提示', e)
  }


})