 var constants = require('../vendor/wafer2-client-sdk/lib/constants.js')
var Session = require('../vendor/wafer2-client-sdk/lib/session.js')
var config = require('../config')
var qcloud = require('../vendor/wafer2-client-sdk/index')


var request = (m_url, m_data, m_succcess, m_fail) => {

  mRequest(m_url, m_data, m_succcess, m_fail)

}

var mRequest = (m_url, m_data, m_succcess, m_fail)=>{
  wx.request({
    url: m_url,
    method: 'POST',
    header: {
      'Content-type': 'application/x-www-form-urlencoded',
      'X-WX-Skey': Session.get() ? Session.get().skey : '',
    },
    data: m_data,
    success(res) {
      if (200 == res.data.code) {
        m_succcess(res);
      } else if (403==res.data.code) {
        login(m_url, m_data, m_succcess, m_fail)

      }else {
        m_fail(res);

      }

    },
    fail(error) {
      m_fail(error);
    }
  })

}

var login = (m_url, m_data, m_succcess, m_fail)=>{
  const session = qcloud.Session.get()

  if (session) {
    qcloud.loginWithCode({
      success: res => {
        mRequest(m_url, m_data, m_succcess, m_fail)

      },
      fail: err => {

      }
    })
  } else {
    // 首次登录
    qcloud.login({
      success: res => {
        mRequest(m_url, m_data, m_succcess, m_fail)

      },
      fail: err => {
      }
    })
  }
}



module.exports = {  request }