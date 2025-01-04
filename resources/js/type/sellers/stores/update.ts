import { BasicApiResponseType } from '../../common';

export interface UpdateStorePayloadType {
	name?: string;
	logo?: string;
	theme_id?: number;
}

export interface UpdateStoreResponseType extends BasicApiResponseType {
	data: {
		store: {
			name: string;
			slug: string;
			domain: string;
			url: string;
		};
	};
}
