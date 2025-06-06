import { TwitchIdentity } from "@/db/entities/twitchIdentity";
import { createLogger } from "@/logger";
import { ChatClient } from "@mastondzn/dank-twitch-irc";
import { ensureUser } from "./ensureUser";
import { TwitchChatMessages } from "@/db/entities/twitchChatMessages";
import {
	twitchChatMessagesRepository,
	twitchIdentityRepository,
} from "@/db/repositories";

const logger = createLogger("TwitchChatWatcher");

export const watchChat = async (twitchIdentity: TwitchIdentity) => {
	logger.info({ twitchIdentity }, "Watching chat for channel");

	const client = new ChatClient({});

	client.on("PRIVMSG", async (message) => {
		logger.trace(
			{ message, channel: twitchIdentity.login },
			"Received message",
		);

		try {
			const twitchIdentitySender = await ensureUser(
				message.senderUserID,
				message.senderUsername,
			);

			const twitchChatMessages = new TwitchChatMessages();
			twitchChatMessages.message = message.messageText;
			twitchChatMessages.twitchIdentitySender = twitchIdentitySender;
			twitchChatMessages.twitchIdentityReceiver = twitchIdentity;
			twitchChatMessages.createdAt = new Date(message.serverTimestamp);
			await twitchChatMessagesRepository.save(twitchChatMessages);
		} catch (error) {
			logger.error({ error }, "Error saving chat message");
		}
	});

	client.on("close", () => {
		logger.info({ twitchIdentity }, "Disconnected from channel");
		watchChat(twitchIdentity);
	});

	client.on("error", (error) => {
		logger.error({ error }, "Error connecting to channel");
	});

	try {
		await client.connect();
		await client.join(twitchIdentity.login);
	} catch (error) {
		logger.error({ error }, "Error connecting to channel");
	}

	logger.info({ twitchIdentity }, "Joined channel");
};

export const watchChatByLogin = async (login: string) => {
	const twitchIdentity = await twitchIdentityRepository.findOne({
		where: {
			login,
		},
	});

	if (!twitchIdentity) {
		logger.error({ login }, "Twitch identity not found");
		return;
	}

	watchChat(twitchIdentity);
};
