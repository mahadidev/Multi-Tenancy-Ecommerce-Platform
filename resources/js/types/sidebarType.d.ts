export interface SidebarItemType {
	href?: string;
	target?: HTMLAttributeAnchorTarget;
	icon?: FC<ComponentProps<'svg'>>;
	label: string;
	items?: SidebarItem[];
	badge?: string;
}
