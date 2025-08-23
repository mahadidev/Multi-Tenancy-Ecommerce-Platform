import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PermissionType, RoleType } from "@type/rolePermissionsType";

const initialState: {
    roles: RoleType[];
    permissions: PermissionType[];
} = {
    roles: [],
    permissions: [],
};

const accessManagementSlice = createSlice({
    name: "accessManagement",
    initialState,
    reducers: {
        setRoles: (state, action: PayloadAction<RoleType[]>) => {
            state.roles = action.payload;
        },
        setPermissions: (state, action: PayloadAction<PermissionType[]>) => {
            state.permissions = action.payload;
        },
        clearAccessManagement: (state) => {
            state.roles = [];
            state.permissions = [];
        },
    },
});

export const { setRoles, setPermissions, clearAccessManagement } =
    accessManagementSlice.actions;
export default accessManagementSlice.reducer;