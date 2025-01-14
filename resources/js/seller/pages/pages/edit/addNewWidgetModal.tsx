import { useAppSelector } from "@/seller/store";
import {
    useFetchPageQuery,
    useUpdatePageMutation,
} from "@/seller/store/reducers/pageApi";
import { useFetchThemeQuery } from "@/seller/store/reducers/themeApi";
import { Button, Label, Modal, Select } from "flowbite-react";
import { useState } from "react";
import { useParams } from "react-router-dom";

export default function AddNewWidgetModal() {
    const params = useParams();
    const { id } = params;

    const { currentStore: store } = useAppSelector((state) => state.store);
    const [openModal, setOpenModal] = useState(false);
    const { data: themeResponse } = useFetchThemeQuery(store.theme_id);
    const { data: pageResponse } = useFetchPageQuery({
        pageId: id ? id : "0",
        storeId: store.id,
    });
    const [type, setType] = useState<string>("home");
    const [selectedWidgets, setSelectedWidgets] = useState<any[]>([]);

    const [updatePage] = useUpdatePageMutation();

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        item: any
    ) => {
        setSelectedWidgets((prev) => {
            if (event.target.checked) {
                return [...prev, item];
            } else {
                return [...prev.filter((prevItem) => prevItem.id !== item.id)];
            }
        });
    };

    const handleOnAddWidget = () => {
        if (id) {
            updatePage({
                storeId: store.id,
                pageId: id,
                formData: {
                    ...pageResponse.data.page,
                    widgets: [
                        ...pageResponse.data.page.widgets.map((item: any) => {
                            return item;
                        }),
                        ...selectedWidgets.map((item: any) => {
                            return item;
                        }),
                    ],
                },
            }).then((response: any) => {
                console.log("yes", response);
                if (response.data.status == 200) {
                    setOpenModal(false);
                    setSelectedWidgets([]);
                }
            });
        }
    };

    return (
        <>
            <div
                className="h-24 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 md:h-32 flex justify-center items-center hover:bg-gray-200 hover:dark:bg-gray-800 cursor-pointer"
                onClick={() => setOpenModal(true)}
            >
                <p className="text-2xl text-gray-400 dark:text-gray-500">
                    <svg
                        className="w-3.5 h-3.5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 18 18"
                    >
                        <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 1v16M1 9h16"
                        />
                    </svg>
                </p>
            </div>{" "}
            <Modal
                show={openModal}
                onClose={() => setOpenModal(false)}
                size="7xl"
            >
                <Modal.Header>Terms of Service</Modal.Header>
                <Modal.Body className="space-y-6">
                    <div className="max-w-md">
                        <div className="mb-2 block">
                            <Label htmlFor="type" value="Page Type" />
                        </div>
                        <Select
                            id="type"
                            required
                            onChange={(
                                event: React.ChangeEvent<HTMLSelectElement>
                            ) => setType(event.target.value)}
                        >
                            <option value={"home"}>Home</option>
                            <option value={"about"}>About</option>
                            <option value={"contact"}>Contact</option>
                        </Select>
                    </div>
                    <ul className="grid w-full gap-6 md:grid-cols-4">
                        {themeResponse?.data.theme.pages
                            .find((item: any) => item.type == type)
                            ?.widgets?.map((item: any, index: number) => (
                                <li key={index}>
                                    <input
                                        name="widget"
                                        type="checkbox"
                                        id={item.id}
                                        value={item.id}
                                        className="hidden peer"
                                        required
                                        defaultChecked={
                                            selectedWidgets.find(
                                                (widget) =>
                                                    widget.id === item.id
                                            )
                                                ? true
                                                : false
                                        }
                                        onChange={(
                                            event: React.ChangeEvent<HTMLInputElement>
                                        ) => {
                                            handleChange(event, item);
                                        }}
                                    />
                                    <label
                                        htmlFor={item.id}
                                        className="inline-flex items-center justify-between w-full text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600
                                        peer-checked:bg-gray-50
                                        peer-checked:dark:bg-gray-700
                                        hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700 overflow-hidden"
                                    >
                                        <div className="block w-full">
                                            {item.thumbnail && (
                                                <img
                                                    className="w-full block"
                                                    src={item.thumbnail}
                                                    alt={item.label}
                                                />
                                            )}
                                            <div className="w-full p-2.5">
                                                <p className="text-center">
                                                    {item.label}
                                                </p>
                                            </div>
                                        </div>
                                    </label>
                                </li>
                            ))}
                    </ul>
                </Modal.Body>
                <Modal.Footer className="justify-end">
                    <Button color="gray" onClick={() => setOpenModal(false)}>
                        Cancel
                    </Button>
                    <Button
                        color="blue"
                        onClick={() => handleOnAddWidget()}
                        disabled={selectedWidgets.length === 0}
                    >
                        Add Widget
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
