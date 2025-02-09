import { useAppSelector } from "../store/store"

const useStore = () => {
    const {store} = useAppSelector((state) => state.store)

    return {store}
}
export default useStore
