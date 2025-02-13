import { ThemeLayoutPropsType } from '@type/themeType';
import React, { FC } from 'react';

const Layout: FC<ThemeLayoutPropsType> = (props) => {
	const layouts: {
		[Key: string]: React.ReactNode;
	} = {};

	return (
		<>
			{layouts[props.layout.name] ?? (
				<h1>{props.layout.name} Layout not found</h1>
			)}
		</>
	);
};
export default Layout;
