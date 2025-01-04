import { BasicApiResponseType } from '../../common';

export interface GetStoresResponseType extends BasicApiResponseType {
	data: {
		stores: {
			name: string;
			slug: string;
			domain: string;
			url: string;
		}[];
	};
}
