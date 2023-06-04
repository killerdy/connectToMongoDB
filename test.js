const Koa = require('koa')
const app = new Koa()
const indent = (n) => new Array(n).join(' ')
const mid1 = () => async (ctx, next) => {
  ctx.body = `<h3>请求 => 第一层中间件</h3>`
  await next()
  ctx.body += `<h3>响应 <= 第一层中间件</h3>`
}
const mid2 = () => async (ctx, next) => {
  ctx.body += `<h3>${indent(4)}请求 => 第二层中间件</h3>`
  await next()
  ctx.body += `<h3>${indent(4)}响应 <= 第二层中间件</h3>`
} 
app.use(mid1())
app.use(mid2())
app.use(async (ctx, next) => {
  ctx.body += `<p style="color: #f60">${indent(12)}=> Koa 核心 处理业务 <=</p>`
})
app.listen(2333)