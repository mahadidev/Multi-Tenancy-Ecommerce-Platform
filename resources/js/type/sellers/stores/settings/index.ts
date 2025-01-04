import { BasicApiResponseType } from '../../../common';

export interface GetSettingsResponseType extends BasicApiResponseType {
	data: {
		settings: {
			is_active: boolean;
			social_media: {
				facebook: {
					url: string;
				} | null;
				youtube: {
					url: string;
				} | null;
				instagram: {
					url: string;
				} | null;
				tiktok: {
					url: string;
				} | null;
			};
			contact: {
				customer_support: {
					phones:
						| {
								label: string;
								number: string;
						  }[]
						| null;
					email:
						| {
								label: string;
								number: string;
						  }[]
						| null;
				};
			};
		};
	};
}
