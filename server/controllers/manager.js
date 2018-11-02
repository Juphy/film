const { manager } = require('../lib/model');
// 添加管理员
const add = async (ctx, next) => {
  const p=ctx.request.params;
  res = await manager.create({name: '温泉', nickName: 'wenquan', phone: 123123});
  ctx.body=res;
};
// 管理员列表
const list = async (ctx, next) => {
  let res;
  const params = ctx.request.params;
  res = await manager.findById(1);
  ctx.body = res;
};

// 删除管理员
const del = async (ctx, next) => {

};

// 编辑管理员
const edit = async (ctx) => {

};

// 登录
const login = async (ctx) => {

};

module.exports = {
  add,
  list,
  del,
  edit,
  login
};
