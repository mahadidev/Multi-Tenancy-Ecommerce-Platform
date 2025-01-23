export interface ApiResponseType {
	status: 200 | 404 | 422;
	message: string;
	data: any;
	meta?: {
		current_page: number;
		first_page_url: string;
		last_page: number;
		last_page_url: string;
		next_page_url: null | string;
		prev_page_url: null | string;
		total: number;
		per_page: number;
	};
	errors?: { [key: string]: string[] }[];
}
