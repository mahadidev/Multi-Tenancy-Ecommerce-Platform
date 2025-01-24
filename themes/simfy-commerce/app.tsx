/* eslint-disable react-hooks/exhaustive-deps */
import { StorePageType } from '@/seller/types';
import useTheme from '@seller-panel/hooks/useTheme';
import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppLayout from './components/Layouts/AppLayout';
import { theme as themeEnv } from './env';
import Page from './pages/page';

export default function App() {
	const { fetchThemeBySlugOrId, theme } = useTheme();
	// fetch theme
	useEffect(() => {
		fetchThemeBySlugOrId.submit({
			formData: {
				idOrSlug: themeEnv.slug,
			},
		});
	}, []);

	return (
		<BrowserRouter basename={`/themes/simfy-commerce`}>
			{theme ? (
				<>
					<Routes>
						<Route path="/" element={<AppLayout />}>
							{theme.pages.length > 0 ? (
								theme?.pages.map((page: StorePageType, index: number) => (
									<Route
										key={index}
										path={page.type.type === 'home' ? '/' : page.slug}
										index
										element={<Page data={page} key={index} />}
									/>
								))
							) : (
								<Route index element={<h1>No page created.</h1>} />
							)}
						</Route>
					</Routes>
				</>
			) : (
				<>{fetchThemeBySlugOrId.isLoading && 'loading..'}</>
			)}
		</BrowserRouter>
	);
}
