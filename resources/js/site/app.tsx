import useStore from '@site/hooks/useStore';
import { PageType } from '@type/pageType';
import { FC } from 'react';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import Page from './pages';
import { SITE_SLUG } from './site_env';

const App: FC = function () {
	const { store, fetchStore } = useStore();

	return (
		<>
			<BrowserRouter basename={`/sites/${SITE_SLUG}`}>
				{store ? (
					<>
						<Routes>
							{store.pages?.length > 0 ? (
								store?.pages?.map((page: PageType, index: number) => {
									return (
										<Route path="/" element={<Outlet />}>
											<Route
												key={index}
												path={page.type.type === 'home' ? '/' : page.slug}
												index
												element={<Page {...page} key={index} />}
											/>
										</Route>
									);
								})
							) : (
								<Route index element={<h1>No page created.</h1>} />
							)}
						</Routes>
					</>
				) : (
					<>{fetchStore.isLoading && 'loading..'}</>
				)}
			</BrowserRouter>
		</>
	);
};

export default App;
