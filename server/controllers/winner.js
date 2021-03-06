const {
  Winner,
  User,
  Report
} = require('../lib/model');
const xml2js = require('xml2js');
const config = require('../config');
const httpClient = require('../lib/httpClient')
const moment = require('moment');

const {
  success,
  failed,
  authFailed
} = require('./base.js');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

//下寄送快递订单
const add_sf_order = async (ctx, next) => {

  const {
    winner_id
  } = ctx.request.params;

  if (!winner_id) {
    return ctx.body = failed('参数错误')
  }

  winner_info = await Winner.find({
    where: {
      id: winner_id,
      invalid: 0,
      type: 1,
      is_sure: 1
    }
  })

  if (!winner_info) {
    return ctx.body = failed('获奖用户信息不存在或不需要递运')
  }

  if (winner_info.mailno) {
    return ctx.body = failed('该顾客已产生递运订单')
  }

  var obj = {
    "Request": {
      $: {
        "service": "OrderService",
        "lang": "zh-CN"
      },
      "Head": config.sf.clientCode,
      "Body": {
        "Order": {
          $: {
            "orderid": moment().format("JIANCHA_YYYYMMDDHms"),
            "express_type": 1,
            "j_province": config.sf.jProvince,
            "j_city": config.sf.jCity,
            "j_county": config.sf.jCounty,
            "j_address": config.sf.jAddress,
            "j_company": config.sf.jCompany,
            "j_contact": config.sf.jContact,
            "j_tel": config.sf.jTel,
            "j_mobile": config.sf.jMobile,
            "pay_method": config.sf.payMethod,
            "custid": config.sf.custid,
            "parcel_quantity": config.sf.parcelQuantity,
            "d_contact": winner_info.receiver,
            "d_mobile": winner_info.phone,
            "d_address": winner_info.address,

          },
          "AddedService": {
            $: {
              "name": "COD",
              "value": "1.01",
              "value1": config.sf.custid //顺丰月结卡号
            }
          }
        }

      }
    }
  };

  res = await sf_request(obj)

  if (res.Response.Head == 'ERR') {
    return ctx.body = failed(res.Response.ERROR[0]._)
  }

  mailno = res.Response.Body[0].OrderResponse[0].$.mailno
  orderid = res.Response.Body[0].OrderResponse[0].$.orderid

  res = await winner_info.update({
    mailno: mailno,
    orderid: orderid,
    is_received: 1,
  })

  ctx.body = success(res, '下订单成功')
}



//查询顺丰订单
const search_sf_order = async (ctx, next) => {
  const {
    orderid
  } = ctx.request.params;

  if (!orderid) {
    return ctx.body = failed('参数错误')
  }

  var obj = {
    "Request": {
      $: {
        "service": "OrderSearchService",
        "lang": "zh-CN"
      },
      "Head": config.sf.clientCode,
      "Body": {
        "OrderSearch": {
          $: {
            "orderid": orderid,
          },
        }

      }
    }
  }


  res = await sf_request(obj)

  console.log(res)

  if (res.Response.Head == 'ERR') {
    return ctx.body = failed(res.Response.ERROR[0]._)
  }

  ctx.body = success(res, '下订单成功')


}

//取消订单
const confirm_sf_order = async (ctx, next) => {
  const {
    orderid,
    mailno
  } = ctx.request.params;

  if (!orderid || !mailno) {
    return ctx.body = failed('参数错误')
  }

  var obj = {
    "Request": {
      $: {
        "service": "OrderConfirmService",
        "lang": "zh-CN"
      },
      "Head": config.sf.clientCode,
      "Body": {
        "OrderConfirm": {
          $: {
            "orderid": orderid,
            "mailno": mailno
          },
        }

      }
    }
  }

  res = await sf_request(obj)

  console.log(res)

  if (res.Response.Head == 'ERR') {
    return ctx.body = failed(res.Response.ERROR[0]._)
  }

  ctx.body = success(res, '取消订单成功')
}


//查询顺丰快递递运信息
const express_sf_order = async (ctx, next) => {
  const {
    mailno
  } = ctx.request.params;

  if (!mailno) {
    return ctx.body = failed('参数错误')
  }

  var obj = {
    "Request": {
      $: {
        "service": "RouteService",
        "lang": "zh-CN"
      },
      "Head": config.sf.clientCode,
      "Body": {
        "RouteRequest": {
          $: {
            "tracking_type": 1,
            "method_type": 1,
            "tracking_number": mailno
          },
        }

      }
    }
  }

  res = await sf_request(obj)

  console.log(res)

  if (res.Response.Head == 'ERR') {
    return ctx.body = failed(res.Response.ERROR[0]._)
  }

  const routes = res.Response.Body[0].RouteResponse[0].Route
  const arr = []

  routes.forEach(function (val, index) {
    arr[index] = val.$
  })

  console.log(arr)

  ctx.body = success(arr, '查询成功')
}



