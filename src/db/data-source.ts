import { databaseConfig } from "@/config/database";
import { mainConfig } from "@/config/main";
import path from "node:path";
import { DataSource } from "typeorm";
import { fileURLToPath } from "node:url";
import { Identity } from "./entities/identity";
import { TwitchIdentity } from "./entities/twitchIdentity";
import { TwitchUsernameHistory } from "./entities/twitchUsernameHistory";
import { TwitchChatMessages } from "./entities/twitchChatMessages";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const AppDataSource = new DataSource({
	type: "postgres",
	host: databaseConfig.DB_HOST,
	port: databaseConfig.DB_PORT,
	username: databaseConfig.DB_USER,
	password: databaseConfig.DB_PASS,
	database: databaseConfig.DB_NAME,
	synchronize: mainConfig.NODE_ENV === "development",
	logging: false,
	entities: [
		Identity,
		TwitchIdentity,
		TwitchUsernameHistory,
		TwitchChatMessages,
	],
	migrations: [`${__dirname}/migrations/*.{ts,js}`],
});
