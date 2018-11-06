module.exports = async (ctx, next) => {
  let params = new Object(), method = ctx.request.method;
  switch (method) {
    case 'GET':
      params = ctx.query;
      break;
    case 'POST':
      params = ctx.request.body;
      break;
  }
  ctx.body.code = 200;
  ctx.request['params'] = params;
  await next();
}
