const { address } = require('../lib/model');
const { success, failed } = require('./base.js');
// 添加地址
const add = async (ctx, next) => {
    const { open_id, province, city, _address } = ctx.request.params;
    let invalid = 0;
    if (!open_id || !province || !city || !_address) {
        ctx.body = failed('必填项缺省或者无效');
    } else {
        let res = await address.create(
            {
                open_id: open_id,
                province: province,
                city: city,
                address: _address,
                invalid: 0
            }
        );
        ctx.body = success(res, '添加成功');
    }
}
// 编辑
const edit = async (ctx, next) => {
    let p = ctx.request.params;
    let { open_id, province, city, _address, id } = p;
    if (!open_id || !province || !city || !_address) {
        ctx.body = failed('必填项缺省或者无效');
    } else {
        let res = await address.findById(id);
        if (res) {
            Object.keys(p)
            res = res.update(p);
            ctx.body = success(res, '编辑成功');
        } else {
            ctx.body = failed('id无效或者缺省');
        }
    }
}

const info = async (ctx, next) => {
    const p = ctx.request.params;
    let { id } = p;
    let res = await address.findById(id);
    if (res) {
        ctx.body = success(res);
    } else {
        ctx.body = failed('id无效或者缺省');
    }
}

module.exports = {
    add,
    edit,
    info
};