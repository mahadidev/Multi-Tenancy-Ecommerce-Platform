import { WidgetType } from "@/types/widgetType";
import { StoreType } from "@type/storeType";
import { FC } from "react";
import { CiMenuFries } from "react-icons/ci";
import { Link } from "react-router-dom";

const AppNavigationMenubar:FC<{
    widget: WidgetType,
    store: StoreType
}> = function (){
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
