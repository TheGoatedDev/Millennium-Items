import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { TwitchService } from "./twitch.service";

@Module({
	imports: [
		HttpModule.register({
			baseURL: "https://api.twitch.tv/helix",
			headers: {
				"Client-ID": process.env.TWITCH_CLIENT_ID,
				"Content-Type": "application/json",
			},
		}),
	],
	controllers: [],
	providers: [TwitchService],
	exports: [TwitchService],
})
export class TwitchModule {}
