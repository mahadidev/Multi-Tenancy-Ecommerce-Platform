import GenericTable from "@seller/components/DataTable/GenericTable";
import { Table } from "flowbite-react";
import useBrandTable from "../hooks/useBrandTable";
import CreateBrandModal from "./CreateBrandModal";
import DeleteBrandModal from "./DeleteBrandModal";
import EditBrandModal from "./EditBrandModal";
import type { Brand } from "../types";

const BrandsTableGeneric = () => {
    // Get brands using the generic table hook
    const brandTable = useBrandTable();

    return (
        <GenericTable
            table={brandTable}
            columns={[
                {
                    label: "Name",
                    key: "name",
                    render: (row: Brand) => (
                        <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                            {row.name}
                        </Table.Cell>
                    ),
                    sortable: true,
                },
                {
                    label: "Slug",
                    key: "slug",
                    render: (row: Brand) => (
                        <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                            {row.slug}
                        </Table.Cell>
                    ),
                    sortable: false,
                },
                {
                    label: "Image",
                    key: "image",
                    render: (row: Brand) => (
                        <Table.Cell className="whitespace-nowrap p-4">
                            {row.image ? (
                                <img 
                                    src={row.image} 
                                    alt={row.name} 
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                    <span className="text-xs text-gray-500 dark:text-gray-400">No Image</span>
                                </div>
                            )}
                        </Table.Cell>
                    ),
                    sortable: false,
                },
                {
                    label: "Created At",
                    key: "created_at",
                    render: (row: Brand) => (
                        <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                            {new Date(row.created_at).toLocaleDateString()}
                        </Table.Cell>
                    ),
                    sortable: true,
                },
                {
                    label: "Actions",
                    render: (row: Brand) => (
                        <Table.Cell>
                            <div className="flex items-center gap-x-3 whitespace-nowrap">
                                <EditBrandModal brand={row} />
                                <DeleteBrandModal brand={row} />
                            </div>
                        </Table.Cell>
                    ),
                },
            ]}
            search={{
                placeholder: "Search brands by name or slug...",
                columns: ["name", "slug"],
            }}
            head={{
                render: (_data: Brand[]) => <CreateBrandModal />,
            }}
            exportable={true}
            filename="brands"
            defaultSortBy="created_at"
            defaultSortOrder="desc"
            defaultPerPage={10}
        />
    );
};

export default BrandsTableGeneric;