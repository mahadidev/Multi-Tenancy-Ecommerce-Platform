import { Button, Table } from 'flowbite-react';
import { useCartOrderPlacer, useOrderPlacerProductTable } from '../hooks';
import GenericTable from '@seller/components/DataTable/GenericTable';
import { ProductType } from '@type/productType';

const Products = () => {
    const { addOrderProduct } = useCartOrderPlacer();
    const productTable = useOrderPlacerProductTable();

    const handleAddProduct = (product: ProductType) => {
        addOrderProduct({
            id: product.id.toString(),
            name: product.name,
            price: product.price,
            image: product.thumbnail || '/placeholder-image.jpg',
            stock_quantity: product.stock || 0,
        });
    };

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
                            label: "Product",
                            key: "name",
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
                            label: "Price",
                            key: "price",
                            render: (row: ProductType) => (
                                <Table.Cell className="p-2">
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        ${row.price}
                                    </span>
                                </Table.Cell>
                            ),
                        },
                        {
                            label: "Stock",
                            key: "stock",
                            render: (row: ProductType) => (
                                <Table.Cell className="p-2">
                                    <span className={`text-sm ${(row.stock ?? 0) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {row.stock ?? 0}
                                    </span>
                                </Table.Cell>
                            ),
                        },
                        {
                            label: "Action",
                            key: "action",
                            render: (row: ProductType) => (
                                <Table.Cell className="p-2">
                                    <Button
                                        size="xs"
                                        onClick={() => handleAddProduct(row)}
                                        disabled={!row.stock || row.stock === 0}
                                        className="w-full"
                                    >
                                        Add to Order
                                    </Button>
                                </Table.Cell>
                            ),
                        },
                    ]}
                    compact
                />
            </div>
        </div>
    );
};

export default Products;