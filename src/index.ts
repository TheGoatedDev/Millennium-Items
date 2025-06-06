import "dotenv/config";
import "reflect-metadata";
import { AppDataSource } from "./db/data-source";
import { createLogger } from "./logger";
import { getTwitchAPI } from "./dataProviders/twitch/api";
import { getTwitchChatWorkerManager } from "./dataProviders/twitch/workers/chat";

const logger = createLogger("Entrypoint");

logger.debug("Starting application");

const twitchApi = getTwitchAPI();
const twitchChatWorkerManager = getTwitchChatWorkerManager();

async function bootstrap() {
	try {
		// Ensure access token is valid
		await twitchApi.getAccessToken();

		// Initialize database
		await AppDataSource.initialize();
		logger.info("Database connected successfully");

		await twitchChatWorkerManager.start();

		logger.info("Application started successfully");

		setInterval(async () => {
			const stream = await twitchApi.getStreamsByLogin("philza");

			logger.info(
				`${stream.data[0]?.user_name} is ${stream.data[0]?.type} with ${stream.data[0]?.viewer_count} viewers`,
			);
		}, 10000);

		// Example: Start Twitch IRC connection or other background tasks
		// await twitchService.connect();

		logger.info("Application finished successfully");
	} catch (error) {
		logger.error({ error: String(error) }, "Error starting application");
		process.exit(1);
	}
}

// Graceful shutdown
process.on("SIGTERM", async () => {
	logger.info("SIGTERM received, shutting down gracefully");
	await AppDataSource.destroy();
	process.exit(0);
});

process.on("SIGINT", async () => {
	logger.info("SIGINT received, shutting down gracefully");
	await AppDataSource.destroy();
	process.exit(0);
});

bootstrap();

export { AppDataSource };
