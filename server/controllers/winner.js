const {
  Winner
} = require('../lib/model');
const xml2js = require('xml2js');
const config = require('../config');
const httpClient = require('../lib/httpClient')

const {
  success,
  failed
} = require('./base.js');



//下寄送快递订单
const add_sf_order = async(ctx, next) => {

  var obj = {
    "Request": {
      $: {
        "service": "OrderService",
        "lang": "zh-CN"
      },
      "Head": "SLKJ2019",
      "Body": {
        "order": {
          $: {
            "orderid": "JIANCHA_20181113153222",
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
            "d_province": '北京',
            "d_city": '朝阳区',
            "d_contack": '温泉',
            "d_mobile": '18210364952',
            "d_address": '芍药居北里306号楼1单元1406室',

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

  var builder = new xml2js.Builder();
  var xml = builder.buildObject(obj);

  console.log(xml)



  let reqUrl = 'https://bsp-oisp.sf-express.com/bsp-oisp/sfexpressService';
  let clientCode = config.sf.clientCode; //此处替换为您在丰桥平台获取的顾客编码
  let checkword = config.sf.checkword; //此处替换为您在丰桥平台获取的校验码
  // let myReqXml = reqXml.replace(/SLKJ2019/ig, clientCode);
  const client = new httpClient();
  console.log("请求报文：" + xml);
  res = await client.callSfExpressServiceByCSIM(reqUrl, xml, clientCode, checkword);

  ctx.body = success(res)
}


module.exports = {
  add_sf_order
};