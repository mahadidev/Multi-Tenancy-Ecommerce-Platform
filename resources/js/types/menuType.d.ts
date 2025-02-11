export interface MenuItemType {
	id: number;
	label: string;
	href: string;
	store_menu_id: number;
	created_at: string;
	updated_at: string;
}

export interface MenuType {
	id: number;
	store_id: number;
	name: string;
	label: string;
	visibility: "guest" | "user" | "all";
	created_at: string;
	updated_at: string;
	items: MenuItemType[];
}
