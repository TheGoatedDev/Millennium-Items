import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";

@Entity("twitch_channels")
export class TwitchChannel {
	@PrimaryGeneratedColumn("uuid")
	id!: string;

	@Column({ unique: true, type: "varchar" })
	channelId!: string;

	@Column({ unique: true, type: "varchar" })
	channelName!: string;

	@CreateDateColumn()
	createdAt!: Date;

	@UpdateDateColumn()
	updatedAt!: Date;
}
