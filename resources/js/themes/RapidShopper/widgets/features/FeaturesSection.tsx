import { ThemeWidgetPropsType } from "@type/themeType";
import { FC } from "react";

const FeaturesSection: FC<ThemeWidgetPropsType> = ({ widget }) => {
    return (
        <section className="px-4 lg:px-0 py-4 my-3 lg:my-7">
            <div className="container mx-auto">
                {widget.inputs.find((input) => input.name === "features") && (
                    <div className="container hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 flex-wrap bg-gray-100">
                        {widget?.inputs
                            ?.filter((input) => input?.name === "features")
                            ?.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="flex gap-4 px-4 py-6 group"
                                >
                                    <span className="flex items-center text-4xl text-gray-700 group-hover:text-[#FFC100] transition-all">
                                        {/* {
                                        item.child?.find(
                                            (childItem) =>
                                                childItem.name === "icon"
                                        )?.value
                                    } */}
                                        <svg
                                            stroke="currentColor"
                                            fill="none"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            xmlns="http://www.w3.org/2000 svg"
                                            className="w-10 h-10"
                                        >
                                            <circle cx="7" cy="17" r="2" />
                                            <circle cx="17" cy="17" r="2" />
                                            <path d="M5 17h-2v-4m-1 -8h11v12m-4 0h6m4 0h2v-6h-8m0 -5h5l3 5" />
                                            <line x1="3" y1="9" x2="7" y2="9" />
                                        </svg>
                                    </span>
                                    <div className="w-full">
                                        <h1 className="text-lg font-medium text-gray-700">
                                            {
                                                item.child?.find(
                                                    (childItem) =>
                                                        childItem.name ===
                                                        "title"
                                                )?.value
                                            }
                                        </h1>
                                        <p className="font-normal text-gray-600">
                                            {
                                                item.child?.find(
                                                    (childItem) =>
                                                        childItem.name ===
                                                        "tagline"
                                                )?.value
                                            }
                                        </p>
                                    </div>
                                </div>
                            ))}
                    </div>
                )}
            </div>
        </section>
    );
};
export default FeaturesSection;

// JSON.stringify(
//     item?.child?.[idx]?.value,
//     null,
//     2
// )
{
    /* */
}
