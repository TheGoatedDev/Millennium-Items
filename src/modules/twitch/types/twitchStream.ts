export type TwitchAPIStream = {
	id: string;

	// User
	user_id: string;
	user_login: string;
	user_name: string;

	// Game
	game_id: string;
	game_name: string;

	// Stream
	type: "live" | "offline";
	viewer_count: number;
	title: string;
	started_at: string;

	// Language
	language: string;

	// Thumbnail
	thumbnail_url: string;

	// Tags
	tag_ids: string[];
	tags: string[];

	// Is Mature
	is_mature: boolean;
};
