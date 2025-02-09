import useAuth from "./useAuth";
import useUser from "./useUser";

const useHook = () => {
	return {
		useAuth: useAuth,
		useUser: useUser,
	};
};
export default useHook;
