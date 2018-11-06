const { activite } = require('../lib/model');
const { success, failed } = require('./base.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const add = async (ctx, next) => {
    const p = ctx.request.params;
    const { title, playbill, movie_id, movie_name, start_day, end_day, description, prize_description, other_description = {} } = p;
}

const list = async (ctx, next) => {
    let p = ctx.request.params;
}

module.exports = {

};