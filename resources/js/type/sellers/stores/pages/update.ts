import { BasicApiResponseType } from '../../../common';

export interface UpdatePagePayloadType {
	name?: string;
	slug?: string;
	title?: string;
	is_active?: boolean;
	widgets?: [
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

export interface UpdatePageResponseType extends BasicApiResponseType {
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
