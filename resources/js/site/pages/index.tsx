import useHook from '@site/hooks';
import useStore from '@site/hooks/useStore';
import { registerdTheme } from '@themes/registeredTheme';
import { PageType } from '@type/pageType';
import { FC } from 'react';

const Page: FC<PageType> = function (page) {
	const { store } = useStore();
    const hooks = useHook();

	return (
		<>
			{page.widgets
				.slice()
				.sort(function (widgetA, widgetB) {
					return widgetA.serial - widgetB.serial;
				})
				.map((widget) => (
					<>{store && store.theme && registerdTheme[store.theme.name]?.widget({
                        widget: widget,
                        store: store,
                        hooks: hooks
                    })}</>
				))}
		</>
	);
};
export default Page;
