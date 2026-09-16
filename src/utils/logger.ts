import winston from "winston";
import winstonDailyRotateFile from "winston-daily-rotate-file";

const env = process.env.ENV || "dev";

const customLevels = {
    levels: {
        fatal: 0,
        error: 1,
        warn: 2,
        info: 3,
        debug: 4,
        trace: 5
    },
    colors: {
        fatal: 'magenta',
        error: 'red',
        warn: 'yellow',
        info: 'green',
        debug: 'blue',
        trace: 'gray'
    }
};

declare module "winston" {
    interface Logger {
      fatal: winston.LeveledLogMethod;
      trace: winston.LeveledLogMethod;
    }
}

const consoleFormat = winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(({ level, message, timestamp }) => {
        const coloredLevel = winston.format.colorize().colorize(level, level.toUpperCase());
        return `${timestamp} [${coloredLevel}] ${message}`;
    })
);

const fileFormat = winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.json()
);

const transports = [
    new winston.transports.Console({
        format: consoleFormat,
        level: env === "dev" ? "trace" : "info"
    }),
    new winstonDailyRotateFile({
        filename: "logs/error-%DATE%.log",
        datePattern: "YYYY-MM-DD",
        level: "error",
        format: fileFormat
    }),
    new winstonDailyRotateFile({
        filename: "logs/combined-%DATE%.log",
        datePattern: "YYYY-MM-DD",
        format: fileFormat
    })
];

const logger = winston.createLogger({
    level: env === "dev" ? "trace" : "info",
    levels: customLevels.levels,
    transports
});

winston.addColors(customLevels.colors);

export default logger;