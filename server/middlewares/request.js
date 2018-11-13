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
  if (typeof params === 'string') {
    params = JSON.parse(params);
  }
  ctx.request['params'] = params;
  await next();
}
