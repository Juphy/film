
const { appId, appSecret } = require('../config');
const Redis = require('ioredis');
const redis = new Redis();
module.exports = async (ctx, next) => {
    let accessToken = await redis.get('access_token');
    if (!accessToken) {
        let https = require('https');
        accessToken = await new Promise((resolve, rejcet) => {
            https.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`, function (res) {
                let data = [];
                res.on('data', function (chunk) {
                    data.push(chunk);
                });
                res.on('end', function (err) {
                    redis.set('access_token', accessToken, 'EX', 7000);
                    resolve(JSON.parse(data.toString())['access_token']);
                })
            })
        });
    }
    ctx.state.accessToken = accessToken;
    await next();
}
