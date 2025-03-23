import { store } from "@themes/_helper/store/store";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import App from "./app";
import "./tailwind.css";

createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
        <StrictMode>
            <Toaster position="top-right" />
            <App />
        </StrictMode>
    </Provider>
);
