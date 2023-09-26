const Koa = require("koa");
const Router = require("koa-router");
const { koaBody } = require("koa-body");
const bodyParser = require("koa-bodyparser");
const static = require("koa-static");
//引入模块化的子路由
const { roleRouter } = require("./role");
const { accountsRouter } = require("./account");
const path = require("path");
const app = new Koa();
const router = new Router();
const port = 3001;

//密钥
app.keys = ["this is wuhan", "fristDay"];

/*加载koa-body中间件，使得请求体中的数据可以被正确解析同时被配置到ctx.request.body中，
在后续的路由中可以通过ctx.request.body获取body参数。*/
app.use(koaBody());
app.use(bodyParser()); //对请求体进行解析
app.use(
  static(path.resolve(__dirname, "../../client/build"), {
    index: false, // 默认为true  访问的文件为index.html  可以修改为别的文件名或者false
    hidden: false, // 是否同意传输隐藏文件
    defer: true, // 如果为true，则在返回next()之后进行服务，从而允许后续中间件先进行响应
  })
);

//绑定路由
router.use("/api", roleRouter);
router.use("/api", accountsRouter);

app.use(router.routes()).use(router.allowedMethods());

app.listen(port);

console.log(`服务器已启动,当前监听端口为${port},ip为127.0.0.1`);
