import { FC } from "react";

interface SectionTitlePropsType {
    title: string;
    tagline?: string;
}

const SectionTitle: FC<SectionTitlePropsType> = ({ title, tagline }) => {
    return (
        <div className={`-mt-1.5 text-left pb-2 lg:pb-3 xl:pb-4 3xl:pb-7`}>
            <h2 className="text-brand-dark text-lg lg:text-xl xl:text-[22px] font-bold 3xl:text-[25px]">
                {title}
            </h2>{" "}
            <p className="text-brand-muted text-sm leading-7 lg:text-15px xl:text-base pb-0.5 xl:mt-3">
                {tagline}
            </p>
        </div>
    );
};

export default SectionTitle;
