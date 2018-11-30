// pages/activity/detail/detail.js

var activityApi = require('../../../net/activity_api.js')
var util = require('../../../utils/util.js')
var qcloud = require('../../../vendor/wafer2-client-sdk/index')
const app = getApp()
var id

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    id = options.id


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
      activityApi.activiteInfo(id, this.activiteInfoSuccess, this.activiteInfoFail)

    }else{
      wx.redirectTo({
        url: '/pages/login/index?id=' + id,
      })
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
      wx.redirectTo({
        url: '/pages/login/index?id=' + id,
      })

    }

  },

  activityIsOver: function() {
    let endDay = this.data.activityInfo.activite_info.end_day
    let time=endDay <util.getNowTime() //已结束
    let stat = this.data.activityInfo.activite_info.status != 1//1进行中2开奖3结束
    return time||stat 

  },

  onShareAppMessage: function() {

    let session = qcloud.Session ? qcloud.Session.get() : null
    let uuid = session != null ? session.userinfo.uuid : ''
    return {
      title: '分享',
      path: '/pages/activity/index?form=avtivityDetail&&id=' + id + "&&uuid=" + uuid,
      success: function(res) {
        util.showConsole(res)
      }
    };
    
  },

  activiteInfoSuccess: function(result) {
    util.showConsole(result)
    this.setData({
      activityInfo: result.data.res
    })

    id = result.data.res.activite_info.id
  },
  activiteInfoFail: function(error) {

    util.showModel('提示', error.data.msg)

  }
})