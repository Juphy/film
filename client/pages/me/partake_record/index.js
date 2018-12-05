//index.js 
//参与记录
//获取应用实例
var activityApi = require('../../../net/activity_api.js')
var utils = require('../../..//utils/util.js')
var ing_page = 1
var end_page = 1
var ing_page_size = 10
var end_page_size = 10
var ing_total_page
var end_total_page
var currentTag = 0

const app = getApp()

Page({
  data: {
    winWidth: 0,
    winHeight: 0,
    showtab: 0, //顶部选项卡索引
    tabnav: {
      tabnum: 2,
      tabitem: [{
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
    doingActivityList: [],
    overActivityList: []
  },
  onLoad: function() {
    var that = this;
    /** 
     * 获取系统信息 
     */
    wx.getSystemInfo({

      success: function(res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });

    //加载进行中的数据
    this.loadIngData()
    //加载已结束的数据
    this.loadEndData()

  },
  onShow: function() {

    let that = this

    wx.getStorage({
      key: 'isDelReportInfo',
      success: function(res) {
        ing_page = 1
        that.data.doingActivityList = null
        that.loadIngData()

        wx.removeStorage({
          key: 'isDelReportInfo',
          success: function(res) {},
        })

      },
    })

  },
  loadIngData: function() {
    wx.showLoading({
      title: '数据加载中....',
    })

    activityApi.reportAppList('1', ing_page, ing_page_size, this.reportAppListIngSuccess, this.reportAppListIngFail)

  },
  loadEndData: function() {
    wx.showLoading({
      title: '数据加载中....',
    })

    activityApi.reportAppList('2', end_page, end_page_size, this.reportAppListEndSuccess, this.reportAppListEndFail)

  },
  setTab: function(e) {
    const edata = e.currentTarget.dataset;
    currentTag = edata.tabindex
    this.setData({
      showtab: edata.tabindex,

    })
  },
  bindChange: function(e) {

    var that = this;
    that.setData({
      showtab: e.detail.current
    });

  },

  onClickDetail: function(e) {

    utils.showConsole(e)
    wx.navigateTo({
      url: '/pages/me/partake_record/detail/index?id=' + e.currentTarget.dataset.activityid,
    })

  },
  // 下拉刷新
  onPullDownRefresh: function() {
    var that = this
    switch (currentTag) {
      case 0:
        ing_page = 1
        this.data.doingActivityList = []
        that.loadIngData()
        break
      case 1:
        end_page = 1
        this.data.overActivityList = []
        that.loadEndData()
        break
    }


  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this
    switch (currentTag) {
      case 0:
        ++ing_page
        that.loadIngData()
        break
      case 1:
        ++end_page
        that.loadEndData()
        break
    }
  },

  reportAppListIngSuccess: function(result) {
    wx.hideLoading()
    wx.stopPullDownRefresh()
    ing_total_page = result.data.res.page.total

    utils.showConsole(result)
    let that = this
    for (let item in result.data.res.data) {
      result.data.res.data[item].content = JSON.parse(result.data.res.data[item].content)
      this.data.doingActivityList.push(result.data.res.data[item])
    }

    this.setData({
      doingActivityList: that.data.doingActivityList
    })
    utils.showConsole(this.data.doingActivityList)


  },
  reportAppListIngFail: function(e) {
    wx.hideLoading()
    wx.stopPullDownRefresh()
    utils.showModel("提示", e)

  },
  reportAppListEndSuccess: function(result) {
    wx.hideLoading()
    wx.stopPullDownRefresh()
    // overActivityList
    end_total_page = result.data.res.page.total

    let that = this
    for (let item in result.data.res.data) {
      result.data.res.data[item].content = JSON.parse(result.data.res.data[item].content)
      
      this.data.overActivityList.push(result.data.res.data[item])
    }

    this.setData({
      overActivityList: that.data.overActivityList
    })

  },
  reportAppListEndFail: function(e) {
    wx.hideLoading()
    wx.stopPullDownRefresh()


  },
  onClickDel: function(e) {

    utils.showConsole(e)
    let report_id = e.currentTarget.dataset.id

    var that = this

    wx.showModal({
      confirmText: '确定',
      cancelText: '取消',
      showCancel: true,
      title: '提示',
      content: '您确定要删除该记录吗？',
      success: function(res) {

        if (res.confirm) {
          activityApi.reportAppDel(report_id, that.reportAppDelSuccess, that.reportAppDelFail)
        } else if (res.cancel) {}
      }
    })


  },

  reportAppDelSuccess: function(result) {
    utils.showConsole(result)
    ing_page = 1
    this.data.doingActivityList = []
    this.loadIngData()

  },
  reportAppDelFail: function(e) {
    utils.showModel('提示', e)
  },
})