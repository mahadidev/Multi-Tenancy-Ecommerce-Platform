import { StorePageType } from "@/seller/types";
import Component from "../components";

const Page = ({ data }: { data: StorePageType }) => {
    return (
			<>
				{data.widgets?.map((widget: any, index: number) => (
					<>
						<Component {...widget} key={index} />
					</>
				))}
			</>
		);
};

export default Page;
