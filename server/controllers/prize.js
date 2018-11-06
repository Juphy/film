const { prize } = require('../lib/model');
const { success, failed } = require('./base.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const add = async(ctx, next) => {
    let p = ctx.request.params;
    let { name, image, manager_id, manager_name, num } = p;
    const create_time = new Date(), invalid = 0;
    let res = await manager_id.create({
        name: name,
        image: image,
        manager_id: manager_id,
        manager_name: manager_name,
        num: num,
        create_time: create_time,
        invalid: invalid
    })
}