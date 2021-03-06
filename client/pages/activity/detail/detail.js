// pages/activity/detail/detail.js

var activityApi = require('../../../net/activity_api.js')
var util = require('../../../utils/util.js')
var qcloud = require('../../../vendor/wafer2-client-sdk/index')
const app = getApp()
var id
let imageList = []
let inCount = 0

Page({

  /**
   * 页面的初始数据
   */
  data: {
    actionSheetHidden: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    id = options.id

    if (options.locationId) {
      let that = this
      setTimeout(function(res) {
          util.showConsole(options.locationId)
          that.setData({
            locationId: options.locationId
          })
        },
        500, options.locationId)

    }
   


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
    const session = qcloud.Session.get()
    if (session) {
      activityApi.activiteInfo(id, '1', this.activiteInfoSuccess, this.activiteInfoFail)

    } else {

      if (inCount > 0) {

        wx.navigateBack({
          delta: 1
        })
        inCount = 0

      } else {

        inCount++
        wx.navigateTo({
          url: '/pages/login/index?id=' + id,
        })

      }

    }

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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },



  onClickLogistics: function(e) {

    //判断活动是否过期
    if (this.activityIsOver()) {
      util.showModel("提示", "活动已经结束，无法参与。")
      return

    }

    //判断是否登录
    const session = qcloud.Session.get()
    if (session) {
      util.showConsole(session)

      //判断是否绑定手机号
      if (!session.userinfo.phone) {
        wx.showModal({
          title: '提示',
          content: '参加活动需要绑定手机号，用于获奖通知等事宜。',
          showCancel: true,
          success: function(res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/me/phone/phone',
              })
            } else if (res.cancel) {

            }
          }
        })
      } else {
        wx.navigateTo({
          url: '/pages/activity/partake/index?id=' + e.currentTarget.id,
        })

      }

    } else {
      wx.navigateTo({
        url: '/pages/login/index?id=' + id,
      })

    }

  },

  activityIsOver: function() {
    let endDay = this.data.activityInfo.activite_info.end_day
    let time = endDay < util.getNowTime() //已结束
    let stat = this.data.activityInfo.activite_info.status != 1 //1进行中2开奖3结束
    return time || stat

  },

  onShareAppMessage: function() {

    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })

    let session = qcloud.Session ? qcloud.Session.get() : null
    let uuid = session != null ? session.userinfo.uuid : ''
    let that = this
    return {
      imageUrl: that.data.activityInfo.activite_info.playbill,
      title: session.userinfo.nickName +'邀请你参与【'+that.data.activityInfo.activite_info.title+'】的活动抽奖',
      path: '/pages/activity/index?form=avtivityDetail&&id=' + id + "&&uuid=" + uuid,
      success: function(res) {
        util.showConsole(res)
      }
    };

  },

  onClickShare: function() {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })

  },

  listenerActionSheet: function(e) {


    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })


  },

  onClickCreatSharePic: function(e) {

    wx.navigateTo({
      url: '/pages/share/index?activityId=' + e.currentTarget.id + '&page=avtivityDetail&activityType=1',
    })

    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })


  },

  activiteInfoSuccess: function(result) {
    util.showConsole(result)
    this.setData({
      activityInfo: result.data.res
    })

    id = result.data.res.activite_info.id

    let prize_description = result.data.res.activite_info.prize_description
    imageList = []
    for (let item in prize_description) {
      imageList.push(prize_description[item].image)
    }

    this.setData({
      winners: result.data.res.winners
    })

  },
  activiteInfoFail: function(error) {

    util.showModel('提示', error.data.msg)

  },
  onClickImage: function(e) {
    util.showConsole(e)

    var imageUrl = e.currentTarget.dataset.currentimage
    wx.previewImage({
      urls: imageList,
      current: imageUrl

    })



  }




})