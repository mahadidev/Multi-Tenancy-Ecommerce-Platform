/* eslint-disable react-hooks/exhaustive-deps */
import GetComponent from '@/themes/getComponent';
import usePage from '@seller/hooks/usePage';
import useStore from '@seller/hooks/useStore';
import useTheme from '@seller/hooks/useTheme';
import { Button } from 'flowbite-react';
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
		<div className="space-y-4">
			<div className="bg-white">
				{store &&
					theme &&
					page?.widgets.map((widget) => (
						<div className="w-full h-max relative">
							<GetComponent store={store} widget={widget} theme={theme} />

							<div className="absolute top-0 left-0 right-0 w-full h-full bg-gray-900/75 z-30 opacity-0 hover:opacity-100 transition-all duration-300 flex justify-center items-center gap-2.5 cursor-grab">
								<Button color="red">Delete</Button>
								<Button color="primary">Edit {widget.label}</Button>
							</div>
						</div>
					))}
			</div>

			<AddWidgetModal />
		</div>
	);
};
export default PageEditPage;
