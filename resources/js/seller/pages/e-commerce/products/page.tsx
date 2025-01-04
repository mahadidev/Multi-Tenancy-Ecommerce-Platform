import products from "@/seller/data/e-commerce/product.json";
import type { ECommerceProduct } from "@/seller/types/e-commerce/product";
import React from "react";
import ECommerceProductsPageContent from "./content";

export default function EcommerceProductsPage() {
    return <ECommerceProductsPageContent products={products} />;
}
