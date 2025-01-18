import type { ECommerceProduct } from "@/seller/types/e-commerce/product";
import ECommerceProductsPageContent from "./content";

export interface ECommerceProductsPageData {
    products: ECommerceProduct[];
}

export default function ProductsPage() {
    return <ECommerceProductsPageContent />;
}
