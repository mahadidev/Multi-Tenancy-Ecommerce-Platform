/* eslint-disable react-hooks/exhaustive-deps */
import useWidget from '@seller/_hooks/useWidget';
import { PageType } from '@type/pageType';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usePage } from '../../hooks';
import AddWidgetModal from './AddWidgetModal';

const PageEditPage = () => {
	const { fetchPage } = usePage();
	useWidget();
	const { id } = useParams();

	useEffect(() => {
		if (id) {
			fetchPage.submit({
				formData: {
					id: id,
				},
                onSuccess: (data: {
                    page: PageType
                }) => {
                    console.log("page", data)
                }
			});
		}
	}, [id]);

	return (
		<div className="space-y-4">
			<div className="bg-white p-8">
				<div className="flex items-center justify-center py-12">
					<div className="text-center">
						<h2 className="text-xl font-medium text-gray-800 dark:text-white mb-4">
							Page Editor
						</h2>
						<p className="text-gray-500 dark:text-gray-400">
							Theme system has been removed. Page editing functionality is no longer available.
						</p>
					</div>
				</div>
			</div>

			<AddWidgetModal />
		</div>
	);
};
export default PageEditPage;
