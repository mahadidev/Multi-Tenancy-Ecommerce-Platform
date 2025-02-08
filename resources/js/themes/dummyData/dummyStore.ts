import { StoreType } from "@type/storeType";
import { dummyCategories } from "./dummyCategories";
import { dummyProducts } from "./dummyProducts";

export const dummyStore: StoreType | any = {
	id: 3,
	name: 'Kacha Bazar',
	slug: 'kacha-bazar',
	domain: 'https://chologori-builder.test.com/stores/kacha-bazar',
	email: null,
	phone: null,
	location: null,
	status: 1,
	type: 'e-commerce',
	description: null,
	currency: 'BDT',
	logo: 'https://cholgori-com-1.vercel.app/images/logo.svg',
	dark_logo: null,
	primary_color: '#ffc100',
	secondary_color: '#fbcfe8',
	theme_id: 1,
	settings: null,
	categories: dummyCategories,
	featuredProducts: dummyProducts.slice(0, 5),
	social_media: [
		{
			id: 1,
			name: 'facebook',
			label: 'Facebook',
			username: 'chologori',
			url: 'https://www.facebook.com/',
			store_id: 3,
			created_at: '24 Jan, 2025 | 02:22 AM',
			updated_at: '24 Jan, 2025 | 02:22 AM',
		},
	],
	created_at: '22 Jan, 2025 | 01:01 PM',
	updated_at: '22 Jan, 2025 | 01:01 PM',
	theme: null,
};
