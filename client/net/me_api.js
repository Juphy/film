var config = require('../config')
var manager = require('./http_manager')
var qcloud = require('../vendor/wafer2-client-sdk/index')

// 小程序端获取用户信息
function userAppMonitor(userAppMonitorSuccess, userAppMonitorFail){

  const session = qcloud.Session.get()
  if (session) {
    var openId = session.userinfo.openId
    manager.request(
      config.service.userAppMonitorUrl, {
      },
      userAppMonitorSuccess,
      userAppMonitorFail
    )
  }

}

// 分享接口
function userAppShare( m_uuid ,userAppShareSuccess, userAppShareFail) {

  const session = qcloud.Session.get()
  if (session) {
    manager.request(
      config.service.userAppShareUrl, {
        uuid: m_uuid
      },
      userAppShareSuccess,
      userAppShareFail
    )
  }

}


module.exports = {
  userAppShare,
  userAppMonitor
}