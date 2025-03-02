/* eslint-disable react-hooks/exhaustive-deps */
import useStore from '@site/hooks/useStore';
import useColor from '@themes/_helper/hooks/useColor';
import { registeredTheme } from '@themes/registeredTheme';
import { PageType } from '@type/pageType';
import { FC, useEffect } from 'react';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import Page from './pages';
import { SITE_SLUG } from './site_env';

const App: FC = function () {
	const { store, fetchStore } = useStore();
    const {setColorShade} = useColor();

	useEffect(() => {
		if (store && store.theme) {
			setColorShade({
                name: "primary",
                "color": store.primary_color ?? store.theme.primary_color
            });
		}
	}, [store]);

	return (
		<>
			<BrowserRouter basename={`/sites/${SITE_SLUG}`}>
				{store && store.theme ? (
					<>
						<Routes>
							{store.pages?.length > 0 ? (
								store?.pages?.map((page: PageType, index: number) => {
									return (
										<Route
											path="/"
											element={
												<>
													{page.layout && store.theme ? (
														registeredTheme[store.theme.name] ? (
															registeredTheme[store.theme.name]?.layout({
																store: store,
																layout: page.layout,
															})
														) : (
															<h1>Layout not found.</h1>
														)
													) : (
														<Outlet />
													)}
												</>
											}
										>
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
