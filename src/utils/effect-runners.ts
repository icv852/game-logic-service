import { Cause, Effect, Option, pipe, Schema } from "effect";
import type { Context } from "koa";
import HttpStatusCode from "../constants/http-status-code.js";
import { isAppError, InvalidInputError } from "./errors.js";
import logger from "./logger.js";

const setErrorResponse = (ctx: Context, status: number, errorCode: string, message: string) => {
    ctx.status = status
    ctx.body = { error: { error_code: errorCode, message } }
}

export const handleHttpRequest = async <A, E, B>(
    ctx: Context,
    requestBody: unknown,
    inputSchema: Schema.Codec<A, unknown>,
    handler: (validatedData: A) => Effect.Effect<B, E>,
    outputSchema: Schema.Codec<B, unknown>
): Promise<void> => {
    const program = pipe(
        Schema.decodeUnknownEffect(inputSchema)(requestBody),
        Effect.mapError((issue) => new InvalidInputError({ message: issue.message })),
        Effect.flatMap(handler),
        Effect.flatMap((data) => outputSchema
            ? Schema.encodeUnknownEffect(outputSchema)(data)
            : Effect.succeed(data)
        ),
        Effect.matchCause({
            onSuccess: (body) => {
                ctx.status = HttpStatusCode.OK
                ctx.body = body
                logger.info(`${ctx.status} ${ctx.request.method} ${ctx.request.path}. ${JSON.stringify(ctx.body)}`)
            },
            onFailure: (cause) => {
                const failure = Cause.findErrorOption(cause)

                // handle defect
                if (Option.isNone(failure)) {
                    setErrorResponse(ctx, HttpStatusCode.INTERNAL_SERVER_ERROR, "INTERNAL_SERVER_ERROR", "Internal server error.")
                    logger.error(`${ctx.status} ${ctx.request.method} ${ctx.request.path}. DEFECT:\n${Cause.pretty(cause)}`)
                    return
                }

                const error = failure.value
                if (isAppError(error)) {
                    const message = error.message ?? "Request failed."
                    setErrorResponse(ctx, error.httpStatusCode, error._tag, message)
                    logger.error(`${ctx.status} ${ctx.request.method} ${ctx.request.path}. ${error._tag}: ${message}`)
                    return
                }

                const message = error instanceof Error ? error.message : String(error)
                setErrorResponse(ctx, HttpStatusCode.INTERNAL_SERVER_ERROR, "INTERNAL_SERVER_ERROR", "Internal server error.")
                logger.error(`${ctx.status} ${ctx.request.method} ${ctx.request.path}. UNKNOWN_ERROR: ${message}`)
            },
        })
    )

    await Effect.runPromise(program)
}
