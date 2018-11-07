const { prize } = require('../lib/model');
const { success, failed } = require('./base.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const add = async (ctx, next) => {
    let p = ctx.request.params;
    let { name, image, manager_id, manager_name, num } = p;
    const create_time = new Date(), invalid = 0;
    if (!name || !image || (num <= 0)) {
        ctx.body = failed('缺少必填项');
    } else {
        let res = await prize.create({
            name: name,
            image: image,
            manager_id: manager_id,
            manager_name: manager_name,
            num: num,
            create_time: create_time,
            invalid: invalid
        });
        ctx.body = success(res, '添加成功');
    }
}

const list = async (ctx, next) => {
    let p = ctx.request.params;
    let { name = '', manager_name = '', page = 1, page_size = 3 } = p;
    p['page'] = page;
    p['page_size'] = page_size;
    let res = await prize.findAndCountAll({
        where: {
            invalid: 0,
            name: {
                [Op.like]: '%' + name + '%'
            },
            manager_name: {
                [Op.like]: '%' + manager_name + '%'
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
    await prize.findById(id).then(res => {
        if (res) {
            if (res.invalid !== 0) {
                ctx.body = failed('已删除');
            } else {
                res = prize.update({ invalid: id }, {
                    where: {
                        id: id
                    }
                })
                ctx.body = success(res, '删除成功');
            }
        } else {
            ctx.body = failed('id无效');
        }
    });
}

const edit = async (ctx, next) => {
    let p = ctx.request.params;
    let { id } = p;
    await prize.findById(id).then(res => {
        if (res) {
            res = prize.update(p, {
                where: {
                    id: id
                }
            });
            ctx.body = success(res, '编辑成功');
        } else {
            ctx.body = failed('id无效');
        }
    });
}

const info = async (ctx, next) => {
    let p = ctx.request.params;
    let { id } = p;
    await manager.findById(id).then(res => {
        if (res) {
            ctx.body = success(res);
        } else {
            ctx.body = failed('id无效');
        }
    });
}

module.exports = {
    add,
    list,
    del,
    edit,
    info
}