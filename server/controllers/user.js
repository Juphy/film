const {
  User,
  Address,
  Winner,
  Report
} = require('../lib/model');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const {
  success,
  failed,
  authFailed
} = require('./base.js');
// const redis = require("redis")

const Redis = require('ioredis');
const redis = new Redis();

//判断用户是否绑定手机号

const check_bind_phone = async(ctx, next) => {

  if (!ctx.state.$wxInfo.loginState) {
    return ctx.body = authFailed()
  }

  if (!ctx.state.$wxInfo.userinfo.phone) {
    return ctx.body = failed('未绑定')
  }
  ctx.body = success('', '已绑定')
}



// 绑定手机号
const bind_phone = async(ctx, next) => {
  // 通过 Koa 中间件进行登录态校验之后
  // 登录信息会被存储到 ctx.state.$wxInfo
  // 具体查看：

  let {
    phone,
    code
  } = ctx.request.params;

  if (!ctx.state.$wxInfo.loginState) {
    return ctx.body = authFailed()
  }

  const reply = await redis.get('bindPhoneCode_' + phone, function(err, reply) {
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

  console.log('-----ctx:', ctx.state.$wxInfo.userinfo)
  user_info = await User.findOne({
    where: {
      open_id: ctx.state.$wxInfo.userinfo.openId,
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
    province,
    province_code,
    city,
    city_code,
    county,
    county_code,
    address,
    contact,
    phone,
    is_default
  } = ctx.request.params;

  if (!ctx.state.$wxInfo.loginState) {
    return ctx.body = authFailed()
  }

  if (!province || !province_code || !city || !city_code || !county || !county_code || !address || !is_default || !contact || !phone) {
    return ctx.body = failed('参数错误')
  }

  res = await Address.create({
    province: province,
    province_code: province_code,
    city: city,
    city_code: city_code,
    county: county,
    county_code: county_code,
    open_id: ctx.state.$wxInfo.userinfo.openId,
    address: address,
    contact: contact,
    phone: phone,
    invalid: 0,
  })

  console.log('------res:', res)

  if (is_default == 1) {
    await User.update({
      address_id: res.id
    }, {
      where: {
        open_id: ctx.state.$wxInfo.userinfo.openId
      }
    })
  }

  ctx.body = success(res, '添加成功')


}

//编辑地址
const edit_address = async(ctx, next) => {

  if (!ctx.state.$wxInfo.loginState) {
    return ctx.body = failed('登录失败')
  }

  let {
    province,
    province_code,
    city,
    city_code,
    county,
    county_code,
    address,
    contact,
    phone,
    is_default,
    id
  } = ctx.request.params;

  if (!ctx.state.$wxInfo.loginState) {
    return ctx.body = authFailed()
  }

  if (!province || !province_code || !city || !city_code || !county || !county_code || !address || !is_default || !contact || !phone || !id) {
    return ctx.body = failed('参数错误')
  }

  user_info = await User.findOne({
    where: {
      open_id: ctx.state.$wxInfo.userinfo.openId,
      invalid: 0
    }
  });

  if (!user_info) {
    return ctx.body = failed('用户不存在')
  }

  _address = await Address.find({
    where: {
      id: id,
      invalid: 0,
      open_id: ctx.state.$wxInfo.userinfo.openId
    }
  })

  if (!_address) {
    return ctx.body = failed('地址不存在')
  }


  console.log('------id', id)
  res = await _address.update({
    province: province,
    province_code: province_code,
    city: city,
    city_code: city_code,
    county: county,
    county_code: county_code,
    open_id: ctx.state.$wxInfo.userinfo.openId,
    address: address,
    contact: contact,
    phone: phone,
    invalid: 0,
  })



  console.log('------res:', res)

  if (is_default == 1) {
    await user_info.update({
      address_id: res.id
    }, {
      where: {
        open_id: ctx.state.$wxInfo.userinfo.openId
      }
    })
  }

  if (is_default == 0 && user_info.address_id == id) {
    await user_info.update({
      address_id: null
    }, {
        where: {
          open_id: ctx.state.$wxInfo.userinfo.openId
        }
      })
  }

  ctx.body = success(res, '编辑成功')


}

//删除地址
const del_address = async(ctx, next) => {
  let {
    address_id
  } = ctx.request.params;

  if (!ctx.state.$wxInfo.loginState) {
    return ctx.body = authFailed()
  }

  if (!address_id) {
    return ctx.body = failed('参数错误')
  }

  let user_info = await User.find({
    where: {
      open_id: ctx.state.$wxInfo.userinfo.openId,
    }
  })

  if (!user_info) {
    return ctx.body = failed('用户信息不存在')
  }

  address_info = await Address.findOne({
    where: {
      open_id: ctx.state.$wxInfo.userinfo.openId,
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

//地址列表
const address_list = async(ctx, next) => {

  if (!ctx.state.$wxInfo.loginState) {
    return ctx.body = authFailed()
  }

  const address_list = await Address.findAll({
    where: {
      invalid: 0,
      open_id: ctx.state.$wxInfo.userinfo.openId
    }
  })

  const user_info = await User.find({
    where: {
      open_id: ctx.state.$wxInfo.userinfo.openId
    }
  })

  if (!user_info) {
    return ctx.body = failed('用户信息不存在')
  }

  address_list.forEach(function(item) {
    if (item.id == user_info.address_id) {
      item.setDataValue('default', 1)
    } else {
      item.setDataValue('default', 0)
    }
  })

  ctx.body = success(address_list, '查询成功')

}

//获取默认地址

const get_default_address = async(ctx, next) => {

  if (!ctx.state.$wxInfo.loginState) {
    return ctx.body = authFailed()
  }

  const user_info = await User.find({
    where: {
      open_id: ctx.state.$wxInfo.userinfo.openId
    }
  })

  if (!user_info) {
    return ctx.body = failed('用户信息不存在')
  }

  const address_info = await Address.findById(user_info.address_id)

  ctx.body = success(address_info)
}

//设置默认地址
const set_default_address = async(ctx, next) => {

  if (!ctx.state.$wxInfo.loginState) {
    return ctx.body = authFailed()
  }

  let {
    address_id
  } = ctx.request.params;

  if (!address_id) {
    return ctx.body = failed('参数错误')
  }


  address_info = await Address.findOne({
    where: {
      open_id: ctx.state.$wxInfo.userinfo.openId,
      id: address_id,
      invalid: 0
    }
  });

  if (!address_info) {
    return ctx.body = failed('该地址不存在或已被删除')
  }



  await User.update({
    address_id: address_id
  }, {
    where: {
      open_id: ctx.state.$wxInfo.userinfo.openId
    }
  });

  ctx.body = success('', '设置默认地址成功')


}

const list = async(ctx, next) => {
  let p = ctx.request.params;
  let {
    nick_name = '', phone, page = 1, page_size = 10
  } = p;
  p['page'] = page;
  p['page_size'] = page_size;
  let res = await User.findAndCountAll({
    include: [{
      model: Address,
      as: 'address',
      attributes: ['province', 'city', 'county', 'address', 'contact', 'phone']
    }],
    where: {
      invalid: 0,
      nick_name: {
        [Op.like]: '%' + nick_name + '%'
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


//小程序端统计参与记录，中奖记录
const app_monitor = async(ctx, next) => {

  if (!ctx.state.$wxInfo.loginState) {
    return ctx.body = authFailed()
  }

  const count_report = await Report.count({
    where: {
      open_id: ctx.state.$wxInfo.userinfo.openId,
      invalid: 0,
    }
  })

  const count_winner = await Winner.count({
    where: {
      open_id: ctx.state.$wxInfo.userinfo.openId,
      invalid: 0
    }
  })

  const count_winner_sure = await Winner.count({
    where: {
      open_id: ctx.state.$wxInfo.userinfo.openId,
      invalid: 0,
      is_sure: 0
    }
  })

  ctx.body = success({
    'count_report': count_report,
    'count_winner': count_winner,
    'count_winner_sure': count_winner_sure
  })

}

//分享
const app_share = async(ctx, next) => {


  if (!ctx.state.$wxInfo.loginState) {
    return ctx.body = authFailed()
  }


  let {
    uuid
  } = ctx.request.params

  if (!uuid) {
    return ctx.body = failed('参数错误')
  }

  userinfo = await User.find({
    where: {
      open_id: ctx.state.$wxInfo.userinfo.openId
    }
  })

  if (!userinfo) {
    return ctx.body = failed('用户不存在')
  }

  res = ''
  console.log('---------uuid_out:', uuid)
  if (userinfo.uuid != uuid && !userinfo.from_uuid) {
    console.log('---------uuid_in:', uuid)
    res = userinfo.update({
      from_uuid: uuid
    })
  }

  ctx.body = success(res)


}





module.exports = {
  adm: {
    list
  },
  app: {
    check_bind_phone,
    app_monitor,
    add_address,
    del_address,
    bind_phone,
    set_default_address,
    edit_address,
    get_default_address,
    address_list,
    app_share
  }
}