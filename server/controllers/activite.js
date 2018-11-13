const { activite } = require('../lib/model');
const { success, failed } = require('./base.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const add = async (ctx, next) => {
    const p = ctx.request.params;
    const { title, playbill, movie_id, movie_name, start_day, end_day, description, prize_description, other_description = [] } = p;
    if (!title || !playbill || !movie_id || !movie_name || !start_day || !end_day || !description || !prize_description) {
        ctx.body = failed('必填项缺省或者无效');
    } else {
        let res = await activite.create({
            title: title,
            playbill: playbill,
            movie_id: movie_id,
            movie_name: movie_name,
            start_day: start_day,
            end_day: end_day,
            description: description,
            prize_description: prize_description,
            other_description: other_description
        });
        ctx.body = success(res, '创建成功');
    }
}

const list = async (ctx, next) => {
    let p = ctx.request.params;
    let { title = '', movie_name = '', start_day, end_day, page = 1, page_size = 10 } = p;
    p['page'] = page;
    p['page_size'] = page_size;
    let res = await activite.findAndCountAll({
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
        order: [['create_time', 'DESC']],
        offset: (page - 1) * page_size,
        limit: page_size * 1
    });
    ctx.body = success(res);
}

const del = async (ctx, next) => {
    let p = ctx.request.params;
    let { id } = p;
    let res = await activite.findById(id);
    if (res) {
        if (res.invalid !== 0) {
            ctx.body = failed('已删除');
        } else {
            res = res.update({ invalid: id });
            ctx.body = sucess(res, '删除成功');
        }
    } else {
        ctx.body = failed('id无效或者缺省')
    }
}

const edit = async (ctx, next) => {
    let p = ctx.request.params;
    let { id, title, playbill, movie_id, movie_name, start_day, end_day, description, prize_description, other_description = [] } = p;
    if (!title || !playbill || !movie_id || !movie_name || !start_day || !end_day || !description || !prize_description) {
        ctx.body = failed('必填项缺省或者无效');
    } else {
        let res = await activite.findById(id)
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
    let { id, status } = p;
    if (status !== 1 || status !== 2) {
        ctx.body = failed('必填项缺省或者无效');
    } else {
        let res = await activite.findById(id);
        if (res) {
            const o = [, 0, 1], b = ['未开始', '已开始', '已结束'];
            if (res.status !== o[status]) {
                ctx.body = failed(b[res.status]);
            } else {
                res = res.update({ status: status });
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
    let { id } = p;
    let res = await activite.findById(id);
    if (res) {
        ctx.body = success(res);
    } else {
        ctx.body = failed('id无效或者缺省');
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
    }
};