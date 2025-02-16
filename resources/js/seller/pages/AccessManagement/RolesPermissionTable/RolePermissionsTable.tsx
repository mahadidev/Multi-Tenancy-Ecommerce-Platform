import { DataTable } from "@seller/components";
import useRolePermission from "@seller/hooks/useRolePermissions";
import { PermissionType, RoleType } from "@type/rolePermissionsType";
import { Table } from "flowbite-react";
import AssignPermissionsToRoleModal from "./AssignPermissionsToRoleModal";
import RevokeRolePermissionModal from "./RevokeRolePermissionModal";

const RolePermissionsTable = () => {
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
                        label: "Permissions",
                        key: "permissions",
                        render: (row: RoleType) => (
                            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                {row?.permissions?.map(
                                    (
                                        permission: PermissionType,
                                        idx: number
                                    ) => (
                                        <div
                                            key={idx}
                                            className="p-2 dark:bg-gray-700 my-2 rounded-lg"
                                        >
                                            {permission?.name}
                                        </div>
                                    )
                                )}
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
                                    <AssignPermissionsToRoleModal role={row} />
                                    <RevokeRolePermissionModal role={row} />
                                </div>
                            </Table.Cell>
                        ),
                    },
                ]}
                search={{
                    placeholder: "Search for role permissions...",
                    columns: ["name", "created_at"],
                }}
                data={roles}
                // head={{
                //     render: (_data: BrandType[]) => <CreateBrandModal />,
                // }}
                exportable={true}
                filename="roles"
            />
        </>
    );
};
export default RolePermissionsTable;
