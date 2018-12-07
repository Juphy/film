var meApi = require('../../net/me_api.js')
var h2c = require('../../utils/html2canvas.min.js')
var util = require('../../utils/util.js')
var qcloud = require('../../vendor/wafer2-client-sdk/index')

var activityId

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
    meApi.userAccessToken(this.userAccessTokenSuccess, this.userAccessTokenFail)
  },

  userAccessTokenSuccess: function(result) {
    let that = this

    let session = qcloud.Session ? qcloud.Session.get() : null
    let uuid = session != null ? session.userinfo.uuid : ''

    wx.request({
      url: 'https://api.weixin.qq.com/wxa/getwxacode?access_token=' + 
      result.data.access_token + '',
      data: {
        path: '/pages/activity/index?form=avtivityDetail&&id=' + activityId + "&&uuid=" + uuid,
        scene: "m_scene"
      },
      method: "POST",
      responseType: 'arraybuffer',
      header: {
        'content-type': 'application/json',
      },
      success(res){
        that.shardQrcodeSuccess(res)
      },
     fail(e){
       this.shardQrcodeFail(e)
     },

    })

  },
  userAccessTokenFail: function(e) {
    util.showModel('提示',e)
  },

  shardQrcodeSuccess: function(result) {

    let qrCode = wx.arrayBufferToBase64(result.data)
    this.setData({
      imageUrl: qrCode
    })


    wx.getImageInfo({
      src: 'http://img0.imgtn.bdimg.com/it/u=3181355797,2341426971&fm=11&gp=0.jpg',
      success: function(res) {

        const ctx = wx.createCanvasContext('shareCanvas')
        ctx.drawImage(res.path, 0, 0, 375, 667)

        ctx.setTextAlign('center')
        ctx.setFillStyle('#ffffff')
        ctx.setFontSize(22)
        ctx.fillText("电影壹壹零电影壹壹零电影壹壹零电影壹壹零电影壹壹零", 375 / 2, 667 / 2,150)
        
        const qrImgSize = 100
        ctx.setStrokeStyle('white')
        ctx.arc( 375 / 2, 800 / 2, 50, 0, 2 * Math.PI)
        ctx.clip()
        ctx.drawImage('data:image/png;base64,' + qrCode, (375 - qrImgSize) / 2, 700 / 2, qrImgSize, qrImgSize)

        ctx.stroke()
        ctx.draw()
      }
    })

  },
  shardQrcodeFail: function(e) {

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

  onClickSavePic:function(){

    // wx.canvasToTempFilePath({ //生成图片
    //   x: 0,
    //   y: 0,
    //   quality: 1,
    //   canvasId: 'shareCanvas',
    //   success: function (res) {
    //     wx.saveImageToPhotosAlbum({  //保存生成的图片到手机相册里
    //       filePath: res.tempFilePath,
    //       success(res) {
          
    //           util.showModel("提示",'保存成功')


    //       }
    //     })
    //   }
    // })

   
    let b64;
    h2c(document.getElementById('sharePic'), {
      useCORS: true
    }).then(function (canvas) {
      console.log(canvas)
      try {
        b64 = canvas.toDataURL("image/png");
        // getUrl(name, b64);
        //console.log(b64);
      } catch (err) {
        console.log(err)
      }
    }).catch(function onRejected(error) {
      console.log(error)
    });





  }






})