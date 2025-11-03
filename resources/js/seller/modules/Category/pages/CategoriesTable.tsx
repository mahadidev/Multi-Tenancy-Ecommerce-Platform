import { formatTableDate } from "@seller/_utils/dateUtils";
import { ServerTable } from "@seller/components";
import { CategoryType } from "@type/categoryType";
import { Table } from "flowbite-react";
import useCategoryTable from "../hooks/useCategoryTable";
import CreateCategoryModal from "./CreateCategoryModal";
import DeleteCategoryModal from "./DeleteCategoryModal";
import EditCategoryModal from "./EditCategoryModal";

const CategoriesTable = () => {
    // Get categories with server-side pagination
    const { categories, meta, isLoading, isError, isFetching } = useCategoryTable();

    return (
        <>
            <ServerTable
                columns={[
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
                                {row?.has_parent?.name || '-'}
                            </Table.Cell>
                        ),
                        sortable: false,
                    },
                    {
                        label: "Created At",
                        key: "created_at",
                        render: (row: CategoryType) => (
                            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                {(row.created_at)}
                            </Table.Cell>
                        ),
                        sortable: true,
                    },
                    {
                        label: "Actions",
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
                    placeholder: "Search categories by name, slug, or parent...",
                    columns: ["name", "slug", "parent"],
                }}
                data={categories}
                meta={meta}
                isLoading={isLoading}
                isFetching={isFetching}
                isError={isError}
                head={{
                    render: (_data: CategoryType[]) => <CreateCategoryModal />,
                }}
                exportable={true}
                filename="product_categories"
                defaultSortBy="created_at"
                defaultSortOrder="desc"
                defaultPerPage={10}
            />
        </>
    );
};
export default CategoriesTable;
