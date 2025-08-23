import { Fragment } from 'react';
import { Route } from 'react-router-dom';
import { CustomersPage } from '../../modules/Customer/pages';
import { OrdersPage, OrdersShipmentPage } from '../../modules/Order/pages';

export const SalesRoutes = (
    <Fragment>
        <Route path="orders" element={<OrdersPage />} />
        <Route path="shipment-orders" element={<OrdersShipmentPage />} />
        <Route path="customers" element={<CustomersPage />} />
    </Fragment>
);