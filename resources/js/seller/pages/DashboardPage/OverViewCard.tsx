import { DashboardStatsType } from "./DashboardPage";

interface OverViewCardProps {
    stat: DashboardStatsType;
}

const OverViewCard: React.FC<OverViewCardProps> = ({ stat }) => {
    return (
        <div className="flex items-center bg-[#2B384E] px-4 py-5 rounded-md cursor-pointer gap-5 shadow-2xl">
            <div className="w-[3.75rem] h-[3.75rem] flex justify-center items-center bg-[#1F2937] text-[#d0bfff] rounded-[.5rem]">
                {stat?.icon}
            </div>
            <div>
                <div className="text-white text-3xl font-bold leading-[1.55]">
                    {stat?.value}
                </div>
                <div></div>
                <div className="text-[1.3rem] text-[#a4a4a8] font-medium">
                    {stat?.title}
                </div>
            </div>
        </div>
    );
};

export default OverViewCard;
