import Router from "@koa/router"
import { type Context } from "koa"
import { handleHttpRequest } from "../utils/effect-runners.js"
import { ApplyMoveSchema, GameStateSchema } from "../schemas/tic-tac-toe.js"
import { applyMove } from "../games/tic-tac-toe/index.js"

const ticTacToeRouter = new Router()

ticTacToeRouter.prefix("/tic-tac-toe")

ticTacToeRouter.post("/apply-move", async (ctx: Context) => await handleHttpRequest(ctx, ctx.request.body, ApplyMoveSchema, applyMove, GameStateSchema.encode))

export default ticTacToeRouter