import { DataSource } from "typeorm";
import { TwitchChannel } from "./entities/twitchChannel";

export const AppDataSource = new DataSource({
	type: "postgres",
	host: "localhost",
	port: 5432,
	username: "postgres",
	password: "password",
	database: "milenium",
	synchronize: true,
	// logging: true,
	entities: [TwitchChannel],
	subscribers: [],
	migrations: [`${__dirname}/migrations/*.{ts,js}`],
});
