import { Identity, IdentityType } from "@/db/entities/identity";
import { TwitchIdentity } from "@/db/entities/twitchIdentity";
import {
	identityRepository,
	twitchIdentityRepository,
} from "@/db/repositories";

export const ensureUser = async (userId: string, login: string) => {
	let twitchIdentity = await twitchIdentityRepository.findOne({
		where: {
			id: userId,
		},
	});

	if (!twitchIdentity) {
		const newIdentity = new Identity();
		newIdentity.identityType = IdentityType.TWITCH_CHANNEL;
		await identityRepository.save(newIdentity);

		const newTwitchIdentity = new TwitchIdentity();
		newTwitchIdentity.id = userId;
		newTwitchIdentity.login = login;
		newTwitchIdentity.identity = newIdentity;
		twitchIdentity = await twitchIdentityRepository.save(newTwitchIdentity);
	}

	return twitchIdentity;
};
