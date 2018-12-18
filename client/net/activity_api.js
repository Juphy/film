var config = require('../config')
var manager = require('./http_manager')
var qcloud = require('../vendor/wafer2-client-sdk/index')

//上传票根
function reportUpload(m_show_day, m_cinema_code, m_content, m_remark, m_activite_id, reportUploadSuccess, reportUploadFail) {
  const session = qcloud.Session.get()
  if (session) {
    var openId = session.userinfo.openId
    manager.request(
      config.service.reportUploadUrl, {
        open_id: openId,
        show_day: m_show_day,
        cinema_code: m_cinema_code,
        content: m_content,
        remark: m_remark,
        activite_id: m_activite_id
      },
      reportUploadSuccess,
      reportUploadFail
    )
  }else{
    reportUploadFail("未登录，无法使用，请在【我的】点击登录，谢谢^o^")
  }
}

//活动列表
function activityList(m_name, activityListSuccess, activityListFail) {
  manager.request(
    config.service.activityListUrl, {
      name: m_name,
    },
    activityListSuccess,
    activityListFail
  )
}

//小程序活动详情
function activiteInfo(m_id, m_activite_type, activiteInfoSuccess, activiteInfoFail) {
  manager.request(
    config.service.activityInfoUrl, {
      id: m_id,
      activite_type: m_activite_type
    },
    activiteInfoSuccess,
    activiteInfoFail
  )
}

//参与记录
function reportAppList(m_status, m_page, m_page_size, reportAppListSuccess, reportAppListFail) {
  const session = qcloud.Session.get()
  if (session) {
    var openId = session.userinfo.openId
    manager.request(
      config.service.reportAppListUrl, {
        open_id: openId,
        type: m_status,
        page: m_page,
        page_size: m_page_size

      },
      reportAppListSuccess,
      reportAppListFail
    )
  }
}

//上传票根详情
function reportAppInfo(m_report_id, reportAppInfoSuccess, reportAppInfoFail) {
  const session = qcloud.Session.get()
  if (session) {
    var openId = session.userinfo.openId
    manager.request(
      config.service.reportAppInfoUrl, {
        open_id: openId,
        report_id: m_report_id
      },
      reportAppInfoSuccess,
      reportAppInfoFail
    )
  }
}

//删除上传记录
function reportAppDel(m_report_id, reportAppDelSuccess, reportAppDelFail) {
  const session = qcloud.Session.get()
  if (session) {
    var openId = session.userinfo.openId
    manager.request(
      config.service.reportAppDelUrl, {
        open_id: openId,
        report_id: m_report_id
      },
      reportAppDelSuccess,
      reportAppDelFail
    )
  }

}


    // 参与抽奖活动
function inLotties(m_activite_id, inLottiesSuccess, inLottiesFaill){
  const session = qcloud.Session.get()
  if (session) {
    manager.request(
      config.service.inLottiesUrl, {
        activite_id: m_activite_id,
      },
      inLottiesSuccess,
      inLottiesFaill
    )
  }
}

module.exports = {
  reportAppDel,
  reportAppInfo,
  reportAppList,
  reportUpload,
  activityList,
  activiteInfo,
  inLotties
}