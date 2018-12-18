var meApi = require('../../net/me_api.js')
var h2c = require('../../utils/html2canvas.min.js')
var util = require('../../utils/util.js')
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var activityId

let phoneType = 1 //1是苹果手机 2是安卓手机

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
    util.showConsole(options)
    activityId = options.activityId

    let session = qcloud.Session.get()
    let uuid = session != null ? session.userinfo.uuid : ''
    let skey = session != null ? session.skey : ''
let that=this


    wx.getSystemInfo({
      success: function(res) {

        phoneType = res.system.indexOf("iOS") != -1 ? 1 : 2

        let sharePicUrl = 'https://www.film110.cn/static_file/index.html?activityId=' + activityId + '&uuid=' + uuid + '&skey=' + skey + '&page=' + options.page + '&activityType=' + options.activityType + '&phoneType=' + phoneType

        util.showConsole(sharePicUrl)

        that.setData({
          sharePicUrl: sharePicUrl
        })


      }
    });





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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  onWebviewload: function() {

  },

  onPageMessage: function(e) {


    util.showConsole(e)
    let tcount = 'data:image/png;base64,'
    let picContent = e.detail.data[0].picBase64
    let pic = e.detail.data[0].picBase64.substring(tcount.length, picContent.length)

    var picData = wx.base64ToArrayBuffer(pic)

    var fileManager = wx.getFileSystemManager()
    fileManager.writeFile({
      filePath: wx.env.USER_DATA_PATH + '/sharePic.png',
      encoding: 'base64',
      data: picData,
      success: function(res) {

        wx.saveImageToPhotosAlbum({
          filePath: wx.env.USER_DATA_PATH + '/sharePic.png',
          success: function(data) {

            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000
            })
          },
        })


      },
      fail: function(e) {
        util.showConsole(e)

      }
    })


  }

})