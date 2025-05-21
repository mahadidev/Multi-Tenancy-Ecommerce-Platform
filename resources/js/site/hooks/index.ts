import useAuth from "./useAuth";

const useHook = () => {
	return {
		useAuth: useAuth,
		// useUser: useUser,
        // useCart: useCart,
	};
};
export default useHook;
