import store from '@site/store/store';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './app';

if (document.getElementById("root")) {
	createRoot(document.getElementById("root")!).render(
		<Provider store={store}>
			<StrictMode>
				<App />
			</StrictMode>
		</Provider>
	);
}
