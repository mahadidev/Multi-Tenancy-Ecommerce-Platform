import { BasicApiResponseType } from '../../../common';

export interface StorePagePayloadType {
	name: string;
	slug: string;
	title: string;
	is_active: boolean;
	widgets: [
		{
			name: string;
			label: string;
			inputs: {
				name: string;
				label: string;
				value: string | null;
				placeholder: string | null;
				required: boolean;
			}[];
		}
	];
}

export interface StorePageResponseType extends BasicApiResponseType {
	data: {
		Page: {
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
		};
	};
}
