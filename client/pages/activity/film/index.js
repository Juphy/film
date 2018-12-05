var util = require('../../../utils/util.js')
var filmApi = require('../../../net/film_api.js')
var longitude
var latitude

Page({

  /**
   * 页面的初始数据
   */
  data: {
    filmList: [],
    cityName: '北京',
    cityCode: '110000000'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    wx.getLocation({
      success: function(res) {
        util.showConsole(res)
        longitude = res.longitude
        latitude = res.latitude
        that.loadNearbyCinemas()

      },
    })

  },

  loadNearbyCinemas: function() {

    if (!longitude) {
      return
    }

    wx.showLoading({
      title: '数据加载中.....',
    })

    filmApi.activiteNearbyCinemas(longitude, latitude, 10, this.activiteNearbyCinemasSuccess, this.activiteNearbyCinemasFail)
  },
  activiteNearbyCinemasSuccess: function(result) {
    util.showConsole(result)
    wx.hideLoading()
    this.setData({
      filmList: result.data.res
    })

  },
  activiteNearbyCinemasFail: function(e) {
    wx.hideLoading()
    util.showModel('提示', e)
  },
  onClickFilmItem: function(e) {
    util.showConsole(e)

    wx.setStorage({
      key: 'selectCimema',
      data: e.currentTarget.dataset,
    })

    wx.navigateBack({
      delta: 1
    })
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

    let that = this
    wx.getStorage({
      key: 'city',
      success: function(res) {
        util.showConsole(res)
        that.setData({
          cityName: res.data.name,
          cityCode: res.data.code
        })
      },
    })


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

  showInput: function() {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function() {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
    this.loadNearbyCinemas()

  },
  clearInput: function() {

    this.setData({
      inputVal: ""
    });

    this.loadNearbyCinemas()

  },
  inputTyping: function(e) {

    util.showConsole(e)

    this.setData({
      inputVal: e.detail.value
    });
    this.searchCinemas(e)

  },

  searchCinemas: function(e) {
    wx.showLoading({
      title: '数据加载中.....',
    })
    let keyword = e.detail ? e.detail.value : ''
    filmApi.activiteSearchCineams(this.data.cityCode, keyword, 10, this.activiteSearchCineamsSuccess, this.activiteSearchCineamsFail)

  },
  onClickSelectCity: function(e) {
    wx.navigateTo({
      url: '/pages/activity/city/index'
    })
  },

  activiteSearchCineamsSuccess: function(result) {
    util.showConsole(result.data.res)
    wx.hideLoading()
    this.setData({
      filmList: result.data.res
    })
  },

  activiteSearchCineamsFail: function(e) {
    wx.hideLoading()
    util.showModel('提示', e)

  }


})