import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { themes } from "../env";
import { useFetchThemeQuery } from "../store/reducers/themeApi";
import Other from "./pages/other";

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
        <>
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
                                            <Other data={page} key={index} />
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
        </>
    );
}
