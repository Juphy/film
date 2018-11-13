const request = require('request')
const crypto = require('crypto');
const md5 = crypto.createHash('md5');

class httpClient {
  constructor() {

  }
  callSfExpressServiceByCSIM(reqURL, myReqXml, clientCode, checkword) {
    if (!reqURL) {
      reqURL = "https://bsp-oisp.sf-express.com/bsp-oisp/sfexpressService"
    }
    //加密生成verifyCode;
    let verifyCode = md5.update(myReqXml + checkword, 'utf8').digest('base64');
    return new Promise(function(resolve, reject) {

      request.post(reqURL, {
        form: {
          "xml": myReqXml,
          "verifyCode": verifyCode
        }
      }, function(error, response, body) {
        if (error) {
          console.log("--------------------------------------");
          console.error(`请求遇到问题: ${error}`);
          console.log("--------------------------------------");
        }
        if (body) {
          console.log("--------------------------------------");
          console.log("返回报文: " + body);
          console.log("--------------------------------------");

        }


        console.log('----body:', body)
        resolve(body);
        reject(error);
      });
    })
  }
}

module.exports = httpClient;