import useTheme from '@/themes/hooks/useTheme';
import { PageType } from '@/types/pageType';
import { FC } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppLayout from './components/Layouts/AppLayout/AppLayout';
import Page from './pages';

const App: FC = function () {
	const { theme, fetchTheme } = useTheme();

	return (
		<>
			<BrowserRouter basename={`/themes/simfy-commerce`}>
				{theme ? (
					<>
						<Routes>
							{theme.pages.length > 0 ? (
								theme?.pages.map((page: PageType, index: number) => {
									return (
										<Route path="/" element={<AppLayout />}>
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
					<>{fetchTheme.isLoading && 'loading..'}</>
				)}
			</BrowserRouter>
		</>
	);
};

export default App;
