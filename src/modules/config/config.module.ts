import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DatabaseConfigService } from "./database-config.service";
import { TwitchConfigService } from "./twitch-config.service";

@Global()
@Module({
	imports: [ConfigModule.forFeature()],
	providers: [DatabaseConfigService, TwitchConfigService],
	exports: [DatabaseConfigService, TwitchConfigService],
})
export class AppConfigModule {}
