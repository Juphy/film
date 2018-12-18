/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
var host = 'https://api.film110.cn';

var config = {

  // 下面的地址配合云端 Demo 工作
  service: {
    host,

    // 登录地址，用于建立会话
    loginUrl: `${host}/weapp/login`,

    // 测试的请求地址，用于测试会话
    requestUrl: `${host}/weapp/user`,

    // 测试的信道服务地址
    tunnelUrl: `${host}/weapp/tunnel`,

    // 上传图片接口
    uploadImageUrl: `${host}/weapp/upload/image`,

    // 上传视频接口
    uploadVideoUrl: `${host}/weapp/upload/video`,

    //绑定手机号
    bindingPhoneUrl: `${host}/weapp/user/bind_phone`,

    //发送手机验证码
    sendPhoneCheckCodeUrl: `${host}/weapp/message/send_msg`,

    //获取地址列表
    addressListUrl: `${host}/weapp/user/address_list`,

    //添加地址
    addAddressUrl: `${host}/weapp/user/add_address`,

    //设置默认地址
    setDefaultAddressUrl: `${host}/weapp/user/set_default_address`,

    //删除地址
    delAddressUrl: `${host}/weapp/user/del_address`,

    //编辑地址
    editAddressUrl: `${host}/weapp/user/edit_address`,

    //查询订单寄运信息
    selectLogisticsOrderUrl: `${host}/weapp/winner/express_sf_order`,

    //查询需要寄送快递奖品列表(me)
    selectPrizeListUrl: `${host}/weapp/winner/express_winner_list`,

    //地区表
    addressDiquUrl: `${host}/weapp/address/diqu`,

    //上传票根
    reportUploadUrl: `${host}/weapp/report/upload`,

    //活动列表
    activityListUrl: `${host}/weapp/activite/app_list`,

    //小程序活动详情
    activityInfoUrl: `${host}/weapp/activite/app_info`,

    //获取附近影院列表
    activiteNearbyCinemasUrl: `${host}/weapp/activite/nearby_cinemas`,

    //搜索影院
    activiteSearchCineamsUrl: `${host}/weapp/activite/search_cineams`,

    //参与记录
    reportAppListUrl: `${host}/weapp/report/app_list`,

    //上传票根详情
    reportAppInfoUrl: `${host}/weapp/report/app_info`,

    //获取城市列表
    addressCityUrl: `${host}/weapp/address/city`,

    //获取用户消息，公告
    messageAppMsgUrl: `${host}/weapp/message/app_msg`,

    //删除上传记录
    reportAppDelUrl: `${host}/weapp/report/app_del`,

    // 中奖列表
    winnerWinnerListUrl: `${host}/weapp/winner/winner_list`,

    //领取money
    winnerAcceptMoneyPrizeUrl: `${host}/weapp/winner/accept_money_prize`,

    //领取实物
    winnerAcceptGoodsPrizeUrl: `${host}/weapp/winner/accept_goods_prize`,

    //领取优惠卷
    winnerAcceptCouponPrizeUrl: `${host}/weapp/winner/accept_coupon_prize`,

    //获取优惠卷列表
    winnerCouponListUrl: `${host}/weapp/winner/coupon_list`,

    //热门城市
    addressHotCityUrl: `${host}/weapp/address/hot_city`,

    //获取默认地址
    userGetDefaultAddressUrl: `${host}/weapp/user/get_default_address`,

    // 小程序端获取用户信息
    userAppMonitorUrl: `${host}/weapp/user/app_monitor`,

    // 分享接口
    userAppShareUrl: `${host}/weapp/user/app_share`,


    // 参与抽奖活动
    inLottiesUrl: `${host}/weapp/report/in_lotties`,


    //分享二维码
    userAppShareCodeUrl: `https://api.weixin.qq.com/wxa/getwxacodeunlimit`,



    //获取access_token
    userAccessTokenUrl: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx12f7ee2916dde013&secret=844469ef019128ea533f7d08f1186543'


  }
};

module.exports = config;