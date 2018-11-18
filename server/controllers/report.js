const {
  Report,
  Activity
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
    }
  };
  if (status !== '') {
    we['status'] = status;
  }
  if (show_day) {
    we['show_day'] = new Date(show_day);
  }
  let res = await Report.findAndCountAll({
    where: we,
    order: [
      ['create_time', 'DESC']
    ],
    offset: (page - 1) * page_size,
    limit: page_size * 1
  });
  ctx.body = success(res);
}

const review = async (ctx, next) => {
  let p = ctx.request.params;
  let { id, status } = p;
  if (!(status == 1 || status == 2) || !id) {
    ctx.body = failed('必填项缺省或者无效');
  } else {
    let res = await Report.findById(id);
    if (res) {
      res = res.update({ status: status });
      ctx.body = success('审核成功');
    } else {
      ctx.body = failed('id无效');
    }
  }
}


module.exports = {
  pub: {
    upload,
    list,
    review
  }
}