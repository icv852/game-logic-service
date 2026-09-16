import Router from "@koa/router"

const testRouter = new Router()

testRouter.get("/test", async (ctx) => {
    ctx.status = 200
    ctx.body = { message: "Test route is working." }
})

export default testRouter