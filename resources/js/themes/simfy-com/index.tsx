import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { themes } from "../env";
import App from "./app";
import "./app.css";

if (document.getElementById(themes["simfy-com"].slug)) {
    createRoot(document.getElementById(themes["simfy-com"].slug)!).render(
        <StrictMode>
            <App />
        </StrictMode>
    );
}
