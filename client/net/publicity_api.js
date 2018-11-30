var config = require('../config')
var manager = require('./http_manager')
var qcloud = require('../vendor/wafer2-client-sdk/index')

function messageAppMsg(messageAppMsgSuccess, messageAppMsgFail) {

    manager.request(
      config.service.messageAppMsgUrl, {
      },
      messageAppMsgSuccess,
      messageAppMsgFail
    )

}

module.exports = {
  messageAppMsg
}