import { ThemeLayoutPropsType } from '@type/themeType';
import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '../footer/Footer';
import Navigation from '../navigation/Navigation';

const AppLayout: FC<ThemeLayoutPropsType> = (props) => {
	return (
		<main>
			<Navigation {...props} />
			<Outlet />
			<Footer {...props} />
		</main>
	);
};
export default AppLayout;
