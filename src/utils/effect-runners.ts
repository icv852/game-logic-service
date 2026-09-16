import { Effect, pipe } from "effect";
import type { Context } from "koa";
import HttpStatusCode from "../constants/http-status-code.js";
import { CustomError } from "./errors.js";
import { ZodObject } from "zod";
import logger from "./logger.js";
import { validateByZodSchema } from "./validator.js";

export const handleHttpRequest = async (
    ctx: Context,
    requestBody: unknown,
    schema: ZodObject<any>,
    handler: (validatedData: any) => Effect.Effect<any, any>,
    encode?: (data: any) => unknown
) => {
    const program = pipe(
        Effect.succeed(requestBody),
        Effect.flatMap(validateByZodSchema(schema)),
        Effect.flatMap(handler),
        Effect.match({
            onSuccess: (data) => {
                ctx.status = HttpStatusCode.OK
                ctx.body = encode ? encode(data) : { ...data }
                logger.info(`${ctx.status} ${ctx.request.method} ${ctx.request.path}. ${JSON.stringify(ctx.body)}`)
            },
            onFailure: (e: unknown) => {
                if (e instanceof CustomError) {
                    ctx.status = e.statusCode
                    ctx.body = { error: { error_code: e.errorCode, message: e.message } }
                    logger.error(`${ctx.status} ${ctx.request.method} ${ctx.request.path}. ${e.errorCode}: ${e.message}`)
                    return
                }
                const message = e instanceof Error ? e.message : String(e)
                ctx.status = HttpStatusCode.INTERNAL_SERVER_ERROR
                ctx.body = { error: { error_code: "INTERNAL_SERVER_ERROR", message } }
                logger.error(`${ctx.status} ${ctx.request.method} ${ctx.request.path}. UNKNOWN_ERROR: ${message}`)
            },
        })
    )

    await Effect.runPromise(program)
}