import { Fragment } from 'react';
import { Route } from 'react-router-dom';
import { 
    BlogsPage, 
    BlogCategories, 
    BlogCreatePage, 
    BlogEditPage 
} from '../../modules/Blog/pages';
import { PagesPage } from '../../modules/Page/pages';
import { MenusPage } from '../../modules/Menu/pages';

export const ContentRoutes = (
    <Fragment>
        <Route path="blogs" element={<BlogsPage />} />
        <Route path="blogs/categories" element={<BlogCategories />} />
        <Route path="blogs/create" element={<BlogCreatePage />} />
        <Route path="blogs/:id" element={<BlogEditPage />} />
        <Route path="pages" element={<PagesPage />} />
        <Route path="menus" element={<MenusPage />} />
    </Fragment>
);