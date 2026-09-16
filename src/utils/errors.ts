import HttpStatusCode from "../constants/http-status-code.js";

export const formatErrorLog = (message: string, e: unknown): string => {
    if (e instanceof CustomError) {
        return `${message} ${e.name}: ${e.message}${e.details ? `\n${JSON.stringify(e.details)}` : ""}\n${e.stack}`
    } else if (e instanceof Error) {
        return `${message} ${e.name}: ${e.message}\n${e.stack}`
    } else {
        return `${message} ${e}`
    }
}

export class CustomError extends Error {
    public statusCode: HttpStatusCode
    public errorCode: string
    public details?: Record<string, any>
    
    constructor(message: string, statusCode: HttpStatusCode, errorCode: string, details?: any) {
        super(message)
        Object.setPrototypeOf(this, new.target.prototype) // restore prototype chain

        this.name = this.constructor.name
        this.statusCode = statusCode
        this.errorCode = errorCode
        this.details = details

        Error.captureStackTrace(this, this.constructor)
    }
}

export class BadRequestError extends CustomError {
    readonly _tag = "BadRequestError"

    constructor(message: string, details?: any) {
        super(message, HttpStatusCode.BAD_REQUEST, "BAD_REQUEST_ERROR", details)
    }
}

export class UnauthorizedError extends CustomError {
    readonly _tag = "UnauthorizedError"

    constructor(message: string, details?: any) {
        super(message, HttpStatusCode.UNAUTHORIZED, "UNAUTHORIZED_ERROR", details)
    }
}

export class ForbiddenError extends CustomError {
    readonly _tag = "ForbiddenError"

    constructor(message: string, details?: any) {
        super(message, HttpStatusCode.FORBIDDEN, "FORBIDDEN_ERROR", details)
    }
}

export class NotFoundError extends CustomError {
    readonly _tag = "NotFoundError"

    constructor(message: string, details?: any) {
        super(message, HttpStatusCode.NOT_FOUND, "NOT_FOUND_ERROR", details)
    }
}

export class InputError extends CustomError {
    readonly _tag = "InputError"

    constructor(message: string, details?: any) {
        super(message, HttpStatusCode.BAD_REQUEST, "INPUT_ERROR", details)
    }
}

export class InternalError extends CustomError {
    readonly _tag = "InternalError"

    constructor(message: string, details?: any) {
        super(message, HttpStatusCode.INTERNAL_SERVER_ERROR, "INTERNAL_ERROR", details)
    }
}

export class GameLogicError extends CustomError {
    readonly _tag = "GameLogicError"

    constructor(message: string, details?: any) {
        super(message, HttpStatusCode.BAD_REQUEST, "GAME_LOGIC_ERROR", details)
    }
}