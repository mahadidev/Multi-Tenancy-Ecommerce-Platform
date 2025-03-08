import { MenuItemType } from "@type/menuType";
import { ThemeLayoutPropsType } from "@type/themeType";
import { FC } from "react";
import { Button } from "../../components/Component";

const Navigation: FC<ThemeLayoutPropsType> = ({ store }) => {

	return (
		<header>
			<nav className="bg-white border-gray-200 py-2.5">
				<div className="container mx-auto">
					<div className="flex flex-wrap justify-between items-center">
						{store.logo && (
							<a href="https://flowbite.com" className="flex items-center">
								<img
									src={store.logo}
									className="mr-3 h-6 sm:h-9"
									alt={`${store.name} Logo`}
								/>
							</a>
						)}
						<div className="flex gap-2.5 items-center lg:order-2">
							<Button variant='gray'>Login</Button>
							<Button>Get started</Button>
						</div>
						<div
							className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1"
							id="mobile-menu-2"
						>
							<ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
								{store.menus &&
									store.menus[0]?.items.map((menuItem: MenuItemType) => (
										<li key={menuItem.id}>
											<a
												href="#"
												className="block py-2 pr-4 pl-3 text-gray-700 rounded lg:bg-transparent lg:text-primary-700 lg:p-0"
												aria-current="page"
											>
												{menuItem.label}
											</a>
										</li>
									))}
							</ul>
						</div>
					</div>
				</div>
			</nav>
		</header>
	);
};
export default Navigation;
