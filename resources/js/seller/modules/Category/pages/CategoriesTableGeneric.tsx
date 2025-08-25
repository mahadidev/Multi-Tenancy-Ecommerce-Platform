import GenericTable from "@seller/components/DataTable/GenericTable";
import { Table } from "flowbite-react";
import useCategoryTableGeneric from "../hooks/useCategoryTableGeneric";
import CreateCategoryModal from "./CreateCategoryModal";
import DeleteCategoryModal from "./DeleteCategoryModal";
import EditCategoryModal from "./EditCategoryModal";
import { formatTableDate } from "@seller/_utils/dateUtils";
import type { Category } from "../types";

const CategoriesTableGeneric = () => {
    // Get categories using the generic table hook
    const categoryTable = useCategoryTableGeneric();

    return (
        <GenericTable
            table={categoryTable}
            columns={[
                {
                    label: "Name",
                    key: "name",
                    render: (row: Category) => (
                        <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                            {row.name}
                        </Table.Cell>
                    ),
                    sortable: true,
                },
                {
                    label: "Slug",
                    key: "slug",
                    render: (row: Category) => (
                        <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                            {row.slug}
                        </Table.Cell>
                    ),
                    sortable: true,
                },
                {
                    label: "Parent",
                    key: "parent",
                    render: (row: Category) => (
                        <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                            {row?.has_parent?.name || '-'}
                        </Table.Cell>
                    ),
                    sortable: false,
                },
                {
                    label: "Created At",
                    key: "created_at",
                    render: (row: Category) => (
                        <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                            {formatTableDate(row.created_at)}
                        </Table.Cell>
                    ),
                    sortable: true,
                },
                {
                    label: "Actions",
                    render: (row: Category) => (
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
            head={{
                render: (_data: Category[]) => <CreateCategoryModal />,
            }}
            exportable={true}
            filename="product_categories"
            defaultSortBy="created_at"
            defaultSortOrder="desc"
            defaultPerPage={10}
        />
    );
};

export default CategoriesTableGeneric;