import { CiMenuFries } from "react-icons/ci";
import { Link } from "react-router-dom";

const AppNavigationMenubar = () => {
  return (
		<nav className="bg-white relative border-t z-30">
			{/* desktop menu bar */}
			<div className="container justify-between gap-2 hidden lg:flex">
				<div className="flex gap-4">
					<p className="px-4 py-2 w-[250px] bg-primary text-gray-800 flex gap-2 items-center">
						<span className="text-lg">
							<CiMenuFries />
						</span>{' '}
						Browse Categories
					</p>

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
			{/* desktop menu bar end */}

			{/* mobile menu bar */}
			<div className="container flex lg:hidden justify-between gap-2 flex-wrap py-2">
				<span className="text-gray-800 text-2xl z-30">
					<CiMenuFries />
				</span>

				<div className="flex gap-4">
					<Link className="text-gray-800" to={'/'}>
						Home
					</Link>
				</div>
			</div>
			{/* mobile menu bar end */}

			{/* sidebar */}
			<aside
				className="absolute top-full left-0 bg-white w-full max-w-[500px] h-screen border-t"
			>
				<h2 className="text-xl pl-4 py-2 border-b">Categories</h2>
				<div className="w-full mt-2">

						<Link
							className="w-full block py-2 px-4 hover:bg-gray-100 transition-all"
							to={"/"}
						>
							Computers
						</Link>

				</div>

				<h2 className="text-xl mt-4 pl-4 py-2 border-b">Menu</h2>
				<div className="w-full mt-2">

						<Link
							className="w-full block py-2 px-4 hover:bg-gray-100 transition-all"
							to={"/"}
						>
							Home
						</Link>

				</div>
			</aside>
			{/* sidebar end */}
		</nav>
	);
}
export default AppNavigationMenubar
