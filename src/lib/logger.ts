// src/lib/logger.ts
import pino from "pino";

const isDev = process.env.NODE_ENV !== "production";

const logger = pino({
  level: process.env.LOG_LEVEL ?? (isDev ? "debug" : "info"),
  ...(isDev
    ? {
        transport: {
          target: "pino/file",
          options: { destination: 1 }, // stdout — no pino-pretty dep required
        },
      }
    : {}),
  formatters: {
    level(label) {
      return { level: label };
    },
  },
  base: {
    env: process.env.NODE_ENV,
  },
});

export default logger;
