import { dummyStore } from "@themes/dummyData/dummyStore";
import { PageType } from "@type/pageType";
import { FC } from "react";
import { Component } from "../components";

const Page:FC<PageType> = function (page) {

  return (
		<>
			{page.widgets?.map((widget: any, index: number) => (
				<>
					<Component store={dummyStore} widget={widget} key={index} />
				</>
			))}
		</>
	);
}
export default Page
