var config = require('../config')
var manager = require('./http_manager')
var qcloud = require('../vendor/wafer2-client-sdk/index')

//获取地址列表
function requestAddressList(addressListSuccess, addressListFail) {
  const session = qcloud.Session.get()
  if (session) {
    var openId = session.userinfo.openId
    manager.request(
      config.service.addressListUrl, {
        open_id: openId,
      },
      addressListSuccess,
      addressListFail
    )
  }
}

//添加地址
function requestAddAddress(m_province, m_city, m_county, m_address, m_is_default, m_contact, m_phone, m_province_code, m_city_code, m_county_code, addAddressSuccess, addAddressFail) {

  const session = qcloud.Session.get()
  if (session) {
    var openId = session.userinfo.openId
    manager.request(
      config.service.addAddressUrl, {
        open_id: openId,
        province: m_province,
        city: m_city,
        county: m_county,
        address: m_address,
        is_default: m_is_default,
        contact: m_contact,
        phone: m_phone,
        province_code: m_province_code,
        city_code: m_city_code,
        county_code: m_county_code

      },
      addAddressSuccess,
      addAddressFail
    )
  }

}

//设置默认地址
function requestSetDefaultAddress(m_address_id, defaultAddressSuccess, defaultAddressFail) {
  const session = qcloud.Session.get()
  if (session) {
    var openId = session.userinfo.openId
    manager.request(
      config.service.setDefaultAddressUrl, {
        open_id: openId,
        address_id: m_address_id
      },
      defaultAddressSuccess,
      defaultAddressFail
    )
  }
}

//删除地址
function requestDelAddress(m_address_id, delAddressSuccess, defAddressFail) {
  const session = qcloud.Session.get()
  if (session) {
    var openId = session.userinfo.openId
    manager.request(
      config.service.delAddressUrl, {
        open_id: openId,
        address_id: m_address_id
      },
      delAddressSuccess,
      defAddressFail
    )
  }
}

//编辑地址
function requestEditAddress(m_province, m_city, m_county, m_id, m_address, m_is_default, m_contact, m_phone, m_province_code, m_city_code, m_county_code, editAddressSuccess, editAddressFail) {
  const session = qcloud.Session.get()
  if (session) {
    var openId = session.userinfo.openId
    manager.request(
      config.service.editAddressUrl, {
        id: m_id,
        open_id: openId,
        province: m_province,
        city: m_city,
        county: m_county,
        address: m_address,
        is_default: m_is_default,
        contact: m_contact,
        phone: m_phone,
        province_code: m_province_code,
        city_code: m_city_code,
        county_code: m_county_code
      },
      editAddressSuccess,
      editAddressFail
    )
  }
}

//地区表
function requestAddressDiqu(m_code, m_name, addressDiquSuccess, addressDiquFail) {
  const session = qcloud.Session.get()
  if (session) {
    var openId = session.userinfo.openId
    manager.request(
      config.service.addressDiquUrl, {
        code: m_code,
        name: m_name
      },
      addressDiquSuccess,
      addressDiquFail
    )
  }
}

//获取默认地址
function userGetDefaultAddress(userGetDefaultAddressSuccess, userGetDefaultAddressFail) {
  const session = qcloud.Session.get()
  if (session) {
    var openId = session.userinfo.openId
    manager.request(
      config.service.userGetDefaultAddressUrl, {},
      userGetDefaultAddressSuccess,
      userGetDefaultAddressFail
    )
  }

}

module.exports = {
  userGetDefaultAddress,
  requestAddressDiqu,
  requestEditAddress,
  requestDelAddress,
  requestSetDefaultAddress,
  requestAddressList,
  requestAddAddress
}