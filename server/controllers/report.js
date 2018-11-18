const {
  Report
} = require('../lib/model');
const {
  success,
  failed
} = require('./base.js');

const Redis = require('ioredis');
const redis = new Redis();


//上传票根
const upload = async(ctx, next) => {
  const {
    open_id,
    show_day,
    cinema_code,
    remark = '',
    content
  } = ctx.request.params

  // if(!open_id || !show_day || !cinema_code || !remark || !content){
  //   return ctx.body = failed('参数错误')
  // }


  cinema_info = await redis.get(cinema_code)

  if(!cinema_info){
    return ctx.body = failed('影院不存在')
  }

  cinema_info = JSON.parse(cinema_info)

  report_info = await Report.find({open_id:open_id,show_day:show_day,cinema_code:cinema_code,invalid:0})

  if(report_info){
    return ctx.body = failed('重复上传')
  }

  res = await Report.create({
    open_id:open_id,
    cinema_code:cinema_code,
    cinema_name:cinema_info.name,
    chain:cinema_info.chain,
    city:cinema_info.city,
    show_day:show_day,
    content:content,
    remark:remark
  })

  ctx.body = success(res,'上传成功')


}




module.exports = {
  pub: {
    upload
  }
}