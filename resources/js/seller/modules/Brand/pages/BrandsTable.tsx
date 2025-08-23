import { DataTable } from "@seller/components";
import { useBrand } from "../hooks";
import type { Brand } from "../types";
import { Table } from "flowbite-react";
import CreateBrandModal from "./CreateBrandModal";
import DeleteBrandModal from "./DeleteBrandModal";
import EditBrandModal from "./EditBrandModal";

const BrandsTable = () => {
    const { brands } = useBrand();
    return (
        <>
            <DataTable
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
                        sortable: true,
                    },
                    {
                        label: "Created At",
                        key: "created_at",
                        render: (row: Brand) => (
                            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                {row.created_at}
                            </Table.Cell>
                        ),
                        sortable: true,
                    },
                    {
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
                    placeholder: "Search for brand...",
                    columns: ["name", "slug", "created_at"],
                }}
                data={brands}
                head={{
                    render: (_data: Brand[]) => <CreateBrandModal />,
                }}
                exportable={true}
                filename="brands"
            />
        </>
    );
};
export default BrandsTable;