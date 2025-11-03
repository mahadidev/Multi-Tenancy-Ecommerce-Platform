/* eslint-disable react-hooks/exhaustive-deps */
import useStore from '@site/hooks/useStore';
import { PageType } from '@type/pageType';
import { FC, useEffect } from 'react';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import Page from './pages';
import { SITE_SLUG } from './site_env';

const App: FC = function () {
	const { store, fetchStore } = useStore();

	return (
		<>
			<BrowserRouter basename={`/sites/${SITE_SLUG}`}>
				<Routes>
					<Route 
						index 
						element={
							<div className="min-h-screen flex items-center justify-center bg-gray-50">
								<div className="text-center">
									<h1 className="text-2xl font-bold text-gray-900 mb-4">
										Site Unavailable
									</h1>
									<p className="text-gray-600">
										Theme system has been removed. Site functionality is no longer available.
									</p>
								</div>
							</div>
						} 
					/>
				</Routes>
			</BrowserRouter>
		</>
	);
};

export default App;
