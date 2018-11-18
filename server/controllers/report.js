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


//上传票根
const upload = async(ctx, next) => {
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




module.exports = {
  pub: {
    upload
  }
}