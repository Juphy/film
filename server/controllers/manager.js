const { manager } = require('../lib/model');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { success, failed } = require('./base.js');
// 添加管理员
const add = async (ctx, next) => {
    const { name, nick_name, phone, password } = ctx.request.params;
    const createTime = new Date(), invalid = 0;
    res = await manager.create(
        {
            name: name,
            nickName: nick_name,
            phone: phone,
            password: password,
            createTime: create_time,
            invalid: invalid
        });
    ctx.body = res;
};
// 管理员列表
const list = async (ctx, next) => {
    let res;
    let p = ctx.request.params;
    let { name = '', nick_name = '', page = 1, page_size = 3 } = p;
    p['page'] = page;
    p['page_size'] = page_size;
    res = await manager.findAndCountAll({
        where: {
            invalid: 0,
            name: {
                [Op.like]: '%' + name + '%'
            }
        },
        order: ['create_time'],
        offset: (page - 1) * page_size,
        limit: page_size * 1
    });
    ctx.body = success(res);
};

// 删除管理员
const del = async (ctx, next) => {

};

// 编辑管理员
const edit = async (ctx) => {

};

// 查询管理员信息
const info = async (ctx) => {
    const p = ctx.request.params;
    ctx.body = await manager.findById(p.id);
};

module.exports = {
    add,
    list,
    del,
    edit,
    info
};
