const {
  Activity,
  Movie
} = require('../lib/model');
const {
  success,
  failed
} = require('./base.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

//同步影片数据
const sync_movie = async (ctx, next) => {
  const {
    movie_id,
    movie_name,
    show_day,
    playbills
  } = ctx.request.params;

  if (!movie_id || !movie_name || !show_day || !playbills) {
    return ctx.body = failed('必填项缺省或者无效');
  }

  res = await Movie.findOrCreate({
    where: {
      movie_id: movie_id
    },
    defaults: {
      movie_id: movie_id,
      movie_name: movie_name,
      show_day: show_day,
      playbills: playbills
    }
  })

  ctx.body = success(res, '同步成功');
}

const search_movie = async (ctx, next) => {
  let p = ctx.request.params;
  let { movie_name } = p;
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

const add = async (ctx, next) => {
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
    other_description = [],
    manager_id: manager_id,
    manager_name: manager_name
  } = p;
  if (!title || !playbill || !movie_id || !movie_name || !start_day || !end_day || !description || !prize_description || !manager_id || !manager_name) {
    ctx.body = failed('必填项缺省或者无效');
  } else {
    let res = await Activity.create({
      title: title,
      playbill: playbill,
      movie_id: movie_id,
      movie_name: movie_name,
      start_day: start_day,
      end_day: end_day,
      description: description,
      prize_description: prize_description,
      other_description: other_description,
      manager_id: manager_id,
      manager_name: manager_name,
      status: 0,
      invalid: 0
    });
    ctx.body = success(res, '创建成功');
  }
}

const list = async (ctx, next) => {
  let p = ctx.request.params;
  let {
    title = '', movie_name = '', start_day, end_day, page = 1, page_size = 10
  } = p;
  p['page'] = page;
  p['page_size'] = page_size;
  let res = await Activity.findAndCountAll({
    where: {
      invalid: 0,
      title: {
        [Op.like]: '%' + title + '%'
      },
      movie_name: {
        [Op.like]: '%' + movie_name + '%'
      },
      start_day: {
        [Op.gte]: new Date(start_day)
      },
      end_day: {
        [Op.lte]: new Date(end_day)
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

const del = async (ctx, next) => {
  let p = ctx.request.params;
  let {
    id
  } = p;
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

const edit = async (ctx, next) => {
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
      res = res.update(p);
      ctx.body = success(res, '编辑成功');
    } else {
      ctx.body = failed('id无效或者缺省');
    }
  }
}

const start_end = async (ctx, next) => {
  let p = ctx.request.params;
  let {
    id,
    status
  } = p;
  if (status !== 1 || status !== 2) {
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

const info = async (ctx, next) => {
  let p = ctx.request.params;
  let {
    id
  } = p;
  let res = await Activity.findById(id);
  if (res) {
    ctx.body = success(res);
  } else {
    ctx.body = failed('id无效或者缺省');
  }
}

module.exports = {
  pub: {
    add,
    list,
    del,
    edit,
    info,
    start_end,
    sync_movie,
    search_movie
  }
};