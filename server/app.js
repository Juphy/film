const Koa = require('koa')
const app = new Koa()
const debug = require('debug')('koa-weapp-demo')
const middlewares = require('./middlewares')
const bodyParser = require('koa-bodyparser')
const config = require('./config')
const session = require('koa-session')
const jwt = require('koa-jwt')

var cors = require('@koa/cors');

// 跨域处理
app.use(cors());

// 解析请求体
app.use(bodyParser({
  enableTypes: ['json', 'form', 'text']
}))

app.use(async (ctx, next) => {
  console.log('------ip:', ctx.headers['x-forwarded-for'] ||
    ctx.socket.remoteAddress ||
    ctx.connection.socket.remoteAddress);
  await next();
})

// 处理get和post请求参数
app.use(middlewares.request)

// 使用响应处理中间件
app.use(middlewares.response)

// session
app.keys = ['some secret hurr'];
const CONFIG = {
  key: 'token', //cookie key (default is koa:sess)
  maxAge: 86400000, // cookie的过期时间 maxAge in ms (default is 1 days)
  overwrite: true, //是否可以overwrite    (默认default true)
  httpOnly: true, //cookie是否只有服务器端可以访问 httpOnly or not (default true)
  signed: true, //签名默认true
  rolling: false, //在每次请求时强行设置cookie，这将重置cookie过期时间（默认：false）
  renew: false, //(boolean) renew session when session is nearly expired,
};
app.use(session(CONFIG, app));

// 引入路由分发
const router = require('./routes')
app.use(router.routes())





// 启动程序，监听端口
app.listen(config.port, () => debug(`listening on port ${config.port}`))