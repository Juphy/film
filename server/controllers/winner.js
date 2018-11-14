const {
  Winner
} = require('../lib/model');
const xml2js = require('xml2js');
const config = require('../config');
const httpClient = require('../lib/httpClient')
const moment = require('moment');

const {
  success,
  failed
} = require('./base.js');



//下寄送快递订单
const add_sf_order = async(ctx, next) => {

  const {
    winner_id
  } = ctx.request.params;

  if (!winner_id) {
    return ctx.body = failed('参数错误')
  }

  winner_info = await Winner.findById(winner_id, {
    invalid: 0,
    needDelivery: 1,
    isSure: 1
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
            "d_province": winner_info.address.province,
            "d_city": winner_info.address.city,
            "d_contact": winner_info.address.contact,
            "d_mobile": winner_info.address.phone,
            "d_address": winner_info.address.address,

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
    orderid: orderid
  })

  ctx.body = success(res, '下订单成功')
}



//查询顺丰订单
const search_sf_order = async(ctx, next) => {
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
const confirm_sf_order = async(ctx, next) => {
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
const express_sf_order = async(ctx, next) => {
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

  routes.forEach(function(val, index) {
    arr[index] = val.$
  })

  console.log(arr)

  ctx.body = success(arr, '查询成功')
}

//查询需要寄送快递奖品列表(me)
const express_winner_list = async(ctx, next) => {
  const {
    open_id,
    page = 1,
    page_size = 10
  } = ctx.request.params;

  if (!page || !page_size || !open_id) {
    return ctx.body = failed('参数错误')
  }


  let res = await Winner.findAndCountAll({
    where: {
      invalid: 0,
      is_sure: 1,
      status: 1,
      need_delivery: 1,
      open_id,
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
  parser.parseString(xml_res, function(err, result) {
    console.dir(result);
    console.log('Done');
    res = result
  });

  return res
}




module.exports = {
  pub: {
    add_sf_order,
    search_sf_order,
    confirm_sf_order,
    express_sf_order,
    express_winner_list
  }

};