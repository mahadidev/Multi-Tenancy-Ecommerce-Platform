import useOrders from '@seller/hooks/useOrders';
import { TopProductType } from '@type/orderType';

const TrendingProducts = () => {
	const { report: orderReport } = useOrders({});

	return (
		<div className="mb-4 h-full rounded-lg bg-white p-4 shadow sm:p-6 dark:bg-gray-800">
			<div className="mb-4 flex items-center justify-between">
				<h3 className="text-xl leading-none font-bold text-gray-900 dark:text-white">
					Trending Products
				</h3>
				<a
					href="#"
					className="text-primary-700 dark:text-primary-500 inline-flex items-center rounded-lg p-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700"
				>
					View all
				</a>
			</div>
			<div className="flow-root">
				<ul className="divide-y divide-gray-200 dark:divide-gray-700">
					{orderReport?.top_products.map((topProduct: TopProductType) => (
						<li key={topProduct.product_id} className="py-3 sm:py-4">
							<div className="flex items-center space-x-4">
								<div className="shrink-0">
									<div className="w-8 h-8 rounded-full object-center overflow-hidden">
										{topProduct.product?.thumbnail ? (
											<img
												className="w-full h-full object-fill"
												src={topProduct.product.thumbnail}
												alt="Product Iamge"
											/>
										) : (
											<div className="w-full h-full bg-gray-300"></div>
										)}
									</div>
								</div>
								<div className="min-w-0 flex-1">
									<p className="truncate text-sm font-medium text-gray-900 dark:text-white">
										{topProduct.product?.name}
									</p>
									<p className="truncate text-sm text-gray-500 dark:text-gray-400">
										Sales this {orderReport.period} {topProduct.total_quantity}
									</p>
								</div>
								<div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
									৳{topProduct.total_revenue}
								</div>
							</div>
						</li>
					))}
				</ul>
			</div>
			<div className="flex items-center justify-between border-t border-gray-200 pt-3 sm:pt-6 dark:border-gray-700">
				{/* <DateRangeDropdown /> */}
				<div className="shrink-0">
					<a
						href="#"
						className="text-primary-700 dark:text-primary-500 inline-flex items-center rounded-lg p-2 text-xs font-medium uppercase hover:bg-gray-100 sm:text-sm dark:hover:bg-gray-700"
					>
						Export Report
						<svg
							className="ml-1 h-4 w-4 sm:h-5 sm:w-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 5l7 7-7 7"
							/>
						</svg>
					</a>
				</div>
			</div>
		</div>
	);
};
export default TrendingProducts;
