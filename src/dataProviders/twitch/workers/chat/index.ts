import { createLogger } from "@/logger";
import { getTwitchAPI, TwitchAPI } from "../../api";
import { Repository } from "typeorm";
import { TwitchIdentity } from "@/db/entities/twitchIdentity";
import { twitchIdentityRepository } from "@/db/repositories";

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

		const twitchIdentitiesWithStreams = await Promise.all(
			twitchIdentities.map(async (twitchIdentity) => {
				const streams = await this.twitchApi.getStreamsByLogin(
					twitchIdentity.login,
				);

				if (streams.data.length === 0) {
					return null;
				}

				this.logger.info(
					{
						twitchIdentity: twitchIdentity.login,
						stream: streams.data[0],
					},
					"Twitch identity retrieved",
				);

				return {
					...twitchIdentity,
					stream: streams.data[0],
				};
			}),
		);

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
