import { DataTable } from "@seller/components";
import useBrand from "@seller/hooks/useBrand";
import useRolePermission from "@seller/hooks/useRolePermissions";

import { PermissionType } from "@type/rolePermissionsType";
import { Table } from "flowbite-react";
import CreatePermissionModal from "./CreatePermissionModal";
import DeletePermissionModal from "./DeletePermissionModal";
import EditPermissionModal from "./EditPermissionModal";

const PermissionsTable = () => {
    const { brands } = useBrand();
    const { permissions } = useRolePermission();

    console.log({ permissions });
    return (
        <>
            <DataTable
                columns={[
                    {
                        label: "Name",
                        key: "name",
                        render: (row: PermissionType) => (
                            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                {row.name}
                            </Table.Cell>
                        ),
                        sortable: true,
                    },

                    {
                        label: "Created At",
                        key: "created_at",
                        render: (row: PermissionType) => (
                            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                {row.created_at}
                            </Table.Cell>
                        ),
                        sortable: true,
                    },
                    {
                        render: (row: PermissionType) => (
                            <Table.Cell>
                                <div className="flex items-center gap-x-3 whitespace-nowrap">
                                    <EditPermissionModal permission={row} />
                                    <DeletePermissionModal permission={row} />
                                </div>
                            </Table.Cell>
                        ),
                    },
                ]}
                search={{
                    placeholder: "Search for permission...",
                    columns: ["name", "created_at"],
                }}
                data={permissions}
                head={{
                    render: (_data: PermissionType[]) => (
                        <CreatePermissionModal />
                    ),
                }}
                exportable={true}
                filename="permissions"
            />
        </>
    );
};
export default PermissionsTable;
