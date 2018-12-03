const {
  Activity,
  Movie,
  Cinema,
  Winner,
  Report,
  Msg
} = require('../lib/model');
const {
  success,
  failed,
  authFailed
} = require('./base.js');
const Sequelize = require('sequelize');
const moment = require('moment');

const {
  sendSMS
} = require('../lib/sendSms.js')


const {
  sequelize
} = require('../lib/mysql.js')
const Op = Sequelize.Op;

const Redis = require('ioredis');
const redis = new Redis();
//同步影片数据
const sync_movie = async(ctx, next) => {
  const {
    movie_id,
    movie_name,
    show_day,
    playbills
  } = ctx.request.params;

  if (!movie_id || !movie_name || !show_day || !playbills) {
    return ctx.body = failed('必填项缺省或者无效');
  }

  res = await Movie.findOne({
    where: {
      movie_id: movie_id
    }
  }).then(function(obj) {
    if (obj) {
      return obj.update({
        movie_id: movie_id,
        movie_name: movie_name,
        show_day: show_day,
        playbills: playbills
      })
    } else {
      return Movie.create({
        movie_id: movie_id,
        movie_name: movie_name,
        show_day: show_day,
        playbills: playbills
      })
    }
  })

  ctx.body = success(res, '同步成功');


}

//缓存影院数据
const cache_cinema_info = async(ctx, next) => {


  cinemas = await Cinema.findAll({
    where: {
      longitude: {
        $ne: null
      },
      latitude: {
        $ne: null
      },
      hash_code: {
        $ne: null
      },
      name: {
        $ne: null
      }
    }
  })

  mcinemas = []
  geos = []

  cinemas.forEach(async function(val) {
    mcinemas.push(val.hash_code)
    mcinemas.push(JSON.stringify(val))

    geos.push(val.longitude)
    geos.push(val.latitude)
    geos.push(val.hash_code)
  })

  await redis.flushall()
  await redis.mset(mcinemas)
  await redis.geoadd('cinemas', geos)


  ctx.body = success('', '缓存成功')
}

//同步影院信息后刷编码，需多次执行
const mix_cinema_code = async(ctx, next) => {

  cinemas = await sequelize.query("select * from applet_cinemas where length(`hash_code`) =8", {
    type: Sequelize.QueryTypes.SELECT
  }).then(function(res) {
    res.forEach(function(cinema) {
      cinema.update({
        hash_code: require('crypto').createHash('md5').update(cinema.hash_code + 'huayingjuhe', 'utf8').digest('base64')
      })
    })
  })

  ctx.body = success('', '加密成功')
}

//获取最近的影院列表
const nearby_cinemas = async(ctx, next) => {
  const {
    longitude,
    latitude,
    num = 10
  } = ctx.request.params;

  res = []
  cinema_codes = await redis.georadius('cinemas', longitude, latitude, 50, 'km', 'count', num)

  cinema_list = await redis.mget(cinema_codes)

  cinemas = []

  cinema_list.forEach(function(val) {
    cinemas.push(JSON.parse(val))
  })

  ctx.body = success(cinemas, '查询成功')
}

//搜索影院
const search_cineams = async(ctx, next) => {

  const {
    city_code = null,
      name,
      num = 10
  } = ctx.request.params;

  if (!name) {
    return ctx.body = failed('参数错误')
  }
  const we = {}
  if (city_code) {
    we['city'] = city_code
  }
  we['name'] = {
    $like: '%' + name + '%'
  }



  cinemas = await Cinema.findAll({
    where: we,
    limit: parseInt(num)
  })

  return ctx.body = success(cinemas, '查询成功')
}

// 搜索影片
const search_movie = async(ctx, next) => {
  let p = ctx.request.params;
  let {
    movie_name
  } = p;
  if (!movie_name) {
    ctx.body = failed('必填项缺省或者无效')
  } else {
    let res = await Movie.findAll({
      where: {
        movie_name: {
          [Op.like]: '%' + movie_name + '%'
        }
      },
      order: [
        ['show_day', 'DESC']
      ]
    });
    ctx.body = success(res);
  }
}

// 添加活动
const add = async(ctx, next) => {
  const p = ctx.request.params;
  const {
    title,
    playbill,
    movie_id,
    movie_name,
    start_day,
    end_day,
    description,
    prize_description,
    other_description = []
  } = p;
  if (!title || !playbill || !movie_id || !movie_name || !start_day || !end_day || !description || !prize_description) {
    ctx.body = failed('必填项缺省或者无效');
  } else {
    if (moment(start_day) < moment().format('YYYY-MM-DD')) {
      ctx.body = failed('活动的开始日期不得小于当前日期')
    } else {
      p['manager_id'] = ctx.state.managerInfo['data']['id'];
      p['manager_name'] = ctx.state.managerInfo['data']['name'];
      p['status'] = 0;
      p['invalid'] = 0;
      p['create_time'] = new Date();
      p['other_description'] = other_description;
      let res = await Activity.create(p);
      ctx.body = success(res, '创建成功');
    }
  }
}

