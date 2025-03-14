import pino, { type Logger, type LoggerOptions } from "pino";

const baseConfig: LoggerOptions = {
  base: undefined, // Remove "pid" and "hostname" from the logs
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level: (label) => {
      return { level: label };
    },
  },
};

const devConfig: LoggerOptions = {
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
  level: "debug",
};

const logger: Logger =
  process.env.NODE_ENV === "development"
    ? pino({
        ...baseConfig,
        ...devConfig,
      })
    : pino(baseConfig);

export default logger;
