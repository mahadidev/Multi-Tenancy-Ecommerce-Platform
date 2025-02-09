import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
		<>
			<main className="bg-gray-100">
				<Outlet />
			</main>
		</>
	);
}
export default AppLayout
