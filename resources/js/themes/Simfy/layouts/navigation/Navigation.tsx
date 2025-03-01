import { ThemeLayoutPropsType } from "@type/themeType";
import { Button, Navbar } from "flowbite-react";
import { FC } from "react";
import { Link } from "react-router-dom";

const Navigation:FC<ThemeLayoutPropsType> = ({store}) => {
  return (
		<Navbar fluid className="light">
			<Navbar.Brand as={Link} to="/">
				<img
					src={store.logo}
					className="mr-3 h-6 sm:h-9"
					alt="Flowbite React Logo"
				/>
			</Navbar.Brand>
			<div className="flex md:order-2">
				<Button>Get started</Button>
				<Navbar.Toggle />
			</div>
			<Navbar.Collapse>
				<Navbar.Link href="#" active>
					Home
				</Navbar.Link>
				<Navbar.Link href="#">About</Navbar.Link>
				<Navbar.Link href="#">Services</Navbar.Link>
				<Navbar.Link href="#">Pricing</Navbar.Link>
				<Navbar.Link href="#">Contact</Navbar.Link>
			</Navbar.Collapse>
		</Navbar>
	);
}
export default Navigation
