import { PageType } from "@/types/pageType";
import { FC } from "react";
import Component from "../components";

const Page:FC<PageType> = function (page) {
  return (
		<>
			{page.widgets?.map((widget: any, index: number) => (
				<>
					<Component {...widget} key={index} />
				</>
			))}
		</>
	);
}
export default Page
