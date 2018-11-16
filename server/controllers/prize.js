const { Prize } = require('../lib/model');
const { success, failed } = require('./base.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const jsonwebtoken = require('jsonwebtoken');
const { secret } = require('../config');

const add = async (ctx, next) => {
    let p = ctx.request.params;
    let { name, image, num } = p;
    const create_time = new Date(), invalid = 0;
    if (!name || !image || (num <= 0)) {
        ctx.body = failed('必填项缺省或者无效');
    } else {
        let token = ctx.header.authorization;
        let payload = await jsonwebtoken.decode(token.split(' ')[1], secret);
        let res = await Prize.create({
            name: name,
            image: image,
            manager_id: payload['data']['id'],
            manager_name: payload['data']['name'],
            num: num,
            create_time: create_time,
            invalid: invalid
        });
        ctx.body = success(res, '添加成功');
    }
}

const list = async (ctx, next) => {
    let p = ctx.request.params;
    let { name = '', manager_name = '', page = 1, page_size = 10 } = p;
    p['page'] = page;
    p['page_size'] = page_size;
    let res = await Prize.findAndCountAll({
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
    if (!id) {
        ctx.body = failed('id无效或者缺省');
    } else {
        let res = await Prize.findById(id)
        if (res) {
            if (res.invalid !== 0) {
                ctx.body = failed('已删除');
            } else {
                res = res.update({ invalid: id })
                ctx.body = success(res, '删除成功');
            }
        } else {
            ctx.body = failed('id无效或者缺省');
        }
    }
}

const edit = async (ctx, next) => {
    let p = ctx.request.params;
    let { id, name, image, num } = p;
    if (!name || !image || Number(num) <= 0 || !id) {
        ctx.body = failed('必填项缺省或者无效');
    } else {
        let res = await Prize.findById(id);
        if (res) {
            res = res.update(p);
            ctx.body = success(res, '编辑成功');
        } else {
            ctx.body = failed('id无效或者缺省');
        }
    }
}

const info = async (ctx, next) => {
    let p = ctx.request.params;
    let { id } = p;
    if (!id) {
        ctx.body = failed('id无效或者缺省');
    } else {
        let res = await Prize.findById(id);
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
        info
    }
}