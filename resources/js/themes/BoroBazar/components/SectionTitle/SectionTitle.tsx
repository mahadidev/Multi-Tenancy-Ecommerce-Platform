import { FC } from "react";

interface SectionTitlePropsType {
    title: string;
    tagline?: string;
    position?: string;
}

const SectionTitle: FC<SectionTitlePropsType> = ({
    title,
    tagline,
    position = "center",
}) => {
    return (
        <div
            className={`-mt-1.5 text-${position} pb-2 lg:pb-3 xl:pb-4 3xl:pb-7`}
        >
            <h2 className="text-brand-dark text-lg lg:text-xl xl:text-[22px] xl:leading-8 font-bold font-mono 3xl:text-[25px] 3xl:leading-9">
                {title}
            </h2>{" "}
            <p className="text-brand-muted text-sm leading-7 lg:text-15px xl:text-base pb-0.5 mt-1.5 lg:mt-2.5 xl:mt-3">
                {tagline}
            </p>
        </div>
    );
};

export default SectionTitle;
