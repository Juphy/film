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

  //判断用户是否绑定手机



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

  if (moment().format('YYYY-MM-DD') > activite_info.end_day) {
    return ctx.body = failed('活动已结束')
  }




  cinema_info = await redis.get(cinema_code)

  if (!cinema_info) {
    return ctx.body = failed('影院不存在')
  }

  cinema_info = JSON.parse(cinema_info)

  report_info = await Report.find({
    where: {
      open_id: open_id,
      show_day: show_day,
      cinema_code: cinema_code,
      invalid: 0,
      activite_id
    }
  })

  if (report_info) {
    return ctx.body = failed('重复上传')
  }

  res = await Report.create({
    open_id: open_id,
    nick_name: 'run', //ctx.state.data.nick_name,
    avatar_url: 'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83erYcyhqyv5TNicF9jQUGYWt9hF2LZrJJ1oCWemIU5K3KAK1hR6thSmmTAQwN9xicFnGSBoIodQXctRw/132', //ctx.state.data.nick_name,
    phone: '18210364952',//ctx.state.data.phone
    cinema_code: cinema_code,
    cinema_name: cinema_info.name,
    chain: cinema_info.chain,
    city: cinema_info.city,
    show_day: show_day,
    content: content,
    remark: remark,
    activite_id: activite_id,
    title: activite_info.title,
    movie_name: activite_info.movie_name,
    movie_id: activite_info.movie_id,
    create_time: moment().format('YYYY-MM-DD HH:mm:ss')
  })

  ctx.body = success(res, '上传成功')


}


//参与记录
const app_list = async (ctx, next) => {
  let p = ctx.request.params;
  let {
    open_id,
    type,
    page = 1,
    page_size = 10
  } = p;
  p['page'] = page;
  p['page_size'] = page_size;

  if (!type || !open_id) {
    return ctx.body = failed('参数错误')
  }

  let we = {}
  if (type == 1) {
    we['end_day'] = {
      $gte: moment().format('YYYY-MM-DD')
    }
  } else {
    we['end_day'] = {
      $lt: moment().format('YYYY-MM-DD')
    }
  }


  let res = await Report.findAndCountAll({
    include: [{
      model: Activity,
      attributes: ['status'],
      where: we,
    }],
    where: {
      open_id: open_id,
    },
    offset: (page - 1) * page_size,
    limit: page_size * 1
  })
  ctx.body = success(res);



}


//上传票根信息
const app_info = async (ctx, next) => {
  let {
    open_id,
    report_id
  } = ctx.request.params

  if (!open_id || !report_id) {
    return failed('参数错误')
  }

  report_info = await Report.findById(report_id, {
    invalid: 0,
    open_id: open_id
  })

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
    title = '',
    show_day,
    status = '',
    is_winner = '',
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
    title: {
      [Op.like]: '%' + title + '%'
    }
  };
  if (status !== '') {
    we['status'] = status;
  }
  if (is_winner !== '') {
    we['is_winner'] = is_winner
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

// 批量审核
const reviews = async (ctx, next) => {
  let p = ctx.request.params;
  let {
    ids = [], status, activite_id
  } = p;
  if (!(status == 1 || status == 2) || !ids.length || !activite_id) {
    ctx.body = failed('必填项缺省或者无效');
  } else {
    let activite = await Activity.findById(activite_id);
    if (activite.status === 2) {
      ctx.body = failed('活动已结束，无法审核')
    } else {
      if (status === 1) {
        if (res.some(item => item.status === 1)) {
          ctx.body = failed('已审核通过，请勿重复操作');
        } else {
          res = await res.update({
            status: 2,
            manager_id: ctx.state.managerInfo['data']['id'],
            manager_name: ctx.state.managerInfo['data']['name']
          });
          ctx.body = success(res);
        }
      } else if (status === 2) {
        if (res.some(item => item.is_winner)) {
          ctx.body = failed('请先取消中奖，再审核');
        } else {
          res = await res.update({
            status: 2,
            manager_id: ctx.state.managerInfo['data']['id'],
            manager_name: ctx.state.managerInfo['data']['name']
          });
          ctx.body = success(res);
        }
      }
    }
  }
}

// 中奖，标记中奖者
const winning = async (ctx, next) => {
  let p = ctx.request.params;
  let {
    report_id,
    is_winner = '',
    activite_id
  } = p;
  if (!report_id || is_winner === '' || !activite_id) {
    ctx.body = failed('必填项缺省或者无效');
  } else {

    let activite = await Activity.findById(activite_id);
    if (activite.status === 2) {
      ctx.body = failed('活动已结束')
    } else {
      let res = await Report.findById(report_id);
      if (res) {
        res = await res.update({
          status: 1,
          is_winner: is_winner,
          manager_id: ctx.state.managerInfo['data']['id'],
          manager_name: ctx.state.managerInfo['data']['name']
        });
        ctx.body = success(res, '产生中奖者成功');
      } else {
        ctx.body = failed('id无效');
      }
    }
  }
}

module.exports = {
  pub: {
    upload,
    list,
    reviews,
    winning,
    app_list,
    app_info
  }
}