//查询中奖列表(me)
const winner_list = async (ctx, next) => {

  if (!ctx.state.$wxInfo.loginState) {
    return ctx.body = authFailed()
  }

  const {
    page = 1,
    page_size = 10
  } = ctx.request.params;

  if (!page || !page_size) {
    return ctx.body = failed('参数错误')
  }


  let res = await Winner.findAndCountAll({
    where: {
      invalid: 0,
      status: 1,
      open_id: ctx.state.$wxInfo.userinfo.openId
    },
    order: [
      ['create_time', 'DESC']
    ], // DESC 降  ASC升
    offset: (page - 1) * page_size,
    limit: page_size * 1
  });

  ctx.body = success(res)
}



//查询需要寄送快递奖品列表(me)
const express_winner_list = async (ctx, next) => {

  if (!ctx.state.$wxInfo.loginState) {
    return ctx.body = authFailed()
  }

  const {
    page = 1,
    page_size = 10
  } = ctx.request.params;

  if (!page || !page_size) {
    return ctx.body = failed('参数错误')
  }


  let res = await Winner.findAndCountAll({
    where: {
      invalid: 0,
      is_sure: 1,
      status: 1,
      type: 1,
      open_id: ctx.state.$wxInfo.userinfo.openId,
      mailno: {
        $not: null
      },
      orderid: {
        $not: null
      }
    },
    order: [
      ['create_time', 'DESC']
    ], // DESC 降  ASC升
    offset: (page - 1) * page_size,
    limit: page_size * 1
  });

  ctx.body = success(res)
}





async function sf_request(obj) {

  var builder = new xml2js.Builder();
  var xml = builder.buildObject(obj);



  let reqUrl = 'https://bsp-oisp.sf-express.com/bsp-oisp/sfexpressService';
  let clientCode = config.sf.clientCode; //此处替换为您在丰桥平台获取的顾客编码
  let checkword = config.sf.checkword; //此处替换为您在丰桥平台获取的校验码
  // let myReqXml = reqXml.replace(/SLKJ2019/ig, clientCode);
  const client = new httpClient();
  console.log("请求报文：" + xml);
  xml_res = await client.callSfExpressServiceByCSIM(reqUrl, xml, clientCode, checkword);

  let parser = new xml2js.Parser();

  let res;
  parser.parseString(xml_res, function (err, result) {
    console.dir(result);
    console.log('Done');
    res = result
  });

  return res
}

