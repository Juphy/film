const {
  Report,
  Activity,
  Winner,
  User,
  Address,
  Lottery
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
    activite_type: 1,
    activite_status: 1,
    activite_end_day: activite_info.end_day,
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

  if (moment(report_info.create_time).format('YYYY-MM-DD HH:mm:ss') < moment().add(-5, 'minutes').format('YYYY-MM-DD HH:mm:ss')) {
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

  let we = {
    open_id: ctx.state.$wxInfo.userinfo.openId,
    invalid: 0
  }
  if (type == 1) {
    we['activite_end_day'] = {
      $gte: moment().format('YYYY-MM-DD')
    }
    we['activite_status'] = 1
  } else {
    we['$or'] = {
      'activite_end_day': {
        $lt: moment().format('YYYY-MM-DD')
      },
      'activite_status': {
        $in: [2, 3]
      }
    }
  }



  let res = await Report.findAndCountAll({
    where: we,
    offset: (page - 1) * page_size,
    limit: page_size * 1,
    order: ['create_time', 'DESC']
  })

  console.dir(res)
  for (item of res.rows) {
    if (item.cinema_code != 0) {
      addr = await redis.get(item.cinema_code)
      // item.push(addr)
      item.dataValues.address = JSON.parse(addr)
    }
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
    cinema_name = '',
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
    activite_type: 1,
    activite_status: {
      [Op.in]: [1, 2]
    },
    movie_name: {
      [Op.like]: '%' + movie_name + '%'
    },
    title: {
      [Op.like]: '%' + title + '%'
    },
    cinema_name: {
      [Op.like]: '%' + cinema_name + '%'
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

const ending_list = async (ctx, next) => {
  let p = ctx.request.params;
  let {
    movie_name = '',
    cinema_name = '',
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
    activite_type: 1,
    activite_status: 3,
    movie_name: {
      [Op.like]: '%' + movie_name + '%'
    },
    title: {
      [Op.like]: '%' + title + '%'
    },
    cinema_name: {
      [Op.like]: '%' + cinema_name + '%'
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
        is_winner: 1,
        activite_type: 1
      }
    });
    ctx.body = success(res, '查询成功');
  }
}

const pending_count = async (ctx, next) => {
  let a = await Report.count({
    where: {
      status: 0,
      invalid: 0,
      activite_type: 1,
      activite_status: {
        [Op.in]: [1, 2]
      }
    }
  });
  let b = await Report.count({
    where: {
      status: 2,
      invalid: 0,
      activite_type: 1,
      activite_status: {
        [Op.in]: [1, 2]
      }
    }
  });
  let c = await Report.count({
    where: {
      status: 1,
      invalid: 0,
      activite_type: 1,
      activite_status: {
        [Op.in]: [1, 2]
      }
    }
  });
  let d = await Report.count({
    where: {
      is_winner: 1,
      invalid: 0,
      activite_type: 1,
      activite_status: {
        [Op.in]: [1, 2]
      }
    }
  });
  ctx.body = success([a, b, c, d]);
}

const ending_count = async (ctx, next) => {
  let b = await Report.count({
    where: {
      status: 2,
      invalid: 0,
      activite_type: 1,
      activite_status: 3
    }
  });
  let c = await Report.count({
    where: {
      status: 1,
      invalid: 0,
      activite_type: 1,
      activite_status: 3
    }
  });
  let d = await Report.count({
    where: {
      is_winner: 1,
      invalid: 0,
      activite_type: 1,
      activite_status: 3
    }
  });
  ctx.body = success([b, c, d]);
}

//参与抽奖活动
const in_lotties = async (ctx, next) => {

  if (!ctx.state.$wxInfo.loginState) {
    return ctx.body = authFailed()
  }

  let {
    activite_id
  } = ctx.request.params;

  if (!activite_id) {
    return ctx.body = failed('参数错误')
  }

  open_id = ctx.state.$wxInfo.userinfo.openId

  userinfo = await User.find({
    where: {
      open_id: open_id
    }
  })

  if (!userinfo) {
    return ctx.body = failed('用户信息不存在')
  }

  activite_info = await Lottery.find({
    where: {
      invalid: 0,
      start_day: {
        $lte: moment().format('YYYY-MM-DD')
      },
      end_day: {
        $gte: moment().format('YYYY-MM-DD')
      },
      status: 1,
      id: activite_id
    }
  })

  if (!activite_info) {
    return ctx.body = failed('活动不存在或已结束')
  }

  report_info = await Report.find({
    where: {
      open_id: open_id,
      activite_id: activite_id,
      activite_type: 2,
      invalid: 0
    }
  })

  if (report_info) {
    return ctx.body = failed('您已参与成功')
  }

  rules = activite_info.rule_description

  if (rules && rules.upload) {
    count = await Report.count({
      where: {
        open_id: open_id,
        invalid: 0,
        activite_type: 1
      }
    })

    if (count < rules.upload) {
      return ctx.body = failed('上传票根未达到' + rules.upload + '次')
    }
  }

  if (rules && rules.share) {
    count = await User.count({
      where: {
        from_uuid: userinfo.uuid
      }
    })

    if (count < rules.share) {
      return ctx.body = failed('邀请人数未达到' + rules.share + '个')
    }
  }

  if (rules && rules.date && moment(userinfo.create_time).format('YYYY-MM-DD') < moment(rules.date).format('YYYY-MM-DD')) {
    return ctx.body = failed('您不是' + moment(rules.date).format('YYYY年MM月DD日') + '之后注册用户')
  }


  res = await Report.create({
    open_id: userinfo.open_id,
    nick_name: userinfo.nick_name,
    avatar_url: userinfo.avatar_url,
    phone: userinfo.phone,
    cinema_code: 0,
    cinema_name: '抽奖活动',
    activite_id: activite_id,
    activite_type: 2,
    activite_status: 1,
    show_day: moment().format('YYYY-MM-DD'),
    activite_end_day: activite_info.end_day,
    title: activite_info.title,
    create_time: moment().format('YYYY-MM-DD HH:mm:ss')
  })

  ctx.body = success(res, '参与活动成功')

}

const lottery_report = async (ctx, next) => {

  let { activite_id } = ctx.request.params;
  let res = await Report.findAll({
    where: {
      invalid: 0,
      activite_id: activite_id,
      activite_type: 2
    },
    attributes: ['id', 'nick_name', 'avatar_url', 'open_id', 'phone']
  });
  ctx.body = success(res);
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
    lottery_report
  },
  app: {
    in_lotties,
    upload,
    app_list,
    app_info,
    app_del,
  }
}