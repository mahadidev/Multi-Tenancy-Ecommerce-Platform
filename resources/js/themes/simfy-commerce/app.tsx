import { StorePageType, ThemeType } from "@/seller/types";
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useFetchThemeQuery } from "../store/reducers/themeApi";
import { theme } from "./env";
import Page from "./pages/page";

export default function App() {
    const { data: themeResponse, isLoading } = useFetchThemeQuery(theme.slug);
    const [themeData, setThemeData] = useState<ThemeType | null>(null);

    useEffect(() => {
        if (themeResponse) {
            setThemeData(themeResponse.data.theme);
        }
    }, [isLoading, themeResponse]);

    return (
        <main className="bg-gray-100 min-h-screen">
            <BrowserRouter basename={`/themes/simfy-commerce`}>
                {themeData ? (
                    <>
                        <Routes>
                            {themeData.pages.length > 0 ? (
                                themeData?.pages.map(
                                    (page: StorePageType, index: number) => (
                                        <Route
                                            key={index}
                                            path={
                                                page.type.type === "home"
                                                    ? "/"
                                                    : page.slug
                                            }
                                            index
                                            element={
                                                <Page data={page} key={index} />
                                            }
                                        />
                                    )
                                )
                            ) : (
                                <Route
                                    index
                                    element={<h1>No page created.</h1>}
                                />
                            )}
                        </Routes>
                    </>
                ) : (
                    <>{isLoading && "loading.."}</>
                )}
            </BrowserRouter>
        </main>
    );
}
