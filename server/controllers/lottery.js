const { Lottery } = require('../lib/model');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { success, failed } = require('./base.js');
const moment = require('moment');

// 添加活动
const add = async (ctx, next) => {
    const p = ctx.request.params;
    const { title, start_day, end_day, description, rule_descrption, prize_descrption, other_descrption = [] } = p;
    if (!title || !start_day || !end_day || !description || !rule_descrption || !prize_descrption) {
        ctx.body = failed('必填项缺省或者无效')
    } else {
        if (moment().format('YYYY-MM-DD') > moment(start_day).format('YYYY-MM-DD')) {
            ctx.body = failed('活动的开始日期不得小于当前日期')
        } else {
            p['manager_id'] = ctx.state_managerInfo['data']['id'];
            p['manager_name'] = ctx.state.managerInfo['data']['name'];
            p['status'] = 0;
            p['invalid'] = 0;
            p['create_time'] = new Date();
            p['other_description'] = other_descrption;
            let res = await Lottery.create(p);
            ctx.body = success(res, '创建成功');
        }
    }
}

// 活动列表
const list = async (ctx, next) => {
    let p = ctx.request.params;
    let { title, page = 1, page_size = 10 } = p;
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
const del = async (ctx, next) => {
    let { id } = ctx.request.params;
    if (!id) {
        ctx.body = failed('id缺省或者无效');
    } else {
        let res = await Lottery.findById(id);
        if (res) {
            if (res.invalid !== 0) {
                ctx.body = failed('已删除');
            } else {
                res = await res.update({ invalid: id });
                ctx.body = success(res, '删除成功');
            }
        } else {
            ctx.body = failed('id无效')
        }
    }
}

// 编辑活动
const edit = async (ctx, next) => {
    let p = ctx.request.params;
    let { id, title, start_day, end_day, description, rule_descrption, prize_descrption, other_description = null } = p;
    if (!title || !id || !start_day || !end_day || !description || !rule_descrption || !prize_descrption) {
        ctx.body = failed('必填项缺省或者缺省');
    } else {
        let res = await Lottery.findById('id');
        if (res) {
            if (res['status'] > 0) {
                ctx.body = failed('活动已开始，无法编辑');
            } else {
                if (moment().format('YYYY-MM-DD') > moment(start_day).format('YYYY-MM-DD')) {
                    ctx.body = failed('活动开始日期不得小于当前日期');
                } else {
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
const start_end = async (ctx, next) => {
    let { id, status } = ctx.request.params;
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
            return ctx.body = failed('活动已结束')
        }
    }
    if (status === 1 && (moment(res.end_day).format('YYYY-MM-DD') < moment().format('YYYY-MM-DD'))) {
        return ctx.body = failed('活动的结束时间不得小于当前时间')
    }
    res = res.update({ status: status });
    let j = ['', '活动发布成功', '活动结束成功'];
    ctx.body = success(res, j[status]);
}

// 活动开奖 
const lottery = async (ctx, next) => {
    let { winners, lottery_id } = ctx.request.params;
    if (!winners || !lottery_id) {
        return ctx.body = failed('参数错误');
    }
}

module.exports = {
    pub: {
        add,
        list,
        del,
        edit,
        lottery
    }
}