const list = async (ctx, next) => {
  let p = ctx.request.params;
  let {
    title,
    page = 1,
    page_size = 10
  } = p;
  p['page'] = page;
  p['page_size'] = page_size;
  let res = await Winner.findAndCountAll({
    include: [{
      model: User,
      as: 'user',
      attributes: ['phone']
    }],
    where: {
      invalid: 0,
      title: {
        [Op.like]: '%' + title + '%'
      },
      is_sure: 1
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
    winner_id
  } = p;
  if (!winner_id) {
    ctx.body = failed('id缺省或者无效');
  } else {
    let res = await Winner.findById(winner_id);
    if (res) {
      if (res.invalid !== 0) {
        ctx.body = failed('已删除');
      } else {
        res = res.update({
          invalid: id
        });
        ctx.body = success(res, '删除成功');
      }
    } else {
      ctx.body = failed('id无效');
    }
  }
}

// 现金，确认发奖
const make_prize = async (ctx, next) => {
  let {
    id
  } = ctx.request.params;
  if (!id) {
    return ctx.body = failed('参数错误');
  }
  let res = await Winner.findById(id);
  if (!res) {
    ctx.body = failed('id无效');
  }
  res = await res.update({
    is_received: 1
  });
  ctx.body = success(res, '确认发奖成功');
}

//领取实物
const accept_goods_prize = async (ctx, next) => {

  if (!ctx.state.$wxInfo.loginState) {
    return ctx.body = authFailed()
  }

  let {
    winner_id,
    receiver,
    phone,
    address
  } = ctx.request.params;

  if (!winner_id || !receiver || !phone || !address) {
    return ctx.body = failed('参数错误')
  }

  winner_info = await Winner.find({
    where: {
      id: winner_id,
      open_id: ctx.state.$wxInfo.userinfo.openId,
      invalid: 0,
      type: 1,
      status: 1
    }
  })

  if (!winner_info) {
    return ctx.body = failed('未找到领奖记录')
  }

  if (moment().format('YYYY-MM-DD') > winner_info.expiration_day) {
    return ctx.body = failed('该领奖信息已失效')
  }

  if (winner_info.is_sure == 1) {
    return ctx.body = failed('已确认领奖')
  }

  res = await winner_info.update({
    is_sure: 1,
    receiver: receiver,
    address: address,
    phone: phone,
    accept_time: moment().format('YYYY-MM-DD HH:mm:ss')
  })

  ctx.body = success(res, '领奖成功')

}


//领取money
const accept_money_prize = async (ctx, next) => {

  if (!ctx.state.$wxInfo.loginState) {
    return ctx.body = authFailed()
  }

  let {
    winner_id,
    bankcard,
    identify_card,
    phone,
    real_name
  } = ctx.request.params;

  if (!winner_id || !bankcard || !identify_card || !phone || !real_name) {
    return ctx.body = failed('参数错误')
  }

  winner_info = await Winner.find({
    where: {
      id: winner_id,
      open_id: ctx.state.$wxInfo.userinfo.openId,
      type: 2,
      invalid: 0,
      status: 1
    }
  })

  if (!winner_info) {
    return ctx.body = failed('未找到领奖记录')
  }

  if (moment().format('YYYY-MM-DD') > winner_info.expiration_day) {
    return ctx.body = failed('该领奖信息已失效')
  }

  if (winner_info.is_sure == 1) {
    return ctx.body = failed('已确认领奖')
  }

  res = await winner_info.update({
    is_sure: 1,
    real_name: real_name,
    bankcard: bankcard,
    identify_card: identify_card,
    accept_time: moment().format('YYYY-MM-DD HH:mm:ss')
  })

  ctx.body = success(res, '领奖成功')

}

//领取优惠卷
const accept_coupon_prize = async (ctx, next) => {

  if (!ctx.state.$wxInfo.loginState) {
    return ctx.body = authFailed()
  }

  let {
    winner_id,
  } = ctx.request.params;

  if (!winner_id) {
    return ctx.body = failed('参数错误')
  }

  winner_info = await Winner.find({
    where: {
      id: winner_id,
      open_id: ctx.state.$wxInfo.userinfo.openId,
      type: 3,
      invalid: 0,
      status: 1
    }
  })

  if (!winner_info) {
    return ctx.body = failed('未找到领奖记录')
  }

  if (moment().format('YYYY-MM-DD') > winner_info.expiration_day) {
    return ctx.body = failed('该领奖信息已失效')
  }

  if (winner_info.is_sure == 1) {
    return ctx.body = failed('已确认领奖')
  }

  res = await winner_info.update({
    is_sure: 1,
    is_received: 1,
    accept_time: moment().format('YYYY-MM-DD HH:mm:ss')
  })

  ctx.body = success('领奖成功')
}

const coupon_list = async (ctx, next) => {

  if (!ctx.state.$wxInfo.loginState) {
    return ctx.body = authFailed()
  }

  let winners = await Winner.findAll({
    where: {
      open_id: ctx.state.$wxInfo.userinfo.openId,
      is_sure: 1,
      invalid: 0,
      type: 3
    }
  })

  ctx.body = success(winners)
}

const lottery_list = async (ctx, next) => {
  let { id } = ctx.request.params;
  if (!id) {
    return ctx.body = failed('id无效');
  } else {
    let res = await Winner.findAll({
      where: {
        activite_id: id,
        activite_type: 2,
        invalid: 0
      },
      attributes: ['prize_name', 'avatar_url', 'nick_name', 'type']
    });
    ctx.body = success(res);
  }
}

const winners = async (ctx, next) => {
  let res = await Winner.findAll({
    include: [{
      model: Report,
      as: 'report',
      attributes: ['cinema_name', 'content', 'remark', 'show_day']
    }],
    where: {
      invalid: 0
    },
    attributes: ['nick_name', 'phone', 'title', 'movie_name', 'type', 'prize_name', 'address', 'receiver', 'identify_card', 'real_name', 'accept_time', 'manager_name', 'is_sure', 'activite_type', 'bankcard']
  });
  ctx.body = success(res);
}

module.exports = {
  pub: {
    search_sf_order,
    express_sf_order,
  },
  adm: {
    confirm_sf_order,
    add_sf_order,
    list,
    del,
    make_prize,
    lottery_list,
    winners
  },
  app: {
    express_winner_list,
    winner_list,
    accept_goods_prize,
    accept_money_prize,
    accept_coupon_prize,
    coupon_list
  }
};