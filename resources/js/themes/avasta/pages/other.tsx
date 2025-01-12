import Component from "../components";

const Other = ({ data }: { data: any }) => {
    return (
        <>
            {data.page_widgets.map((widget: any, index: number) => (
                <>
                    <Component data={widget} key={index} />
                </>
            ))}
        </>
    );
};

export default Other;
