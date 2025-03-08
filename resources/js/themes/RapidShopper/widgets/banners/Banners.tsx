import { ThemeWidgetPropsType } from "@type/themeType";
import { FC } from "react";

const BannersSection: FC<ThemeWidgetPropsType> = ({ widget }) => {
    return (
        <section className="px-4 lg:px-0 py-4 my-3 lg:my-7">
            <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 xl:gap-5">
                {widget.inputs.map((input, index) => (
                    <div key={index} className="group overflow-hidden">
                        <img
                            src={input?.value}
                            alt="Promo Banner"
                            width={400}
                            height={400}
                            className="w-full group-hover:scale-105 transition-all"
                        />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default BannersSection;
