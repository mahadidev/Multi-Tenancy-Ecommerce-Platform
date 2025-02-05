import { DataTable } from "@seller/components";
import useBrand from "@seller/hooks/useBrand";
import { BrandType } from "@type/brandType";
import { Checkbox, Label, Table } from "flowbite-react";
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
                        render: (row: BrandType) => (
                            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                {row.id}
                            </Table.Cell>
                        ),
                        sortable: true,
                    },
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
                    {
                        render: (row: BrandType) => (
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
                    placeholder: "Search for brand",
                    columns: ["name", "slug", "created_at"],
                }}
                data={brands}
                head={{
                    render: (_data: BrandType[]) => <CreateBrandModal />,
                }}
                exportable={true}
                filename="brands"
            />
        </>
    );
};
export default BrandsTable;
