import { AppDataSource } from "./data-source";
import { Identity } from "./entities/identity";
import { TwitchIdentity } from "./entities/twitchIdentity";
import { TwitchUsernameHistory } from "./entities/twitchUsernameHistory";
import { TwitchChatMessages } from "./entities/twitchChatMessages";

export const identityRepository = AppDataSource.getRepository(Identity);

export const twitchIdentityRepository =
	AppDataSource.getRepository(TwitchIdentity);

export const twitchUsernameHistoryRepository = AppDataSource.getRepository(
	TwitchUsernameHistory,
);

export const twitchChatMessagesRepository =
	AppDataSource.getRepository(TwitchChatMessages);
