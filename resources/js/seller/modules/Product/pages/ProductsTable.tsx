import { formatTableDate } from "@seller/_utils/dateUtils";
import { PermissionGuard } from "@seller/components";
import GenericTable from "@seller/components/DataTable/GenericTable";
import type { ProductType } from "@type/productType";
import { Button, Table } from "flowbite-react";
import { HiPencilAlt } from "react-icons/hi";
import { Link } from "react-router-dom";
import useProductTable from "../hooks/useProductTable";
import CreateProductModal from "./CreateProductModal";
import DeleteProductModal from "./DeleteProductModal";

const ProductsTable = () => {
    // Get products using the generic table hook
    const productTable = useProductTable();

    return (
        <GenericTable
            table={productTable}
            columns={[
                {
                    label: "Product",
                    key: "name",
                    render: (row: ProductType) => (
                        <Table.Cell className="p-4">
                            <div className="flex items-center space-x-3">
                                {row.thumbnail ? (
                                    <img
                                        src={row.thumbnail}
                                        alt={row.name}
                                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                                    />
                                ) : (
                                    <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                                        <span className="text-xs text-gray-500 dark:text-gray-400">No Image</span>
                                    </div>
                                )}
                                <div className="min-w-0 flex-1">
                                    <div className="font-semibold text-gray-900 dark:text-white truncate">
                                        {row.name}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        SKU: {row.sku}
                                    </div>
                                    <div className="text-xs text-gray-400 dark:text-gray-500 truncate">
                                        {row.slug}
                                    </div>
                                </div>
                            </div>
                        </Table.Cell>
                    ),
                    sortable: true,
                },
                {
                    label: "Price",
                    key: "price",
                    render: (row: ProductType) => (
                        <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                            <div>
                                <div className="font-semibold text-lg">৳{row.price}</div>
                                {row.discount_price > 0 && (
                                    <div className="text-sm text-green-600 dark:text-green-400">
                                        Sale: ৳{row.discount_price}
                                    </div>
                                )}
                                {row.buying_price && (
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        Cost: ৳{row.buying_price}
                                    </div>
                                )}
                            </div>
                        </Table.Cell>
                    ),
                    sortable: true,
                },
                {
                    label: "Category",
                    key: "category",
                    render: (row: ProductType) => (
                        <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                            {row.category?.name || '-'}
                        </Table.Cell>
                    ),
                    sortable: false,
                },
                {
                    label: "Stock",
                    key: "stock",
                    render: (row: ProductType) => (
                        <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                            <div>
                                <div className={`font-semibold ${row.stockQty > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                    {row.stockQty || 0} units
                                </div>
                                {row.stockValue > 0 && (
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        Value: ৳{row.stockValue}
                                    </div>
                                )}
                            </div>
                        </Table.Cell>
                    ),
                    sortable: false,
                },
                {
                    label: "Status",
                    key: "status",
                    render: (row: ProductType) => (
                        <Table.Cell className="whitespace-nowrap p-4">
                            <div className="flex flex-col gap-1">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                    row.status === 1
                                        ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                                        : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                                }`}>
                                    {row.status === 1 ? 'Active' : 'Inactive'}
                                </span>
                                {row.is_trending === 1 && (
                                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                                        Trending
                                    </span>
                                )}
                            </div>
                        </Table.Cell>
                    ),
                    sortable: false,
                },
                {
                    label: "Created At",
                    key: "created_at",
                    render: (row: ProductType) => (
                        <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                            {formatTableDate(row.created_at)}
                        </Table.Cell>
                    ),
                    sortable: true,
                },
                {
                    label: "Actions",
                    render: (row: ProductType) => (
                        <Table.Cell>
                            <div className="flex items-center gap-x-3 whitespace-nowrap">
                                <PermissionGuard permission="products.edit">
                                    <Button
                                        as={Link}
                                        to={`/products/${row.id}`}
                                        size="sm"
                                        color="primary"
                                        className="p-0"
                                    >
                                        <div className="flex items-center gap-x-2">
                                            <HiPencilAlt className="h-4 w-4" />
                                            Edit
                                        </div>
                                    </Button>
                                </PermissionGuard>
                                <PermissionGuard permission="products.delete">
                                    <DeleteProductModal product={row} />
                                </PermissionGuard>
                            </div>
                        </Table.Cell>
                    ),
                },
            ]}
            search={{
                placeholder: "Search products by name, SKU, or slug...",
                columns: ["name", "sku", "slug"],
            }}
            head={{
                render: (_data: ProductType[]) => (
                    <PermissionGuard permission="products.create">
                        <CreateProductModal />
                    </PermissionGuard>
                ),
            }}
            exportable={true}
            filename="products"
            defaultSortBy="created_at"
            defaultSortOrder="desc"
            defaultPerPage={10}
        />
    );
};

export default ProductsTable;
