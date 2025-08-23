import { PageBreadCrumb } from '@seller/components/PageHeader/PageBreadcrumb';
import { Button } from 'flowbite-react';
import { FC } from 'react';
import { HiChartBar, HiCube, HiTrendingUp, HiUsers, HiShoppingCart } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { RoutePath } from '@seller/seller_env';

const AnalyticsPage: FC = function () {
	const analyticsModules = [
		{
			title: 'Product Stock Analytics',
			description: 'Comprehensive inventory analysis with stock levels, trends, and performance metrics',
			icon: HiCube,
			color: 'blue',
			href: RoutePath.AnalyticsPage.productStock(),
			features: ['Stock Value Tracking', 'Inventory Turnover', 'Low Stock Alerts', 'Profit Analysis']
		},
		{
			title: 'Sales Analytics',
			description: 'Track sales performance, revenue trends, and customer buying patterns',
			icon: HiTrendingUp,
			color: 'green',
			href: '#',
			features: ['Revenue Tracking', 'Sales Trends', 'Top Products', 'Customer Insights'],
			comingSoon: true
		},
		{
			title: 'Customer Analytics',
			description: 'Understand customer behavior, lifetime value, and engagement patterns',
			icon: HiUsers,
			color: 'purple',
			href: '#',
			features: ['Customer Segments', 'Lifetime Value', 'Retention Rates', 'Demographics'],
			comingSoon: true
		},
		{
			title: 'Order Analytics',
			description: 'Monitor order fulfillment, processing times, and delivery performance',
			icon: HiShoppingCart,
			color: 'yellow',
			href: '#',
			features: ['Order Volume', 'Processing Times', 'Fulfillment Rates', 'Shipping Analytics'],
			comingSoon: true
		}
	];

	return (
		<>
			<div className="block items-center justify-between border-b border-gray-200 bg-white sm:flex dark:border-gray-700 dark:bg-gray-800">
				<PageBreadCrumb title="Analytics" items={['Settings', 'Analytics']} />
			</div>
			
			<div className="flex flex-col p-4 space-y-6">
				<div className="bg-white rounded-lg shadow dark:bg-gray-800 p-6">
					<div className="flex items-center justify-between mb-6">
						<div>
							<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
								Analytics Dashboard
							</h2>
							<p className="text-gray-600 dark:text-gray-400 mt-2">
								Comprehensive business intelligence and data insights for your store
							</p>
						</div>
						<HiChartBar className="h-8 w-8 text-blue-500" />
					</div>
					
					{/* Analytics Modules */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{analyticsModules.map((module, index) => {
							const Icon = module.icon;
							const colorClasses = {
								blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 text-blue-600 dark:text-blue-400',
								green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 text-green-600 dark:text-green-400',
								purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700 text-purple-600 dark:text-purple-400',
								yellow: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700 text-yellow-600 dark:text-yellow-400'
							};

							return (
								<div
									key={index}
									className={`relative p-6 rounded-lg border-2 ${colorClasses[module.color as keyof typeof colorClasses]} transition-all hover:shadow-lg`}
								>
									{module.comingSoon && (
										<div className="absolute top-2 right-2">
											<span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs px-2 py-1 rounded-full">
												Coming Soon
											</span>
										</div>
									)}

									<div className="flex items-start space-x-4">
										<div className="flex-shrink-0">
											<Icon className="h-8 w-8" />
										</div>
										<div className="flex-1">
											<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
												{module.title}
											</h3>
											<p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
												{module.description}
											</p>
											
											<div className="space-y-2 mb-4">
												{module.features.map((feature, featureIndex) => (
													<div key={featureIndex} className="flex items-center space-x-2">
														<div className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
														<span className="text-xs text-gray-600 dark:text-gray-400">
															{feature}
														</span>
													</div>
												))}
											</div>

											<div className="pt-4">
												{module.comingSoon ? (
													<Button
														size="sm"
														color="gray"
														disabled
														className="w-full opacity-50"
													>
														Coming Soon
													</Button>
												) : (
													<Link to={module.href} className="block">
														<Button
															size="sm"
															color="primary"
															className="w-full"
														>
															View Analytics
														</Button>
													</Link>
												)}
											</div>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</>
	);
};

export default AnalyticsPage;