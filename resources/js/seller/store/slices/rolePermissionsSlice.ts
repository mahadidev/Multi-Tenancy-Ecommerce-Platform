import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PermissionType, RoleType } from "@type/rolePermissionsType";

const initialState: {
    roles: RoleType[];
    permissions: PermissionType[];
} = {
    roles: [],
    permissions: [],
};

const rolePermissionSlice = createSlice({
    name: "rolePermissions",
    initialState,
    reducers: {
        setRoles: (state, action: PayloadAction<RoleType[]>) => {
            state.roles = action.payload;
        },
        setPermissions: (state, action: PayloadAction<PermissionType[]>) => {
            state.permissions = action.payload;
        },
        clearBlogs: (state) => {
            state.roles = [];
            state.permissions = [];
        },
    },
});
export const { setRoles, setPermissions, clearBlogs } =
    rolePermissionSlice.actions;
export default rolePermissionSlice.reducer;
