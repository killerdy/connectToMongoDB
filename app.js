const mongoose = require("mongoose")
const config = require('./config')
const { Schema, model } = mongoose
const koa = require('koa')
const Router = require('koa-router')
const router = new Router()
const app = new koa();
const bodyParser = require('koa-bodyparser')
const merge = require('./merge')

mongoose.connect(config.mongoDB_user_str, {
    useNewUrlParser: true,
    UseUnifiedTopology: true
})
const db = mongoose.connection;
db.once('open', function () {
    console.log("db connect success");
});

const UserSchema = Schema({
    phone: { type: String, required: true, index: { unique: true } },
    qq: { type: String, required: true },
    username: { type: String, require: true},
    password: { type: String, required: true, select: false }
})
const User = model("user_table", UserSchema);

router.post('/', async (ctx) => {
    console.log("index");
})

router.post('/regist_user', async (ctx, next) => {
    console.log("regist_user");
    // var data=ctx.request.body.username;
    const { body } = ctx.request;
    // console.log(ctx.data);
    ctx.body = await new User(body).save();
})
router.post('/queryUserByName', async (ctx) => {
    const { username } = ctx.request.body;
    console.log(username);
    ctx.body = (await User.find({ username: username }, { password: 1, _id: 0 }))[0];
})
router.delete("/user/:id", async (ctx) => {
    const { id } = ctx.params
    const user = await User.findByIdAndRemove(id)
})
router.patch("/user/:id", async (ctx) => {
    const { id } = ctx.params
    const user = await User.findByIdAndUpdate(id, ctx.request.body)
    ctx.body = user
})
router.get("/user", async (ctx) => {
    console.log('get');
    var ret = await User.find();
    console.log(ret);
    ctx.body = await User.find()
})
router.get("/user/:id", async (ctx) => {
    const { id } = ctx.request.query
    // console.log(ctx.request.query);
    // console.log(ctx.params);
    ctx.body = await User.findById(id)
})
router.post("/unity_login", async (ctx) => {
    // console.log(ctx.request.body);
    var { body } = ctx.request;

    body = merge.merge(body);
    const { phone, password } = body;
    var obj = await User.find({ phone: phone }, { _id: 0, password: 1 });
    if (obj.length == 0)
        ctx.body = "wu";
    else if (obj[0].password = password)
        ctx.body = "ok";
    else
        ctx.body = "wrong"
})
router.post("/unity_regist", async (ctx) => {
    var body = ctx.request.body;
    body = merge.merge(body);
    var arr = await User.find({ phone: body.phone }, { phone: 1, _id: 0 })
    if (arr.length > 0)
        ctx.body = "had";
    else {
        await new User(body).save();
        ctx.body = "ok";
    }
})

async function main() {
    // app.use(index())
    app.use(bodyParser())
    app.use(router.routes()).use(router.allowedMethods())
    app.listen(4001);
}

main().then(console.log("server start success"))
