const jsonwebtoken = require('jsonwebtoken');
const { secret } = require('../config');
module.exports = async (ctx, next) => {
  let params = new Object(), method = ctx.request.method;
  let token = ctx.header.authorization;
  try {
    if (token) {
      ctx.state.managerInfo = await jsonwebtoken.decode(token.split(' ')[1], secret);
    }
  } catch (e) {
    throw (e);
  }
  switch (method) {
    case 'GET':
      params = ctx.query;
      break;
    case 'POST':
      params = ctx.request.body;
      break;
  }
  if (typeof params === 'string') {
    params = JSON.parse(params);
  }
  ctx.request['params'] = params;
  await next();
}
