import z from "zod";

const databaseSchema = z.object({
	DB_HOST: z.string().min(1, "Database host is required"),
	DB_PORT: z
		.number({
			coerce: true,
		})
		.min(1, "Database port must be greater than 0")
		.max(65535, "Database port must be less than 65535")
		.default(5432),
	DB_USER: z.string().min(1, "Database user is required"),
	DB_PASS: z.string().min(1, "Database password is required"),
	DB_NAME: z.string().min(1, "Database name is required"),
});

export type DatabaseSchema = z.infer<typeof databaseSchema>;

export const databaseConfig = databaseSchema.parse(process.env);
