import { DataTable } from "@seller/components";
import useStore from "@seller/hooks/useStore";
import { BrandType } from "@type/brandType";
import { Table } from "flowbite-react";

const StoresTable = () => {
    const { stores } = useStore();
    return (
        <>
            <DataTable
                columns={[
                    {
                        label: "Name",
                        key: "name",
                        render: (row: BrandType) => (
                            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                {row.name}
                            </Table.Cell>
                        ),
                        sortable: true,
                    },
                    {
                        label: "Slug",
                        key: "slug",
                        render: (row: BrandType) => (
                            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                {row.slug}
                            </Table.Cell>
                        ),
                        sortable: true,
                    },
                    {
                        label: "Created At",
                        key: "created_at",
                        render: (row: BrandType) => (
                            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                {row.created_at}
                            </Table.Cell>
                        ),
                        sortable: true,
                    },
                    // {
                    //     render: (row: BrandType) => (
                    //         <Table.Cell>
                    //             <div className="flex items-center gap-x-3 whitespace-nowrap">
                    //                 <EditBrandModal brand={row} />
                    //                 <DeleteBrandModal brand={row} />
                    //             </div>
                    //         </Table.Cell>
                    //     ),
                    // },
                ]}
                search={{
                    placeholder: "Search for store...",
                    columns: ["name", "slug", "created_at"],
                }}
                data={stores!}
                // head={{
                //     render: (_data: BrandType[]) => <CreateBrandModal />,
                // }}
                exportable={true}
                filename="stores"
            />
        </>
    );
};
export default StoresTable;
