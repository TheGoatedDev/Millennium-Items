import { createLogger } from "@/logger";
import { getTwitchAPI, TwitchAPI } from "../../api";
import { Repository } from "typeorm";
import { TwitchIdentity } from "@/db/entities/twitchIdentity";
import { twitchIdentityRepository } from "@/db/repositories";
import { watchChat } from "@/processors/twitch/watchChat";

export class TwitchChatWorkerManager {
	private readonly logger = createLogger("TwitchChatWorkerManager");

	constructor(
		private readonly twitchApi: TwitchAPI,
		private readonly twitchIdentityRepository: Repository<TwitchIdentity>,
	) {}

	async start() {
		this.logger.info("Starting Twitch chat worker");

		const twitchIdentities = await this.twitchIdentityRepository.find({
			where: {
				isLive: true,
			},
		});

		this.logger.info(
			{ count: twitchIdentities.length },
			"Twitch identities to check for streams",
		);

		for (const twitchIdentity of twitchIdentities) {
			const streams = await this.twitchApi.getStreamsByLogin(
				twitchIdentity.login,
			);

			if (streams.data.length === 0) {
				continue;
			}

			const stream = streams.data[0];

			if (!stream) {
				continue;
			}

			this.logger.info(
				{
					twitchIdentity: twitchIdentity.login,
					stream,
				},
				"Twitch identity retrieved",
			);

			twitchIdentity.isLive = true;
			twitchIdentity.lastViewerCount = stream.viewer_count;

			await this.twitchIdentityRepository.save(twitchIdentity);

			watchChat(twitchIdentity);
		}

		this.logger.info(
			{ count: twitchIdentities.length },
			"Twitch identities retrieved",
		);
	}
}

let twitchChatWorkerManager: TwitchChatWorkerManager | null = null;
export const getTwitchChatWorkerManager = (): TwitchChatWorkerManager => {
	if (!twitchChatWorkerManager) {
		twitchChatWorkerManager = new TwitchChatWorkerManager(
			getTwitchAPI(),
			twitchIdentityRepository,
		);
	}
	return twitchChatWorkerManager;
};
