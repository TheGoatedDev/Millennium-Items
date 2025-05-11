import { IsString } from "class-validator";

export class TwitchConfigSchema {
	@IsString()
	TWITCH_CLIENT_ID!: string;

	@IsString()
	TWITCH_CLIENT_SECRET!: string;
}
