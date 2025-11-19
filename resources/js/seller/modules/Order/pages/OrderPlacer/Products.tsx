/* eslint-disable react-hooks/exhaustive-deps */
import useProduct from '@seller/_hooks/useProduct';
import { DataTable } from '@seller/components';
import { addCartItem } from '@seller/store/slices/orderPlacerSlice';
import { useAppDispatch } from '@seller/store/store';
import { OrderPlacerCartItemType } from '@type/orderPlacer';
import {
    ProductStockType,
    ProductType,
    ProductVariantOptionType,
} from '@type/productType';
import { Alert, Badge, Button, Modal, Table } from 'flowbite-react';
import { useEffect, useMemo, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { MdClose } from 'react-icons/md';
import { Link } from 'react-router-dom';
import uuid4 from 'uuid4';


type SelectedOptions = {
	[variantId: number]: ProductVariantOptionType | null;
};

type Combination = {
	stock: ProductStockType;
	options: number[];
};

type StockInfo = {
	stock: ProductStockType;
	quantity: number;
} | null;

const Products = () => {
	const { products } = useProduct({});
	const dispatch = useAppDispatch();
	const [showVariantModal, setVariantModal] = useState<boolean>(false);
	const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(
		null
	);
	const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({});

	// Calculate all available variant combinations
	const availableCombinations: Combination[] = useMemo(() => {
		if (!selectedProduct?.stocks) return [];

		return selectedProduct.stocks
			.filter((stock): stock is ProductStockType => !!stock && stock.qty > 0)
			.map((stock) => ({
				stock,
				options: stock.stock_items
					.map((item) => item.variant_option?.id)
					.filter((id): id is number => !!id),
			}));
	}, [selectedProduct]);

	// Find valid combinations matching current selections
	const findValidCombinations = (
		selections: SelectedOptions
	): Combination[] => {
		if (!selectedProduct || availableCombinations.length === 0) return [];

		const selectedOptionIds = Object.values(selections)
			.filter((opt): opt is ProductVariantOptionType => opt !== null)
			.map((opt) => opt.id);

		return availableCombinations.filter((comb) =>
			selectedOptionIds.every((id) => comb.options.includes(id))
		);
	};

	// Handle option selection with auto-adjustment
	const handleOptionSelect = (
		variantId: number,
		option: ProductVariantOptionType
	) => {
		const newSelections = {
			...selectedOptions,
			[variantId]: option,
		};

		const validCombos = findValidCombinations(newSelections);

		if (validCombos.length > 0) {
			setSelectedOptions(newSelections);
		} else {
			const adjustedSelections: SelectedOptions = { [variantId]: option };

			// Try to preserve compatible selections
			selectedProduct?.variants?.forEach((variant) => {
				if (variant.id === variantId) return;

				const currentSelection = selectedOptions[variant.id];
				if (currentSelection) {
					const testSelections = {
						...adjustedSelections,
						[variant.id]: currentSelection,
					};
					if (findValidCombinations(testSelections).length > 0) {
						adjustedSelections[variant.id] = currentSelection;
					}
				}
			});

			// Fill remaining variants with first compatible option
			selectedProduct?.variants?.forEach((variant) => {
				if (!adjustedSelections[variant.id]) {
					const compatibleOption = variant.options.find((opt) => {
						const testSelections = { ...adjustedSelections, [variant.id]: opt };
						return findValidCombinations(testSelections).length > 0;
					});
					if (compatibleOption) {
						adjustedSelections[variant.id] = compatibleOption;
					}
				}
			});

			setSelectedOptions(adjustedSelections);
		}
	};

	// Initialize options when product is selected
	useEffect(() => {
		if (selectedProduct?.variants) {
			const initialOptions: SelectedOptions = {};

			selectedProduct.variants.forEach((variant) => {
				const firstAvailable = variant.options.find((option) =>
					availableCombinations.some((comb) => comb.options.includes(option.id))
				);
				initialOptions[variant.id] = firstAvailable || null;
			});

			setSelectedOptions(initialOptions);
		}
	}, [selectedProduct, availableCombinations]);

	// Get current stock info
	const currentStockInfo: StockInfo = useMemo(() => {
		const validCombos = findValidCombinations(selectedOptions);
		if (!validCombos || !validCombos[0] || validCombos.length === 0) return null;

		return {
			stock: validCombos[0].stock,
			quantity: validCombos.reduce((sum, comb) => sum + comb.stock.qty, 0),
		};
	}, [selectedOptions, availableCombinations]);

	const addToCartWithVariants = () => {
		if (!currentStockInfo || !selectedProduct) return;
		addProductToCart(selectedProduct, currentStockInfo.stock);
		dissmissModal();
	};

	const addProductToCart = (product: ProductType, stock: ProductStockType) => {
		const orderItem: OrderPlacerCartItemType = {
			uniqueID: uuid4(),
			product,
			stock,
			qty: 1,
			price: stock.price,
			discount_price:
				product.discount_type === 'flat'
					? stock.price - stock.discount_amount
					: stock.price * (1 - stock.discount_amount / 100),
			discount_amount: stock.discount_amount,
			tax: stock.tax,
		};
		dispatch(addCartItem(orderItem));
	};

	const onAddProduct = (product: ProductType) => {
		if (product.has_variants) {
			setSelectedProduct(product);
			setVariantModal(true);
		} else if (product.stocks?.[0]) {
			addProductToCart(product, product.stocks[0]);
		}
	};

	const dissmissModal = () => {
		setSelectedProduct(null);
		setSelectedOptions({});
		setVariantModal(false);
	};

	const allOptionsSelected = selectedProduct?.variants?.every(
		(variant) => selectedOptions[variant.id] !== null
	);

	return (
		<>

			<Modal show={showVariantModal} onClose={dissmissModal} size="lg">
				<div className="p-6 relative">
					<button className="absolute top-4 right-4" onClick={dissmissModal}>
						<MdClose size={24} className="text-gray-500 hover:text-gray-700" />
					</button>

					<div className="flex items-start mb-4">
						<img
							src={selectedProduct?.thumbnail || ''}
							className="w-16 h-16 object-cover rounded-md mr-4"
							alt={selectedProduct?.name || ''}
						/>
						<div>
							<h1 className="text-xl font-bold">
								{selectedProduct?.name || 'Product'}
							</h1>
							<p className="text-gray-600">{selectedProduct?.price || 0} TK</p>
						</div>
					</div>

					<div className="space-y-6">
						{selectedProduct?.variants?.map((variant) => (
							<div key={variant.id}>
								<h3 className="font-medium mb-3 text-gray-700">
									{variant.label}
									<span className="text-red-500 ml-1">*</span>
								</h3>
								<div className="flex flex-wrap gap-2">
									{variant.options.map((option) => {
										const isSelected =
											selectedOptions[variant.id]?.id === option.id;
										return (
											<Button
												key={option.id}
												color={isSelected ? 'blue' : 'gray'}
												outline={!isSelected}
												onClick={() => handleOptionSelect(variant.id, option)}
												className={`transition-all ${
													isSelected ? 'ring-2 ring-blue-500' : ''
												}`}
											>
												{option.label}
											</Button>
										);
									})}
								</div>
							</div>
						))}

						{currentStockInfo ? (
							<div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
								<span className="font-medium">
									Available: {currentStockInfo.quantity} pc(s)
								</span>
								<Badge color="success">In Stock</Badge>
							</div>
						) : (
							<Alert color="warning">
								No available combinations with current selections
							</Alert>
						)}

						{allOptionsSelected && currentStockInfo ? (
							<Button
								color="primary"
								className="w-full mt-4 py-3"
								onClick={addToCartWithVariants}
							>
								Add to Cart - {selectedProduct?.price} TK
							</Button>
						) : (
							<div className="mt-4 p-3 bg-yellow-50 text-yellow-800 rounded-lg text-center">
								{Object.values(selectedOptions).some((opt) => opt) ? (
									<p>Please select all required options</p>
								) : (
									<p>Select your preferred options above</p>
								)}
							</div>
						)}
					</div>
				</div>
			</Modal>

			<div className="mb-6 hidden items-center sm:flex justify-between">
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
								<div className="w-max h-max relative">
									{row.has_discount &&
									row.discount_amount &&
									row.discount_amount > 0 ? (
										<div className="absolute -top-4 -right-5 rounded-full px-2 py-1 flex justify-center items-center bg-blue-700 text-white text-sm">
											{row.discount_amount}{' '}
											{row.discount_type === 'flat' ? 'tk' : '%'}
										</div>
									) : (
										<></>
									)}
									<img
										src={row.thumbnail || ''}
										className="w-12 h-12 aspect-square object-fit rounded-sm"
										alt={row.name}
									/>
								</div>
								{row.name}
							</Table.Cell>
						),
					},
					{
						render: (row: ProductType) => (
							<Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
								{row.stockQty}
							</Table.Cell>
						),
					},
					{
						render: (row: ProductType) => (
							<Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
								{row.price || 0} TK.
							</Table.Cell>
						),
					},
					{
						render: (row: ProductType) => (
							<Table.Cell>
								<div className="flex items-center gap-x-3 whitespace-nowrap justify-end">
									<Button
										onClick={() => onAddProduct(row)}
										size="sm"
										color="primary"
										className="p-0"
									>
										<div className="flex items-center gap-x-2">
											{row.has_variants ? "Select Variant" : "Add to cart"}
										</div>
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
					onSearchSubmit: ({ event, setSearchQuery }) => {
						event.preventDefault();
						const formData = new FormData(event.currentTarget);
						const searchInput = formData.get('search-input') as string;
						const product = products.find(
							(p: ProductType) => p.sku === searchInput
						);
						if (product) {
							setSearchQuery('');
							onAddProduct(product);
						}
					},
					autoFocus: true,
				}}
			/>
		</>
	);
};

export default Products;
