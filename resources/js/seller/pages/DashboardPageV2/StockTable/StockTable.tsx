import useProductStockHistory from '@seller/hooks/useProductStockHistory';
import { ProductStockHistoryType } from '@type/productType';
import { Badge, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from 'flowbite-react';
import { Link } from 'react-router-dom';

const StockTable = () => {
	const { histories } = useProductStockHistory({
		range: 'week',
	});

    const getBadgeColor = (type: string) => {
			switch (type) {
				case 'added':
					return 'success';
				case 'deleted':
					return 'failure';
				case 'adjusted':
					return 'warning';
				default:
					return 'gray';
			}
		};

	return (
		<div className="col-span-full rounded-lg bg-white p-4 shadow sm:p-6 xl:p-8 dark:bg-gray-800">
			<div className="mb-4 flex items-center justify-between">
				<div>
					<h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
						Stock History
					</h3>
					<span className="text-base font-normal text-gray-600 dark:text-gray-400">
						This is a list of latest stock history
					</span>
				</div>
				<div className="shrink-0">
					<a
						href="#"
						className="text-primary-700 dark:text-primary-500 rounded-lg p-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700"
					>
						View all
					</a>
				</div>
			</div>
			<div className="mt-8 flex flex-col">
				<div className="overflow-x-auto rounded-lg">
					<div className="inline-block min-w-full align-middle">
						<div className="overflow-hidden shadow sm:rounded-lg">
							<Table
								striped
								className="min-w-full divide-y divide-gray-200 dark:divide-gray-600"
							>
								<TableHead
									className="bg-gray-50 dark:bg-gray-700"
									theme={{
										cell: {
											base: 'p-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-white',
										},
									}}
								>
									<TableHeadCell>Product</TableHeadCell>
									<TableHeadCell>Quantity</TableHeadCell>
									<TableHeadCell>Type</TableHeadCell>
									<TableHeadCell>Created</TableHeadCell>
								</TableHead>
								<TableBody className="bg-white dark:bg-gray-800">
									{histories?.slice(0, 10)
										.map((history: ProductStockHistoryType, index: number) => (
											<TableRow key={`${history.id}-${index}`}>
												<TableCell className="p-4 text-sm font-normal whitespace-nowrap text-gray-900 dark:text-white flex gap-2.5 items-start">
													<div className="w-8 h-8 rounded-full object-center overflow-hidden aspect-square">
														{history.product.thumbnail ? (
															<img
																className="w-full h-full object-cover"
																src={history.product.thumbnail}
																alt="Product Iamge"
															/>
														) : (
															<div className="w-full h-full object-cover bg-gray-300"></div>
														)}
													</div>
													<div>
														<Link
															to={`/products/${history.product_id}`}
															target="_bank"
															className="text-black hover:text-primary transition-all duration-300 font-medium"
														>
															{history.product.name}
														</Link>
														<p className='text-xs'>
															<span className="text-red-400">
																Buying Value {history.product.stockBuyingValue}{' '}
																TK
															</span>{' '}
															-{' '}
															<span className='text-green-400'>
																Selling Value {history.product.stockValue} TK
															</span>
														</p>
													</div>
												</TableCell>
												<TableCell className="p-4 text-sm font-semibold whitespace-nowrap text-gray-900 dark:text-white">
													{history.qty}
												</TableCell>
												<TableCell className="flex p-4 whitespace-nowrap">
													<Badge
														className="rounded-md font-medium uppercase"
														color={getBadgeColor(history.type)}
													>
														{history.type}
													</Badge>
												</TableCell>
												<TableCell className="p-4 text-sm font-semibold whitespace-nowrap text-gray-900 dark:text-white">
													{history.created_at}
												</TableCell>
											</TableRow>
										))}
								</TableBody>
							</Table>
						</div>
					</div>
				</div>
			</div>
			<div className="flex items-center justify-between pt-3 sm:pt-6">
				{/* <DateRangeDropdown /> */}
				<div className="shrink-0">
					<a
						href="#"
						className="text-primary-700 dark:text-primary-500 inline-flex items-center rounded-lg p-2 text-xs font-medium uppercase hover:bg-gray-100 sm:text-sm dark:hover:bg-gray-700"
					>
						Transactions Report
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
export default StockTable;
