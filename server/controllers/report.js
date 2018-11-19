const {
  Report,
  Activity,
  Winner,
  User,
  Address
} = require('../lib/model');
const {
  success,
  failed
} = require('./base.js');

const Redis = require('ioredis');
const redis = new Redis();
const moment = require('moment');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const {
  secret
} = require('../config')
const jsonwebtoken = require('jsonwebtoken');


//上传票根
const upload = async (ctx, next) => {
  const {
    open_id,
    show_day,
    cinema_code,
    remark = '',
    content,
    activite_id
  } = ctx.request.params

  if (!open_id || !show_day || !cinema_code || !activite_id || !content) {
    return ctx.body = failed('参数错误')
  }

  activite_info = await Activity.findById(activite_id, {
    invalid: 0
  })

  if (!activite_info) {
    return ctx.body = failed('活动不存在')
  }

  if (activite_info.status == 0) {
    return ctx.body = failed('活动未开始')
  }

  if (activite_info.status == 2) {
    return ctx.body = failed('活动已结束')
  }



  cinema_info = await redis.get(cinema_code)

  if (!cinema_info) {
    return ctx.body = failed('影院不存在')
  }

  cinema_info = JSON.parse(cinema_info)

  report_info = await Report.find({
    open_id: open_id,
    show_day: show_day,
    cinema_code: cinema_code,
    invalid: 0,
    activite_id
  })

  if (report_info) {
    return ctx.body = failed('重复上传')
  }

  res = await Report.create({
    open_id: open_id,
    cinema_code: cinema_code,
    cinema_name: cinema_info.name,
    chain: cinema_info.chain,
    city: cinema_info.city,
    show_day: show_day,
    content: content,
    remark: remark,
    activite_id: activite_id,
    activite_name: activite_info.title,
    movie_name: activite_info.movie_name,
    create_time: moment().format('YYYY-MM-DD HH:mm:ss')
  })

  ctx.body = success(res, '上传成功')


}


//参与记录
const app_list = async (ctx, next) => {
  let p = ctx.request.params;
  let {
    open_id,
    status,
    page = 1,
    page_size = 10
  } = p;
  p['page'] = page;
  p['page_size'] = page_size;

  if (!status || !open_id) {
    return ctx.body = failed('参数错误')
  }


  let res = await Report.findAndCountAll({
    include: [{
      model: Activity,
      attributes: ['status']
    }],
    where: {
      open_id: open_id,
      status: status
    },
    offset: (page - 1) * page_size,
    limit: page_size * 1
  })
  ctx.body = success(res);



}


//上传票根信息
const info = async (ctx, next) => {
  let {
    open_id,
    report_id
  } = ctx.request.params

  if (!open_id || !report_id) {
    return failed('参数错误')
  }

  report_info = await Report.findById(report_id, { invalid: 0, open_id: open_id })

  if (!report_info) {
    return ctx.body = failed('信息不存在')
  }

  ctx.body = success(report_info, '查询成功')

}


// 上报数据列表
const list = async (ctx, next) => {
  let p = ctx.request.params;
  let {
    movie_name = '',
    activite_name = '',
    show_day,
    status = '',
    page = 1,
    page_size = 10
  } = p;
  p['page'] = page;
  p['page_size'] = page_size;
  const we = {
    invalid: 0,
    movie_name: {
      [Op.like]: '%' + movie_name + '%'
    },
    activite_name: {
      [Op.like]: '%' + activite_name + '%'
    }
  };
  if (status !== '') {
    we['status'] = status;
  }
  if (show_day) {
    we['show_day'] = new Date(show_day);
  }
  let res = await Report.findAndCountAll({
    include: [
      {
        model: User,
        attributes: ['nick_name', 'address_id']
      }
    ],
    where: we,
    order: [
      ['create_time', 'DESC']
    ],
    offset: (page - 1) * page_size,
    limit: page_size * 1
  });
  ctx.body = success(res);
}

// 批量审核
const reviews = async (ctx, next) => {
  let p = ctx.request.params;
  let {
    ids = [], status
  } = p;
  if (!(status == 1 || status == 2) || !ids.length) {
    ctx.body = failed('必填项缺省或者无效');
  } else {
    console.log(p);
    let res = await Report.update({
      status: status
    }, {
        where: {
          id: {
            [Op.in]: ids
          }
        }
      });
    ctx.body = success(res);
  }
}

// 中奖，产生中将者名单
const winning = async (ctx, next) => {
  let p = ctx.request.params;
  let {
    id
  } = p;
  if (!id) {
    ctx.body = failed('id必填项缺省或者无效');
  } else {
    let res = await Report.findById(id);
    if (res) {
      await res.update({ status: 1, is_winner: 1 });
      let token = ctx.header.authorization;
      let payload = await jsonwebtoken.decode(token.split(' ')[1], secret);
      let address = await Address.findOne({ where: { open_id: res['open_id'] } });
      await Winner.create({
        open_id: res['open_id'],
        active_id: res['activite_id'],
        prize_name: '',
        status: 0,
        need_delivery: 0,
        mailno: '',
        manager_id: payload['data']['id'],
        manager_name: payload['data']['name'],
        invalid: 0,
        create_time: new Date(),
        is_sure: 0,
        is_received: 0,
        address_id: address['id'],
        address: address,
        orderid: '',
        report_id: res['id']
      });
      ctx.body = success(res, '产生中奖者成功');
    } else {
      ctx.body = failed('id无效')
    }
  }
}

module.exports = {
  pub: {
    upload,
    list,
    reviews,
    winning,
    app_list
  }
}