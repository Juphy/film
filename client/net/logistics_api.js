//物流
var config = require('../config')
var manager = require('./http_manager')
var qcloud = require('../vendor/wafer2-client-sdk/index')

//查询订单寄运信息
function requestSelectLogisticsInfo(m_mailno, selectLogisticsSuccess, selectLogisticsFail) {

    const session = qcloud.Session.get()
    if (session) {
        var openId = session.userinfo.openId
        manager.request(
            config.service.selectLogisticsOrderUrl, {
                mailno: m_mailno,
            },
            selectLogisticsSuccess,
            selectLogisticsFail
        )

    }
}

//查询需要寄送快递奖品列表(me)
function requestSelectPrizeList(m_page, m_page_size, selectPrizeListSuccess, selectPrizelistFail) {
    const session = qcloud.Session.get()
    if (session) {
        var openId = session.userinfo.openId
        manager.request(
            config.service.selectPrizeListUrl, {
                open_id: openId,
                page: m_page,
                page_size: m_page_size
            },
            selectPrizeListSuccess,
            selectPrizelistFail
        )

    }
}

module.exports = { requestSelectPrizeList, requestSelectLogisticsInfo }