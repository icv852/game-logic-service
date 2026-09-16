import Router from "@koa/router"
import testRouter from "./test.js"

const router = new Router()
router.use(testRouter.routes(), testRouter.allowedMethods())

export default router