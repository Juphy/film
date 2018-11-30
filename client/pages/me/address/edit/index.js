//index.js 
//编辑/新建 地址
//获取应用实例

var utils = require('../../../../utils/util.js')
var addressApi = require('../../../../net/address_api.js')

const app = getApp()
var userName
var userPhone
var userAddress
var isDefault
var province
var city
var county

Page({
  data: {
    isDefault: true
  },
  onLoad: function(option) {

    this.initData(option)
    this.loadProvinceData()

  },
  initData: function(option) {
    utils.showConsole(option)
    if (Object.keys(option).length > 0) {
      this.setData({
        id: option.id,
        address: option.address,
        city: option.city,
        county: option.county,
        isDefault: option.default,
        phone: option.phone,
        province: option.province,
        name: option.userName
      })
    }
  },
  bindProvinceDateChange: function(result) {
    utils.showConsole(result)
    utils.showConsole('=========================')

    utils.showConsole(this.data.provinceList[result.detail.value])
    var provinceData = this.data.provinceList[result.detail.value]
    this.setData({
      province: provinceData.name,
      city: null,
      county: null,
      countyList: null
    })
    this.loadCityData(provinceData.code)

  },
  bindCityDateChange: function(result) {
    utils.showConsole(this.data.cityList[result.detail.value])
    var cityData = this.data.cityList[result.detail.value]
    this.setData({
      city: cityData.name,
      county: null
    })
    this.loadCountyData(cityData.code, this.addressCountySuccess, this.addressCountyFail)
  },

  bindCountyDateChange: function(result) {
    utils.showConsole(this.data.countyList[result.detail.value])
    var countyData = this.data.countyList[result.detail.value]
    this.setData({
      county: countyData.name
    })
  },
  formSubmit: function(e) {

    userName = e.detail.value.userName
    userPhone = e.detail.value.userPhone
    userAddress = e.detail.value.userAddress
    isDefault = e.detail.value.isDefault ? 1 : 0
    province = this.data.province
    city = this.data.city
    county = this.data.county

    if (!userName) {
      utils.showModel('提示', '请输入收货人')
      return
    }

    if (!userPhone) {
      utils.showModel('提示', '请输入收货人手机号')
      return
    }
    if (!utils.phoneNumberCheck(userPhone)) {
      utils.showModel('提示', '输入的手机号有误')
      return
    }

    if (!province) {
      utils.showModel('提示', '请选择您所在的省份')
      return
    }

    if (!city) {
      utils.showModel('提示', '请选择您所在的市')
      return
    }
    if (!county) {
      utils.showModel('提示', '请选择您所在的区')
      return
    }
    if (!userAddress) {
      utils.showModel('提示', '请输入收货人详细地址')
      return
    }

    if (this.data.address) {
      this.editAddress(e, this.data.id)
    } else {
      this.addAddress(e)
    }

  },
  editAddress: function(e, addressId) {

    addressApi.requestEditAddress(
      province,
      city,
      county,
      addressId,
      userAddress,
      isDefault,
      userName,
      userPhone,
      this.addAddressSuccess,
      this.addAddressFail
    )

  },
  addAddress: function(e) {

    addressApi.requestAddAddress(
      province,
      city,
      county,
      userAddress,
      isDefault,
      userName,
      userPhone,
      this.addAddressSuccess,
      this.addAddressFail
    )

  },
  loadProvinceData: function() {

    addressApi.requestAddressDiqu('', '', this.addressProvinceSuccess, this.addressProvinceFail)

  },
  loadCityData: function(m_province_code) {
    addressApi.requestAddressDiqu(m_province_code, '', this.addressCitySuccess, this.addressCityFail)

  },
  loadCountyData: function(m_city_code) {
    addressApi.requestAddressDiqu(m_city_code, '', this.addressCountySuccess, this.addressCountyFail)

  },
  addAddressSuccess: function(res) {

    utils.showSuccess('地址添加成功')
    wx.navigateBack({
      delta: 1
    })
  },
  addAddressFail: function(e) {
    utils.showModel('提示', e)
  },
  addressProvinceSuccess: function(result) {

    utils.showConsole(result.data.res)
    this.setData({

      provinceList: result.data.res
    })

  },
  addressProvinceFail: function(e) {
    utils.showModel('提示', e)

  },
  addressCitySuccess: function(result) {
    utils.showConsole(result)

    this.setData({
      cityList: result.data.res
    })


  },
  addressCityFail: function(e) {
    utils.showModel('提示', e)

  },
  addressCountySuccess: function(result) {
    utils.showConsole(result)

    this.setData({
      countyList: result.data.res
    })
  },
  addressCountyFail: function(e) {
    utils.showModel('提示', e)

  }
})