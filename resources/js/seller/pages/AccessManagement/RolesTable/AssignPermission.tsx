import { PermissionType } from "@type/rolePermissionsType";
import { Checkbox, Label } from "flowbite-react";
import { FC, useMemo } from "react";

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
    // Group permissions by their group
    const groupedPermissions = useMemo(() => {
        return permissions.reduce((groups, permission) => {
            const group = permission.group || 'Other';
            if (!groups[group]) {
                groups[group] = [];
            }
            groups[group].push(permission);
            return groups;
        }, {} as Record<string, PermissionType[]>);
    }, [permissions]);

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

    const handleGroupChange = (
        groupPermissions: PermissionType[],
        isChecked: boolean
    ) => {
        const groupIds = groupPermissions.map(p => p.id);
        let updatedPermissions;
        
        if (isChecked) {
            // Add all group permissions that aren't already selected
            updatedPermissions = [
                ...permissionFormState.permissions,
                ...groupIds.filter(id => !permissionFormState.permissions.includes(id))
            ];
        } else {
            // Remove all group permissions
            updatedPermissions = permissionFormState.permissions.filter(
                (id: any) => !groupIds.includes(id)
            );
        }

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

    const isGroupSelected = (groupPermissions: PermissionType[]) => {
        return groupPermissions.every(p => 
            permissionFormState.permissions.includes(p.id)
        );
    };

    const isGroupPartiallySelected = (groupPermissions: PermissionType[]) => {
        const selectedCount = groupPermissions.filter(p => 
            permissionFormState.permissions.includes(p.id)
        ).length;
        return selectedCount > 0 && selectedCount < groupPermissions.length;
    };

    // Format group name for display
    const formatGroupName = (groupName: string) => {
        return groupName.charAt(0).toUpperCase() + groupName.slice(1).replace(/_/g, ' ');
    };

    return (
        <div>
            <Label>Assign Permissions</Label>
            <div className="flex items-center gap-2 mt-3 mb-4">
                <Checkbox
                    id="select-all"
                    checked={selectAll}
                    onChange={handleSelectAllChange}
                />
                <Label htmlFor="select-all" className="font-medium">Select All Permissions</Label>
            </div>
            
            <div className="space-y-4">
                {Object.entries(groupedPermissions).map(([groupName, groupPermissions]) => {
                    const isSelected = isGroupSelected(groupPermissions);
                    const isPartiallySelected = isGroupPartiallySelected(groupPermissions);
                    
                    return (
                        <div key={groupName} className="border border-gray-200 rounded-lg p-4 dark:border-gray-600">
                            <div className="flex items-center gap-2 mb-3">
                                <Checkbox
                                    id={`group-${groupName}`}
                                    checked={isSelected}
                                    ref={(input) => {
                                        if (input) {
                                            input.indeterminate = isPartiallySelected;
                                        }
                                    }}
                                    onChange={(e) =>
                                        handleGroupChange(groupPermissions, e.target.checked)
                                    }
                                />
                                <Label 
                                    htmlFor={`group-${groupName}`} 
                                    className="font-semibold text-lg cursor-pointer"
                                >
                                    {formatGroupName(groupName)}
                                </Label>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    ({groupPermissions.length} permissions)
                                </span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 pl-6">
                                {groupPermissions.map((permission) => (
                                    <div key={permission.id} className="flex items-center gap-2">
                                        <Checkbox
                                            id={`permission-${permission.id}`}
                                            checked={permissionFormState.permissions.includes(permission.id)}
                                            onChange={(e) =>
                                                handlePermissionChange(permission.id, e.target.checked)
                                            }
                                        />
                                        <Label 
                                            htmlFor={`permission-${permission.id}`}
                                            className="text-sm cursor-pointer"
                                        >
                                            {permission.name}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
