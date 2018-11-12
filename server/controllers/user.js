const { User } = require('../lib/model');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { success, failed } = require('./base.js');




// 添加管理员
const info = async (ctx, next) => {
  // 通过 Koa 中间件进行登录态校验之后
  // 登录信息会被存储到 ctx.state.$wxInfo
  // 具体查看：
  if (ctx.state.$wxInfo.loginState === 1) {
    // loginState 为 1，登录态校验成功
    ctx.body = success(ctx.state.$wxInfo.userinfo)
  } else {
    ctx.body = failed('查询失败')
  }
};

// 绑定手机号
const bind_phone = async (ctx, next) => {
  // 通过 Koa 中间件进行登录态校验之后
  // 登录信息会被存储到 ctx.state.$wxInfo
  // 具体查看：

  console.log(ctx);

  let p = ctx.request.params;
  let { open_id,phone,code } = p;

  console.log('-----code:',code);
  console.log('------bind_phone_code', ctx.session['bindPhoneCode_' + phone])
  console.log('-------session:',ctx.session)

  if (code != ctx.session['bindPhoneCode_' + phone]){
    return ctx.body = failed('验证码错误')
  }

  user_info = await User.findOne({where:{open_id:open_id,invalid:0}});

  if(user_info){
    res = await user_info.update({phone:phone});

    ctx.body = success(res,'绑定成功')
  }else{
    ctx.body = failed('用户不存在')
  }
};




module.exports = {
    info,
    bind_phone,
}
