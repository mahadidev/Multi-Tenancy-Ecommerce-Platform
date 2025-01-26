import { CategoryType } from "@/types/categoryType";
import { WidgetType } from "@/types/widgetType";
import { FC } from "react";
import { CiMenuFries } from "react-icons/ci";
import { Link } from "react-router-dom";
import CategoriesList from "./CategoriesList";

const AppNavigationMenubar:FC<WidgetType & {
    categories?: CategoryType[]
}> = function (widget){
  return (
		<nav className="bg-white relative border-t z-30">
			<div className="container hidden lg:block">
				<div className="grid grid-cols-6">
					<div className="">
						<div className="w-full px-4 py-2 bg-primary text-gray-800 flex gap-2 items-center relative">
							<span className="text-lg">
								<CiMenuFries />
							</span>{' '}
							Browse Categories
							<div className="absolute top-full left-0 w-full">
								{widget.categories && (
									<CategoriesList categories={widget.categories} />
								)}
							</div>
						</div>
					</div>
					<div className="col-span-5 w-full flex gap-4 items-center justify-end">
						<div className="flex gap-4">
							<Link className="text-gray-800 py-2" to={'/'}>
								T-Shirts
							</Link>
						</div>

						<div className="flex gap-4">
							<Link className="text-gray-800 py-2" to={'/'}>
								Home
							</Link>
						</div>
					</div>
				</div>
			</div>
		</nav>
	);
}
export default AppNavigationMenubar
