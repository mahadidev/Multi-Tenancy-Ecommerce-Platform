import GenericTable from '@seller/components/DataTable/GenericTable';
import { ProductStockType, ProductType, ProductVariantOptionType } from '@type/productType';
import { Badge, Button, Modal, Table } from 'flowbite-react';
import { useState } from 'react';
import { useCartOrderPlacer, useOrderPlacerProductTable } from '../hooks';

interface SelectedOptions {
    [variantId: number]: ProductVariantOptionType | null;
}

const Products = () => {
    const { addOrderProduct } = useCartOrderPlacer();
    const productTable = useOrderPlacerProductTable();

    // State for variant selection modal
    const [showVariantModal, setShowVariantModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
    const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({});
    const [currentStock, setCurrentStock] = useState<ProductStockType | null>(null);

    const handleAddProduct = (product: ProductType) => {
        if (product.has_variants && product.variants && product.variants.length > 0) {
            // Open variant selection modal for products with variants
            setSelectedProduct(product);
            setSelectedOptions({});
            setCurrentStock(null);
            setShowVariantModal(true);
        } else {
            // Add product directly if no variants
            addOrderProduct({
                id: product.id.toString(),
                name: product.name,
                price: product.price,
                image: product.thumbnail || '/placeholder-image.jpg',
                stock_quantity: product.stock || 0,
                tax: product.tax || 0,
                discount_amount: product.discount_amount || 0,
                discount_type: product.discount_type || 'flat',
            });
        }
    };

    const handleOptionSelect = (variantId: number, option: ProductVariantOptionType) => {
        const newSelections = { ...selectedOptions, [variantId]: option };
        console.log('newSelections', newSelections);
        setSelectedOptions(newSelections);

        // Find matching stock based on selected options
        if (selectedProduct?.stocks) {
            const matchingStock = selectedProduct.stocks.find((stock) => {
                if (!stock.stock_items) return false;

                const stockOptionIds = stock.stock_items.map(item => item.variant_option?.id).filter((id): id is number => id !== undefined);
                const selectedOptionIds = Object.values(newSelections)
                    .filter(opt => opt !== null)
                    .map(opt => opt!.id);

                return stockOptionIds.length === selectedOptionIds.length &&
                       stockOptionIds.every(id => selectedOptionIds.includes(id));
            });

            setCurrentStock(matchingStock || null);
        }
    };

    const addToCartWithVariants = () => {
        if (!selectedProduct || !currentStock) return;

        addOrderProduct({
            id: selectedProduct.id.toString(),
            name: selectedProduct.name,
            price: currentStock.price || selectedProduct.price,
            image: selectedProduct.thumbnail || '/placeholder-image.jpg',
            stock_quantity: currentStock.qty || 0,
            selectedVariants: selectedOptions,
            stockId: currentStock.id,
            tax: currentStock.tax || selectedProduct.tax || 0,
            discount_amount: currentStock.discount_amount || selectedProduct.discount_amount || 0,
            discount_type: selectedProduct.discount_type || 'flat',
        });

        setShowVariantModal(false);
        setSelectedProduct(null);
        setSelectedOptions({});
        setCurrentStock(null);
    };

    const allOptionsSelected = selectedProduct?.variants?.every(variant =>
        selectedOptions[variant.id] !== null && selectedOptions[variant.id] !== undefined
    ) || false;

    return (
			<div className="space-y-4">
				<h2 className="text-lg font-semibold text-gray-900 dark:text-white">
					Select Products
				</h2>

				<div className="max-h-96 overflow-hidden">
					<GenericTable
						table={productTable}
						columns={[
							{
								label: 'Product',
								key: 'name',
								render: (row: ProductType) => (
									<Table.Cell className="p-2">
										<div className="flex items-center space-x-3">
											{row.thumbnail ? (
												<img
													src={row.thumbnail}
													alt={row.name}
													className="w-10 h-10 object-cover rounded"
												/>
											) : (
												<div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
													<span className="text-xs text-gray-500">No img</span>
												</div>
											)}
											<div className="flex flex-col">
												<span className="text-sm font-medium text-gray-900 dark:text-white">
													{row.name}
												</span>
												<span className="text-xs text-gray-500">
													SKU: {row.sku}
												</span>
											</div>
										</div>
									</Table.Cell>
								),
							},
							{
								label: 'Price',
								key: 'price',
								render: (row: ProductType) => (
									<Table.Cell className="p-2">
										<span className="text-sm font-medium text-gray-900 dark:text-white">
											৳{row.price}
										</span>
									</Table.Cell>
								),
							},
							{
								label: 'Stock',
								key: 'stock',
								render: (row: ProductType) => (
									<Table.Cell className="p-2">
										<span
											className={`text-sm ৳{
												(row.stockQty ?? 0) > 0
													? 'text-green-600'
													: 'text-red-600'
											}`}
										>
											{row.stockQty ?? 0}
										</span>
									</Table.Cell>
								),
							},
							{
								label: 'Action',
								key: 'action',
								render: (row: ProductType) => (
									<Table.Cell className="p-2">
										<Button
											size="xs"
											onClick={() => handleAddProduct(row)}
											disabled={
												row.has_variants ? false : !row.stock || row.stock === 0
											}
											className="w-full"
										>
											{row.has_variants ? 'Select Variants' : 'Add to Order'}
										</Button>
									</Table.Cell>
								),
							},
						]}
						search={{
							placeholder: 'Search products by name, SKU...',
							columns: ['name', 'sku'],
                            autoFocus: true
						}}
					/>
				</div>

				{/* Variant Selection Modal */}
				<Modal
					show={showVariantModal}
					onClose={() => setShowVariantModal(false)}
					size="xl"
				>
					<Modal.Header>
						Select Variants for {selectedProduct?.name}
					</Modal.Header>
					<Modal.Body>
						{selectedProduct && (
							<div className="space-y-6">
								{/* Product Info */}
								<div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
									{selectedProduct.thumbnail && (
										<img
											src={selectedProduct.thumbnail}
											alt={selectedProduct.name}
											className="w-16 h-16 object-cover rounded"
										/>
									)}
									<div>
										<h3 className="font-medium text-gray-900">
											{selectedProduct.name}
										</h3>
										<p className="text-sm text-gray-500">
											SKU: {selectedProduct.sku}
										</p>
										<p className="text-sm font-medium text-gray-900">
											৳{selectedProduct.price}
										</p>
									</div>
								</div>

								{/* Variant Options */}
								<div className="space-y-4">
									{selectedProduct.variants?.map((variant) => (
										<div key={variant.id}>
											<h4 className="font-medium mb-2 text-gray-700">
												{variant.label}
												<span className="text-red-500 ml-1">*</span>
											</h4>
											<div className="flex flex-wrap gap-2">
												{variant.options?.map((option) => {
													const isSelected =
														selectedOptions[variant.id]?.id === option.id;
													return (
														<Button
															key={option.id}
															color={isSelected ? 'blue' : 'gray'}
															outline={!isSelected}
															size="sm"
															onClick={() =>
																handleOptionSelect(variant.id, option)
															}
															className={`transition-all ৳{
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
								</div>

								{/* Stock Information */}
								{currentStock ? (
									<div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
										<span className="font-medium text-green-800">
											Available: {currentStock.qty} pc(s)
										</span>
										<Badge color="success">In Stock</Badge>
									</div>
								) : allOptionsSelected ? (
									<div className="p-3 bg-red-50 rounded-lg">
										<span className="text-red-800 font-medium">
											No stock available for this combination
										</span>
									</div>
								) : (
									<div className="p-3 bg-yellow-50 rounded-lg">
										<span className="text-yellow-800">
											Please select all variants to check availability
										</span>
									</div>
								)}
							</div>
						)}
					</Modal.Body>
					<Modal.Footer>
						<Button color="gray" onClick={() => setShowVariantModal(false)}>
							Cancel
						</Button>
						<Button
							color="blue"
							onClick={addToCartWithVariants}
							disabled={!allOptionsSelected || !currentStock}
						>
							Add to Order
						</Button>
					</Modal.Footer>
				</Modal>
			</div>
		);
};

export default Products;
