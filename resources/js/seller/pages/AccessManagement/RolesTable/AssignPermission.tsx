import { PermissionType } from "@type/rolePermissionsType";
import { Checkbox, Label } from "flowbite-react";
import { FC } from "react";

interface PropType {
    permissions: PermissionType[];
    permissionFormState: any;
    setPermissionFormState: any;
    selectAll: boolean;
    setSelectAll: (value: boolean) => void;
}

export const AssignPermissions: FC<PropType> = ({
    permissions,
    permissionFormState,
    setPermissionFormState,
    selectAll,
    setSelectAll,
}) => {
    const handlePermissionChange = (
        permissionId: number,
        isChecked: boolean
    ) => {
        const updatedPermissions = isChecked
            ? [...permissionFormState.permissions, permissionId]
            : permissionFormState.permissions.filter(
                  (id: any) => id !== permissionId
              );

        setPermissionFormState({ permissions: updatedPermissions });
        setSelectAll(updatedPermissions.length === permissions.length);
    };

    const handleSelectAllChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const isChecked = event.target.checked;
        setSelectAll(isChecked);
        setPermissionFormState({
            permissions: isChecked ? permissions.map((p) => p.id) : [],
        });
    };

    return (
        <div>
            <Label>Assign Permissions</Label>
            <div className="flex items-center gap-2 mt-3">
                <Checkbox
                    id="select-all"
                    checked={selectAll}
                    onChange={handleSelectAllChange}
                />
                <Label htmlFor="select-all">Select All Permissions</Label>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
                {permissions.map((p) => (
                    <div key={p.id} className="flex items-center gap-2">
                        <Checkbox
                            id={p.name}
                            name={p.name}
                            checked={permissionFormState.permissions.includes(
                                p.id
                            )}
                            onChange={(e) =>
                                handlePermissionChange(p.id, e.target.checked)
                            }
                        />
                        <Label htmlFor={p.name}>{p.name}</Label>
                    </div>
                ))}
            </div>
        </div>
    );
};
