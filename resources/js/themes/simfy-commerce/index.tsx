import store from "@/themes/store";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./app";
import "./app.css";
import { theme } from "./env";

if (document.getElementById(theme.slug)) {
    createRoot(document.getElementById(theme.slug)!).render(
        <Provider store={store}>
            <StrictMode>
                <App />
            </StrictMode>
        </Provider>
    );
}
