import SalesChart from './SalesChart/SalesChart';
import StockChart from './StockChart/StockChart';
import StockTable from './StockTable/StockTable';
import TrendingProducts from './TrendingProducts/TrendingProducts';

const DashboardPageV2 = () => {
	return (
		<div className="px-4 pt-6 w-full space-y-6">
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 auto-rows-max">
				<SalesChart />
				<TrendingProducts className="xl:col-span-1" />

				<StockChart />
				{/* <VisitorChart /> */}
				{/* <ExpenseChart /> */}
				<StockTable />
			</div>
		</div>
	);
};
export default DashboardPageV2;
