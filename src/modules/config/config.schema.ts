import { IntersectionType } from "@nestjs/swagger";
import { TwitchConfigSchema } from "./schemas/twitch.schema";

enum Environments {
	Development = "development",
	Production = "production",
}

export class ConfigSchema extends IntersectionType(TwitchConfigSchema) {}
