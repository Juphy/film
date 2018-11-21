const {
  message: {
    checkSignature
  }
} = require('../qcloud')
const {
  sendSMS
} = require('../lib/sendSms.js')

const {
  Msg
} = require('../lib/model');

const {
  success,
  failed
} = require('./base.js');

const Redis = require('ioredis');
const redis = new Redis();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

/**
 * 响应 GET 请求（响应微信配置时的签名检查请求）
 */
async function get(ctx, next) {
  const {
    signature,
    timestamp,
    nonce,
    echostr
  } = ctx.query
  if (checkSignature(signature, timestamp, nonce)) ctx.body = echostr
  else ctx.body = 'ERR_WHEN_CHECK_SIGNATURE'
}

async function post(ctx, next) {
  // 检查签名，确认是微信发出的请求
  const {
    signature,
    timestamp,
    nonce
  } = ctx.query
  if (!checkSignature(signature, timestamp, nonce)) ctx.body = 'ERR_WHEN_CHECK_SIGNATURE'

  /**
   * 解析微信发送过来的请求体
   * 可查看微信文档：https://mp.weixin.qq.com/debug/wxadoc/dev/api/custommsg/receive.html#接收消息和事件
   */
  const body = ctx.request.body

  ctx.body = 'success'
}


//发送验证码
const send_msg = async (ctx, next) => {

  console.log(ctx.request.header)

  const {
    phone
  } = ctx.request.params;

  if (!phone) {
    return ctx.body = failed('参数错误')
  }

  const req = {}

  req.phone = phone
  req.template_code = 'SMS_150495613'

  const num = Math.floor(Math.random() * 1000000 + 1);

  req.data = {
    'code': num
  }
  res = await sendSMS(req)

  if (res) {

    redis.set('bindPhoneCode_' + phone, num, 'EX', 60);
    // ctx.session['bindPhoneCode_' + phone] = res.data
    ctx.body = success('', '发送成功')
  } else {
    ctx.body = failed('发送失败')
  }
}

//短信通知中奖者信息
const send_winner = async (ctx, next) => {

}

//获取用户消息（公告）
const app_msg = async (ctx, next) => {
  const {
    open_id
  } = ctx.request.params;

  msgs = await Msg.findAll({
    where: {
      invalid: 0,
      $or: [{
        open_id: open_id
      }, {
        open_id: null
      }]
    },
    order: [
      ['create_time', 'DESC']
    ]
  })

  ctx.body = success(msgs)
}

const list = async (ctx, next) => {
  let p = ctx.request.params;
  let { title = '', page = 1, page_size = 10 } = p;
  p['page'] = page;
  p['page_size'] = page_size;
  let res = await Msg.findAndCountAll({
    where: {
      invalid: 0,
      title: {
        [Op.like]: '%' + title + '%'
      }
    },
    order: [
      ['create_time', 'DESC']
    ],
    offset: (page - 1) * page_size,
    limit: page_size * 1
  });
  ctx.body = success(res);
}

const del = async (ctx, next) => {
  let p = ctx.request.params;
  let {
    id
  } = p;
  if (!id) {
    ctx.body = failed('id缺省或者无效')
  } else {
    let res = await Msg.findById(id);
    if (res) {
      if (res.invalid !== 0) {
        ctx.body = failed('已删除');
      } else {
        res = res.update({
          invalid: id
        });
        ctx.body = success(res, '删除成功')
      }
    } else {
      ctx.body = failed('id无效')
    }
  }
}



module.exports = {
  post,
  get,
  pub: {
    send_msg,
    app_msg,
    list,
    del
  }
}