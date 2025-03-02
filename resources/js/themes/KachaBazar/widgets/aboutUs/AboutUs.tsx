import { ThemeWidgetPropsType } from "@type/themeType";
import { FC } from "react";

const AboutUsSection: FC<ThemeWidgetPropsType> = ({ widget }) => {
    return (
        <>
            {
                /* title */
                widget.inputs.find((input) => input.name === "title") && (
                    <h1>
                        {
                            widget.inputs.find(
                                (input) => input.name === "title"
                            )?.value
                        }
                    </h1>
                )
            }

            {
                /* description */
                widget.inputs.find((input) => input.name === "description") && (
                    <h1>
                        {
                            widget.inputs.find(
                                (input) => input.name === "description"
                            )?.value
                        }
                    </h1>
                )
            }
        </>
    );
};
export default AboutUsSection;
