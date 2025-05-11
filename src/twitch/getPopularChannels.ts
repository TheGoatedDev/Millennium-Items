import type { TwitchAPIChannel, TwitchAPIResponse } from "@/types/twitch";

const clientId = "dnfx6nwhaipga5h7bddujm6p4x5c20";
const clientSecret = "1md36zm37y19oais181l9jy69rrjuh";

const getAccessToken = async (): Promise<{ access_token: string }> => {
	const response = await fetch("https://id.twitch.tv/oauth2/token", {
		method: "POST",
		body: new URLSearchParams({
			client_id: clientId,
			client_secret: clientSecret,
			grant_type: "client_credentials",
		}),
	});

	return (await response.json()) as { access_token: string };
};

export const getPopularChannels = async (
	total: number,
	cursor = "",
	channels: TwitchAPIChannel[] = [],
): Promise<TwitchAPIChannel[]> => {
	if (channels.length >= total) {
		const apiChannelsMap = new Map<string, TwitchAPIChannel>();
		for (const channel of channels) {
			apiChannelsMap.set(channel.user_id, channel);
		}

		return Array.from(apiChannelsMap.values());
	}

	const maxItems = 100;
	const accessToken = await getAccessToken();

	const count = Math.min(total, maxItems);

	const response = await fetch(
		`https://api.twitch.tv/helix/streams?first=${count}${
			cursor ? `&after=${cursor}` : ""
		}`,
		{
			headers: {
				"Client-Id": clientId,
				Authorization: `Bearer ${accessToken.access_token}`,
			},
		},
	);

	if (!response.ok) {
		console.error(response);
		throw new Error("Failed to fetch popular channels");
	}

	const data = (await response.json()) as TwitchAPIResponse<TwitchAPIChannel>;

	const newChannels = data.data;

	return getPopularChannels(total, data.pagination.cursor, [
		...channels,
		...newChannels,
	]);
};
