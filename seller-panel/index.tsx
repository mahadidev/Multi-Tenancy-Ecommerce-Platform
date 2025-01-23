import { store } from "@seller-panel/store/store";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./app";
import "./app.css";

createRoot(document.getElementById('root')!).render(
	<Provider store={store}>
		<StrictMode>
			<App />
		</StrictMode>
	</Provider>
);
