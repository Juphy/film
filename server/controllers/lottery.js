const {
  Lottery
} = require('../lib/model');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const {
  success,
  failed
} = require('./base.js');
const moment = require('moment');

// 添加活动
const add = async(ctx, next) => {
  const p = ctx.request.params;
  const {
    title,
    start_day,
    end_day,
    description,
    rule_description,
    playbill,
    prize_description,
    other_description = []
  } = p;
  console.log(p);
  if (!title || !start_day || !end_day || !description || !rule_description || !prize_description || !playbill) {
    ctx.body = failed('必填项缺省或者无效')
  } else {
    if (moment().format('YYYY-MM-DD') > moment(start_day).format('YYYY-MM-DD')) {
      ctx.body = failed('活动的开始日期不得小于当前日期')
    } else {
      p['manager_id'] = ctx.state.managerInfo['data']['id'];
      p['manager_name'] = ctx.state.managerInfo['data']['name'];
      p['status'] = 0;
      p['invalid'] = 0;
      p['create_time'] = new Date();
      p['other_description'] = other_description;
      let res = await Lottery.create(p);
      ctx.body = success(res, '创建成功');
    }
  }
}

// 活动列表
const list = async(ctx, next) => {
  let p = ctx.request.params;
  let {
    title,
    page = 1,
    page_size = 10
  } = p;
  p['page'] = page;
  p['page_size'] = page_size;
  let res = await Lottery.findAndCountAll({
    where: {
      invalid: 0,
      title: {
        [Op.like]: '%' + title + '%'
      }
    },
    order: [
      ['create_time', 'DESC']
    ],
    offset: (page - 1) * page_size,
    limit: page_size * 1
  });
  ctx.body = success(res);
}

// 删除活动
const del = async(ctx, next) => {
  let {
    id
  } = ctx.request.params;
  if (!id) {
    ctx.body = failed('id缺省或者无效');
  } else {
    let res = await Lottery.findById(id);
    if (res) {
      if (res.invalid !== 0) {
        ctx.body = failed('已删除');
      } else {
        res = await res.update({
          invalid: id
        });
        ctx.body = success(res, '删除成功');
      }
    } else {
      ctx.body = failed('id无效')
    }
  }
}

// 编辑活动
const edit = async(ctx, next) => {
  let p = ctx.request.params;
  let {
    id,
    title,
    playbill,
    start_day,
    end_day,
    description,
    rule_description,
    prize_description,
    other_description = null
  } = p;
  if (!title || !id || !start_day || !end_day || !description || !rule_description || !prize_description || !playbill) {
    ctx.body = failed('必填项缺省或者缺省');
  } else {
    let res = await Lottery.findById(id);
    if (res) {
      if (res['status'] > 0) {
        ctx.body = failed('活动已开始，无法编辑');
      } else {
        if (moment().format('YYYY-MM-DD') > moment(start_day).format('YYYY-MM-DD')) {
          ctx.body = failed('活动开始日期不得小于当前日期');
        } else {
          p['other_description'] = other_description;
          p['manager_id'] = ctx.state.managerInfo['data']['id'];
          p['manager_name'] = ctx.state.managerInfo['data']['name'];
          res = res.update(p);
          ctx.body = success(res, '编辑成功');
        }
      }
    } else {
      ctx.body = failed('id无效')
    }
  }
}

// 发布活动
const start_end = async(ctx, next) => {
  let {
    id,
    status
  } = ctx.request.params;
  if (!(status === 1 || status === 2) || !id) {
    return ctx.body = failed('必填项缺省或者无效')
  }
  let res = await Lottery.findById(id);
  if (!res) {
    return ctx.body = failed('id无效');
  }
  if (res.status === 3) {
    return ctx.body = failed('活动已结束');
  }
  if (res.status === status) {
    if (stratus === 1) {
      return ctx.body = failed('活动已开始');
    }
    if (status === 2) {
      return ctx.body = failed('活动已暂停')
    }
  }
  if (status === 1 && (moment(res.end_day).format('YYYY-MM-DD') < moment().format('YYYY-MM-DD'))) {
    return ctx.body = failed('活动的结束时间不得小于当前时间')
  }
  res = res.update({
    status: status
  });
  await Report.update({ activite_status: status }, {
    where: {
      invalid: 0,
      active_id: id,
      activite_type: 2
    }
  });
  let j = ['', '活动发布成功', '活动结束成功'];
  ctx.body = success(res, j[status]);
}

