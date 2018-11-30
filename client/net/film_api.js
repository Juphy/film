var config = require('../config')
var manager = require('./http_manager')
var qcloud = require('../vendor/wafer2-client-sdk/index')

//获取附近影院列表
function activiteNearbyCinemas(m_longitude, m_latitude, m_num, activiteNearbyCinemasSuccess, activiteNearbyCinemasFail) {
  manager.request(
    config.service.activiteNearbyCinemasUrl, {
      longitude: m_longitude,
      latitude: m_latitude,
      num: m_num
    },
    activiteNearbyCinemasSuccess,
    activiteNearbyCinemasFail
  )
}

//搜索影院
function activiteSearchCineams(m_city_code, m_name, m_num, activiteSearchCineamsSuccess, activiteSearchCineamsFail) {
  manager.request(
    config.service.activiteSearchCineamsUrl, {
      city_code: m_city_code,
      name: m_name,
      num: m_num
    },
    activiteSearchCineamsSuccess,
    activiteSearchCineamsFail
  )
}

//获取城市列表
function addressCity(m_name, addressCitySuccess, addressCityFail) {
  manager.request(
    config.service.addressCityUrl, {
      name: m_name,
    },
    addressCitySuccess,
    addressCityFail
  )
}

//热门城市
function addressHotCit(addressHotCitSuccess, addressHotCitFail){
  manager.request(
    config.service.addressHotCityUrl, {
    },
    addressHotCitSuccess,
    addressHotCitFail
  )
}

module.exports = {
  addressHotCit,
  addressCity,
  activiteNearbyCinemas,
  activiteSearchCineams
}