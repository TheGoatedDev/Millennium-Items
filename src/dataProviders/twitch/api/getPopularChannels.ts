import { twitchConfig } from "@/config/twitch";
import { createLogger } from "@/logger";
import type { TwitchAPIStream, TwitchAPIResponse } from "@/types/twitch";
import { TwitchAPIAuthentication } from "../types/api";

const logger = createLogger("Twitch API - getPopularStreams");

// Get popular channels from Twitch API
export const getPopularStreams = async (
	authentication: TwitchAPIAuthentication,
	total: number,
	onBatch: (channels: TwitchAPIStream[], batchNumber: number) => void,
): Promise<TwitchAPIStream[]> => {
	let batchNumber = 0;
	const allChannels: TwitchAPIStream[] = [];
	let cursor = "";

	const getChannels = async (count: number) => {
		const response = await fetch(
			`https://api.twitch.tv/helix/streams?first=${count}${
				cursor ? `&after=${cursor}` : ""
			}`,
			{
				headers: {
					"Client-Id": authentication.client_id,
					Authorization: `Bearer ${authentication.access_token}`,
				},
			},
		);

		if (!response.ok) {
			logger.error(response, "Failed to fetch popular channels");
			throw new Error("Failed to fetch popular channels");
		}

		const data = (await response.json()) as TwitchAPIResponse<TwitchAPIStream>;

		return data;
	};

	do {
		const count = Math.min(total - allChannels.length, 100);

		const data = await getChannels(count);
		allChannels.push(...data.data);
		cursor = data.pagination.cursor;

		onBatch(data.data, batchNumber);
		logger.trace(
			{
				batchNumber,
				total,
				channelCount: allChannels.length,
			},
			"Fetched popular channels",
		);
		batchNumber++;
	} while (allChannels.length < total);

	logger.info(
		{
			total,
			channelCount: allChannels.length,
		},
		"Fetched popular channels",
	);

	// Get the next page of channels
	return allChannels;
};
