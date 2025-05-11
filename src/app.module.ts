import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TwitchChannel } from "./db/entities/twitchChannel";
import { TwitchModule } from "./modules/twitch/twitch.module";

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		TypeOrmModule.forRoot({
			type: "postgres",
			host: process.env.DB_HOST || "localhost",
			port: Number.parseInt(process.env.DB_PORT || "5432", 10),
			username: process.env.DB_USER || "postgres",
			password: process.env.DB_PASS || "password",
			database: process.env.DB_NAME || "milenium",
			entities: [TwitchChannel],
			migrations: [`${__dirname}/db/migrations/*.{ts,js}`],
			// synchronize: true,
			autoLoadEntities: true,
			migrationsRun: true,
		}),
		TypeOrmModule.forFeature([TwitchChannel]),
		TwitchModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
