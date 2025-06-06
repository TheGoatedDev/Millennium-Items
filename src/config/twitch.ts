import { z } from "zod";

const twitchSchema = z.object({
	TWITCH_CLIENT_ID: z.string(),
	TWITCH_CLIENT_SECRET: z.string(),
});

export const twitchConfig = twitchSchema.parse(process.env);
