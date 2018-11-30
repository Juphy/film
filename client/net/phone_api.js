var config = require('../config')
var manager = require('./http_manager')
var qcloud = require('../vendor/wafer2-client-sdk/index')

//绑定手机号
function bindingPhone(phoneNumber, code, bindingPhoneSuccess, bindingPhoneFail) {

  const session = qcloud.Session.get()
  if (session) {
    var openId = session.userinfo.openId
    manager.request(
      config.service.bindingPhoneUrl,
      {
        open_id: openId,
        phone: phoneNumber,
        code: code,
      },
      bindingPhoneSuccess,
      bindingPhoneFail
    )

  }

}

//发送验证码
function requestCheckCode(phoneNumber, sendPhoneCheckCodeSuccess, sendPhoneCheckCodeFail) {
  const session = qcloud.Session.get()
  if (session) {
    var openId = session.userinfo.openId
    manager.request(
      config.service.sendPhoneCheckCodeUrl,  
      {
        phone: phoneNumber,
      },
      sendPhoneCheckCodeSuccess,
      sendPhoneCheckCodeFail
    )
    
  }
}

module.exports = {
  bindingPhone,
  requestCheckCode
}