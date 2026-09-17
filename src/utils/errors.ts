import HTTP_STATUS_CODE from "../constants/http-status-code.js";
import { Schema } from "effect";

export type AppError = BadRequestError | InternalError | InvalidInputError | GameLogicError
export const isAppError = (error: unknown): error is AppError =>
    error instanceof BadRequestError
    || error instanceof GameLogicError
    || error instanceof InternalError
    || error instanceof InvalidInputError

export class BadRequestError extends Schema.TaggedError<BadRequestError>()("BAD_REQUEST", {
  message: Schema.optional(Schema.String)
}) {
    readonly httpStatusCode = HTTP_STATUS_CODE.BAD_REQUEST
}

export class InternalError extends Schema.TaggedError<InternalError>()("INTERNAL_SERVER_ERROR", {
  message: Schema.optional(Schema.String),
  cause: Schema.optional(Schema.Defect())
}) {
    readonly httpStatusCode = HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR
}

export class InvalidInputError extends Schema.TaggedError<InvalidInputError>()("INVALID_INPUT", {
  message: Schema.optional(Schema.String)
}) {
    readonly httpStatusCode = HTTP_STATUS_CODE.BAD_REQUEST
}

export class GameLogicError extends Schema.TaggedError<GameLogicError>()("GAME_LOGIC_ERROR", {
  message: Schema.optional(Schema.String)
}) {
    readonly httpStatusCode = HTTP_STATUS_CODE.BAD_REQUEST
}