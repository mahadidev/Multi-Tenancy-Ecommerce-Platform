import { DataTable } from "@seller/components";
import useProduct from "@seller/hooks/useProduct";
import { ProductType } from "@type/productType";
import { Button, Table } from "flowbite-react";
import { HiPencilAlt } from "react-icons/hi";
import { Link } from "react-router-dom";
import CreateProductModal from "./CreateProductModal";
import DeleteProductModal from "./DeleteProductModal";

const ProductsTable = () => {
    const { products } = useProduct();
    // Name
    // SKU
    // Category
    // Price
    return (
        <>
            <DataTable
                columns={[
                    {
                        label: "Name",
                        key: "name",
                        render: (row: ProductType) => (
                            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                {row.name}
                            </Table.Cell>
                        ),
                        sortable: true,
                    },
                    {
                        label: "Slug",
                        key: "slug",
                        render: (row: ProductType) => (
                            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                {row.slug}
                            </Table.Cell>
                        ),
                        sortable: true,
                    },
                    {
                        label: "SKU",
                        key: "sku",
                        render: (row: ProductType) => (
                            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                {row?.sku}
                            </Table.Cell>
                        ),
                        sortable: false,
                    },
                    {
                        label: "Category",
                        key: "category",
                        render: (row: ProductType) => (
                            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                {row?.category?.name}
                            </Table.Cell>
                        ),
                        sortable: false,
                    },
                    {
                        label: "Created At",
                        key: "created_at",
                        render: (row: ProductType) => (
                            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                {row.created_at}
                            </Table.Cell>
                        ),
                        sortable: true,
                    },
                    {
                        render: (row: ProductType) => (
                            <Table.Cell>
                                <div className="flex items-center gap-x-3 whitespace-nowrap">
                                    <Button
                                        as={Link}
                                        to={`/products/${row.id}`}
                                        size="sm"
                                        color="primary"
                                        className="p-0"
                                    >
                                        <div className="flex items-center gap-x-2">
                                            <HiPencilAlt className="h-5 w-5" />
                                            Edit Product
                                        </div>
                                    </Button>
                                    <DeleteProductModal product={row} />
                                </div>
                            </Table.Cell>
                        ),
                    },
                ]}
                search={{
                    placeholder: "Search for category",
                    columns: ["name", "slug", "parent", "created_at"],
                }}
                data={products}
                head={{
                    render: (_data: ProductType[]) => <CreateProductModal />,
                }}
                exportable={true}
                filename="products"
            />
        </>
    );
};
export default ProductsTable;