// 活动开奖 
const lottery = async(ctx, next) => {
  let {
    winners,
    lottery_id
  } = ctx.request.params;
  if (!winners || !lottery_id) {
    return ctx.body = failed('参数错误');
  }

  activite_info = await Lottery.find({
    where: {
      id: lottery_id,
      invalid: 0,
      status: {
        $in: [1, 2]
      }
    }
  }) //查询活动信息

  if (!activite_info) {
    return ctx.body = failed('活动不存在或已开奖')
  }

  winner_list = await Report.findAll({
    where: {
      activite_id: activite_id,
      invalid: 0,
      is_winner: 1,
      activite_type: 2
    }
  }) //查询中奖者信息

  if (!winner_list) {
    return ctx.body = failed('中奖者不能为空')
  }

  let wins = []
  let msgs = []
  let nick_names = []

  // winners = JSON.parse(winners)

  if (winners.length == 0) {
    return ctx.body = failed('奖品不能为空')
  }


  for (let item of Object.values(winner_list)) {


    if (Object.keys(winners).includes('' + item.id)) {

      let winner = {}
      let wi = {}

      winner['prize_name'] = winners[item.id]['prize']
      winner['open_id'] = winners[item.id]['open_id']
      winner['type'] = winners[item.id]['type']
      winner['active_id'] = activite_id
      winner['activite_type'] = 2
      winner['report_id'] = item.id
      winner['manager_id'] = ctx.state.managerInfo['data']['id']
      winner['manager_name'] = ctx.state.managerInfo['data']['name']
      winner['create_time'] = moment().format('YYYY-MM-DD HH:mm:ss')
      winner['nick_name'] = item.nick_name
      winner['title'] = activite_info.title
      winner['avatar_url'] = item.avatar_url
      winner['phone'] = item.phone
      winner['expiration_day'] = moment().add(1, 'month').format('YYYY-MM-DD')
      wins.push(winner)

      wi['nick_name'] = item.nick_name
      wi['avatar_url'] = item.avatar_url
      nick_names.push(wi)

      let msg = {}
      msg['title'] = activite_info['title']
      msg['description'] = item.nick_name + '恭喜你获得' + winners[item.id]['prize']
      msg['content'] = JSON.stringify('恭喜您在“' + activite_info.title + '”中，获得“' + winners[item.id]['prize'] + '奖品”，请点击“领奖”按钮填写相关领奖信息。')
      msg['manager_id'] = ctx.state.managerInfo['data']['id']
      msg['manager_name'] = ctx.state.managerInfo['data']['name']
      msg['create_time'] = moment().format('YYYY-MM-DD HH:mm:ss')
      msg['status'] = 0 //待发布：0，已发布：1
      msg['open_id'] = item.open_id
      msg['activite_id'] = activite_info.id
      msg['activite_type'] = 2
      msg['type'] = 2
      msg['phone'] = item.phone
      msgs.push(msg)
    } else {
      return ctx.body = failed('存在未分配奖品人员')
      break
    }
  }

  console.dir(wins)

  winner_res = await Winner.bulkCreate(wins) //批量插入winner





  msgs.push({
    title: activite_info['title'],
    description: activite_info['title'] + '活动开奖通知',
    content: JSON.stringify({
      'winners': nick_names,
      'description': '请以上中奖者收到中奖通知后，于' + moment().add(1, 'month').format('YYYY年MM月DD日') + '前在“我的-中奖记录”中填写相关领奖信息，我们将尽快为您派发奖品，逾期未回复视为放弃本次活动奖品，将不再补发奖品，谢谢您的理解与支持。'
    }),
    manager_id: ctx.state.managerInfo['data']['id'],
    manager_name: ctx.state.managerInfo['data']['name'],
    create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
    status: 1, //待发布：0，已发布：1
    activite_id: activite_info.id,
    activite_type: 2,
    type: 1,
  })

  msg_res = await Msg.bulkCreate(msgs) //批量插入msg


  await activite_info.update({
    status: 2
  })

  res = await Report.update({
    activite_status: 3
  }, {
    where: {
      activite_id: activite_id,
      invalid: 0,
      activite_type: 2
    }
  })

  ctx.body = success('', '插入成功')
}






module.exports = {
  adm: {
    add,
    list,
    del,
    edit,
    lottery,
    start_end
  }
}