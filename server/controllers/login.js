const { User } = require('../lib/model');
const { success, failed } = require('./base.js');

// 登录授权接口
module.exports = async (ctx, next) => {
    // 通过 Koa 中间件进行登录之后
    // 登录信息会被存储到 ctx.state.$wxInfo
    // 具体查看：
    if (ctx.state.$wxInfo.loginState) {
        ctx.state.data = ctx.state.$wxInfo.userinfo
        ctx.state.data['time'] = Math.floor(Date.now() / 1000)
        userinfo = await User.find({ open_id: ctx.state.$wxInfo.userinfo['open_id']})

        ctx.state.data['userinfo']['phone'] = userinfo.phone
        ctx.state.data['userinfo']['uuid'] = userinfo.uuid
        ctx.body = success(ctx.state.data)
        console.log(ctx.body)
    }
}
