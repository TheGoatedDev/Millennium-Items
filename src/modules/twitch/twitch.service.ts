import { HttpService } from "@nestjs/axios";
import { Injectable, Logger } from "@nestjs/common";
import { lastValueFrom } from "rxjs";
import { TwitchBasePaginatedResponse } from "./types/twitchBaseResponse";
import { TwitchAPIStream } from "./types/twitchStream";

@Injectable()
export class TwitchService {
	private readonly logger = new Logger(TwitchService.name);

	private accessToken!: string;
	private accessTokenInterval: NodeJS.Timeout;

	constructor(private readonly httpService: HttpService) {
		this.getAccessToken().then((token) => {
			this.accessToken = token;

			console.time("getPopularChannels");
			this.getPopularChannels(50000).then(() => {
				console.timeEnd("getPopularChannels");
			});
		});

		this.accessTokenInterval = setInterval(async () => {
			this.logger.log("Refreshing access token");
			this.accessToken = await this.getAccessToken();
			this.logger.log("Access token refreshed");
		}, 4200000);
	}

	async getAccessToken(): Promise<string> {
		const resObservable = this.httpService.post<{ access_token: string }>(
			"https://id.twitch.tv/oauth2/token",
			{
				client_id: process.env.TWITCH_CLIENT_ID,
				client_secret: process.env.TWITCH_CLIENT_SECRET,
				grant_type: "client_credentials",
			},
		);

		const res = await lastValueFrom(resObservable);

		if (res.status !== 200) {
			this.logger.error(
				{ res },
				`Failed to get access token: ${res.statusText}`,
			);
			throw new Error("Failed to get access token");
		}

		this.logger.debug({ res }, "Got access token");

		return res.data.access_token;
	}

	async getPopularChannels(count: number): Promise<TwitchAPIStream[]> {
		const accessToken = await this.getAccessToken();
		const getData = async (pageSize: number, cursor?: string) => {
			const resObservable = this.httpService.get<
				TwitchBasePaginatedResponse<TwitchAPIStream[]>
			>("/streams", {
				params: {
					first: pageSize,
					after: cursor,
				},
				headers: {
					"Client-ID": process.env.TWITCH_CLIENT_ID!,
					Authorization: `Bearer ${accessToken}`,
				},
			});

			const res = await lastValueFrom(resObservable);

			if (res.status !== 200) {
				this.logger.error(`Failed to get popular channels: ${res.statusText}`);
				throw new Error("Failed to get popular channels");
			}

			return res.data;
		};

		const data: TwitchAPIStream[] = [];

		let cursor = "";
		while (data.length < count) {
			this.logger.debug(`Getting popular channels: ${data.length}/${count}`);

			const pageSize = Math.min(count - data.length, 100);
			const res = await getData(pageSize, cursor);

			data.push(...res.data);
			cursor = res.pagination.cursor;

			this.logger.debug(`Got ${data.length} popular channels`);
		}

		return data;
	}
}
