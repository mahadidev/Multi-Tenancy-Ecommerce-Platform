/* eslint-disable react-hooks/exhaustive-deps */
import usePage from '@seller/hooks/usePage';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AddWidgetModal from './AddWidgetModal';

const PageEditPage = () => {
	const { page, fetchPage } = usePage();
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
			{page?.widgets.map((widget) => (
				<div>{widget.name}</div>
			))}

			<AddWidgetModal />
		</>
	);
};
export default PageEditPage;
