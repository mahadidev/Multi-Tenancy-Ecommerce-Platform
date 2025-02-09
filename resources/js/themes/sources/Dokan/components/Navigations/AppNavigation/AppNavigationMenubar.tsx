import { ThemeComponentPropsType } from '@type/themeComponentType';
import { FC } from 'react';
import { CiMenuFries } from 'react-icons/ci';
import { Link } from 'react-router-dom';

const AppNavigationMenubar: FC<ThemeComponentPropsType> = function (props) {
	let user = null;

	if (props.hooks) {
		const auth = props.hooks.useAuth();
		user = auth.user;
	}

	return (
		<nav className="bg-white relative border-t z-30">
			<div className="container mx-auto hidden lg:block">
				<div className="grid grid-cols-6">
					<div className="">
						<div
							className={`w-full px-4 py-2 text-gray-800 flex gap-2 items-center relative bg-[var(--primary-color)]`}
						>
							<span className="text-lg">
								<CiMenuFries />
							</span>{' '}
							Browse Categories
						</div>
					</div>
					<div className="col-span-5 w-full flex gap-4 items-center justify-end">
						{props.store.pages
							.filter(
								(page) =>
									page.is_active === 1 && page.type.type !== 'authentication' && page.type.type !== "profile"
							)
							.map((page) => (
								<div className="flex gap-4" key={page.id}>
									<Link className="text-gray-800 py-2" to={page.slug}>
										{page.title}
									</Link>
								</div>
							))}

						{user ? (
							<div className="flex gap-4">
								<Link className="text-gray-800 py-2" to={props.store.pages.find((page) => page.type.type === "profile")?.slug ?? "/"}>
									{user.name}
								</Link>
							</div>
						) : (
							props.store.pages
								.filter(
									(page) =>
										page.is_active === 1 && page.type.type === 'authentication'
								)
								.map((page) => (
									<div className="flex gap-4" key={page.id}>
										<Link className="text-gray-800 py-2" to={page.slug}>
											{page.title}
										</Link>
									</div>
								))
						)}
					</div>
				</div>
			</div>
		</nav>
	);
};
export default AppNavigationMenubar;
