const {
  manager
} = require('../lib/model');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const {
  success,
  failed
} = require('./base.js');
const jsonwebtoken = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const SALTROUNDS = 10;

//后台登录
const login = async (ctx, next) => {
  let {
    account,
    password
  } = ctx.request.params;
  // try {
  const user = await manager.findOne({
    where: {
      account: account,
      invalid: 0
    }
  });


  if (!user) {
    ctx.body = failed('账户错误')
    return;
  }
  const secret = 'jwt_secret';
  // 匹配密码是否相等
  const check = await bcrypt.compare(password, user.password);
  if (check) {
    ctx.status = 200
    const token = jsonwebtoken.sign({
      data: user,
      // 设置 token 过期时间
      exp: Math.floor(Date.now() / 1000) + (60 * 60), // 60 seconds * 60 minutes = 1 hour
    }, secret)
    ctx.body = success({
      'user_info': user,
      'token': token
    }, '登录成功')
  } else {
    ctx.body = failed('密码错误')
  }
  // } catch (error) {
  //   ctx.throw('服务端错误')
  // }
}

// 添加管理员
const add = async (ctx, next) => {
  const {
    name,
    nick_name = '',
    phone = null,
    account
  } = ctx.request.params;
  const create_time = new Date(),
    invalid = 0, password = await bcrypt.hash('12345678', SALTROUNDS);
  if (!name || !account) {
    ctx.body = failed('必填项缺省或者无效');
  } else {
    let res = await manager.create({
      name: name,
      nick_name: nick_name,
      phone: phone,
      password: password,
      create_time: create_time,
      invalid: invalid,
      account: account
    });
    ctx.body = success(null, '添加成功');
  }
};
// 管理员列表
const list = async (ctx, next) => {
  let p = ctx.request.params;
  let {
    name = '', page = 1, page_size = 10
  } = p;
  p['page'] = page;
  p['page_size'] = page_size;
  let res = await manager.findAndCountAll({
    where: {
      invalid: 0,
      name: {
        [Op.like]: '%' + name + '%'
      }
    },
    order: [
      ['create_time', 'DESC']
    ], // DESC 降  ASC升
    offset: (page - 1) * page_size,
    limit: page_size * 1
  });
  ctx.body = success(res);
};

// 删除管理员
const del = async (ctx, next) => {
  let p = ctx.request.params;
  let {
    id
  } = p;
  if (!id) {
    ctx.body = failed('必填项缺省或者无效');
  } else {
    let res = await manager.findById(id);
    if (res) {
      if (res.invalid !== 0) {
        ctx.body = failed('已删除');
      } else {
        res = res.update({
          invalid: id
        })
        ctx.body = success(res, '删除成功');
      }
    } else {
      ctx.body = failed('id无效或者缺省');
    }
  }
};

// 编辑管理员
const edit = async (ctx, next) => {
  let p = ctx.request.params;
  let {
    name,
    account,
    id
  } = p
  if (!name || !account || !id) {
    ctx.body = failed('必填项缺省或者无效');
  } else {
    let res = manager.findById(id);
    if (res) {
      res = res.update(p);
      ctx.body = success(res, '编辑成功');
    } else {
      ctx.body = failed('id无效或者缺省');
    }
  }
};

// 查询管理员信息
const info = async (ctx, next) => {
  const p = ctx.request.params;
  let {
    id
  } = p;
  if (!id) {
    ctx.body = failed('id无效或者缺省');
  } else {
    let res = await manager.findById(id);
    if (res) {
      ctx.body = success(res);
    } else {
      ctx.body = failed('id无效或者缺省');
    }
  }
};

// const update = async (ctx, next) => {
//   // let res = await manager.findAll();
//   // res.forEach(item => {
//   //     manager.update({
//   //         account: item.nick_name
//   //     }, {
//   //             where: {
//   //                 id: item.id
//   //             }
//   //         })
//   // });
//   manager.update({ password: await bcrypt.hash('12345678', SALTROUNDS) }, {
//     where: {}
//   });
//   ctx.body = success('更新数据', '更新成功');
// }

module.exports = {
  adm: {
    add,
    list,
    del,
    edit,
    info,
  },
  pub: {
    login
  }
};