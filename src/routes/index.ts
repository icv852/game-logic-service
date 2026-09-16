import Router from "@koa/router"
import testRouter from "./test.js"
import ticTacToeRouter from "./tic-tac-toe.js"

const router = new Router()
router.use(testRouter.routes(), testRouter.allowedMethods())
router.use(ticTacToeRouter.routes(), ticTacToeRouter.allowedMethods())

export default router