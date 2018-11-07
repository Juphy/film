const { manager } = require('../lib/model');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { success, failed } = require('./base.js');
// 添加管理员
const add = async (ctx, next) => {
    const { name, nick_name = '', phone = null, password, account } = ctx.request.params;
    const create_time = new Date(), invalid = 0;
    if (!name || !account || !password) {
        ctx.body = failed('缺少必填项');
    } else {
        let res = await manager.create(
            {
                name: name,
                nick_name: nick_name,
                phone: phone,
                password: password,
                create_time: create_time,
                invalid: invalid,
                account: account
            });
        ctx.body = success(res, '添加成功');
    }
};
// 管理员列表
const list = async (ctx, next) => {
    await next();
    let p = ctx.request.params;
    let { name = '', page = 1, page_size = 3 } = p;
    p['page'] = page;
    p['page_size'] = page_size;
    let res = await manager.findAndCountAll({
        where: {
            invalid: 0,
            name: {
                [Op.like]: '%' + name + '%'
            }
        },
        order: [['create_time', 'DESC']], // DESC 降  ASC升
        offset: (page - 1) * page_size,
        limit: page_size * 1
    });
    ctx.body = success(res);
};

// 删除管理员
const del = async (ctx, next) => {
    let p = ctx.request.params;
    let { id } = p;
    await manager.findById(id).then(res => {
        if (res) {
            if (res.invalid !== 0) {
                ctx.body = failed('已删除');
            } else {
                res = manager.update({ invalid: id }, {
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
};

// 编辑管理员
const edit = async (ctx, next) => {
    let p = ctx.request.params;
    let { id } = p;
    await manager.findById(id).then(res => {
        if (res) {
            res = manager.update(p, {
                where: {
                    id: id
                }
            });
            ctx.body = success(res, '编辑成功');
        } else {
            ctx.body = failed('id无效');
        }
    });
};

// 查询管理员信息
const info = async (ctx, next) => {
    const p = ctx.request.params;
    let { id } = p;
    await manager.findById(id).then(res => {
        if (res) {
            ctx.body = success(res);
        } else {
            ctx.body = failed('id无效');
        }
    });
};

// const update = async (ctx, next) => {
//     // let res = await manager.findAll();
//     // res.forEach(item => {
//     //     manager.update({
//     //         account: item.nick_name
//     //     }, {
//     //             where: {
//     //                 id: item.id
//     //             }
//     //         })
//     // });
//     manager.update({ password: 12345678 }, {
//         where: {
//             invalid: 0
//         }
//     })
//     ctx.body = success('更新数据', '更新成功');
// }

module.exports = {
    add,
    list,
    del,
    edit,
    info
};
