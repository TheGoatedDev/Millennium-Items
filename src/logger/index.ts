import { mainConfig } from "@/config/main";
import pino from "pino";

const logger = pino({
	level: mainConfig.NODE_ENV === "development" ? "debug" : "info",
	formatters: {
		level: (label) => ({ level: label }),
	},
	transport: {
		target: "pino-pretty",
	},
});

export const createLogger = (context: string) => {
	return logger.child({
		context,
	});
};
