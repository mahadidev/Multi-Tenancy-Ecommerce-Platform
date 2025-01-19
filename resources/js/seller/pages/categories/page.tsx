import type { User } from "@/seller/types/user/user";
import CategoriesListPageContent from "./content";

export interface UsersListPageData {
    usersList: User[];
}

export default function CategoriesPage() {
    return <CategoriesListPageContent />;
}
