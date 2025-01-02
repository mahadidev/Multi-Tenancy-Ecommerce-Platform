import { BasicApiResponseType } from '../../../common';

export interface GetPagesResponseType extends BasicApiResponseType {
	data: {
		Pages: {
			name: string;
			slug: string;
			title: string;
			is_active: boolean;
			widgets: {
				name: string;
				label: string;
				inputs: {
					name: string;
					label: string;
					value: string | null;
					placeholder: string | null;
					required: boolean;
				}[];
			}[];
		}[];
	};
}
