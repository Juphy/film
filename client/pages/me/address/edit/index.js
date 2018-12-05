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
var currentProvinceIndex
var currentCityIndex
var currentCountyIndex
var currentProvinceCode
var currentCityCode
var currentCountyCode

var isEdit = false

Page({
  data: {
    isDefault: true,
    provinceList: []
  },
  onLoad: function(option) {
    let that = this

    wx.getStorage({
      key: 'provinceData',
      success: function(res) {
        that.setData({
          provinceList: res.data
        })


        that.initData(option)


      },
      fail: function(e) {
        that.loadProvinceData()
        that.initData(option)

      }
    })

  },
  initData: function(option) {

    let that = this

    utils.showConsole(option)
    if (Object.keys(option).length > 0) {

      isEdit = true

      currentProvinceCode = option.province_code
      currentCityCode = option.city_code
      currentCountyCode = option.county_code

      that.loadCityData(currentProvinceCode)
      that.loadCountyData(currentCityCode)

      that.initProvinceIndex()


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

  initProvinceIndex: function() {
    let that = this
    utils.showConsole(that.data.provinceList)
    for (let item in that.data.provinceList) {

      if (that.data.provinceList[item].code == currentProvinceCode) {
        currentProvinceIndex = item
        that.setData({
          provinceIndex: item
        })

        return
      }

    }

  },
  initCityIndex: function() {
    let that = this
    for (let item in that.data.cityList) {
      if (that.data.cityList[item].code == currentCityCode) {
        currentCityIndex = item
        that.setData({
          cityIndex: item
        })
      }

    }

  },
  initCountyIndex: function() {
    let that = this
    for (let item in that.data.countyList) {
      if (that.data.countyList[item].code == currentCountyCode) {
        currentCountyIndex = item
        that.setData({
          countyIndex: item
        })
      }

    }

  },
  bindProvinceDateChange: function(result) {
    utils.showConsole(result)
    currentProvinceIndex = result.detail.value
    var provinceData = this.data.provinceList[currentProvinceIndex]
    utils.showConsole(provinceData)

    currentProvinceCode = provinceData.code
    this.setData({
      province: provinceData.name,
      city: null,
      county: null,
      countyList: null,
      provinceIndex: currentProvinceIndex,
      provinceCode: currentProvinceCode
    })
    this.loadCityData(provinceData.code)

  },
  bindCityDateChange: function(result) {

    utils.showConsole(this.data.cityList[result.detail.value])
    currentCityIndex = result.detail.value
    var cityData = this.data.cityList[currentCityIndex]
    currentCityCode = cityData.code
    this.setData({
      city: cityData.name,
      county: null,
      cityIndex: currentCityIndex,
      cityCode: currentCityCode
    })
    this.loadCountyData(cityData.code, this.addressCountySuccess, this.addressCountyFail)

  },

  bindCountyDateChange: function(result) {
    utils.showConsole(this.data.countyList[result.detail.value])
    currentCountyIndex = result.detail.value
    var countyData = this.data.countyList[currentCountyIndex]
    currentCountyCode = countyData.code
    this.setData({
      county: countyData.name,
      countyIndex: currentCountyIndex,
      countyCode: currentCountyCode
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
      currentProvinceCode,
      currentCityCode,
      currentCountyCode,
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
      currentProvinceCode,
      currentCityCode,
      currentCountyCode,
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

    wx.setStorage({
      key: 'provinceData',
      data: result.data.res,
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

    if (isEdit) {
      this.initCityIndex()
    }

  },
  addressCityFail: function(e) {
    utils.showModel('提示', e)

  },
  addressCountySuccess: function(result) {
    utils.showConsole(result)

    this.setData({
      countyList: result.data.res
    })

    if (isEdit) {
      this.initCountyIndex()
    }

  },
  addressCountyFail: function(e) {
    utils.showModel('提示', e)

  }
})