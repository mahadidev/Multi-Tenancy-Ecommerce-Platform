import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { themes } from "../env";
import { useFetchThemeQuery } from "../store/reducers/themeApi";
import Page from "./pages/page";

export default function App() {
    const theme = themes["avasta"];
    const { data: themeResponse, isLoading } = useFetchThemeQuery(theme.slug);
    const [themeData, setThemeData] = useState<any | null>(null);

    useEffect(() => {
        if (themeResponse) {
            setThemeData(themeResponse.data.theme);
            console.log(themeResponse.data.theme);
        }
    }, [isLoading, themeResponse]);

    return (
        <main className="bg-gray-100 min-h-screen">
            {themeResponse ? (
                <>
                    <BrowserRouter basename={`/themes/${theme.slug}`}>
                        <Routes>
                            {themeData?.pages.map(
                                (page: any, index: number) => (
                                    <Route
                                        key={index}
                                        index
                                        path={page.slug}
                                        element={
                                            <Page data={page} key={index} />
                                        }
                                    />
                                )
                            )}
                        </Routes>
                    </BrowserRouter>
                </>
            ) : (
                <>{isLoading && "loading.."}</>
            )}
        </main>
    );
}
