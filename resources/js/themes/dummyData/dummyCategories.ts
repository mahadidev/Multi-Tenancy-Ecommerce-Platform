import { CategoryType } from "@/types/categoryType";

export const dummyCategories: CategoryType[] = [
	{
		id: 9,
		store_id: 3,
		name: 'sdadsa',
		slug: 'sdadsa',
		type: 'product',
		has_parent: null,
		created_at: '22 Jan, 2025 | 05:30 PM',
		updated_at: '22 Jan, 2025 | 05:53 PM',
	},
	{
		id: 8,
		store_id: 3,
		name: 'Danish Ahmed',
		slug: 'danish-ahmed',
		type: 'product',
		has_parent: {
            id: 8,
            store_id: 3,
            name: 'Danish Ahmed',
            slug: 'danish-ahmed',
            type: 'product',
            created_at: '22 Jan, 2025 | 05:29 PM',
            updated_at: '22 Jan, 2025 | 05:52 PM',
            has_parent: null
        },
		created_at: '22 Jan, 2025 | 05:29 PM',
		updated_at: '22 Jan, 2025 | 05:52 PM',
	},
];
