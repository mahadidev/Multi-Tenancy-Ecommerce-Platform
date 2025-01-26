/* eslint-disable react-hooks/exhaustive-deps */
import GetComponent from '@/themes/getComponent';
import usePage from '@seller/hooks/usePage';
import useStore from '@seller/hooks/useStore';
import useTheme from '@seller/hooks/useTheme';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AddWidgetModal from './AddWidgetModal';

const PageEditPage = () => {
	const { page, fetchPage } = usePage();
	const { theme } = useTheme();
	const { store } = useStore();
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
			<div className="bg-white">
				{store &&
					theme &&
					page?.widgets.map((widget) => (
						<>
							<GetComponent store={store} widget={widget} theme={theme} />
						</>
					))}
			</div>

			<AddWidgetModal />
		</>
	);
};
export default PageEditPage;
