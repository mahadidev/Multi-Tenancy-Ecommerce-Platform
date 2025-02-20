import { DataTable } from "@seller/components";
import useRolePermission from "@seller/hooks/useRolePermissions";
import { RoleType } from "@type/rolePermissionsType";
import { Table } from "flowbite-react";
import CreateRoleModal from "./CreateRoleModal";
import DeleteRoleModal from "./DeleteRoleModal";
import EditRoleModal from "./EditRoleModal";
import ResetPermissionsModal from "./ResetPermissionsModal";

const RolesTable = () => {
    const { roles } = useRolePermission();
    return (
        <>
            <DataTable
                columns={[
                    {
                        label: "Name",
                        key: "name",
                        render: (row: RoleType) => (
                            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                {row.name}
                            </Table.Cell>
                        ),
                        sortable: true,
                    },

                    {
                        label: "Created At",
                        key: "created_at",
                        render: (row: RoleType) => (
                            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                {row.created_at}
                            </Table.Cell>
                        ),
                        sortable: true,
                    },

                    {
                        render: (row: RoleType) => (
                            <Table.Cell>
                                <div className="flex items-center gap-x-3 whitespace-nowrap">
                                    <EditRoleModal role={row} />
                                    <ResetPermissionsModal role={row} />
                                    <DeleteRoleModal role={row} />
                                </div>
                            </Table.Cell>
                        ),
                    },
                ]}
                search={{
                    placeholder: "Search for role...",
                    columns: ["name", "created_at"],
                }}
                data={roles}
                head={{
                    render: (_data: RoleType[]) => <CreateRoleModal />,
                }}
                exportable={true}
                filename="roles"
            />
        </>
    );
};
export default RolesTable;
