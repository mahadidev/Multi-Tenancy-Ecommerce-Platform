import { DataTable } from "@seller/components";
import useProduct from "@seller/hooks/useProduct";
import { ProductType } from "@type/productType";
import { Button, Checkbox, Label, Table } from "flowbite-react";
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
                        label: (
                            <>
                                {" "}
                                <Label htmlFor="select-all" className="sr-only">
                                    Select all
                                </Label>
                                <Checkbox id="select-all" name="select-all" />{" "}
                            </>
                        ),
                        key: "id",
                        render: () => (
                            <Table.Cell className="w-4 p-4">
                                <Checkbox
                                    aria-describedby="checkbox-1"
                                    id="checkbox-1"
                                />
                            </Table.Cell>
                        ),
                        sortable: true,
                    },
                    {
                        label: "ID",
                        key: "id",
                        render: (row: ProductType) => (
                            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                {row.id}
                            </Table.Cell>
                        ),
                        sortable: true,
                    },
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
            />
        </>
    );
};
export default ProductsTable;
{
    /* <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
            <Table.Head
                className="bg-gray-100 dark:bg-gray-700"
                theme={{
                    cell: {
                        base: "p-4 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400",
                    },
                }}
            >
                <Table.HeadCell className="p-4">
                    <Label htmlFor="select-all" className="sr-only">
                        Select all
                    </Label>
                    <Checkbox id="select-all" name="select-all" />
                </Table.HeadCell>
                <Table.HeadCell>ID</Table.HeadCell>
                <Table.HeadCell>Name</Table.HeadCell>
                <Table.HeadCell>SKU</Table.HeadCell>
                <Table.HeadCell>Category</Table.HeadCell>
                <Table.HeadCell>Price</Table.HeadCell>
                <Table.HeadCell />
            </Table.Head>
            <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                {products.map((product: ProductType) => (
                    <Table.Row
                        key={product.id}
                        className="hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <Table.Cell className="w-4 p-4">
                            <Checkbox
                                aria-describedby="checkbox-1"
                                id="checkbox-1"
                            />
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                            {product.id}
                        </Table.Cell>
                        <Table.Cell className="mr-12 flex items-center space-x-6 whitespace-nowrap p-4 lg:mr-0">
                            <img
                                alt=""
                                src={product.thumbnail}
                                className="w-10 h-10 rounded-full aspect-square object-cover"
                            />
                            <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                                <div className="text-base font-semibold text-gray-900 dark:text-white">
                                    {product.name}
                                </div>
                                <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                                    {product?.stock || 0} products
                                </div>
                            </div>
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                            {product.sku}
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                            {product.category?.name ?? "No Category"}
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                            {product.price}
                        </Table.Cell>
                        <Table.Cell>
                            <div className="flex items-center gap-x-3 whitespace-nowrap">
                                <Button
                                    as={Link}
                                    to={`/products/${product.id}`}
                                    size="sm"
                                    color="primary"
                                    className="p-0"
                                >
                                    <div className="flex items-center gap-x-2">
                                        <HiPencilAlt className="h-5 w-5" />
                                        Edit Product
                                    </div>
                                </Button>
                                <DeleteProductModal product={product} />
                            </div>
                        </Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table> */
}
