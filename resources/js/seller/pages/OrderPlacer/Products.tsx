import { DataTable } from '@seller/components';
import useProduct from '@seller/hooks/useProduct';
import { addCartItem } from '@seller/store/slices/orderPlacerSlice';
import { useAppDispatch } from '@seller/store/store';
import { ProductType } from '@type/productType';
import { Button, Table } from 'flowbite-react';
import { IoClose } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import uuid4 from 'uuid4';

const Products = () => {
	const { products } = useProduct();
	const dispatch = useAppDispatch();

	const onAddProduct = (product: ProductType) => {
		const qty = 1;
		const price = product.price * qty;
        const discount_price = product.discount_price * qty;
        const tax = product.tax * qty;


		if (Number(product.stock ?? 0) > 0) {
			dispatch(
				addCartItem({
					uniqueID: uuid4(),
					qty: qty,
					product: product,
					price: price,
					discount_price: discount_price,
					tax: tax,
				})
			);
		}
	};

	const onSubmit = ({
		event,
		setSearchQuery,
	}: {
		event: React.FormEvent<HTMLFormElement>;
		setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
	}) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const searchInput = formData.get('search-input') as string;
		const product = products.find((product: ProductType) => product.sku === searchInput);

		if (product) {
			if (Number(product.stock) > 0) {
				setSearchQuery('');
			}
			onAddProduct(product);
		}
	};

	return (
		<>
			<div className="mb-6 hidden items-center sm:flex  justify-between">
				<h1 className="dark:text-white text-2xl font-semibold">
					Welcome to Banzo
				</h1>

				<Link to="/products">
					<IoClose size={23} className="cursor-pointer" />
				</Link>
			</div>

			<DataTable
				columns={[
					{
						render: (row: ProductType) => (
							<Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white flex gap-4 items-center">
								<div className=" w-max h-max relative">
									{row.discount_amount && (
										<div className="absolute -top-4 -right-5 rounded-full px-2 py-1 flex justify-center items-center bg-blue-700 text-white text-sm">
											{row.discount_amount}{' '}
											{row.discount_type === 'flat' ? 'tk' : '%'}
										</div>
									)}
									<img
										src={row.thumbnail}
										className="w-12 h-12 aspect-square object-fit rounded-sm"
										alt="Thumbnail"
									/>
								</div>
								{row.name}
							</Table.Cell>
						),
					},
					{
						render: (row: ProductType) => (
							<Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
								{row?.stock && <>{row.stock} stock</>}
							</Table.Cell>
						),
					},
					{
						render: (row: ProductType) => (
							<Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
								{row?.price} TK.
							</Table.Cell>
						),
					},
					{
						render: (row: ProductType) => (
							<Table.Cell>
								{' '}
								<div className="flex items-center gap-x-3 whitespace-nowrap justify-end">
									<Button
										onClick={() => onAddProduct(row)}
										size="sm"
										color="primary"
										className="p-0"
									>
										<div className="flex items-center gap-x-2">Add to Cart</div>
									</Button>
								</div>
							</Table.Cell>
						),
					},
				]}
				data={products}
				filename="products"
				disableSl
				disableHead
				search={{
					placeholder: 'Search product',
					columns: ['sku', 'name'],
					onSearchSubmit: onSubmit,
					autoFocus: true,
				}}
			/>
		</>
	);
};
export default Products;
