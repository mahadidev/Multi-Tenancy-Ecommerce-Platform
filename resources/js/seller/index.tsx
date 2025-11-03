import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import App from "./app";
import "./app.css";
import { persistor, store } from "./store/store";

createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
        <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
            <StrictMode>
                <App />
            </StrictMode>
        </PersistGate>
    </Provider>
);
