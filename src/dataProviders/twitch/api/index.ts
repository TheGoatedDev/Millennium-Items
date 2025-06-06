import { createLogger } from "@/logger";
import {
	TwitchAPIAuthentication,
	TwitchAPIGetAccessTokenResponse,
	TwitchAPIStream,
} from "../types/api";
import { getAccessToken } from "./getAccessToken";
import { getPopularStreams } from "./getPopularChannels";
import { getStreamsByLogin } from "./getStreamByLogin";
import { twitchConfig } from "@/config/twitch";

export class TwitchAPI {
	private readonly logger = createLogger("TwitchAPI");
	private accessToken: TwitchAPIGetAccessTokenResponse | null = null;
	private accessTokenTimer: NodeJS.Timeout | null = null;

	constructor(
		private readonly clientId: string,
		private readonly clientSecret: string,
	) {
		this.getAccessToken();
	}

	async getAccessToken() {
		if (!this.accessToken) {
			this.accessToken = await getAccessToken(this.clientId, this.clientSecret);
		}

		this.accessTokenTimer = setTimeout(
			async () => {
				this.logger.info("Refreshing access token because it's expired");
				this.accessToken = await getAccessToken(
					this.clientId,
					this.clientSecret,
				);
			},
			(this.accessToken.expires_in - 120) * 1000, // Refresh 2 minutes before expiration
		);
	}

	getAuthentication(): TwitchAPIAuthentication {
		if (!this.accessToken) {
			this.logger.error("Access token not found");
			throw new Error("Access token not found");
		}

		return {
			client_id: this.clientId,
			access_token: this.accessToken.access_token,
		};
	}

	async getPopularStreams(
		total: number,
		onBatch: (channels: TwitchAPIStream[], batchNumber: number) => void,
	) {
		return getPopularStreams(this.getAuthentication(), total, onBatch);
	}

	async getStreamsByLogin(login: string) {
		return getStreamsByLogin(this.getAuthentication(), login);
	}
}

let twitchApi: TwitchAPI | null = null;
export const getTwitchAPI = (
	clientId: string = twitchConfig.TWITCH_CLIENT_ID,
	clientSecret: string = twitchConfig.TWITCH_CLIENT_SECRET,
): TwitchAPI => {
	if (!twitchApi) {
		twitchApi = new TwitchAPI(clientId, clientSecret);
	}

	return twitchApi;
};
