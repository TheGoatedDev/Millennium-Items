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

@Entity("twitch_username_history")
@Index(["twitchIdentity", "login"], { unique: true })
export class TwitchUsernameHistory {
	@PrimaryGeneratedColumn("uuid")
	id!: string;

	@Column({ type: "varchar" })
	login!: string; // Twitch channel login

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
	twitchIdentity!: TwitchIdentity;

	@CreateDateColumn()
	createdAt!: Date;
}
