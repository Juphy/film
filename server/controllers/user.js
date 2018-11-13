const {
  User,
  Address
} = require('../lib/model');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const {
  success,
  failed
} = require('./base.js');
// const redis = require("redis")

const Redis = require('ioredis');
const redis = new Redis();


// 添加管理员
const info = async(ctx, next) => {
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
const bind_phone = async(ctx, next) => {
  // 通过 Koa 中间件进行登录态校验之后
  // 登录信息会被存储到 ctx.state.$wxInfo
  // 具体查看：

  let {
    open_id,
    phone,
    code
  } = ctx.request.params;

  const reply = await

  redis.get('bindPhoneCode_' + phone, function(err, reply) {
    return reply;
  });

  if (!reply) {
    ctx.body = failed('验证码失效')
    return
  }

  if (code != reply) {
    ctx.body = failed('验证码错误')
    return
  }

  console.log('-----true:')
  user_info = await User.findOne({
    where: {
      open_id: open_id,
      invalid: 0
    }
  });

  if (!user_info) {
    return ctx.body = failed('用户不存在')
  }

  res = await user_info.update({
    phone: phone
  });

  ctx.body = success(res, '绑定成功')



};

//添加地址
const add_address = async(ctx, next) => {

  let {
    open_id,
    province,
    city,
    county,
    address,
    contact,
    phone,
    is_default
  } = ctx.request.params;

  if (!open_id || !province || !city || !county || !address || !is_default || !contact || !phone) {
    return ctx.body = failed('参数错误')
  }

  user_info = await User.findOne({
    where: {
      open_id: open_id,
      invalid: 0
    }
  });

  if (!user_info) {
    return ctx.body = failed('用户不存在')
  }

  res = await Address.create({
    province: province,
    city: city,
    open_id: open_id,
    county: county,
    address: address,
    contact: contact,
    phone: phone,
    invalid: 0,
  })

  console.log('------res:', res)

  if (is_default == 1) {
    await user_info.update({
      address_id: res.id
    })
  }

  ctx.body = success(res, '添加成功')


}

//编辑地址
const edit_address = async(ctx, next) => {

  let {
    open_id,
    province,
    city,
    county,
    address,
    contact,
    phone,
    is_default,
    id
  } = ctx.request.params;

  if (!open_id || !province || !city || !county || !address || !is_default || !contact || !phone || !id) {
    return ctx.body = failed('参数错误')
  }

  user_info = await User.findOne({
    where: {
      open_id: open_id,
      invalid: 0
    }
  });

  if (!user_info) {
    return ctx.body = failed('用户不存在')
  }

  _address = await Address.findById(id, {
    invalid: 0,
    open_id: open_id
  })

  if (!_address) {
    return ctx.body = failed('地址不存在')
  }

  console.log('------id', id)
  res = await _address.update({
    province: province,
    city: city,
    open_id: open_id,
    county: county,
    address: address,
    contact: contact,
    phone: phone,
    invalid: 0,
  })

  console.log('------res:', res)

  if (is_default == 1) {
    await user_info.update({
      address_id: res.id
    })
  }

  ctx.body = success(res, '编辑成功')


}

const del_address = async(ctx, next) => {
  let {
    open_id,
    address_id
  } = ctx.request.params;
  if (!open_id || !address_id) {
    return ctx.body = failed('参数错误')
  }

  user_info = await User.findOne({
    where: {
      open_id: open_id,
      invalid: 0
    }
  });

  if (!user_info) {
    return ctx.body = failed('用户不存在')
  }

  if (user_info.address_id == address_id) {
    return ctx.body = failed('默认地址不可被删除')
  }

  address_info = await Address.findOne({
    where: {
      open_id: open_id,
      id: address_id,
      invalid: 0
    }
  });

  if (!address_info) {
    return ctx.body = failed('该地址不存在或已被删除')
  }

  await address_info.update({
    invalid: address_info.id
  })

  ctx.body = success('删除成功')
}

const address_list = async(ctx, next) => {
  let {
    open_id
  } = ctx.request.params;
  if (!open_id) {
    return ctx.body = failed('参数错误')
  }

  user_info = await User.findOne({
    where: {
      open_id: open_id,
      invalid: 0
    }
  });

  if (!user_info) {
    return ctx.body = failed('用户不存在')
  }

  const address_list = await Address.findAll({
    where: {
      invalid: 0,
      open_id: open_id
    }
  })

  address_list.forEach(function(item) {
    if (item.id == user_info.address_id) {
      item.setDataValue('default', 1)
    } else {
      item.setDataValue('default', 0)
    }
  })

  ctx.body = success(address_list, '查询成功')

}

const set_default_address = async(ctx, next) => {
  let {
    open_id,
    address_id
  } = ctx.request.params;
  if (!open_id) {
    return ctx.body = failed('参数错误')
  }

  user_info = await User.findOne({
    where: {
      open_id: open_id,
      invalid: 0
    }
  });

  if (!user_info) {
    return ctx.body = failed('用户不存在')
  }

  address_info = await Address.findOne({
    where: {
      open_id: open_id,
      id: address_id,
      invalid: 0
    }
  });

  if (!address_info) {
    return ctx.body = failed('该地址不存在或已被删除')
  }

  await user_info.update({
    address_id: address_id
  });

  ctx.body = success('', '设置默认地址成功')


}







module.exports = {
  info,
  bind_phone,
  add_address,
  edit_address,
  del_address,
  address_list,
  set_default_address
}