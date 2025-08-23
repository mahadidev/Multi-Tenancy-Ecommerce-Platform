import { Fragment } from 'react';
import { Route } from 'react-router-dom';
import { ExpensePage, VendorsPage } from '../../modules/Expense/pages';

export const FinanceRoutes = (
    <Fragment>
        <Route path="expenses" element={<ExpensePage />} />
        <Route path="vendors" element={<VendorsPage />} />
    </Fragment>
);