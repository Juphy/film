const {
  User,
  Address,
  Winner,
  Report,
  Option
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

const request = require('request')
const fs = require('fs')

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

  if (user_info.address_id == address_id) {
    await user_info.update({
      address_id: null
    }, {
      where: {
        open_id: ctx.state.$wxInfo.userinfo.openId
      }
    })
  }

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
    nick_name = '', phone, page = 1, page_size = 10, user_tags = ''
  } = p;
  p['page'] = page;
  p['page_size'] = page_size;
  let we = {
    invalid: 0,
    nick_name: {
      [Op.like]: '%' + nick_name + '%'
    }
  };
  if (user_tags !== '') {
    we['user_tags'] = {
      [Op.like]: '%' + user_tags + '%'
    }
  }

  let res = await User.findAndCountAll({
    include: [{
      model: Address,
      as: 'address',
      attributes: ['province', 'city', 'county', 'address', 'contact', 'phone']
    }],
    where: we,
    order: [
      ['create_time', 'DESC']
    ],
    offset: (page - 1) * page_size,
    limit: page_size * 1
  });
  ctx.body = success(res);
}


//微信用户树
const wechat_tree = async(ctx, next) => {
  let {
    id
  } = ctx.request.params;

  if (!id) {
    return ctx.body = failed('参数缺失')
  }

  let tree = {}

  let user_info = await User.find({
    where: {
      id: id,
      invalid: 0
    }
  })

  if (!user_info) {
    return ctx.body = failed('用户不存在')
  }

  tree.name = user_info.nick_name
  tree.parent = 'null'
  tree.uuid = user_info.uuid
  tree.from_uuid = user_info.from_uuid
  tree.avatar_url = user_info.avatar_url

  let level1 = await User.findAll({
    where: {
      from_uuid: user_info.uuid
    }
  })

  if (level1) {
    let l0_children = []
    for (var item1 of level1) {
      let l1_tree = {}
      l1_tree.name = item1.nick_name
      l1_tree.parent = item1.from_uuid
      l1_tree.uuid = item1.uuid
      l1_tree.from_uuid = item1.from_uuid
      l1_tree.avatar_url = item1.avatar_url
      level2 = await User.findAll({
        where: {
          from_uuid: item1.uuid
        }
      })


      if (level2) {
        let l1_children = []
        for (let item2 of level2) {
          let l2_tree = {}
          l2_tree.name = item2.nick_name
          l2_tree.parent = item2.from_uuid
          l2_tree.uuid = item2.uuid
          l2_tree.from_uuid = item2.from_uuid
          l2_tree.avatar_url = item2.avatar_url
          l1_children.push(l2_tree)
        }

        l1_tree.children = l1_children
      }

      l0_children.push(l1_tree)
    }
    tree.children = l0_children
  }

  ctx.body = success(tree,'查询成功')

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

//生成二维码
const createwxaqrcode = async(ctx, next) => {

  let {
    scene,
    page = 'pages/index/index',
    width = 430,
    auth_color = false
  } = ctx.request.params

  if (!scene) {
    return ctx.body = failed('参数错误')
  }


  data = {
    path: page, //二维码默认打开小程序页面
    scene: scene, //打开页面时携带的参数
    width: width,
    auto_color: auth_color
  };
  data = JSON.stringify(data);
  let http = require('http');


  let img = await new Promise((resolve, rejcet) => {
    var options = {
      method: "POST",
      host: "api.weixin.qq.com",
      path: "/wxa/getwxacodeunlimit?access_token=" + ctx.state.accessToken,
      headers: {
        "Content-Type": "application/json",
        "Content-Length": data.length
      }
    };
    var req = http.request(options, function(res) {
      // res.setEncoding("binary");
      var chunks = [];
      var size = 0;
      res.on('data', function(chunk) {
        chunks.push(chunk);　 //在进行网络请求时，会不断接收到数据(数据不是一次性获取到的)，
        size += chunk.length;　　 //累加缓冲数据的长度
      });
      res.on("end", function() {
        var data = Buffer.concat(chunks, size);　　　 //可通过Buffer.isBuffer()方法判断变量是否为一个Buffer对象
        var base64Img = data.toString('base64');　　 //将Buffer对象转换为字符串并以base64编码格式显示
        resolve(base64Img);
      });
    });
    req.write(data);
    req.end();

  })

  ctx.body = success('data:image/png;base64,' + img)
}

const user_tags = async(ctx, next) => {
  let res = await Option.findAll({
    where: {
      type: 'user_tags'
    },
    attributes: ['key', 'value']
  });
  ctx.body = success(res);
}

const edit_tag = async(ctx, next) => {
  let {
    id,
    user_tags = ''
  } = ctx.request.params;
  if (!id) {
    return ctx.body = failed('必填项缺省');
  }
  let res = await User.findById(id);
  if (!res) {
    return ctx.body = failed('id无效');
  }
  res = await res.update({
    user_tags: user_tags
  })
  ctx.body = success(res, '编辑成功');
}

module.exports = {

  pub: {
    createwxaqrcode,
    user_tags,
    wechat_tree
  },
  adm: {
    list,
    edit_tag
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