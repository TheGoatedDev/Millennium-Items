export type TwitchAPIResponse<T> = {
	data: T[];
	pagination: {
		cursor: string;
	};
};

export type TwitchAPIStream = {
	id: string;
	user_id: string;
	user_login: string;
	user_name: string;
	game_name: string;
	game_id: string;
	type: "live" | "offline";
};

export type TwitchAPIGetAccessTokenResponse = {
	access_token: string;
	expires_in: number;
};

export type TwitchAPIAuthentication = {
	client_id: string;
	access_token: string;
};
