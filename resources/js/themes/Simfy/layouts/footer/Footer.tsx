import { ThemeLayoutPropsType } from "@type/themeType";
import { Footer as FR_Footer } from 'flowbite-react';
import { FC } from "react";

const Footer:FC<ThemeLayoutPropsType> = () => {
  return (
		<FR_Footer container className="rounded-none">
			<FR_Footer.Copyright href="#" by="Flowbite™" year={2022} />
			<FR_Footer.LinkGroup>
				<FR_Footer.Link href="#">About</FR_Footer.Link>
				<FR_Footer.Link href="#">Privacy Policy</FR_Footer.Link>
				<FR_Footer.Link href="#">Licensing</FR_Footer.Link>
				<FR_Footer.Link href="#">Contact</FR_Footer.Link>
			</FR_Footer.LinkGroup>
		</FR_Footer>
	);
}
export default Footer
