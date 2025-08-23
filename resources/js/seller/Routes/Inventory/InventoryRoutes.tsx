import { Fragment } from 'react';
import { Route } from 'react-router-dom';
import { ProductsPage, ProductEditPage } from '../../modules/Product/pages';
import { CategoriesPage } from '../../modules/Category/pages';
import { BrandsPage } from '../../modules/Brand/pages';

export const InventoryRoutes = (
    <Fragment>
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/:id" element={<ProductEditPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="brands" element={<BrandsPage />} />
    </Fragment>
);