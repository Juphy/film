const {
  Report,
  Activity,
  Winner,
  User,
  Address
} = require('../lib/model');
const {
  success,
  failed,
  authFailed
} = require('./base.js');

const Redis = require('ioredis');
const redis = new Redis();
const moment = require('moment');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


//上传票根
const upload = async (ctx, next) => {

  if (!ctx.state.$wxInfo.loginState) {
    return ctx.body = authFailed()
  }

  const {
    show_day,
    cinema_code,
    remark = '',
    content,
    activite_id
  } = ctx.request.params

  if (!show_day || !cinema_code || !activite_id || !content) {
    return ctx.body = failed('参数错误')
  }

  //判断用户是否绑定手机



  activite_info = await Activity.find({
    where: {
      id: activite_id,
      invalid: 0,
      status: 1
    }
  })

  if (!activite_info) {
    return ctx.body = failed('活动不存在或已结束')
  }

  if (moment().format('YYYY-MM-DD') < activite_info.start_day) {
    return ctx.body = failed('活动未开始')
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
      open_id: ctx.state.$wxInfo.userinfo.openId,
      show_day: show_day,
      cinema_code: cinema_code,
      invalid: 0,
      activite_id
    }
  })

  if (report_info) {
    return ctx.body = failed('重复上传')
  }


  userinfo = await User.find({
    where: {
      open_id: ctx.state.$wxInfo.userinfo.openId
    }
  })

  if (!userinfo) {
    return ctx.body = failed('用户信息不存在')
  }

  res = await Report.create({
    open_id: userinfo.open_id,
    nick_name: userinfo.nick_name,
    avatar_url: userinfo.avatar_url,
    phone: userinfo.phone,
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


//删除上传数据
const app_del = async (ctx, next) => {

  if (!ctx.state.$wxInfo.loginState) {
    return ctx.body = authFailed()
  }

  let {
    report_id
  } = ctx.request.params;

  if (!report_id) {
    return ctx.body = failed('参数错误')
  }

  report_info = await Report.find({
    where: {
      open_id: ctx.state.$wxInfo.userinfo.openId,
      invalid: 0,
      id: report_id
    }
  })

  if (!report_info) {
    return ctx.body = failed('记录不存在或已删除')
  }

  if (report_info.create_time < moment().add(-5, 'minutes').format('YYYY-MM-DD HH:mm:ss')){
    return ctx.body = failed('超过5分钟不可被删除')
  }

  res = await report_info.update({
    invalid: report_info.id
  })

  ctx.body = success(res, '删除成功')
}


//参与记录
const app_list = async (ctx, next) => {

  if (!ctx.state.$wxInfo.loginState) {
    return ctx.body = authFailed()
  }

  let p = ctx.request.params;
  let {
    type,
    page = 1,
    page_size = 10
  } = p;
  p['page'] = page;
  p['page_size'] = page_size;

  if (!type || !page || !page_size) {
    return ctx.body = failed('参数错误')
  }

  let we = {}
  if (type == 1) {
    we['end_day'] = {
      $gte: moment().format('YYYY-MM-DD')
    }
    we['status'] = 1
  } else {
    we['$or'] = {
      'end_day': {
        $lt: moment().format('YYYY-MM-DD')
      },
      'status': {$in:[2,3]}
    }
  }



  let res = await Report.findAndCountAll({
    include: [{
      model: Activity,
      attributes: ['status'],
      where: we,
    }],
    where: {
      open_id: ctx.state.$wxInfo.userinfo.openId,
      invalid: 0
    },
    offset: (page - 1) * page_size,
    limit: page_size * 1
  })

  console.dir(res)
  for (item of res.rows){
    addr = await redis.get(item.cinema_code)
    // item.push(addr)
    item.dataValues.address= JSON.parse(addr)
  }

  ctx.body = success(res);



}


//上传票根信息
const app_info = async (ctx, next) => {

  if (!ctx.state.$wxInfo.loginState) {
    return ctx.body = authFailed()
  }

  let {
    report_id
  } = ctx.request.params

  if (!report_id) {
    return failed('参数错误')
  }

  report_info = await Report.find({
    where: {
      id: report_id,
      invalid: 0,
      open_id: ctx.state.$wxInfo.userinfo.openId
    }
  })

  if (!report_info) {
    return ctx.body = failed('信息不存在')
  }

  ctx.body = success(report_info, '查询成功')

}


// 上报数据列表（活动进行中和活动已结束）
const pending_list = async (ctx, next) => {
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
    include: [{
      model: Activity,
      where: {
        status: {
          [Op.ne]: 2
        },
        invalid: 0
      },
      attributes: ['status']
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

const ending_list = async (ctx, next) => {
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
    include: [{
      model: Activity,
      where: {
        status: 2,
        invalid: 0
      },
      attributes: ['status']
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

// 批量审核
const reviews = async (ctx, next) => {
  let p = ctx.request.params;
  let {
    ids = [], status
  } = p;
  if (!(status === 1 || status === 2) || !ids.length) {
    ctx.body = failed('必填项缺省或者无效');
  } else {
    let res = await Report.findAll({
      where: {
        id: {
          [Op.in]: ids
        }
      }
    });
    if (res) {
      if (res.some(item => item.is_winner)) {
        ctx.body = failed('请先取消中奖，再操作');
      } else {
        let _res = await Report.update({
          status: status,
          manager_id: ctx.state.managerInfo['data']['id'],
          manager_name: ctx.state.managerInfo['data']['name']
        }, {
            where: {
              id: {
                [Op.in]: ids
              }
            }
          });
        ctx.body = success(_res);
      }
    } else {
      ctx.body = failed('id无效');
    }
  }
}

// 中奖，标记中奖者
const winning = async (ctx, next) => {
  let p = ctx.request.params;
  let {
    report_id,
    is_winner = ''
  } = p;
  if (!report_id || !(is_winner === 0 || is_winner === 1)) {
    ctx.body = failed('必填项缺省或者无效');
  } else {
    let res = await Report.findById(report_id);
    if (res) {
      if (is_winner === 1) {
        let reports = await Report.findAll({
          where: {
            open_id: res.open_id,
            is_winner: 1,
            activite_id: res.activite_id
          }
        })
        if (reports.length) {
          ctx.body = failed('该用户已中奖');
        } else {
          res = await res.update({
            status: 1,
            is_winner: 1,
            manager_id: ctx.state.managerInfo['data']['id'],
            manager_name: ctx.state.managerInfo['data']['name']
          });
          ctx.body = success(res, '操作成功');
        }
      } else {
        res = await res.update({
          status: 1,
          is_winner: 0,
          manager_id: ctx.state.managerInfo['data']['id'],
          manager_name: ctx.state.managerInfo['data']['name']
        });
        ctx.body = success(res, '操作成功');
      }
    } else {
      ctx.body = failed('id无效');
    }
  }
}

// 已标记为中奖的数据
const report_winning = async (ctx, next) => {
  let p = ctx.request.params;
  let {
    id
  } = p;
  if (!id) {
    ctx.body = failed('id无效或者缺省');
  } else {
    let res = await Report.findAll({
      where: {
        activite_id: id,
        is_winner: 1
      }
    });
    ctx.body = success(res, '查询成功');
  }
}

const pending_count = async (ctx, next) => {
  let inc = [{
    model: Activity,
    where: {
      status: {
        [Op.ne]: 2
      },
      invalid: 0
    }
  }];
  let a = await Report.count({ include: inc, where: { status: 0, invalid: 0 } });
  let b = await Report.count({ include: inc, where: { status: 2, invalid: 0 } });
  let c = await Report.count({ include: inc, where: { status: 1, invalid: 0 } });
  let d = await Report.count({ include: inc, where: { is_winner: 1, invalid: 0 } });
  ctx.body = success([a, b, c, d]);
}

const ending_count = async (ctx, next) => {
  let inc = [{
    model: Activity,
    where: {
      status: 2,
      invalid: 0
    }
  }];
  let b = await Report.count({ include: inc, where: { status: 2, invalid: 0 } });
  let c = await Report.count({ include: inc, where: { status: 1, invalid: 0 } });
  let d = await Report.count({ include: inc, where: { is_winner: 1, invalid: 0 } });
  ctx.body = success([b, c, d]);
}

module.exports = {
  adm: {
    pending_list,
    ending_list,
    reviews,
    winning,
    report_winning,
    pending_count,
    ending_count,
    
  },
  app: {
    upload,
    app_list,
    app_info,
    app_del,
  }
}