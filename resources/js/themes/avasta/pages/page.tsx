import Component from "../components";

const Page = ({ data }: { data: any }) => {
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

export default Page;
