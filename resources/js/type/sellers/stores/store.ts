import { BasicApiResponseType } from '../../common';

export interface CreateStorePayloadType {
	name: string;
	logo: string;
	theme_id: number;
}

export interface CreateStoreResponseType extends BasicApiResponseType {
	data: {
		store: {
			name: string;
			slug: string;
			domain: string;
			url: string;
		};
	};
}
