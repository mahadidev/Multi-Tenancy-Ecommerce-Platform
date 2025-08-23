import { Fragment } from 'react';
import { Route } from 'react-router-dom';
import { DashboardPage } from '../../modules/Dashboard/pages';
import { StockReportPage } from '../../modules/StockReport/pages';

export const DashboardRoutes = (
    <Fragment>
        <Route path="/" element={<DashboardPage />} />
        <Route path="stock-report" element={<StockReportPage />} />
    </Fragment>
);