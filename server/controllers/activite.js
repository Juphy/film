const {
  Activity,
  Movie,
  Cinema,
  Winner,
  Report
} = require('../lib/model');
const {
  success,
  failed
} = require('./base.js');
const Sequelize = require('sequelize');

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

  await new Promise(function(resolve) {
    setTimeout(function() {
      cinemas.forEach(function(val) {
        redis.set(val.hash_code, JSON.stringify(val))
        redis.geoadd('cinemas', val.longitude, val.latitude, val.id + '_' + val.hash_code + '_' + val.name)
      }, 60 * 1000)
      resolve()
    })

  })


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
  cinemas = await redis.georadius('cinemas', longitude, latitude, 50, 'km', 'count', num)
  cinemas.forEach(function(val) {
    arr = val.split('_')

    res.push({
      'id': parseInt(arr[0]),
      'hash_code': arr[1],
      'name': arr[2]
    })
  })
  ctx.body = success(res, '查询成功')
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
    limit: num
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
    p['manager_id'] = ctx.state.managerInfo['data']['id'];
    p['manager_name'] = ctx.state.managerInfo['data']['name'];
    p['status'] = 0;
    p['invalid'] = 0;
    p['create_time'] = new Date();
    let res = await Activity.create(p);
    ctx.body = success(res, '创建成功');
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
      $in: [1, 2]
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
      ['create_time', 'DESC'],
      ['start_day', 'DESC'],
      ['status', 'ASC']
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
      } else {
        res = res.update({
          invalid: id
        });
        ctx.body = sucess(res, '删除成功');
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
    other_description = []
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

// 开始和结束活动
const start_end = async(ctx, next) => {
  let p = ctx.request.params;
  let {
    id,
    status
  } = p;
  if (!(status == 1 || status == 2) || !id) {
    ctx.body = failed('必填项缺省或者无效');
  } else {
    let res = await Activity.findById(id);
    if (res) {
      const o = [, 0, 1],
        b = ['未开始', '已开始', '已结束'];
      if (res.status !== o[status]) {
        ctx.body = failed(b[res.status]);
      } else {
        res = res.update({
          status: status
        });
        let j = ['', '开始成功', '结束成功'];
        ctx.body = success(res, j[status]);
      }
    } else {
      ctx.body = failed('id无效或者缺省');
    }
  }
}

//小程序活动详情
const app_info = async(ctx, next) => {
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

  activite_info = await Activity.findById(activite_id, {
    invalid: 0,
    status: 1
  }) //查询活动信息

  if (!activite_info) {
    return ctx.body = failed('活动不存在或已开奖')
  }

  winners = await Report.findAll({
    where: {
      activite_id: activite_id,
      invalid: 0
    }
  }) //查询中奖者信息

  

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

module.exports = {
  adm: {
    add,
    list,
    del,
    edit,
    info,
    start_end
  },
  pub: {
    sync_movie,
    mix_cinema_code,
    cache_cinema_info,
    nearby_cinemas,
    search_cineams,
    search_movie,
    app_list,
    app_info
  }
};