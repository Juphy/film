//index.js 
//参与记录
//获取应用实例
var activityApi = require('../../../../net/activity_api.js')
var utils = require('../../../../utils/util.js')
const app = getApp()
var report_id
var activite_id

Page({
  data: {

  },

  onLoad: function(options) {
    utils.showConsole(options)
    report_id = options.id

    this.loadReportAppInfo()

  },

  loadReportAppInfo: function() {
    activityApi.reportAppInfo(report_id, this.reportAppInfoSuccess, this.reportAppInfoFail)
  },

  onClickDel: function(e) {
    let that = this
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

    wx.setStorage({
      key: 'isDelReportInfo',
      data: true,
    })

    wx.navigateBack({
      delta: 1
    })



  },
  reportAppDelFail: function(e) {
    utils.showModel('提示', e)
  },
  reportAppInfoSuccess: function(result) {
    utils.showConsole(result)
    let content = JSON.parse(result.data.res.content)

    let m_title = result.data.res.title
    let m_show_day = result.data.res.show_day
    let m_remark = result.data.res.remark
    let m_images = content.image ? content.image : ""
    let m_video = content.video ? content.video : ""
    let m_cinema_name = result.data.res.cinema_name
    activite_id = result.data.res.activite_id

    utils.showConsole(m_images)

    this.setData({
      report_id: report_id,
      title: m_title,
      show_day: m_show_day,
      remark: m_remark,
      images: m_images,
      video: m_video,
      cinema_name: m_cinema_name
    })


  },
  reportAppInfoFail: function(e) {
    utils.showConsole(e)

  },
  onPlayVideoListen: function(e) {

    var videoContext = wx.createVideoContext("myVideo", this)
    videoContext.requestFullScreen(0)

  },
  onEndVideoListen: function(e) {

    var videoContext = wx.createVideoContext("myVideo", this)
    videoContext.exitFullScreen()

  },

  onClickPic: function(e) {

    var imageUrl = e.currentTarget.dataset.url

    wx.previewImage({
      current: imageUrl,
      urls: this.data.images
    })

  },

  onClickActivityDetail: function(e) {
    utils.showConsole(report_id)
    wx.navigateTo({
      url: '/pages/activity/detail/detail?id=' + activite_id,
    })
  }

})