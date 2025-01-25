import { WidgetType } from "@/seller/types";
import { FC } from "react";
import HeroSection from "./HeroSection/HeroSection";
import OffersSection from "./OffersSection/OffersSection";

const Component: FC<WidgetType> = function (props) {
	const components: any = {
		hero: <HeroSection {...props} />,
		offers: <OffersSection {...props} />,
	};

	return (
		<>
			{components[props.name]
				? components[props.name]
				: `Please create the ${props.name} component in react.`}
		</>
	);
};

export default Component;
