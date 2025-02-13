import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import useStore from './_helper/hooks/useStore';
import useTheme from './_helper/hooks/useTheme';
import { THEME_SLUG } from './_helper/theme_env';
import Page from './page';
import { registeredTheme } from './registeredTheme';

const App = () => {
	const { fetchTheme, theme } = useTheme();
	const { store } = useStore();

	return (
		<>
			<BrowserRouter basename={`/themes/${THEME_SLUG}`}>
				{theme && store ? (
					<Routes>
						{theme.pages.map((page) => (
							<>
								<Route
									key={page.id}
									path="/"
									element={
										<>
											{page.layout ? registeredTheme[theme.name] ? (
												registeredTheme[theme.name]?.layout({
													store: store,
													layout: page.layout,
												})
											) : (
												<h1>Layout not found.</h1>
											) : <Outlet />}
										</>
									}
								>
									<Route
										path={page.type.type === 'home' ? '/' : page.slug}
										index
										element={<Page store={store} theme={theme} page={page} />}
									/>
								</Route>
							</>
						))}
					</Routes>
				) : (
					<>
						{fetchTheme.isLoading ? (
							<h1>Loading</h1>
						) : (
							<h1>"{THEME_SLUG}" theme Not found</h1>
						)}
					</>
				)}
			</BrowserRouter>
		</>
	);
};
export default App;
