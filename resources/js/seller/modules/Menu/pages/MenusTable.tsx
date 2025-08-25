import useMenu from "@seller/_hooks/useMenu";
import { DataTable } from "@seller/components";
import { MenuType } from "@type/menuType";
import { Table } from "flowbite-react";
import CreateMenuModal from "./CreateMenuModal";
import DeleteMenuModal from "./DeleteMenuModal";
import EditMenuModal from "./EditMenuModal";
import { formatTableDate } from "@seller/_utils/dateUtils";

const MenusTable = () => {
    const { menus } = useMenu();
    return (
        <>
            <DataTable
                columns={[
                    {
                        label: "Label",
                        key: "label",
                        render: (row: MenuType) => (
                            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                {row.label}
                            </Table.Cell>
                        ),
                        sortable: true,
                    },
                    {
                        label: "Name",
                        key: "name",
                        render: (row: MenuType) => (
                            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                {row.name}
                            </Table.Cell>
                        ),
                        sortable: true,
                    },

                    {
                        label: "Visibility",
                        key: "visibility",
                        render: (row: MenuType) => (
                            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                {row.visibility}
                            </Table.Cell>
                        ),
                        sortable: true,
                    },
                    {
                        label: "Created At",
                        key: "created_at",
                        render: (row: MenuType) => (
                            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                {formatTableDate(row.created_at)}
                            </Table.Cell>
                        ),
                        sortable: true,
                    },
                    {
                        render: (row: MenuType) => (
                            <Table.Cell>
                                <div className="flex items-center gap-x-3 whitespace-nowrap">
                                    <EditMenuModal menu={row} />
                                    <DeleteMenuModal menu={row} />
                                </div>
                            </Table.Cell>
                        ),
                    },
                ]}
                search={{
                    placeholder: "Search for menu...",
                    columns: ["name", "label", "visibility", "created_at"],
                }}
                data={menus}
                head={{
                    render: (_data: MenuType[]) => <CreateMenuModal />,
                }}
                exportable={true}
                filename="brands"
            />
        </>
    );
};
export default MenusTable;
