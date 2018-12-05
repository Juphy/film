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
  failed,
  authFailed
} = require('./base.js');

const Redis = require('ioredis');
const redis = new Redis();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const moment = require('moment');
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


  msg = await Msg.find({
    where: {
      invalid: 0,
      type: 2,
      phone: {
        $ne: null
      },
      status: 0
    }
  })

  if (msg) {
    let req = {}
    req.phone = msg.phone
    req.template_code = 'SMS_151578868'
    req.data = {
      'title': msg.movie_name
    }

    res = await sendSMS(req)

    if (res) {
      await msg.update({
        status: 1,
        note_status: 1,
        send_time: moment().format('YYYY-MM-DD HH:mm:ss')
      })
      return ctx.body = success('', '发送成功')
    } else {
      await msg.update({
        status: 1,
        note_status: 0,
        send_time: moment().format('YYYY-MM-DD HH:mm:ss')
      })
      return ctx.body = success('', '发送失败')
    }
  }

}

//获取用户消息（公告）
const app_msg = async (ctx, next) => {

  msgs = await Msg.findAll({
    where: {
      invalid: 0,
      type: 1
    },
    order: [
      ['create_time', 'DESC']
    ]
  })

  ctx.body = success(msgs)
}

const list = async (ctx, next) => {
  let p = ctx.request.params;
  let {
    title = '', page = 1, page_size = 10, type = ''
  } = p;
  p['page'] = page;
  p['page_size'] = page_size;
  let we = {
    invalid: 0,
    title: {
      [Op.like]: '%' + title + '%'
    }
  };
  if (type !== '') {
    we['type'] = type;
  }
  let res = await Msg.findAndCountAll({
    where: we,
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
  adm: {
    list,
    del
  },
  pub: {
    send_winner,
    send_msg,
    app_msg
  }
}