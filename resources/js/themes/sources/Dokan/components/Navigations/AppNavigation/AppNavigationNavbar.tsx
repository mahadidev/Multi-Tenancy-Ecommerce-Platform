import { CiSearch, CiShoppingCart } from 'react-icons/ci';
import { Link } from 'react-router-dom';

const AppNavigationNavbar = () => {
	return (
		<div className="py-2">
			<div className="container flex justify-between">
				<Link className="w-12 sm:w-max" to="/">
					<img
						className="max-w-[60px] w-full aspect-square"
						src={'https://cholgori-com-1.vercel.app/images/logo.svg'}
						alt="Logo"
					/>
				</Link>

				<div className="flex items-center gap-4">
					<div className="items-stretch mr-4 hidden sm:flex">
						<input
							className="px-3 py-2 bg-gray-100"
							type="text"
							placeholder="search..."
						/>
						<button className="bg-primary text-gray-800 px-3 text-lg">
							<CiSearch />
						</button>
					</div>

					<button className="text-gray-500 text-2xl sm:hidden">
						<CiSearch />
					</button>

					<Link to="/cart" className="flex gap-3 items-center text-gray-800">
						<span className="text-gray-500 text-2xl relative">
							<CiShoppingCart />
							<span className="absolute -top-2 -right-2 bg-primary text-gray-900 w-5 h-5 text-xs rounded-full flex items-center justify-center">
								0
							</span>
						</span>
						10$
					</Link>
				</div>
			</div>
		</div>
	);
};
export default AppNavigationNavbar;
