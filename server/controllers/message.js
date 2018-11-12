const {
  message: {
    checkSignature
  }
} = require('../qcloud')
const {
  sendSMS
} = require('../lib/sendSms.js')

const {
  success,
  failed
} = require('./base.js');

/**
 * 响应 GET 请求（响应微信配置时的签名检查请求）
 */
// async function get(ctx, next) {
//   const {
//     signature,
//     timestamp,
//     nonce,
//     echostr
//   } = ctx.query
//   if (checkSignature(signature, timestamp, nonce)) ctx.body = echostr
//   else ctx.body = 'ERR_WHEN_CHECK_SIGNATURE'
// }

// async function post(ctx, next) {
//   // 检查签名，确认是微信发出的请求
//   const {
//     signature,
//     timestamp,
//     nonce
//   } = ctx.query
//   if (!checkSignature(signature, timestamp, nonce)) ctx.body = 'ERR_WHEN_CHECK_SIGNATURE'

//   /**
//    * 解析微信发送过来的请求体
//    * 可查看微信文档：https://mp.weixin.qq.com/debug/wxadoc/dev/api/custommsg/receive.html#接收消息和事件
//    */
//   const body = ctx.request.body

//   ctx.body = 'success'
// }

const send_msg = async(ctx, next) => {

  console.log(ctx)
  
  const req = {}
  const {
    phone
  } = ctx.request.params;
  console.log(phone)

  req.phone = phone
  req.template_code = 'SMS_150495613'

  res = await sendSMS(req)

  if (res.status) {
    ctx.session['bindPhoneCode_' + phone] = res.data
    console.log('--------code:', ctx.session['bindPhoneCode_' + phone])
    ctx.body = success('', '发送成功')
  } else {
    ctx.body = failed('发送失败')
  }
}



module.exports = {
  // post,
  // get,
  send_msg
}