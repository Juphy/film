const debug = require('debug')('koa-weapp-demo')

/**
 * 响应处理模块
 */
module.exports = async function (ctx, next) {
    try {
        // 调用下一个 middleware
        await next();
        if (ctx.body.code !== 400) {
            const p = ctx.request.params;
            if ('page' in p && 'page_size' in p) {
                const body = ctx.body['res'];
                let obj = {
                    page: {},
                    data: {}
                };
                obj.data = body['rows'];
                obj.page['count'] = body.count;
                obj.page['total'] = Math.ceil(body.count / p.page_size);
                ctx.body['res'] = obj;
            }
        }
        ctx.status = ctx.body.code;
        // 处理响应结果
        // 如果直接写入在 body 中，则不作处理
        // 如果写在 ctx.body 为空，则使用 state 作为响应

        // ctx.body = ctx.body ? ctx.body : {
        //     code: ctx.state.code !== undefined ? ctx.state.code : 0,
        //     data: ctx.state.data !== undefined ? ctx.state.data : {}
        // }
    } catch (e) {
        // catch 住全局的错误信息
        debug('Catch Error: %o', e)

        // 设置状态码为 200 - 服务端错误
        ctx.status = 500

        // 输出详细的错误信息
        ctx.body = {
            code: 500,
            msg: e && e.message ? e.message : e.toString()
        }
    }
}
