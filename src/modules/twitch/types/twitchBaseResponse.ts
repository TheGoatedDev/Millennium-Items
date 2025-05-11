export type TwitchBasePaginatedResponse<D> = {
	data: D;
	pagination: {
		cursor: string;
	};
};
