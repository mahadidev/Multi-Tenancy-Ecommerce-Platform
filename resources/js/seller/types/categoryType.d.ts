export interface CategoryType {
	id: number;
	store_id: number;
	name: string;
	slug: string;
	type: 'product' | 'post' | 'blog';
	has_parent: null | CategoryType;
	created_at: string;
	updated_at: string;
}
