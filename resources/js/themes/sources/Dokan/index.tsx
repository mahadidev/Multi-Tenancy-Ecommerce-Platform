import store from '@themes/store/store';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './app';
import './app.css';
import { DOKAN_SLUG } from './donan_env';

if (document.getElementById(DOKAN_SLUG)) {
	createRoot(document.getElementById(DOKAN_SLUG)!).render(
		<Provider store={store}>
			<StrictMode>
				<App />
			</StrictMode>
		</Provider>
	);
}
