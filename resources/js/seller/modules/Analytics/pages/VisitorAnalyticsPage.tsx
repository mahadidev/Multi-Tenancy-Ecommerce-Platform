import CustomDateRangeSelector from '@seller/components/DatePicker/CustomDateRangeSelector';
import { ApexOptions } from 'apexcharts';
import { Badge, Button, Card, Spinner, Tabs } from 'flowbite-react';
import React, { useCallback, useEffect, useState } from 'react';
import ApexCharts from 'react-apexcharts';
import {
    HiChartBar,
    HiClock,
    HiDesktopComputer,
    HiDeviceMobile,
    HiEye,
    HiGlobeAlt,
    HiLocationMarker,
    HiRefresh,
    HiTrendingUp,
    HiUsers
} from 'react-icons/hi';

interface VisitorAnalyticsPageProps {
	className?: string;
}

type FilterType = 'today' | 'week' | 'month' | 'year' | 'custom';

interface VisitorAnalytics {
	totalVisitors: number;
	uniqueVisitors: number;
	pageViews: number;
	sessions: number;
	bounceRate: number;
	avgSessionDuration: number;
	visitorsData: any[];
	topPages: any[];
	deviceStats: any[];
	locationStats: any[];
	daily_trend: Array<{
		date: string;
		visits: number;
		unique_visits: number;
	}>;
	device_analytics: Array<{
		device_type: string;
		count: number;
	}>;
	overview: {
		total_visitors: number;
		unique_visitors: number;
		bounce_rate: number;
		avg_session_duration: number;
	};
	page_views: Array<{
		page_url: string;
		views: number;
		unique_views: number;
	}>;
	traffic_sources: Array<{
		source: string;
		count: number;
		unique_count: number;
	}>;
	geographic_analytics: {
		countries: Array<{
			country: string;
			count: number;
			unique_count: number;
		}>;
	};
}

interface VisitorRealTime {
	currentVisitors: number;
	visitorsSources: any[];
	recentActions: any[];
	active_visitors: number;
	recent_visitors: Array<{
		id: string;
		device_type: string;
		page_url: string;
		city: string;
		country: string;
		browser: string;
		time_ago: string;
	}>;
}

