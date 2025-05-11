import { Injectable } from "@nestjs/common";
import { ConfigService, registerAs } from "@nestjs/config";

@Injectable()
export class DatabaseConfig {
	constructor(configService: ConfigService) {}

	get host() {
		return this.configService.get("DB_HOST");
	}

	get port() {
		return this.configService.get("DB_PORT");
	}
}

export const databaseConfig = registerAs("database", () => {
	return new DatabaseConfig(configService);
});
