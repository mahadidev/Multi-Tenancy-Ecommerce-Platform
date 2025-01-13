import store from "@/themes/store";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { themes } from "../env";
import App from "./app";
import "./app.css";

if (document.getElementById(themes["avasta"].slug)) {
    createRoot(document.getElementById(themes["avasta"].slug)!).render(
        <Provider store={store}>
            <StrictMode>
                <App />
            </StrictMode>
        </Provider>
    );
}
