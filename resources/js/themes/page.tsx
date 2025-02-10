import { PageType } from '@type/pageType';
import { StoreType } from '@type/storeType';
import { ThemeType } from '@type/themeType';
import { FC } from 'react';
import { registerdTheme } from './registeredTheme';

const Page: FC<{
	page: PageType;
	theme: ThemeType;
    store: StoreType
}> = function ({ page, store, theme }) {
	return (
		<>
			{page.widgets.map((widget) =>
				registerdTheme[theme.name]?.widget({
					widget: widget,
					store: store,
				})
			)}
		</>
	);
};
export default Page;
