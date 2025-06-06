import { createLogger } from "@/logger";
import { TwitchAPIGetAccessTokenResponse } from "../types/api";

const logger = createLogger("TwitchAPI - getAccessToken");

export const getAccessToken = async (
	clientId: string,
	clientSecret: string,
): Promise<TwitchAPIGetAccessTokenResponse> => {
	const response = await fetch("https://id.twitch.tv/oauth2/token", {
		method: "POST",
		body: new URLSearchParams({
			client_id: clientId,
			client_secret: clientSecret,
			grant_type: "client_credentials",
		}),
	});

	if (!response.ok) {
		logger.error(response, "Failed to get access token");
		throw new Error("Failed to get access token");
	}

	const data = (await response.json()) as TwitchAPIGetAccessTokenResponse;

	logger.info({ data }, "Access token retrieved");

	return data;
};
