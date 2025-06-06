import {
	Column,
	CreateDateColumn,
	Entity,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";
import { TwitchIdentity } from "./twitchIdentity";

export enum IdentityType {
	TWITCH_CHANNEL = "twitch_channel",
}

@Entity("identities")
export class Identity {
	@PrimaryGeneratedColumn("uuid")
	id!: string;

	@Column({ type: "enum", enum: IdentityType })
	identityType!: IdentityType;

	@OneToOne(
		() => TwitchIdentity,
		(twitchIdentity) => twitchIdentity.identity,
		{
			nullable: true,
			cascade: true,
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
		},
	)
	twitchIdentity?: TwitchIdentity;

	@CreateDateColumn()
	createdAt!: Date;

	@UpdateDateColumn()
	updatedAt!: Date;
}
