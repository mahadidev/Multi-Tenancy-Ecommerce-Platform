import { Fragment } from 'react';
import { Route } from 'react-router-dom';
import { PageEditPage } from '../../modules/Page/pages';
import { OrderPlacerPage } from '../../modules/CartOrderPlacer/pages';
import { EditorLayout, OrderPlacerLayout } from '../../components';

export const EditorRoutes = (
    <Fragment>
        {/* Editor Layout */}
        <Route path="/" element={<EditorLayout />}>
            <Route path="pages/:id" element={<PageEditPage />} />
        </Route>

        {/* Order Placer Layout */}
        <Route path="/" element={<OrderPlacerLayout />}>
            <Route path="/order-placer" element={<OrderPlacerPage />} />
        </Route>
    </Fragment>
);