//小程序活动列表
const app_list = async(ctx, next) => {
  let p = ctx.request.params;
  let {
    name = '',
      page = 1,
      page_size = 10
  } = p;
  p['page'] = page;
  p['page_size'] = page_size;
  let we = {
    invalid: 0,
    status: {
      $in: [1, 2, 3]
    },
    start_day: {
      $lte: moment().format('YYYY-MM-DD')
    }
  };

  if (name) {
    we[Op.or] = {
      title: {
        $like: '%' + name + '%'
      },
      movie_name: {
        $like: '%' + name + '%'
      }
    }
  }




  let res = await Activity.findAndCountAll({
    where: we,
    order: [
      ['status', 'ASC'],
      ['start_day', 'DESC'],
    ],
    offset: (page - 1) * page_size,
    limit: page_size * 1
  });
  ctx.body = success(res, '查询成功');
}

// 后台活动列表
const list = async(ctx, next) => {
  let p = ctx.request.params;
  let {
    status = '',
      title = '', movie_name = '', start_day, end_day, page = 1, page_size = 10
  } = p;
  p['page'] = page;
  p['page_size'] = page_size;
  let we = {
    invalid: 0,
    title: {
      [Op.like]: '%' + title + '%'
    },
    movie_name: {
      [Op.like]: '%' + movie_name + '%'
    }
  };
  if (status !== '') {
    we['status'] = status;
  }
  if (start_day) {
    we['start_day'] = {
      [Op.gte]: new Date(start_day)
    }
  }
  if (end_day) {
    we['end_day'] = {
      [Op.lte]: new Date(end_day)
    }
  }
  let res = await Activity.findAndCountAll({
    where: we,
    order: [
      ['create_time', 'DESC']
    ],
    offset: (page - 1) * page_size,
    limit: page_size * 1
  });
  ctx.body = success(res);
}

