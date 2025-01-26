import { customTheme } from '@seller/theme';
import { Flowbite } from 'flowbite-react';
import React, { FC } from 'react';

interface BaseLayoutProps {
	children: React.ReactNode;
}

const BaseLayout: FC<BaseLayoutProps> = function (props) {
	return (
		<>
			<Flowbite theme={{ theme: customTheme }}>{props.children}</Flowbite>
		</>
	);
};

export default BaseLayout;
