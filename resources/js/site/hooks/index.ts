import useAuth from "./useAuth";

const useHook = () => {
	const authHook = useAuth();

	return {
		auth: authHook,
	};
};
export default useHook;
