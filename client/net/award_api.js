var config = require('../config')
var manager = require('./http_manager')
var qcloud = require('../vendor/wafer2-client-sdk/index')

 // 中奖列表
function winnerWinnerList(m_page, m_page_size, winnerWinnerListSuccess, winnerWinnerListFail){
  const session = qcloud.Session.get()
  if (session) {
    var openId = session.userinfo.openId
    manager.request(
      config.service.winnerWinnerListUrl, {
        open_id: openId,
        page:m_page,
        page_size:m_page_size
      },
      winnerWinnerListSuccess,
      winnerWinnerListFail
    )
  } else {
    reportUploadFail("未登录，无法使用，请在【我的】点击登录，谢谢^o^")
  }
}

//领取money
function winnerAcceptMoneyPrize(m_winner_id, m_bankcard, m_identify_card, m_phone, m_real_name, winnerAcceptMoneyPrizeSuccess, winnerAcceptMoneyPrizeFail) {
  const session = qcloud.Session.get()
  if (session) {
    var openId = session.userinfo.openId
    manager.request(
      config.service.winnerAcceptMoneyPrizeUrl, {
        open_id: openId,
        winner_id: m_winner_id,
        bankcard: m_bankcard,
        identify_card: m_identify_card,
        phone: m_phone,
        real_name: m_real_name
      },
      winnerAcceptMoneyPrizeSuccess,
      winnerAcceptMoneyPrizeFail
    )
  } else {
    reportUploadFail("未登录，无法使用，请在【我的】点击登录，谢谢^o^")
  }
}

//领取优惠卷
function winnerAcceptCouponPrize(m_winner_id, winnerAcceptCouponPrizeSuccess, winnerAcceptCouponPrizeFail){
  const session = qcloud.Session.get()
  if (session) {
    var openId = session.userinfo.openId
    manager.request(
      config.service.winnerAcceptCouponPrizeUrl, {
        open_id: openId,
        winner_id: m_winner_id,
      },
      winnerAcceptCouponPrizeSuccess,
      winnerAcceptCouponPrizeFail
    )
  } else {
    reportUploadFail("未登录，无法使用，请在【我的】点击登录，谢谢^o^")
  }
}

 //获取优惠卷列表
function winnerCouponList( winnerCouponListSuccess, winnerCouponListFail) {
  const session = qcloud.Session.get()
  if (session) {
    var openId = session.userinfo.openId
    manager.request(
      config.service.winnerCouponListUrl, {
        open_id: openId,
      },
      winnerCouponListSuccess,
      winnerCouponListFail
    )
  } else {
    reportUploadFail("未登录，无法使用，请在【我的】点击登录，谢谢^o^")
  }
}
//领取实物
function winnerAcceptGoodsPrize(m_winner_id, m_receiver, m_phone, m_address, winnerAcceptGoodsPrizeSuccess, winnerAcceptGoodsPrizeFail){
  const session = qcloud.Session.get()
  if (session) {
    var openId = session.userinfo.openId
    manager.request(
      config.service.winnerAcceptGoodsPrizeUrl, {
        open_id: openId,
        winner_id: m_winner_id,
        receiver: m_receiver,
        phone: m_phone,
        address: m_address,
      },
      winnerAcceptGoodsPrizeSuccess,
      winnerAcceptGoodsPrizeFail
    )
  } else {
    reportUploadFail("未登录，无法使用，请在【我的】点击登录，谢谢^o^")
  }
}

module.exports = {
  winnerAcceptGoodsPrize,
  winnerWinnerList,
  winnerCouponList,
  winnerAcceptCouponPrize,
  winnerAcceptMoneyPrize
}