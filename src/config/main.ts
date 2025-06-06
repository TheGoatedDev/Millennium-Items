import { z } from "zod";

export const mainConfigSchema = z.object({
	NODE_ENV: z.enum(["development", "production"]).default("development"),
});

export const mainConfig = mainConfigSchema.parse(process.env);
