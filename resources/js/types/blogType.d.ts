import { BrandType } from "./brandType";
import { CategoryType } from "./categoryType";

export interface BlogType {
	id: number;
	title: string;
	slug: string;
	image: string;
	content: string;
	status: string;
	user_id: number;
	category_id: number;
    created_at: string;
    updated_at: string;
}

