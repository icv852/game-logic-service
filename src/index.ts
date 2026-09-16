import http from "http"
import logger from "./utils/logger.js"
import { formatErrorLog } from "./utils/errors.js"
import createKoaApp from "./app.js"

const PORT = Number(process.env.PORT ?? 3000)
const SHUTDOWN_TIMEOUT_MS = 10_000

let server: http.Server | undefined
let isShuttingDown = false

const exitWithDelay = (exitCode: number): void => {
    setTimeout(() => {
        process.exit(exitCode)
    }, 200)
}

const gracefulShutdown = (signal: string): void => {
    if (isShuttingDown) {
        logger.warn(`Received ${signal} during shutdown, ignoring duplicate signal.`)
        return
    }
    isShuttingDown = true
    logger.info(`Received ${signal}. Starting graceful shutdown...`)

    if (!server) {
        exitWithDelay(0)
        return
    }

    const forceExitTimer = setTimeout(() => {
        logger.error("Graceful shutdown timed out. Forcing exit.")
        exitWithDelay(1)
    }, SHUTDOWN_TIMEOUT_MS)

    server.close((err) => {
        clearTimeout(forceExitTimer)
        if (err) {
            logger.error(formatErrorLog("Error while closing server.", err))
            exitWithDelay(1)
            return
        }
        logger.info("Server closed gracefully.")
        exitWithDelay(0)
    })
}

const main = (): void => {
    try {
        const app = createKoaApp()
        server = app.listen(PORT, () => logger.info(`Server listening on port ${PORT}`))
    } catch (e) {
        logger.fatal(formatErrorLog("Failed to start server.", e))
        exitWithDelay(1)
    }
}

process.on("uncaughtException", e => {
    logger.error(`Uncaught Exception: ${formatErrorLog("", e)}`)
    exitWithDelay(1)
})

process.on("unhandledRejection", (reason) => {
    logger.error(`Unhandled Rejection: ${formatErrorLog("", reason)}`)
    exitWithDelay(1)
})

process.on("SIGINT", () => gracefulShutdown("SIGINT"))
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"))

main()