/* eslint-disable react-hooks/exhaustive-deps */
import GetComponent from '@/themes/getComponent';
import usePage from '@seller/hooks/usePage';
import useTheme from '@seller/hooks/useTheme';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AddWidgetModal from './AddWidgetModal';

const PageEditPage = () => {
	const { page, fetchPage } = usePage();
	const { theme } = useTheme();
	const { id } = useParams();

	useEffect(() => {
		if (id) {
			fetchPage.submit({
				formData: {
					id: id,
				},
			});
		}
	}, [id]);

	return (
		<>
			{theme && page?.widgets.map((widget) => (
				<>
					<GetComponent widget={widget} theme={theme} />
				</>
			))}

			<AddWidgetModal />
		</>
	);
};
export default PageEditPage;
