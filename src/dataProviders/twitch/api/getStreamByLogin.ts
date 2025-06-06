import { createLogger } from "@/logger";
import type { TwitchAPIResponse, TwitchAPIStream } from "@/types/twitch";
import { TwitchAPIAuthentication } from "../types/api";

const logger = createLogger("Twitch API - getStreamsByLogin");

export const getStreamsByLogin = async (
	authentication: TwitchAPIAuthentication,
	login: string,
) => {
	const response = await fetch(
		`https://api.twitch.tv/helix/streams?user_login=${login}`,
		{
			headers: {
				"Client-Id": authentication.client_id,
				Authorization: `Bearer ${authentication.access_token}`,
			},
		},
	);

	if (!response.ok) {
		logger.error(response, "Failed to fetch stream");
		throw new Error("Failed to fetch stream");
	}

	const data = (await response.json()) as TwitchAPIResponse<TwitchAPIStream>;

	return data;
};
