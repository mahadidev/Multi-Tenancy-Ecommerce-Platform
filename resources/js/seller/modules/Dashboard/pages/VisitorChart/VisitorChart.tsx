import { Spinner } from 'flowbite-react';
import { FC } from 'react';
import { HiEye } from 'react-icons/hi';
import { useDashboard } from '../../hooks';

interface VisitorChartProps {
	className?: string;
}

const VisitorChart: FC<VisitorChartProps> = ({ className = '' }) => {
	const { 
		analytics, 
		isAnalyticsLoading 
	} = useDashboard({
		enableAnalytics: true
	});

	// Loading state
	if (isAnalyticsLoading || !analytics) {
		return (
			<div className={`bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700 p-6 ${className}`}>
				<div className="flex items-center justify-center h-32">
					<div className="text-center">
						<Spinner size="lg" className="mb-3" />
						<p className="text-gray-500 dark:text-gray-400 text-sm">
							Loading visitor data...
						</p>
					</div>
				</div>
			</div>
		);
	}

	// Extract visitor metrics
	const totalVisitors = analytics.visitor_count || 0;
	const uniqueVisitors = analytics.unique_visitor_count || 0;
	const todayVisitors = analytics.unique_visitor_today_count || 0;
	const customers = analytics.customers_count || 0;

	// Calculate conversion rate (customers/unique visitors)
	const conversionRate = uniqueVisitors > 0 ? (customers / uniqueVisitors) * 100 : 0;

	// Calculate engagement metrics
	const returnVisitorRate = totalVisitors > 0 ? ((totalVisitors - uniqueVisitors) / totalVisitors) * 100 : 0;

	return (
		<div className={`bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700 ${className}`}>
			{/* Minimal Header */}
			<div className="p-4 border-b border-gray-200 dark:border-gray-700">
				<div className="flex items-center space-x-2">
					<HiEye className="h-4 w-4 text-blue-600 dark:text-blue-400" />
					<h3 className="text-base font-medium text-gray-900 dark:text-white">Visitor Overview</h3>
				</div>
			</div>

			{/* Simple Metrics Grid */}
			<div className="p-4">
				<div className="grid grid-cols-2 gap-4">
					{/* Total Visitors */}
					<div className="text-center">
						<div className="text-2xl font-bold text-gray-900 dark:text-white">
							{totalVisitors.toLocaleString()}
						</div>
						<div className="text-sm text-gray-500 dark:text-gray-400">
							Total Visitors
						</div>
					</div>

					{/* Unique Visitors */}
					<div className="text-center">
						<div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
							{uniqueVisitors.toLocaleString()}
						</div>
						<div className="text-sm text-gray-500 dark:text-gray-400">
							Unique Visitors
						</div>
					</div>

					{/* Today's Visitors */}
					<div className="text-center">
						<div className="text-2xl font-bold text-green-600 dark:text-green-400">
							{todayVisitors.toLocaleString()}
						</div>
						<div className="text-sm text-gray-500 dark:text-gray-400">
							Today's Visitors
						</div>
					</div>

					{/* Customers */}
					<div className="text-center">
						<div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
							{customers.toLocaleString()}
						</div>
						<div className="text-sm text-gray-500 dark:text-gray-400">
							Customers
						</div>
					</div>
				</div>

				{/* Conversion Rate Progress Bar */}
				<div className="mt-6">
					<div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
						<span>Conversion Rate</span>
						<span>{conversionRate.toFixed(1)}%</span>
					</div>
					<div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
						<div 
							className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
							style={{ 
								width: `${Math.min(conversionRate, 100)}%` 
							}}
						></div>
					</div>
					<div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
						<span>Low</span>
						<span>High</span>
					</div>
				</div>

				{/* Return Visitor Rate */}
				<div className="mt-4">
					<div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
						<span>Return Visitors</span>
						<span>{returnVisitorRate.toFixed(1)}%</span>
					</div>
					<div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
						<div 
							className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
							style={{ 
								width: `${Math.min(returnVisitorRate, 100)}%` 
							}}
						></div>
					</div>
					<div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
						<span>New</span>
						<span>Returning</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default VisitorChart;