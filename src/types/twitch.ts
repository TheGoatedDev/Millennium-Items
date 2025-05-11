export type TwitchAPIChannel = {
	id: string;
	user_id: string;
	user_login: string;
	user_name: string;
	game_name: string;
	game_id: string;
	type: "live" | "offline";
	started_at: string;
	viewer_count: number;
	language: string;
	thumbnail_url: string;
};

export type TwitchAPIResponse<T> = {
	data: T[];
	pagination: {
		cursor: string;
	};
};
