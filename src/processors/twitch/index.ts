import { Identity, IdentityType } from "@/db/entities/identity";
import { TwitchIdentity } from "@/db/entities/twitchIdentity";
import { TwitchUsernameHistory } from "@/db/entities/twitchUsernameHistory";
import { createLogger } from "@/logger";
import { TwitchAPIStream } from "@/types/twitch";
import { Repository } from "typeorm";

export class TwitchProcessor {
	constructor(
		private readonly twitchIdentityRepository: Repository<TwitchIdentity>,
		private readonly twitchUsernameHistoryRepository: Repository<TwitchUsernameHistory>,
		private readonly identityRepository: Repository<Identity>,
	) {}

	private readonly logger = createLogger("TwitchProcessor");

	async processFromStream(twitchApiStream: TwitchAPIStream) {
		// Check if the twitch identity already exists
		let twitchIdentity = await this.twitchIdentityRepository.findOne({
			where: { id: twitchApiStream.user_id },
		});

		// If the twitch identity does not exist, create it
		if (!twitchIdentity) {
			let newIdentity = new Identity();
			newIdentity.identityType = IdentityType.TWITCH_CHANNEL;
			newIdentity = await this.identityRepository.save(newIdentity);

			const newTwitchIdentity = new TwitchIdentity();
			newTwitchIdentity.id = twitchApiStream.user_id;
			newTwitchIdentity.login = twitchApiStream.user_login;
			newTwitchIdentity.identity = newIdentity;

			twitchIdentity =
				await this.twitchIdentityRepository.save(newTwitchIdentity);
		}

		// Check if the username history already exists
		let twitchUsernameHistory =
			await this.twitchUsernameHistoryRepository.findOne({
				where: {
					twitchIdentity: { id: twitchApiStream.user_id },
					login: twitchApiStream.user_login,
				},
			});

		// If the username history does not exist, create it
		if (!twitchUsernameHistory) {
			twitchUsernameHistory = new TwitchUsernameHistory();
			twitchUsernameHistory.twitchIdentity = twitchIdentity;
			twitchUsernameHistory.login = twitchApiStream.user_login;
			twitchUsernameHistory = await this.twitchUsernameHistoryRepository.save(
				twitchUsernameHistory,
			);
		}

		// Update the twitch identity with the new username and login
		twitchIdentity.login = twitchApiStream.user_login;
		twitchIdentity.isLive = twitchApiStream.type === "live";
		twitchIdentity.lastViewerCount = twitchApiStream.viewer_count;
		await this.twitchIdentityRepository.save(twitchIdentity);
	}
}
