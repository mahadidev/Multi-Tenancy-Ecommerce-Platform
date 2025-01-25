import useTheme from "@seller-panel/hooks/useTheme";
import { FC, useEffect } from "react";

const ThemesPage:FC = function ()  {
    const {theme, fetchThemeBySlugOrId} = useTheme();

    useEffect(() => {
        fetchThemeBySlugOrId.submit({
					formData: {
						idOrSlug: 'simfy-commerce',
					},
				});
    }, [])

    useEffect(() => {
        console.log(theme)
    }, [theme])
  return (
    <div>ThemesPage</div>
  )
}
export default ThemesPage
