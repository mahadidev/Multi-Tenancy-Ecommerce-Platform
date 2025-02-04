import { DataTable } from "@seller/components";
import useCategory from "@seller/hooks/useCategory";
import { CategoryType } from "@type/categoryType";
import { Table } from "flowbite-react";
import CreateCategoryModal from "./CreateCategoryModal";
import DeleteCategoryModal from "./DeleteCategoryModal";
import EditCategoryModal from "./EditCategoryModal";

const CategoriesTable = () => {
    // get the product categories
    const { productCategories } = useCategory();

    return (
        <>
            <DataTable
                columns={[
                    {
                        label: "ID",
                        key: "id",
                        render: (row: CategoryType) => (
                            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                {row.id}
                            </Table.Cell>
                        ),
                        sortable: true,
                    },
                    {
                        label: "Name",
                        key: "name",
                        render: (row: CategoryType) => (
                            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                {row.name}
                            </Table.Cell>
                        ),
                        sortable: true,
                    },
                    {
                        label: "Slug",
                        key: "slug",
                        render: (row: CategoryType) => (
                            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                {row.slug}
                            </Table.Cell>
                        ),
                        sortable: true,
                    },
                    {
                        label: "Parent",
                        key: "parent",
                        render: (row: CategoryType) => (
                            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                {row?.has_parent?.name}
                            </Table.Cell>
                        ),
                        sortable: false,
                    },
                    {
                        label: "Created At",
                        key: "created_at",
                        render: (row: CategoryType) => (
                            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                {row.created_at}
                            </Table.Cell>
                        ),
                        sortable: true,
                    },
                    {
                        render: (row: CategoryType) => (
                            <Table.Cell>
                                <div className="flex items-center gap-x-3 whitespace-nowrap">
                                    <EditCategoryModal category={row} />
                                    <DeleteCategoryModal category={row} />
                                </div>
                            </Table.Cell>
                        ),
                    },
                ]}
                search={{
                    placeholder: "Search for category",
                    columns: ["name", "slug", "parent", "created_at"],
                }}
                data={productCategories}
                head={{
                    render: (_data: CategoryType[]) => <CreateCategoryModal />,
                }}
                exportable={true}
            />
        </>
    );
};
export default CategoriesTable;