const VisitorAnalyticsPage: React.FC<VisitorAnalyticsPageProps> = ({ className = '' }) => {
	const [analytics, setAnalytics] = useState<VisitorAnalytics | null>(null);
	const [realTimeData, setRealTimeData] = useState<VisitorRealTime | null>(null);
	const [loading, setLoading] = useState(true);
	const [filter, setFilter] = useState<FilterType>('month');
	const [customDateRange, setCustomDateRange] = useState<{ start: string; end: string } | null>(null);

	// Fetch analytics data
	const fetchAnalytics = useCallback(async () => {
		setLoading(true);
		try {
			const params = new URLSearchParams({
				filter,
				...(customDateRange && filter === 'custom' ? customDateRange : {})
			});

			const response = await fetch(`/api/v1/seller/analytics/visitors?${params}`);
			const data = await response.json();

			if (data.status === 200) {
				setAnalytics(data.data);
			}
		} catch (error) {
			console.error('Error fetching visitor analytics:', error);
		} finally {
			setLoading(false);
		}
	}, [filter, customDateRange]);

	// Fetch real-time data
	const fetchRealTime = useCallback(async () => {
		try {
			const response = await fetch('/api/v1/seller/analytics/visitors/realtime');
			const data = await response.json();

			if (data.status === 200) {
				setRealTimeData(data.data);
			}
		} catch (error) {
			console.error('Error fetching real-time data:', error);
		}
	}, []);


	useEffect(() => {
		fetchAnalytics();
		fetchRealTime();

		// Set up real-time updates
		const interval = setInterval(() => {
			fetchRealTime();
		}, 30000); // Update every 30 seconds

		return () => clearInterval(interval);
	}, [filter, customDateRange, fetchAnalytics, fetchRealTime]);


	// Chart configurations
	const getVisitorTrendChart = (): { options: ApexOptions; series: any[] } => {
		if (!analytics?.daily_trend) return { options: {}, series: [] };

		const categories = analytics.daily_trend.map((item) =>
			new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
		);

		return {
			options: {
				chart: {
					type: 'area',
					toolbar: { show: false },
					sparkline: { enabled: false }
				},
				dataLabels: { enabled: false },
				stroke: { curve: 'smooth', width: 2 },
				xaxis: { categories },
				colors: ['#3B82F6', '#10B981'],
				fill: {
					type: 'gradient',
					gradient: {
						shadeIntensity: 1,
						opacityFrom: 0.4,
						opacityTo: 0.1
					}
				}
			},
			series: [
				{
					name: 'Total Visits',
					data: analytics.daily_trend.map((item) => item.visits)
				},
				{
					name: 'Unique Visits',
					data: analytics.daily_trend.map((item) => item.unique_visits)
				}
			]
		};
	};

	const getDeviceChart = (): { options: ApexOptions; series: number[] } => {
		if (!analytics?.device_analytics) return { options: {}, series: [] };

		return {
			options: {
				chart: { type: 'donut' },
				labels: analytics.device_analytics.map((item) =>
					item.device_type.charAt(0).toUpperCase() + item.device_type.slice(1)
				),
				colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
				legend: { position: 'bottom' }
			},
			series: analytics.device_analytics.map((item) => item.count)
		};
	};

	const formatDuration = (seconds: number): string => {
		const minutes = Math.floor(seconds / 60);
		const hours = Math.floor(minutes / 60);

		if (hours > 0) {
			return `${hours}h ${minutes % 60}m`;
		}
		return `${minutes}m ${seconds % 60}s`;
	};

	const getDeviceIcon = (deviceType: string) => {
		switch (deviceType.toLowerCase()) {
			case 'mobile':
				return <HiDeviceMobile className="h-4 w-4" />;
			case 'tablet':
				return <HiDesktopComputer className="h-4 w-4" />;
			default:
				return <HiDesktopComputer className="h-4 w-4" />;
		}
	};

	if (loading && !analytics) {
		return (
			<div className="flex items-center justify-center h-96">
				<div className="text-center">
					<Spinner size="xl" />
					<p className="mt-4 text-gray-500">Loading visitor analytics...</p>
				</div>
			</div>
		);
	}

	const trendChart = getVisitorTrendChart();
	const deviceChart = getDeviceChart();

	return (
		<div className={`space-y-6 ${className}`}>
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white">
						Visitor Analytics
					</h1>
					<p className="text-gray-500 dark:text-gray-400">
						Track and analyze your website visitors
					</p>
				</div>
				<div className="flex items-center space-x-4">
					<CustomDateRangeSelector
						currentRange={filter}
						onRangeChange={(range, customRange) => {
							setFilter(range);
							if (customRange) {
								setCustomDateRange({ start: customRange.startDate, end: customRange.endDate });
							} else {
								setCustomDateRange(null);
							}
						}}
						customRange={customDateRange ? { startDate: customDateRange.start, endDate: customDateRange.end } : undefined}
					/>
					<Button
						size="sm"
						color="gray"
						onClick={fetchAnalytics}
						disabled={loading}
					>
						<HiRefresh className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
					</Button>
				</div>
			</div>

			{/* Overview Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<Card>
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-500 dark:text-gray-400">Total Visitors</p>
							<p className="text-2xl font-bold text-gray-900 dark:text-white">
								{analytics?.overview.total_visitors.toLocaleString() || 0}
							</p>
						</div>
						<div className="p-3 bg-blue-100 rounded-full dark:bg-blue-900">
							<HiUsers className="h-6 w-6 text-blue-600 dark:text-blue-300" />
						</div>
					</div>
				</Card>

				<Card>
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-500 dark:text-gray-400">Unique Visitors</p>
							<p className="text-2xl font-bold text-gray-900 dark:text-white">
								{analytics?.overview.unique_visitors.toLocaleString() || 0}
							</p>
						</div>
						<div className="p-3 bg-green-100 rounded-full dark:bg-green-900">
							<HiEye className="h-6 w-6 text-green-600 dark:text-green-300" />
						</div>
					</div>
				</Card>

				<Card>
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-500 dark:text-gray-400">Bounce Rate</p>
							<p className="text-2xl font-bold text-gray-900 dark:text-white">
								{analytics?.overview.bounce_rate || 0}%
							</p>
						</div>
						<div className="p-3 bg-yellow-100 rounded-full dark:bg-yellow-900">
							<HiTrendingUp className="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
						</div>
					</div>
				</Card>

				<Card>
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-500 dark:text-gray-400">Avg. Session</p>
							<p className="text-2xl font-bold text-gray-900 dark:text-white">
								{formatDuration(analytics?.overview.avg_session_duration || 0)}
							</p>
						</div>
						<div className="p-3 bg-purple-100 rounded-full dark:bg-purple-900">
							<HiClock className="h-6 w-6 text-purple-600 dark:text-purple-300" />
						</div>
					</div>
				</Card>
			</div>

			{/* Real-time Visitors */}
			<Card>
				<div className="flex items-center justify-between mb-4">
					<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
						Real-time Visitors
					</h3>
					<Badge color="green" size="sm">
						{realTimeData?.active_visitors || 0} active
					</Badge>
				</div>
				<div className="space-y-2">
					{realTimeData?.recent_visitors.slice(0, 5).map((visitor) => (
						<div key={visitor.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg dark:bg-gray-700">
							<div className="flex items-center space-x-3">
								{getDeviceIcon(visitor.device_type)}
								<div>
									<p className="text-sm font-medium text-gray-900 dark:text-white">
										{visitor.page_url?.split('/').pop() || 'Homepage'}
									</p>
									<p className="text-xs text-gray-500 dark:text-gray-400">
										{visitor.city}, {visitor.country} • {visitor.browser}
									</p>
								</div>
							</div>
							<span className="text-xs text-gray-500 dark:text-gray-400">
								{visitor.time_ago}
							</span>
						</div>
					))}
				</div>
			</Card>

			{/* Charts */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Visitor Trend Chart */}
				<Card>
					<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
						Visitor Trends
					</h3>
					{trendChart.series.length > 0 ? (
						<ApexCharts
							options={trendChart.options}
							series={trendChart.series}
							type="area"
							height={300}
						/>
					) : (
						<div className="h-64 flex items-center justify-center text-gray-500">
							No data available
						</div>
					)}
				</Card>

				{/* Device Distribution */}
				<Card>
					<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
						Device Distribution
					</h3>
					{deviceChart.series.length > 0 ? (
						<ApexCharts
							options={deviceChart.options}
							series={deviceChart.series}
							type="donut"
							height={300}
						/>
					) : (
						<div className="h-64 flex items-center justify-center text-gray-500">
							No data available
						</div>
					)}
				</Card>
			</div>

			{/* Detailed Analytics Tabs */}
			<Card>
				<Tabs aria-label="Analytics tabs" variant="underline">
					<Tabs.Item active title="Top Pages" icon={HiChartBar}>
						<div className="space-y-4">
							{analytics?.page_views.map((page, index) => (
								<div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg dark:bg-gray-700">
									<div>
										<p className="font-medium text-gray-900 dark:text-white">
											{page.page_url?.split('/').pop() || 'Homepage'}
										</p>
										<p className="text-sm text-gray-500 dark:text-gray-400">
											{page.page_url}
										</p>
									</div>
									<div className="text-right">
										<p className="font-medium text-gray-900 dark:text-white">
											{page.views.toLocaleString()} views
										</p>
										<p className="text-sm text-gray-500 dark:text-gray-400">
											{page.unique_views} unique
										</p>
									</div>
								</div>
							))}
						</div>
					</Tabs.Item>

					<Tabs.Item title="Traffic Sources" icon={HiGlobeAlt}>
						<div className="space-y-4">
							{analytics?.traffic_sources.map((source, index) => (
								<div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg dark:bg-gray-700">
									<div>
										<p className="font-medium text-gray-900 dark:text-white">
											{source.source}
										</p>
									</div>
									<div className="text-right">
										<p className="font-medium text-gray-900 dark:text-white">
											{source.count.toLocaleString()} visits
										</p>
										<p className="text-sm text-gray-500 dark:text-gray-400">
											{source.unique_count} unique
										</p>
									</div>
								</div>
							))}
						</div>
					</Tabs.Item>

					<Tabs.Item title="Locations" icon={HiLocationMarker}>
						<div className="space-y-4">
							{analytics?.geographic_analytics.countries.map((country, index) => (
								<div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg dark:bg-gray-700">
									<div>
										<p className="font-medium text-gray-900 dark:text-white">
											{country.country}
										</p>
									</div>
									<div className="text-right">
										<p className="font-medium text-gray-900 dark:text-white">
											{country.count.toLocaleString()} visits
										</p>
										<p className="text-sm text-gray-500 dark:text-gray-400">
											{country.unique_count} unique
										</p>
									</div>
								</div>
							))}
						</div>
					</Tabs.Item>
				</Tabs>
			</Card>
		</div>
	);
};

export default VisitorAnalyticsPage;
