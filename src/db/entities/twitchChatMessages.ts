import {
	Column,
	CreateDateColumn,
	Entity,
	Index,
	PrimaryGeneratedColumn,
	JoinColumn,
	ManyToOne,
} from "typeorm";
import { TwitchIdentity } from "./twitchIdentity";

@Entity("twitch_chat_messages")
export class TwitchChatMessages {
	@PrimaryGeneratedColumn("uuid")
	id!: string;

	@Column({ type: "varchar" })
	message!: string; // Twitch chat message

	@ManyToOne(
		() => TwitchIdentity,
		(twitchIdentity) => twitchIdentity.id,
		{
			nullable: false,
			cascade: true,
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
		},
	)
	@JoinColumn()
	twitchIdentitySender!: TwitchIdentity;

	@ManyToOne(
		() => TwitchIdentity,
		(twitchIdentity) => twitchIdentity.id,
		{
			nullable: false,
			cascade: true,
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
		},
	)
	@JoinColumn()
	twitchIdentityReceiver!: TwitchIdentity;

	@CreateDateColumn()
	createdAt!: Date;
}
