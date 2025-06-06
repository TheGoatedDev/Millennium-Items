import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	OneToMany,
	OneToOne,
	PrimaryColumn,
	UpdateDateColumn,
} from "typeorm";
import { Identity } from "./identity";
import { TwitchUsernameHistory } from "./twitchUsernameHistory";

@Entity("twitch_identities")
export class TwitchIdentity {
	@PrimaryColumn({ type: "varchar", unique: true })
	id!: string; // Twitch channel ID

	@Column({ type: "varchar", unique: true })
	login!: string; // Twitch channel name

	@Column({ type: "boolean", default: false })
	isLive!: boolean; // Whether the channel is live

	@Column({ type: "integer", nullable: true })
	lastViewerCount?: number; // The last viewer count of the channel

	@OneToOne(
		() => Identity,
		(identity) => identity.id,
		{
			nullable: false,
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
		},
	)
	@JoinColumn()
	identity!: Identity;

	@OneToMany(
		() => TwitchUsernameHistory,
		(twitchUsernameHistory) => twitchUsernameHistory.twitchIdentity,
	)
	twitchUsernameHistory!: TwitchUsernameHistory[];

	@CreateDateColumn()
	createdAt!: Date;

	@UpdateDateColumn()
	updatedAt!: Date;
}
