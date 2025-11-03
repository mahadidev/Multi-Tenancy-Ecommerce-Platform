import useHook from '@site/hooks';
import useStore from '@site/hooks/useStore';
import { PageType } from '@type/pageType';
import { FC } from 'react';

const Page: FC<PageType> = function (page) {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="text-center">
				<h1 className="text-2xl font-bold text-gray-900 mb-4">
					Page Unavailable
				</h1>
				<p className="text-gray-600">
					Theme system has been removed. Page rendering is no longer available.
				</p>
			</div>
		</div>
	);
};
export default Page;
