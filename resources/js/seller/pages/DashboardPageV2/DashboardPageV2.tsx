import ExpenseChart from './ExpenseChart/ExpenseChart';
import SalesChart from './SalesChart/SalesChart';
import StockChart from './StockChart/StockChart';
import StockTable from './StockTable/StockTable';
import TrendingProducts from './TrendingProducts/TrendingProducts';
import VisitorChart from './VisitorChart/VisitorChart';

const DashboardPageV2 = () => {
	return (
		<div className="px-4 pt-6 grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
			<SalesChart />
			<TrendingProducts />
			<StockChart />
			<VisitorChart />
			<ExpenseChart />
			<StockTable />
		</div>
	);
};
export default DashboardPageV2;
