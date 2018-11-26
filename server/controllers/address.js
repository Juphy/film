const {
  Address,
  Diqu,
  City
} = require('../lib/model');
const {
  success,
  failed
} = require('./base.js');
const xml2js = require('xml2js');
const config = require('../config');

const Redis = require('ioredis');
const redis = new Redis();




// 添加地址
const add = async(ctx, next) => {
  const {
    open_id,
    province,
    city,
    _address
  } = ctx.request.params;
  let invalid = 0;
  if (!open_id || !province || !city || !_address) {
    ctx.body = failed('必填项缺省或者无效');
  } else {
    let res = await Address.create({
      open_id: open_id,
      province: province,
      city: city,
      address: _address,
      invalid: 0
    });
    ctx.body = success(res, '添加成功');
  }
}
// 编辑
const edit = async(ctx, next) => {
  let {
    open_id,
    province,
    city,
    _address,
    id
  } = ctx.request.params;
  if (!open_id || !province || !city || !_address) {
    ctx.body = failed('必填项缺省或者无效');
  } else {
    let res = await Address.findById(id);
    if (res) {
      Object.keys(p)
      res = res.update(p);
      ctx.body = success(res, '编辑成功');
    } else {
      ctx.body = failed('id无效或者缺省');
    }
  }
}

const info = async(ctx, next) => {
  let {
    id
  } = ctx.request.params;
  let res = await Address.findById(id);
  if (res) {
    ctx.body = success(res);
  } else {
    ctx.body = failed('id无效或者缺省');
  }
}

//地区列表
const diqu = async(ctx, next) => {
  const {
    name = '',
      code = ''
  } = ctx.request.params;

  let res
  if (name) {
    res = await Diqu.findAll({
      where: {
        parent: code,
        $or: {
          name: {
            $like: '%' + name + '%'
          },
          pinyin: {
            $like: '%' + name + '%'
          }
        }
      }
    })
  } else {
    res = await Diqu.findAll({
      where: {
        parent: code
      }
    })
  }


  ctx.body = success(res)
}

//城市列表
const city = async(ctx, next) => {
  const {
    name = ''
  } = ctx.request.params;

  let res
  if (name) {
    res = await City.findAll({
      where: {
        $or: {
          name: {
            $like: '%' + name + '%'
          },
          pinyin: {
            $like: '%' + name + '%'
          }
        }
      },
      order: [
        ['grade', 'ASC']
      ]
    })
  } else {
    res = await City.findAll({
      order: [
        ['grade', 'ASC']
      ]
    })
  }


  ctx.body = success(res)
}

const host_city = async(ctx, next) => {
  res = await City.findAll({
    where: {
      grade: 1
    }
  })

  ctx.body = success(res)
}



module.exports = {
  pub: {
    add,
    edit,
    info,
    diqu,
    city
  }
};