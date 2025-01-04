import { BasicApiResponseType } from '../../../common';

export interface GetThemeResponseType extends BasicApiResponseType {
	data: {
		theme: {
			name: string;
			slug: string;
			thumbnail: string;
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
			pages: {
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
	};
}