const del = async(ctx, next) => {
  let p = ctx.request.params;
  let {
    id
  } = p;
  if (!id) {
    ctx.body = failed('id无效或者缺省');
  } else {
    let res = await Activity.findById(id);
    if (res) {
      if (res.invalid !== 0) {
        ctx.body = failed('已删除');
      } else if (res.status === 1) {
        ctx.body = failed('活动已开始，无法删除');
      } else {
        res = res.update({
          invalid: id
        });
        ctx.body = success(res, '删除成功');
      }
    } else {
      ctx.body = failed('id无效或者缺省')
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
    movie_id,
    movie_name,
    start_day,
    end_day,
    description,
    prize_description,
    other_description = ''
  } = p;
  if (!title || !playbill || !movie_id || !movie_name || !start_day || !end_day || !description || !prize_description) {
    ctx.body = failed('必填项缺省或者无效');
  } else {
    let res = await Activity.findById(id)
    if (res) {
      if (res['status'] === 1) {
        ctx.body = failed('活动已开始，无法编辑');
      } else {
        p['manager_id'] = ctx.state.managerInfo['data']['id'];
        p['manager_name'] = ctx.state.managerInfo['data']['name'];
        res = res.update(p);
        ctx.body = success(res, '编辑成功');
      }
    } else {
      ctx.body = failed('id无效或者缺省');
    }
  }
}

// 发布活动
const start_end = async(ctx, next) => {
  let p = ctx.request.params;
  let {
    id,
    status
  } = p;
  if (!(status == 1 || status == 3) || !id) {
    ctx.body = failed('必填项缺省或者无效');
  } else {
    let res = await Activity.findById(id);
    if (res) {
      if (res.status === 2) {
        ctx.body = failed('活动已结束');
      }
      if (res.status === status) {
        if (status === 1) {
          ctx.body = failed('活动已开始');
        }
        if (status === 3) {
          ctx.body = failed('活动已结束');
        }
      } else {
        if (status === 1 && (new Date(res.end_day) < new Date())) {
          ctx.body = failed('活动的结束时间不得大于当前时间')
        } else {
          res = res.update({
            status: status
          });
          let j = ['', '活动发布成功', '', '活动结束成功'];
          ctx.body = success(res, j[status]);
        }
      }
    } else {
      ctx.body = failed('id无效或者缺省');
    }
  }
}

//小程序活动详情
const app_info = async(ctx, next) => {

  if (!ctx.state.$wxInfo.loginState) {
    return ctx.body = authFailed()
  }
  let {
    id
  } = ctx.request.params;
  if (!id) {
    return ctx.body = failed('参数缺失');
  }

  let activite_info = await Activity.findById(id);


  if (!activite_info) {
    return ctx.body = failed('id无效或者缺省');
  }

  let winners = []

  if (activite_info.status == 2) {

    winners = await Winner.findAll({
      where: {
        active_id: activite_info.id,
        invalid: 0
      }
    })
  }

  ctx.body = success({
    'activite_info': activite_info,
    'winners': winners
  })


}

//活动开奖
const lottery = async(ctx, next) => {
  let {
    winners,
    activite_id
  } = ctx.request.params;

  if (!winners || !activite_id) {
    return ctx.body = failed('参数错误')
  }

  activite_info = await Activity.find({
    where: {
      id: activite_id,
      invalid: 0,
      status: {
        $in: [1, 3]
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
      is_winner: 1
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

      winner['prize_name'] = winners[item.id]['prize']
      winner['open_id'] = winners[item.id]['open_id']
      winner['type'] = winners[item.id]['type']
      winner['active_id'] = activite_id
      winner['report_id'] = item.id
      winner['manager_id'] = ctx.state.managerInfo['data']['id']
      winner['manager_name'] = ctx.state.managerInfo['data']['name']
      winner['create_time'] = moment().format('YYYY-MM-DD HH:mm:ss')
      winner['nick_name'] = item.nick_name
      winner['title'] = activite_info.title
      winner['movie_id'] = activite_info.movie_id
      winner['movie_name'] = activite_info.movie_name
      winner['avatar_url'] = item.avatar_url
      winner['phone'] = item.phone
      winner['expiration_day'] = moment().add(1, 'month').format('YYYY-MM-DD')
      wins.push(winner)
      nick_names.push(item.nick_name)

      let msg = {}
      msg['title'] = activite_info['title']
      msg['description'] = item.nick_name + '恭喜你获得' + winners[item.id]['prize']
      msg['content'] = '恭喜您在“' + activite_info.title + '”中，获得“' + winners[item.id]['prize'] + '奖品”，请点击“领奖”按钮填写相关领奖信息。'
      msg['manager_id'] = ctx.state.managerInfo['data']['id']
      msg['manager_name'] = ctx.state.managerInfo['data']['name']
      msg['create_time'] = moment().format('YYYY-MM-DD HH:mm:ss')
      msg['status'] = 0 //待发布：0，已发布：1
      msg['open_id'] = item.open_id
      msg['activite_id'] = activite_info.id
      msg['movie_id'] = activite_info.movie_id
      msg['movie_name'] = activite_info.movie_name
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
    content: '中奖名单：【' + nick_names.join(',') + '】请以上中奖者收到中奖通知后，于' + moment().add(1, 'month').format('YYYY年MM月DD日') + '前在“我的-中奖记录”中填写相关领奖信息，我们将尽快为您派发奖品，逾期未回复视为放弃本次活动奖品，将不再补发奖品，谢谢您的理解与支持。',
    manager_id: ctx.state.managerInfo['data']['id'],
    manager_name: ctx.state.managerInfo['data']['name'],
    create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
    status: 1, //待发布：0，已发布：1
    activite_id: activite_info.id,
    movie_id: activite_info.movie_id,
    movie_name: activite_info.movie_name,
    type: 1,
  })

  msg_res = await Msg.bulkCreate(msgs) //批量插入msg


  await activite_info.update({
    status: 2
  })

  ctx.body = success('', '插入成功')


}



// 活动详细
const info = async(ctx, next) => {
  let p = ctx.request.params;
  let {
    id
  } = p;
  if (!id) {
    ctx.body = failed('id无效或者缺省');
  } else {
    let res = await Activity.findById(id);
    if (res) {
      ctx.body = success(res);
    } else {
      ctx.body = failed('id无效或者缺省');
    }
  }
}

// image->base64
const image_base64 = async(ctx, next) => {
  let p = ctx.request.params;
  let {
    url
  } = p;
  let http = require('http');
  if (url.includes('https')) {
    http = require('https');
  }
  let base64 = await new Promise((resolve, reject) => {
    http.get(url, function(res) {
      var chunks = [];
      var size = 0;　　 //保存缓冲数据的总长度
      res.on('data', function(chunk) {
        chunks.push(chunk);　 //在进行网络请求时，会不断接收到数据(数据不是一次性获取到的)，
        size += chunk.length;　　 //累加缓冲数据的长度
      });
      res.on('end', function(err) {
        var data = Buffer.concat(chunks, size);
        console.log(Buffer.isBuffer(data));　　　　 //可通过Buffer.isBuffer()方法判断变量是否为一个Buffer对象
        var base64Img = data.toString('base64');　　 //将Buffer对象转换为字符串并以base64编码格式显示
        console.log(base64Img);
        resolve(base64Img);　　 //进入终端terminal,然后进入index.js所在的目录，　
      });
    });
  });
  ctx.body = success('data:image/jpeg;base64,' + base64);
}

module.exports = {
  adm: {
    add,
    list,
    del,
    edit,
    info,
    start_end,
    lottery,
    search_movie,
    image_base64
  },
  pub: {
    sync_movie,
    mix_cinema_code,
    cache_cinema_info,
    nearby_cinemas,
    search_cineams,
    app_list
  },
  app: {
    app_info
  }
};