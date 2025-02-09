import { BrowserRouter, Route, Routes } from 'react-router-dom';
import useStore from './_helper/hooks/useStore';
import useTheme from './_helper/hooks/useTheme';
import { THEME_SLUG } from './_helper/theme_env';
import Page from './page';
import { registerdTheme } from './registeredTheme';

const App = () => {
	const { fetchTheme, theme } = useTheme();
	const { store } = useStore();

	return (
		<>
			<BrowserRouter basename={`/themes/${THEME_SLUG}`}>
				{theme && store ? (
					<Routes>
						<Route
							path="/"
							element={
								registerdTheme[theme.name]?.layout({
									store: store,
								}) ?? <h1>{theme.name} theme is not registered propertly.</h1>
							}
						>
							{theme.pages.map((page) => (
								<Route
									path={page.slug}
									index
									element={<Page store={store} page={page} theme={theme} />}
								/>
							))}
						</Route>
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
