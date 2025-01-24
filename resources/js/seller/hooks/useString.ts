const useString = () => {
    const getSlug = (text: string) => {
        return text
            .toLowerCase()
            .replace(/ /g, "-")
            .replace(/[^\w-]+/g, "");
    };

    return { getSlug };
};

export default useString;
