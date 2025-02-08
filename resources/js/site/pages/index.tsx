import useHook from '@site/hooks';
import useStore from '@site/hooks/useStore';
import GetComponent from '@themes/getComponent';
import { PageType } from '@type/pageType';
import { FC } from 'react';

const Page: FC<PageType> = function (page) {
	const { store } = useStore();
    const {auth} = useHook()

	return (
		<>
			{page.widgets
					.slice()
					.sort(function (widgetA, widgetB) {
						return widgetA.serial - widgetB.serial;
					})
					.map((widget) => (
						<>
							{store && store.theme && (
								<GetComponent
									store={store}
									widget={widget}
									theme={store.theme}
                                    hooks={{
                                        auth: auth
                                    }}
								/>
							)}
						</>
					))}
		</>
	);
};
export default Page;
