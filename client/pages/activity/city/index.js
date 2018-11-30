//选择城市
var filmApi = require('../../../net/film_api.js')
var util = require('../../../utils/util.js')
var hz2py = require('../../../utils/hz2py.js')
var qcloud = require('../../../vendor/wafer2-client-sdk/index')
var keyWord

Page({
  data: {
    letter: ["RR", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
  },
  onLoad: function() {

    this.initData()
    this.loadHotCity()
  },
  loadHotCity: function() {
    filmApi.addressHotCit(this.addressHotCitSuccess, this.addressCityFail)
  },
  addressHotCitFail: function(e) {
    util.showModel('提示', e)
  },
  addressHotCitSuccess: function(result) {
    util.showConsole(result)
    this.setData({
      newcity: result.data.res
    })
  },
  initData: function() {
    let that = this
    wx.getStorage({
      key: 'cityList',
      success: function(res) {
        that.setData({
          citylist: res.data
        })

      },
      fail: function(e) {
        util.showConsole(e)
        that.loadCityData("")
      }
    })

  },
  //点击城市
  cityTap(e) {

    console.log(e)
    const val = e.currentTarget.dataset.val || '',
      types = e.currentTarget.dataset.types || '',
      Index = e.currentTarget.dataset.index || '',
      that = this;
    let city = val.name;
    if (city) {
      wx.setStorage({
        key: 'city',
        data: val
      })
      wx.navigateBack({
        delta: 1
      })
    } else {
      console.log('还没有');
      this.getLocate();
    }

  },
  //点击城市字母
  letterTap(e) {
    const Item = e.currentTarget.dataset.item;
    console.log(e);

    this.setData({
      cityListId: Item
    });
    console.log("..............." + this.data.cityListId);
  },
  loadCityData: function() {
    wx.showLoading({
      title: '正在加载数据....',
    })
    filmApi.addressCity(keyWord, this.addressCitySuccess, this.addressCityFail)
  },

  addressCitySuccess: function(result) {

    util.showConsole(result)
    var arr = result.data.res
    var temp = []
    //按首字母排序
    arr.sort(function(a, b) {
      return a.name.localeCompare(b.name, 'zh-Hans-CN')
    })
    //按首字母归类
    var t = {}
    for (var i = 0; i < arr.length; i++) {

      var item = arr[i]
      var frist = hz2py.ConvertPinyin(item.name)[0].toUpperCase()

      if (i == 0) {
        t = {
          letter: frist,
          data: [item]
        }
      } else if (t.letter && t.letter === frist) {
        t.data.push(item)

      } else {
        temp.push(t)
        t = {
          letter: frist,
          data: [item]
        }

      }

    }
    temp.push(t)
    this.setData({
      citylist: temp
    })

if(!keyWord){
  wx.setStorage({
    key: 'cityList',
    data: temp,
  })

}

  
    wx.hideLoading()

  },
  addressCityFail: function(e) {
    util.showConsole(e)

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
  },
  clearInput: function() {
    this.setData({
      inputVal: ""
    });

  },
  inputTyping: function(e) {
    util.showConsole(e.detail.value)
    keyWord = e.detail.value
    this.loadCityData(keyWord)

  },


})