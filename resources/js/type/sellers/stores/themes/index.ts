import { BasicApiResponseType } from '../../../common';

export interface GetThemesResponseType extends BasicApiResponseType {
	data: {
		themes: {
			name: string;
			slug: string;
			thumbnail: string;
		}[];
	};
}
