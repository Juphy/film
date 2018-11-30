//index.js
//我要参与
//获取应用实例
var qcloud = require('../../../vendor/wafer2-client-sdk/index')
var config = require('../../../config')
var util = require('../../../utils/util.js')
var activityApi = require('../../../net/activity_api.js')
var activityId = ''
var imageUrlList = []

Page({
  data: {
    endDate: '',
    hasVideo: false,
    partakeList: []

  },

  onLoad: function(options) {
    activityId = options.id

    util.showConsole(options)
    var date = util.getNowTime();
    this.setData({
      endDate: date
    });

  },

  bindDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      endDate: e.detail.value
    })
  },

  onClickSelectFilm: function(e) {
    wx.navigateTo({
      url: '/pages/activity/film/index',
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

    let that = this
    wx.getStorage({
      key: 'selectCimema',
      success: function(res) {

        util.showConsole(res)
        that.setData({
          filmName: res.data.film.name,
          filmStreet: res.data.film.street,
          filmCode: res.data.film.hash_code
        })



      },
    })

  },

  onClickAdd: function(e) {
    var that = this;
    wx.showActionSheet({
      itemList: ['上传图片', '上传视频'],
      itemColor: '#333333',
      success: function(res) {
        switch (res.tapIndex) {
          case 0:
            that.addImage()
            break
          case 1:
            that.addVideo()
            break
        }

      },
      fail: function(res) {
        util.showModel('提示', res.data.msg)

      },
    })
  },
  addVideo: function() {

    var that = this
    if (this.data.hasVideo) {
      util.showModel('提示', "只能上传一个视频！")
      return
    }
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 10,
      camera: 'back',
      success(res) {
        util.showBusy('正在上传')
        var filePath = res.tempFilePath
        // 上传视频
        wx.uploadFile({
          url: config.service.uploadVideoUrl,
          filePath: filePath,
          name: 'file',
          success: function(res) {
            that.data.hasVideo = true
            util.showSuccess('上传视频成功')
            var data = JSON.parse(res.data)
            that.data.partakeList.push({
              dataType: 1,
              url: data.res.imgUrl
            })
            that.setData({
              partakeList: that.data.partakeList
            })
          },

          fail: function(e) {
            util.showModel('上传视频失败')
          }
        })

      },
      fail(e) {
        console.error(e)

      }
    })

  },
  addImage: function() {

    if (imageUrlList.length >= 3) {
      util.showModel('提示', "最多上传三张图片！")
      return
    }

    var that = this
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        util.showBusy('正在上传')
        var filePath = res.tempFilePaths[0]
        var date = new Date();
        // 上传图片
        wx.uploadFile({
          url: config.service.uploadImageUrl,
          filePath: filePath,
          name: 'file',
          success: function(res) {
            util.showSuccess('上传图片成功')
            var data = JSON.parse(res.data)
            that.data.partakeList.push({
              dataType: 0,
              url: data.res.imgUrl
            })
            imageUrlList.push(data.res.imgUrl)
            that.setData({
              partakeList: that.data.partakeList
            })

          },

          fail: function(e) {
            util.showModel('上传图片失败')
          }
        })

      },
      fail: function(e) {
        console.error(e)
      }
    })
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
    let that = this
    util.showConsole(that.data.partakeList)
    wx.previewImage({
      urls: imageUrlList,
      current: imageUrl

    })

  },

  formSubmit: function(e) {

    util.showConsole(e)

    var content = ''
    var imageList = []
    var videoUrl = ''
    var cinemaCode = this.data.filmCode
    var remark = e.detail.value.demo
    var partakeList = this.data.partakeList

    if (!partakeList || Object.keys(partakeList).length == 0) {

      util.showModel('提示', '请上传照片或视频。')
      return
    }


    if (!cinemaCode) {
      util.showModel('提示', '请选择影院')
      return
    }

    for (var i = partakeList.length - 1; i >= 0; i--) {

      if (partakeList[i].dataType === 0) {
        imageList.push(partakeList[i].url)
      } else {
        videoUrl = partakeList[i].url
      }

    }
    content = {
      image: imageList,
      video: videoUrl
    }
    activityApi.reportUpload(this.data.endDate, cinemaCode, JSON.stringify(content), remark, activityId, this.reportUploadSuccess, this.reportUploadFail)

  },
  reportUploadSuccess: function(result) {
    wx.showToast({
      title: result.data.msg,
      duration: 2000,
      success: function() {

        setTimeout(function() {
          wx.navigateBack({
            delta: 1
          })
        }, 1500, [])

      }

    })

  },
  reportUploadFail: function(e) {
    util.showModel('提示', e.data.msg)
  },


  onUnload: function() {


    wx.removeStorage({
      key: 'city',
      success: function(res) {},
    })
    wx.removeStorage({
      key: 'selectCimema',
      success: function(res) {},
    })

  },
  onClickDelImage: function(e) {
    let that = this
    
    util.showConsole(e)
    let index = e.target.dataset.index;

    if (this.data.partakeList[index].dataType==1){
      that.data.hasVideo = false
    }

    that.data.partakeList.splice(index, 1)
    imageUrlList.splice(index, 1)

    this.setData({
      partakeList: that.data.partakeList
    })
  }

})